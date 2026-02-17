#!/usr/bin/env python3
"""
Generate new empty office background (16:9, 1920x1080) and 3 isolated worker sprites.

Workers are generated via image-to-image using crops from back_wall_workers.png
as style reference. Background removal via rembg applied to worker sprites.

Usage: python scripts/generate_bg_and_workers.py
"""

import os, sys, time, base64, requests
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
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ── Style Constants ──────────────────────────────────────────────────────────
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
    "strategy game angle, gray background, white background"
)
MAGENTA_BG = "on solid bright magenta pink FF00FF background, single object centered"


# ── API Helpers ──────────────────────────────────────────────────────────────
def encode_image(path):
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode()
    ext = Path(path).suffix.lower().lstrip(".")
    if ext == "jpg":
        ext = "jpeg"
    return f"data:image/{ext};base64,{data}"


def submit_t2i(prompt, ratio="16:9"):
    body = {"ai_model": "nano-banana", "prompt": prompt, "aspect_ratio": ratio}
    try:
        resp = requests.post(f"{API_BASE}/text-to-image", headers=HEADERS, json=body, timeout=30)
        resp.raise_for_status()
        return resp.json().get("result")
    except Exception as e:
        print(f"  [ERROR] {e}")
        return None


def submit_i2i(prompt, refs):
    ref_uris = [encode_image(p) for p in refs]
    body = {"ai_model": "nano-banana", "prompt": prompt, "reference_image_urls": ref_uris}
    try:
        resp = requests.post(f"{API_BASE}/image-to-image", headers=HEADERS, json=body, timeout=60)
        resp.raise_for_status()
        return resp.json().get("result")
    except Exception as e:
        print(f"  [ERROR] {e}")
        return None


def poll_all(tasks, interval=8):
    pending = {tid: (out, api) for tid, out, api in tasks}
    while pending:
        for tid in list(pending):
            out, api = pending[tid]
            try:
                r = requests.get(
                    f"{API_BASE}/{api}/{tid}",
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
                        print(f"  [DONE] {Path(out).name} ({len(img.content)//1024}KB)")
                    del pending[tid]
                elif st == "FAILED":
                    print(f"  [FAIL] {Path(out).name}: {d.get('task_error')}")
                    del pending[tid]
                else:
                    print(f"  [{st}] {Path(out).name} {d.get('progress', 0)}%")
            except Exception as e:
                print(f"  [ERR] {e}")
        if pending:
            print(f"  ... {len(pending)} remaining, waiting {interval}s ...")
            time.sleep(interval)


def remove_background(filepath):
    """Remove background using rembg."""
    try:
        from rembg import remove
        img = Image.open(filepath)
        result = remove(img)
        result.save(filepath)
        arr = np.array(result)
        if arr.shape[2] == 4:
            transparent_pct = (arr[:, :, 3] == 0).sum() / (arr.shape[0] * arr.shape[1]) * 100
            print(f"  [REMBG] {Path(filepath).name}: {transparent_pct:.1f}% transparent")
        return True
    except Exception as e:
        print(f"  [REMBG ERROR] {Path(filepath).name}: {e}")
        return False


# ── Crop Workers from back_wall_workers.png ──────────────────────────────────
def crop_workers():
    """Crop 3 worker regions from back_wall_workers.png as style references."""
    src = OUT_DIR / "back_wall_workers.png"
    if not src.exists():
        print(f"  [WARN] back_wall_workers.png not found, skipping crops")
        return []

    img = Image.open(src)
    w, h = img.size
    print(f"  Source: {w}x{h}")

    # Crop upper-body regions of workers visible in the background
    # These are approximate regions - left worker, middle worker, right worker
    crops = [
        ("worker_crop_left.png",  (int(w*0.05), int(h*0.20), int(w*0.30), int(h*0.70))),
        ("worker_crop_mid.png",   (int(w*0.35), int(h*0.20), int(w*0.65), int(h*0.70))),
        ("worker_crop_right.png", (int(w*0.70), int(h*0.20), int(w*0.95), int(h*0.70))),
    ]

    paths = []
    for name, box in crops:
        out = OUT_DIR / name
        cropped = img.crop(box)
        cropped.save(out)
        print(f"  [CROP] {name}: {cropped.size[0]}x{cropped.size[1]}")
        paths.append(str(out))

    return paths


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  OFFICE V3 — Empty Background + Worker Sprites")
    print("=" * 60)

    # Step 1: Crop workers for style reference
    print("\n[STEP 1] Cropping worker regions from back_wall_workers.png...")
    crop_paths = crop_workers()

    # Step 2: Submit all generation tasks
    print("\n[STEP 2] Submitting Meshy generation tasks...")

    submitted = []  # (task_id, output_path, api_type, needs_rembg)

    # 2a. Empty background (16:9) - no workers, just the room
    bg_prompt = (
        f"Dark scam call center office interior, {CAMERA}, "
        "rear wall showing rows of empty desks with glowing computer monitors but NO PEOPLE, "
        "overhead fluorescent tube lights casting sickly teal-green light cones, "
        "warehouse ceiling with exposed pipes and cable trays, grimy stained walls, "
        "cheesy motivational posters hanging crooked, overflowing trash bins, "
        "empty office with no workers no humans no people, "
        "NO foreground desk, NO counter at bottom, scene shows only the BACK of the room "
        "as seen from the player desk, desks are 10 to 15 feet away, "
        f"{OFFICE_STYLE}. {NEGATIVE}"
    )
    bg_out = str(OUT_DIR / "back_wall_empty.png")
    print(f"\n[SUBMIT] back_wall_empty.png (16:9 empty background)...")

    # Use i2i with the existing back_wall_workers as style reference
    if crop_paths:
        bg_tid = submit_i2i(bg_prompt, [str(OUT_DIR / "back_wall_workers.png")])
    else:
        bg_tid = submit_t2i(bg_prompt, "16:9")

    if bg_tid:
        submitted.append((bg_tid, bg_out, "image-to-image" if crop_paths else "text-to-image", False))
        print(f"  -> Task ID: {bg_tid}")
    else:
        print("  -> SKIPPED")

    time.sleep(1)

    # 2b. Worker sprites (3x) via image-to-image from crops
    worker_defs = [
        (
            "worker_sprite_1.png",
            "Single office worker hunched over desk typing on keyboard, "
            "upper body visible from waist up, wearing wrinkled dress shirt, "
            "headset on head, tired slouched posture, seen from behind at slight angle, "
            f"{CAMERA}, {OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}",
            0  # crop index
        ),
        (
            "worker_sprite_2.png",
            "Single office worker sitting at desk talking on phone, "
            "upper body visible from waist up, wearing cheap polo shirt, "
            "phone pressed to ear, leaning back slightly, seen from behind, "
            f"{CAMERA}, {OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}",
            1
        ),
        (
            "worker_sprite_3.png",
            "Single office worker hunched over desk staring at monitor, "
            "upper body visible from waist up, wearing hoodie, "
            "adjusting headset with one hand, tense posture, seen from behind, "
            f"{CAMERA}, {OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}",
            2
        ),
    ]

    for fname, prompt, crop_idx in worker_defs:
        out = str(OUT_DIR / fname)
        print(f"\n[SUBMIT] {fname} (worker sprite via i2i)...")

        if crop_paths and crop_idx < len(crop_paths):
            tid = submit_i2i(prompt, [crop_paths[crop_idx]])
        else:
            tid = submit_t2i(prompt, "1:1")

        if tid:
            api = "image-to-image" if (crop_paths and crop_idx < len(crop_paths)) else "text-to-image"
            submitted.append((tid, out, api, True))
            print(f"  -> Task ID: {tid}")
        else:
            print("  -> SKIPPED")

        time.sleep(1)

    if not submitted:
        print("\nNo tasks submitted. Check API key and network.")
        sys.exit(1)

    # Step 3: Poll and download
    print(f"\n[STEP 3] Polling {len(submitted)} tasks...")
    poll_tasks = [(tid, out, api) for tid, out, api, _ in submitted]
    poll_all(poll_tasks)

    # Step 4: Background removal on worker sprites
    print("\n" + "=" * 60)
    print("  Post-processing: background removal on worker sprites")
    print("=" * 60 + "\n")

    for _, out, _, needs_rembg in submitted:
        if needs_rembg and Path(out).exists():
            remove_background(out)

    # Cleanup temp crops
    for name in ["worker_crop_left.png", "worker_crop_mid.png", "worker_crop_right.png"]:
        p = OUT_DIR / name
        if p.exists():
            p.unlink()
            print(f"  [CLEANUP] Removed {name}")

    print("\n" + "=" * 60)
    print("  DONE! New assets in public/assets/office_v3/")
    print("=" * 60)


if __name__ == "__main__":
    main()
