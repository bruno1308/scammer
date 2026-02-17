#!/usr/bin/env python3
"""
Generate background ambient animations via Ludo.ai from the squared background.
Then crop each frame back to 16:9 aspect ratio.

Usage: python scripts/generate_bg_anims.py
"""

import os, sys, json, time, base64, requests
from pathlib import Path
from PIL import Image
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("LUDO_API_KEY")
if not API_KEY:
    print("ERROR: LUDO_API_KEY not found in .env")
    sys.exit(1)

API_URL = "https://api.ludo.ai/api/assets/sprite/animate"
HEADERS = {
    "Authorization": f"ApiKey {API_KEY}",
    "Content-Type": "application/json",
}
OUTPUT_DIR = ROOT / "public" / "assets" / "spritesheets"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
ASSETS = ROOT / "public" / "assets"


def encode_image(path):
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    return f"data:image/png;base64,{b64}"


def generate_animation(name, base_path, prompt, frames=49, looping=True):
    print(f"\n{'='*60}")
    print(f"  [{name}] Submitting to Ludo.ai...")
    print(f"{'='*60}")

    img_b64 = encode_image(base_path)
    payload = {
        "motion_prompt": prompt,
        "initial_image": img_b64,
        "model": "new",
        "duration": 4,
        "frames": frames,
        "frame_size": 0,
        "margin_ratio_mode": "none",
        "crop": False,
        "loop": looping,
        "image_type": "sprite",
        "pixel_art_filter": "none",
        "augment_prompt": False,
        "gif": False,
        "individual_frames": False,
    }
    if looping:
        payload["final_image"] = img_b64

    t0 = time.time()
    try:
        resp = requests.post(API_URL, headers=HEADERS, json=payload, timeout=600)
    except Exception as e:
        print(f"  [{name}] ERROR: {e}")
        return None

    elapsed = time.time() - t0
    print(f"  [{name}] Response in {elapsed:.0f}s (HTTP {resp.status_code})")

    if resp.status_code != 200:
        print(f"  [{name}] ERROR: {resp.text[:500]}")
        return None

    result = resp.json()
    url = result.get("spritesheet_url")
    if not url:
        print(f"  [{name}] ERROR: no spritesheet_url")
        return None

    out = OUTPUT_DIR / f"{name}_spritesheet.png"
    print(f"  [{name}] Downloading...")
    img = requests.get(url, timeout=120)
    with open(out, "wb") as f:
        f.write(img.content)

    print(f"  [{name}] DONE! {result.get('num_frames')} frames, "
          f"{result.get('num_cols')}x{result.get('num_rows')} grid, "
          f"{len(img.content)//1024}KB -> {out.name}")
    return str(out)


def crop_spritesheet_to_16x9(spritesheet_path, cols=7, rows=7):
    """Crop each frame in the spritesheet from square back to 16:9 (remove padding)."""
    print(f"\n  Cropping {Path(spritesheet_path).name} to 16:9 frames...")
    sheet = Image.open(spritesheet_path)
    fw = sheet.width // cols
    fh = sheet.height // rows

    # Original image was 1344x768 padded to 1344x1344
    # In the spritesheet each frame is fw x fh (square)
    # The actual content is in the center 16:9 band
    # Ratio: 768/1344 = 0.5714 of the square height
    content_ratio = 768 / 1344
    crop_h = int(fh * content_ratio)
    y_offset = (fh - crop_h) // 2

    new_fh = crop_h
    new_sheet = Image.new("RGBA", (fw * cols, new_fh * rows), (0, 0, 0, 0))

    for r in range(rows):
        for c in range(cols):
            x = c * fw
            y = r * fh + y_offset
            frame = sheet.crop((x, y, x + fw, y + crop_h))
            new_sheet.paste(frame, (c * fw, r * new_fh))

    new_sheet.save(spritesheet_path)
    print(f"  Cropped: frame {fw}x{fh} -> {fw}x{new_fh}, sheet={new_sheet.size}")
    return fw, new_fh


def main():
    print("=" * 60)
    print("  Background Ambient Animations via Ludo.ai")
    print("=" * 60)

    base = str(ASSETS / "office_v3" / "back_wall_square.png")

    # 1. Lights flicker
    r1 = generate_animation(
        name="bg_lights_flicker",
        base_path=base,
        prompt=(
            "Fluorescent ceiling lights flicker and buzz irregularly. "
            "Some lights dim then brighten, one light stutters rapidly. "
            "Shifting shadows on walls from flickering lights. "
            "Only the lighting changes, everything else stays perfectly still."
        ),
    )

    time.sleep(2)

    # 2. Posters swing
    r2 = generate_animation(
        name="bg_posters_swing",
        base_path=base,
        prompt=(
            "Papers and flyers on the walls sway gently from air conditioning breeze. "
            "Posters flutter at their edges, paper movement is subtle. "
            "Walls, ceiling, and lights stay completely still. "
            "Only loose papers and flyers move."
        ),
    )

    # Crop spritesheets back to 16:9
    for path in [r1, r2]:
        if path:
            crop_spritesheet_to_16x9(path)

    print("\n  DONE!")


if __name__ == "__main__":
    main()
