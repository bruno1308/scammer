#!/usr/bin/env python3
"""
Generate:
1. Completely empty desk (no items at all)
2. Three DISTINCT worker sprites (different clothes, body types, poses)

Usage: python scripts/generate_empty_desk_and_workers.py
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
    "strategy game angle, gray background, white background, text, words, letters"
)
MAGENTA_BG = "on solid bright magenta pink FF00FF background"


def submit_t2i(prompt, ratio="16:9"):
    body = {"ai_model": "nano-banana", "prompt": prompt, "aspect_ratio": ratio}
    try:
        resp = requests.post(f"{API_BASE}/text-to-image", headers=HEADERS, json=body, timeout=30)
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
            tp = (arr[:, :, 3] == 0).sum() / (arr.shape[0] * arr.shape[1]) * 100
            print(f"  [REMBG] {Path(filepath).name}: {tp:.1f}% transparent")
    except Exception as e:
        print(f"  [REMBG ERROR] {Path(filepath).name}: {e}")


def clean_pink_fringe(filepath):
    img = Image.open(filepath).convert("RGBA")
    arr = np.array(img, dtype=np.float32)
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    pink_mask = (r > 150) & (g < 100) & (b > 80) & (a > 0) & (a < 240)
    solid_pink = (r > 180) & (g < 80) & (b > 100) & (b < 220) & (a > 200)
    arr[pink_mask, 3] = 0
    arr[solid_pink, 3] = 0
    edge_pink = (r > 140) & (g < 120) & (b > 80) & (a > 50)
    arr[edge_pink, 0] = np.clip(arr[edge_pink, 0] * 0.7, 0, 255)
    arr[edge_pink, 2] = np.clip(arr[edge_pink, 2] * 0.8, 0, 255)
    Image.fromarray(arr.astype(np.uint8)).save(filepath)
    print(f"  [CLEAN] {Path(filepath).name}")


def main():
    print("=" * 60)
    print("  Empty Desk + 3 Distinct Workers")
    print("=" * 60)

    submitted = []  # (tid, out_path, api, needs_rembg)

    # 1. EMPTY DESK — absolutely nothing on it
    desk_prompt = (
        f"Simple worn office desk, {CAMERA}, "
        "scratched beige laminate desktop surface with front edge visible at bottom, "
        "COMPLETELY EMPTY desk surface with NOTHING on it, "
        "no items no objects no pens no papers no cups no stains, "
        "bare clean empty desk top, wooden desk frame with two small drawers below, "
        "slightly dirty and scratched from years of use but surface is bare, "
        f"{OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}, pens, cups, papers, sticky notes, "
        "stapler, donut, food, coffee, stains, items, objects, clutter"
    )
    print("\n[SUBMIT] foreground_desk.png (empty desk)...")
    tid = submit_t2i(desk_prompt, "16:9")
    if tid:
        submitted.append((tid, str(OUT_DIR / "foreground_desk.png"), "text-to-image", True))
        print(f"  -> {tid}")
    time.sleep(1)

    # 2. WORKER 1 — skinny guy, white dress shirt, hunched typing
    w1_prompt = (
        "Single scam call center worker seen from behind at their desk, "
        "SKINNY TALL man with bony shoulders, wearing wrinkled WHITE DRESS SHIRT, "
        "loose tie, headset on head, hunched over keyboard typing furiously, "
        "sitting in a cheap rolling office chair at a small cluttered desk with old CRT monitor, "
        "full body visible from head to feet including chair and desk, "
        f"{CAMERA}, {OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}"
    )
    print("\n[SUBMIT] worker_sprite_1.png (skinny white shirt)...")
    tid = submit_t2i(w1_prompt, "1:1")
    if tid:
        submitted.append((tid, str(OUT_DIR / "worker_sprite_1.png"), "text-to-image", True))
        print(f"  -> {tid}")
    time.sleep(1)

    # 3. WORKER 2 — heavyset, yellow/olive polo, phone to ear
    w2_prompt = (
        "Single scam call center worker seen from behind at their desk, "
        "HEAVYSET STOCKY man with broad back, wearing MUSTARD YELLOW POLO SHIRT, "
        "headset on head, leaning back in chair talking on phone with one hand gesturing, "
        "sitting in a cheap rolling office chair at a small cluttered desk with old CRT monitor, "
        "full body visible from head to feet including chair and desk, "
        f"{CAMERA}, {OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}"
    )
    print("\n[SUBMIT] worker_sprite_2.png (heavyset yellow polo)...")
    tid = submit_t2i(w2_prompt, "1:1")
    if tid:
        submitted.append((tid, str(OUT_DIR / "worker_sprite_2.png"), "text-to-image", True))
        print(f"  -> {tid}")
    time.sleep(1)

    # 4. WORKER 3 — young, dark hoodie, slouched with energy drink
    w3_prompt = (
        "Single scam call center worker seen from behind at their desk, "
        "YOUNG SLIM person wearing DARK GREEN HOODIE with hood down, "
        "headphones around neck, slouched posture staring at screen, "
        "energy drink can on desk, "
        "sitting in a cheap rolling office chair at a small cluttered desk with old CRT monitor, "
        "full body visible from head to feet including chair and desk, "
        f"{CAMERA}, {OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}"
    )
    print("\n[SUBMIT] worker_sprite_3.png (hoodie slouched)...")
    tid = submit_t2i(w3_prompt, "1:1")
    if tid:
        submitted.append((tid, str(OUT_DIR / "worker_sprite_3.png"), "text-to-image", True))
        print(f"  -> {tid}")

    if not submitted:
        print("\nNo tasks submitted!")
        sys.exit(1)

    # Poll all
    print(f"\n[POLLING] {len(submitted)} tasks...")
    poll_tasks = [(tid, out, api) for tid, out, api, _ in submitted]
    poll_all(poll_tasks)

    # Post-processing
    print("\n" + "=" * 60)
    print("  Post-processing")
    print("=" * 60 + "\n")

    for _, out, _, needs_rembg in submitted:
        if needs_rembg and Path(out).exists():
            remove_background(out)
            clean_pink_fringe(out)

    print("\n  DONE!")


if __name__ == "__main__":
    main()
