/**
 * WebMail inbox data for Level 2: Government Impersonation
 *
 * Each victim has 5 emails in their inbox. One email per victim contains intel
 * that the player can discover and use during the call.
 *
 * Victims:
 *   David Chen     -- TAX_FILING intel (H&R Block email about 1099 discrepancy)
 *   Maria Gonzalez -- PACKAGE_DETAILS intel (DHL shipment confirmation)
 *   James Wilson   -- CASE_DETAILS intel (Cook County court notice)
 */

const WEBMAIL_DATA = {
  'David Chen': {
    emails: [
      {
        id: 'dc-001',
        from: 'Steve Wozniak <steve.w@hrblock-sacramento.com>',
        subject: 'Joint Filing Update - Action Needed on 1099-NEC',
        date: 'Feb 18, 2026',
        body: `Hi David,

Hope you and Mei are doing well. I've been going through your joint return and wanted to flag something before I finalize.

The 1099-NEC income from UpBuild Consulting shows a discrepancy with what was reported on your W-2 from Meridian Systems. Specifically, the contractor payments from UpBuild total $14,200 for the year, but the quarterly estimates you sent me only account for about $9,800 in self-employment income.

This isn't unusual for a first year of freelancing — a lot of clients forget to include payments that came in late Q4. But I need you to pull your UpBuild invoices from October through December and send them over so I can reconcile before we file.

Also, Mei mentioned the kitchen renovation. If any of the contractor work on the house was paid through your business account, we should talk about that too. Not a problem, just need to categorize it correctly.

Can you get me those invoices by end of week? I'd like to have everything submitted before the March 15 extension deadline.

Thanks,
Steve Wozniak, CPA
H&R Block - Sacramento Arden Way
(916) 555-0142`,
        isRead: false,
        folder: 'inbox',
        intel: { key: 'TAX_FILING', value: 'Joint filing with H&R Block shows 1099 contractor income discrepancy from UpBuild Consulting' },
      },
      {
        id: 'dc-002',
        from: 'Mei Chen <mei.chen@wallaceassoc.com>',
        subject: 'Kitchen Final Invoice - PLEASE LOOK AT THIS',
        date: 'Feb 16, 2026',
        body: `David,

Babe. The final invoice from Rivera Custom Cabinets just came in. $22,400. I know we talked about this being around $18K but they're charging extra for the custom pantry shelving and the under-cabinet lighting install.

I already called them and they said the change order we signed in November covers the extra work. I honestly don't remember signing anything but you were there too — do you remember?

Can you dig through your email and see if there's a copy of the change order? If we DID sign it then we just have to pay it. If we didn't, I'm calling Diego (not that Diego, my work Diego) to look at the contract.

Also please don't tell your mother how much the kitchen cost. She will have opinions.

Love you,
Mei`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'dc-003',
        from: 'Amazon.com <shipment-tracking@amazon.com>',
        subject: 'Your order has shipped! Arriving Wednesday',
        date: 'Feb 17, 2026',
        body: `Hello David,

Your order #114-7829301-4456782 has shipped!

  Item: Weber Spirit II E-310 Gas Grill - Black
  Qty: 1
  Price: $449.00

Estimated delivery: Wednesday, February 19
Shipping to: 2847 Arden Park Dr, Sacramento, CA 95825

Track your package: [Tracking Link]

Thank you for shopping with Amazon!`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'dc-004',
        from: 'HR Department <hr@techvista-corp.com>',
        subject: 'Your 2025 W-2 is Available',
        date: 'Feb 10, 2026',
        body: `Dear David Chen,

Your 2025 W-2 wage and tax statement is now available through the TechVista employee portal. You can access it by logging into myportal.techvista-corp.com and navigating to Tax Documents.

If you have recently separated from TechVista, your W-2 has been mailed to your address on file. Please allow 7-10 business days for delivery.

For questions about your W-2, please contact HR at hr@techvista-corp.com or call (916) 555-0280.

Best regards,
TechVista Human Resources`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'dc-005',
        from: 'UpBuild Consulting <invoices@upbuildconsulting.com>',
        subject: 'Invoice #UB-2026-0091 - Payment Received',
        date: 'Feb 14, 2026',
        body: `Hi David,

This is confirmation that payment has been received for Invoice #UB-2026-0091.

  Project: Riverview Office Park Phase 2 - PM Services
  Period: January 15 - February 14, 2026
  Amount: $3,200.00
  Payment method: Direct deposit (Chase checking ***4817)

Your next invoice period begins February 15. Please log your hours through the contractor portal as usual.

If you have any questions, reach out to accounting@upbuildconsulting.com.

Thanks for your great work!
UpBuild Consulting - Contractor Services`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
    ],
  },

  'Maria Gonzalez': {
    emails: [
      {
        id: 'mg-001',
        from: 'DHL Express <noreply@dhl.com>',
        subject: 'Shipment Confirmation - Tracking #4821-7793-0156',
        date: 'Feb 17, 2026',
        body: `Dear Maria Gonzalez,

Your DHL Express International shipment has been confirmed and is in transit.

  SHIPMENT DETAILS
  Tracking Number: 4821-7793-0156
  Origin: Houston, TX, United States
  Destination: Guadalajara, Jalisco, Mexico
  Service: DHL Express Worldwide
  Declared Value: $340.00 USD
  Contents: Clothing, handmade textiles, family photographs
  Weight: 8.4 kg
  Pieces: 1

  ESTIMATED DELIVERY
  February 24-26, 2026

  CUSTOMS INFORMATION
  Customs declaration filed. Duty assessment pending upon arrival at destination customs facility. Recipient may be contacted for additional documentation if required.

Track your shipment at dhl.com/track or call 1-800-225-5345.

Thank you for choosing DHL Express.`,
        isRead: false,
        folder: 'inbox',
        intel: { key: 'PACKAGE_DETAILS', value: 'DHL shipment #4821-7793-0156 to Guadalajara, declared value $340, contains family items' },
      },
      {
        id: 'mg-002',
        from: 'Carlos Gonzalez <carlos.g.valero@gmail.com>',
        subject: 'RE: Abuela Package Checklist',
        date: 'Feb 16, 2026',
        body: `Babe,

Ok I double-checked the box before you sealed it. Here's what I counted:

- Photo album (the big one Sofia helped with) -- check
- The blue rebozo you picked up at the mercado -- check
- Sofia's drawings (she put in like 6 extra ones lol) -- check
- The tablet (Samsung, already set up with video call app) -- check
- Homemade dulces (triple wrapped so they don't melt) -- check
- That card from all of us -- check

I think we're good. You already packed it tighter than a carry-on so nothing is going to move.

Also I talked to the DHL guy and he said the customs form looked fine. Just make sure you keep the receipt in case anything comes up.

Love you. Abuela is going to cry happy tears when she opens this.

Carlos`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'mg-003',
        from: 'Sofia Gonzalez <managed by maria.gonzalez@outlook.com>',
        subject: 'Fwd: Sofia wants to add something to abuela box',
        date: 'Feb 15, 2026',
        body: `Maria (forwarding from Sofia's tablet),

"Mommy can we put the picture of Luna in the sombrero in abuela's box? And also the one where I'm wearing my Girl Scout uniform because abuela said she wanted to see it. And can we put in some of my cookies? I saved 3 boxes of Thin Mints for her. Also tell abuela Rosa happy birthday and that I love her SO MUCH and I'm going to video call her every single day on the tablet."

-- Sofia (typed by herself, minimal edits by Mom)

P.S. from Maria: I already put the photo in. The cookies won't survive international shipping, mija. We'll video call her together on her birthday. Love you baby.`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'mg-004',
        from: 'Comcast <no-reply@comcast.com>',
        subject: 'Your Monthly Statement is Ready',
        date: 'Feb 12, 2026',
        body: `Hello Maria,

Your Comcast Xfinity statement for the billing period January 12 - February 11, 2026 is now available.

  Account: ***-***-7784
  Amount Due: $142.87
  Due Date: March 4, 2026

  Internet (Performance Plus): $79.99
  TV (Digital Starter): $49.99
  Equipment rental: $14.00
  Taxes & fees: ($1.11 credit applied)

To view your full statement or make a payment, visit xfinity.com/myaccount.

Thank you for being a valued Comcast customer.`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'mg-005',
        from: 'Target <receipts@target.com>',
        subject: 'Your Target receipt from Feb 14',
        date: 'Feb 14, 2026',
        body: `Thanks for shopping at Target!

  Store: Target - Heights Blvd, Houston TX
  Date: February 14, 2026
  Time: 2:47 PM

  Items:
    Bubble wrap (large roll)         $12.99
    Packing tape (3-pack)             $8.49
    Tissue paper - assorted           $4.99
    Gift box - large                  $7.99
    Valentine's Day card - Husband    $6.99
    Reese's Hearts (2-pack)           $3.49

  Subtotal:                          $44.94
  Tax:                                $3.71
  Total:                             $48.65
  Payment: Visa ending 8834

Save 5% on every purchase with Target Circle Card. Apply today!`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
    ],
  },

  'James Wilson': {
    emails: [
      {
        id: 'jw-001',
        from: 'Cook County Circuit Court <notifications@cookcountyclerk.gov>',
        subject: 'NOTICE: Case #2026-TR-041892 - Outstanding Fine',
        date: 'Feb 19, 2026',
        body: `COOK COUNTY CIRCUIT COURT
TRAFFIC DIVISION - 14th DISTRICT

OFFICIAL NOTICE OF OUTSTANDING FINE

Case Number: 2026-TR-041892
Defendant: James T. Wilson
Violation: IL Vehicle Code 625 ILCS 5/11-601(b) - Failure to Reduce Speed
Location: Kennedy Expressway (I-90/94) near Diversey Ave exit, Chicago, IL
Date of Violation: February 15, 2026
Issuing Officer: Ofc. M. Delgado, Badge #4471

FINE ASSESSMENT:
  Base fine:                          $250.00
  Court costs:                         $75.00
  Late processing surcharge:           $50.00
  TOTAL DUE:                          $375.00

DEADLINE FOR PAYMENT: March 19, 2026

Failure to pay by the above date may result in additional penalties, license suspension, or issuance of a bench warrant.

Payment may be made online at cookcountyclerk.gov/pay, by mail, or in person at the 14th District Courthouse, 2452 W. Belmont Ave, Chicago, IL 60618.

For questions, contact the Traffic Division at (312) 555-0194.

This is an automated notification. Do not reply to this email.`,
        isRead: false,
        folder: 'inbox',
        intel: { key: 'CASE_DETAILS', value: 'Cook County case #2026-TR-041892, 14th District, $375 fine, deadline March 19' },
      },
      {
        id: 'jw-002',
        from: 'Angela Wilson <angela.wilson.realtor@gmail.com>',
        subject: 'Insurance Claim + CONGRATS BABE!!',
        date: 'Feb 18, 2026',
        body: `James,

Two things:

1) State Farm emailed back about the claim. They need photos of the rear bumper damage and the police report number. I forwarded the State Farm email below. Can you take the photos tonight before it gets dark? The adjuster wants them by Friday.

2) I didn't want to say it on FriendBook before it was official but -- CONGRATULATIONS ON THE PROMOTION!! Operations Manager!! I am so so proud of you. You have worked so hard for this and you deserve every bit of it. Dinner at Gibson's this weekend to celebrate? My treat (ok fine, our treat, we share a bank account).

I love you. Now go take those bumper photos.

Angela

P.S. Tamara keeps texting me asking if your neck is better. Please just go to Rush and get the X-ray. For me.`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'jw-003',
        from: 'Lakefront Manufacturing <hr@lakefrontmfg.com>',
        subject: 'Promotion Confirmation - Operations Manager',
        date: 'Feb 17, 2026',
        body: `Dear James,

On behalf of the leadership team at Lakefront Manufacturing, I am pleased to formally confirm your promotion to Operations Manager, effective February 24, 2026.

Your new compensation package:
  Base salary: $92,000/year (previously $74,500)
  Bonus target: 12% of base salary
  Additional PTO: 5 days (total 20 days/year)

You will report directly to VP of Operations, Mark Hennessy. Your new office will be on the 3rd floor, suite 310.

Please review and sign the updated employment agreement attached to this email and return it to HR by February 21.

Congratulations, James. Your dedication and leadership on the South Side distribution project made this an easy decision.

Best regards,
Diane Kowalski
Director of Human Resources
Lakefront Manufacturing, Inc.`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'jw-004',
        from: 'State Farm <claims@statefarm.com>',
        subject: 'Auto Claim #SF-2026-1184723 - Documentation Needed',
        date: 'Feb 18, 2026',
        body: `Dear James Wilson,

Thank you for filing your auto insurance claim. We are processing your request and need the following documentation to proceed:

  Claim Number: SF-2026-1184723
  Policy Number: ***-***-8891
  Date of Incident: February 15, 2026
  Vehicle: 2021 Ford F-150

DOCUMENTS NEEDED:
  1. Photographs of all vehicle damage (minimum 4 angles)
  2. Copy of the police report (Report #CPD-2026-021547)
  3. Estimate from an authorized repair facility

Please upload documents through your State Farm account or email them to claims@statefarm.com within 10 business days.

Your assigned adjuster is Michael Torres. He can be reached at (312) 555-0267.

Thank you for choosing State Farm.`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'jw-005',
        from: 'Netflix <info@mailer.netflix.com>',
        subject: 'New sign-in to your Netflix account',
        date: 'Feb 16, 2026',
        body: `Hi James,

We noticed a new sign-in to your Netflix account.

  Device: Samsung Smart TV
  Location: Chicago, IL, United States
  Time: February 16, 2026 at 8:14 PM CST

If this was you, you can ignore this email.

If you didn't sign in, we recommend that you change your password immediately by visiting netflix.com/password.

Thanks,
The Netflix Team`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
    ],
  },
};

/**
 * Get WebMail data for a Level 2 victim.
 * @param {string} victimName - The victim's name from VICTIM_NAMES
 * @returns {object|null} WebMail data or null if not found
 */
export function getLevel2WebMail(victimName) {
  return WEBMAIL_DATA[victimName] || null;
}
