#!/usr/bin/env python3
"""
Regenerate foreground desk — less cluttered, space for monitor and phone overlays.
No stapler, no donut. Clean center and right areas for overlaid objects.

Usage: python scripts/generate_desk_v2.py
"""

import os, sys, time, requests
import numpy as np
from pathlib import Path
from PIL import Image
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
    "strategy game angle, gray background, white background, stapler, donut, food, "
    "monitor, computer screen, phone, telephone"
)
MAGENTA_BG = "on solid bright magenta pink FF00FF background"

prompt = (
    f"Office desk surface seen from seated position, {CAMERA}, "
    "worn scratched laminate desktop, front edge of desk visible at bottom of frame, "
    "MINIMAL clutter: a few scattered sticky notes on the LEFT side, "
    "a pen cup with cheap pens on the far LEFT, one coffee ring stain, "
    "CENTER of desk is mostly CLEAR and EMPTY for placing objects on top, "
    "RIGHT side of desk is mostly CLEAR and EMPTY, "
    "maybe one crumpled paper in the far left corner, "
    "the desk surface is the main focus with LARGE OPEN SPACES in center and right, "
    "NO stapler NO donut NO food NO monitor NO phone NO computer, "
    "just the desk surface with minimal props pushed to the left edge, "
    f"{OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}"
)

print("=" * 60)
print("  Generating cleaner desk (no stapler/donut, open center+right)")
print("=" * 60)

body = {"ai_model": "nano-banana", "prompt": prompt, "aspect_ratio": "16:9"}
resp = requests.post(f"{API_BASE}/text-to-image", headers=HEADERS, json=body, timeout=30)
resp.raise_for_status()
tid = resp.json().get("result")
print(f"  Task ID: {tid}")

out = str(OUT_DIR / "foreground_desk.png")

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
            img_data = requests.get(urls[0], timeout=60)
            with open(out, "wb") as f:
                f.write(img_data.content)
            print(f"  [DONE] foreground_desk.png ({len(img_data.content)//1024}KB)")
        break
    elif st == "FAILED":
        print(f"  [FAIL] {d.get('task_error')}")
        sys.exit(1)
    else:
        print(f"  [{st}] {d.get('progress', 0)}%")
    time.sleep(5)

# Remove background with rembg
print("  Running rembg...")
try:
    from rembg import remove
    img = Image.open(out)
    result = remove(img)
    result.save(out)
    arr = np.array(result)
    transparent_pct = (arr[:, :, 3] == 0).sum() / (arr.shape[0] * arr.shape[1]) * 100
    print(f"  [REMBG] {transparent_pct:.1f}% transparent")
except Exception as e:
    print(f"  [REMBG ERROR] {e}")

# Clean pink fringe
print("  Cleaning pink fringe...")
img = Image.open(out).convert("RGBA")
arr = np.array(img, dtype=np.float32)
r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
pink_mask = (r > 150) & (g < 100) & (b > 80) & (a > 0) & (a < 240)
solid_pink = (r > 180) & (g < 80) & (b > 100) & (b < 220) & (a > 200)
arr[pink_mask, 3] = 0
arr[solid_pink, 3] = 0
edge_pink = (r > 140) & (g < 120) & (b > 80) & (a > 50)
arr[edge_pink, 0] = np.clip(arr[edge_pink, 0] * 0.7, 0, 255)
arr[edge_pink, 2] = np.clip(arr[edge_pink, 2] * 0.8, 0, 255)
Image.fromarray(arr.astype(np.uint8)).save(out)
print("  DONE!")
