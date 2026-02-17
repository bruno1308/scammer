#!/usr/bin/env python3
"""
Generate ambient background animations + 3 worker idle animations via Ludo.ai.

Background animations (from back_wall_empty.png):
  1. Lights flicker — fluorescent lights buzz and flicker
  2. Posters swing — flyers/posters on walls sway gently

Worker animations (from worker_sprite_*.png):
  1. Worker 1 (skinny, white shirt) — typing and drinking from cup
  2. Worker 2 (heavyset, yellow polo) — talking on phone, gesticulating
  3. Worker 3 (young, hoodie) — enjoying music, bobbing/shaking head

Usage: python scripts/generate_ambient_and_worker_anims.py
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
ASSETS = ROOT / "public" / "assets"


def encode_image(path):
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    ext = Path(path).suffix.lower()
    mime = "image/png" if ext == ".png" else "image/jpeg"
    return f"data:{mime};base64,{b64}"


def generate_animation(name, base_path, prompt, frames=49, looping=True):
    print(f"\n{'='*60}")
    print(f"  [{name}] Starting...")
    print(f"  Base: {Path(base_path).name}")
    print(f"  Prompt: {prompt[:80]}...")
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

    print(f"  [{name}] Submitting to Ludo.ai ({frames} frames, loop={looping})...")
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
        print(f"           {json.dumps(result)[:300]}")
        return None

    out = OUTPUT_DIR / f"{name}_spritesheet.png"
    print(f"  [{name}] Downloading spritesheet...")
    img = requests.get(url, timeout=120)
    with open(out, "wb") as f:
        f.write(img.content)

    info = {
        "name": name,
        "output": str(out),
        "num_frames": result.get("num_frames", "?"),
        "num_cols": result.get("num_cols", "?"),
        "num_rows": result.get("num_rows", "?"),
        "frame_width": result.get("frame_width"),
        "frame_height": result.get("frame_height"),
        "size_kb": len(img.content) // 1024,
    }
    print(f"  [{name}] DONE! {info['num_frames']} frames "
          f"({info['num_cols']}x{info['num_rows']} grid), "
          f"frame={info['frame_width']}x{info['frame_height']}, "
          f"{info['size_kb']}KB")
    return info


def main():
    print("=" * 60)
    print("  Ambient + Worker Animations via Ludo.ai")
    print("=" * 60)

    jobs = [
        # --- Background ambient animations ---
        {
            "name": "bg_lights_flicker",
            "base_path": str(ASSETS / "office_v3" / "back_wall_empty.png"),
            "prompt": (
                "Fluorescent ceiling lights flicker and buzz. "
                "Lights blink on and off irregularly, casting shifting shadows. "
                "Some lights dim then brighten. One light stutters rapidly. "
                "The room lighting changes subtly. Everything else stays still."
            ),
        },
        {
            "name": "bg_posters_swing",
            "base_path": str(ASSETS / "office_v3" / "back_wall_empty.png"),
            "prompt": (
                "Papers and flyers pinned to the wall sway gently as if from air conditioning breeze. "
                "Posters flutter slightly at their edges. Subtle paper movement. "
                "The walls and ceiling and lights stay completely still. "
                "Only the papers and flyers move slightly."
            ),
        },
        # --- Worker idle animations ---
        {
            "name": "worker_1_typing",
            "base_path": str(ASSETS / "office_v3" / "worker_sprite_1.png"),
            "prompt": (
                "Office worker typing at keyboard with both hands. "
                "Fingers move across keyboard rapidly. "
                "Occasionally reaches to the side to pick up a cup and take a sip, "
                "then puts it down and continues typing. "
                "Upper body has subtle movement, head stays mostly still looking at screen. "
                "Smooth looping idle animation."
            ),
        },
        {
            "name": "worker_2_phone",
            "base_path": str(ASSETS / "office_v3" / "worker_sprite_2.png"),
            "prompt": (
                "Heavyset man talking animatedly on phone headset. "
                "One hand gestures expressively while talking — waving, pointing, shrugging. "
                "Head tilts and nods during conversation. "
                "Leans back in chair then forward again. "
                "Broad animated gestures with free hand. "
                "Smooth looping idle animation."
            ),
        },
        {
            "name": "worker_3_music",
            "base_path": str(ASSETS / "office_v3" / "worker_sprite_3.png"),
            "prompt": (
                "Young person in hoodie bobbing head to music rhythm. "
                "Head sways side to side and nods to the beat. "
                "Shoulders move slightly with the rhythm. "
                "Occasionally taps fingers on desk to the beat. "
                "Relaxed groovy head-bobbing motion. "
                "Smooth looping idle animation."
            ),
        },
    ]

    results = []
    for job in jobs:
        r = generate_animation(
            name=job["name"],
            base_path=job["base_path"],
            prompt=job["prompt"],
            frames=49,
            looping=True,
        )
        results.append(r)
        # Small delay between calls
        time.sleep(2)

    # Summary
    print("\n" + "=" * 60)
    print("  RESULTS SUMMARY")
    print("=" * 60)
    for r in results:
        if r:
            print(f"  ✓ {r['name']}: {r['num_frames']} frames, "
                  f"{r['num_cols']}x{r['num_rows']} grid, "
                  f"frame={r['frame_width']}x{r['frame_height']}, "
                  f"{r['size_kb']}KB -> {Path(r['output']).name}")
        else:
            print(f"  ✗ FAILED")

    print(f"\n  Output directory: {OUTPUT_DIR}")
    print("\n  Next steps:")
    print("  1. Add spritesheet preloads to BootScene.js")
    print("  2. Replace static images with animated sprites in OfficeScene.js")


if __name__ == "__main__":
    main()
