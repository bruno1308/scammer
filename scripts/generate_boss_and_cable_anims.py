#!/usr/bin/env python3
"""
Generate boss walk cycle and cable swing animations via Ludo.ai.

Usage: python scripts/generate_boss_and_cable_anims.py
"""

import os, sys, json, time, base64, requests
from pathlib import Path
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


def encode_image(path):
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    return f"data:image/png;base64,{b64}"


def generate_animation(name, base_path, prompt, frames, looping):
    print(f"\n  [{name}] Encoding base frame...")
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

    print(f"  [{name}] Submitting to Ludo.ai ({frames} frames, {'loop' if looping else 'one-shot'})...")
    try:
        resp = requests.post(API_URL, headers=HEADERS, json=payload, timeout=300)
    except Exception as e:
        print(f"  [{name}] ERROR: {e}")
        return None

    if resp.status_code != 200:
        print(f"  [{name}] ERROR: HTTP {resp.status_code}: {resp.text[:300]}")
        return None

    result = resp.json()
    url = result.get("spritesheet_url")
    if not url:
        print(f"  [{name}] ERROR: no spritesheet_url in response")
        print(f"           {json.dumps(result)[:300]}")
        return None

    out = OUTPUT_DIR / f"{name}_spritesheet.png"
    print(f"  [{name}] Downloading spritesheet...")
    img = requests.get(url, timeout=120)
    with open(out, "wb") as f:
        f.write(img.content)

    num_frames = result.get("num_frames", "?")
    num_cols = result.get("num_cols", "?")
    num_rows = result.get("num_rows", "?")
    print(f"  [{name}] DONE! {num_frames} frames ({num_cols}x{num_rows} grid) -> {out}")
    return {
        "output": str(out),
        "num_frames": num_frames,
        "num_cols": num_cols,
        "num_rows": num_rows,
        "frame_width": result.get("frame_width"),
        "frame_height": result.get("frame_height"),
    }


def main():
    print("=" * 60)
    print("  Generating Boss Walk + Cable Swing via Ludo.ai")
    print("=" * 60)

    ASSETS = ROOT / "public" / "assets"

    # 1. Boss walk cycle
    boss_result = generate_animation(
        name="boss_walk_cycle",
        base_path=str(ASSETS / "characters" / "boss_full_body.png"),
        prompt=(
            "Character walks forward with confident swagger. Full walk cycle animation. "
            "Arms swing naturally, legs step forward alternately. "
            "Suit jacket sways with movement. Maintain upright posture with slight lean forward. "
            "Smooth looping walk cycle."
        ),
        frames=49,
        looping=True,
    )

    # 2. Cable swing (pendulum, NOT falling)
    cable_result = generate_animation(
        name="cable_sway",
        base_path=str(ASSETS / "office_v2" / "hanging_cable.png"),
        prompt=(
            "Hanging cable swings gently like a slow pendulum. "
            "Cable top stays fixed to ceiling, connector at bottom swings left and right in a lazy arc. "
            "Subtle slow pendulum motion. Cable stays attached at top, only the lower portion sways. "
            "No falling, no dropping, just gentle side to side swing."
        ),
        frames=49,
        looping=True,
    )

    print("\n" + "=" * 60)
    print("  RESULTS")
    print("=" * 60)

    if boss_result:
        print(f"  Boss walk: {boss_result['num_frames']} frames, "
              f"{boss_result['num_cols']}x{boss_result['num_rows']} grid, "
              f"frame: {boss_result.get('frame_width')}x{boss_result.get('frame_height')}")
    else:
        print("  Boss walk: FAILED")

    if cable_result:
        print(f"  Cable sway: {cable_result['num_frames']} frames, "
              f"{cable_result['num_cols']}x{cable_result['num_rows']} grid, "
              f"frame: {cable_result.get('frame_width')}x{cable_result.get('frame_height')}")
    else:
        print("  Cable sway: FAILED")


if __name__ == "__main__":
    main()
