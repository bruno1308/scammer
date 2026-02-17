#!/usr/bin/env python3
"""
Generate empty office background with NO DESKS - just walls, ceiling, lights, posters.
Workers and desks will be separate overlay sprites.

Usage: python scripts/generate_bg_no_desks.py
"""

import os, sys, time, requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("MESHY_API_KEY")
if not API_KEY:
    print("ERROR: MESHY_API_KEY not found in .env")
    sys.exit(1)

API_BASE = "https://api.meshy.ai/openapi/v1"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

OUT_DIR = ROOT / "public" / "assets" / "office_v3"

STYLE = (
    "editorial caricature illustration, MAD Magazine style, heavy black ink outlines "
    "with slight hand-drawn wobble, flat watercolor color washes, paper grain texture, "
    "satirical exaggerated proportions"
)
OFFICE_STYLE = (
    f"{STYLE}, dark moody teal-green atmospheric lighting, grungy stained worn "
    "office aesthetic, grotesque editorial office noir, dingy call center environment"
)
CAMERA = (
    "first-person seated desk view, camera at seated eye height approximately 1.2 meters, "
    "slight downward pitch approximately 10 degrees, centered perspective"
)
NEGATIVE = (
    "Negative: top-down view, isometric, birds-eye, side view, elevated camera, "
    "strategy game angle, gray background, white background, desks, furniture, "
    "computers, monitors, chairs, people, workers"
)

prompt = (
    f"Dark scam call center office interior room, {CAMERA}, "
    "EMPTY ROOM with NO DESKS NO FURNITURE NO COMPUTERS NO PEOPLE, "
    "just the bare room structure: "
    "grimy stained back wall with cheesy motivational posters hanging crooked, "
    "tattered HUSTLE and SYNERGY posters, "
    "warehouse ceiling with exposed pipes and cable trays overhead, "
    "overhead fluorescent tube lights casting sickly teal-green light cones, "
    "dirty tiled or concrete floor with scuff marks and stains, "
    "bare room interior with NOTHING on the floor, completely empty floor space, "
    "NO desks NO chairs NO monitors NO keyboards NO workers NO furniture whatsoever, "
    f"{OFFICE_STYLE}. {NEGATIVE}"
)

print("=" * 60)
print("  Generating empty room background (NO desks/furniture)")
print("=" * 60)

body = {"ai_model": "nano-banana", "prompt": prompt, "aspect_ratio": "16:9"}
resp = requests.post(f"{API_BASE}/text-to-image", headers=HEADERS, json=body, timeout=30)
resp.raise_for_status()
tid = resp.json().get("result")
print(f"  Task ID: {tid}")

out = str(OUT_DIR / "back_wall_empty.png")

while True:
    r = requests.get(
        f"{API_BASE}/text-to-image/{tid}",
        headers={"Authorization": f"Bearer {API_KEY}"},
        timeout=30,
    )
    d = r.json()
    st = d.get("status", "UNKNOWN")
    if st == "SUCCEEDED":
        urls = d.get("image_urls", [])
        if urls:
            img = requests.get(urls[0], timeout=60)
            with open(out, "wb") as f:
                f.write(img.content)
            print(f"  [DONE] back_wall_empty.png ({len(img.content)//1024}KB)")
        break
    elif st == "FAILED":
        print(f"  [FAIL] {d.get('task_error')}")
        sys.exit(1)
    else:
        print(f"  [{st}] {d.get('progress', 0)}%")
    time.sleep(5)

print("  DONE!")
