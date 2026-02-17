# OfficeScene Environment Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the OfficeScene with angle-consistent assets, working animations, and the boss walk cycle — making it production-grade.

**Architecture:** Three-layer composite (back wall at depth 0, boss/mid-ground at depth 2-3, foreground desk at depth 5) with overlay props (monitor depth 7, phone depth 6) and code-only atmosphere effects (dust, scanlines, vignette). All new Meshy-generated assets use a single canonical camera angle: "seated eye-level with ~10-degree downward pitch." Existing boss_walk_cycle spritesheet (clean transparency, side profile) is integrated as a mid-ground ambient animation.

**Tech Stack:** PhaserJS 3 (scenes, sprites, tweens, containers), Meshy API (text-to-image/image-to-image for statics), Ludo.ai (spritesheet animation from statics), Python scripts for asset generation, Puppeteer for visual verification.

---

## Canonical Camera Angle Specification

**ALL office environment assets must match this camera:**

```
POV: First-person, seated at a desk in a call center
Eye height: ~1.2m (sitting in an office chair)
Pitch: Slight downward (~10 degrees) — looking at desk surface and across room
Horizontal: Centered, looking forward through the office
Focal length feel: Normal lens (not wide-angle, not telephoto)
```

**Meshy prompt anchor phrase** (include in ALL environment asset prompts):
```
"first-person seated desk view, camera at seated eye height approximately 1.2 meters,
slight downward pitch approximately 10 degrees, centered perspective"
```

**Negative prompt anchor** (include in ALL):
```
"Negative: top-down view, isometric, bird's-eye, side view, elevated camera,
strategy game angle, gray background, white background"
```

**Transparency strategy:** Meshy cannot generate alpha channels. For overlay assets
(desk, monitor, phone), request a **solid magenta (#FF00FF) background** in the prompt,
then chroma-key it out in post-processing using Python/Pillow. For full-scene assets
(back wall), no transparency is needed.

---

## Asset Triage: Keep / Regenerate / Remove

### KEEP (working correctly)
| Asset | Key | Why |
|-------|-----|-----|
| `office_v2/back_wall_no_desk.png` | `back_wall` | Frontal eye-level, matches canonical angle. 1024x1024, RGB. |
| `spritesheets/boss_walk_cycle.png` | `anim_boss_walk` | Clean RGBA transparency, side-profile walk. 7x7 grid, 224x232 frames. |
| `office_v2/grime_overlay.png` | `grime_overlay` | Abstract texture, angle-agnostic. 1344x768, RGBA. |
| `spritesheets/cable_sway_spritesheet.png` | `anim_cable_sway` | Ceiling cable, angle-tolerant. 48 frames, 640x640. |
| `spritesheets/tape_recorder_reels_spritesheet.png` | `anim_tape_recorder` | CallScene UI, not OfficeScene. |
| `spritesheets/receipt_tape_feed_spritesheet.png` | `anim_receipt_tape` | CallScene UI, not OfficeScene. |
| Code-only effects | n/a | Dust particles, scanlines, vignette, light beam — no asset mismatch. |

### REGENERATE (wrong camera angle or bad transparency)
| Asset | Problem | New Prompt Direction |
|-------|---------|---------------------|
| `office_v2/foreground_desk.png` | Top-down 3/4 angle (prompt said "from above at slight angle") | Seated eye-level, desk surface in lower 35-45% of frame |
| `office_v2/main_monitor.png` | Mostly semi-transparent (50.2% mid-alpha), ghostly | Solid CRT monitor, front view at seated eye-level |
| `office_v2/phone_clean.png` / `phone_body.png` | Magenta-keyed, angle unclear | Office phone seen from seated position, slight downward view |
| `office_v2/back_wall_base.png` | Has built-in front desk/counter that clashes with overlay | Regenerate WITHOUT foreground furniture, WITH workers |

### REMOVE FROM OFFICESCENE (not fixable)
| Asset | Problem |
|-------|---------|
| `anim_crt_shimmer` spritesheet | Gray matte baked into frames, 3/4 angle |
| `anim_worker_headset` spritesheet | Baked-in desk/chair/monitor environment |
| `anim_worker_typing_r` spritesheet | Baked-in desk/chair/monitor environment |
| `anim_worker_typing_l` spritesheet | 75.8% opaque, nearly full-frame baked environment |
| `anim_fan_spin` spritesheet | Gray matte, inconsistent frame coverage (0.2-98.4%) |
| `anim_light_flicker` spritesheet | Doubles existing background fluorescents |
| `anim_paper_flutter` spritesheet | Gray matte |
| `anim_smoke_wisp` spritesheet | Gray matte, no source object |
| `anim_monitor_glow` spritesheet | Wrong perspective, creates floating CRT |
| `anim_steam_wisps` spritesheet | No source object |

---

## Task 1: Generate New Assets via Meshy API

**Files:**
- Create: `scripts/generate_office_v3_assets.py`

**Step 1: Write the Meshy generation script**

Create a new focused script that generates only the 4 assets we need, using the canonical camera angle in every prompt.

```python
#!/usr/bin/env python3
"""
Generate replacement office assets with consistent camera angle.

Canonical camera: seated eye-level (~1.2m), ~10-degree downward pitch,
centered perspective, first-person desk view.

Usage: python scripts/generate_office_v3_assets.py
"""

import os, sys, json, time, base64, requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("MESHY_API_KEY")
if not API_KEY:
    print("ERROR: MESHY_API_KEY not found in .env")
    sys.exit(1)

API_BASE = "https://api.meshy.ai/openapi/v1"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

(ROOT / "public/assets/office_v3").mkdir(parents=True, exist_ok=True)

# ── Style Constants ──
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
    "strategy game angle, gray background, white background, gray matte"
)
TRANSPARENT = "isolated on pure transparent background, single object, no background, PNG transparency"


def encode_image(path):
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode()
    ext = Path(path).suffix.lower().lstrip(".")
    if ext == "jpg": ext = "jpeg"
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
                r = requests.get(f"{API_BASE}/{api}/{tid}",
                    headers={"Authorization": f"Bearer {API_KEY}"}, timeout=30)
                d = r.json()
                st = d.get("status", "UNKNOWN")
                if st == "SUCCEEDED":
                    urls = d.get("image_urls", [])
                    if urls:
                        img = requests.get(urls[0], timeout=60)
                        with open(out, "wb") as f: f.write(img.content)
                        print(f"  [DONE] {Path(out).name}")
                    del pending[tid]
                elif st == "FAILED":
                    print(f"  [FAIL] {Path(out).name}: {d.get('task_error')}")
                    del pending[tid]
                else:
                    print(f"  [{st}] {Path(out).name} {d.get('progress', 0)}%")
            except Exception as e:
                print(f"  [ERR] {e}")
        if pending:
            time.sleep(interval)


ASSETS = []

# 1. Foreground desk (THE CRITICAL FIX — was "from above at slight angle")
ASSETS.append(("text-to-image", "public/assets/office_v3/foreground_desk.png",
    f"Close-up of a worn office desk surface, {CAMERA}, desk surface occupying "
    "lower 35-45 percent of frame, front desk edge visible at bottom, "
    "scratched laminate top, coffee ring stains, scattered sticky notes, "
    "pen cup with cheap pens, crumpled papers, small desk calendar, "
    "slightly messy corporate desk, front edge and sides visible, "
    f"{OFFICE_STYLE}, {TRANSPARENT}. {NEGATIVE}",
    "16:9", []))

# 2. CRT Monitor (solid, front view, at seated eye level)
ASSETS.append(("text-to-image", "public/assets/office_v3/main_monitor.png",
    f"Large old CRT computer monitor, {CAMERA}, bulky beige-gray plastic casing, "
    "dark screen with faint green scanlines, small green power LED, "
    "chunky beveled frame, slightly yellowed with age, dust in vents, "
    "heavy boxy 1990s design on swivel base, solid opaque object, "
    f"{OFFICE_STYLE}, {TRANSPARENT}. {NEGATIVE}",
    "1:1", []))

# 3. Office phone (seen from seated position looking slightly down)
ASSETS.append(("text-to-image", "public/assets/office_v3/phone.png",
    f"Office desk telephone, {CAMERA}, multi-line office phone, "
    "number pad with worn buttons, small LCD display showing green text, "
    "dark gray plastic body, coiled cord hanging off side, "
    "boxy 1990s office phone, slightly grimy from heavy use, "
    f"{OFFICE_STYLE}, {TRANSPARENT}. {NEGATIVE}",
    "1:1", []))

# 4. Back wall WITH workers but WITHOUT foreground desk/counter
ASSETS.append(("image-to-image", "public/assets/office_v3/back_wall_workers.png",
    f"Dark scam call center office interior, {CAMERA}, "
    "rear wall showing rows of desks with silhouetted workers hunched over glowing monitors, "
    "overhead fluorescent tube lights casting sickly teal-green light cones, "
    "warehouse ceiling with exposed pipes and cable trays, grimy stained walls, "
    "cheesy motivational posters hanging crooked, overflowing trash bins, "
    "NO foreground desk, NO counter at bottom, scene shows only the BACK of the room "
    "as seen from the player's desk, workers are 10-15 feet away, "
    f"{OFFICE_STYLE}. {NEGATIVE}",
    "16:9", [str(ROOT / "public/assets/office_v2/back_wall_no_desk.png")]))


def main():
    print(f"Generating {len(ASSETS)} office v3 assets...")
    submitted = []
    for api_type, filename, prompt, ratio, refs in ASSETS:
        out = str(ROOT / filename)
        print(f"[SUBMIT] {Path(filename).name}...")
        if api_type == "text-to-image":
            tid = submit_t2i(prompt, ratio)
        else:
            tid = submit_i2i(prompt, refs)
        if tid:
            submitted.append((tid, out, api_type))
            print(f"  -> {tid}")
        time.sleep(1)

    if submitted:
        poll_all(submitted)
    print("Done!")


if __name__ == "__main__":
    main()
```

**Step 2: Run the generation script**

```bash
python scripts/generate_office_v3_assets.py
```

Wait for all 4 assets to complete. Expected output files:
- `public/assets/office_v3/foreground_desk.png` (16:9)
- `public/assets/office_v3/main_monitor.png` (1:1)
- `public/assets/office_v3/phone.png` (1:1)
- `public/assets/office_v3/back_wall_workers.png` (16:9)

**Step 3: Run transparency cleanup**

If any assets have non-transparent backgrounds, run `rembg` on them:
```bash
python -c "
from rembg import remove
from PIL import Image
from pathlib import Path
for f in Path('public/assets/office_v3').glob('*.png'):
    if f.name == 'back_wall_workers.png': continue  # Full scene, no transparency needed
    im = Image.open(f)
    import numpy as np
    a = np.array(im.convert('RGBA'))[:,:,3]
    zero_ratio = (a==0).sum() / a.size
    if zero_ratio < 0.2:  # Less than 20% transparent = needs cleanup
        print(f'Cleaning {f.name} (only {zero_ratio:.1%} transparent)')
        out = remove(im)
        out.save(f)
    else:
        print(f'{f.name} OK ({zero_ratio:.1%} transparent)')
"
```

**Step 4: Visual inspection of generated assets**

View each asset individually to verify:
- Correct camera angle (seated eye-level, not top-down)
- Proper transparency on overlay assets
- Consistent art style (editorial caricature)
- No gray/white backgrounds baked in

If any asset looks wrong, regenerate it with adjusted prompt.

**Step 5: Commit new assets**

```bash
git add scripts/generate_office_v3_assets.py public/assets/office_v3/
git commit -m "feat(office): generate v3 assets with consistent camera angle"
```

---

## Task 2: Update BootScene Preloads

**Files:**
- Modify: `src/scenes/BootScene.js:112-131` (office asset preloads)

**Step 1: Add office_v3 preloads and update keys**

In `BootScene.js`, update the office asset preload section to load the new v3 assets with the SAME keys used by OfficeScene, so the scene code picks them up automatically:

```javascript
// Office v3 — angle-consistent assets (replace v2 equivalents)
this.load.image('back_wall', 'assets/office_v3/back_wall_workers.png');
this.load.image('foreground_desk', 'assets/office_v3/foreground_desk.png');
this.load.image('main_monitor', 'assets/office_v3/main_monitor.png');
this.load.image('phone_body', 'assets/office_v3/phone.png');

// Office v2 — retained assets
this.load.image('grime_overlay', 'assets/office_v2/grime_overlay.png');
this.load.image('monitor_overlay', 'assets/office_v2/monitor_screen_overlay.png');
```

Remove or comment out the old `back_wall_with_people` preload (it clashes with overlay desk):
```javascript
// REMOVED: back_wall_with_people causes double-desk with overlay
// this.load.image('back_wall_with_people', 'assets/office_v2/back_wall_base.png');
```

Remove preloads for spritesheets that are no longer used in OfficeScene:
```javascript
// REMOVED: gray-matte spritesheets not usable as overlays
// this.load.spritesheet('anim_light_flicker', ...);
// this.load.spritesheet('anim_worker_headset', ...);
// this.load.spritesheet('anim_worker_typing_r', ...);
// this.load.spritesheet('anim_fan_spin', ...);
// this.load.spritesheet('anim_paper_flutter', ...);
// this.load.spritesheet('anim_smoke_wisp', ...);
// this.load.spritesheet('anim_crt_shimmer', ...);
// this.load.spritesheet('anim_monitor_glow', ...);
// this.load.spritesheet('anim_steam_wisps', ...);
// this.load.spritesheet('anim_worker_typing_l', ...);
```

KEEP these spritesheets (still used):
```javascript
this.load.spritesheet('anim_boss_walk', 'assets/spritesheets/boss_walk_cycle.png',
    { frameWidth: 224, frameHeight: 232 });
this.load.spritesheet('anim_cable_sway', 'assets/spritesheets/cable_sway_spritesheet.png',
    { frameWidth: 640, frameHeight: 640 });
this.load.spritesheet('anim_tape_recorder', 'assets/spritesheets/tape_recorder_reels_spritesheet.png',
    { frameWidth: 640, frameHeight: 640 });
this.load.spritesheet('anim_receipt_tape', 'assets/spritesheets/receipt_tape_feed_spritesheet.png',
    { frameWidth: 560, frameHeight: 752 });
```

**Step 2: Verify boot completes without errors**

```bash
npm start
# Check browser console for missing asset warnings
```

**Step 3: Commit**

```bash
git add src/scenes/BootScene.js
git commit -m "fix(boot): update preloads for v3 office assets, remove gray-matte sheets"
```

---

## Task 3: Rewrite OfficeScene Environment Drawing

**Files:**
- Modify: `src/scenes/OfficeScene.js:103-147` (`_drawOfficeBackground`)
- Modify: `src/scenes/OfficeScene.js:149-258` (`_drawMonitor`)
- Modify: `src/scenes/OfficeScene.js:260-300` (`_drawPhone`)

**Step 1: Rewrite `_drawOfficeBackground`**

Replace lines 103-147 with:

```javascript
_drawOfficeBackground(width, height) {
    // ---- Layer 0: Back wall ----
    // Uses back_wall (v3: workers drawn in, no foreground desk)
    if (this.textures.exists('back_wall')) {
      const tex = this.textures.get('back_wall').getSourceImage();
      const coverScale = Math.max(width / tex.width, height / tex.height);
      this.add.image(width / 2, height / 2, 'back_wall')
        .setScale(coverScale).setDepth(0);
    } else {
      // Fallback: solid dark color
      const g = this.add.graphics().setDepth(0);
      g.fillStyle(0x0d0d1a);
      g.fillRect(0, 0, width, height);
    }

    // ---- Layer 5: Foreground desk (v3: seated eye-level angle) ----
    if (this.textures.exists('foreground_desk')) {
      const tex = this.textures.get('foreground_desk').getSourceImage();
      // Scale to fill ~95% width (wider coverage to prevent edge gaps)
      const deskScale = (width * 0.95) / tex.width;
      const displayH = tex.height * deskScale;
      // Anchor at bottom of screen, desk surface visible
      this.add.image(width / 2, height - displayH * 0.35, 'foreground_desk')
        .setScale(deskScale).setDepth(5);
    }

    // ---- Layer 9: Grime overlay ----
    if (this.textures.exists('grime_overlay')) {
      const tex = this.textures.get('grime_overlay').getSourceImage();
      const coverScale = Math.max(width / tex.width, height / tex.height);
      this.add.image(width / 2, height / 2, 'grime_overlay')
        .setScale(coverScale).setDepth(9).setAlpha(0.15);
    }
  }
```

**NOTE**: The desk Y position (`height - displayH * 0.35`) will need visual tuning after the new asset is generated. Use the Puppeteer screenshot tool to iterate. The key principle: the desk's front edge should sit near the bottom of the viewport, with the desk surface occupying roughly the lower 30-40% of the screen.

**Step 2: Rewrite `_drawMonitor` to use static image + code effects**

Replace the CRT shimmer spritesheet fallback chain (lines 157-168) with static-only:

```javascript
_drawMonitor(width, height) {
    const mx = width / 2;
    const my = height * 0.48;  // Adjusted for new desk position

    this.monitorContainer = this.add.container(mx, my).setDepth(7);

    // Static CRT monitor (v3: solid, proper perspective)
    if (this.textures.exists('main_monitor')) {
      const monImg = this.add.image(0, 0, 'main_monitor').setScale(0.28);
      this.monitorContainer.add(monImg);
    } else {
      // Fallback: programmatic rectangle
      const g = this.add.graphics();
      g.fillStyle(0x1a1a2e);
      g.fillRoundedRect(-180, -110, 360, 230, 8);
      g.fillStyle(0x0a0e14);
      g.fillRoundedRect(-168, -98, 336, 206, 4);
      this.monitorContainer.add(g);
    }

    // Screen overlay (green terminal glow)
    if (this.textures.exists('monitor_overlay')) {
      const overlay = this.add.image(0, -10, 'monitor_overlay').setScale(0.22).setAlpha(0.7);
      this.monitorContainer.add(overlay);
      this.tweens.add({
        targets: overlay,
        alpha: { from: 0.6, to: 0.85 },
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // ... rest of _drawMonitor unchanged (screen text, interaction zones, etc.)
```

**NOTE**: The `my = height * 0.48` will need tuning to sit on top of the new desk surface. Monitor bottom edge should rest on the desk.

**Step 3: Update `_drawPhone` position**

The phone position may need adjustment for the new desk layout:

```javascript
_drawPhone(width, height) {
    // Position phone on desk surface, right of center
    const px = width * 0.72;   // Further right on wider desk
    const py = height * 0.68;  // Adjusted for new desk position
    // ... rest unchanged
```

**Step 4: Take screenshot and verify**

```bash
node scripts/screenshot_game.mjs screenshots/v3_test.png
```

Visually verify:
- Back wall fills the background
- Desk surface sits at bottom, proper perspective
- Monitor sits ON the desk (not floating)
- Phone sits ON the desk (not floating)
- No perspective clashes between layers

**Step 5: Iterate positions**

Use Puppeteer screenshots to fine-tune `my` (monitor Y), `py` (phone Y), and desk Y position until props appear to rest naturally on the desk surface. This will require 2-5 iterations.

**Step 6: Commit**

```bash
git add src/scenes/OfficeScene.js
git commit -m "feat(office): rewrite environment drawing for v3 angle-consistent assets"
```

---

## Task 4: Add Boss Walk Animation

**Files:**
- Modify: `src/scenes/OfficeScene.js:1053-1155` (`_setupAmbientEffects`)

**Step 1: Add boss walk cycle to ambient effects**

In `_setupAmbientEffects`, after the cable sway animation, add the boss:

```javascript
// ── Boss walk cycle ──────────────────────────────────────
// Boss walks across the mid-ground (behind desk, in front of wall)
// at depth 2 (between back_wall@0 and foreground_desk@5).
// Side-profile spritesheet, 7x7 grid, 49 frames (skip last for loop seam).
if (this.textures.exists('anim_boss_walk')) {
  if (!this.anims.exists('boss_walk_anim')) {
    this.anims.create({
      key: 'boss_walk_anim',
      frames: this.anims.generateFrameNumbers('anim_boss_walk', { start: 0, end: 47 }),
      frameRate: 12,
      repeat: -1
    });
  }

  this._bossSprite = this.add.sprite(-100, height * 0.52, 'anim_boss_walk')
    .setScale(0.35)
    .setDepth(2)
    .setAlpha(0.85)
    .setVisible(false);

  // Boss walks across periodically (every 15-30 seconds)
  const startBossWalk = () => {
    if (!this._bossSprite || !this._bossSprite.active) return;

    const goingRight = Phaser.Math.Between(0, 1) === 0;
    const startX = goingRight ? -100 : width + 100;
    const endX = goingRight ? width + 100 : -100;

    this._bossSprite.setPosition(startX, height * 0.52);
    this._bossSprite.setFlipX(!goingRight); // Flip sprite based on direction
    this._bossSprite.setVisible(true);
    this._bossSprite.play('boss_walk_anim');

    this.tweens.add({
      targets: this._bossSprite,
      x: endX,
      duration: Phaser.Math.Between(6000, 10000),
      ease: 'Linear',
      onComplete: () => {
        this._bossSprite.setVisible(false);
        this._bossSprite.stop();
        // Schedule next pass
        const nextDelay = Phaser.Math.Between(15000, 30000);
        this._bossWalkTimer = this.time.delayedCall(nextDelay, startBossWalk);
      }
    });
  };

  // First walk after a short delay
  this._bossWalkTimer = this.time.delayedCall(
    Phaser.Math.Between(5000, 10000), startBossWalk
  );
}
```

**NOTE**: `height * 0.52` positions the boss roughly at the mid-ground level (between ceiling and desk). The `0.35` scale makes him small enough to read as "background" but large enough to be recognizable. Both values need visual tuning via screenshots.

**Step 2: Clean up boss timer in `shutdown()`**

In the `shutdown()` method (~line 1161), add:

```javascript
if (this._bossWalkTimer) this._bossWalkTimer.remove();
if (this._bossSprite) this._bossSprite.destroy();
```

**Step 3: Take screenshot during boss walk**

Temporarily reduce the initial delay to 1000ms for testing, take screenshot, verify:
- Boss walks at mid-ground depth (behind desk, in front of wall)
- Boss scale feels correct (small but recognizable)
- Boss Y position matches the floor level in the background
- Flip direction works correctly

**Step 4: Commit**

```bash
git add src/scenes/OfficeScene.js
git commit -m "feat(office): add boss walk cycle as mid-ground ambient animation"
```

---

## Task 5: Clean Up Unused Spritesheets (Optional)

**Files:**
- Modify: `src/scenes/BootScene.js` (remove preloads)

**Step 1: Remove preloads for unused spritesheets**

Remove these preloads from BootScene to save ~100MB of network transfer:

```
anim_light_flicker (9.5MB)
anim_worker_headset (9.0MB)
anim_worker_typing_r (16.0MB)
anim_fan_spin (19.2MB)
anim_paper_flutter (13.3MB)
anim_smoke_wisp (7.4MB)
anim_crt_shimmer (8.3MB)
anim_monitor_glow (2.2MB)
anim_steam_wisps (0.9MB)
anim_worker_typing_l (4.3MB)
```

Total savings: ~90MB less to download at boot.

Keep the actual PNG files in the repo for potential future use, just don't preload them.

**Step 2: Verify boot time improvement**

The loading bar should complete significantly faster.

**Step 3: Commit**

```bash
git add src/scenes/BootScene.js
git commit -m "perf(boot): remove 90MB of unused spritesheet preloads"
```

---

## Task 6: Visual Polish & Iteration

**Files:**
- Modify: `src/scenes/OfficeScene.js` (position tuning)

**Step 1: Screenshot iteration loop**

Use the Puppeteer screenshot tool to iterate on positions:

```bash
node scripts/screenshot_game.mjs screenshots/v3_iter1.png
```

Key things to tune:
1. **Desk Y position**: Front edge should be at viewport bottom, surface visible
2. **Monitor Y**: Bottom of monitor should rest on desk surface
3. **Phone Y/X**: Should sit naturally on desk surface, right side
4. **Boss Y**: Feet should be at the "floor level" visible in the back wall
5. **Boss scale**: Small enough to feel "back there" but visible

**Step 2: Adjust values and re-screenshot**

Repeat until the scene looks production-grade. Document final values.

**Step 3: Final commit**

```bash
git add src/scenes/OfficeScene.js
git commit -m "fix(office): tune sprite positions for production-grade layout"
```

---

## Task 7: Regenerate Assets If First Batch Is Bad

If the Meshy-generated assets don't match the camera angle spec:

**Option A: Re-run with adjusted prompt**
- Edit the prompt in `generate_office_v3_assets.py`
- Add more specificity about what went wrong (e.g., "NOT top-down", "NOT isometric")
- Re-run the script

**Option B: Use image-to-image with reference**
- Use a good reference image (e.g., `back_wall_no_desk.png`) to anchor the style
- Submit via image-to-image API instead of text-to-image

**Option C: Generate Ludo.ai animation for monitor**
- If the static monitor looks good, animate it with Ludo.ai for CRT shimmer
- Use the same Ludo.ai settings as before (model: "new", duration: 4, frame_size: 0)
- This creates a NEW CRT shimmer with proper transparency from the new base image

---

## Depth Layer Map (Final)

```
Depth 0:   back_wall (v3: workers, no foreground furniture)
Depth 2:   Boss walk sprite (mid-ground)
Depth 3:   Cable sway animation
Depth 5:   Foreground desk (v3: seated eye-level)
Depth 6:   Phone container
Depth 7:   Monitor container
Depth 8:   Monitor interaction zones + screen text overlay
Depth 9:   Grime overlay
Depth 11:  Dust particles
Depth 12:  Scanlines
Depth 15:  Vignette
Depth 20:  UI elements (meters, money, timer)
Depth 50:  Popup panels (FriendBook, etc.)
```

---

## Success Criteria

1. All layers use a consistent camera angle (no perspective clashes)
2. No gray/white matte visible behind any sprite
3. Monitor and phone visually "rest on" the desk surface
4. Boss walks across mid-ground periodically (visible but unobtrusive)
5. Boot time under 5 seconds (no 90MB of unused spritesheets loading)
6. Scene looks cohesive in a Puppeteer screenshot without UI overlays
