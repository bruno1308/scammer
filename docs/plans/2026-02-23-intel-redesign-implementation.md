# Intel Redesign: Floors 1-3 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the intel system for floors 1-3 with stronger scam-relevant intel, add Notebook and WebMail apps, implement an untimed research phase, and improve the intel tracker UX.

**Architecture:** Data-first approach — update config/state layer first, then build new scenes, then modify existing scenes. Each phase is independently verifiable. FriendBook data files are rewritten to 3 intel per victim. Two new overlay scenes (NotebookScene, WebMailScene) follow the same pattern as SocialNetworkScene. OfficeScene gets a computer desktop with app icons and a research mode that defers the shift timer until the player picks up the phone.

**Tech Stack:** PhaserJS 3 (ES modules), Vite dev server, no test framework, no TypeScript.

**Design doc:** `docs/plans/2026-02-23-intel-redesign-floors-1-3.md`

---

## Phase 1: Foundation — GameState & Config

### Task 1: Add new state fields to GameState

**Files:**
- Modify: `src/state/GameState.js`

**Step 1: Add research phase, notebook, and email fields**

In the constructor (after line 94, after `this.intelUsed = new Set()`), add:

```js
// Research phase — true until player picks up phone
this.researchPhase = true;

// Per-victim notebook: Map<victimName, string>
this.victimNotes = new Map();

// Per-victim email login: Map<victimName, boolean>
this.emailLoggedIn = new Map();
```

**Step 2: Reset research phase in `startShift()` (around line 118)**

After `this.shiftActive = true;` add:

```js
this.researchPhase = true;
this.emailLoggedIn = new Map();
```

Do NOT reset `victimNotes` here — notes persist across the shift.

**Step 3: Add method to exit research phase**

After `startCall()` method (after line 156), add:

```js
exitResearchPhase() {
  if (!this.researchPhase) return;
  this.researchPhase = false;
  this.shiftStartTime = Date.now();
  this.emit('research_phase_end');
}
```

**Step 4: Add notebook methods**

After the new `exitResearchPhase()`:

```js
setVictimNote(victimName, text) {
  this.victimNotes.set(victimName, text);
}

getVictimNote(victimName) {
  return this.victimNotes.get(victimName) || '';
}
```

**Step 5: Add email login methods**

```js
setEmailLoggedIn(victimName) {
  this.emailLoggedIn.set(victimName, true);
}

isEmailLoggedIn(victimName) {
  return this.emailLoggedIn.get(victimName) === true;
}
```

**Step 6: Add `researchPhase` to event docs** (lines 43-47 JSDoc)

Add `'research_phase_end'` to the emitted events list.

**Verify:** `npm start`, open browser, check no console errors on game load.

**Commit:** `feat(state): add research phase, notebook, and email login state to GameState`

---

### Task 2: Add `availableApps` and email config to levels.js

**Files:**
- Modify: `src/config/levels.js`

**Step 1: Add `availableApps` to each floor config**

Floor 1 (line ~19, inside the floor 1 object):
```js
availableApps: ['friendbook', 'notebook'],
```

Floor 2 (line ~97):
```js
availableApps: ['friendbook', 'notebook', 'webmail'],
```

Floor 3 (line ~169):
```js
availableApps: ['friendbook', 'notebook', 'webmail'],
```

Floor 4 (line ~246):
```js
availableApps: ['friendbook', 'notebook', 'webmail', 'searchr'],
```

Floor 5 (line ~327):
```js
availableApps: ['friendbook', 'notebook', 'webmail', 'searchr'],
```

**Step 2: Add `emailAddress`, `emailPassword`, `emailHint` to Floor 2 victims**

For David Chen victim object, add:
```js
emailAddress: 'david.chen@gmail.com',
emailPassword: 'upbuild2019',
emailHint: 'My consulting company + founding year',
```

For Maria Gonzalez:
```js
emailAddress: 'maria.gonzalez@outlook.com',
emailPassword: 'rosa1946',
emailHint: "Abuela's name + birth year",
```

For James Wilson:
```js
emailAddress: 'james.wilson@gmail.com',
emailPassword: 'diversey',
emailHint: 'Where we had our first date',
```

**Step 3: Add email config to Floor 3 victims**

Karen Thompson:
```js
emailAddress: 'karen.thompson@gmail.com',
emailPassword: 'broncosjune',
emailHint: 'His team + our wedding month',
```

Mike Rodriguez:
```js
emailAddress: 'mike.rodriguez@gmail.com',
emailPassword: '6812',
emailHint: "My Mustang's year + my jersey",
```

Tom Anderson:
```js
emailAddress: 'tom.anderson@outlook.com',
emailPassword: 'maple2011',
emailHint: "Our street + Zoe's birth year",
```

**Verify:** `npm start`, check no import errors.

**Commit:** `feat(config): add availableApps and email config to floor/victim data`

---

### Task 3: Add `trackerCategory` field to intelKeys in levels.js

The `trackerCategory` is the human-readable category label shown in the intel tracker (e.g., "Order details"). This goes in the FriendBook config, but the tracker needs access to it. Since the tracker reads from `gameState.intelKeys` (set by `initIntel`), the category label is stored in the `intelKeys` array from the FriendBook data. No changes to levels.js for this — it's covered in the FriendBook data rewrite tasks.

**This task is a no-op** — skip to Task 4. The `trackerCategory` field will be added in the FriendBook data tasks (Tasks 5-7).

---

### Task 4: Create WebMail config data

**Files:**
- Create: `src/config/webmail/level2.js`
- Create: `src/config/webmail/level3.js`
- Create: `src/config/webmail/index.js`

**Step 1: Create `src/config/webmail/index.js`**

```js
import { getLevel2WebMail } from './level2.js';
import { getLevel3WebMail } from './level3.js';

const levelGetters = {
  2: getLevel2WebMail,
  3: getLevel3WebMail,
};

/**
 * Get WebMail inbox data for a victim at a given level.
 * @param {number} level
 * @param {string} victimName
 * @returns {object|null} { emails: Array<{id, from, subject, date, body, isRead, folder, intel?}> }
 */
export function getWebMailData(level, victimName) {
  const getter = levelGetters[level];
  if (!getter) return null;
  return getter(victimName);
}
```

**Step 2: Create `src/config/webmail/level2.js`**

Each victim's inbox contains 5-8 emails. Only 1 email per victim contains intel (the one that maps to the intel key sourced from Email in the design doc). Other emails are filler that add realism.

```js
/**
 * WebMail inbox data for Level 2: Government Impersonation
 *
 * David Chen — TAX_FILING intel in H&R Block email
 * Maria Gonzalez — PACKAGE_DETAILS intel in DHL email
 * James Wilson — CASE_DETAILS intel in court notification email
 */

const WEBMAIL_DATA = {
  'David Chen': {
    emails: [
      {
        id: 'dc_1', from: 'Steve Miller <steve@hrblock-sacramento.com>',
        subject: 'Your 2025 Joint Filing — Appointment Confirmation',
        date: 'Feb 12, 2026',
        body: `Hi David,\n\nThis is to confirm your joint filing appointment for Tuesday, February 18th at 2:00 PM.\n\nBased on our preliminary review, I want to flag something we should discuss: the 1099-NEC income from UpBuild Consulting shows a discrepancy against your W-2 reported wages. This is common with contractor income but we'll need to reconcile it before filing.\n\nPlease bring:\n- W-2 from TechVista Solutions\n- 1099-NEC from UpBuild Consulting\n- Receipts for home office deductions\n\nSee you Tuesday.\n\nSteve Miller\nH&R Block — Arden Way, Sacramento`,
        isRead: true, folder: 'inbox',
        intel: { key: 'TAX_FILING', value: 'Joint filing with H&R Block shows 1099 contractor income discrepancy from UpBuild Consulting' }
      },
      {
        id: 'dc_2', from: 'Mei Chen <mei.chen@gmail.com>',
        subject: 'Re: Kitchen countertop samples',
        date: 'Feb 10, 2026',
        body: 'The quartz ones are $85/sqft but I think it\'s worth it. We\'re already at $22K so what\'s another couple hundred 😅\n\nCan you pick up Brandon from practice at 5?',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'dc_3', from: 'Amazon <auto-confirm@amazon.com>',
        subject: 'Your order has shipped — arriving Feb 14',
        date: 'Feb 8, 2026',
        body: 'Your order of "Ember Temperature Control Smart Mug 2" has shipped.\n\nDelivery estimate: February 14, 2026\nShip to: David Chen, 1847 Folsom Blvd, Sacramento, CA 95819',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'dc_4', from: 'TechVista HR <hr@techvista.com>',
        subject: 'W-2 Available for Tax Year 2025',
        date: 'Jan 28, 2026',
        body: 'Your W-2 for tax year 2025 is now available in the employee portal. Please log in to download.',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'dc_5', from: 'UpBuild Consulting <noreply@upbuildconsulting.com>',
        subject: 'Invoice #2025-047 Payment Received',
        date: 'Jan 15, 2026',
        body: 'Payment of $4,200.00 received for Invoice #2025-047 (Web redesign — Phase 2).\n\nYear-to-date 1099 income: $38,400.00\n\nThank you for your business.',
        isRead: true, folder: 'inbox', intel: null
      },
    ],
  },

  'Maria Gonzalez': {
    emails: [
      {
        id: 'mg_1', from: 'DHL Express <tracking@dhl.com>',
        subject: 'Shipment Confirmation — Tracking #4821-7793-0156',
        date: 'Feb 15, 2026',
        body: `Dear Maria Gonzalez,\n\nYour shipment has been picked up and is on its way.\n\nTracking Number: 4821-7793-0156\nService: DHL Express Worldwide\nOrigin: Chicago, IL, USA\nDestination: Guadalajara, Jalisco, Mexico\nDeclared Value: $340.00 USD\nWeight: 8.2 kg\nEstimated Delivery: Feb 21-25, 2026\n\nContents declared: Clothing, handmade textiles, family photographs, kitchen items\n\nTrack your shipment at dhl.com/tracking`,
        isRead: false, folder: 'inbox',
        intel: { key: 'PACKAGE_DETAILS', value: 'DHL shipment #4821-7793-0156 to Guadalajara, declared value $340, contains family items' }
      },
      {
        id: 'mg_2', from: 'Carlos Gonzalez <carlos.g@outlook.com>',
        subject: 'Re: Abuela Rosa list',
        date: 'Feb 14, 2026',
        body: 'I packed everything on the list plus the photo album Sofia put together. DHL says 5-7 business days so it should arrive before the 25th. 🤞\n\nDid you add the rebozo? Mom said it was in the hall closet.',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'mg_3', from: 'Sofia Gonzalez <sofia.gonzalez@university.edu>',
        subject: 'Photo album for abuela!!',
        date: 'Feb 13, 2026',
        body: 'Mama I finished the photo album! 40 pages of family photos going back to the 80s. Abuela Rosa is going to CRY. I can\'t believe she\'s turning 80 🥺\n\nI dropped it off at the house, Carlos said he\'d pack it with the other stuff.',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'mg_4', from: 'Comcast <no-reply@comcast.com>',
        subject: 'Your February statement is ready',
        date: 'Feb 5, 2026',
        body: 'Your Comcast Xfinity statement for February 2026 is ready. Amount due: $89.99. Due date: Feb 28, 2026.',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'mg_5', from: 'Target <receipts@target.com>',
        subject: 'Your Target receipt',
        date: 'Feb 3, 2026',
        body: 'Thank you for shopping at Target!\n\nWrapping paper (3) — $14.97\nGift bags (2) — $9.98\nTissue paper — $3.49\nTotal: $28.44',
        isRead: true, folder: 'inbox', intel: null
      },
    ],
  },

  'James Wilson': {
    emails: [
      {
        id: 'jw_1', from: 'Cook County Circuit Court <no-reply@cookcountyclerk.com>',
        subject: 'Traffic Citation Notice — Case #2026-TR-041892',
        date: 'Feb 17, 2026',
        body: `COOK COUNTY CIRCUIT COURT\nTRAFFIC DIVISION\n\nCase Number: 2026-TR-041892\nDefendant: James R. Wilson\nFiling District: 14th District — Chicago\n\nCitation Details:\n- Date of Incident: February 8, 2026\n- Location: Kennedy Expressway, near Diversey Ave exit\n- Violation: Failure to reduce speed / Following too closely\n- Fine Amount: $375.00\n- Payment Deadline: March 19, 2026\n\nFailure to pay or appear by the deadline may result in additional penalties including license suspension.\n\nPay online at cookcountyclerk.com/pay or call (312) 555-0199.`,
        isRead: false, folder: 'inbox',
        intel: { key: 'CASE_DETAILS', value: 'Cook County case #2026-TR-041892, 14th District, $375 fine, deadline March 19' }
      },
      {
        id: 'jw_2', from: 'Angela Wilson <angela.wilson@gmail.com>',
        subject: 'Insurance claim update',
        date: 'Feb 16, 2026',
        body: 'State Farm says the claim is processing. The other driver\'s insurance already accepted liability so we should be covered. They need the police report number — it\'s on the citation paper.\n\nAlso congrats again on the promotion, babe! ❤️ Operations Manager!',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'jw_3', from: 'Lakefront Manufacturing HR <hr@lakefrontmfg.com>',
        subject: 'Promotion Effective Date & Updated Benefits',
        date: 'Feb 10, 2026',
        body: 'Congratulations James!\n\nYour promotion to Operations Manager is effective February 17, 2026. Your updated salary and benefits package is attached.\n\nPlease complete the updated background check authorization form by Feb 28.',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'jw_4', from: 'State Farm <claims@statefarm.com>',
        subject: 'Auto Claim Filed — Claim #SF-2026-8847',
        date: 'Feb 9, 2026',
        body: 'Your auto claim has been filed.\n\nClaim #: SF-2026-8847\nVehicle: 2021 Toyota Camry\nIncident Date: February 8, 2026\nStatus: Under Review',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'jw_5', from: 'Netflix <info@netflix.com>',
        subject: 'New login from Chrome on Windows',
        date: 'Feb 7, 2026',
        body: 'A new device signed into your Netflix account.\n\nDevice: Chrome on Windows\nLocation: Chicago, IL\nTime: February 7, 2026 at 8:32 PM\n\nIf this was you, you can ignore this email.',
        isRead: true, folder: 'inbox', intel: null
      },
    ],
  },
};

export function getLevel2WebMail(victimName) {
  return WEBMAIL_DATA[victimName] || null;
}
```

**Step 3: Create `src/config/webmail/level3.js`**

```js
/**
 * WebMail inbox data for Level 3: Tech Support Scam
 *
 * Karen Thompson — NORTON_EXPIRY intel in Norton notification
 * Mike Rodriguez — SECURITY_ALERT + SENT_SPAM intel in Gmail alerts
 * Tom Anderson — SUBSCRIPTION_CHARGE intel in CloudShield billing
 */

const WEBMAIL_DATA = {
  'Karen Thompson': {
    emails: [
      {
        id: 'kt_1', from: 'Norton LifeLock <no-reply@norton.com>',
        subject: 'ACTION REQUIRED: Your Norton subscription has expired',
        date: 'Feb 18, 2026',
        body: `Dear Karen Thompson,\n\nYour Norton 360 subscription expired on January 28, 2026.\n\nSince your subscription expired, your device has been unprotected. Our last scan on January 28 detected:\n\n⚠️ 47 potential threats found\n⚠️ 12 tracking cookies\n⚠️ 3 suspicious processes\n\nYour device is currently UNPROTECTED. Renew now to remove threats and restore real-time protection.\n\nRenewal price: $89.99/year\n\nRenew at norton.com/renew\n\nIf you believe this is an error, contact support at 1-800-XXX-XXXX.\n\nNorton LifeLock — Protecting what matters.`,
        isRead: false, folder: 'inbox',
        intel: { key: 'NORTON_EXPIRY', value: 'Norton expired Jan 28, last scan found 47 threats, device unprotected' }
      },
      {
        id: 'kt_2', from: 'Chase <alerts@chase.com>',
        subject: 'Your card ending in 7241 has been cancelled',
        date: 'Jan 25, 2026',
        body: 'Per your request, the Chase Visa card ending in 7241 has been cancelled. Any recurring payments linked to this card will need to be updated with a new payment method.',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'kt_3', from: 'Brian Thompson <brian.t@techcorp.com>',
        subject: 'Re: Computer acting weird',
        date: 'Feb 15, 2026',
        body: 'DON\'T click on any pop-ups! Seriously Karen, those "you have a virus" pop-ups ARE the virus. Do NOT call any phone numbers on them.\n\nI\'ll look at it this weekend. Just don\'t download anything until then.',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'kt_4', from: 'Denver Dental Associates <office@denverdental.com>',
        subject: 'Schedule reminder — Patient files needed',
        date: 'Feb 14, 2026',
        body: 'Hi Karen,\n\nReminder that the patient scheduling system update is next Monday. Please make sure your local copies of the billing spreadsheets and scheduling files are backed up.\n\nThanks,\nDr. Patel\'s Office',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'kt_5', from: 'Amazon <auto-confirm@amazon.com>',
        subject: 'Your order has been delivered',
        date: 'Feb 10, 2026',
        body: 'Your order of "Lily\'s Gymnastics Leotard — Size 7" has been delivered to your front door.',
        isRead: true, folder: 'inbox', intel: null
      },
    ],
  },

  'Mike Rodriguez': {
    emails: [
      {
        id: 'mr_1', from: 'Google <no-reply@accounts.google.com>',
        subject: '⚠️ Critical security alert for mike.rodriguez@gmail.com',
        date: 'Feb 16, 2026',
        body: `Someone just signed in to your Google Account from a new device.\n\nNew sign-in:\nDevice: Chrome on Windows\nLocation: Lagos, Nigeria\nTime: Saturday, February 15, 2026 at 10:47 AM CST\nIP Address: 197.210.XX.XX\n\nIf this wasn't you, your account may be compromised. Review your account activity immediately.\n\nReview activity at myaccount.google.com/security`,
        isRead: false, folder: 'inbox',
        intel: { key: 'SECURITY_ALERT', value: 'Unauthorized sign-in from Lagos, Nigeria at 10:47 AM Saturday' }
      },
      {
        id: 'mr_2', from: 'Google <no-reply@accounts.google.com>',
        subject: 'Suspicious activity: 47 messages sent from your account',
        date: 'Feb 16, 2026',
        body: `We detected unusual activity on your account.\n\n47 messages were sent from mike.rodriguez@gmail.com between 10:47 AM and 10:52 AM on Saturday, February 15.\n\nSample recipients:\n- carmen.rodriguez@outlook.com\n- tony.rodriguez@yahoo.com\n- ray.martinez@autopartsdirect.com\n- phoenix_suns_fan_group@groups.google.com\n\nSubject line used: "URGENT: Verify your account immediately"\n\nIf you did not send these messages, secure your account now.`,
        isRead: false, folder: 'inbox',
        intel: { key: 'SENT_SPAM', value: '47 spam emails sent to contacts including ray.martinez@autopartsdirect.com' }
      },
      {
        id: 'mr_3', from: 'Ray Martinez <ray.martinez@autopartsdirect.com>',
        subject: 'Re: URGENT: Verify your account immediately',
        date: 'Feb 16, 2026',
        body: 'Mike, did you send this?? It looks like a phishing email. I almost clicked the link. You might want to check your email — could be hacked.\n\n- Ray',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'mr_4', from: 'AutoZone <rewards@autozone.com>',
        subject: 'Your AutoZone Rewards — $15 credit available',
        date: 'Feb 12, 2026',
        body: 'You have $15.00 in AutoZone Rewards! Use in-store or online by March 31, 2026.',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'mr_5', from: 'Carmen Rodriguez <carmen.rodriguez@outlook.com>',
        subject: 'Re: Dinner Saturday?',
        date: 'Feb 14, 2026',
        body: 'Sounds good! I\'ll make the carne asada. Tell Tony to bring the cooler this time 😂',
        isRead: true, folder: 'inbox', intel: null
      },
    ],
  },

  'Tom Anderson': {
    emails: [
      {
        id: 'ta_1', from: 'CloudShield Pro <billing@cloudshieldpro.com>',
        subject: 'Payment Confirmation — CloudShield Pro Annual Subscription',
        date: 'Feb 13, 2026',
        body: `Thank you for your subscription!\n\nCloudShield Pro — Premium Security Suite\nPlan: Annual Subscription\nAmount: $399.00 USD\nPayment Method: Visa ending in 4821\nBilling Date: February 12, 2026\nNext Renewal: February 12, 2027\n\nYour free trial has been converted to a paid subscription.\n\nTo manage your subscription or request cancellation, call our support line:\n1-888-555-0147 (Mon-Fri, 9 AM - 5 PM EST)\n\nOr visit: cloudshieldpro.com/account\n\nThank you for choosing CloudShield Pro.`,
        isRead: false, folder: 'inbox',
        intel: { key: 'SUBSCRIPTION_CHARGE', value: 'CloudShield Pro auto-renewed at $399/year, charged to Visa ending 4821' }
      },
      {
        id: 'ta_2', from: 'Rachel Anderson <rachel.a.marketing@gmail.com>',
        subject: 'Re: What is CloudShield Pro??',
        date: 'Feb 13, 2026',
        body: 'I looked it up and it seems like one of those "free trial" traps. You probably clicked something by accident. Call the number on the email and cancel it — they have to give a refund if it\'s within 30 days.\n\nDon\'t just ignore it or we\'re out $400 we don\'t have.',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'ta_3', from: 'MCAD Financial Aid <finaid@mcad.edu>',
        subject: 'Spring 2026 Tuition Statement',
        date: 'Feb 1, 2026',
        body: 'Tuition statement for Zoe Anderson — Spring 2026 semester.\n\nTuition: $3,850.00\nScholarship: -$1,200.00\nBalance Due: $2,650.00\nDue Date: March 1, 2026',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'ta_4', from: 'Xcel Energy <billing@xcelenergy.com>',
        subject: 'Your January bill — higher than usual',
        date: 'Feb 3, 2026',
        body: 'Your January bill is $287.43 — 40% higher than last January. This may be due to the new furnace running at higher settings during the cold snap. Contact us to discuss budget billing.',
        isRead: true, folder: 'inbox', intel: null
      },
      {
        id: 'ta_5', from: 'Walt Anderson <walt.anderson@aol.com>',
        subject: 'Re: Computer running slow',
        date: 'Feb 11, 2026',
        body: 'Tommy, I had the same thing happen on my old Dell. Those free trials are sneaky — they bury the charge in the fine print. Just call and cancel, they can\'t force you to pay.\n\nLove, Dad',
        isRead: true, folder: 'inbox', intel: null
      },
    ],
  },
};

export function getLevel3WebMail(victimName) {
  return WEBMAIL_DATA[victimName] || null;
}
```

**Verify:** Import the barrel in browser console or check no syntax errors via `npm start`.

**Commit:** `feat(config): add WebMail inbox data for floors 2 and 3`

---

## Phase 2: FriendBook Data Rewrites

### Task 5: Rewrite Level 1 FriendBook intel (4→3 per victim)

**Files:**
- Modify: `src/config/friendbook/level1.js`

**Step 1: Update Dorothy Miller's `intelKeys` (lines 177-182)**

Replace the 4-item array with:
```js
intelKeys: [
  { key: 'AMAZON_ORDER', boost: 15, description: 'Ordered a LEGO Unicorn Castle ($49.99) on Amazon', category: 'primary', trackerCategory: 'Order details', callHint: 'Reference her specific Amazon order for the LEGO set to establish you have her account on file' },
  { key: 'VISA_CARD', boost: 12, description: 'Paid with Visa debit card', category: 'legitimacy', trackerCategory: 'Payment method', callHint: "Say 'the Visa debit card on file' to sound like you see her payment method" },
  { key: 'SHIPPING_ADDRESS', boost: 10, description: 'Ships to 847 Elm Street, Des Moines', category: 'legitimacy', trackerCategory: 'Shipping address', callHint: 'Confirm her shipping address to prove you are in the system' },
],
```

**Step 2: Update posts to include SHIPPING_ADDRESS intel**

Find Karen Mitchell's posts. Add or update a post where Karen mentions sending something to "Mom at 847 Elm Street":
```js
{
  text: "Dropping off Emma's costume at Mom's place on Elm Street. That house at 847 is always so cozy 🏠",
  time: '2 days ago', likes: 8,
  comments: [],
  intel: { key: 'SHIPPING_ADDRESS', value: "Dorothy's address is 847 Elm Street, Des Moines" }
}
```

Remove the old `DELIVERY_STATUS` intel from Emma's post (set `intel: null`).
Remove the old `ORDER_DETAILS` intel from Karen's post (set `intel: null` or update to keep the post but remove the intel tag).

**Step 3: Update Harold Patterson's `intelKeys` (lines 360-365)**

Replace with:
```js
intelKeys: [
  { key: 'BANK_NAME', boost: 15, description: 'Banks at Arizona Federal Credit Union', category: 'primary', trackerCategory: 'Bank name', callHint: "Say 'Arizona Federal Credit Union fraud department' to establish authority" },
  { key: 'RECENT_PURCHASE', boost: 12, description: 'Bought HP laptop ($489) at Best Buy', category: 'primary', trackerCategory: 'Recent purchase', callHint: 'Reference the $489 Best Buy charge as the suspicious transaction' },
  { key: 'ACCOUNT_TYPE', boost: 10, description: 'Has had Arizona Federal debit card for 15 years', category: 'legitimacy', trackerCategory: 'Account details', callHint: 'Mention his longtime debit account to sound like you have his full file' },
],
```

Remove `TRANSACTION_TIMING` intel from Lisa's post (set `intel: null`).

**Step 4: Update Margaret O'Brien's `intelKeys` (lines 982-987)**

Replace with:
```js
intelKeys: [
  { key: 'INSURANCE_PROVIDER', boost: 15, description: 'Insured with MassHealth Plus', category: 'primary', trackerCategory: 'Insurance provider', callHint: "Say 'MassHealth Plus billing department' to establish authority" },
  { key: 'MEDICAL_DETAILS', boost: 12, description: 'Recent bloodwork — lipid panel + thyroid', category: 'primary', trackerCategory: 'Recent medical visit', callHint: 'Reference the lipid panel bloodwork to prove you have her medical records' },
  { key: 'PAYMENT_METHOD', boost: 10, description: 'Premiums auto-debit from checking account', category: 'legitimacy', trackerCategory: 'Payment method', callHint: 'Mention the auto-debit from checking to sound like you see her billing profile' },
],
```

Update the `MEDICAL_DETAILS` intel source: Colleen's post currently has `RECENT_CLAIM` — change the intel key reference:
```js
intel: { key: 'MEDICAL_DETAILS', value: "Margaret's bloodwork included lipid panel and thyroid panel" }
```

Remove `COVERAGE_DETAILS` intel from Fiona's post (set `intel: null`).

**Step 5: Update Betty Nakamura and Earl Washington** (non-active victims)

These victims exist in FriendBook data but aren't in FLOORS[1].victims. Apply the same 3-intel pattern for consistency, removing their 4th `timing` intel. Reduce to 3 intelKeys each with adjusted boosts (15, 12, 10) and add `trackerCategory` field.

**Verify:** `npm start`, open game, navigate to Floor 1, open FriendBook. Confirm 3 intel items appear in the intel tracker (during a call).

**Commit:** `feat(friendbook): rewrite level 1 intel — 3 scam-relevant pieces per victim`

---

### Task 6: Rewrite Level 2 FriendBook intel (4→3 per victim) + email breadcrumbs

**Files:**
- Modify: `src/config/friendbook/level2.js`

**Step 1: Update David Chen's `intelKeys` (lines 234-239)**

Replace with:
```js
intelKeys: [
  { key: 'FREELANCE_INCOME', boost: 15, description: "Wife posted about David's UpBuild Consulting 1099 income", category: 'primary', trackerCategory: 'Income source', callHint: "Reference his 1099 contractor income through UpBuild Consulting that wasn't reported" },
  { key: 'TAX_FILING', boost: 12, description: 'H&R Block email shows 1099 discrepancy in joint filing', category: 'legitimacy', trackerCategory: 'Tax filing details', callHint: "Reference the joint filing and contractor income discrepancy" },
  { key: 'RENOVATION_EXPENSE', boost: 10, description: '$22K kitchen renovation flagged against reported income', category: 'pressure', trackerCategory: 'Flagged expenditure', callHint: "Mention the renovation raises audit flags against reported income" },
],
```

Remove `FILING_DETAIL` intel. Remove `TAX_STRESS` intel from David's own post (set `intel: null`).

**Step 2: Add email password breadcrumb to Mei's posts**

Add a post or comment where Mei teases David about his password:
```js
{
  text: "David I swear if your email password is still 'upbuild2019' I'm changing it myself 🙄 You use the same password for EVERYTHING",
  time: '4 days ago', likes: 3,
  comments: [
    { author: 'david_chen', text: "It's a good password! It has numbers AND letters 😤", time: '4 days ago', likes: 1 }
  ],
  intel: null
}
```

**Step 3: Update Maria Gonzalez's `intelKeys` (lines 464-469)**

Replace with:
```js
intelKeys: [
  { key: 'PACKAGE_DETAILS', boost: 15, description: 'DHL shipment to Guadalajara, declared $340, tracking available', category: 'primary', trackerCategory: 'Shipment details', callHint: "Reference the DHL international shipment that was flagged at customs" },
  { key: 'DESTINATION_ADDRESS', boost: 12, description: 'Destination: Calle Reforma 247, Colonia Centro, Guadalajara', category: 'legitimacy', trackerCategory: 'Destination address', callHint: "Cite the destination address to prove you have the customs filing" },
  { key: 'EMOTIONAL_STAKES', boost: 10, description: "Package is for abuela Rosa's 80th birthday — irreplaceable items", category: 'pressure', trackerCategory: 'Package contents', callHint: "Mention the package will be destroyed — she'll panic about abuela's gift" },
],
```

Remove `SHIPPING_TIMING` intel. Move the `INTERNATIONAL_PACKAGE` key to `PACKAGE_DETAILS`.

**Step 4: Add email password breadcrumb for Maria**

Add to Carlos's posts:
```js
{
  text: "Maria your DHL login still uses abuela's name right? 'rosa1946'? I need to check the tracking 📦",
  time: '3 days ago', likes: 2,
  comments: [
    { author: 'maria_gonzalez', text: "Carlos!! Don't post my passwords on here! 😡 Yes that one, I'll text it to you", time: '3 days ago', likes: 5 }
  ],
  intel: null
}
```

**Step 5: Update James Wilson's `intelKeys` (lines 687-692)**

Replace with:
```js
intelKeys: [
  { key: 'TRAFFIC_INCIDENT', boost: 15, description: "Rear-end collision on the Kennedy Expressway", category: 'primary', trackerCategory: 'Legal incident', callHint: "Reference the Kennedy Expressway incident — say it triggered an outstanding fine" },
  { key: 'CASE_DETAILS', boost: 12, description: 'Court email: Case #2026-TR-041892, 14th District, $375 fine', category: 'legitimacy', trackerCategory: 'Case details', callHint: "Cite the case number and 14th District filing to sound official" },
  { key: 'CAREER_STAKES', boost: 10, description: 'Just promoted to Operations Manager — bench warrant would show on background check', category: 'pressure', trackerCategory: 'Employment risk', callHint: "Warn a bench warrant would appear on employer background checks" },
],
```

Remove `FRIEND_MENTION` intel. Rename `WORK_IMPACT` to `CAREER_STAKES`. Update Tamara's post intel key accordingly.

**Step 6: Add email password breadcrumb for James**

Add to Angela's posts:
```js
{
  text: "Happy anniversary to the love of my life! 12 years since that first date on Diversey Ave ❤️ Still the best night of my life @jameswilson",
  time: '1 week ago', likes: 24,
  comments: [
    { author: 'tamara_wilson', text: "You two are the cutest! I remember you wouldn't stop talking about that date for WEEKS 😂", time: '1 week ago', likes: 8 }
  ],
  intel: null
}
```

**Step 7: Update Priya Patel** (non-active victim)

Same pattern — reduce to 3 intelKeys with adjusted boosts and `trackerCategory`.

**Verify:** `npm start`, Floor 2, FriendBook. Check password breadcrumb posts render. Check intel tracker shows 3 items during call.

**Commit:** `feat(friendbook): rewrite level 2 intel — 3 pieces per victim with email breadcrumbs`

---

### Task 7: Rewrite Level 3 FriendBook intel (4→3 per victim) + email breadcrumbs

**Files:**
- Modify: `src/config/friendbook/level3.js`

**Step 1: Update Karen Thompson's `intelKeys` (lines 271-276)**

Replace with:
```js
intelKeys: [
  { key: 'NORTON_EXPIRY', boost: 15, description: 'Norton expired Jan 28, last scan found 47 threats', category: 'angle', trackerCategory: 'Security status', callHint: 'Reference the Norton expiry and 47 detected threats to sound like a real security team', unlocks: [0, 1] },
  { key: 'MALWARE_SYMPTOMS', boost: 12, description: 'Random tabs opening, pop-ups, browser acting weird', category: 'corroborating', trackerCategory: 'Symptoms', callHint: 'Describe the symptoms she is experiencing to build trust', unlocks: [2] },
  { key: 'WORK_FILES', boost: 10, description: 'Patient scheduling and billing files on computer — terrified to lose them', category: 'emotional', trackerCategory: 'Files at risk', callHint: 'Mention her work files are at risk to create urgency', unlocks: [3] },
],
```

Remove `EXPIRY_DATE` intel. Rename `WORK_FILES_FEAR` to `WORK_FILES`.

**Step 2: Move `NORTON_EXPIRY` intel source from FriendBook comment to email**

The primary intel for Karen now comes from Email (Norton notification), not FriendBook. However, the `markIntelSeen` system is currently FriendBook-only. We need to make WebMailScene also call `markIntelSeen` when a player reads an email with intel (covered in the WebMailScene task). For now, keep a FriendBook post/comment that also references Norton expiry so there's a fallback path, but make it less explicit than the email.

Update Brian's comment on Karen's meal-prep post to be vaguer:
```js
{ author: 'brian_thompson', text: "Karen please don't ignore the computer thing. Your antivirus is definitely expired. I'll fix it this weekend", time: '3 days ago', likes: 2 }
```
Remove the `intel` tag from this comment's parent post — the intel now primarily comes from the WebMail Norton email.

**Step 3: Add email password breadcrumbs for Karen**

Brian's bio should include "Go Broncos!" and Karen's About should include "Married: June 2018". These may already exist — verify and add if missing.

**Step 4: Update Mike Rodriguez's `intelKeys` (lines 531-536)**

Replace with:
```js
intelKeys: [
  { key: 'SECURITY_ALERT', boost: 15, description: 'Gmail login from Lagos, Nigeria at 10:47 AM Saturday', category: 'angle', trackerCategory: 'Security breach', callHint: 'Reference the unauthorized sign-in from Nigeria to establish the threat', unlocks: [0, 1] },
  { key: 'SENT_SPAM', boost: 12, description: '47 spam emails sent to contacts including business contacts', category: 'corroborating', trackerCategory: 'Unauthorized activity', callHint: 'Mention the 47 outgoing spam emails to prove account compromise', unlocks: [2] },
  { key: 'PROFESSIONAL_DAMAGE', boost: 10, description: 'Parts supplier Ray got the spam — professional reputation at stake', category: 'emotional', trackerCategory: 'Contacts affected', callHint: "Warn his business contacts received the spam to create urgency", unlocks: [3] },
],
```

Remove `EMAIL_PROVIDER` and `INCIDENT_DATE` intel. Rename `WEIRD_EMAILS` to `SECURITY_ALERT`, `CONTACTS_AFFECTED` to `PROFESSIONAL_DAMAGE`.

**Step 5: Add email password breadcrumbs for Mike**

Add Mike's Mustang year ('68) to a post and Tony's game photo showing Mike in #12 jersey. These may already exist — verify and add if missing.

**Step 6: Update Tom Anderson's `intelKeys` (lines 1080-1085)**

Replace with:
```js
intelKeys: [
  { key: 'SUBSCRIPTION_CHARGE', boost: 15, description: 'CloudShield Pro auto-renewed at $399/year on Visa ending 4821', category: 'angle', trackerCategory: 'Subscription details', callHint: 'Reference the specific charge amount and card number', unlocks: [0, 1] },
  { key: 'SERVICE_NAME', boost: 12, description: 'CloudShield Pro — Premium Security Suite, free trial trap', category: 'corroborating', trackerCategory: 'Service name', callHint: 'Use the full service name to sound like official support', unlocks: [2] },
  { key: 'FINANCIAL_PRESSURE', boost: 10, description: 'MCAD tuition + new furnace + $399 charge — finances stretched thin', category: 'emotional', trackerCategory: 'Financial situation', callHint: 'Show empathy about the financial pressure to build rapport', unlocks: [3] },
],
```

Remove `NOTIFICATION_DATE` intel. Rename `SUBSCRIPTION_POPUP` to `SUBSCRIPTION_CHARGE`, `BUDGET_STRESS` to `FINANCIAL_PRESSURE`.

**Step 7: Add email password breadcrumbs for Tom**

Rachel's post should mention "15 years on Maple Drive" and Zoe's profile should show age 15 (→ born ~2011). Verify and add if missing.

**Step 8: Update Susan Lee** (non-active victim)

Same 3-intel pattern. Reduce from 4 to 3, add `trackerCategory` and `unlocks`.

**Verify:** `npm start`, Floor 3, FriendBook. Check intel tracker shows 3 items. Check progressive reveal works with new `unlocks` arrays.

**Commit:** `feat(friendbook): rewrite level 3 intel — 3 pieces per victim with email as primary source`

---

## Phase 3: New Scenes

### Task 8: Create NotebookScene

**Files:**
- Create: `src/scenes/NotebookScene.js`

This is a simple overlay scene (same pattern as SocialNetworkScene) with a text area for per-victim notes. Uses Phaser's DOM element for text input since Phaser's built-in text doesn't support editable text fields.

```js
/**
 * NotebookScene.js - Player Notebook Overlay
 *
 * Simple note-taking app accessible from the office computer.
 * Players jot down intel and observations per victim.
 * Notes persist across the shift via GameState.victimNotes.
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';

export default class NotebookScene extends Phaser.Scene {
  constructor() {
    super({ key: 'notebook' });
  }

  init(data) {
    this.victimName = data?.victimName || 'Notes';
    this.levelNum = data?.level || 1;
  }

  create() {
    const { width, height } = this.scale;

    // Semi-transparent backdrop
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
      .setInteractive().setDepth(99);

    // Notebook dimensions
    const nbW = 500;
    const nbH = 520;
    const nbX = (width - nbW) / 2;
    const nbY = (height - nbH) / 2;

    // Notebook background (yellow legal pad style)
    const g = this.add.graphics().setDepth(100);
    g.fillStyle(0xfffde7);
    g.fillRoundedRect(nbX, nbY, nbW, nbH, 8);
    g.lineStyle(2, 0xccbb66);
    g.strokeRoundedRect(nbX, nbY, nbW, nbH, 8);

    // Red margin line
    g.lineStyle(1, 0xdd8888);
    g.lineBetween(nbX + 60, nbY + 50, nbX + 60, nbY + nbH - 10);

    // Ruled lines
    g.lineStyle(0.5, 0xccccbb);
    for (let y = nbY + 74; y < nbY + nbH - 20; y += 24) {
      g.lineBetween(nbX + 10, y, nbX + nbW - 10, y);
    }

    // Header
    this.add.text(nbX + nbW / 2, nbY + 16, `📓 ${this.victimName}`, {
      fontFamily: '"Courier New", monospace', fontSize: '16px',
      fontStyle: 'bold', color: '#4a4a3a'
    }).setOrigin(0.5, 0).setDepth(101);

    // Close button (red circle, top-right)
    const closeBtn = this.add.circle(nbX + nbW - 16, nbY + 16, 8, 0xff5555)
      .setInteractive({ useHandCursor: true }).setDepth(102);
    closeBtn.on('pointerdown', () => this._close());

    // DOM textarea for editable text input
    const textareaHTML = `<textarea id="notebook-textarea" style="
      width: ${nbW - 80}px;
      height: ${nbH - 80}px;
      background: transparent;
      border: none;
      outline: none;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      color: #3a3a2a;
      line-height: 24px;
      padding: 0;
      resize: none;
      overflow-y: auto;
    " placeholder="Type your notes here...">${this._escapeHtml(gameState.getVictimNote(this.victimName))}</textarea>`;

    this.textareaDom = this.add.dom(nbX + 70, nbY + 54).createFromHTML(textareaHTML).setDepth(101);

    // Save on every keystroke
    const textarea = document.getElementById('notebook-textarea');
    if (textarea) {
      textarea.addEventListener('input', () => {
        gameState.setVictimNote(this.victimName, textarea.value);
      });
      textarea.focus();
    }

    // Fade in
    this.cameras.main.setAlpha(0);
    this.tweens.add({ targets: this.cameras.main, alpha: 1, duration: 150 });
  }

  _escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  _close() {
    // Save final state
    const textarea = document.getElementById('notebook-textarea');
    if (textarea) {
      gameState.setVictimNote(this.victimName, textarea.value);
    }
    this.cameras.main.fadeOut(150, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => { this.scene.stop(); });
  }
}
```

**Verify:** Register in main.js (Task 11), then `npm start`, open game, test Notebook opens/closes, text persists when reopened.

**Commit:** `feat(scene): add NotebookScene — per-victim note-taking overlay`

---

### Task 9: Create WebMailScene

**Files:**
- Create: `src/scenes/WebMailScene.js`

Two-state scene: login screen → inbox view. Uses the password/hint from victim config in levels.js and email data from webmail config.

```js
/**
 * WebMailScene.js - WebMail Email Client Overlay
 *
 * Fake email client accessible from the office computer (Floor 2+).
 * Password-protected per victim. Contains order confirmations, bank alerts,
 * and official notifications — some with embedded intel.
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';
import { getWebMailData } from '../config/webmail/index.js';
import { FLOORS } from '../config/levels.js';

export default class WebMailScene extends Phaser.Scene {
  constructor() {
    super({ key: 'webmail' });
  }

  init(data) {
    this.victim = data?.victim || null;
    this.levelNum = data?.level || 2;
  }

  create() {
    const { width, height } = this.scale;

    // Backdrop
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
      .setInteractive().setDepth(99);

    // Browser window dimensions
    this.browserW = width - 120;
    this.browserH = height - 60;
    this.browserX = 60;
    this.browserY = 30;

    this._drawBrowserChrome();

    if (!this.victim) {
      this._showError('No victim selected');
      return;
    }

    this.mailData = getWebMailData(this.levelNum, this.victim.name);
    if (!this.mailData) {
      this._showError('No email data available');
      return;
    }

    // Check if already logged in this shift
    if (gameState.isEmailLoggedIn(this.victim.name)) {
      this._showInbox();
    } else {
      this._showLoginScreen();
    }
  }

  _drawBrowserChrome() {
    const g = this.add.graphics().setDepth(100);
    // Window background
    g.fillStyle(0x1a1a2e);
    g.fillRoundedRect(this.browserX, this.browserY, this.browserW, this.browserH, 6);
    // Title bar
    g.fillStyle(0x2a2a3e);
    g.fillRect(this.browserX, this.browserY, this.browserW, 30);

    // Close button
    const closeBtn = this.add.circle(this.browserX + this.browserW - 16, this.browserY + 15, 7, 0xff5555)
      .setInteractive({ useHandCursor: true }).setDepth(102);
    closeBtn.on('pointerdown', () => this._close());

    // Title
    this.add.text(this.browserX + 14, this.browserY + 8, '📧 WebMail', {
      fontFamily: '"Courier New", monospace', fontSize: '13px',
      fontStyle: 'bold', color: '#aabbcc'
    }).setDepth(101);
  }

  _showLoginScreen() {
    const cx = this.browserX + this.browserW / 2;
    const cy = this.browserY + this.browserH / 2;

    // Login panel background
    const panelW = 360;
    const panelH = 300;
    const panelX = cx - panelW / 2;
    const panelY = cy - panelH / 2;

    this.loginContainer = this.add.container(0, 0).setDepth(101);

    const bg = this.add.graphics();
    bg.fillStyle(0x222244);
    bg.fillRoundedRect(panelX, panelY, panelW, panelH, 8);
    bg.lineStyle(1, 0x4466aa);
    bg.strokeRoundedRect(panelX, panelY, panelW, panelH, 8);
    this.loginContainer.add(bg);

    // Mail icon + title
    const title = this.add.text(cx, panelY + 30, '📧 Sign In', {
      fontFamily: '"Courier New", monospace', fontSize: '18px',
      fontStyle: 'bold', color: '#ccddff'
    }).setOrigin(0.5);
    this.loginContainer.add(title);

    // Email display (read-only)
    const emailLabel = this.add.text(panelX + 20, panelY + 70, 'Email:', {
      fontFamily: '"Courier New", monospace', fontSize: '12px', color: '#8899aa'
    });
    this.loginContainer.add(emailLabel);

    const emailText = this.add.text(panelX + 20, panelY + 88, this.victim.emailAddress || 'unknown@mail.com', {
      fontFamily: '"Courier New", monospace', fontSize: '14px', color: '#ffffff'
    });
    this.loginContainer.add(emailText);

    // Password input (DOM element)
    const pwHTML = `<input id="webmail-password" type="password" style="
      width: ${panelW - 44}px;
      height: 32px;
      background: #1a1a3e;
      border: 1px solid #4466aa;
      border-radius: 4px;
      color: #ffffff;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      padding: 0 8px;
      outline: none;
    " placeholder="Enter password..." />`;

    const pwLabel = this.add.text(panelX + 20, panelY + 120, 'Password:', {
      fontFamily: '"Courier New", monospace', fontSize: '12px', color: '#8899aa'
    });
    this.loginContainer.add(pwLabel);

    this.passwordDom = this.add.dom(panelX + panelW / 2, panelY + 152)
      .createFromHTML(pwHTML).setDepth(102);

    // Login button
    const loginBtn = this.add.rectangle(cx, panelY + 200, 120, 36, 0x336699)
      .setInteractive({ useHandCursor: true }).setDepth(102);
    const loginText = this.add.text(cx, panelY + 200, 'Sign In', {
      fontFamily: '"Courier New", monospace', fontSize: '14px',
      fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5).setDepth(103);
    this.loginContainer.add(loginBtn);
    this.loginContainer.add(loginText);

    // Failed attempts counter
    this.failedAttempts = 0;
    this.hintText = null;

    loginBtn.on('pointerdown', () => this._attemptLogin());

    // Allow Enter key to submit
    const pwInput = document.getElementById('webmail-password');
    if (pwInput) {
      pwInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._attemptLogin();
      });
      pwInput.focus();
    }
  }

  _attemptLogin() {
    const pwInput = document.getElementById('webmail-password');
    if (!pwInput) return;

    const entered = pwInput.value.trim().toLowerCase();
    const correct = (this.victim.emailPassword || '').toLowerCase();

    if (entered === correct) {
      gameState.setEmailLoggedIn(this.victim.name);
      if (this.sound.get('sfx_notification_ding')) {
        this.sound.play('sfx_notification_ding', { volume: 0.3 });
      }
      // Remove login UI
      if (this.loginContainer) this.loginContainer.destroy();
      if (this.passwordDom) this.passwordDom.destroy();
      this._showInbox();
    } else {
      this.failedAttempts++;
      pwInput.value = '';
      pwInput.style.borderColor = '#ff4444';
      this.time.delayedCall(500, () => {
        if (pwInput) pwInput.style.borderColor = '#4466aa';
      });

      // Show hint after 2 failed attempts
      if (this.failedAttempts >= 2 && !this.hintText) {
        const hint = this.victim.emailHint || 'No hint available';
        const cx = this.browserX + this.browserW / 2;
        const cy = this.browserY + this.browserH / 2;
        this.hintText = this.add.text(cx, cy + 100, `💡 Password hint: "${hint}"`, {
          fontFamily: '"Courier New", monospace', fontSize: '12px',
          color: '#ffcc44', wordWrap: { width: 300 }
        }).setOrigin(0.5).setDepth(103);
      }
    }
  }

  _showInbox() {
    const contentX = this.browserX + 16;
    const contentY = this.browserY + 44;
    const contentW = this.browserW - 32;

    // Inbox header
    this.add.text(contentX, contentY, `Inbox — ${this.victim.emailAddress || 'unknown'}`, {
      fontFamily: '"Courier New", monospace', fontSize: '14px',
      fontStyle: 'bold', color: '#aabbcc'
    }).setDepth(101);

    // Email list (scrollable container)
    this.emailContainer = this.add.container(0, 0).setDepth(101);
    let yPos = contentY + 30;

    this.mailData.emails.forEach((email, idx) => {
      const emailY = yPos;
      const rowH = 54;

      // Row background
      const rowBg = this.add.rectangle(contentX + contentW / 2, emailY + rowH / 2, contentW, rowH - 2,
        email.isRead ? 0x1a1a2e : 0x1a2a3e).setDepth(101);
      rowBg.setInteractive({ useHandCursor: true });
      this.emailContainer.add(rowBg);

      // Unread indicator
      if (!email.isRead) {
        const dot = this.add.circle(contentX + 8, emailY + rowH / 2, 4, 0x4488ff).setDepth(102);
        this.emailContainer.add(dot);
      }

      // From
      const fromText = this.add.text(contentX + 20, emailY + 6, email.from, {
        fontFamily: '"Courier New", monospace', fontSize: '11px',
        fontStyle: email.isRead ? 'normal' : 'bold', color: '#ccddee'
      }).setDepth(102);
      this.emailContainer.add(fromText);

      // Subject
      const subjectText = this.add.text(contentX + 20, emailY + 22, email.subject, {
        fontFamily: '"Courier New", monospace', fontSize: '12px',
        fontStyle: email.isRead ? 'normal' : 'bold', color: '#ffffff'
      }).setDepth(102);
      this.emailContainer.add(subjectText);

      // Date
      const dateText = this.add.text(contentX + contentW - 10, emailY + 6, email.date, {
        fontFamily: '"Courier New", monospace', fontSize: '10px', color: '#667788'
      }).setOrigin(1, 0).setDepth(102);
      this.emailContainer.add(dateText);

      rowBg.on('pointerdown', () => this._showEmail(email));
      rowBg.on('pointerover', () => rowBg.setFillStyle(0x2a3a4e));
      rowBg.on('pointerout', () => rowBg.setFillStyle(email.isRead ? 0x1a1a2e : 0x1a2a3e));

      yPos += rowH;
    });

    // Scroll mask
    const maskShape = this.make.graphics();
    maskShape.fillRect(this.browserX, this.browserY + 40, this.browserW, this.browserH - 40);
    this.emailContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, maskShape));

    // Scroll support
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (pointer.x >= this.browserX && pointer.x <= this.browserX + this.browserW) {
        this.emailContainer.y = Phaser.Math.Clamp(
          this.emailContainer.y - deltaY * 0.5,
          -(yPos - (this.browserY + this.browserH) + 40), 0
        );
      }
    });
  }

  _showEmail(email) {
    // Mark intel as seen
    if (email.intel && email.intel.key) {
      gameState.markIntelSeen(email.intel.key);
    }

    // Clear inbox view and show email body
    if (this.emailContainer) this.emailContainer.destroy();
    if (this.emailDetailContainer) this.emailDetailContainer.destroy();

    this.emailDetailContainer = this.add.container(0, 0).setDepth(101);

    const contentX = this.browserX + 16;
    const contentY = this.browserY + 44;
    const contentW = this.browserW - 32;

    // Back button
    const backBtn = this.add.text(contentX, contentY, '← Back to Inbox', {
      fontFamily: '"Courier New", monospace', fontSize: '12px',
      color: '#4488cc'
    }).setInteractive({ useHandCursor: true }).setDepth(102);
    backBtn.on('pointerdown', () => {
      this.emailDetailContainer.destroy();
      this._showInbox();
    });
    this.emailDetailContainer.add(backBtn);

    // From
    this.emailDetailContainer.add(this.add.text(contentX, contentY + 30, `From: ${email.from}`, {
      fontFamily: '"Courier New", monospace', fontSize: '12px', color: '#aabbcc'
    }).setDepth(102));

    // Subject
    this.emailDetailContainer.add(this.add.text(contentX, contentY + 48, email.subject, {
      fontFamily: '"Courier New", monospace', fontSize: '14px',
      fontStyle: 'bold', color: '#ffffff'
    }).setDepth(102));

    // Date
    this.emailDetailContainer.add(this.add.text(contentX, contentY + 70, email.date, {
      fontFamily: '"Courier New", monospace', fontSize: '11px', color: '#667788'
    }).setDepth(102));

    // Divider
    const divG = this.add.graphics().setDepth(102);
    divG.lineStyle(1, 0x334455);
    divG.lineBetween(contentX, contentY + 88, contentX + contentW, contentY + 88);
    this.emailDetailContainer.add(divG);

    // Body (word-wrapped)
    const bodyText = this.add.text(contentX, contentY + 96, email.body, {
      fontFamily: '"Courier New", monospace', fontSize: '12px',
      color: '#ccddee', wordWrap: { width: contentW - 20 }, lineSpacing: 4
    }).setDepth(102);
    this.emailDetailContainer.add(bodyText);

    // Scroll mask for long emails
    const maskShape = this.make.graphics();
    maskShape.fillRect(this.browserX, this.browserY + 40, this.browserW, this.browserH - 40);
    this.emailDetailContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, maskShape));

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (pointer.x >= this.browserX && pointer.x <= this.browserX + this.browserW) {
        this.emailDetailContainer.y = Phaser.Math.Clamp(
          this.emailDetailContainer.y - deltaY * 0.5,
          -(bodyText.height - this.browserH + 200), 0
        );
      }
    });
  }

  _showError(msg) {
    const cx = this.browserX + this.browserW / 2;
    const cy = this.browserY + this.browserH / 2;
    this.add.text(cx, cy, msg, {
      fontFamily: '"Courier New", monospace', fontSize: '14px', color: '#ff6666'
    }).setOrigin(0.5).setDepth(101);
  }

  _close() {
    this.cameras.main.fadeOut(150, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => { this.scene.stop(); });
  }
}
```

**Verify:** Register in main.js (Task 11), test login flow with correct/wrong passwords, verify hint appears after 2 failed attempts, verify intel marking when reading emails with intel.

**Commit:** `feat(scene): add WebMailScene — password-protected email client overlay`

---

### Task 10: Register new scenes in main.js and BootScene

**Files:**
- Modify: `src/main.js`
- Modify: `src/scenes/BootScene.js`

**Step 1: Add imports and scene registration in main.js**

After the existing imports (around line 12), add:
```js
import NotebookScene from './scenes/NotebookScene.js';
import WebMailScene from './scenes/WebMailScene.js';
```

In the `scene` array (lines 20-32), add both new scenes after `SocialNetworkScene`:
```js
NotebookScene,
WebMailScene,
```

**Step 2: Enable DOM element support in Phaser config**

The NotebookScene and WebMailScene use `this.add.dom()` for text input. Add `dom.createContainer: true` to the Phaser config:

```js
const config = {
  // ... existing config ...
  dom: {
    createContainer: true
  },
  // ...
};
```

**Verify:** `npm start`, check no console errors. Confirm game loads with all scenes registered.

**Commit:** `feat: register NotebookScene and WebMailScene, enable DOM container`

---

## Phase 4: OfficeScene — Computer Desktop + Research Mode

### Task 11: Add computer desktop app icons to OfficeScene

**Files:**
- Modify: `src/scenes/OfficeScene.js`

**Step 1: Replace single monitor click handler with app launcher**

Currently `_drawMonitor()` (line 226) sets `monitorZone.on('pointerdown', () => this._openFriendBook())`. Replace this with a method that shows app icons on the monitor.

Replace line 226 with:
```js
monitorZone.on('pointerdown', () => { this.sound.play('sfx_mouse_click', { volume: 0.4 }); this._toggleDesktop(); });
```

**Step 2: Add `_toggleDesktop()` method**

After `_openFriendBook()`:

```js
_toggleDesktop() {
  // If any app overlay is open, don't show desktop
  if (this.scene.isActive('social-network') || this.scene.isActive('notebook') || this.scene.isActive('webmail')) return;

  if (this.desktopContainer && this.desktopContainer.visible) {
    this.desktopContainer.setVisible(false);
    return;
  }

  this._showDesktop();
}

_showDesktop() {
  if (this.desktopContainer) {
    this.desktopContainer.setVisible(true);
    return;
  }

  const floor = FLOORS[this.levelNum];
  const apps = floor?.availableApps || ['friendbook'];
  const { width, height } = this.scale;

  // Desktop panel over the monitor area
  const mx = width * 0.475;
  const my = height * 0.72;
  const panelW = 260;
  const panelH = 180;

  this.desktopContainer = this.add.container(mx - panelW / 2, my - panelH / 2 - 20).setDepth(20);

  // Desktop background
  const bg = this.add.graphics();
  bg.fillStyle(0x0a0a2e, 0.95);
  bg.fillRoundedRect(0, 0, panelW, panelH, 6);
  bg.lineStyle(1, 0x334466);
  bg.strokeRoundedRect(0, 0, panelW, panelH, 6);
  this.desktopContainer.add(bg);

  // App icons grid
  const appConfigs = {
    friendbook: { icon: '📘', label: 'FriendBook', action: () => this._openFriendBook() },
    notebook: { icon: '📓', label: 'Notebook', action: () => this._openNotebook() },
    webmail: { icon: '📧', label: 'WebMail', action: () => this._openWebMail() },
    searchr: { icon: '🔍', label: 'Searchr', action: () => {} }, // Placeholder for Floor 4+
  };

  const startX = 40;
  const startY = 30;
  const spacing = 70;

  apps.forEach((appId, idx) => {
    const cfg = appConfigs[appId];
    if (!cfg) return;

    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const ax = startX + col * spacing;
    const ay = startY + row * 80;

    // Icon background (clickable)
    const iconBg = this.add.rectangle(ax, ay, 50, 50, 0x1a2a4e)
      .setInteractive({ useHandCursor: true }).setDepth(21);
    iconBg.on('pointerover', () => iconBg.setFillStyle(0x2a3a5e));
    iconBg.on('pointerout', () => iconBg.setFillStyle(0x1a2a4e));
    iconBg.on('pointerdown', () => {
      this.sound.play('sfx_mouse_click', { volume: 0.3 });
      this.desktopContainer.setVisible(false);
      cfg.action();
    });
    this.desktopContainer.add(iconBg);

    // Emoji icon
    const iconText = this.add.text(ax, ay - 4, cfg.icon, {
      fontSize: '24px'
    }).setOrigin(0.5).setDepth(22);
    this.desktopContainer.add(iconText);

    // Label
    const label = this.add.text(ax, ay + 28, cfg.label, {
      fontFamily: '"Courier New", monospace', fontSize: '10px',
      color: '#aabbcc'
    }).setOrigin(0.5).setDepth(22);
    this.desktopContainer.add(label);
  });
}
```

**Step 3: Add `_openNotebook()` and `_openWebMail()` methods**

After `_openFriendBook()`:

```js
_openNotebook() {
  if (this.scene.isActive('notebook')) return;
  const victim = this.callInProgress && gameState.currentVictim
    ? gameState.currentVictim
    : this._getOrPreSelectVictim();
  this.scene.launch('notebook', {
    victimName: victim ? victim.name : 'General Notes',
    level: this.levelNum
  });
}

_openWebMail() {
  if (this.scene.isActive('webmail')) return;
  const victim = this.callInProgress && gameState.currentVictim
    ? gameState.currentVictim
    : this._getOrPreSelectVictim();
  if (!victim) return;
  this.scene.launch('webmail', {
    victim,
    level: this.levelNum
  });
}
```

**Verify:** `npm start`, click monitor, see app icons. Click FriendBook/Notebook/WebMail icons — each opens the correct overlay.

**Commit:** `feat(office): add computer desktop with app icons for FriendBook, Notebook, WebMail`

---

### Task 12: Implement research mode (defer shift timer)

**Files:**
- Modify: `src/scenes/OfficeScene.js`

**Step 1: Don't start shift timer in `create()`**

At line 102, the current code calls `this._startShiftTimer()`. Wrap it in a check:

Replace:
```js
this._startShiftTimer();
```

With:
```js
// Research phase — timer starts when player picks up phone
this._showResearchModeUI();
```

**Step 2: Add `_showResearchModeUI()` method**

```js
_showResearchModeUI() {
  const { width } = this.scale;
  this.researchBanner = this.add.text(width / 2, 18, '🔍 RESEARCH PHASE — Browse the computer, then pick up the phone when ready', {
    fontFamily: '"Courier New", monospace', fontSize: '12px',
    color: '#44bbff', backgroundColor: '#0a1a2e',
    padding: { x: 12, y: 4 }
  }).setOrigin(0.5, 0).setDepth(50);

  // Pulse animation
  this.tweens.add({
    targets: this.researchBanner, alpha: 0.6, duration: 1200,
    yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
  });
}
```

**Step 3: Start timer when phone is picked up**

In `_initiateCall()` (line 566), add research phase exit at the top:

```js
_initiateCall() {
  // Exit research phase and start shift timer on first call
  if (gameState.researchPhase) {
    gameState.exitResearchPhase();
    this._startShiftTimer();
    if (this.researchBanner) {
      this.researchBanner.destroy();
      this.researchBanner = null;
    }
  }

  // ... existing code continues ...
```

**Step 4: Update shift timer display**

In `_updateShiftTimerDisplay()`, handle the research phase:

At the top of the method, add:
```js
if (gameState.researchPhase) {
  // Don't show countdown during research
  this.shiftTimerText.setText('RESEARCH');
  this.shiftTimerText.setColor('#44bbff');
  return;
}
```

**Verify:** `npm start`, enter Floor 1. Confirm "RESEARCH PHASE" banner shows. Browse FriendBook. Pick up phone — confirm timer starts and banner disappears.

**Commit:** `feat(office): implement untimed research phase before shift timer starts`

---

## Phase 5: UX Improvements

### Task 13: Redesign CallScene intel tracker with categories and callHints

**Files:**
- Modify: `src/scenes/CallScene.js`

**Step 1: Rewrite `_createIntelPanel()` (lines 782-816)**

Replace the entire method with:

```js
_createIntelPanel() {
  if (!gameState.intelKeys || gameState.intelKeys.length === 0) return;
  if (!this._cardLayout) return;

  const { cardX, cardY, cardW, baseCardH } = this._cardLayout;
  const intelY = cardY + baseCardH;

  // Divider line
  const g = this.add.graphics().setDepth(200);
  g.lineStyle(1, 0x334455);
  g.lineBetween(cardX + 8, intelY + 2, cardX + cardW - 8, intelY + 2);

  // Header
  this.add.text(cardX + 14, intelY + 6, 'Intel', {
    fontFamily: '"Courier New", monospace', fontSize: '11px',
    fontStyle: 'bold', color: '#66aacc'
  }).setDepth(201);

  this.callIntelItems = {};
  let yOffset = intelY + 24;

  gameState.intelKeys.forEach((intel) => {
    const isUsed = gameState.intelUsed.has(intel.key);
    const category = intel.trackerCategory || intel.category || '???';

    // Category/status line
    const statusIcon = isUsed ? '⭐' : '🔍';
    const statusText = isUsed ? intel.description : category;
    const statusColor = isUsed ? '#66bb6a' : '#aaaaaa';
    const suffix = isUsed ? ' — CONFIRMED' : '';

    const text = this.add.text(cardX + 14, yOffset, `${statusIcon} ${statusText}${suffix}`, {
      fontFamily: '"Courier New", monospace', fontSize: '11px',
      color: statusColor, wordWrap: { width: cardW - 32 }
    }).setDepth(201);

    // CallHint (shown only when used)
    let hintText = null;
    if (isUsed && intel.callHint) {
      hintText = this.add.text(cardX + 28, yOffset + 16, `💬 "${intel.callHint}"`, {
        fontFamily: '"Courier New", monospace', fontSize: '9px',
        color: '#88aa66', fontStyle: 'italic',
        wordWrap: { width: cardW - 48 }
      }).setDepth(201);
      yOffset += hintText.height + 4;
    }

    this.callIntelItems[intel.key] = { text, hintText };
    yOffset += 20;
  });

  gameState.on('intel_used', this._onCallIntelUsed, this);
}
```

**Step 2: Rewrite `_onCallIntelUsed()` (lines 818-836)**

Replace with:

```js
_onCallIntelUsed(key) {
  const intel = gameState.intelKeys.find(i => i.key === key);
  const item = this.callIntelItems?.[key];

  if (intel && item && item.text) {
    // Update status text
    item.text.setText(`⭐ ${intel.description} — CONFIRMED`);
    item.text.setColor('#66bb6a');

    // Scale animation
    this.tweens.add({
      targets: item.text, scaleX: 1.15, scaleY: 1.15,
      duration: 150, yoyo: true, ease: 'Quad.easeOut'
    });

    // Show callHint below (if not already shown)
    if (!item.hintText && intel.callHint) {
      const hintY = item.text.y + 16;
      item.hintText = this.add.text(item.text.x + 14, hintY, `💬 "${intel.callHint}"`, {
        fontFamily: '"Courier New", monospace', fontSize: '9px',
        color: '#88aa66', fontStyle: 'italic',
        wordWrap: { width: (this._cardLayout?.cardW || 200) - 48 }
      }).setDepth(201).setAlpha(0);

      this.tweens.add({ targets: item.hintText, alpha: 1, duration: 300 });
    }
  }

  if (intel) { this._showIntelToast(intel.description); }
}
```

**Verify:** `npm start`, start a Floor 1 call. Intel tracker should show category names (e.g., "🔍 Order details"). Use intel in call — verify it changes to "⭐ [description] — CONFIRMED" with callHint below.

**Commit:** `feat(call): redesign intel tracker with categories and callHints`

---

### Task 14: Add notification dots to SocialNetworkScene Friends tab

**Files:**
- Modify: `src/scenes/SocialNetworkScene.js`

**Step 1: Update `_renderFriends()` (around line 688)**

After rendering each friend's name text, check if that friend's posts contain unseen intel:

Add this check inside the friend rendering loop, after the friend name is drawn:

```js
// Notification dot for profiles with unseen intel
if (this.levelNum <= 2) { // Floor 1: prominent, Floor 2: subtle, Floor 3+: none
  const friendPosts = this.friendbookData.posts?.[friendId] || [];
  const hasUnseenIntel = friendPosts.some(post =>
    post.intel && post.intel.key && !gameState.intelSeen.has(post.intel.key)
  );
  if (hasUnseenIntel) {
    const dotSize = this.levelNum === 1 ? 6 : 4;
    const dotColor = this.levelNum === 1 ? 0x4488ff : 0x335588;
    const nameWidth = nameText.width; // nameText is the friend's name text object
    const dot = this.add.circle(
      nameText.x + nameWidth + 8,
      nameText.y + 6,
      dotSize, dotColor
    ).setDepth(nameText.depth + 1);
    this.tabContentContainer.add(dot);
  }
}
```

This needs to be placed inside the friend-rendering loop in `_renderFriends()`. The exact insertion point is after the friend name `Phaser.Text` is created and added to `tabContentContainer`. The variable name for the text object should match whatever the existing code uses (likely something like a text created via `this.add.text(...)` for the friend's name).

**Verify:** `npm start`, Floor 1, open FriendBook, navigate to Friends & Family tab. Confirm blue dots appear next to family members whose posts contain unseen intel. Confirm dots disappear after viewing those profiles.

**Commit:** `feat(friendbook): add notification dots on Friends tab for unseen intel`

---

### Task 15: Add tutorial popups for new mechanics

**Files:**
- Modify: `src/scenes/OfficeScene.js`
- Modify: `src/scenes/CallScene.js`

**Step 1: Add tutorial flags to GameState**

In `src/state/GameState.js` constructor, add:
```js
// Tutorial flags (persist in localStorage)
this.tutorialsSeen = JSON.parse(localStorage.getItem('scammer_sim_tutorials') || '{}');
```

Add helper methods:
```js
hasTutorialSeen(key) {
  return this.tutorialsSeen[key] === true;
}

markTutorialSeen(key) {
  this.tutorialsSeen[key] = true;
  localStorage.setItem('scammer_sim_tutorials', JSON.stringify(this.tutorialsSeen));
}
```

**Step 2: Show FriendBook tutorial in OfficeScene**

In `_openFriendBook()`, after launching the scene, add:

```js
if (!gameState.hasTutorialSeen('friendbook_intro') && this.levelNum === 1) {
  gameState.markTutorialSeen('friendbook_intro');
  // The FriendBook scene will show its own tutorial via TutorialPopup
}
```

Actually, simpler approach: show a `window.alert()` or in-scene text before the first FriendBook open. Since TutorialPopup is already available:

In `_openFriendBook()`, right after `this.scene.launch('social-network', ...)`:
```js
if (!gameState.hasTutorialSeen('friendbook_intro') && this.levelNum === 1) {
  gameState.markTutorialSeen('friendbook_intro');
  this.time.delayedCall(500, () => {
    const snScene = this.scene.get('social-network');
    if (snScene && snScene.scene.isActive()) {
      // Create a temporary text overlay in the social network scene
      const { width } = snScene.scale;
      const tip = snScene.add.text(width / 2, snScene.browserY + snScene.browserH - 40,
        "💡 TIP: This is FriendBook. Your targets and their friends post here.\nDig through their network for details you can use on the call.",
        {
          fontFamily: '"Courier New", monospace', fontSize: '12px',
          color: '#44bbff', backgroundColor: '#0a0a2e',
          padding: { x: 12, y: 8 }, wordWrap: { width: 500 }
        }
      ).setOrigin(0.5).setDepth(300);
      snScene.time.delayedCall(6000, () => {
        snScene.tweens.add({ targets: tip, alpha: 0, duration: 500, onComplete: () => tip.destroy() });
      });
    }
  });
}
```

**Step 3: Show Notebook tutorial**

In `_openNotebook()`:
```js
if (!gameState.hasTutorialSeen('notebook_intro') && this.levelNum === 1) {
  gameState.markTutorialSeen('notebook_intro');
  // Notebook scene will show its own tip
}
```

In NotebookScene `create()`, add after the textarea setup:
```js
if (!gameState.hasTutorialSeen('notebook_intro')) {
  // Already marked by OfficeScene, but show tip
}
```

Actually simplest: add a tip text in NotebookScene itself on first open. Add to the end of `create()`:
```js
if (!gameState.hasTutorialSeen('notebook_intro')) {
  gameState.markTutorialSeen('notebook_intro');
  const tipText = this.add.text(nbX + nbW / 2, nbY + nbH - 24,
    "💡 Jot down useful details here. Reference your notes during calls.",
    { fontFamily: '"Courier New", monospace', fontSize: '11px', color: '#44bbff' }
  ).setOrigin(0.5).setDepth(103);
  this.time.delayedCall(5000, () => {
    this.tweens.add({ targets: tipText, alpha: 0, duration: 500, onComplete: () => tipText.destroy() });
  });
}
```

**Step 4: Show first-intel-confirmed tutorial in CallScene**

In CallScene `_onCallIntelUsed()`, add at the end:

```js
if (!gameState.hasTutorialSeen('intel_confirmed')) {
  gameState.markTutorialSeen('intel_confirmed');
  const { width } = this.scale;
  const tip = this.add.text(width / 2, 160,
    "💡 Intel confirmed! Mentioning real details naturally makes your scam story credible.",
    {
      fontFamily: '"Courier New", monospace', fontSize: '12px',
      color: '#44ff88', backgroundColor: '#0a2a0a',
      padding: { x: 12, y: 8 }, wordWrap: { width: 400 }
    }
  ).setOrigin(0.5).setDepth(350);
  this.time.delayedCall(5000, () => {
    this.tweens.add({ targets: tip, alpha: 0, duration: 500, onComplete: () => tip.destroy() });
  });
}
```

**Verify:** `npm start`, Floor 1. Open FriendBook → see tutorial tip. Open Notebook → see tip. Use intel in call → see confirmation tip. Refresh — tips don't appear again.

**Commit:** `feat(tutorial): add first-time tutorial tips for FriendBook, Notebook, and intel confirmation`

---

### Task 16: Update prompt files for new 3-intel structure

**Files:**
- Modify: `src/config/prompts/level1.js`
- Modify: `src/config/prompts/level2.js`
- Modify: `src/config/prompts/level3.js`

The intel trigger injection code in these files (the `INTEL TRIGGERS` block) doesn't need structural changes — it already iterates `intelTriggers` array dynamically using `.map()`. The only thing that changes is the data passed in (3 items instead of 4, with new boost values).

**However**, verify the boost calculation still works:
- Current: `compliance_delta +${Math.round(t.boost * 0.6)}`, `suspicion_delta -${Math.round(t.boost * 0.4)}`
- With boost 15: compliance +9, suspicion -6 ✓
- With boost 12: compliance +7, suspicion -5 ✓
- With boost 10: compliance +6, suspicion -4 ✓

No code changes needed in the prompt files themselves — the dynamic injection already handles variable-length `intelTriggers` arrays. The new intel keys, descriptions, and boosts come from the FriendBook config which was updated in Tasks 5-7.

**Verify:** Start a Floor 1 call, browse FriendBook first, confirm only 3 intel triggers appear in the AI prompt (check VoiceManager debug output or test conversation).

**Commit:** This is a no-op — no commit needed. The prompt files dynamically handle the new data.

---

### Task 17: Integration testing and polish

**Files:** All modified files

**Step 1: Full Floor 1 playtest**
- Start new game → Floor 1
- Confirm research phase: no timer, "RESEARCH PHASE" banner visible
- Click monitor → see desktop with FriendBook + Notebook icons (no WebMail)
- Open FriendBook → see Friends tab with notification dots
- Browse family profiles → find 3 intel pieces for Dorothy
- Open Notebook → jot down findings
- Pick up phone → timer starts, banner disappears
- During call → intel tracker shows 3 categories
- Mention intel naturally → verify CONFIRMED state + callHint display
- Complete/end call → verify no crashes

**Step 2: Full Floor 2 playtest**
- Same as above, plus:
- Desktop shows FriendBook + Notebook + WebMail
- Open WebMail → login screen with David Chen's email
- Try wrong password → red flash
- Try wrong again → password hint appears
- Enter correct password → inbox loads
- Read H&R Block email → verify intel marked as seen
- During call → verify email-sourced intel works

**Step 3: Full Floor 3 playtest**
- Same, plus harder email passwords
- Verify progressive reveal still works (script steps unlock when intel seen)
- Verify Norton email intel triggers correctly

**Step 4: Fix any bugs found during playtesting**

**Commit:** `fix: integration fixes from playtest`

---

## Task Dependency Graph

```
Task 1  (GameState)     ─┐
Task 2  (levels.js)     ─┤
Task 4  (WebMail config) ┤
                         ├─→ Task 10 (register scenes) ─→ Task 11 (desktop) ─→ Task 12 (research mode)
Task 8  (NotebookScene) ─┤
Task 9  (WebMailScene)  ─┘

Task 5  (FB level1)  ─┐
Task 6  (FB level2)  ─┼─→ Task 13 (intel tracker) ─→ Task 15 (tutorials) ─→ Task 17 (integration)
Task 7  (FB level3)  ─┤
                      └─→ Task 14 (notification dots)
```

**Parallelizable groups:**
- Tasks 1, 2, 4, 5, 6, 7, 8, 9 can ALL run in parallel (no dependencies between them)
- Tasks 10, 11, 12 are sequential
- Tasks 13, 14 can run in parallel (both depend on Tasks 5-7)
- Task 15 depends on Tasks 11, 13
- Task 17 depends on everything
