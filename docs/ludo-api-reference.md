# Ludo.ai API Reference (for Sprite Animation Generation)

## Authentication
```
Authentication: ApiKey 05c5ef79-631a-42cc-996b-660fd3d20e5a
```
Key stored in `.env` as `LUDO_API_KEY`.

## Base URL
```
https://api.ludo.ai/api/
```

## animateSprite Endpoint

Creates animated spritesheets from a static image + motion prompt.

**Parameters:**
| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `initial_image` | Yes | string | URL or base64-encoded starting frame |
| `motion_prompt` | Yes | string | Animation description (e.g., "walking cycle") |
| `image_type` | No | string | `sprite`, `sprite-vfx`, `ui_asset` |
| `frames` | No | int | `4`, `9`, `16`, `25`, `36` (default), `49`, `64` |
| `frame_size` | No | int | `64`, `128`, `256` (default), `0` (max resolution) |
| `loop` | No | bool | Seamless loop (default: true) |
| `model` | No | string | `"standard"` or `"new"` (higher quality) |
| `duration` | No | float | Standard: 1.2-3s, New: 4s fixed |
| `final_image` | No | string | URL or base64 of ending frame (for loop matching) |
| `pixel_art_filter` | No | string | `none`, `small`, `medium`, `large` |
| `gif` | No | bool | Generate animated GIF (default: false) |
| `individual_frames` | No | bool | Extract individual frames (default: false) |

**Response fields:**
- `spritesheet_url` — the spritesheet PNG
- `video_url` — preview video
- `gif_url` — animated GIF (if requested)
- `individual_frame_urls` — array of individual frame URLs (if requested)
- `num_frames` — total frame count
- `num_cols` — columns in spritesheet grid
- `num_rows` — rows in spritesheet grid

**Cost:** 5 credits per animation
**Processing time:** 30-90 seconds

## Settings We Use

Based on testing results:
- **Model**: `"new"` — higher quality, more dynamic, better motion
- **Loop**: `true` — seamless loops
- **final_image**: Set to same as `initial_image` for loop matching (then skip last frame in Phaser)
- **Animation Margin**: "No margin" equivalent (keep alignment)
- **Trim Whitespace**: Disabled (consistent frame sizes)
- **frame_size**: `0` (max resolution)

## Remaining Animations to Generate

14 spritesheet animations (dropped #2 light beam pulse, #12 phone idle breathe, #15 dust motes — handled in code):

| # | Name | Base Frame | Frames | Duration | Prompt |
|---|------|------------|--------|----------|--------|
| 1 | Light flicker | `office_v2/light_fixture.png` | 36 | 1.0s | Fluorescent tube flickers irregularly: bright, dim, bright, off, bright. Harsh unstable lighting |
| 3 | Worker typing (L) | `office_v2/worker_left.png` | 49 | 1.5s | Silhouetted worker types at keyboard. Subtle shoulder and arm movement, slight head bob. Small natural motion |
| 4 | Worker headset (M) | `office_v2/worker_mid.png` | 36 | 1.25s | Worker adjusts headset with one hand, slight lean sideways. Small idle fidget motion |
| 5 | Worker typing (R) | `office_v2/worker_right.png` | 49 | 1.5s | Worker types intensely. More hunched posture, faster hand motion. Urgent energy |
| 6 | Monitor glow | `office_v2/bg_monitor.png` | 36 | 1.5s | Monitor screen glow cycles brighter and dimmer, subtle color shift from teal to green |
| 7 | Fan spin | `office_v2/desk_fan.png` | 36 | 0.67s | Fan blades spin fast and continuously. Cage stays still, blades become a motion blur circle |
| 8 | Coffee steam | `office_v2/coffee_steam.png` | 49 | 1.6s | Steam wisps rise from mug and dissipate. Curling upward motion, fading out at the top |
| 9 | Paper flutter | `office_v2/loose_papers.png` | 36 | 1.0s | Papers slightly lift and settle from a gentle breeze. Soft flutter, edges curling up then back down |
| 10 | Cable sway | `office_v2/hanging_cable.png` | 49 | 2.67s | Hanging cable swings gently like a slow pendulum. Lazy arc back and forth |
| 11 | CRT shimmer | `office_v2/main_monitor.png` | 36 | 1.0s | CRT screen shows subtle rolling scanline and slight static glitch. Faint screen flicker |
| 13 | Phone ring vibrate | `office_v2/phone_body.png` | 36 | 0.71s | Phone shakes and vibrates strongly. Rapid left-right jitter with slight rotation, ringing energy |
| 14 | Phone cord sway | `office_v2/phone_cord.png` | 36 | 1.2s | Coiled phone cord swings and bounces. Reactive swaying motion as if phone is vibrating nearby |
| 16 | Smoke wisp rise | `office_v2/smoke_wisp.png` | 49 | 2.0s | Thin smoke tendril rises and curls upward, gradually dissipating. Organic flowing wisp |
| 17 | Boss walk cycle | `characters/boss_full_body.png` | 49 | 1.0s | Full walk cycle. Legs stride, arms swing slightly, belly bounces with each step. Authoritative confident strut |
| 18 | Tape recorder reels | `ui/tape_recorder.png` | 36 | 1.0s | Both cassette tape reels spin steadily. Tape moves between reels. Smooth continuous rotation |
| 19 | Receipt tape feed | `ui/receipt_tape.png` | 25 | 0.75s | Paper receipt advances upward in a short burst. A new line appears as tape feeds out of machine |

**For all looping animations (#3-18):** set `final_image` = `initial_image` to force loop matching.
**For non-looping (#1, #19):** omit `final_image`, set `loop: false`.

## Notes
- All base frame PNGs are in `public/assets/` with transparency already applied
- Originals (pre-transparency) are saved as `*_original.png`
- Boss walk cycle already manually generated and tested — may skip #17
- Coffee steam already manually generated and tested — may skip #8
- Use "new" model, max resolution, no margin, no whitespace trimming
