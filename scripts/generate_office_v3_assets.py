#!/usr/bin/env python3
"""
Generate replacement office assets with consistent camera angle.

Canonical camera: seated eye-level (~1.2m), ~10-degree downward pitch,
centered perspective, first-person desk view.

Meshy cannot generate alpha channels, so overlay assets use a solid
magenta (#FF00FF) background that gets chroma-keyed out in post-processing.

Usage: python scripts/generate_office_v3_assets.py
"""

import os, sys, json, time, base64, requests
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

OUT_DIR = ROOT / "public/assets/office_v3"
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
    "Negative: top-down view, isometric, bird's-eye, side view, elevated camera, "
    "strategy game angle, gray background, white background"
)
# Magenta background for overlay assets (chroma-keyed out in post-processing)
MAGENTA_BG = "on solid bright magenta pink #FF00FF background, single object centered"


# ── API Helpers ──────────────────────────────────────────────────────────────
def encode_image(path):
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode()
    ext = Path(path).suffix.lower().lstrip(".")
    if ext == "jpg":
        ext = "jpeg"
    return f"data:image/{ext};base64,{data}"


def submit_t2i(prompt, ratio="1:1"):
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


# ── Chroma-Key Post-Processing ───────────────────────────────────────────────
def chroma_key_magenta(filepath, tolerance=80):
    """
    Replace magenta (#FF00FF) background with transparency.

    Pixels where R > 200, G < tolerance, B > 200 are made fully transparent.
    Edge pixels get partial alpha for anti-aliasing.
    """
    img = Image.open(filepath).convert("RGBA")
    arr = np.array(img, dtype=np.float32)

    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

    # Core magenta mask: high R, low G, high B
    magenta_mask = (r > 180) & (g < tolerance) & (b > 180)

    # Distance from pure magenta for edge anti-aliasing
    dist = np.sqrt((r - 255) ** 2 + g ** 2 + (b - 255) ** 2)

    # Hard key: anything very close to magenta
    hard_mask = dist < 60
    # Soft edge: partial transparency for anti-aliasing
    soft_mask = (dist >= 60) & (dist < 120) & magenta_mask

    arr[hard_mask, 3] = 0  # Fully transparent
    arr[soft_mask, 3] = np.clip((dist[soft_mask] - 60) / 60 * 255, 0, 255)  # Gradient

    result = Image.fromarray(arr.astype(np.uint8))
    result.save(filepath)
    print(f"  [KEYED] {Path(filepath).name}: magenta removed")


# ── Asset Definitions ────────────────────────────────────────────────────────
# (api_type, filename, prompt, ratio, refs, needs_chroma_key)
ASSETS = []

# 1. Foreground desk — THE CRITICAL FIX (was "from above at slight angle")
ASSETS.append((
    "text-to-image",
    "public/assets/office_v3/foreground_desk.png",
    (
        f"Close-up of a worn office desk surface, {CAMERA}, desk surface occupying "
        "lower 35 to 45 percent of frame, front desk edge visible at bottom, "
        "scratched laminate top, coffee ring stains, scattered sticky notes, "
        "pen cup with cheap pens, crumpled papers, small desk calendar, "
        "slightly messy corporate desk, front edge and sides visible, "
        f"{OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}"
    ),
    "16:9", [], True
))

# 2. CRT Monitor — solid, front view, at seated eye level
ASSETS.append((
    "text-to-image",
    "public/assets/office_v3/main_monitor.png",
    (
        f"Large old CRT computer monitor, {CAMERA}, bulky beige-gray plastic casing, "
        "dark screen with faint green scanlines, small green power LED, "
        "chunky beveled frame, slightly yellowed with age, dust in vents, "
        "heavy boxy 1990s design on swivel base, solid opaque object, "
        f"{OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}"
    ),
    "1:1", [], True
))

# 3. Office phone — seen from seated position looking slightly down
ASSETS.append((
    "text-to-image",
    "public/assets/office_v3/phone.png",
    (
        f"Office desk telephone, {CAMERA}, multi-line office phone, "
        "number pad with worn buttons, small LCD display showing green text, "
        "dark gray plastic body, coiled cord hanging off side, "
        "boxy 1990s office phone, slightly grimy from heavy use, "
        f"{OFFICE_STYLE}, {MAGENTA_BG}. {NEGATIVE}"
    ),
    "1:1", [], True
))

# 4. Back wall WITH workers, WITHOUT foreground desk/counter
#    Full scene — NO magenta bg needed (opaque background image)
ASSETS.append((
    "image-to-image",
    "public/assets/office_v3/back_wall_workers.png",
    (
        f"Dark scam call center office interior, {CAMERA}, "
        "rear wall showing rows of desks with silhouetted workers hunched over glowing monitors, "
        "overhead fluorescent tube lights casting sickly teal-green light cones, "
        "warehouse ceiling with exposed pipes and cable trays, grimy stained walls, "
        "cheesy motivational posters hanging crooked, overflowing trash bins, "
        "NO foreground desk, NO counter at bottom, scene shows only the BACK of the room "
        "as seen from the player desk, workers are 10 to 15 feet away, "
        f"{OFFICE_STYLE}. {NEGATIVE}"
    ),
    "16:9",
    [str(ROOT / "public/assets/office_v2/back_wall_no_desk.png")],
    False
))


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print(f"{'=' * 60}")
    print(f"  OFFICE V3 — Angle-Consistent Asset Generation")
    print(f"  {len(ASSETS)} assets to generate via Meshy API")
    print(f"{'=' * 60}\n")

    submitted = []  # (task_id, output_path, api_type, needs_key)

    for api_type, filename, prompt, ratio, refs, needs_key in ASSETS:
        out = str(ROOT / filename)
        print(f"[SUBMIT] {Path(filename).name}...")

        if api_type == "text-to-image":
            tid = submit_t2i(prompt, ratio)
        else:
            tid = submit_i2i(prompt, refs)

        if tid:
            submitted.append((tid, out, api_type, needs_key))
            print(f"  -> Task ID: {tid}")
        else:
            print(f"  -> SKIPPED (submission failed)")

        time.sleep(1)

    if not submitted:
        print("\nNo tasks submitted. Check API key and network.")
        sys.exit(1)

    # Poll and download
    poll_tasks = [(tid, out, api) for tid, out, api, _ in submitted]
    poll_all(poll_tasks)

    # Chroma-key magenta backgrounds
    print(f"\n{'=' * 60}")
    print("  Post-processing: chroma-key magenta backgrounds")
    print(f"{'=' * 60}\n")

    for _, out, _, needs_key in submitted:
        if needs_key and Path(out).exists():
            chroma_key_magenta(out)

    print(f"\n{'=' * 60}")
    print("  DONE! Assets saved to public/assets/office_v3/")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
