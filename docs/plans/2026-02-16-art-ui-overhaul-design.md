# Creative Direction: Scammer Simulator Art + UI Overhaul

*Design document — Feb 16, 2026*

## 0) Visual Diagnosis

- Portraits/boss are hand-inked caricature with watercolor paper energy — the game's strongest visual identity.
- Office props/background are cleaner, flatter, "generic cartoon noir" — doesn't match.
- UI across all scenes is `Graphics` rectangles + `Courier New` + neon glow — programmer art.
- **Result**: the strongest identity (portrait caricature satire) is not driving the rest of the game.

## 1) North Star Style: "Grotesque Editorial Office Noir"

One unified direction across ALL screens:
- Hand-inked linework with slight wobble
- Flat watercolor washes plus grime texture
- Crooked, exaggerated proportions in environment objects too (not just faces)
- Satirical office details that signal moral rot and absurdity

---

## 2) DYNAMISM: Assets to Generate + Animations to Request

### A) Asset Manifest (transparent PNGs to generate)

**Office layers (replace single static bg):**
| Asset | Description |
|-------|-------------|
| `office_v2/back_wall_base.png` | Rear wall with desks, drawn in caricature ink/wash style |
| `office_v2/back_wall_grime_overlay.png` | Dirt/stain texture overlay |
| `office_v2/foreground_desk_base.png` | Player's desk surface |
| `office_v2/foreground_desk_items_static.png` | Pens, papers, sticky notes on desk |

**Lighting (3 separate fixtures for independent flicker):**
| Asset | Description |
|-------|-------------|
| `office_v2/light_fixture_left.png` | Left fluorescent tube fixture |
| `office_v2/light_fixture_center.png` | Center fluorescent tube fixture |
| `office_v2/light_fixture_right.png` | Right fluorescent tube fixture |
| `office_v2/light_beam_left.png` | Light cone from left fixture |
| `office_v2/light_beam_center.png` | Light cone from center fixture |
| `office_v2/light_beam_right.png` | Light cone from right fixture |

**Background workers (silhouettes at desks):**
| Asset | Description |
|-------|-------------|
| `office_v2/worker_left_silhouette.png` | Left background worker |
| `office_v2/worker_mid_silhouette.png` | Middle background worker |
| `office_v2/worker_right_silhouette.png` | Right background worker |
| `office_v2/bg_monitor_left_shell.png` | Background monitor (left) |
| `office_v2/bg_monitor_right_shell.png` | Background monitor (right) |

**Desk props (atmosphere/life):**
| Asset | Description |
|-------|-------------|
| `office_v2/desk_fan_base.png` | Small desk fan body |
| `office_v2/desk_fan_blades.png` | Fan blades (separate for spin animation) |
| `office_v2/coffee_mug.png` | Stained coffee mug |
| `office_v2/coffee_steam_source.png` | Steam base for animation |
| `office_v2/loose_paper_sheet.png` | Loose paper for flutter |
| `office_v2/hanging_cable_front.png` | Dangling cable/wire |

**Main interactive objects (replace current flat assets):**
| Asset | Description |
|-------|-------------|
| `office_v2/main_monitor_shell.png` | CRT monitor in caricature style |
| `office_v2/main_monitor_screen_overlay.png` | CRT screen glow/scanline overlay |
| `office_v2/phone_body.png` | Desk phone body |
| `office_v2/phone_handset.png` | Phone handset (separate for pickup animation) |
| `office_v2/phone_cord.png` | Coiled cord (separate for sway) |
| `office_v2/phone_led_dot.png` | Phone LED indicator |

**Particle sources:**
| Asset | Description |
|-------|-------------|
| `office_v2/dust_particles_sprite.png` | Floating dust motes |
| `office_v2/smoke_wisp_sprite.png` | Cigarette/vent smoke wisps |

### B) Animation Spritesheets (request from Ludo.ai)

**Lighting:**
| Spritesheet | Frames | FPS | Type |
|-------------|--------|-----|------|
| `anim_light_flicker_left_sheet.png` | 8 | burst | Irregular flicker, one-shot |
| `anim_light_flicker_center_sheet.png` | 8 | burst | Irregular flicker, one-shot |
| `anim_light_flicker_right_sheet.png` | 8 | burst | Irregular flicker, one-shot |

**Background workers:**
| Spritesheet | Frames | FPS | Type |
|-------------|--------|-----|------|
| `anim_worker_left_typing_sheet.png` | 12 | 8 | Subtle typing loop |
| `anim_worker_mid_headset_adjust_sheet.png` | 10 | 8 | Headset fidget loop |
| `anim_worker_right_typing_sheet.png` | 12 | 8 | Subtle typing loop |
| `anim_bg_monitor_glow_cycle_sheet.png` | 6 | 4 | Soft pulse loop |

**Desk props:**
| Spritesheet | Frames | FPS | Type |
|-------------|--------|-----|------|
| `anim_fan_spin_sheet.png` | 8 | 12 | Continuous spin loop |
| `anim_coffee_steam_sheet.png` | 16 | 10 | Rising steam loop |
| `anim_loose_paper_flutter_sheet.png` | 8 | 8 | Flutter with random delay |
| `anim_cable_sway_sheet.png` | 16 | 6 | Gentle pendulum sway |

**Main objects:**
| Spritesheet | Frames | FPS | Type |
|-------------|--------|-----|------|
| `anim_main_monitor_crt_idle_sheet.png` | 6 | 6 | Scanline/glitch shimmer |
| `anim_phone_idle_breathe_sheet.png` | 4 | 4 | Tiny idle motion |
| `anim_phone_ring_vibrate_sheet.png` | 10 | 14 | Strong shake (ringing) |
| `anim_phone_cord_ring_sway_sheet.png` | 12 | 10 | Cord sway during ring |
| `anim_phone_led_blink_sheet.png` | 2 | 4 | LED blink loop |

**Particles:**
| Spritesheet | Frames | FPS | Type |
|-------------|--------|-----|------|
| `anim_dust_motes_sheet.png` | 12 | 6 | Low-opacity drift loop |
| `anim_smoke_wisp_sheet.png` | 14 | 7 | Random spawn wisp loop |

### C) State-Driven Animation Intensity

| Game State | Animation Behavior |
|------------|-------------------|
| **Idle shift** | Subtle loops only — workers type, fan spins, steam rises |
| **Dialing/ringing** | Phone vibrates, cord sways, loose paper reacts, workers glance |
| **Active call** | Worker loops speed up slightly, CRT noise increases, dust picks up |
| **High suspicion** | Red warning pulses, harsher/faster light flickers, tension |
| **Call end** | Motion calms, brief "result stamp" punch effect |

---

## 3) CONSISTENT ART STYLE

### Should office background be redrawn? **YES.**
- Keep current composition/framing (gameplay readability is good)
- Repaint with portrait-style ink/wash language
- Portrait style is the signature; environment must inherit it

### Global Style Rules (use across ALL screens)
- **Linework**: thick outer contour + scratchy interior hatching
- **Color palette**: dirty teals, nicotine yellows, stale blues, warning reds
- **Texture**: paper grain + subtle ink bleed
- **Geometry**: slight perspective wonk and asymmetry (nothing perfectly straight)
- **Satirical details**: cheesy "productivity" posters, cracked fluorescents, overflowing trash, tired desk clutter

### Screen-by-Screen Direction

| Screen | Current | New Direction |
|--------|---------|---------------|
| **Menu** | Neon hacker vibe, floating symbols, grid bg | "Employee orientation board" — pinned cards, stamped buttons, boss doodles, stained paper textures |
| **Briefing** | Boss dialogue on dark bg with neon panels | Clipboard/form aesthetic — boss talks while you review a greasy briefing document |
| **Office** | Generic dark cartoon bg | Full caricature art pass — layered, animated, grimy |
| **Call overlay** | Glowing HUD blocks on dark overlay | Dossier/paperwork motif — manila folders, polaroid portraits, scribbled notes |
| **Results** | Neon table with bars | Stamped performance review form, red ink grades |
| **Settings** | Neon panels | Greasy desk terminal / HR form |
| **Game Over** | Dramatic dark screen | Boss fires you via crumpled pink slip / police booking sheet |

---

## 4) UI ELEMENT REDESIGN

| UI Element | Current | New Concept | Assets Needed | Animation |
|------------|---------|-------------|---------------|-----------|
| **Compliance/Suspicion meters** | Flat colored vertical bars | Grimy office gauges clipped to monitor | `ui/gauge_frame.png`, `ui/gauge_fill_green.png`, `ui/gauge_fill_red.png`, `ui/gauge_icon_compliance.png`, `ui/gauge_icon_suspicion.png` | Needle jitter at high values, glass glare sweep, red shake near danger |
| **Money counter** | Green text in dark rectangle | Cheap adding-machine display + receipt tape | `ui/money_machine_base.png`, `ui/money_digits_strip.png`, `ui/receipt_tape.png` | Paper feed animation on payout, number pop remains |
| **Victim profile card** | Dark rectangle with yellow header | Manila dossier with paperclip & polaroid portrait | `ui/dossier_panel.png`, `ui/paperclip.png`, `ui/portrait_frame_polaroid.png`, `ui/status_stamp_set.png` | Stamp-in for new intel, slight paper rustle on updates |
| **Script panel** | Sliding neon rectangle from right | Fold-out cheat sheet / notebook tab | `ui/script_tab.png`, `ui/script_panel_paper.png`, `ui/highlighter_streaks.png` | Page-flip open/close (not neon slide) |
| **Quota progress bar** | Flat colored bar at bottom | Wall-mounted quota thermometer / marker bar | `ui/quota_board_frame.png`, `ui/quota_fill_marker.png`, `ui/quota_goal_pin.png` | Marker creeps with squeak, celebratory stamp on completion |
| **Call timer + status** | Cyan text + green dot | Tape recorder widget with REC lamp | `ui/timer_recorder.png`, `ui/timer_digits.png`, `ui/rec_led_on.png`, `ui/rec_led_off.png` | REC blink, subtle reel rotation during call |
| **Buttons** | Flat rectangles with neon borders | Physical chunky office buttons, worn labels | `ui/button_green_idle_hover_press.png`, `ui/button_red_idle_hover_press.png`, `ui/hangup_button_sprite.png` | Press depth + shadow shift, hover = subtle ink glow (not neon bloom) |

---

## 5) Production Specs

- Generate at **2x intended display size**, export PNG with transparency
- **Pivot consistency**: center for props, bottom-center for standing silhouettes
- **No baked shadows** — keep separate contact shadow assets
- Use **random animation start offsets** so loops don't sync
- Background loops: **6-10 fps**; phone ring and alerts: **12-14 fps**

## 6) SOUND DESIGN (ElevenLabs)

### Sound Palette
The audio must match the satirical-but-tense tone. Think: **The Office meets a heist movie.**

### SFX (one-shot sounds)
| Sound | File | Duration | Usage |
|-------|------|----------|-------|
| Phone ring | `sfx/phone_ring.mp3` | 4s | OfficeScene when call ready |
| Phone pickup | `sfx/phone_pickup.mp3` | 1s | Player answers call |
| Phone hangup | `sfx/phone_hangup.mp3` | 1s | Call ends (hang up or victim hangs up) |
| Button click | `sfx/button_click.mp3` | 0.5s | All UI button presses |
| Money cha-ching | `sfx/money_chaching.mp3` | 1.5s | Money earned during/after call |
| Paper rustle | `sfx/paper_rustle.mp3` | 2s | Opening dossier, script panel, FriendBook |
| Stamp press | `sfx/stamp_press.mp3` | 1s | Intel confirmed, performance grade stamp |
| Page flip | `sfx/page_flip.mp3` | 1s | Script panel open/close, notebook navigation |
| Drawer open | `sfx/drawer_open.mp3` | 1.5s | UI panel opening |
| Drawer close | `sfx/drawer_close.mp3` | 1s | UI panel closing |
| Keyboard typing | `sfx/keyboard_typing.mp3` | 3s | Background accent, FriendBook browsing |
| Dial tone | `sfx/phone_dial_tone.mp3` | 3s | Brief tone before call connects |
| Notification ding | `sfx/notification_ding.mp3` | 1s | Intel discovered, status change |
| Suspicion warning | `sfx/suspicion_warning.mp3` | 2s | Suspicion crosses danger threshold |
| Level complete | `sfx/level_complete.mp3` | 3s | Shift quota met / level passed |
| Game over sting | `sfx/game_over.mp3` | 3s | Fired or arrested |
| Tape recorder start | `sfx/tape_recorder_start.mp3` | 2s | Call recording begins (call indicator) |
| Adding machine | `sfx/adding_machine.mp3` | 2s | Money counter updating |

### Ambient Loops (seamless loop)
| Sound | File | Duration | Usage |
|-------|------|----------|-------|
| Office ambience | `ambient/office_ambience.mp3` | 25s | Main gameplay loop — keyboards, muffled calls, AC, coughing |
| Fluorescent hum | `ambient/fluorescent_hum.mp3` | 15s | Layered under office ambience, ties to light flicker |
| Night office | `ambient/night_office.mp3` | 20s | Late-level variant — emptier, eerier |

### Music Tracks (seamless loop)
| Track | File | Duration | Scene |
|-------|------|----------|-------|
| Menu theme | `music/menu_theme.mp3` | 30s | MenuScene — dark jazzy noir lounge, sleazy & comedic |
| Office gameplay | `music/office_gameplay.mp3` | 30s | OfficeScene idle — tense minimalist, corporate anxiety |
| Call active | `music/call_active.mp3` | 30s | During calls — psychological tension, heartbeat rhythm |
| Results success | `music/results_success.mp3` | 30s | ResultsScene passed — darkly triumphant, guilty celebration |
| Results failure | `music/results_failure.mp3` | 30s | ResultsScene failed — comedically pathetic defeat |
| Briefing theme | `music/briefing_theme.mp3` | 30s | BriefingScene — mob-boss-meets-office-manager intimidation |
| Game over theme | `music/game_over_theme.mp3` | 30s | GameOverScene — dramatic noir finality |

### Audio Integration Rules
- **Ambient layers stack**: fluorescent hum (always on) + office ambience (during gameplay)
- **Music crossfades**: 1.5s fade between scene music tracks
- **SFX play over everything**: never duck music for SFX, just layer
- **State-driven volume**: suspicion > 70% = music volume increases, ambient gets quieter (focus on tension)
- **Spatial hint**: background workers' typing SFX should feel slightly panned/distant

---

## 7) BOSS IN THE OFFICE

The boss character should appear in the office background, adding both dynamism and psychological pressure.

### Implementation
- **Asset**: `characters/boss_full_body.png` — full body walking pose, generated from existing boss_idle.png style via image-to-image
- **Animation**: Walking cycle spritesheet (user generates in Ludo.ai from the base frame)
- **Behavior**: Boss paces in the background behind the workers. Occasionally pauses and glances toward the player. During high suspicion, paces faster and glares more frequently
- **Depth layer**: Behind foreground desk, in front of back wall, between/behind workers
- **Scale**: Small (~0.15x) to match background perspective

---

## 8) ANIMATION TASK LIST FOR LUDO.AI

This is the complete list of spritesheet animations to generate in Ludo.ai. For each, use the corresponding static PNG (generated by Meshy) as the base frame.

### Instructions for Ludo.ai
- Input: the static PNG asset listed in "Base Frame"
- Output: a horizontal spritesheet PNG (all frames in a single row)
- Max duration: 3 seconds per animation
- Export at same resolution as input frame

### Office Environment Animations

| # | Animation Name | Base Frame | Frames | Duration | FPS | Loop? | Prompt |
|---|---------------|------------|--------|----------|-----|-------|--------|
| 1 | Light flicker | `office_v2/light_fixture.png` | 8 | 1.0s | 8 | No | Fluorescent tube flickers irregularly: bright, dim, bright, off, bright. Harsh unstable lighting |
| 2 | Light beam pulse | `office_v2/light_beam.png` | 6 | 1.5s | 4 | Yes | Light cone gently pulses in intensity, slightly brighter then dimmer. Subtle breathing rhythm |
| 3 | Worker typing (left) | `office_v2/worker_left.png` | 12 | 1.5s | 8 | Yes | Silhouetted worker types at keyboard. Subtle shoulder and arm movement, slight head bob. Small natural motion |
| 4 | Worker headset adjust (mid) | `office_v2/worker_mid.png` | 10 | 1.25s | 8 | Yes | Worker adjusts headset with one hand, slight lean sideways. Small idle fidget motion |
| 5 | Worker typing (right) | `office_v2/worker_right.png` | 12 | 1.5s | 8 | Yes | Worker types intensely. More hunched posture, faster hand motion. Urgent energy |
| 6 | Background monitor glow | `office_v2/bg_monitor.png` | 6 | 1.5s | 4 | Yes | Monitor screen glow cycles brighter and dimmer, subtle color shift from teal to green |
| 7 | Fan spin | `office_v2/desk_fan.png` | 8 | 0.67s | 12 | Yes | Fan blades spin fast and continuously. Cage stays still, blades become a motion blur circle |
| 8 | Coffee steam | `office_v2/coffee_steam.png` | 16 | 1.6s | 10 | Yes | Steam wisps rise from mug and dissipate. Curling upward motion, fading out at the top |
| 9 | Paper flutter | `office_v2/loose_papers.png` | 8 | 1.0s | 8 | Yes | Papers slightly lift and settle from a gentle breeze. Soft flutter, edges curling up then back down |
| 10 | Cable sway | `office_v2/hanging_cable.png` | 16 | 2.67s | 6 | Yes | Hanging cable swings gently like a slow pendulum. Lazy arc back and forth |
| 11 | CRT scanline shimmer | `office_v2/main_monitor.png` | 6 | 1.0s | 6 | Yes | CRT screen shows subtle rolling scanline and slight static glitch. Faint screen flicker |
| 12 | Phone idle breathe | `office_v2/phone_body.png` | 4 | 1.0s | 4 | Yes | Very subtle micro-movement. Phone barely shifts position, almost imperceptible idle breathing |
| 13 | Phone ring vibrate | `office_v2/phone_body.png` | 10 | 0.71s | 14 | Yes | Phone shakes and vibrates strongly. Rapid left-right jitter with slight rotation, ringing energy |
| 14 | Phone cord sway | `office_v2/phone_cord.png` | 12 | 1.2s | 10 | Yes | Coiled phone cord swings and bounces. Reactive swaying motion as if phone is vibrating nearby |
| 15 | Dust motes drift | `office_v2/dust_particles.png` | 12 | 2.0s | 6 | Yes | Dust particles float slowly through the air. Random gentle drifting, some rising some falling |
| 16 | Smoke wisp rise | `office_v2/smoke_wisp.png` | 14 | 2.0s | 7 | Yes | Thin smoke tendril rises and curls upward, gradually dissipating. Organic flowing wisp |

### Boss Character Animation

| # | Animation Name | Base Frame | Frames | Duration | FPS | Loop? | Prompt |
|---|---------------|------------|--------|----------|-----|-------|--------|
| 17 | Boss walk cycle | `characters/boss_full_body.png` | 12 | 1.0s | 12 | Yes | Full walk cycle. Legs stride, arms swing slightly, belly bounces with each step. Authoritative confident strut |

### UI Element Animations

| # | Animation Name | Base Frame | Frames | Duration | FPS | Loop? | Prompt |
|---|---------------|------------|--------|----------|-----|-------|--------|
| 18 | Tape recorder reels | `ui/tape_recorder.png` | 8 | 1.0s | 8 | Yes | Both cassette tape reels spin steadily. Tape moves between reels. Smooth continuous rotation |
| 19 | Receipt tape feed | `ui/receipt_tape.png` | 6 | 0.75s | 8 | No | Paper receipt advances upward in a short burst. A new line appears as tape feeds out of machine |

### Total: 19 spritesheet animations

---

## 9) Production Specs

- Generate at **2x intended display size**, export PNG with transparency
- **Pivot consistency**: center for props, bottom-center for standing silhouettes
- **No baked shadows** — keep separate contact shadow assets
- Use **random animation start offsets** so loops don't sync
- Background loops: **6-10 fps**; phone ring and alerts: **12-14 fps**
- **Spritesheets**: export as single horizontal strip (all frames in one row)
- **Audio**: MP3 format, normalize to -3dB, seamless loops where specified

## 10) Priority Order

1. Redraw office into layered caricature style + generate core ambient assets
2. Generate all audio (SFX + ambient + music)
3. Replace HUD rectangles with reusable UI skin pack (gauges, panels, buttons, timer)
4. Reskin menu/briefing/results/settings with same UI pack for full cohesion
5. Generate boss full body + all spritesheet animations in Ludo.ai
6. Add event-reactive animation states tied to existing OfficeScene call lifecycle
7. Integrate audio into scene lifecycle (ambient layers, music crossfades, SFX triggers)
