#!/usr/bin/env python3
"""
Generate FIXED empty office background (16:9 via t2i) + re-do workers 1 & 3.

Worker 2 was good, so we keep it. Worker 1 was faded, worker 3 had bad bg removal.

Usage: python scripts/generate_bg_and_workers_v2.py
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


def main():
    print("=" * 60)
    print("  OFFICE V3 v2 -- Fixed Background + Workers 1 & 3")
    print("=" * 60)

    submitted = []

    # 1. Empty background via TEXT-TO-IMAGE (16:9 aspect ratio!)
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
    print("\n[SUBMIT] back_wall_empty.png (TEXT-TO-IMAGE 16:9)...")
    tid = submit_t2i(bg_prompt, "16:9")
    if tid:
        submitted.append((tid, str(OUT_DIR / "back_wall_empty.png"), "text-to-image", False))
        print(f"  -> Task ID: {tid}")
    time.sleep(1)

    # 2. Worker 1 redo - use i2i from worker_sprite_2 as style reference (it was good)
    w2_path = str(OUT_DIR / "worker_sprite_2.png")
    ref_exists = Path(w2_path).exists()

    w1_prompt = (
        "Single scam call center worker seen from behind, hunched over desk typing furiously, "
        "upper body from waist up, wearing wrinkled white dress shirt with sweat stains, "
        "bulky headset on head, bad posture, surrounded by messy desk with papers, "
        "the worker and desk as one unit, "
        f"{OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}"
    )
    print("\n[SUBMIT] worker_sprite_1.png (redo)...")
    if ref_exists:
        tid = submit_i2i(w1_prompt, [w2_path])
    else:
        tid = submit_t2i(w1_prompt, "1:1")
    if tid:
        api = "image-to-image" if ref_exists else "text-to-image"
        submitted.append((tid, str(OUT_DIR / "worker_sprite_1.png"), api, True))
        print(f"  -> Task ID: {tid}")
    time.sleep(1)

    # 3. Worker 3 redo - different look from worker 2
    w3_prompt = (
        "Single scam call center worker seen from behind, leaning back in chair stretching, "
        "upper body from waist up, wearing dark hoodie, "
        "headset around neck, one hand on mouse, energy drink on desk, "
        "the worker and desk as one unit, "
        f"{OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}"
    )
    print("\n[SUBMIT] worker_sprite_3.png (redo)...")
    if ref_exists:
        tid = submit_i2i(w3_prompt, [w2_path])
    else:
        tid = submit_t2i(w3_prompt, "1:1")
    if tid:
        api = "image-to-image" if ref_exists else "text-to-image"
        submitted.append((tid, str(OUT_DIR / "worker_sprite_3.png"), api, True))
        print(f"  -> Task ID: {tid}")

    if not submitted:
        print("\nNo tasks submitted!")
        sys.exit(1)

    # Poll
    print(f"\n[STEP 2] Polling {len(submitted)} tasks...")
    poll_tasks = [(tid, out, api) for tid, out, api, _ in submitted]
    poll_all(poll_tasks)

    # Background removal on workers
    print("\n" + "=" * 60)
    print("  Post-processing: rembg on worker sprites")
    print("=" * 60 + "\n")

    for _, out, _, needs_rembg in submitted:
        if needs_rembg and Path(out).exists():
            remove_background(out)

    print("\n" + "=" * 60)
    print("  DONE!")
    print("=" * 60)


if __name__ == "__main__":
    main()
