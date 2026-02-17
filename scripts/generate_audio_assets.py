"""
Generate all audio assets (SFX, ambient, music) via ElevenLabs Sound Effects API.

Usage: python scripts/generate_audio_assets.py
"""

import os
import sys
import time
import requests
from pathlib import Path
from dotenv import load_dotenv

# ── Setup ──────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY not found in .env")
    sys.exit(1)

API_URL = "https://api.elevenlabs.io/v1/sound-generation"
HEADERS = {"xi-api-key": API_KEY, "Content-Type": "application/json"}

# Ensure output directories
(ROOT / "public/assets/sfx").mkdir(parents=True, exist_ok=True)
(ROOT / "public/assets/ambient").mkdir(parents=True, exist_ok=True)
(ROOT / "public/assets/music").mkdir(parents=True, exist_ok=True)


# ── Audio Asset Definitions ────────────────────────────────────────────────────
# Each: (output_path, prompt, duration_seconds, prompt_influence, loop)

AUDIO_ASSETS = []


def sfx(filename, prompt, duration=2.0, influence=0.5):
    AUDIO_ASSETS.append((f"public/assets/sfx/{filename}", prompt, duration, influence, False))


def ambient(filename, prompt, duration=22.0, influence=0.4):
    AUDIO_ASSETS.append((f"public/assets/ambient/{filename}", prompt, duration, influence, True))


def music(filename, prompt, duration=30.0, influence=0.3):
    AUDIO_ASSETS.append((f"public/assets/music/{filename}", prompt, duration, influence, True))


# ── SFX ────────────────────────────────────────────────────────────────────────

sfx(
    "phone_ring.mp3",
    "Classic office desk telephone ringing, dual-tone multi-frequency ring, "
    "1990s office phone ring bell sound, two short rings then pause, "
    "electronic office phone ringtone",
    duration=4.0,
    influence=0.6,
)

sfx(
    "phone_pickup.mp3",
    "Phone handset being picked up off the cradle, plastic click and slight "
    "scrape sound, office telephone pickup, brief mechanical click",
    duration=1.0,
    influence=0.6,
)

sfx(
    "phone_hangup.mp3",
    "Phone handset being slammed down onto cradle, firm hang-up click, "
    "office phone disconnection sound, slightly aggressive",
    duration=1.0,
    influence=0.6,
)

sfx(
    "button_click.mp3",
    "Mechanical push button click, chunky plastic button press and release, "
    "satisfying tactile button click, arcade button sound",
    duration=0.5,
    influence=0.5,
)

sfx(
    "money_chaching.mp3",
    "Cash register cha-ching sound, old mechanical register opening with bell, "
    "money earned jingle, retro cash drawer opening",
    duration=1.5,
    influence=0.5,
)

sfx(
    "paper_rustle.mp3",
    "Paper rustling and shuffling sound, handling office documents, "
    "manila folder being opened, pages turning and sliding",
    duration=2.0,
    influence=0.5,
)

sfx(
    "stamp_press.mp3",
    "Rubber stamp being pressed firmly onto paper, ink stamp thud, "
    "office document stamping sound, satisfying stamp impact",
    duration=1.0,
    influence=0.6,
)

sfx(
    "page_flip.mp3",
    "Notebook page being flipped, paper turning in a spiral notebook, "
    "single page turn sound, crisp paper flip",
    duration=1.0,
    influence=0.5,
)

sfx(
    "drawer_open.mp3",
    "Office desk drawer sliding open, metal rails sliding, "
    "slightly sticky drawer being pulled, wooden desk drawer",
    duration=1.5,
    influence=0.5,
)

sfx(
    "drawer_close.mp3",
    "Office desk drawer sliding shut, thud of drawer closing, "
    "metal rails and wood impact, firm close",
    duration=1.0,
    influence=0.5,
)

sfx(
    "keyboard_typing.mp3",
    "Brief burst of rapid keyboard typing, mechanical keyboard clicks, "
    "office worker typing quickly, clicky key presses",
    duration=3.0,
    influence=0.5,
)

sfx(
    "phone_dial_tone.mp3",
    "Telephone dial tone, steady continuous hum of phone line, "
    "classic analog phone dial tone",
    duration=3.0,
    influence=0.6,
)

sfx(
    "notification_ding.mp3",
    "Simple notification ding sound, computer alert tone, "
    "brief bright chime for intel discovered or status change",
    duration=1.0,
    influence=0.5,
)

sfx(
    "suspicion_warning.mp3",
    "Tense warning alert sound, low ominous buzz with rising tone, "
    "danger warning indicator, anxiety-inducing alarm subtle",
    duration=2.0,
    influence=0.4,
)

sfx(
    "level_complete.mp3",
    "Level complete success jingle, short triumphant fanfare, "
    "achievement unlocked sound, positive completion sting",
    duration=3.0,
    influence=0.4,
)

sfx(
    "game_over.mp3",
    "Game over dramatic sting, failure sound effect, "
    "dark comedic wah-wah trombone or descending tones, "
    "comically dramatic failure",
    duration=3.0,
    influence=0.4,
)

sfx(
    "tape_recorder_start.mp3",
    "Cassette tape recorder clicking on, mechanical button press then "
    "tape reels starting to spin, recording device activation",
    duration=2.0,
    influence=0.5,
)

sfx(
    "adding_machine.mp3",
    "Old adding machine calculating, mechanical calculator printing numbers, "
    "paper receipt tape advancing with clicking, vintage calculator sounds",
    duration=2.0,
    influence=0.5,
)

sfx(
    "mouse_click.mp3",
    "Computer mouse single left click, crisp plastic mouse button click and release, "
    "short tactile mouse click sound, realistic PC mouse click",
    duration=0.5,
    influence=0.6,
)

# ── AMBIENT LOOPS ──────────────────────────────────────────────────────────────

ambient(
    "office_ambience.mp3",
    "Office call center ambient background, multiple keyboards typing in distance, "
    "muffled phone conversations, occasional paper shuffling, air conditioning hum, "
    "fluorescent light buzz, busy office atmosphere, cubicle farm environment, "
    "low background chatter, someone coughing in distance",
    duration=25.0,
    influence=0.4,
)

ambient(
    "fluorescent_hum.mp3",
    "Fluorescent ceiling light electrical hum and buzz, "
    "steady low-frequency electrical drone, tube light buzzing, "
    "slightly flickering fluorescent light ambient noise",
    duration=15.0,
    influence=0.5,
)

ambient(
    "night_office.mp3",
    "Late night empty office ambient sound, distant AC humming, "
    "occasional creak of building settling, very quiet office at night, "
    "eerie corporate building after hours, minimal activity",
    duration=20.0,
    influence=0.4,
)

# ── MUSIC ──────────────────────────────────────────────────────────────────────

music(
    "menu_theme.mp3",
    "Dark jazzy noir lounge music, smoky detective movie vibe, "
    "muted trumpet and upright bass, slow tempo, "
    "slightly sleazy and comedic undertone, "
    "film noir jazz with satirical edge, "
    "dark comedy background music",
    duration=30.0,
    influence=0.3,
)

music(
    "office_gameplay.mp3",
    "Tense minimalist background music for office, "
    "low pulsing synth with subtle tension, corporate anxiety music, "
    "dark comedy game soundtrack, building unease, "
    "quirky dark electronic with office phone sampling, "
    "something between comedy and thriller",
    duration=30.0,
    influence=0.3,
)

music(
    "call_active.mp3",
    "Tense phone call background music, psychological thriller vibe, "
    "minimal dark synth pulses, increasing tension, "
    "suspenseful hold music meets dark comedy, "
    "heartbeat-like rhythm with subtle anxiety",
    duration=30.0,
    influence=0.3,
)

music(
    "results_success.mp3",
    "Darkly triumphant results screen music, "
    "upbeat but slightly sinister jazz, celebration with guilty edge, "
    "you did something bad but succeeded, morally gray victory music, "
    "satirical corporate achievement jingle extended",
    duration=30.0,
    influence=0.3,
)

music(
    "results_failure.mp3",
    "Sad failure results music, comedically dramatic, "
    "slow descending melody, trombone wah-wah feeling, "
    "dark comedy you-got-fired music, pathetic defeat, "
    "sad corporate elevator music slow",
    duration=30.0,
    influence=0.3,
)

music(
    "briefing_theme.mp3",
    "Boss briefing scene music, intimidating corporate meeting, "
    "heavy dark rhythm with comedy edge, mob boss meets office manager, "
    "sinister yet slightly ridiculous authority music, "
    "the Godfather meets The Office",
    duration=30.0,
    influence=0.3,
)

music(
    "game_over_theme.mp3",
    "Dark game over screen music, dramatic finality, "
    "slow piano notes fading into silence, noir movie ending, "
    "you got caught, consequences music, "
    "dark comedy dramatic ending",
    duration=30.0,
    influence=0.3,
)


# ── MAIN ───────────────────────────────────────────────────────────────────────
def generate_sound(output_path, prompt, duration, influence, loop):
    """Generate a single sound effect via ElevenLabs API."""
    body = {
        "text": prompt,
        "duration_seconds": duration,
        "prompt_influence": influence,
    }
    if loop:
        body["loop"] = True

    try:
        resp = requests.post(API_URL, headers=HEADERS, json=body, timeout=120)
        if resp.status_code == 200:
            with open(output_path, "wb") as f:
                f.write(resp.content)
            return True, len(resp.content)
        else:
            error = resp.text[:200]
            return False, error
    except Exception as e:
        return False, str(e)


def main():
    print(f"{'='*60}")
    print(f"  SCAMMER SIMULATOR - Audio Asset Generation")
    print(f"  {len(AUDIO_ASSETS)} audio assets to generate via ElevenLabs")
    print(f"{'='*60}\n")

    succeeded = []
    failed = []

    for i, (filename, prompt, duration, influence, loop) in enumerate(AUDIO_ASSETS):
        output_path = str(ROOT / filename)
        name = Path(filename).name
        category = Path(filename).parent.name

        print(f"[{i+1}/{len(AUDIO_ASSETS)}] [{category.upper()}] {name} ({duration}s, {'loop' if loop else 'oneshot'})...")

        ok, result = generate_sound(output_path, prompt, duration, influence, loop)

        if ok:
            print(f"  [DONE] {result // 1024}KB")
            succeeded.append(name)
        else:
            print(f"  [FAIL] {result}")
            failed.append((name, result))

        # Small delay to avoid rate limiting
        time.sleep(1.5)

    # Final report
    print(f"\n{'='*60}")
    print(f"  AUDIO GENERATION COMPLETE")
    print(f"  Succeeded: {len(succeeded)}")
    print(f"  Failed:    {len(failed)}")
    if failed:
        print(f"\n  Failed assets:")
        for name, err in failed:
            print(f"    - {name}: {err}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
