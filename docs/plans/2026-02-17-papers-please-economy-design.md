# Papers, Please Economy System — Final Design

## The Premise

You're lured overseas by a fake job ad. You arrive at a scam compound and discover the truth: your passport is gone, you owe $2,000 in "travel and processing fees," and the only way to work it off is to sit at a desk and make calls. You're not the villain. You're the tool.

## The Level Loop

```
MORNING BRIEFING
  → Boss introduces this level's scam type
  → Shows script, threatens you if you're behind on debt
  → "Get on the phone. Clock's ticking."

THE SHIFT (real-time clock — 5:00 constant)
  → Wall clock counts down from 5:00 → 0:00
  → Player dials as many calls as they can
  → Each call lasts as long as the AI conversation takes
  → At 0:00: no new dials, current call finishes naturally
  → FriendBook available between calls (costs you time)

END OF LEVEL: THE LEDGER
  → Expense sheet: mandatory costs deducted
  → Remaining cash shown
  → "Send money home?" prompt
  → Transition to next morning (30-60 seconds max)
```

## The Shift Clock

A physical animated clock on the back wall of the office, always visible. In-world, not a floating HUD.

Audio cues:
- **60 seconds left**: Single low tone. Clock hand pulses.
- **30 seconds left**: Two tones. Ambient light shifts slightly red.
- **10 seconds left**: Rapid ticking sound.
- **0:00**: Bell rings. "SHIFT OVER" appears. Current call finishes, no new dials.

Shift duration: **5:00 constant** for all levels. Future items/upgrades will extend this.

### Strategic Tension

The clock adds a key decision: **when to hang up.** If a victim is difficult at the 2-minute mark and you have 3 minutes left, do you:
- Keep pushing? Maybe they break and you get a big payout.
- Hang up and try someone else? Faster, smaller payout, but two calls in.

## Economy: What You Earn

No fixed call count. You earn per successful call. More calls = more chances.

| Level | Scam Type | Base Payout | Per-Call Range | Expected Calls | Expected Total |
|-------|-----------|-------------|---------------|----------------|----------------|
| 1 | Gift Card Refund | $200 | $200 – $450 | 2-4 | $400 – $1,200 |
| 2 | IRS Tax Scam | $350 | $350 – $700 | 2-3 | $700 – $1,800 |
| 3 | Tech Support | $400 | $400 – $750 | 2-3 | $800 – $2,000 |
| 4 | Romance Scam | $800 | $800 – $1,500 | 1-3 | $800 – $3,500 |
| 5 | The Scambaiter | Special | Special | 1-2 | N/A |

Bonuses: speed bonus (call under 2 min), low suspicion, clean exit, combo streak.

## Economy: Fixed Costs (Mandatory)

Deducted automatically at end of each level.

| Expense | L1 | L2 | L3 | L4 | L5 | Narrative |
|---------|-----|-----|-----|-----|-----|-----------|
| Bunk Fee | $80 | $100 | $120 | $150 | $200 | "Promotion" = pricier bunk |
| Food | $40 | $45 | $50 | $55 | $60 | Prices go up because they can |
| Debt Repayment | $150 | $200 | $250 | $300 | $400 | Recruiter's fee. "Restructured" each level |
| Protection Fee | — | — | $80 | $100 | $150 | L3+. "Cops are sniffing around" |
| Equipment Levy | — | — | — | $50 | $80 | L4+. "Company tools" fee |
| **TOTAL** | **$270** | **$345** | **$500** | **$655** | **$890** |

### Shortfall Consequences

- **≤ $100**: Boss warns you.
- **$100-300**: Deducted from next level's earnings. Start in the hole.
- **> $300 or 2 consecutive shortfalls**: Boss punishes — lose 30s of next shift, or debt worsens.
- **3 total shortfalls**: Game over. "Sold to another compound."

## Economy: Send Money Home (Optional)

Every ledger screen:
```
┌──────────────────────────────────┐
│  SEND MONEY HOME?                │
│                                  │
│  Mom's last message:             │
│  "We are okay. Focus on work."   │
│                                  │
│  [ $50 ]  [ $100 ]  [ Skip ]    │
└──────────────────────────────────┘
```

- Never mandatory. Never affects gameplay mechanics.
- Messages change based on sending history:
  - Sending: "Sister started school." "Mom got her medicine."
  - Skipping: Messages get shorter. "We understand." → "..."
- Cumulative amount sent affects ending.

## Level 5: The Scambaiter

Boss assigns CEO Fraud. But one target is **Pierogi** (Scammer Payback).

### The Voice Twist

The call starts with an **elderly grandma voice** — a typical CEO fraud target. Pierogi is playing a character, probing the scam operation. After a trigger point (player runs the scam script for ~60 seconds, or compliance/suspicion hits a threshold), the voice changes:

**"Drop the act. I know what you are."**

A new voice — Pierogi's real voice, confident and direct. The AI session reconnects with a new voice and new instructions. The game mechanic flips:

- **Before reveal**: Normal scam call. Grandma seems like a typical victim.
- **After reveal**: Pierogi is suspicious of YOU. He thinks you're just another scammer.
- **Your goal**: Convince him you're a trapped worker, not a willing scammer.
  - Suspicion = he thinks you're a real scammer (starts high after reveal)
  - Compliance = he believes your story (starts very low)
  - If suspicion maxes: he hangs up. You're just another scammer to him.
  - If compliance maxes: he believes you. Rescue incoming.

### Technical: Voice Change Mid-Call

When the reveal triggers:
1. End current WebRTC session
2. Start new session with different voice setting and Pierogi prompt
3. Brief audio transition (line static / reconnect sound)
4. New prompt instructs AI: "You are Pierogi. You just caught a scammer. You're suspicious but willing to listen if they seem genuine."

## Endings

| Condition | Ending |
|-----------|--------|
| Convince Pierogi + sent money home | **"Rescued"** — Compound raided. You're freed. Family waiting. Best ending. |
| Convince Pierogi + never sent money | **"Rescued, alone"** — Freed but nothing to go back to. Bittersweet. |
| Fail to convince Pierogi | **"Still trapped"** — He hangs up. Tomorrow is Level 1 again. Cycle continues. |
| 3 shortfalls (any point) | **"Sold"** — Transferred to another compound. Darkest ending. |
| Heat maxed (any point) | **"Raided"** — Police bust. Ambiguous: rescued or arrested? |

## Persistent State Across Levels

| State | Behavior |
|-------|----------|
| Money (wallet) | Carries across levels. Earnings minus expenses = running balance. |
| Debt display | Shown on ledger. Cosmetic — represents the trap. Never actually payable. |
| Heat | Accumulates from failed calls, police threats. Persists across levels. |
| Family remittance total | Cumulative. Affects ending. |
| Shortfall count | Cumulative. 3 = game over. |

## Extensibility

Adding levels requires only:
1. New row in level config (scam type, payouts, expenses)
2. New victim pool + FriendBook data
3. New prompt config in `src/config/prompts/`
4. Level 5 (Pierogi) always moves to be the final level

Economy is config-driven. Shift duration extensible via future items/upgrades.
