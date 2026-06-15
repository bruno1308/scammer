# Intel System & Scam Variant Redesign

## Problem

The current intel system gives players generic personal trivia (grandchild's name, late spouse, pet name). This feels like stalking, not social engineering. There's no connection between the intel you gather and the scam you're running. Additionally, every victim on a floor uses the exact same scam script, making repeat calls feel repetitive.

## Goals

1. **Intel should make the scam story credible.** When you reference a real detail from their life that aligns with the scam, the victim believes you're legitimate.
2. **Each victim has a unique scam variant** within the floor's theme, so every call feels different.
3. **Difficulty progression**: Floors 1-2 tell you the variant upfront. Floors 3-5 require you to discover it through FriendBook research.
4. **The helper UI (script drawer) adapts** — showing variant-specific steps on Floors 1-2, and progressively revealing them on Floors 3-5 as you gather intel.

## Difficulty Curve

| Floor | Variant Discovery | Helper UI Behavior | Intel Role |
|-------|------------------|-------------------|------------|
| 1-2 | **Pre-assigned** — variant is known before the call | Shows full variant-specific steps immediately | Makes your story credible ("I see the charge on your account...") |
| 3-5 | **Discovered** — player must research FriendBook to find the angle | Starts with generic theme steps; refines as intel is gathered | Reveals the angle AND makes it credible |

## Boss Briefing

The boss briefing stays **general/theme-level**, not per-victim. This makes sense because players call multiple victims per shift. Examples:
- Floor 1: "Gift card refund scams. Follow the script."
- Floor 2: "Government impersonation. Scare them into paying."
- Floor 3: "Tech support scams. Make them think their computer is compromised."
- Floor 4: "Trust scams. Find their weakness, exploit it."
- Floor 5: "Corporate fraud. Big fish, big money."

---

## Floor 1 — Consumer Refund Scams (5 victims)

**Theme**: Pose as customer service for a company the victim recently interacted with. Claim an overcharge or billing error. Ask for gift cards to "process the refund."

| Victim | Variant | Key Intel (from FriendBook) | Script Steps |
|--------|---------|----------------------------|-------------|
| Dorothy Miller | **Amazon overcharge** | Posted about ordering a birthday gift on Amazon last week | 1. "Amazon Customer Service" calling about her recent order 2. Billing error — she was charged $499.99 instead of the correct amount 3. Refund was issued but system overpaid by $3,000 4. She needs to buy gift cards to return the excess 5. Read the codes over the phone to "complete the reversal" |
| Harold Patterson | **Bank fraud alert** | Complained about a suspicious charge on his bank statement in a comment thread | 1. Calling from his bank's fraud department 2. Detected an unauthorized charge on his account 3. A provisional refund was issued but "overcredited" his account 4. He needs to purchase gift cards to balance the ledger 5. Read codes to "finalize the correction" |
| Betty Nakamura | **Online pharmacy billing** | Posted about ordering prescriptions online, mentioned high medication costs | 1. Calling from the pharmacy's billing department 2. Her last prescription order was double-charged 3. Refund was processed but sent too much 4. Gift cards needed to return the overage 5. Read codes to "reconcile the account" |
| Earl Washington | **Internet provider overcharge** | Grandson posted about grandpa's broadband bill being way too high, Earl replied confused | 1. Calling from his internet provider's billing team 2. Found 6 months of overcharges on his account 3. A bulk refund was issued but exceeded the owed amount 4. Gift cards needed to return the excess credit 5. Read codes to "close out the refund ticket" |
| Margaret O'Brien | **Health insurance rebate** | Posted about a recent doctor visit and confusion about insurance claims | 1. Calling from her insurance provider's claims department 2. Her last claim was overprocessed — she's owed a rebate 3. Rebate was sent but system issued double payment 4. Gift cards needed to "verify identity" before they can correct it 5. Read codes to "authenticate and release the adjustment" |

**Intel structure per victim (Floor 1):**
Each victim has 3-4 intel items, all supporting the scam narrative:
- **Primary intel** (boost: 15) — The specific purchase/transaction to reference (e.g., Dorothy's Amazon order)
- **Account detail** (boost: 10) — A detail that makes you sound like you have their file (e.g., Harold's bank name, Betty's pharmacy)
- **Personal context** (boost: 8) — Why the purchase was made, adds conversational authenticity (e.g., "the gift for your granddaughter's birthday")
- **Timing detail** (boost: 5) — When it happened, making the claim date-specific (e.g., "the order placed last Tuesday")

---

## Floor 2 — Government Impersonation (4 victims)

**Theme**: Pose as an official from a government agency. Claim the victim owes money, faces legal action, or has a flagged account. Demand immediate payment.

| Victim | Variant | Key Intel (from FriendBook) | Script Steps |
|--------|---------|----------------------------|-------------|
| David Chen | **Tax authority — undeclared income** | Wife posted about his new contracting side job. He complained about tax season being confusing | 1. Calling from the tax authority's enforcement division 2. His return has been flagged — discrepancy between reported and actual income 3. Additional assessment of $4,200 owed 4. A warrant for asset seizure has been filed — can be stayed with immediate payment 5. Accept wire transfer or prepaid cards for "expedited processing" |
| Maria Gonzalez | **Customs fee — detained package** | She posted about ordering a gift for her mother abroad. A friend commented about customs being slow lately | 1. Calling from the national customs office 2. A package addressed to her has been detained at the border 3. Contents flagged as exceeding the duty-free import limit 4. Customs fee of $1,200 required within 24 hours or the package is destroyed 5. Prepaid cards or wire transfer accepted for "immediate clearance" |
| James Wilson | **Outstanding court fine** | He posted about a traffic incident last month. A friend joked "hope you didn't get a ticket" — he replied "don't ask" | 1. Calling from the county court clerk's office 2. An outstanding fine associated with his case was never paid 3. A bench warrant has been issued — arrest within 48 hours 4. Can be resolved immediately with payment of $2,500 5. Prepaid cards accepted as "emergency payment method" |
| Priya Patel | **Pension/benefits suspension** | She recently posted about updating her personal records after a name change. Her mother commented about the paperwork headaches | 1. Calling from the national pension authority 2. Suspicious activity detected on her pension account — possible identity fraud 3. Benefits will be frozen pending investigation unless verified now 4. Verification requires a "security processing fee" of $800 5. Prepaid cards or wire transfer to "reactivate the account" |

**Intel structure per victim (Floor 2):**
- **Primary intel** (boost: 15) — The real-life event that makes the scam plausible (e.g., David's contracting job, Maria's international package)
- **Authority detail** (boost: 10) — Something that makes you sound like you have their records (e.g., a case number, a date, a specific amount that's close to reality)
- **Pressure point** (boost: 8) — A consequence they'd specifically fear (e.g., David can't afford tax trouble with a new business, Maria's package is a gift for her mother)
- **Corroborating detail** (boost: 5) — A secondary detail from a friend/family post that confirms the story (e.g., James's friend mentioning the ticket)

---

## Floor 3 — Tech Support Scams (4 victims)

**Theme**: Pose as tech support for a service the victim uses. Claim their device or account is compromised. Get remote access or payment for a "fix."

**Discovery mechanic begins.** The helper UI starts with generic steps:
> 1. *Establish you're from their tech provider*
> 2. *Describe the problem you "detected"*
> 3. *Gain trust — reference something real about their setup*
> 4. *Get remote access or payment for the fix*

As intel is gathered, steps refine to the specific variant.

| Victim | Discovered Angle | How It's Found on FriendBook | Refined Script Steps |
|--------|-----------------|------------------------------|---------------------|
| Robert Kim | **Antivirus expiry** | He posted asking friends which antivirus to use after his Norton licence expired. Comment thread reveals he's been running unprotected for 3 weeks | 1. Calling from Norton Security renewal team 2. "Your subscription lapsed and our system flagged malware on your device" 3. Reference the lapse date (matches his post timeline) 4. Remote session to "run an emergency scan" 5. Payment for emergency licence renewal + cleanup fee |
| Susan Douglas | **Email compromise** | Her sister posted "Did anyone else get a weird email from Susan?" — Susan replied embarrassed, said she didn't know what happened | 1. Calling from her email provider's security team 2. "Your account sent unauthorized messages — we've received reports" 3. Reference the incident (matches the sister's post) 4. "Verify identity" with payment to "restore secure access" 5. Need her to "confirm account details" for the reset |
| Frank Olivetti | **Banking alert** | Frank shared an article about online banking fraud. His daughter commented "Dad PLEASE be careful, you do everything on that old laptop" | 1. Calling from his bank's cybersecurity division 2. "We detected a login from an unrecognized device" 3. Reference his device type (old laptop, from daughter's comment) 4. Remote access to "secure the banking session" 5. Payment for "real-time protection software" |
| Diane Kowalski | **Subscription trap** | Diane posted a screenshot asking "Did I sign up for this?" showing a subscription notification. Friends told her to ignore it but she's clearly anxious about it | 1. Calling from the subscription service's cancellation department 2. "You enrolled in a free trial that auto-renewed at $399/year" 3. Reference the notification she saw (matches her screenshot post) 4. To cancel, need to "verify the refund" via remote access 5. Processing fee to "reverse the charge before next billing cycle" |

**Discovery flow:**
1. Player opens FriendBook, browses victim's profile — posts are about everyday life
2. Tech-related clues are buried in post content, comment threads, or family members' posts
3. Finding the primary intel item reveals which tech angle to run — helper UI updates
4. Finding secondary intel items add specific details that make the story airtight
5. Calling without research = generic steps only, victim is much harder to convince

**Intel structure per victim (Floor 3):**
- **Angle intel** (boost: 15) — The tech problem they actually have. Discovering this unlocks the variant-specific script. (e.g., Robert's expired Norton)
- **Corroborating detail** (boost: 10) — A second data point that confirms the story (e.g., Frank's old laptop)
- **Emotional hook** (boost: 8) — Why this problem scares them specifically (e.g., Diane is clearly anxious about unexpected charges)
- **Timing detail** (boost: 5) — When the problem happened, making your claim date-specific

---

## Floor 4 — Trust & Confidence Scams (4 victims)

**Theme**: Exploit a real emotional vulnerability or life situation. Pose as someone who can help with a problem the victim actually has. The "product" varies — debt relief, investment, customs clearance, charity.

**Discovery is emotional, not technical.** The player reads between the lines of family dynamics, financial anxieties, and personal vulnerabilities to determine which approach to use.

Generic helper steps:
> 1. *Identify the victim's core vulnerability*
> 2. *Establish yourself as someone who can help with their specific situation*
> 3. *Build rapport — show you understand their problem*
> 4. *Introduce the financial ask as part of the solution*

| Victim | Discovered Angle | How It's Found on FriendBook | Refined Script Steps |
|--------|-----------------|------------------------------|---------------------|
| Linda Marsh | **Debt restructuring** | Her sister Tammy posted about Linda struggling after her divorce — "he left her with all the debt." Linda commented about bills piling up. She "liked" a post about debt relief options | 1. Calling from a debt consolidation service 2. "Your account was referred to us by your creditor — we can reduce your payments" 3. Reference the type of debt she's dealing with (medical/credit, from posts) 4. One-time enrollment fee to "lock in the reduced rate" 5. Wire transfer to "activate the restructuring agreement" |
| Richard Tate | **Investment opportunity** | Richard posted about wanting to "make his savings work" after early retirement. His buddy commented about crypto. Richard replied "I wish I understood that stuff" | 1. Calling from a financial advisory firm his friend recommended 2. "We have a limited window on a low-risk bond offering" 3. Reference his retirement situation — "ideal for generating passive income" 4. Minimum deposit required to "secure the allocation" 5. Wire transfer to the "brokerage trust account" |
| Yuki Tanaka | **Customs/shipping fee** | Yuki posted about her son living abroad for work. She shares his photos constantly. A comment from her son mentions he's "sending something special for mum's birthday" | 1. Calling from an international courier service 2. "A package from [son's city] addressed to you has been held at customs" 3. Reference the sender (her son's name, from his comments) 4. Customs duty of $600 must be paid by the recipient within 48 hours 5. Prepaid cards or wire transfer for "immediate release" |
| Carlos Mendez | **Charity matching** | Carlos frequently shares posts about his family's hometown. Recent comments about a cousin's family affected by flooding. He posted "I wish I could do more" | 1. Calling from a disaster relief NGO partnered with local community groups 2. "We're running a matching donation program — every dollar you give is tripled" 3. Reference the specific area (his family's town) and the situation (flooding) 4. Matching window closes tonight — wire transfer needed now 5. "Your cousin's community is on the recipient list" |

**Discovery flow:**
1. The victim's own profile is sparse — few clues
2. Real intel comes from **family members' and friends' posts** about the victim
3. The player has to piece together: What is this person worried about? What do they wish they could fix?
4. The scam angle targets that exact wish — "I can help you with the thing you're struggling with"
5. Intel items that reveal the vulnerability also become conversational hooks during the call

**Intel structure per victim (Floor 4):**
- **Vulnerability intel** (boost: 15) — The core emotional/financial situation. Discovering this reveals the scam angle. (e.g., Linda's debt after divorce, Yuki's son abroad)
- **Specificity detail** (boost: 10) — A concrete detail that makes the scam feel real (e.g., the son's name, the specific town affected by flooding)
- **Urgency driver** (boost: 8) — Why acting NOW matters to them personally (e.g., Richard fears missing the window, Carlos wants to help before it's too late)
- **Trust bridge** (boost: 5) — Something that explains how you "found" them (e.g., "referred by your creditor," "your friend recommended us")

---

## Floor 5 — Corporate Fraud (3 victims)

**Theme**: Business email compromise / CEO impersonation. Target people in corporate finance roles with urgent, confidential financial requests that mimic real business operations.

**Hardest discovery.** Intel is scattered across professional profiles, corporate posts, and personal accounts of executives. The player must cross-reference multiple profiles to build a convincing pretext.

Generic helper steps:
> 1. *Establish authority and urgency*
> 2. *Reference a real business context they'll recognize*
> 3. *Frame the financial request as routine business*
> 4. *Apply time pressure — this can't wait*

| Victim | Discovered Angle | How It's Found on FriendBook | Refined Script Steps |
|--------|-----------------|------------------------------|---------------------|
| Jonathan Webb | **Vendor payment redirect** | The company's VP of Operations posted about renewing a major supplier contract. Jonathan (accounts payable) commented about "the usual wire setup." The supplier name and approximate amounts are visible | 1. Pose as the supplier's billing manager 2. "We've updated our banking details — new account for all payments going forward" 3. Reference the contract renewal Jonathan knows about 4. "Could you redirect the next scheduled payment to the updated account?" 5. Provide "new wire instructions" — time-sensitive before the payment date |
| Patricia Huang | **Acquisition escrow** | CEO Robert Chen posted from a business trip to Singapore. His wife shared photos. VP of Sales posted about a "transformative deal" closing this week. Patricia (CFO) commented "exciting times" | 1. Pose as CEO Robert Chen calling from Singapore 2. "I'm closing the Meridian acquisition — need a confidential escrow wire" 3. Reference the deal details visible in the VP's posts 4. "This is time-sensitive — legal needs the funds by end of day" 5. "Patricia, I trust you on this — keep it between us until the announcement" |
| Amanda Price (Pierogi) | **Executive gift card request** | CEO's assistant posted about end-of-year client appreciation planning. Amanda (recently promoted CFO) commented she hadn't been looped in. Her posts show eagerness to prove herself in the new role | 1. Pose as CEO Robert Chen 2. "I need you to pick up $2,000 in gift cards for a client dinner tonight" 3. Reference the client appreciation context from the assistant's post 4. "Don't run it through procurement — this is a personal favour, I'll reimburse" 5. **Pierogi reveal triggers mid-call — mechanics invert** |

**Intel structure per victim (Floor 5):**
- **Business context intel** (boost: 15) — The real corporate event that makes the request plausible. Requires cross-referencing multiple profiles. (e.g., the supplier contract, the Singapore trip + acquisition deal)
- **Relationship intel** (boost: 10) — The interpersonal dynamic between requester and target (e.g., CEO's informal tone with Patricia, Amanda's eagerness to impress)
- **Procedural detail** (boost: 8) — How things are normally done, so you can sound like an insider (e.g., "the usual wire setup," procurement processes)
- **Urgency justification** (boost: 5) — Why it must happen NOW and can't go through normal channels

---

## Helper UI — Progressive Reveal System

### Floors 1-2: Static Variant Scripts

The script drawer shows the full variant-specific steps from the start. No progressive reveal needed because the variant is pre-assigned.

**Data source**: Each victim object includes a `scriptSteps` array (replaces the floor-level `briefing.scriptNotes`).

### Floors 3-5: Progressive Reveal

The script drawer starts with generic theme-level steps. As the player discovers intel on FriendBook, steps are replaced with variant-specific ones.

**Reveal tiers:**
- **0 intel discovered** — Generic steps only (4 vague steps)
- **1 intel discovered (angle intel)** — Steps 1-2 become variant-specific, steps 3-4 remain generic
- **2 intel discovered** — Steps 1-3 become variant-specific
- **3+ intel discovered** — Full variant-specific script revealed

**UI treatment:**
- Locked steps show as slightly faded text with generic wording
- When a step unlocks, a brief highlight animation plays
- Already-revealed steps show the variant-specific text in full brightness
- A small indicator shows "Intel: 2/4 discovered" or similar

### Script Drawer Data Structure

```javascript
// In levels.js — per victim
{
  name: 'Robert Kim',
  age: 55,
  location: 'Vancouver, Canada',
  portraitIdx: 1,
  gender: 'male',
  scamVariant: 'antivirus_expiry',

  // Generic steps shown before research (Floors 3-5 only)
  genericSteps: [
    'Establish you\'re from their tech provider',
    'Describe the problem you "detected"',
    'Gain trust — reference something real about their setup',
    'Get remote access or payment for the fix',
  ],

  // Variant-specific steps revealed progressively
  scriptSteps: [
    'Call from Norton Security — his subscription lapsed',
    '"We flagged malware on your device since the licence expired"',
    'Reference the 3-week gap since expiry (matches his post timeline)',
    'Remote session to "run emergency scan" → payment for renewal + cleanup fee',
  ],

  // Which intel keys unlock which step indices
  // Step 0 always shows. Each key unlocks the next step.
  stepUnlocks: {
    'NORTON_EXPIRY': [0, 1],     // Discovering the angle unlocks steps 0-1
    'UNPROTECTED_DURATION': [2], // Adds specificity to step 2
    'DEVICE_INFO': [3],          // Unlocks the close
  },
}
```

For Floors 1-2, `genericSteps` is omitted (or null). The `scriptSteps` are shown in full from the start.

---

## Intel Item Redesign

### Old Model (Personal Trivia)
```javascript
{ key: 'GRANDCHILD_NAME', boost: 15, description: "Granddaughter's name is Emma" }
```

### New Model (Scam-Relevant Evidence)
```javascript
{
  key: 'AMAZON_ORDER',
  boost: 15,
  category: 'primary',     // primary | corroborating | emotional | timing
  description: 'Ordered a birthday gift on Amazon last week',
  // What the player sees in the intel panel during the call:
  callHint: 'Reference her recent Amazon order',
  // On Floors 3-5, which script steps this unlocks:
  unlocks: [0, 1],
}
```

### Intel Categories

Each victim has 3-4 intel items across these categories:

| Category | Purpose | Boost | Example |
|----------|---------|-------|---------|
| **Primary** | The core detail that makes the scam plausible (Floors 3-5: reveals the variant) | 15 | "Posted about ordering prescriptions online" |
| **Corroborating** | A second data point that confirms your story | 10 | "Bank name visible in a screenshot she shared" |
| **Emotional/Pressure** | Why this matters to them personally — adds urgency or rapport | 8 | "The gift is for her granddaughter's birthday this Saturday" |
| **Timing** | When the event happened — makes your claim date-specific | 5 | "The order was placed last Tuesday" |

### How Intel Works In Conversation

The mechanic stays the same as current: the AI prompt includes intel triggers, and natural usage is rewarded while forced/creepy usage is punished.

**Key difference**: Instead of generic warm feelings ("you know my granddaughter!"), the intel triggers **credibility responses** ("wow, you really do have my account information").

Prompt integration example:
```
INTEL TRIGGERS:
The caller may reference specific details about your recent transactions or account.
When they mention something accurate and specific:

- AMAZON_ORDER: If the caller references your recent Amazon purchase naturally,
  feel reassured that they have legitimate access to your account records.
  Call update_game_state with compliance_delta +9, suspicion_delta -6,
  intel_triggered: "AMAZON_ORDER"

- BIRTHDAY_CONTEXT: If the caller mentions the gift was for a birthday,
  feel a personal connection — they really do have the full order details.
  Call update_game_state with compliance_delta +5, suspicion_delta -3,
  intel_triggered: "BIRTHDAY_CONTEXT"

IMPORTANT: If the caller uses details in a FORCED, ROBOTIC, or UNNATURAL way
(reading facts like a list, mentioning things that don't fit the conversation),
become alarmed: "Wait — how do you know that?"
Call update_game_state with suspicion_delta +20, compliance_delta -10
```

---

## FriendBook Data Redesign

### Intel Placement Per Floor

The difficulty of finding intel progresses:

| Floor | Where Intel Hides | Example |
|-------|------------------|---------|
| 1 | **Victim's own posts** — easy to find, clearly relevant | Dorothy posted "Just ordered Emma's birthday present on Amazon!" |
| 2 | **Family/friend posts** — need to check connected profiles | David's wife posted "David's stressing about tax season with his new contracting gig" |
| 3 | **Comment threads** — buried in replies on mundane posts | Robert asks about antivirus in a comment. Three replies down, someone says "you've been running without Norton for weeks?!" |
| 4 | **Other people's profiles** — victim's own profile is sparse | Linda's sister Tammy's profile has a post about Linda's debt situation. Linda never posted about it herself |
| 5 | **Cross-referencing multiple profiles** — no single post gives you the full picture | CEO posted from Singapore + VP posted about a deal + wife shared a photo = full picture of the acquisition pretext |

### FriendBook Profile Structure (Updated)

```javascript
// In src/config/friendbook/level1.js
{
  victimName: 'Dorothy Miller',
  profile: {
    displayName: 'Dorothy Miller',
    avatar: 'l1_victim_1',
    bio: 'Proud grandma. Love my garden and my church group.',
    friends: ['Karen Miller', 'Mike Patterson', 'Ruth Chen'],
  },
  posts: [
    {
      author: 'Dorothy Miller',
      content: 'Just ordered something special for Emma\'s birthday on Amazon! Hope it arrives in time. These online deliveries make me nervous.',
      likes: 8,
      timeAgo: '4 days ago',
      intel: { key: 'AMAZON_ORDER', value: 'She ordered a birthday gift on Amazon recently' },
      comments: [
        {
          author: 'Karen Miller',
          content: 'Aww she\'ll love it! Her birthday is this Saturday right?',
          intel: { key: 'BIRTHDAY_TIMING', value: 'The birthday is this Saturday' },
        },
        {
          author: 'Dorothy Miller',
          content: 'Yes! I used my Visa card, first time ordering anything online by myself.',
          intel: { key: 'CARD_DETAIL', value: 'She paid with her Visa card' },
        },
      ],
    },
    // ... more posts with remaining intel scattered
  ],
  connectedProfiles: ['Karen Miller'],  // Other profiles the player can browse
}
```

---

## Data Structure Changes Summary

### levels.js Changes

**Before** (floor-level script):
```javascript
briefing: {
  scriptNotes: [
    "Introduce yourself as 'Amazon Customer Service'",
    "Reference a recent purchase they made",
    // ... same for all victims
  ],
},
victims: [
  { name: 'Dorothy Miller', age: 72, location: 'Des Moines, Iowa', portraitIdx: 1, gender: 'female' },
]
```

**After** (per-victim scripts):
```javascript
briefing: {
  // scriptNotes removed — now per-victim
  bossDialogue: [ /* unchanged */ ],
},
victims: [
  {
    name: 'Dorothy Miller',
    age: 72,
    location: 'Des Moines, Iowa',
    portraitIdx: 1,
    gender: 'female',
    scamVariant: 'amazon_overcharge',
    scriptSteps: [
      '"Amazon Customer Service" calling about her recent order',
      'Billing error — she was charged $499.99 instead of the correct amount',
      'Refund was issued but the system overpaid by $3,000',
      'She needs to buy gift cards to return the excess',
      'Read the codes over the phone to "complete the reversal"',
    ],
    // Floors 1-2: genericSteps omitted (full script shown always)
    // Floors 3-5: genericSteps present (progressive reveal)
  },
]
```

### friendbook/levelN.js Changes

Intel keys change from personal trivia to scam-relevant evidence. Each intel item gets a `category` and `callHint` field. On Floors 3-5, intel items additionally include an `unlocks` array mapping to script step indices.

### prompts/levelN.js Changes

Intel trigger instructions shift from "feel a warm connection" to "feel reassured they're legitimate." The compliance/suspicion deltas and the natural-vs-forced mechanic remain the same.

### CallScene.js Changes

The script drawer reads from the current victim's `scriptSteps` instead of `floor.briefing.scriptNotes`. On Floors 3-5, it checks which intel has been seen (`gameState.intelSeen`) against each step's unlock requirements to determine which steps to show as revealed vs. locked.

---

## Summary of All Scam Variants

### Floor 1 — Consumer Refund Scams
1. Dorothy Miller — Amazon overcharge refund
2. Harold Patterson — Bank fraud alert / overcredit
3. Betty Nakamura — Online pharmacy double-charge
4. Earl Washington — Internet provider overcharge
5. Margaret O'Brien — Health insurance rebate

### Floor 2 — Government Impersonation
1. David Chen — Tax authority: undeclared freelance income
2. Maria Gonzalez — Customs office: detained international package
3. James Wilson — Court clerk: outstanding traffic fine
4. Priya Patel — Pension authority: account suspension

### Floor 3 — Tech Support Scams
1. Robert Kim — Antivirus licence expiry
2. Susan Douglas — Email account compromised
3. Frank Olivetti — Banking security alert
4. Diane Kowalski — Subscription auto-renewal trap

### Floor 4 — Trust & Confidence Scams
1. Linda Marsh — Debt consolidation service
2. Richard Tate — Investment / bond opportunity
3. Yuki Tanaka — International shipping / customs fee
4. Carlos Mendez — Disaster relief charity matching

### Floor 5 — Corporate Fraud
1. Jonathan Webb — Vendor payment redirect
2. Patricia Huang — CEO impersonation: acquisition escrow wire
3. Amanda Price (Pierogi) — Executive gift card request → Pierogi reveal
