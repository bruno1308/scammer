# Intel Redesign: Floors 1-3 Difficulty Fix

**Date**: 2026-02-23
**Status**: Design
**Scope**: Floors 1-3 intel system, new computer apps, UX improvements

---

## Problem Statement

Players get stuck after the initial investigation steps. They find the first FriendBook post about the victim but cannot locate the remaining intel pieces and cannot close scams. Four core issues:

1. **Players don't navigate to family/friend profiles** — FriendBook intel on Floors 2-3 is on other people's profiles, but nothing guides players to check the Friends & Family tab
2. **Weak intel pieces** — many intel items are timing filler (delivery dates, transaction timestamps) that don't give the player a usable scam lever
3. **Opaque intel tracker** — shows `[??] ???` for unfound intel, giving no indication of what kind of information to look for
4. **"Use intel naturally" mechanic is unclear** — players don't understand they need to verbally reference intel details during voice calls, and the existing `callHint` data is never surfaced in the UI

## Design Goals

- Replace 4 intel pieces per victim (some filler) with **3 strong pieces**, all directly usable as social engineering levers
- Introduce **new computer apps** gradually across floors for richer investigation gameplay
- Add an **untimed research phase** before calls so players aren't rushed
- Improve the **intel tracker UX** to guide without spoiling
- Surface **callHints** to teach players how to use intel in conversation

---

## New Computer Apps

Four apps on the in-game computer desktop, unlocked progressively:

### 1. FriendBook (existing)
Fake social network. The primary investigation tool across all floors. Browse victim and family profiles, posts, comments, About sections, and Friends & Family lists.

### 2. Notebook (new — available from Floor 1)
Player note-taking app. Per-victim notepad where players can type freeform notes during the research phase. Notes persist across the shift so they're available during calls. Simple text editor UI with victim name as header.

**Purpose**: Bridges research and calls. Players jot down key details ("Dorothy — Visa debit, LEGO $49.99, 847 Elm St") and reference their notes during voice calls. Encourages active investigation rather than passive scrolling.

### 3. WebMail (new — introduced Floor 2)
Password-protected email client. Each victim has their own email account. Contains order confirmations, bank alerts, official notifications, and personal correspondence.

**Password mechanic**:
- Floor 2: Password is deducible from a single FriendBook reference. Password hint appears after 2-3 failed attempts (Windows-style "reminder" the victim set for themselves)
- Floor 3: Password requires combining 2 pieces of info from different FriendBook profiles. Same hint mechanic
- Email is never the ONLY source for any intel — always a fallback path via FriendBook, just less direct

### 4. Searchr (new — introduced Floor 4)
Fake search engine for researching victims via public records, news, company websites, and review sites. Not covered in this design (Floors 4-5 scope).

### Tool Unlock Progression

| Floor | FriendBook | Notebook | WebMail | Searchr |
|-------|-----------|----------|---------|---------|
| 1     | Yes       | Yes      | No      | No      |
| 2     | Yes       | Yes      | Yes (introduced) | No |
| 3     | Yes       | Yes      | Yes     | No      |
| 4     | Yes       | Yes      | Yes     | Yes (introduced) |
| 5     | Yes       | Yes      | Yes     | Yes     |

---

## Research Phase

### Current Flow (timed)
Player enters OfficeScene → 5-minute shift timer starts → player must research AND call within the time limit.

### New Flow (untimed research + timed calls)
1. Player enters OfficeScene in **research mode** — no shift timer visible
2. Computer is available with all unlocked apps. Player investigates freely
3. When ready, player picks up the phone → **shift timer starts** (5 minutes)
4. During calls, the computer remains accessible but time is ticking
5. After each call, if time remains, player returns to research mode for the next victim (timer pauses between calls, or continues — TBD based on playtesting)

**Rationale**: Players need time to investigate without pressure. The timed element is the call itself and shift management, not the research. This matches investigation game feel (Orwell, Telling Lies, Return of the Obra Dinn).

---

## UX Improvements

### A. Category-Based Intel Tracker

**Current** (opaque):
```
[??] ???
[??] ???
[??] ???
[??] ???
```

**Redesigned** (shows categories, hides content):
```
🔍 Order details ........... ❌
🔍 Home address ............ ❌
🔍 Payment method .......... ❌
```

- Categories are always visible — tells players WHAT kind of info to look for
- Content is NOT revealed when intel is seen (current `markIntelSeen` behavior is correct)
- Content + callHint revealed only when intel is used in the call (`intel_used` / `intel_triggered`)

**After successful use in call**:
```
⭐ LEGO Unicorn Castle ($49.99) — CONFIRMED
   💬 "Reference the specific item and price to prove account access"
🔍 Home address ............ ❌
⭐ Visa debit card — CONFIRMED
   💬 "Say 'the Visa debit card on file' to sound official"
```

### B. CallHint Display

`callHint` data already exists in the FriendBook config but is never shown to the player. After `intel_used`, the tracker expands to show the hint as a coaching tip. This teaches players HOW to use intel naturally in conversation.

### C. Notification Dots on Friends Tab

When a connected profile has posts containing unseen intel, their name in the Friends & Family list shows a subtle blue activity dot. Not "INTEL HERE" — just "this person has been active recently," like real social media notifications.

**Scales by floor**:
- Floor 1: Prominent dots (tutorial, players are learning)
- Floor 2: Subtle dots
- Floor 3: No dots (players should know to check by now)

### D. Tutorial Popups (Floor 1 only)

First-time tutorial sequences using existing `TutorialPopup` system:

1. **First FriendBook open**: "This is FriendBook. Your targets post about their lives here — and so do their friends and family. Dig through their network for details you can use on the call."
2. **First Notebook open**: "Use the Notebook to jot down useful details you find. You can reference your notes during calls."
3. **First intel confirmed in call**: "Intel confirmed! The victim now believes you have real account access. Mentioning specific details naturally makes your scam story credible."

### E. Script Drawer Integration

For Floors 1-2 (static script steps), the script drawer shows generic steps. When intel categories are known, steps reference the category:
- Generic: "Establish account access"
- With category context: "Establish account access (mention their Order details)"

For Floor 3 (progressive reveal), this already works via the `unlocks` system — intel found reveals locked script steps.

---

## Floor 1: Consumer Refund Scams

**Apps**: FriendBook, Notebook
**Intel per victim**: 3 (all from FriendBook)
**Starting stats**: suspicion 15, compliance 30
**Win condition**: `gives_gift_card_code` at compliance 95+

### Dorothy Miller — amazon_overcharge

| # | Key | Role | Boost | Source | Content |
|---|-----|------|-------|--------|---------|
| 1 | `AMAZON_ORDER` | Problem | 15 | FriendBook (Dorothy's post) | Dorothy posted about buying a LEGO Unicorn Castle ($49.99) for granddaughter Emma's birthday |
| 2 | `VISA_CARD` | Legitimacy | 12 | FriendBook (Mike's post) | Mike (son-in-law) mentions Dorothy's Visa debit card had a double-charge concern |
| 3 | `SHIPPING_ADDRESS` | Legitimacy | 10 | FriendBook (Karen's post) | Karen (daughter-in-law) mentions sending something to "Mom at 847 Elm Street" |

**Tracker categories**: `Order details`, `Payment method`, `Shipping address`

**CallHints**:
1. "Reference her specific Amazon order for the LEGO set to establish you have her account on file"
2. "Say 'the Visa debit card on file' to sound like you see her payment method"
3. "Confirm her shipping address to prove you're in the system"

**Scam call example**: "Ma'am, I can see a charge of $49.99 for a LEGO product shipped to 847 Elm Street on the Visa debit card on file."

### Harold Patterson — bank_fraud_alert

| # | Key | Role | Boost | Source | Content |
|---|-----|------|-------|--------|---------|
| 1 | `BANK_NAME` | Legitimacy | 15 | FriendBook (Harold's post) | Harold posts about a suspicious charge at Arizona Federal Credit Union |
| 2 | `RECENT_PURCHASE` | Problem | 12 | FriendBook (Harold's post) | Same thread: Harold bought an HP laptop ($489) at Best Buy |
| 3 | `ACCOUNT_TYPE` | Legitimacy | 10 | FriendBook (Richard's post) | Richard (friend) mentions Harold's had his Arizona Federal debit card for 15 years |

**Tracker categories**: `Bank name`, `Recent purchase`, `Account details`

**CallHints**:
1. "Say 'Arizona Federal Credit Union fraud department' to establish authority"
2. "Reference the $489 Best Buy charge as the suspicious transaction"
3. "Mention his longtime debit account to sound like you have his full file"

**Scam call example**: "Sir, this is Arizona Federal fraud department. We're flagging a $489 charge at Best Buy on your debit account — was that authorized?"

### Margaret O'Brien — health_insurance_rebate

| # | Key | Role | Boost | Source | Content |
|---|-----|------|-------|--------|---------|
| 1 | `INSURANCE_PROVIDER` | Legitimacy | 15 | FriendBook (Margaret's post) | Margaret mentions her MassHealth Plus checkup |
| 2 | `MEDICAL_DETAILS` | Problem | 12 | FriendBook (Colleen's post) | Colleen (friend) describes Wednesday bloodwork — lipid panel + thyroid |
| 3 | `PAYMENT_METHOD` | Legitimacy | 10 | FriendBook (Patrick's post) | Patrick (son) mentions premiums auto-debit from checking account |

**Tracker categories**: `Insurance provider`, `Recent medical visit`, `Payment method`

**CallHints**:
1. "Say 'MassHealth Plus billing department' to establish authority"
2. "Reference the lipid panel bloodwork to prove you have her medical records"
3. "Mention the auto-debit from checking to sound like you see her billing profile"

**Scam call example**: "This is MassHealth Plus billing. Your recent bloodwork — the lipid panel at Dr. Patel's — generated a rebate applied to the wrong account. Your checking auto-debit will be credited once we verify."

---

## Floor 2: Government Impersonation

**Apps**: FriendBook, Notebook, WebMail (introduced)
**Intel per victim**: 3 (split between FriendBook and Email)
**Starting stats**: suspicion 30, compliance 10
**Win condition**: `agrees_to_pay` at compliance 95+

### Email Password Design (Floor 2)

Passwords are deducible from a **single FriendBook reference**. After 2-3 failed attempts, a Windows-style password hint appears.

| Victim | Password | Hint Text | FriendBook Source |
|--------|----------|-----------|-------------------|
| David Chen | `upbuild2019` | "My consulting company + founding year" | Mei's post mentions UpBuild Consulting; bio says "est. 2019" |
| Maria Gonzalez | `rosa1946` | "Abuela's name + birth year" | Sofia mentions abuela Rosa turns 80 → born 1946 |
| James Wilson | `diversey` | "Where we had our first date" | Angela's anniversary post mentions Diversey Avenue |

### David Chen — tax_undeclared_income

| # | Key | Role | Boost | Source | Content |
|---|-----|------|-------|--------|---------|
| 1 | `FREELANCE_INCOME` | Problem | 15 | FriendBook (Mei's post) | Mei brags about David's UpBuild Consulting side gig and 1099 contractor income |
| 2 | `TAX_FILING` | Legitimacy | 12 | Email (H&R Block confirmation) | Email from Steve at H&R Block: joint filing confirmation, mentions "contractor 1099 discrepancy" |
| 3 | `RENOVATION_EXPENSE` | Pressure | 10 | FriendBook (Mei's post) | Mei posts about their $22K kitchen renovation — "unreported income funding luxury purchases" |

**Tracker categories**: `Income source`, `Tax filing details`, `Flagged expenditure`

**Scam call example**: "Mr. Chen, our records show unreported 1099 income through UpBuild Consulting. Your joint filing with Steve at H&R Block shows a discrepancy, and we've flagged a $22,000 renovation against your reported income."

### Maria Gonzalez — customs_detained_package

| # | Key | Role | Boost | Source | Content |
|---|-----|------|-------|--------|---------|
| 1 | `PACKAGE_DETAILS` | Problem | 15 | Email (DHL shipping confirmation) | DHL email: tracking #, weight, declared value $340, destination Guadalajara |
| 2 | `DESTINATION_ADDRESS` | Legitimacy | 12 | FriendBook (Carlos's post) | Carlos posted shipping receipt with address: Calle Reforma 247, Colonia Centro |
| 3 | `EMOTIONAL_STAKES` | Pressure | 10 | FriendBook (Sofia's post) | Sofia mentions it's for abuela Rosa's 80th birthday — irreplaceable family items |

**Tracker categories**: `Shipment details`, `Destination address`, `Package contents`

**Scam call example**: "We have shipment to Calle Reforma 247, declared at $340, flagged for exceeding duty-free limits. If the clearance fee isn't paid by Friday, the package will be returned — I understand it's for a family celebration."

### James Wilson — outstanding_court_fine

| # | Key | Role | Boost | Source | Content |
|---|-----|------|-------|--------|---------|
| 1 | `TRAFFIC_INCIDENT` | Problem | 15 | FriendBook (Angela's post) | Angela posts about the Kennedy Expressway rear-end collision |
| 2 | `CASE_DETAILS` | Legitimacy | 12 | Email (court notification) | Cook County Circuit Court email: case #, 14th District filing, fine amount, payment deadline |
| 3 | `CAREER_STAKES` | Pressure | 10 | FriendBook (Tamara's post) | Tamara congratulates James on Operations Manager promotion at Lakefront Manufacturing — bench warrant = career risk |

**Tracker categories**: `Legal incident`, `Case details`, `Employment risk`

**Scam call example**: "Mr. Wilson, Cook County Clerk's office. Case from the Kennedy Expressway incident, 14th District filing — there's an outstanding fine. A bench warrant would appear on employer background checks."

---

## Floor 3: Tech Support Scam

**Apps**: FriendBook, Notebook, WebMail
**Intel per victim**: 3 (Email becomes primary source)
**Starting stats**: suspicion 15, compliance 25
**Win condition**: `agrees_to_pay` at compliance 95+
**Special**: TechDesktopScene + progressive script reveal

### Email Password Design (Floor 3)

Passwords require combining **2 pieces of info from different FriendBook profiles**. Hint appears after 2-3 failed attempts.

| Victim | Password | Hint Text | FriendBook Sources |
|--------|----------|-----------|-------------------|
| Karen Thompson | `broncosjune` | "His team + our wedding month" | Brian's bio: "Go Broncos!" + Karen's About: "Married: June 2018" |
| Mike Rodriguez | `6812` | "My Mustang's year + my jersey" | Mike posts about '68 Mustang + Tony's game photo shows Mike in #12 jersey |
| Tom Anderson | `maple2011` | "Our street + Zoe's birth year" | Rachel mentions "15 years on Maple Drive" + Zoe's profile: age 15 → born ~2011 |

### Karen Thompson — antivirus_expiry

| # | Key | Role | Boost | Source | Content |
|---|-----|------|-------|--------|---------|
| 1 | `NORTON_EXPIRY` | Problem | 15 | Email (Norton notification) | Norton email: "Subscription expired Jan 28. Last scan: 47 threats detected. Renew to protect your files." |
| 2 | `MALWARE_SYMPTOMS` | Legitimacy | 12 | FriendBook (Karen's comment) | Karen describes random tabs opening, weird pop-ups. Brian warns not to click anything |
| 3 | `WORK_FILES` | Pressure | 10 | FriendBook (Karen's comment) | Karen mentions patient scheduling and billing files on the computer — terrified to lose them |

**Tracker categories**: `Security status`, `Symptoms`, `Files at risk`

**Progressive reveal**:
- `NORTON_EXPIRY` unlocks steps [0, 1] (initial diagnostics)
- `MALWARE_SYMPTOMS` unlocks step [2] (escalation)
- `WORK_FILES` unlocks step [3] (close)

**Scam call example**: "Ma'am, our system shows your Norton license expired January 28th and 47 threats were detected. I can see browser redirects and pop-ups — that's consistent with a compromised system. We need to secure your files, including any work documents, before the infection spreads."

### Mike Rodriguez — email_compromise

| # | Key | Role | Boost | Source | Content |
|---|-----|------|-------|--------|---------|
| 1 | `SECURITY_ALERT` | Problem | 15 | Email (Gmail security alert) | Gmail: "New sign-in from unknown device — Saturday 10:47 AM — Location: Lagos, Nigeria" |
| 2 | `SENT_SPAM` | Legitimacy | 12 | Email (Sent folder) | Sent emails Mike didn't write — spam sent to 47 contacts including ray.martinez@autopartsdirect.com |
| 3 | `PROFESSIONAL_DAMAGE` | Pressure | 10 | FriendBook (Tony's post) | Tony reveals Ray the parts supplier got the spam — Mike's professional reputation at stake |

**Tracker categories**: `Security breach`, `Unauthorized activity`, `Contacts affected`

**Progressive reveal**:
- `SECURITY_ALERT` unlocks steps [0, 1]
- `SENT_SPAM` unlocks step [2]
- `PROFESSIONAL_DAMAGE` unlocks step [3]

**Scam call example**: "Mr. Rodriguez, our security team detected unauthorized access at 10:47 AM Saturday from Lagos, Nigeria. 47 outgoing messages were sent, including to your business contacts. We need to secure the account before more emails go out."

### Tom Anderson — subscription_trap

| # | Key | Role | Boost | Source | Content |
|---|-----|------|-------|--------|---------|
| 1 | `SUBSCRIPTION_CHARGE` | Problem | 15 | Email (CloudShield Pro billing) | "Free trial auto-renewed. Annual charge: $399.00 to Visa ending 4821. To cancel, call 1-888-555-0147" |
| 2 | `SERVICE_NAME` | Legitimacy | 12 | FriendBook (Tom's comment) | Tom describes "CloudShield Pro free trial auto-renewed at $399/year" — has no idea what it is |
| 3 | `FINANCIAL_PRESSURE` | Pressure | 10 | FriendBook (Tom's comment) | Between Zoe's MCAD fees, new furnace, and $399 charge — finances tight |

**Tracker categories**: `Subscription details`, `Service name`, `Financial situation`

**Progressive reveal**:
- `SUBSCRIPTION_CHARGE` unlocks steps [0, 1]
- `SERVICE_NAME` unlocks step [2]
- `FINANCIAL_PRESSURE` unlocks step [3]

**Scam call example**: "This is CloudShield Pro support. The Visa card ending 4821 was charged $399 for annual renewal. I can process the refund, but first we need to verify your system is clean since the trial detected security issues."

---

## Boost Calculations

With 3 intel pieces at boosts 15 + 12 + 10 = 37 total per victim:

| Intel | Boost | Compliance gain | Suspicion reduction |
|-------|-------|----------------|-------------------|
| Primary | 15 | +9 | -6 |
| Secondary | 12 | +7 | -5 |
| Tertiary | 10 | +6 | -4 |
| **Total** | **37** | **+22** | **-15** |

Compare to current 4-piece system (15+10+8+5 = 38): compliance +23, suspicion -15. Nearly identical total impact, but each individual piece is now more satisfying to use.

---

## Implementation Scope

### New Scenes
- **NotebookScene** — simple text editor overlay, per-victim notes, persists across shift
- **WebMailScene** — login screen + inbox view, password validation, hint display after failed attempts
- (SearchrScene deferred to Floor 4+ design)

### Modified Scenes
- **OfficeScene** — computer desktop now shows app icons (FriendBook, Notebook, WebMail when available). Research mode before shift timer starts
- **CallScene** — intel tracker shows categories. CallHints displayed after intel_used
- **SocialNetworkScene** — notification dots on Friends tab (Floor 1: prominent, Floor 2: subtle, Floor 3: none)

### Config Changes
- **levels.js** — add `availableApps` array per floor, add `emailPassword`/`emailHint` per victim
- **friendbook/level1-3.js** — replace intelKeys (4→3 per victim), update post content, add email-related breadcrumbs
- **prompts/level1-3.js** — update intel trigger instructions for new 3-intel structure
- **New**: `config/webmail/level2.js`, `config/webmail/level3.js` — email inbox data per victim

### GameState Changes
- Add `researchPhase` boolean — true until player picks up phone
- Notebook data: `victimNotes` map persisted per shift
- Email state: `emailLoggedIn` map tracking which victim inboxes are unlocked

### Tutorial System
- 3 first-time popups (Floor 1): FriendBook intro, Notebook intro, first intel confirmed
- 1 first-time popup (Floor 2): WebMail intro

---

## Summary of Changes vs Current

| Aspect | Current | Redesigned |
|--------|---------|-----------|
| Intel per victim | 4 (some filler) | 3 (all scam-relevant) |
| Intel sources | FriendBook only | FriendBook + Email (+ Searchr on Floor 4+) |
| Computer apps | FriendBook | FriendBook, Notebook, WebMail, (Searchr) |
| Research timing | Timed (5-min shift) | Untimed research + timed calls |
| Intel tracker | `[??] ???` | Category labels (`Order details ❌`) |
| CallHints | Data exists, never shown | Shown after intel confirmed in call |
| Friends tab | No indicators | Notification dots (scales by floor) |
| Tutorials | Basic Level 1 tips | Structured popups for each new mechanic |
| Floor 3 intel location | Buried in comment threads | Primary intel in Email, supporting in FriendBook |
| Email access | N/A | Password puzzle (escalating difficulty + hints) |
| Player notes | N/A | Notebook app for per-victim notes |
