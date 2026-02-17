"""
Generate all art assets for the Scammer Simulator art overhaul via Meshy API.

Submits text-to-image and image-to-image tasks in parallel, polls for completion,
and downloads results to public/assets/.

Usage: python scripts/generate_art_assets.py
"""

import os
import sys
import json
import time
import base64
import requests
from pathlib import Path
from dotenv import load_dotenv

# ── Setup ──────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("MESHY_API_KEY")
if not API_KEY:
    print("ERROR: MESHY_API_KEY not found in .env")
    sys.exit(1)

API_BASE = "https://api.meshy.ai/openapi/v1"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# Ensure output directories exist
(ROOT / "public/assets/office_v2").mkdir(parents=True, exist_ok=True)
(ROOT / "public/assets/ui").mkdir(parents=True, exist_ok=True)
(ROOT / "public/assets/characters").mkdir(parents=True, exist_ok=True)

# ── Art Style Constants ────────────────────────────────────────────────────────
STYLE = (
    "editorial caricature illustration, MAD Magazine style, heavy black ink outlines "
    "with slight hand-drawn wobble, flat watercolor color washes, paper grain texture, "
    "satirical exaggerated proportions"
)

OFFICE_STYLE = (
    f"{STYLE}, dark moody teal-green atmospheric lighting, grungy stained worn "
    "office aesthetic, grotesque editorial office noir, dingy call center environment"
)

UI_STYLE = (
    f"{STYLE}, game UI element, hand-drawn appearance with ink outlines, "
    "slightly worn and stained paper texture"
)

TRANSPARENT = "isolated on pure transparent background, single object, no background, PNG transparency"


# ── Helper Functions ───────────────────────────────────────────────────────────
def encode_image(path):
    """Convert a local image to base64 data URI for Meshy image-to-image."""
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode()
    ext = Path(path).suffix.lower().lstrip(".")
    if ext == "jpg":
        ext = "jpeg"
    return f"data:image/{ext};base64,{data}"


def submit_text_to_image(prompt, aspect_ratio="1:1"):
    """Submit a text-to-image task, return task ID or None."""
    body = {
        "ai_model": "nano-banana",
        "prompt": prompt,
        "aspect_ratio": aspect_ratio,
    }
    try:
        resp = requests.post(f"{API_BASE}/text-to-image", headers=HEADERS, json=body, timeout=30)
        resp.raise_for_status()
        tid = resp.json().get("result")
        return tid
    except Exception as e:
        print(f"  [ERROR] Submit failed: {e}")
        return None


def submit_image_to_image(prompt, reference_paths):
    """Submit an image-to-image task with local file references, return task ID or None."""
    refs = [encode_image(p) for p in reference_paths]
    body = {
        "ai_model": "nano-banana",
        "prompt": prompt,
        "reference_image_urls": refs,
    }
    try:
        resp = requests.post(f"{API_BASE}/image-to-image", headers=HEADERS, json=body, timeout=60)
        resp.raise_for_status()
        tid = resp.json().get("result")
        return tid
    except Exception as e:
        print(f"  [ERROR] Submit failed: {e}")
        return None


def poll_and_download(tasks, poll_interval=8):
    """
    Poll all tasks until done. tasks = list of (task_id, output_path, api_type).
    Downloads results on success.
    """
    pending = {tid: (out, api) for tid, out, api in tasks}
    failed = []
    succeeded = []

    print(f"\n{'='*60}")
    print(f"Polling {len(pending)} tasks...")
    print(f"{'='*60}\n")

    while pending:
        for tid in list(pending.keys()):
            out, api = pending[tid]
            try:
                resp = requests.get(
                    f"{API_BASE}/{api}/{tid}",
                    headers={"Authorization": f"Bearer {API_KEY}"},
                    timeout=30,
                )
                data = resp.json()
                status = data.get("status", "UNKNOWN")
                progress = data.get("progress", 0)

                if status == "SUCCEEDED":
                    urls = data.get("image_urls", [])
                    if urls:
                        img_resp = requests.get(urls[0], timeout=60)
                        with open(out, "wb") as f:
                            f.write(img_resp.content)
                        print(f"  [DONE] {Path(out).name} ({len(img_resp.content)//1024}KB)")
                        succeeded.append(out)
                    else:
                        print(f"  [WARN] {Path(out).name}: No image URLs in response")
                        failed.append((out, "no URLs"))
                    del pending[tid]

                elif status == "FAILED":
                    err = data.get("task_error", {})
                    msg = err.get("message", str(err)) if isinstance(err, dict) else str(err)
                    print(f"  [FAIL] {Path(out).name}: {msg}")
                    failed.append((out, msg))
                    del pending[tid]

                else:
                    # Still processing
                    pass

            except Exception as e:
                print(f"  [POLL ERROR] {Path(out).name}: {e}")

        if pending:
            remaining = len(pending)
            print(f"  ... {remaining} tasks remaining, waiting {poll_interval}s ...")
            time.sleep(poll_interval)

    return succeeded, failed


# ── Asset Definitions ──────────────────────────────────────────────────────────
# Each entry: (output_path, prompt, aspect_ratio, api_type, [reference_paths])

ASSETS = []


def t2i(filename, prompt, ratio="1:1"):
    """Register a text-to-image asset."""
    ASSETS.append(("text-to-image", filename, prompt, ratio, []))


def i2i(filename, prompt, refs):
    """Register an image-to-image asset."""
    ASSETS.append(("image-to-image", filename, prompt, "1:1", refs))


# ── OFFICE BACKGROUND & LAYERS ────────────────────────────────────────────────

# 1. Main office background (redraw in caricature style)
i2i(
    "public/assets/office_v2/back_wall_base.png",
    (
        "Dark scam call center office interior viewed from employee's desk, "
        "rear wall showing rows of desks with silhouetted workers hunched over glowing monitors, "
        "overhead fluorescent tube lights casting sickly teal-green light cones, "
        "warehouse ceiling with exposed pipes and cable trays, grimy stained walls, "
        "cheesy motivational posters like 'SYNERGY' and 'HUSTLE' hanging crooked, "
        "overflowing trash bins, coffee-stained surfaces, "
        f"{OFFICE_STYLE}"
    ),
    [
        str(ROOT / "public/assets/office/office_bg.png"),
        str(ROOT / "public/assets/characters/boss_idle.png"),
    ],
)

# 2. Foreground desk surface
t2i(
    "public/assets/office_v2/foreground_desk.png",
    (
        "Close-up view of a worn office desk surface from above at slight angle, "
        "scratched laminate top, coffee ring stains, scattered sticky notes, "
        "pen cup with cheap pens, crumpled papers, small desk calendar, "
        "edges visible, slightly messy corporate desk, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
    "16:9",
)

# 3. Grime/dirt overlay
t2i(
    "public/assets/office_v2/grime_overlay.png",
    (
        "Subtle grime and dirt texture overlay, stains, watercolor splotches, "
        "coffee drips, yellowed paper aging marks, dust spots, "
        "very subtle transparent overlay texture, dark edges vignette, "
        f"{TRANSPARENT}"
    ),
    "16:9",
)

# ── LIGHTING ───────────────────────────────────────────────────────────────────

# 4-6. Light fixtures (one design, we can flip/recolor in code)
t2i(
    "public/assets/office_v2/light_fixture.png",
    (
        "Single overhead fluorescent tube light fixture hanging from ceiling, "
        "industrial office ceiling light, slightly crooked mounting, "
        "one tube flickering dimmer than the other, metal housing with dust, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
)

# 7. Light beam / cone
t2i(
    "public/assets/office_v2/light_beam.png",
    (
        "Volumetric light cone beam shining downward from ceiling, "
        "teal-green fluorescent light rays with visible dust particles, "
        "soft glowing atmospheric light shaft, fading at edges, "
        f"{TRANSPARENT}"
    ),
    "3:4",
)

# ── BACKGROUND WORKERS ────────────────────────────────────────────────────────

# 8. Worker at desk (left) - seen from behind
t2i(
    "public/assets/office_v2/worker_left.png",
    (
        "Back view silhouette of an office worker hunched over a desk with headset on, "
        "typing at keyboard, slightly slouched posture, male figure in cheap shirt, "
        "dark silhouette with teal-green rim lighting from monitor glow, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
)

# 9. Worker at desk (middle) - adjusting headset
t2i(
    "public/assets/office_v2/worker_mid.png",
    (
        "Back view silhouette of an office worker at desk adjusting their headset with one hand, "
        "leaning back slightly in chair, female figure in office clothes, "
        "dark silhouette with teal-green rim lighting from monitor, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
)

# 10. Worker at desk (right) - typing
t2i(
    "public/assets/office_v2/worker_right.png",
    (
        "Back view silhouette of an office worker typing rapidly at keyboard, "
        "hunched forward intensely, male figure with rolled up sleeves, "
        "dark silhouette with teal-green rim lighting, slight motion blur on hands, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
)

# 11. Background monitor (for glow animation)
t2i(
    "public/assets/office_v2/bg_monitor.png",
    (
        "Small old CRT computer monitor seen from slight angle, "
        "glowing teal-green screen with scan lines visible, "
        "cheap office monitor, scratched casing, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
)

# ── MAIN INTERACTIVE OBJECTS ──────────────────────────────────────────────────

# 12. CRT Monitor (redraw in caricature style)
i2i(
    "public/assets/office_v2/main_monitor.png",
    (
        "Large old CRT computer monitor front view, bulky beige-gray plastic casing, "
        "dark screen with faint green scanlines, small green power LED at bottom, "
        "chunky beveled frame, slightly yellowed with age, dust in vents, "
        "swivel base stand, heavy and boxy 1990s design, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
    [str(ROOT / "public/assets/office/monitor.png")],
)

# 13. Monitor screen overlay (CRT effect)
t2i(
    "public/assets/office_v2/monitor_screen_overlay.png",
    (
        "CRT monitor screen overlay effect, subtle scanlines, slight screen curvature glow, "
        "green-tinted glass reflection, screen door effect, retro monitor glass, "
        "rounded rectangle shape matching old CRT screens, "
        f"{TRANSPARENT}"
    ),
)

# 14. Phone body (redraw in caricature style)
i2i(
    "public/assets/office_v2/phone_body.png",
    (
        "Office desk telephone body without handset, multi-line office phone, "
        "number pad with worn buttons, small LCD display showing green text, "
        "dark gray plastic body, coiled cord hanging off side, "
        "boxy 1990s office phone design, slightly grimy, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
    [str(ROOT / "public/assets/office/phone.png")],
)

# 15. Phone handset (separate for pickup/put-down animation)
t2i(
    "public/assets/office_v2/phone_handset.png",
    (
        "Office telephone handset receiver, dark gray plastic, "
        "classic shape with earpiece and mouthpiece, coiled cord attached, "
        "slightly worn and grimy from heavy use, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
)

# 16. Phone cord (separate for sway animation)
t2i(
    "public/assets/office_v2/phone_cord.png",
    (
        "Coiled telephone cord, dark gray spiral cord hanging in a loop, "
        "classic phone cable, slightly stretched and tangled, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
)

# ── DESK PROPS ─────────────────────────────────────────────────────────────────

# 17. Desk fan
t2i(
    "public/assets/office_v2/desk_fan.png",
    (
        "Small desktop oscillating fan, cheap plastic office fan, "
        "circular cage with blades visible inside, slightly dusty, "
        "tilted upward, power cord trailing behind, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
)

# 18. Coffee mug
t2i(
    "public/assets/office_v2/coffee_mug.png",
    (
        "Dirty office coffee mug, white ceramic with faded '#1 BOSS' text and brown stains, "
        "half-full with cold dark coffee, ring stain on base, chipped rim, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
)

# 19. Coffee steam (base frame for animation)
t2i(
    "public/assets/office_v2/coffee_steam.png",
    (
        "Wispy steam rising from a hot coffee cup, thin curling vapor wisps, "
        "white-gray translucent steam tendrils against dark background, "
        "hand-drawn ink style smoke wisps, delicate curling lines, "
        f"{TRANSPARENT}"
    ),
)

# 20. Loose paper sheets
t2i(
    "public/assets/office_v2/loose_papers.png",
    (
        "A few loose office paper sheets, slightly crumpled and overlapping, "
        "one with typed text visible, one with handwritten scribbles, "
        "messy stack on desk, yellowed edges, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
)

# 21. Hanging cable
t2i(
    "public/assets/office_v2/hanging_cable.png",
    (
        "Single ethernet network cable dangling from above, "
        "blue Cat5 cable hanging in a loose arc with RJ45 connector at end, "
        "office ceiling cable that came unplugged, "
        f"{OFFICE_STYLE}, {TRANSPARENT}"
    ),
)

# 22. Dust particles (base frame sprite)
t2i(
    "public/assets/office_v2/dust_particles.png",
    (
        "Floating dust motes and particles in a light beam, "
        "tiny bright specks scattered across dark space, "
        "atmospheric dust in office lighting, various sizes, "
        f"{TRANSPARENT}"
    ),
)

# 23. Smoke wisp
t2i(
    "public/assets/office_v2/smoke_wisp.png",
    (
        "Single thin wisp of cigarette smoke curling upward, "
        "delicate translucent gray-white smoke tendril, hand-drawn ink style, "
        "ethereal and flowing, "
        f"{TRANSPARENT}"
    ),
)

# ── BOSS CHARACTER ─────────────────────────────────────────────────────────────

# 24. Boss full body (walking pose for animation base)
i2i(
    "public/assets/characters/boss_full_body.png",
    (
        "Full body view of a sleazy overweight male boss character, "
        "gold chain necklace, gaudy dollar sign tie, plaid sport jacket, "
        "slicked back dark hair with gray temples, smug expression, "
        "walking pose mid-stride seen from three-quarter angle, "
        "cheap dress shoes, visible belly straining shirt buttons, "
        "full body head to toe with space around figure, "
        f"{STYLE}, {TRANSPARENT}"
    ),
    [str(ROOT / "public/assets/characters/boss_idle.png")],
)

# ── UI ELEMENTS ────────────────────────────────────────────────────────────────

# 25. Gauge frame (for compliance/suspicion meters)
t2i(
    "public/assets/ui/gauge_frame.png",
    (
        "Vintage analog meter gauge face, round industrial dial gauge, "
        "brass/metal rim with glass face, tick marks around semicircular scale, "
        "worn metal frame with scratches, small mounting screws visible, "
        "empty dial face ready for needle overlay, office instrument, "
        f"{UI_STYLE}, {TRANSPARENT}"
    ),
)

# 26. Dossier panel (victim profile card background)
t2i(
    "public/assets/ui/dossier_panel.png",
    (
        "Open manila file folder dossier, beige/tan manila folder spread open, "
        "tab label at top, coffee stains on corner, paper clip holding photo area, "
        "lined paper visible inside with faded text lines, rubber stamp marks, "
        "top secret or confidential stamp faintly visible, slightly worn edges, "
        f"{UI_STYLE}, {TRANSPARENT}"
    ),
    "3:4",
)

# 27. Polaroid portrait frame
t2i(
    "public/assets/ui/portrait_frame_polaroid.png",
    (
        "Empty Polaroid instant photo frame, white border instant camera photo, "
        "slightly yellowed with age, one corner slightly bent, "
        "tape residue mark, hand-written name area at bottom blank, "
        f"{UI_STYLE}, {TRANSPARENT}"
    ),
)

# 28. Script panel (notebook)
t2i(
    "public/assets/ui/script_panel.png",
    (
        "Open spiral-bound notebook page, lined paper with coffee stains, "
        "spiral binding visible on left edge, dog-eared corner, "
        "yellow highlighter streaks on some lines, "
        "cheap office notebook, slightly crumpled page, "
        f"{UI_STYLE}, {TRANSPARENT}"
    ),
    "3:4",
)

# 29. Script tab (the pull-out tab)
t2i(
    "public/assets/ui/script_tab.png",
    (
        "Paper file folder tab divider, small rectangular tab with handwritten label, "
        "manila colored paper tab, slightly bent, "
        "office filing system tab divider, "
        f"{UI_STYLE}, {TRANSPARENT}"
    ),
)

# 30. Quota board frame
t2i(
    "public/assets/ui/quota_board.png",
    (
        "Office wall-mounted progress tracking board, horizontal thermometer style chart, "
        "wooden frame around a printed scale from 0 to GOAL, "
        "pushpin marks, whiteboard marker residue, "
        "corporate sales quota tracker board, motivational office prop, "
        f"{UI_STYLE}, {TRANSPARENT}"
    ),
    "16:9",
)

# 31. Timer/tape recorder
t2i(
    "public/assets/ui/tape_recorder.png",
    (
        "Small desk-mounted cassette tape recorder, vintage 1980s dictaphone, "
        "two visible tape reels under clear plastic window, "
        "red REC button, silver body, small speaker grille, "
        "office dictation machine, compact desktop recorder, "
        f"{UI_STYLE}, {TRANSPARENT}"
    ),
)

# 32. Money machine (adding machine)
t2i(
    "public/assets/ui/money_machine.png",
    (
        "Vintage office adding machine calculator with paper tape roll, "
        "mechanical desktop calculator, number keys with worn labels, "
        "paper receipt tape curling out the top, "
        "beige/cream colored office calculating machine, "
        f"{UI_STYLE}, {TRANSPARENT}"
    ),
)

# 33. Green button (idle/hover/press states - generate base)
t2i(
    "public/assets/ui/button_green.png",
    (
        "Large chunky green office push button, industrial style, "
        "raised plastic button with 'GO' or blank label, "
        "slightly worn with fingerprints, chrome mounting ring, "
        "physical arcade-style button, satisfying clicky look, "
        f"{UI_STYLE}, {TRANSPARENT}"
    ),
)

# 34. Red button (for hang up / danger)
t2i(
    "public/assets/ui/button_red.png",
    (
        "Large chunky red emergency push button, industrial panic button style, "
        "raised plastic button, slightly worn, chrome mounting ring, "
        "big red button you want to press, warning feeling, "
        f"{UI_STYLE}, {TRANSPARENT}"
    ),
)

# 35. Stamp set (for intel confirmations)
t2i(
    "public/assets/ui/stamp_confirmed.png",
    (
        "Red rubber stamp impression reading 'CONFIRMED' in blocky uppercase letters, "
        "slightly smudged ink, uneven pressure marks, rotated slightly off-angle, "
        "classic office rubber stamp mark on paper, "
        f"{UI_STYLE}, {TRANSPARENT}"
    ),
)

# 36. Receipt tape (for money counter animation)
t2i(
    "public/assets/ui/receipt_tape.png",
    (
        "Curling paper receipt tape from adding machine, narrow white paper strip, "
        "printed numbers visible in light purple ink, slightly curled and wrinkled, "
        "thermal paper receipt strip, "
        f"{UI_STYLE}, {TRANSPARENT}"
    ),
    "3:4",
)


# ── MAIN ───────────────────────────────────────────────────────────────────────
def main():
    print(f"{'='*60}")
    print(f"  SCAMMER SIMULATOR - Art Asset Generation")
    print(f"  {len(ASSETS)} assets to generate via Meshy API")
    print(f"{'='*60}\n")

    # Submit all tasks
    submitted = []  # (task_id, output_path, api_type)

    for api_type, filename, prompt, ratio, refs in ASSETS:
        output_path = str(ROOT / filename)
        print(f"[SUBMIT] {Path(filename).name}...")

        if api_type == "text-to-image":
            tid = submit_text_to_image(prompt, ratio)
        else:
            tid = submit_image_to_image(prompt, refs)

        if tid:
            submitted.append((tid, output_path, api_type))
            print(f"  -> Task ID: {tid}")
        else:
            print(f"  -> SKIPPED (submission failed)")

        time.sleep(1)  # Rate limit buffer

    if not submitted:
        print("\nNo tasks submitted successfully. Check API key and network.")
        sys.exit(1)

    # Save tracking file
    tracking = {
        "submitted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total": len(submitted),
        "tasks": [
            {"id": tid, "output": out, "api": api}
            for tid, out, api in submitted
        ],
    }
    tracking_path = ROOT / "scripts" / "art_generation_status.json"
    with open(tracking_path, "w") as f:
        json.dump(tracking, f, indent=2)
    print(f"\nTracking file saved: {tracking_path}")

    # Poll and download
    succeeded, failed = poll_and_download(submitted)

    # Final report
    print(f"\n{'='*60}")
    print(f"  GENERATION COMPLETE")
    print(f"  Succeeded: {len(succeeded)}")
    print(f"  Failed:    {len(failed)}")
    if failed:
        print(f"\n  Failed assets:")
        for path, err in failed:
            print(f"    - {Path(path).name}: {err}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
