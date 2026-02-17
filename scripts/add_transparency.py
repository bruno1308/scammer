"""
Add real alpha transparency to generated art assets.

Uses rembg (AI-powered background removal) to strip fake checkerboard
patterns and solid backgrounds from Meshy-generated PNGs.

Originals are preserved in *_original.png alongside the transparent versions.

Usage: python scripts/add_transparency.py
"""

import sys
import shutil
from pathlib import Path
from rembg import remove
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

# ── Assets that need transparency ──────────────────────────────────────────────
# These are individual objects/props/UI that must composite on top of other layers.
# We skip full-scene backgrounds that are meant to fill the screen.

NEEDS_TRANSPARENCY = [
    # Office environment objects
    "public/assets/office_v2/light_fixture.png",
    "public/assets/office_v2/light_beam.png",
    "public/assets/office_v2/worker_left.png",
    "public/assets/office_v2/worker_mid.png",
    "public/assets/office_v2/worker_right.png",
    "public/assets/office_v2/bg_monitor.png",
    "public/assets/office_v2/main_monitor.png",
    "public/assets/office_v2/monitor_screen_overlay.png",
    "public/assets/office_v2/phone_body.png",
    "public/assets/office_v2/phone_handset.png",
    "public/assets/office_v2/phone_cord.png",
    "public/assets/office_v2/desk_fan.png",
    "public/assets/office_v2/coffee_mug.png",
    "public/assets/office_v2/coffee_steam.png",
    "public/assets/office_v2/loose_papers.png",
    "public/assets/office_v2/hanging_cable.png",
    "public/assets/office_v2/dust_particles.png",
    "public/assets/office_v2/smoke_wisp.png",
    # Overlays (these layer on top of backgrounds)
    "public/assets/office_v2/grime_overlay.png",
    # Boss
    "public/assets/characters/boss_full_body.png",
    # UI elements
    "public/assets/ui/gauge_frame.png",
    "public/assets/ui/dossier_panel.png",
    "public/assets/ui/portrait_frame_polaroid.png",
    "public/assets/ui/script_panel.png",
    "public/assets/ui/script_tab.png",
    "public/assets/ui/quota_board.png",
    "public/assets/ui/tape_recorder.png",
    "public/assets/ui/money_machine.png",
    "public/assets/ui/button_green.png",
    "public/assets/ui/button_red.png",
    "public/assets/ui/stamp_confirmed.png",
    "public/assets/ui/receipt_tape.png",
]

# Assets that are full backgrounds — keep as-is, no transparency needed
SKIP = [
    "public/assets/office_v2/back_wall_base.png",
    "public/assets/office_v2/foreground_desk.png",
]


def process_image(filepath):
    """Remove background using rembg and save with real alpha channel."""
    img = Image.open(filepath).convert("RGBA")
    result = remove(img)
    # Ensure output is RGBA PNG with proper alpha
    result = result.convert("RGBA")
    result.save(filepath, "PNG")
    return result.size


def main():
    print(f"{'='*60}")
    print(f"  Adding Transparency to Art Assets")
    print(f"  {len(NEEDS_TRANSPARENCY)} assets to process")
    print(f"  Originals will be saved as *_original.png")
    print(f"{'='*60}\n")

    succeeded = 0
    failed = 0

    for rel_path in NEEDS_TRANSPARENCY:
        filepath = ROOT / rel_path
        name = filepath.name

        if not filepath.exists():
            print(f"  [SKIP] {name} — file not found")
            failed += 1
            continue

        # Preserve original
        original_path = filepath.with_name(filepath.stem + "_original" + filepath.suffix)
        if not original_path.exists():
            shutil.copy2(filepath, original_path)

        print(f"  [{succeeded + failed + 1}/{len(NEEDS_TRANSPARENCY)}] Processing {name}...", end="", flush=True)

        try:
            size = process_image(filepath)
            print(f" done ({size[0]}x{size[1]})")
            succeeded += 1
        except Exception as e:
            print(f" ERROR: {e}")
            # Restore original if processing failed
            shutil.copy2(original_path, filepath)
            failed += 1

    # Report on skipped backgrounds
    print(f"\n  Skipped (full backgrounds, no transparency needed):")
    for rel_path in SKIP:
        filepath = ROOT / rel_path
        status = "exists" if filepath.exists() else "missing"
        print(f"    - {Path(rel_path).name} ({status})")

    print(f"\n{'='*60}")
    print(f"  TRANSPARENCY COMPLETE")
    print(f"  Processed: {succeeded}")
    print(f"  Failed:    {failed}")
    print(f"  Originals preserved as *_original.png")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
