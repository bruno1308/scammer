#!/usr/bin/env python3
"""
Batch-generate spritesheet animations via Ludo.ai HTTP API.

Reads base frame PNGs (with transparency already applied), submits animation
tasks to POST /assets/sprite/animate, waits for each to complete (synchronous
API, 30-90s per call), and downloads resulting spritesheets.

Settings (from user testing):
  - Model: "new" (higher quality, more dynamic motion)
  - Duration: 4 (fixed for new model)
  - frame_size: 0 (max resolution)
  - margin_ratio_mode: "none" (no margin)
  - crop: false (consistent frame sizes)
  - augment_prompt: false (we have precise prompts)
  - Loop matching: final_image = initial_image for looping anims
  - Skip last frame in Phaser playback to avoid duplicate at loop seam

Usage:
  python scripts/generate_ludo_animations.py            # Generate all
  python scripts/generate_ludo_animations.py 1 3 7      # Generate specific IDs
  python scripts/generate_ludo_animations.py --skip 8 17 # Skip specific IDs
"""

import os
import sys
import json
import time
import base64
import argparse
import requests
from pathlib import Path
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
load_dotenv()
API_KEY = os.getenv("LUDO_API_KEY")
API_URL = "https://api.ludo.ai/api/assets/sprite/animate"
ASSETS_DIR = Path("public/assets")
OUTPUT_DIR = Path("public/assets/spritesheets")
STATUS_FILE = Path("animation_generation_status.json")

HEADERS = {
    "Authorization": f"ApiKey {API_KEY}",
    "Content-Type": "application/json",
}

# ---------------------------------------------------------------------------
# Animation definitions
# ---------------------------------------------------------------------------
# Each animation maps to the table in docs/ludo-api-reference.md
# "looping" controls whether final_image is set and loop=true
ANIMATIONS = [
    {
        "id": 1,
        "name": "light_flicker",
        "base_frame": "office_v2/light_fixture.png",
        "frames": 36,
        "looping": False,
        "prompt": (
            "Fluorescent tube flickers irregularly: bright, dim, bright, off, "
            "bright. Harsh unstable lighting"
        ),
    },
    {
        "id": 4,
        "name": "worker_headset_mid",
        "base_frame": "office_v2/worker_mid.png",
        "frames": 36,
        "looping": True,
        "prompt": (
            "Worker adjusts headset with one hand, slight lean sideways. "
            "Small idle fidget motion"
        ),
    },
    {
        "id": 5,
        "name": "worker_typing_right",
        "base_frame": "office_v2/worker_right.png",
        "frames": 49,
        "looping": True,
        "prompt": (
            "Worker types intensely. More hunched posture, faster hand "
            "motion. Urgent energy"
        ),
    },
    {
        "id": 7,
        "name": "fan_spin",
        "base_frame": "office_v2/desk_fan.png",
        "frames": 64,
        "looping": True,
        "prompt": (
            "Fan blades spin fast and continuously. Cage stays still, blades "
            "become a motion blur circle"
        ),
    },
    {
        "id": 9,
        "name": "paper_flutter",
        "base_frame": "office_v2/loose_papers.png",
        "frames": 36,
        "looping": True,
        "prompt": (
            "Papers slightly lift and settle from a gentle breeze. Soft "
            "flutter, edges curling up then back down"
        ),
    },
    {
        "id": 10,
        "name": "cable_sway",
        "base_frame": "office_v2/hanging_cable.png",
        "frames": 49,
        "looping": True,
        "prompt": (
            "Hanging cable swings gently like a slow pendulum. Lazy arc "
            "back and forth"
        ),
    },
    {
        "id": 11,
        "name": "crt_shimmer",
        "base_frame": "office_v2/main_monitor.png",
        "frames": 36,
        "looping": True,
        "prompt": (
            "CRT screen shows subtle rolling scanline and slight static "
            "glitch. Faint screen flicker"
        ),
    },
    {
        "id": 16,
        "name": "smoke_wisp_rise",
        "base_frame": "office_v2/smoke_wisp.png",
        "frames": 49,
        "looping": True,
        "prompt": (
            "Thin smoke tendril rises and curls upward, gradually "
            "dissipating. Organic flowing wisp"
        ),
    },
    {
        "id": 18,
        "name": "tape_recorder_reels",
        "base_frame": "ui/tape_recorder.png",
        "frames": 64,
        "looping": True,
        "prompt": (
            "Both cassette tape reels spin steadily. Tape moves between "
            "reels. Smooth continuous rotation"
        ),
    },
    {
        "id": 19,
        "name": "receipt_tape_feed",
        "base_frame": "ui/receipt_tape.png",
        "frames": 25,
        "looping": False,
        "prompt": (
            "Paper receipt advances upward in a short burst. A new line "
            "appears as tape feeds out of machine"
        ),
    },
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def encode_image_base64(path: Path) -> str:
    """Read a PNG and return a data URI string."""
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    return f"data:image/png;base64,{b64}"


def build_payload(anim: dict, img_b64: str) -> dict:
    """Build the AnimateSpritePayload for a single animation."""
    payload = {
        "motion_prompt": anim["prompt"],
        "initial_image": img_b64,
        "model": "new",
        "duration": 4,
        "frames": anim["frames"],
        "frame_size": 0,
        "margin_ratio_mode": "none",
        "crop": False,
        "loop": anim["looping"],
        "image_type": "sprite",
        "pixel_art_filter": "none",
        "augment_prompt": False,
        "gif": False,
        "individual_frames": False,
    }
    # For looping animations, set final_image = initial_image for loop matching
    if anim["looping"]:
        payload["final_image"] = img_b64
    return payload


def download_file(url: str, dest: Path) -> None:
    """Download a file from URL to local path."""
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    dest.parent.mkdir(parents=True, exist_ok=True)
    with open(dest, "wb") as f:
        f.write(resp.content)


def load_status() -> dict:
    """Load generation status from disk (for resume support)."""
    if STATUS_FILE.exists():
        with open(STATUS_FILE, "r") as f:
            return json.load(f)
    return {}


def save_status(status: dict) -> None:
    """Persist generation status to disk."""
    with open(STATUS_FILE, "w") as f:
        json.dump(status, f, indent=2)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def generate_animation(anim: dict, status: dict) -> bool:
    """
    Generate a single animation. Returns True on success, False on failure.
    The API is synchronous — blocks for 30-90 seconds and returns the result.
    """
    anim_id = str(anim["id"])
    name = anim["name"]

    # Skip if already successfully generated
    if status.get(anim_id, {}).get("status") == "succeeded":
        print(f"  [#{anim['id']}] {name} — already done, skipping")
        return True

    # Verify base frame exists
    img_path = ASSETS_DIR / anim["base_frame"]
    if not img_path.exists():
        print(f"  [#{anim['id']}] {name} — ERROR: base frame not found: {img_path}")
        status[anim_id] = {"status": "error", "error": f"Base frame not found: {img_path}"}
        save_status(status)
        return False

    # Encode image
    print(f"  [#{anim['id']}] {name} — encoding base frame...")
    img_b64 = encode_image_base64(img_path)

    # Build payload
    payload = build_payload(anim, img_b64)
    loop_str = "loop" if anim["looping"] else "one-shot"
    print(
        f"  [#{anim['id']}] {name} — submitting ({anim['frames']} frames, "
        f"{loop_str}, new model)..."
    )

    # Submit — this blocks for 30-90 seconds
    try:
        resp = requests.post(
            API_URL,
            headers=HEADERS,
            json=payload,
            timeout=300,  # 5 min generous timeout
        )
    except requests.Timeout:
        print(f"  [#{anim['id']}] {name} — ERROR: request timed out (300s)")
        status[anim_id] = {"status": "error", "error": "Request timed out"}
        save_status(status)
        return False
    except requests.RequestException as e:
        print(f"  [#{anim['id']}] {name} — ERROR: request failed: {e}")
        status[anim_id] = {"status": "error", "error": str(e)}
        save_status(status)
        return False

    # Check response
    if resp.status_code != 200:
        error_msg = resp.text[:500]
        print(f"  [#{anim['id']}] {name} — ERROR: HTTP {resp.status_code}: {error_msg}")
        status[anim_id] = {
            "status": "error",
            "http_status": resp.status_code,
            "error": error_msg,
        }
        save_status(status)
        return False

    result = resp.json()
    spritesheet_url = result.get("spritesheet_url")
    if not spritesheet_url:
        print(f"  [#{anim['id']}] {name} — ERROR: no spritesheet_url in response")
        print(f"           Response: {json.dumps(result)[:500]}")
        status[anim_id] = {"status": "error", "error": "No spritesheet_url", "response": result}
        save_status(status)
        return False

    # Download spritesheet
    output_path = OUTPUT_DIR / f"{name}_spritesheet.png"
    print(f"  [#{anim['id']}] {name} — downloading spritesheet...")
    try:
        download_file(spritesheet_url, output_path)
    except Exception as e:
        print(f"  [#{anim['id']}] {name} — ERROR: download failed: {e}")
        status[anim_id] = {
            "status": "error",
            "error": f"Download failed: {e}",
            "spritesheet_url": spritesheet_url,
        }
        save_status(status)
        return False

    # Record success
    num_frames = result.get("num_frames", "?")
    num_cols = result.get("num_cols", "?")
    num_rows = result.get("num_rows", "?")
    print(
        f"  [#{anim['id']}] {name} — done! "
        f"{num_frames} frames ({num_cols}x{num_rows} grid) -> {output_path}"
    )

    status[anim_id] = {
        "status": "succeeded",
        "output": str(output_path),
        "spritesheet_url": spritesheet_url,
        "video_url": result.get("video_url"),
        "num_frames": num_frames,
        "num_cols": num_cols,
        "num_rows": num_rows,
    }
    save_status(status)
    return True


def main():
    parser = argparse.ArgumentParser(description="Generate spritesheet animations via Ludo.ai API")
    parser.add_argument("ids", nargs="*", type=int, help="Specific animation IDs to generate")
    parser.add_argument("--skip", nargs="*", type=int, default=[], help="Animation IDs to skip")
    parser.add_argument("--retry-failed", action="store_true", help="Retry previously failed animations")
    args = parser.parse_args()

    if not API_KEY:
        print("ERROR: LUDO_API_KEY not found in .env file")
        sys.exit(1)

    # Filter animations based on args
    if args.ids:
        anims = [a for a in ANIMATIONS if a["id"] in args.ids]
    else:
        anims = [a for a in ANIMATIONS if a["id"] not in args.skip]

    if not anims:
        print("No animations to generate.")
        sys.exit(0)

    # Load status for resume support
    status = load_status()

    # If --retry-failed, clear failed entries
    if args.retry_failed:
        for anim in anims:
            aid = str(anim["id"])
            if status.get(aid, {}).get("status") == "error":
                del status[aid]
        save_status(status)

    # Output dir
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Summary
    total = len(anims)
    already_done = sum(1 for a in anims if status.get(str(a["id"]), {}).get("status") == "succeeded")
    to_generate = total - already_done
    credits_needed = to_generate * 5

    print("=" * 64)
    print("  Ludo.ai Spritesheet Animation Generator")
    print(f"  Total animations: {total}")
    print(f"  Already completed: {already_done}")
    print(f"  To generate: {to_generate}")
    print(f"  Estimated credits: {credits_needed} ({to_generate} x 5)")
    print(f"  Estimated time: {to_generate * 60}-{to_generate * 90} seconds")
    print(f"  Output directory: {OUTPUT_DIR}")
    print("=" * 64)
    print()

    if to_generate == 0:
        print("All animations already generated. Use --retry-failed to redo failures.")
        sys.exit(0)

    succeeded = 0
    failed = 0

    for i, anim in enumerate(anims):
        print(f"\n  [{i + 1}/{total}] Processing #{anim['id']}: {anim['name']}")
        t0 = time.time()
        ok = generate_animation(anim, status)
        elapsed = time.time() - t0

        if ok:
            if elapsed > 1:  # Only count as active generation if it took time
                succeeded += 1
                print(f"           Completed in {elapsed:.1f}s")
        else:
            failed += 1
            print(f"           Failed after {elapsed:.1f}s")

        # Brief pause between API calls to be polite
        if i < len(anims) - 1 and elapsed > 1:
            time.sleep(2)

    print()
    print("=" * 64)
    print("  GENERATION COMPLETE")
    print(f"  Succeeded: {succeeded}")
    print(f"  Failed:    {failed}")
    print(f"  Skipped:   {total - succeeded - failed}")
    print(f"  Output:    {OUTPUT_DIR}")
    print("=" * 64)

    if failed > 0:
        print("\n  Failed animations can be retried with: python scripts/generate_ludo_animations.py --retry-failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
