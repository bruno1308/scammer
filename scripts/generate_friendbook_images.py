#!/usr/bin/env python3
"""
Generate FriendBook images via Meshy API.

Generates:
  1. Profile avatar images for ~56 family/friend characters (text-to-image, 1:1)
  2. Post images for ~38 posts with visual content (text-to-image, 4:3)
  3. Group photos where multiple characters appear together (image-to-image, 4:3)

All art uses MAD Magazine editorial caricature style (exaggerated features, heavy
ink lines, flat watercolor washes, satirical ugly-funny).

Usage:
  python scripts/generate_friendbook_images.py                    # Generate everything
  python scripts/generate_friendbook_images.py --avatars-only     # Only avatars
  python scripts/generate_friendbook_images.py --posts-only       # Only post images
  python scripts/generate_friendbook_images.py --solo-only        # Only solo posts (no group)
  python scripts/generate_friendbook_images.py --group-only       # Only group photos
  python scripts/generate_friendbook_images.py --level 1          # Only level 1
  python scripts/generate_friendbook_images.py --dry-run          # Print prompts, don't submit
  python scripts/generate_friendbook_images.py --summary          # Print status summary
"""

import argparse
import base64
import json
import os
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = PROJECT_ROOT / "public" / "assets"
AVATAR_DIR = ASSETS_DIR / "friendbook" / "avatars"
POST_DIR = ASSETS_DIR / "friendbook" / "posts"
STATUS_FILE = Path(__file__).resolve().parent / "generation_status.json"

MESHY_BASE_URL = "https://api.meshy.ai/openapi/v1"
MODEL = "nano-banana-pro"
POLL_INTERVAL = 6       # seconds between polls
BATCH_SIZE = 10         # max concurrent tasks per batch
BATCH_DELAY = 2         # seconds between batches
MAX_RETRIES = 1         # retry once on failure

# ---------------------------------------------------------------------------
# Style suffixes
# ---------------------------------------------------------------------------

STYLE_SUFFIX = (
    "MAD Magazine editorial caricature, exaggerated features, "
    "heavy ink lines, flat watercolor washes, satirical ugly-funny style"
)
STYLE_SUFFIX_CHILD = (
    "MAD Magazine editorial caricature, cute editorial illustration style, "
    "exaggerated features, heavy ink lines, flat watercolor washes"
)
AVATAR_SUFFIX = (
    "Square portrait, upper body, social media profile photo, "
    "solid colored background"
)
POST_SUFFIX = (
    "MAD Magazine editorial caricature illustration, heavy ink lines, "
    "flat watercolor washes, exaggerated proportions, satirical editorial style"
)


def avatar_prompt(description, style="adult"):
    """Build a full avatar prompt from a description."""
    suffix = STYLE_SUFFIX if style == "adult" else STYLE_SUFFIX_CHILD
    return f"{description}. {suffix}. {AVATAR_SUFFIX}."


def post_prompt(description):
    """Build a full post image prompt from a scene description."""
    return f"{description}. {POST_SUFFIX}."


# ---------------------------------------------------------------------------
# Avatar Manifest -- ALL family/friend profiles that need portraits
# ---------------------------------------------------------------------------

AVATARS = [
    # =======================================================================
    # LEVEL 1 (15 avatars)
    # =======================================================================

    # --- Dorothy Miller's family ---
    {
        "id": "karen_mitchell", "level": 1,
        "texture_key": "fb_l1_karen_mitchell",
        "prompt": avatar_prompt(
            "Karen Mitchell, a 45-year-old woman. Stressed-looking suburban mom "
            "with dark circles under her eyes and a forced cheerful smile. "
            "Marketing manager at Target Corporate. Minneapolis"
        ),
    },
    {
        "id": "mike_mitchell", "level": 1,
        "texture_key": "fb_l1_mike_mitchell",
        "prompt": avatar_prompt(
            "Mike Mitchell, a 47-year-old man. Typical suburban dad with a goofy "
            "dad-joke grin, slightly overweight, polo shirt, IT worker energy. "
            "Minneapolis"
        ),
    },
    {
        "id": "emma_mitchell", "level": 1,
        "texture_key": "fb_l1_emma_mitchell",
        "prompt": avatar_prompt(
            "Emma Mitchell, an 8-year-old girl. Bright-eyed excited little girl "
            "obsessed with unicorns, sparkly accessories, messy pigtails, "
            "missing front tooth",
            style="child"
        ),
    },

    # --- Harold Patterson's family ---
    {
        "id": "richard_patterson", "level": 1,
        "texture_key": "fb_l1_richard_patterson",
        "prompt": avatar_prompt(
            "Richard Patterson, a 49-year-old man. Stocky auto mechanic and shop "
            "owner with grease-stained hands, crew cut, muscular arms. "
            "Phoenix Arizona"
        ),
    },
    {
        "id": "lisa_patterson", "level": 1,
        "texture_key": "fb_l1_lisa_patterson",
        "prompt": avatar_prompt(
            "Lisa Patterson, a 47-year-old woman. Caring practical school nurse, "
            "kind eyes, reading glasses on a chain, sensible haircut. "
            "Phoenix Arizona"
        ),
    },
    {
        "id": "tyler_patterson", "level": 1,
        "texture_key": "fb_l1_tyler_patterson",
        "prompt": avatar_prompt(
            "Tyler Patterson, a 15-year-old teenage boy. Lanky basketball player "
            "with a confident smirk, basketball jersey, earbuds around neck. "
            "Phoenix Arizona"
        ),
    },

    # --- Betty Nakamura's family ---
    {
        "id": "ken_nakamura", "level": 1,
        "texture_key": "fb_l1_ken_nakamura",
        "prompt": avatar_prompt(
            "Ken Nakamura, a 69-year-old Japanese-American man. Retired engineer, "
            "gentle face, reading glasses, model train and woodworking enthusiast. "
            "Portland Oregon"
        ),
    },
    {
        "id": "yuki_nakamura_davis", "level": 1,
        "texture_key": "fb_l1_yuki_nakamura_davis",
        "prompt": avatar_prompt(
            "Yuki Nakamura-Davis, a 38-year-old Japanese-American woman. "
            "Senior process engineer at Intel, confident posture, modern haircut, "
            "professional look. Hillsboro Oregon"
        ),
    },
    {
        "id": "marcus_davis", "level": 1,
        "texture_key": "fb_l1_marcus_davis",
        "prompt": avatar_prompt(
            "Marcus Davis, a 39-year-old Black man. Freelance photographer and "
            "stay-at-home dad, warm smile, camera strap visible, casual flannel "
            "shirt. Portland Oregon"
        ),
    },

    # --- Earl Washington's family ---
    {
        "id": "denise_washington_taylor", "level": 1,
        "texture_key": "fb_l1_denise_washington_taylor",
        "prompt": avatar_prompt(
            "Denise Washington-Taylor, a 43-year-old Black woman. Sharp family "
            "law attorney, professional blazer, confident expression, pearl "
            "earrings. Atlanta Georgia"
        ),
    },
    {
        "id": "jerome_taylor", "level": 1,
        "texture_key": "fb_l1_jerome_taylor",
        "prompt": avatar_prompt(
            "Jerome Taylor, a 44-year-old Black man. Dignified high school "
            "principal, warm authoritative smile, suit and tie, glasses. "
            "Atlanta Georgia"
        ),
    },
    {
        "id": "marcus_taylor", "level": 1,
        "texture_key": "fb_l1_marcus_taylor",
        "prompt": avatar_prompt(
            "Marcus Taylor, a 14-year-old Black teenage boy. Nerdy-cool "
            "robotics enthusiast, bright eyes, graphic tee with robot or "
            "circuit design, braces. Atlanta Georgia"
        ),
    },

    # --- Margaret O'Brien's family ---
    {
        "id": "patrick_obrien", "level": 1,
        "texture_key": "fb_l1_patrick_obrien",
        "prompt": avatar_prompt(
            "Patrick O'Brien, a 55-year-old Irish-American man. Burly Boston "
            "firefighter lieutenant, thick mustache, strong jaw, ruddy red "
            "cheeks, rugged face. Boston Massachusetts"
        ),
    },
    {
        "id": "colleen_obrien", "level": 1,
        "texture_key": "fb_l1_colleen_obrien",
        "prompt": avatar_prompt(
            "Colleen O'Brien, a 49-year-old Irish-American woman. Warm dental "
            "hygienist, friendly motherly face, short auburn hair. "
            "Boston Massachusetts"
        ),
    },
    {
        "id": "baby_fiona_obrien", "level": 1,
        "texture_key": "fb_l1_baby_fiona_obrien",
        "prompt": avatar_prompt(
            "Baby Fiona O'Brien, an adorable 8-month-old baby girl. Chubby "
            "cheeks, wide curious eyes, drooling smile, tiny green hat, "
            "Irish-American baby",
            style="child"
        ),
    },

    # =======================================================================
    # LEVEL 2 (12 avatars)
    # =======================================================================

    # --- David Chen's family ---
    {
        "id": "mei_chen", "level": 2,
        "texture_key": "fb_l2_mei_chen",
        "prompt": avatar_prompt(
            "Mei Chen, a 38-year-old Chinese-American woman. Meticulous senior "
            "accountant and CPA, neat appearance, sharp glasses, organized "
            "professional look. Sacramento California"
        ),
    },
    {
        "id": "brandon_chen", "level": 2,
        "texture_key": "fb_l2_brandon_chen",
        "prompt": avatar_prompt(
            "Brandon Chen, an 11-year-old Chinese-American boy. Energetic "
            "soccer player, sporty, shin guards visible, messy hair, "
            "gap-toothed grin",
            style="child"
        ),
    },
    {
        "id": "lily_chen", "level": 2,
        "texture_key": "fb_l2_lily_chen",
        "prompt": avatar_prompt(
            "Lily Chen, a 66-year-old Chinese-American woman. Warm retired "
            "teacher and proud grandmother, gentle warm face, reading glasses, "
            "floral blouse. Sacramento California"
        ),
    },

    # --- Maria Gonzalez's family ---
    {
        "id": "carlos_gonzalez", "level": 2,
        "texture_key": "fb_l2_carlos_gonzalez",
        "prompt": avatar_prompt(
            "Carlos Gonzalez, a 39-year-old Hispanic man. Stocky refinery "
            "shift supervisor, work boots, mustache, protective but tired "
            "expression. Houston Texas"
        ),
    },
    {
        "id": "sofia_gonzalez", "level": 2,
        "texture_key": "fb_l2_sofia_gonzalez",
        "prompt": avatar_prompt(
            "Sofia Gonzalez, a 7-year-old Hispanic girl. Cute little Girl "
            "Scout with pigtails, bright eyes, missing tooth, crafty "
            "personality",
            style="child"
        ),
    },
    {
        "id": "diego_morales", "level": 2,
        "texture_key": "fb_l2_diego_morales",
        "prompt": avatar_prompt(
            "Diego Morales, a 34-year-old Hispanic man. Passionate immigration "
            "attorney, sharp-dressed in suit with loosened tie, determined "
            "expression. Houston Texas"
        ),
    },

    # --- James Wilson's family ---
    {
        "id": "angela_wilson", "level": 2,
        "texture_key": "fb_l2_angela_wilson",
        "prompt": avatar_prompt(
            "Angela Wilson, a 44-year-old Black woman. Polished well-dressed "
            "real estate agent, big smile, business casual blazer, always "
            "on-the-go energy. Chicago Illinois"
        ),
    },
    {
        "id": "jason_wilson", "level": 2,
        "texture_key": "fb_l2_jason_wilson",
        "prompt": avatar_prompt(
            "Jason Wilson, an 18-year-old Black young man. Athletic high school "
            "senior and track star, lean build, confident posture, track "
            "uniform or hoodie. Chicago Illinois"
        ),
    },
    {
        "id": "tamara_wilson", "level": 2,
        "texture_key": "fb_l2_tamara_wilson",
        "prompt": avatar_prompt(
            "Tamara Wilson, a 41-year-old Black woman. Strong ER nurse, "
            "scrubs visible, caring but exhausted expression, stethoscope "
            "around neck. Chicago Illinois"
        ),
    },

    # --- Priya Patel's family ---
    {
        "id": "raj_patel", "level": 2,
        "texture_key": "fb_l2_raj_patel",
        "prompt": avatar_prompt(
            "Raj Patel, a 41-year-old Indian-American man. Senior software "
            "engineer at a pharmaceutical company, neat beard, glasses, polo "
            "shirt, tech professional. Edison New Jersey"
        ),
    },
    {
        "id": "dev_patel", "level": 2,
        "texture_key": "fb_l2_dev_patel",
        "prompt": avatar_prompt(
            "Dev Patel, a 9-year-old Indian-American boy. Bright chess and "
            "math enthusiast, curious expression, slightly oversized glasses, "
            "studious look",
            style="child"
        ),
    },
    {
        "id": "sunita_patel", "level": 2,
        "texture_key": "fb_l2_sunita_patel",
        "prompt": avatar_prompt(
            "Sunita Patel, a 66-year-old Indian woman. Warm retired bank "
            "teller and grandmother, gentle face, traditional sari hints, "
            "learning FriendBook. Edison New Jersey"
        ),
    },

    # =======================================================================
    # LEVEL 3 (12 avatars)
    # =======================================================================

    # --- Karen Thompson's family ---
    {
        "id": "brian_thompson", "level": 3,
        "texture_key": "fb_l3_brian_thompson",
        "prompt": avatar_prompt(
            "Brian Thompson, a 36-year-old man. Senior software developer, "
            "tech bro with maybe a beard, casual hoodie, glasses, slightly "
            "nerdy patient dad expression. Denver Colorado"
        ),
    },
    {
        "id": "lily_thompson", "level": 3,
        "texture_key": "fb_l3_lily_thompson",
        "prompt": avatar_prompt(
            "Lily Thompson, a 7-year-old girl. Energetic little girl with "
            "messy hair, crayon-stained fingers, loves drawing and Disney "
            "and gymnastics and bugs",
            style="child"
        ),
    },
    {
        "id": "diane_morrison", "level": 3,
        "texture_key": "fb_l3_diane_morrison",
        "prompt": avatar_prompt(
            "Diane Morrison, a 59-year-old woman. Retired librarian, bookish "
            "older woman, silver-streaked hair in a bun, reading glasses, "
            "cardigan. Boulder Colorado"
        ),
    },

    # --- Mike Rodriguez's family ---
    {
        "id": "carmen_rodriguez", "level": 3,
        "texture_key": "fb_l3_carmen_rodriguez",
        "prompt": avatar_prompt(
            "Carmen Rodriguez, a 44-year-old Hispanic woman. Warm dental "
            "hygienist, practical appearance, caring eyes, friendly smile. "
            "Phoenix Arizona"
        ),
    },
    {
        "id": "diego_rodriguez", "level": 3,
        "texture_key": "fb_l3_diego_rodriguez",
        "prompt": avatar_prompt(
            "Diego Rodriguez, an 18-year-old Hispanic young man. Community "
            "college computer science student, hoodie, headphones around neck, "
            "thoughtful expression. Phoenix Arizona"
        ),
    },
    {
        "id": "tony_rodriguez", "level": 3,
        "texture_key": "fb_l3_tony_rodriguez",
        "prompt": avatar_prompt(
            "Tony Rodriguez, a 43-year-old Hispanic man. Tough construction "
            "foreman, hard hat tan line, muscular, proud truck-owner energy. "
            "Tempe Arizona"
        ),
    },

    # --- Susan Lee's family ---
    {
        "id": "david_lee", "level": 3,
        "texture_key": "fb_l3_david_lee",
        "prompt": avatar_prompt(
            "David Lee, a 54-year-old Korean-American man. Senior systems "
            "engineer at Boeing, practical demeanor, woodworking hobbyist, "
            "strong hands, quiet confidence. Seattle Washington"
        ),
    },
    {
        "id": "kevin_lee", "level": 3,
        "texture_key": "fb_l3_kevin_lee",
        "prompt": avatar_prompt(
            "Kevin Lee, a 24-year-old Korean-American man. Young software "
            "developer at Amazon, trendy modern haircut, sneaker enthusiast, "
            "casual but stylish. Seattle Washington"
        ),
    },
    {
        "id": "janet_park", "level": 3,
        "texture_key": "fb_l3_janet_park",
        "prompt": avatar_prompt(
            "Janet Park, a 49-year-old Korean-American woman. Stylish nail "
            "salon owner, beautifully painted nails visible, business-savvy "
            "expression, warm smile. Bellevue Washington"
        ),
    },

    # --- Tom Anderson's family ---
    {
        "id": "rachel_anderson", "level": 3,
        "texture_key": "fb_l3_rachel_anderson",
        "prompt": avatar_prompt(
            "Rachel Anderson, a 42-year-old Midwestern woman. Marketing "
            "consultant, polished put-together appearance, busy working mom "
            "energy, wine enthusiast. Minneapolis Minnesota"
        ),
    },
    {
        "id": "zoe_anderson", "level": 3,
        "texture_key": "fb_l3_zoe_anderson",
        "prompt": avatar_prompt(
            "Zoe Anderson, a 15-year-old girl. Artsy teenager with dyed "
            "hair tips, thrift store fashion, digital artist vibe, maybe a "
            "drawing tablet nearby, Studio Ghibli fan"
        ),
    },
    {
        "id": "walt_anderson", "level": 3,
        "texture_key": "fb_l3_walt_anderson",
        "prompt": avatar_prompt(
            "Walt Anderson, a 71-year-old man. Retired mechanic, calloused "
            "weathered hands, flannel shirt, slightly grumpy but lovable old "
            "Midwestern grandpa. St. Paul Minnesota"
        ),
    },

    # =======================================================================
    # LEVEL 4 (10 avatars)
    # =======================================================================

    # --- Linda Foster's circle ---
    {
        "id": "tammy_crawford", "level": 4,
        "texture_key": "fb_l4_tammy_crawford",
        "prompt": avatar_prompt(
            "Tammy Crawford, a 51-year-old Southern woman. FedEx regional "
            "manager, practical and warm, no-nonsense attitude with big hair "
            "and Southern charm. Memphis Tennessee"
        ),
    },
    {
        "id": "dave_crawford", "level": 4,
        "texture_key": "fb_l4_dave_crawford",
        "prompt": avatar_prompt(
            "Dave Crawford, a 53-year-old big man. Long-haul trucker, trucker "
            "cap, bushy beard or flannel shirt, sun-weathered face, easygoing "
            "grin. Memphis Tennessee"
        ),
    },
    {
        "id": "ashley_crawford", "level": 4,
        "texture_key": "fb_l4_ashley_crawford",
        "prompt": avatar_prompt(
            "Ashley Crawford, a 22-year-old young Southern woman. Nursing "
            "student at UT Knoxville, ponytail, bright optimistic expression, "
            "college student energy. Knoxville Tennessee"
        ),
    },

    # --- Robert Kim's circle ---
    {
        "id": "daniel_kim", "level": 4,
        "texture_key": "fb_l4_daniel_kim",
        "prompt": avatar_prompt(
            "Daniel Kim, a 44-year-old Korean-American man. Successful tech "
            "CEO of BridgePoint Labs, polished sharp suit, confident smile, "
            "commanding presence. Los Angeles California"
        ),
    },
    {
        "id": "grace_kim", "level": 4,
        "texture_key": "fb_l4_grace_kim",
        "prompt": avatar_prompt(
            "Grace Kim, a 42-year-old Korean-American woman. Pediatrician, "
            "professional white coat, compassionate expression, elegant and "
            "kind. Los Angeles California"
        ),
    },
    {
        "id": "justin_kim", "level": 4,
        "texture_key": "fb_l4_justin_kim",
        "prompt": avatar_prompt(
            "Justin Kim, a 16-year-old Korean-American teenage boy. Surfer "
            "style with sun-bleached shaggy hair tips, vintage camera around "
            "neck, skateboard, laid-back expression. Los Angeles California"
        ),
    },

    # --- Patricia Martinez's circle ---
    {
        "id": "rosa_martinez_herrera", "level": 4,
        "texture_key": "fb_l4_rosa_martinez_herrera",
        "prompt": avatar_prompt(
            "Rosa Martinez-Herrera, a 34-year-old Hispanic woman. Stylish "
            "marketing director, professional appearance, determined "
            "expression, mommy blog energy. Denver Colorado"
        ),
    },
    {
        "id": "chris_herrera", "level": 4,
        "texture_key": "fb_l4_chris_herrera",
        "prompt": avatar_prompt(
            "Chris Herrera, a 36-year-old Hispanic man. Restaurant general "
            "manager, warm smile, rolled-up sleeves, restaurant industry "
            "energy, craft beer guy. Denver Colorado"
        ),
    },

    # --- William Brooks's circle ---
    {
        "id": "megan_brooks", "level": 4,
        "texture_key": "fb_l4_megan_brooks",
        "prompt": avatar_prompt(
            "Megan Brooks, a 23-year-old young professional woman. Marketing "
            "coordinator at a tech company, trendy office style, bright smile, "
            "young professional energy. Raleigh North Carolina"
        ),
    },
    {
        "id": "tyler_brooks", "level": 4,
        "texture_key": "fb_l4_tyler_brooks",
        "prompt": avatar_prompt(
            "Tyler Brooks, a 20-year-old young man. Engineering student at "
            "NC State, slightly disheveled, technical t-shirt, focused "
            "expression, college dorm energy"
        ),
    },
    {
        "id": "steve_hendricks", "level": 4,
        "texture_key": "fb_l4_steve_hendricks",
        "prompt": avatar_prompt(
            "Steve Hendricks, a 53-year-old man. Corporate sales director, "
            "slightly overweight, golf polo shirt, friendly salesman grin, "
            "bourbon and cigars energy. Charlotte North Carolina"
        ),
    },

    # =======================================================================
    # LEVEL 5 (7 unique avatars -- robert_chen_sf and robert_chen_bos are
    #          the SAME person as robert_chen, generate ONE image)
    # =======================================================================

    # --- Shared: Robert Chen (CEO) -- one image for all 3 networks ---
    {
        "id": "robert_chen", "level": 5,
        "texture_key": "fb_l5_robert_chen",
        "prompt": avatar_prompt(
            "Robert Chen, a 45-year-old Chinese-American man. Tech company "
            "CEO of Nexus Dynamics, expensive sharp suit, commanding presence, "
            "confident piercing eyes, Stanford MBA energy. New York City"
        ),
    },

    # --- Sarah Mitchell's circle ---
    {
        "id": "diana_chen", "level": 5,
        "texture_key": "fb_l5_diana_chen",
        "prompt": avatar_prompt(
            "Diana Chen, a 42-year-old woman. Serene yoga instructor and "
            "studio co-owner, fit athletic build, calm aura, indoor plants "
            "person, travel photography lover. New York City"
        ),
    },
    {
        "id": "mark_torres", "level": 5,
        "texture_key": "fb_l5_mark_torres",
        "prompt": avatar_prompt(
            "Mark Torres, a 43-year-old man. VP of Sales at a tech company, "
            "charming corporate sales guy, sharp business attire, competitive "
            "energy, strong handshake vibe. New York City"
        ),
    },

    # --- Jennifer Walsh's circle ---
    # robert_chen_sf: SKIP -- same person as robert_chen, uses same image
    {
        "id": "lisa_chen", "level": 5,
        "texture_key": "fb_l5_lisa_chen",
        "prompt": avatar_prompt(
            "Lisa Chen, a 41-year-old Chinese-American woman. Tech recruiter, "
            "social and stylish Bay Area professional, warm networking smile, "
            "food photography enthusiast. San Francisco"
        ),
    },
    {
        "id": "amy_nakamura", "level": 5,
        "texture_key": "fb_l5_amy_nakamura",
        "prompt": avatar_prompt(
            "Amy Nakamura, a 43-year-old Japanese-American woman. VP of "
            "Operations at Pacific Coast Bank, polished corporate executive "
            "look, sharp but approachable, trivia night champion. "
            "San Francisco"
        ),
    },

    # --- Amanda Price's circle ---
    # robert_chen_bos: SKIP -- same person as robert_chen, uses same image
    {
        "id": "karen_chen", "level": 5,
        "texture_key": "fb_l5_karen_chen",
        "prompt": avatar_prompt(
            "Karen Chen, a 72-year-old Chinese-American woman. Retired "
            "teacher, warm kind grandmother face, gentle eyes, modest "
            "appearance, gardener. Wellesley Massachusetts"
        ),
    },
    {
        "id": "david_price", "level": 5,
        "texture_key": "fb_l5_david_price",
        "prompt": avatar_prompt(
            "David Price, a 41-year-old man. Creative architect, rolled-up "
            "sleeves, maybe architect glasses or drafting pencil behind ear, "
            "professional but creative energy. Boston Massachusetts"
        ),
    },
]


# ---------------------------------------------------------------------------
# Post Image Manifest -- SOLO posts (text-to-image, no reference images)
# ---------------------------------------------------------------------------

SOLO_POST_IMAGES = [
    # =======================================================================
    # LEVEL 1
    # =======================================================================
    {
        "id": "tomatoes", "level": 1, "aspect": "4:3",
        "texture_key": "fb_l1_post_tomatoes",
        "prompt": post_prompt(
            "A basket of ripe garden tomatoes on a porch railing, Midwestern "
            "farmhouse setting, Iowa garden in background, warm summer light"
        ),
    },
    {
        "id": "sunset_catalinas", "level": 1, "aspect": "4:3",
        "texture_key": "fb_l1_post_sunset_catalinas",
        "prompt": post_prompt(
            "A dramatic sunset over the Catalina Mountains near Tucson Arizona, "
            "desert landscape, orange and purple sky, saguaro cacti "
            "silhouettes, God's country"
        ),
    },
    {
        "id": "bird_photo", "level": 1, "aspect": "4:3",
        "texture_key": "fb_l1_post_bird_photo",
        "prompt": post_prompt(
            "A Varied Thrush songbird perched on a garden fence in a lush "
            "Pacific Northwest backyard, morning dew, Portland Oregon setting, "
            "bird photography"
        ),
    },
    {
        "id": "watercolor_card", "level": 1, "aspect": "4:3",
        "texture_key": "fb_l1_post_watercolor_card",
        "prompt": post_prompt(
            "A handmade watercolor greeting card with flowers and glitter "
            "sprinkled on it, craft table with art supplies, made by a "
            "grandmother for her granddaughter's art show"
        ),
    },
    {
        "id": "hana_art_show", "level": 1, "aspect": "4:3",
        "texture_key": "fb_l1_post_hana_art_show",
        "prompt": post_prompt(
            "A child's painting on an easel at a school art show, the painting "
            "shows a stick-figure family portrait where all the figures are "
            "painted purple, crayon and tempera paint style"
        ),
    },
    {
        "id": "teddy_bears", "level": 1, "aspect": "4:3",
        "texture_key": "fb_l1_post_teddy_bears",
        "prompt": post_prompt(
            "A row of stuffed teddy bears posed on a white backdrop like "
            "professional headshots, mini studio lighting setup visible, "
            "absurd and funny concept, photographer dad humor"
        ),
    },
    {
        "id": "model_train", "level": 1, "aspect": "4:3",
        "texture_key": "fb_l1_post_model_train",
        "prompt": post_prompt(
            "A detailed N-scale model train layout with a miniature mountain "
            "tunnel section, tiny trains running through, trees and buildings, "
            "hobby workbench setting, retired engineer's project"
        ),
    },
    {
        "id": "church_sermon", "level": 1, "aspect": "4:3",
        "texture_key": "fb_l1_post_church_sermon",
        "prompt": post_prompt(
            "Interior of a small Southern Baptist church during morning service, "
            "sunlight streaming through stained glass windows, a pastor at the "
            "pulpit, warm comforting atmosphere, Midwestern Iowa setting"
        ),
    },
    {
        "id": "robot_project", "level": 1, "aspect": "4:3",
        "texture_key": "fb_l1_post_robot_project",
        "prompt": post_prompt(
            "A teenage boy's robotics project on a workbench, a small robot arm "
            "sorting and stacking colored objects, Arduino and wires visible, "
            "high school robotics competition project, proud achievement"
        ),
    },

    # =======================================================================
    # LEVEL 2
    # =======================================================================
    {
        "id": "soccer_goal", "level": 2, "aspect": "4:3",
        "texture_key": "fb_l2_post_soccer_goal",
        "prompt": post_prompt(
            "A youth soccer game with a Chinese-American boy celebrating a "
            "winning goal in overtime, teammates rushing to celebrate, "
            "suburban soccer field, excited crowd"
        ),
    },
    {
        "id": "rangoli", "level": 2, "aspect": "4:3",
        "texture_key": "fb_l2_post_rangoli",
        "prompt": post_prompt(
            "A beautiful colorful rangoli pattern on a floor for Diwali, "
            "intricate geometric design with flower petals and colored powder, "
            "candles and Diwali decorations around it"
        ),
    },
    {
        "id": "cat_sweater", "level": 2, "aspect": "4:3",
        "texture_key": "fb_l2_post_cat_sweater",
        "prompt": post_prompt(
            "An annoyed-looking cat wearing a tiny hand-knitted sweater, "
            "sitting on a couch looking grumpy but adorable, handmade by "
            "a child, living room setting"
        ),
    },
    {
        "id": "oak_desk", "level": 2, "aspect": "4:3",
        "texture_key": "fb_l2_post_oak_desk",
        "prompt": post_prompt(
            "A handmade solid oak desk in a teenager's room, woodworking "
            "project by a dad, beautiful grain visible, tools scattered "
            "on the floor, proud craftsmanship"
        ),
    },
    {
        "id": "open_house", "level": 2, "aspect": "4:3",
        "texture_key": "fb_l2_post_open_house",
        "prompt": post_prompt(
            "A charming brownstone townhouse in Lincoln Park Chicago with an "
            "Open House sign on the front lawn, real estate listing style photo, "
            "3 bedroom home with a rooftop deck visible, beautiful neighborhood"
        ),
    },

    # =======================================================================
    # LEVEL 3
    # =======================================================================
    {
        "id": "family_drawing", "level": 3, "aspect": "4:3",
        "texture_key": "fb_l3_post_family_drawing",
        "prompt": post_prompt(
            "A child's crayon drawing of a family taped to a refrigerator, "
            "stick figures with labels, one tall daddy figure, mommy with "
            "exaggerated big hair, grandma holding a book"
        ),
    },
    {
        "id": "mustang_brakes", "level": 3, "aspect": "4:3",
        "texture_key": "fb_l3_post_mustang_brakes",
        "prompt": post_prompt(
            "A classic 1967 Ford Mustang in an auto repair garage with the "
            "hood up, brake pads and rotors on a workbench, mechanic's tools "
            "scattered, beautiful vintage car"
        ),
    },
    {
        "id": "new_truck", "level": 3, "aspect": "4:3",
        "texture_key": "fb_l3_post_new_truck",
        "prompt": post_prompt(
            "A shiny brand new 2024 Ford F-150 pickup truck in Velocity Blue "
            "color sitting proudly in a driveway, gleaming in sunlight, "
            "owner's proud perspective shot"
        ),
    },
    {
        "id": "watercolor_kerry", "level": 3, "aspect": "4:3",
        "texture_key": "fb_l3_post_watercolor_kerry",
        "prompt": post_prompt(
            "A watercolor painting of the Seattle skyline view from Kerry Park "
            "at sunset, Mount Rainier and the Space Needle visible, displayed "
            "on an easel in an art studio"
        ),
    },
    {
        "id": "bookshelf", "level": 3, "aspect": "4:3",
        "texture_key": "fb_l3_post_bookshelf",
        "prompt": post_prompt(
            "A beautiful handmade red oak bookshelf with hand-joined corners "
            "and Danish oil finish gleaming, standing in an art studio, "
            "woodworking craftsmanship"
        ),
    },
    {
        "id": "digital_painting", "level": 3, "aspect": "4:3",
        "texture_key": "fb_l3_post_digital_painting",
        "prompt": post_prompt(
            "A digital painting displayed on a tablet screen showing a "
            "Spirited Away inspired ethereal water scene with magical "
            "elements, stylus nearby, teenager's digital art"
        ),
    },
    {
        "id": "salon_grand_opening", "level": 3, "aspect": "4:3",
        "texture_key": "fb_l3_post_salon_grand_opening",
        "prompt": post_prompt(
            "A nail salon storefront with a Grand Opening banner, modern "
            "interior visible through windows, called Luxe Nails, festive "
            "decorations, Bellevue Washington"
        ),
    },
    {
        "id": "dog_shake", "level": 3, "aspect": "4:3",
        "texture_key": "fb_l3_post_dog_shake",
        "prompt": post_prompt(
            "A small cute Shih Tzu or Pomeranian dog doing a shake or paw "
            "trick with its owner's hand, proud adorable expression, nail "
            "salon interior in background"
        ),
    },
    {
        "id": "sneaker_jordans", "level": 3, "aspect": "4:3",
        "texture_key": "fb_l3_post_sneaker_jordans",
        "prompt": post_prompt(
            "A pair of fresh Air Jordan 4 Retro sneakers in Military Blue "
            "colorway displayed on a shelf, sneakerhead collection, dramatic "
            "lighting, brand new in box, hype shoe release"
        ),
    },

    # =======================================================================
    # LEVEL 4
    # =======================================================================
    {
        "id": "sunset_porch", "level": 4, "aspect": "4:3",
        "texture_key": "fb_l4_post_sunset_porch",
        "prompt": post_prompt(
            "An orange tabby cat sitting on a porch railing silhouetted "
            "against a beautiful sunset in Nashville Tennessee, warm golden "
            "and orange light, peaceful back porch scene"
        ),
    },
    {
        "id": "biscuit_gotcha", "level": 4, "aspect": "4:3",
        "texture_key": "fb_l4_post_biscuit_gotcha",
        "prompt": post_prompt(
            "A happy orange tabby cat with a tiny party hat on, celebrating "
            "a shelter adoption anniversary, big green eyes, cute and funny, "
            "gotcha day celebration"
        ),
    },
    {
        "id": "film_photos_venice", "level": 4, "aspect": "4:3",
        "texture_key": "fb_l4_post_film_photos_venice",
        "prompt": post_prompt(
            "Black and white film photographs spread on a table showing "
            "Venice Beach California scenes, boardwalk and street photography, "
            "vintage film camera nearby, 35mm film grain aesthetic"
        ),
    },
    {
        "id": "baby_first_steps", "level": 4, "aspect": "4:3",
        "texture_key": "fb_l4_post_baby_first_steps",
        "prompt": post_prompt(
            "A Hispanic toddler girl taking her first wobbly steps toward "
            "a small family dog in a living room, parents watching excitedly "
            "in the background, milestone moment"
        ),
    },
    {
        "id": "baby_avocado", "level": 4, "aspect": "4:3",
        "texture_key": "fb_l4_post_baby_avocado",
        "prompt": post_prompt(
            "A messy baby girl covered in mashed avocado sitting in a "
            "highchair, huge hilarious green-smeared grin, avocado "
            "everywhere, baby discovering food"
        ),
    },
    {
        "id": "new_surfboard", "level": 4, "aspect": "4:3",
        "texture_key": "fb_l4_post_new_surfboard",
        "prompt": post_prompt(
            "A brand new Firewire surfboard propped against a garage wall, "
            "birthday present for a teenager, California coastal vibes, "
            "wax and fin visible, stoked surfer energy"
        ),
    },
    {
        "id": "robot_arm", "level": 4, "aspect": "4:3",
        "texture_key": "fb_l4_post_robot_arm",
        "prompt": post_prompt(
            "A student-built robot arm on a mechatronics lab workbench, "
            "Arduino boards and wires visible, a crushed soda can nearby "
            "from a test run, college engineering lab setting"
        ),
    },

    # =======================================================================
    # LEVEL 5
    # =======================================================================
    {
        "id": "dogs_dolores", "level": 5, "aspect": "4:3",
        "texture_key": "fb_l5_post_dogs_dolores",
        "prompt": post_prompt(
            "Two golden retrievers playing in foggy morning at Dolores Park "
            "in San Francisco, San Francisco city view barely visible through "
            "the fog, dogs having fun"
        ),
    },
    {
        "id": "dim_sum", "level": 5, "aspect": "4:3",
        "texture_key": "fb_l5_post_dim_sum",
        "prompt": post_prompt(
            "An elaborate spread of dim sum dishes at a San Francisco "
            "restaurant, bamboo steamers with har gow, siu mai, char siu bao, "
            "tea pot, Yank Sing style dim sum feast"
        ),
    },
    {
        "id": "fenway_kids", "level": 5, "aspect": "4:3",
        "texture_key": "fb_l5_post_fenway_kids",
        "prompt": post_prompt(
            "Two young children at Fenway Park baseball stadium in Boston, "
            "one child sleeping with a hot dog still in hand, the other eating "
            "cotton candy, funny parenting moment"
        ),
    },
    {
        "id": "kitchen_renovation", "level": 5, "aspect": "4:3",
        "texture_key": "fb_l5_post_kitchen_renovation",
        "prompt": post_prompt(
            "A beautiful modern kitchen renovation with a large marble island "
            "countertop, architect's finished project, clean lines, Boston "
            "home, architectural photography style"
        ),
    },
    {
        "id": "cookies_office", "level": 5, "aspect": "4:3",
        "texture_key": "fb_l5_post_cookies_office",
        "prompt": post_prompt(
            "Three dozen freshly baked cookies on cooling racks on a kitchen "
            "counter, chocolate chip and other varieties, office kitchen "
            "setting, ready to be brought to work"
        ),
    },
    {
        "id": "running_charles", "level": 5, "aspect": "4:3",
        "texture_key": "fb_l5_post_running_charles",
        "prompt": post_prompt(
            "A woman running along the Charles River in Boston at sunrise, "
            "the Boston skyline and Harvard Bridge visible in the background, "
            "marathon training run, early morning light"
        ),
    },
]


# ---------------------------------------------------------------------------
# Post Image Manifest -- GROUP posts (image-to-image with reference images)
# ---------------------------------------------------------------------------

GROUP_POST_IMAGES = [
    # =======================================================================
    # LEVEL 1
    # =======================================================================
    {
        "id": "fishing_lake", "level": 1, "aspect": "4:3",
        "texture_key": "fb_l1_post_fishing_lake",
        "prompt": post_prompt(
            "An old man and his teenage grandson fishing together at a desert "
            "lake, Arizona landscape with cacti, Patagonia Lake, fishing poles "
            "in the water, clinch knot lesson"
        ),
        "references": [
            {"type": "victim", "path": "portraits/level1/victim_2.png"},
            {"type": "avatar", "level": 1, "id": "tyler_patterson"},
        ],
    },
    {
        "id": "japanese_garden", "level": 1, "aspect": "4:3",
        "texture_key": "fb_l1_post_japanese_garden",
        "prompt": post_prompt(
            "A group of small kindergarten children with two parents at the "
            "Portland Japanese Garden, koi pond visible, a dad photographer "
            "herding kids, lush green garden setting"
        ),
        "references": [
            {"type": "avatar", "level": 1, "id": "marcus_davis"},
            {"type": "avatar", "level": 1, "id": "yuki_nakamura_davis"},
        ],
    },
    {
        "id": "earl_selfie", "level": 1, "aspect": "1:1",
        "texture_key": "fb_l1_post_earl_selfie",
        "prompt": post_prompt(
            "An extreme close-up accidental selfie by a confused elderly "
            "Black man looking at his phone from below, unflattering angle, "
            "bewildered expression, classic grandparent accidental selfie"
        ),
        "references": [
            {"type": "victim", "path": "portraits/level1/victim_4.png"},
        ],
    },
    {
        "id": "parade_family", "level": 1, "aspect": "4:3",
        "texture_key": "fb_l1_post_parade_family",
        "prompt": post_prompt(
            "An Irish-American family at a St. Patrick's Day parade on a "
            "Boston street, an elderly woman with a burly firefighter son "
            "and his wife, a baby wearing a tiny green hat, green confetti "
            "and decorations"
        ),
        "references": [
            {"type": "victim", "path": "portraits/level1/victim_5.png"},
            {"type": "avatar", "level": 1, "id": "patrick_obrien"},
            {"type": "avatar", "level": 1, "id": "colleen_obrien"},
        ],
    },

    # =======================================================================
    # LEVEL 2
    # =======================================================================
    {
        "id": "kings_game", "level": 2, "aspect": "4:3",
        "texture_key": "fb_l2_post_kings_game",
        "prompt": post_prompt(
            "A Chinese-American father and his young son cheering excitedly "
            "at a Sacramento Kings basketball game, arena crowd in background, "
            "team jerseys, father-son bonding night"
        ),
        "references": [
            {"type": "victim", "path": "portraits/level2/victim_1.png"},
            {"type": "avatar", "level": 2, "id": "brandon_chen"},
        ],
    },
    {
        "id": "hermann_park", "level": 2, "aspect": "4:3",
        "texture_key": "fb_l2_post_hermann_park",
        "prompt": post_prompt(
            "A Hispanic family having a picnic at Hermann Park in Houston "
            "Texas, a little girl feeding ducks by a pond, a man sleeping "
            "on a picnic blanket, beautiful Sunday afternoon"
        ),
        "references": [
            {"type": "victim", "path": "portraits/level2/victim_2.png"},
            {"type": "avatar", "level": 2, "id": "carlos_gonzalez"},
            {"type": "avatar", "level": 2, "id": "sofia_gonzalez"},
        ],
    },

    # =======================================================================
    # LEVEL 4
    # =======================================================================
    {
        "id": "gatlinburg_weekend", "level": 4, "aspect": "4:3",
        "texture_key": "fb_l4_post_gatlinburg_weekend",
        "prompt": post_prompt(
            "Three women posing together in front of the Smoky Mountains at "
            "Gatlinburg Tennessee, girls weekend vacation selfie, cabin porch "
            "or mountain overlook, happy smiles"
        ),
        "references": [
            {"type": "victim", "path": "portraits/level4/victim_1.png"},
            {"type": "avatar", "level": 4, "id": "tammy_crawford"},
            {"type": "avatar", "level": 4, "id": "ashley_crawford"},
        ],
    },
    {
        "id": "surfing_lajolla", "level": 4, "aspect": "4:3",
        "texture_key": "fb_l4_post_surfing_lajolla",
        "prompt": post_prompt(
            "A Korean-American man and teenage boy with surfboards at La Jolla "
            "beach in San Diego, Pacific Ocean waves, sunny California day, "
            "uncle and nephew surfing trip"
        ),
        "references": [
            {"type": "victim", "path": "portraits/level4/victim_2.png"},
            {"type": "avatar", "level": 4, "id": "justin_kim"},
        ],
    },
]


# ---------------------------------------------------------------------------
# API Helpers
# ---------------------------------------------------------------------------

def load_api_key():
    """Load Meshy API key from .env file in project root."""
    env_path = PROJECT_ROOT / ".env"
    if not env_path.exists():
        print("ERROR: No .env file found at", env_path)
        print("Create one with: MESHY_API_KEY=msy_...")
        sys.exit(1)
    with open(env_path, "r") as f:
        for line in f:
            line = line.strip()
            if line.startswith("MESHY_API_KEY="):
                return line.split("=", 1)[1]
    print("ERROR: MESHY_API_KEY not found in .env")
    sys.exit(1)


def api_request(method, endpoint, api_key, data=None, timeout=120):
    """Make an HTTP request to the Meshy API. Returns parsed JSON or None."""
    url = f"{MESHY_BASE_URL}/{endpoint}"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"    HTTP Error {e.code}: {error_body[:300]}")
        return None
    except Exception as e:
        print(f"    Request error: {e}")
        return None


def submit_text_to_image(api_key, prompt, aspect_ratio="1:1"):
    """Submit a text-to-image generation task. Returns task_id or None."""
    data = {
        "ai_model": MODEL,
        "prompt": prompt,
        "aspect_ratio": aspect_ratio,
    }
    resp = api_request("POST", "text-to-image", api_key, data)
    if resp and "result" in resp:
        return resp["result"]
    print(f"    Failed to submit text-to-image task: {resp}")
    return None


def submit_image_to_image(api_key, prompt, reference_image_paths):
    """Submit an image-to-image task with base64-encoded reference images.
    Returns task_id or None.
    """
    ref_urls = []
    for rel_path in reference_image_paths:
        full_path = ASSETS_DIR / rel_path
        if not full_path.exists():
            print(f"    WARNING: Reference image not found: {full_path}")
            continue
        with open(full_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("ascii")
        ref_urls.append(f"data:image/png;base64,{b64}")

    if not ref_urls:
        print("    ERROR: No valid reference images found, skipping task")
        return None

    data = {
        "ai_model": MODEL,
        "prompt": prompt,
        "reference_image_urls": ref_urls,
    }

    # For large payloads (base64 images), write to a temp file then read back
    tmp_path = Path(__file__).resolve().parent / "_tmp_payload.json"
    try:
        with open(tmp_path, "w") as f:
            json.dump(data, f)
        payload_size = tmp_path.stat().st_size
        print(f"    Payload size: {payload_size / 1024 / 1024:.1f} MB")

        with open(tmp_path, "rb") as f:
            body = f.read()
    finally:
        tmp_path.unlink(missing_ok=True)

    url = f"{MESHY_BASE_URL}/image-to-image"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            result = json.loads(resp.read().decode())
            if "result" in result:
                return result["result"]
            print(f"    Unexpected response: {result}")
            return None
    except urllib.error.HTTPError as e:
        print(f"    HTTP Error {e.code}: {e.read().decode()[:300]}")
        return None
    except Exception as e:
        print(f"    Request error: {e}")
        return None


def poll_task(api_key, task_id, api_type="text-to-image"):
    """Poll a task until SUCCEEDED, FAILED, or timeout.
    Returns the first image URL on success, or None.
    """
    endpoint = f"{api_type}/{task_id}"
    max_polls = 120  # ~12 minutes at 6s intervals
    for attempt in range(max_polls):
        resp = api_request("GET", endpoint, api_key)
        if not resp:
            time.sleep(POLL_INTERVAL)
            continue

        status = resp.get("status", "UNKNOWN")
        progress = resp.get("progress", 0)

        if status == "SUCCEEDED":
            urls = resp.get("image_urls", [])
            if urls:
                return urls[0]
            print("    SUCCEEDED but no image_urls in response")
            return None
        elif status == "FAILED":
            error = resp.get("task_error", {})
            msg = error.get("message", "Unknown error") if isinstance(error, dict) else str(error)
            print(f"    FAILED: {msg}")
            return None
        elif status == "CANCELED":
            print("    CANCELED")
            return None

        # Print progress periodically
        if attempt % 5 == 0:
            print(f"    Polling... status={status}, progress={progress}%")
        time.sleep(POLL_INTERVAL)

    print("    TIMEOUT: exceeded max polling attempts")
    return None


def download_image(url, output_path):
    """Download an image from a URL and save it to disk.
    Creates parent directories as needed. URLs expire, so download immediately.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
        with open(output_path, "wb") as f:
            f.write(data)
        size_kb = len(data) / 1024
        print(f"    Downloaded: {output_path.name} ({size_kb:.0f} KB)")
        return True
    except Exception as e:
        print(f"    Download error: {e}")
        return False


# ---------------------------------------------------------------------------
# Status file for idempotent resume
# ---------------------------------------------------------------------------

def load_status():
    """Load generation status from JSON file."""
    if STATUS_FILE.exists():
        try:
            with open(STATUS_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    return {"avatars": {}, "posts": {}, "group_posts": {}}


def save_status(status):
    """Save generation status to JSON file."""
    with open(STATUS_FILE, "w") as f:
        json.dump(status, f, indent=2)


# ---------------------------------------------------------------------------
# Generation: Avatars
# ---------------------------------------------------------------------------

def generate_avatars(api_key, level_filter=None, dry_run=False):
    """Generate all profile avatar images via text-to-image."""
    status = load_status()
    avatars = AVATARS
    if level_filter is not None:
        avatars = [a for a in avatars if a["level"] == level_filter]

    # Determine which avatars still need generation
    pending = []
    for avatar in avatars:
        key = f"l{avatar['level']}_{avatar['id']}"
        output_path = AVATAR_DIR / f"level{avatar['level']}" / f"{avatar['id']}.png"

        if output_path.exists():
            print(f"  SKIP (file exists): {key}")
            continue
        if key in status.get("avatars", {}) and status["avatars"][key].get("status") == "done":
            print(f"  SKIP (status=done): {key}")
            continue

        pending.append((key, avatar, output_path))

    if not pending:
        print("  All avatars already generated!")
        return

    print(f"\n  {len(pending)} avatars to generate:")
    for key, avatar, _ in pending:
        print(f"    - {key}")

    if dry_run:
        print("\n  [DRY RUN] Prompts:")
        for key, avatar, output_path in pending:
            print(f"\n    {key}:")
            print(f"      Output: {output_path}")
            print(f"      Prompt: {avatar['prompt'][:200]}...")
        return

    # Submit in batches of BATCH_SIZE
    submitted = []
    for batch_start in range(0, len(pending), BATCH_SIZE):
        batch = pending[batch_start:batch_start + BATCH_SIZE]
        batch_num = batch_start // BATCH_SIZE + 1
        print(f"\n  --- Avatar Batch {batch_num} ({len(batch)} tasks) ---")

        for key, avatar, output_path in batch:
            print(f"  Submitting: {key}")
            task_id = submit_text_to_image(api_key, avatar["prompt"], "1:1")
            if task_id:
                submitted.append((key, task_id, output_path, avatar["prompt"]))
                status.setdefault("avatars", {})[key] = {
                    "task_id": task_id, "status": "submitted"
                }
                save_status(status)
            else:
                # Retry once
                print(f"    Retrying {key}...")
                time.sleep(2)
                task_id = submit_text_to_image(api_key, avatar["prompt"], "1:1")
                if task_id:
                    submitted.append((key, task_id, output_path, avatar["prompt"]))
                    status.setdefault("avatars", {})[key] = {
                        "task_id": task_id, "status": "submitted"
                    }
                    save_status(status)
                else:
                    print(f"    FAILED to submit after retry: {key}")
                    status.setdefault("avatars", {})[key] = {"status": "failed"}
                    save_status(status)

        # Delay between batches
        if batch_start + BATCH_SIZE < len(pending):
            print(f"  Waiting {BATCH_DELAY}s before next batch...")
            time.sleep(BATCH_DELAY)

    # Poll all submitted tasks and download results
    print(f"\n  Polling {len(submitted)} avatar tasks...")
    for key, task_id, output_path, prompt in submitted:
        print(f"\n  Waiting for: {key} (task: {task_id[:12]}...)")
        image_url = poll_task(api_key, task_id, "text-to-image")
        if image_url:
            success = download_image(image_url, output_path)
            if success:
                status["avatars"][key] = {"task_id": task_id, "status": "done"}
            else:
                status["avatars"][key] = {"task_id": task_id, "status": "download_failed"}
        else:
            # Retry once on poll failure
            print(f"    Retrying submission for {key}...")
            retry_id = submit_text_to_image(api_key, prompt, "1:1")
            if not retry_id:
                status["avatars"][key] = {"task_id": task_id, "status": "failed"}
            else:
                retry_url = poll_task(api_key, retry_id, "text-to-image")
                if retry_url and download_image(retry_url, output_path):
                    status["avatars"][key] = {"task_id": retry_id, "status": "done"}
                else:
                    status["avatars"][key] = {"task_id": task_id, "status": "failed"}
        save_status(status)

    # Level 5 dedup note
    src = AVATAR_DIR / "level5" / "robert_chen.png"
    if src.exists():
        print("\n  Robert Chen (L5): single image shared across all 3 victim networks.")
        print("    robert_chen_sf and robert_chen_bos use the same file: robert_chen.png")


# ---------------------------------------------------------------------------
# Generation: Solo post images
# ---------------------------------------------------------------------------

def generate_solo_posts(api_key, level_filter=None, dry_run=False):
    """Generate solo post images via text-to-image."""
    status = load_status()
    posts = SOLO_POST_IMAGES
    if level_filter is not None:
        posts = [p for p in posts if p["level"] == level_filter]

    pending = []
    for post in posts:
        key = f"l{post['level']}_post_{post['id']}"
        output_path = POST_DIR / f"level{post['level']}" / f"{post['id']}.png"

        if output_path.exists():
            print(f"  SKIP (file exists): {key}")
            continue
        if key in status.get("posts", {}) and status["posts"][key].get("status") == "done":
            print(f"  SKIP (status=done): {key}")
            continue

        pending.append((key, post, output_path))

    if not pending:
        print("  All solo post images already generated!")
        return

    print(f"\n  {len(pending)} solo post images to generate:")
    for key, _, _ in pending:
        print(f"    - {key}")

    if dry_run:
        print("\n  [DRY RUN] Prompts:")
        for key, post, output_path in pending:
            print(f"\n    {key}:")
            print(f"      Output: {output_path}")
            print(f"      Aspect: {post.get('aspect', '4:3')}")
            print(f"      Prompt: {post['prompt'][:200]}...")
        return

    submitted = []
    for batch_start in range(0, len(pending), BATCH_SIZE):
        batch = pending[batch_start:batch_start + BATCH_SIZE]
        batch_num = batch_start // BATCH_SIZE + 1
        print(f"\n  --- Solo Post Batch {batch_num} ({len(batch)} tasks) ---")

        for key, post, output_path in batch:
            aspect = post.get("aspect", "4:3")
            print(f"  Submitting: {key} ({aspect})")
            task_id = submit_text_to_image(api_key, post["prompt"], aspect)
            if task_id:
                submitted.append((key, task_id, output_path))
                status.setdefault("posts", {})[key] = {
                    "task_id": task_id, "status": "submitted"
                }
                save_status(status)
            else:
                # Retry once
                print(f"    Retrying {key}...")
                time.sleep(2)
                task_id = submit_text_to_image(api_key, post["prompt"], aspect)
                if task_id:
                    submitted.append((key, task_id, output_path))
                    status.setdefault("posts", {})[key] = {
                        "task_id": task_id, "status": "submitted"
                    }
                    save_status(status)
                else:
                    print(f"    FAILED to submit after retry: {key}")
                    status.setdefault("posts", {})[key] = {"status": "failed"}
                    save_status(status)

        if batch_start + BATCH_SIZE < len(pending):
            print(f"  Waiting {BATCH_DELAY}s before next batch...")
            time.sleep(BATCH_DELAY)

    print(f"\n  Polling {len(submitted)} solo post tasks...")
    for key, task_id, output_path in submitted:
        print(f"\n  Waiting for: {key} (task: {task_id[:12]}...)")
        image_url = poll_task(api_key, task_id, "text-to-image")
        if image_url:
            success = download_image(image_url, output_path)
            if success:
                status["posts"][key] = {"task_id": task_id, "status": "done"}
            else:
                status["posts"][key] = {"task_id": task_id, "status": "download_failed"}
        else:
            status["posts"][key] = {"task_id": task_id, "status": "failed"}
        save_status(status)


# ---------------------------------------------------------------------------
# Generation: Group post images (image-to-image)
# ---------------------------------------------------------------------------

def generate_group_posts(api_key, level_filter=None, dry_run=False):
    """Generate group post images via image-to-image with reference portraits."""
    status = load_status()
    posts = GROUP_POST_IMAGES
    if level_filter is not None:
        posts = [p for p in posts if p["level"] == level_filter]

    pending = []
    for post in posts:
        key = f"l{post['level']}_post_{post['id']}"
        output_path = POST_DIR / f"level{post['level']}" / f"{post['id']}.png"

        if output_path.exists():
            print(f"  SKIP (file exists): {key}")
            continue
        if key in status.get("group_posts", {}) and status["group_posts"][key].get("status") == "done":
            print(f"  SKIP (status=done): {key}")
            continue

        # Resolve reference image paths
        ref_paths = []
        skip = False
        for ref in post["references"]:
            if ref["type"] == "victim":
                ref_paths.append(ref["path"])
            elif ref["type"] == "avatar":
                avatar_rel = f"friendbook/avatars/level{ref['level']}/{ref['id']}.png"
                full = ASSETS_DIR / avatar_rel
                if not full.exists():
                    print(f"  SKIP (missing ref avatar {ref['id']}): {key}")
                    print(f"    Expected: {full}")
                    print(f"    Generate avatars first, then run --group-only")
                    skip = True
                    break
                ref_paths.append(avatar_rel)

        if skip:
            continue

        pending.append((key, post, output_path, ref_paths))

    if not pending:
        print("  All group post images already generated!")
        return

    print(f"\n  {len(pending)} group post images to generate:")
    for key, _, _, refs in pending:
        print(f"    - {key} ({len(refs)} reference images)")

    if dry_run:
        print("\n  [DRY RUN] Prompts:")
        for key, post, output_path, ref_paths in pending:
            print(f"\n    {key}:")
            print(f"      Output: {output_path}")
            print(f"      Refs: {ref_paths}")
            print(f"      Prompt: {post['prompt'][:200]}...")
        return

    # Group images are submitted one at a time (large payloads)
    for key, post, output_path, ref_paths in pending:
        print(f"\n  Submitting: {key} ({len(ref_paths)} reference images)")
        task_id = submit_image_to_image(api_key, post["prompt"], ref_paths)
        if task_id:
            print(f"    Task ID: {task_id[:16]}...")
            image_url = poll_task(api_key, task_id, "image-to-image")
            if image_url:
                success = download_image(image_url, output_path)
                if success:
                    status.setdefault("group_posts", {})[key] = {
                        "task_id": task_id, "status": "done"
                    }
                else:
                    status.setdefault("group_posts", {})[key] = {
                        "task_id": task_id, "status": "download_failed"
                    }
            else:
                # Retry once
                print(f"    Retrying {key}...")
                retry_id = submit_image_to_image(api_key, post["prompt"], ref_paths)
                if retry_id:
                    retry_url = poll_task(api_key, retry_id, "image-to-image")
                    if retry_url and download_image(retry_url, output_path):
                        status.setdefault("group_posts", {})[key] = {
                            "task_id": retry_id, "status": "done"
                        }
                    else:
                        status.setdefault("group_posts", {})[key] = {
                            "task_id": retry_id, "status": "failed"
                        }
                else:
                    status.setdefault("group_posts", {})[key] = {
                        "task_id": task_id, "status": "failed"
                    }
        else:
            print(f"    FAILED to submit: {key}")
            status.setdefault("group_posts", {})[key] = {"status": "failed"}
        save_status(status)


# ---------------------------------------------------------------------------
# Summary report
# ---------------------------------------------------------------------------

def print_summary():
    """Print a summary of all generated and missing assets."""
    avatar_ok = 0
    avatar_missing = []
    for avatar in AVATARS:
        path = AVATAR_DIR / f"level{avatar['level']}" / f"{avatar['id']}.png"
        if path.exists():
            avatar_ok += 1
        else:
            avatar_missing.append(f"l{avatar['level']}_{avatar['id']}")

    solo_ok = 0
    solo_missing = []
    for post in SOLO_POST_IMAGES:
        path = POST_DIR / f"level{post['level']}" / f"{post['id']}.png"
        if path.exists():
            solo_ok += 1
        else:
            solo_missing.append(f"l{post['level']}_{post['id']}")

    group_ok = 0
    group_missing = []
    for post in GROUP_POST_IMAGES:
        path = POST_DIR / f"level{post['level']}" / f"{post['id']}.png"
        if path.exists():
            group_ok += 1
        else:
            group_missing.append(f"l{post['level']}_{post['id']}")

    total_expected = len(AVATARS) + len(SOLO_POST_IMAGES) + len(GROUP_POST_IMAGES)
    total_actual = avatar_ok + solo_ok + group_ok

    print(f"\n{'=' * 65}")
    print(f"  FRIENDBOOK IMAGE GENERATION SUMMARY")
    print(f"{'=' * 65}")
    print(f"  Avatars:            {avatar_ok:3d} / {len(AVATARS)}")
    print(f"  Solo post images:   {solo_ok:3d} / {len(SOLO_POST_IMAGES)}")
    print(f"  Group post images:  {group_ok:3d} / {len(GROUP_POST_IMAGES)}")
    print(f"  {'':22s}--------")
    print(f"  Total:              {total_actual:3d} / {total_expected}")

    all_missing = (
        [("avatar", m) for m in avatar_missing]
        + [("solo_post", m) for m in solo_missing]
        + [("group_post", m) for m in group_missing]
    )
    if all_missing:
        print(f"\n  Missing ({len(all_missing)}):")
        for kind, name in all_missing:
            print(f"    [{kind:11s}] {name}")
    else:
        print(f"\n  All {total_expected} assets generated successfully!")

    # Level 5 dedup note
    print(f"\n  Note: robert_chen_sf and robert_chen_bos share robert_chen.png")
    print(f"        (7 unique L5 avatars, 2 aliases)")
    print(f"{'=' * 65}")


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Generate FriendBook images via Meshy API",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scripts/generate_friendbook_images.py                  # Generate everything
  python scripts/generate_friendbook_images.py --avatars-only   # Only avatars
  python scripts/generate_friendbook_images.py --posts-only     # Only post images
  python scripts/generate_friendbook_images.py --solo-only      # Only solo posts
  python scripts/generate_friendbook_images.py --group-only     # Only group photos
  python scripts/generate_friendbook_images.py --level 1        # Only level 1
  python scripts/generate_friendbook_images.py --dry-run        # Preview without API calls
  python scripts/generate_friendbook_images.py --summary        # Status report
        """,
    )
    parser.add_argument("--avatars-only", action="store_true",
                        help="Only generate avatar images")
    parser.add_argument("--posts-only", action="store_true",
                        help="Only generate post images (solo + group)")
    parser.add_argument("--solo-only", action="store_true",
                        help="Only generate solo post images (no group)")
    parser.add_argument("--group-only", action="store_true",
                        help="Only generate group post images (image-to-image)")
    parser.add_argument("--level", type=int, choices=[1, 2, 3, 4, 5],
                        help="Only generate for a specific level (1-5)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print prompts and output paths without submitting to API")
    parser.add_argument("--summary", action="store_true",
                        help="Print generation status summary and exit")

    args = parser.parse_args()

    # Summary mode: just print and exit
    if args.summary:
        print_summary()
        return

    # Load API key (unless dry run)
    if args.dry_run:
        api_key = "DRY_RUN_NO_KEY_NEEDED"
        print("=== DRY RUN MODE ===")
        print("No API calls will be made. Prompts and paths will be printed.\n")
    else:
        api_key = load_api_key()
        print(f"Meshy API key: {api_key[:10]}...")

    print(f"Model: {MODEL}")
    print(f"Project root: {PROJECT_ROOT}")
    print(f"Avatar output: {AVATAR_DIR}")
    print(f"Post output:   {POST_DIR}")
    print(f"Status file:   {STATUS_FILE}")

    if args.level:
        print(f"Level filter:  {args.level}")

    # Determine which phases to run
    has_filter = args.avatars_only or args.posts_only or args.solo_only or args.group_only
    do_avatars = not has_filter or args.avatars_only
    do_solo = not has_filter or args.posts_only or args.solo_only
    do_group = not has_filter or args.posts_only or args.group_only

    # Phase 1: Avatars
    if do_avatars:
        print(f"\n{'=' * 65}")
        print(f"  PHASE 1: Avatar Generation ({len(AVATARS)} total)")
        print(f"{'=' * 65}")
        generate_avatars(api_key, args.level, args.dry_run)

    # Phase 2: Solo post images
    if do_solo:
        print(f"\n{'=' * 65}")
        print(f"  PHASE 2: Solo Post Image Generation ({len(SOLO_POST_IMAGES)} total)")
        print(f"{'=' * 65}")
        generate_solo_posts(api_key, args.level, args.dry_run)

    # Phase 3: Group post images
    if do_group:
        print(f"\n{'=' * 65}")
        print(f"  PHASE 3: Group Post Image Generation ({len(GROUP_POST_IMAGES)} total)")
        print(f"{'=' * 65}")
        generate_group_posts(api_key, args.level, args.dry_run)

    # Final summary
    if not args.dry_run:
        print_summary()
    else:
        print(f"\n{'=' * 65}")
        print(f"  DRY RUN COMPLETE -- no API calls were made")
        print(f"{'=' * 65}")
        print(f"  Total avatars:      {len(AVATARS)}")
        print(f"  Total solo posts:   {len(SOLO_POST_IMAGES)}")
        print(f"  Total group posts:  {len(GROUP_POST_IMAGES)}")
        total = len(AVATARS) + len(SOLO_POST_IMAGES) + len(GROUP_POST_IMAGES)
        print(f"  Grand total:        {total}")


if __name__ == "__main__":
    main()
