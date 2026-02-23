/**
 * WebMail inbox data for Level 3: Tech Support Scam
 *
 * Each victim has 5 emails in their inbox. Most victims have 1 intel email;
 * Mike Rodriguez has 2 (SECURITY_ALERT + SENT_SPAM) since his scam variant
 * involves an email compromise with multiple indicators.
 *
 * Victims:
 *   Karen Thompson  -- NORTON_EXPIRY intel (Norton subscription expiry notice)
 *   Mike Rodriguez  -- SECURITY_ALERT intel (Gmail new sign-in alert)
 *                   -- SENT_SPAM intel (Gmail suspicious outbound activity)
 *   Tom Anderson    -- SUBSCRIPTION_CHARGE intel (CloudShield Pro billing)
 */

const WEBMAIL_DATA = {
  'Karen Thompson': {
    emails: [
      {
        id: 'kt-001',
        from: 'Norton LifeLock <no-reply@nortonlifelock.com>',
        subject: 'URGENT: Your Norton Protection Has Expired',
        date: 'Feb 19, 2026',
        body: `Dear Karen Thompson,

Your Norton 360 Standard subscription expired on January 28, 2026. Your device has been unprotected for 22 days.

DEVICE STATUS SUMMARY:
  Subscription: EXPIRED
  Last scan: January 26, 2026
  Threats found in last scan: 47 potential threats
  Real-time protection: INACTIVE
  Firewall status: DISABLED

Your device is currently at HIGH RISK. Without active protection, your personal files, passwords, and financial information are vulnerable to malware, ransomware, and identity theft.

RENEWAL OPTIONS:
  Norton 360 Standard (1 device): $49.99/year
  Norton 360 Deluxe (5 devices): $79.99/year

Auto-renewal failed because the payment method on file (Chase debit card ending 3347) was declined. Please update your payment information to restore protection immediately.

Renew now at my.norton.com/renew or call 1-800-745-6054.

Norton LifeLock - Protecting what matters most.`,
        isRead: false,
        folder: 'inbox',
        intel: { key: 'NORTON_EXPIRY', value: 'Norton expired Jan 28, last scan found 47 threats, device unprotected' },
      },
      {
        id: 'kt-002',
        from: 'Chase Bank <alerts@chase.com>',
        subject: 'Your debit card has been cancelled',
        date: 'Feb 2, 2026',
        body: `Dear Karen Thompson,

This is to confirm that your Chase Total Checking debit card ending in 3347 has been cancelled per your request on January 25, 2026.

Your new debit card ending in 6219 has been mailed and should arrive within 5-7 business days.

IMPORTANT: Any recurring payments linked to your old card (ending 3347) will need to be updated with the new card number. Please review your automatic payments to avoid service interruptions.

If you did not request this change, please call us immediately at 1-800-935-9935.

Thank you for banking with Chase.`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'kt-003',
        from: 'Brian Thompson <brian.t@datastreamsolutions.com>',
        subject: 'RE: your computer',
        date: 'Feb 18, 2026',
        body: `Karen,

OK I looked at the pop-ups you screenshotted and those are definitely adware. The "47 threats detected" one is FAKE -- it's a browser pop-up designed to scare you into clicking. DO NOT click "Scan Now" or "Fix Issues" or anything on those pop-ups.

The real problem is that without Norton running, you probably picked up some adware from a bad website or a sketchy download. The random tabs opening are a classic symptom.

I'll clean it up this weekend. In the meantime:
- Don't install anything
- Don't click any pop-ups, even if they look official
- Don't enter any passwords on sites you got redirected to
- Try to avoid using it for work stuff until I can look at it

I know you have the recital program to make. Use my laptop for that, it's on the desk in the office.

Love,
Brian`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'kt-004',
        from: 'Highlands Family Dental <appointments@highlandsfamilydental.com>',
        subject: 'Appointment Reminder - Lily Thompson',
        date: 'Feb 19, 2026',
        body: `Hi Karen,

This is a friendly reminder that Lily Thompson has an upcoming dental appointment:

  Date: Thursday, February 27, 2026
  Time: 3:30 PM
  Provider: Dr. Sarah Kim, DDS
  Type: Routine cleaning & exam

Please arrive 10 minutes early to complete any updated paperwork. If Lily has any changes to her medical history or medications, please let us know before the appointment.

Need to reschedule? Call us at (303) 555-0189 or reply to this email.

See you soon!
Highlands Family Dental
8742 S Colorado Blvd, Highlands Ranch, CO 80126`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'kt-005',
        from: 'Amazon <ship-confirm@amazon.com>',
        subject: 'Your Amazon order has been delivered',
        date: 'Feb 17, 2026',
        body: `Hello Karen,

Your package has been delivered!

  Order #112-4567891-2345678
  Item: Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 Qt
  Delivered: February 17, 2:34 PM
  Left at: Front door

Track your deliveries and manage orders at amazon.com/orders.

Thank you for shopping with Amazon!`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
    ],
  },

  'Mike Rodriguez': {
    emails: [
      {
        id: 'mr-001',
        from: 'Google <no-reply@accounts.google.com>',
        subject: 'Security alert: New sign-in from Lagos, Nigeria',
        date: 'Feb 22, 2026',
        body: `Mike Rodriguez,

We detected a new sign-in to your Google Account (m.rodriguez.autorepair@gmail.com).

  New sign-in
  Device: Unknown device
  Location: Lagos, Nigeria
  Time: Saturday, February 22, 2026, 10:47 AM (WAT)

If this was you, you can ignore this message. If this wasn't you, your account may be compromised.

REVIEW YOUR ACCOUNT ACTIVITY:
Visit myaccount.google.com/security-checkup to:
  - Change your password
  - Review recent security events
  - Check which devices have access to your account

If you believe your account has been compromised, change your password immediately and enable 2-Step Verification.

You received this email because Google detected unusual activity on your account.
Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043`,
        isRead: false,
        folder: 'inbox',
        intel: { key: 'SECURITY_ALERT', value: 'Unauthorized sign-in from Lagos, Nigeria at 10:47 AM Saturday' },
      },
      {
        id: 'mr-002',
        from: 'Google <no-reply@accounts.google.com>',
        subject: 'Suspicious activity: Messages sent from your account',
        date: 'Feb 22, 2026',
        body: `Mike Rodriguez,

We detected suspicious outbound activity on your Google Account (m.rodriguez.autorepair@gmail.com).

  ACTIVITY SUMMARY:
  47 messages were sent from your account between 10:47 AM and 11:23 AM (WAT) on Saturday, February 22, 2026.

  These messages were flagged because:
  - They were sent in rapid succession from an unrecognized device
  - Multiple recipients reported the messages as spam
  - The content did not match your typical email patterns

  SAMPLE RECIPIENTS AFFECTED:
  - ray.martinez@autopartsdirect.com
  - carmen.rodriguez@gmail.com
  - tony.rodriguez84@gmail.com
  - (and 44 others)

  The messages have been moved to your Sent folder. We recommend reviewing them and alerting your contacts that your account may have been compromised.

SECURE YOUR ACCOUNT:
  1. Change your password immediately
  2. Enable 2-Step Verification
  3. Review connected apps at myaccount.google.com/permissions
  4. Check for unauthorized forwarding rules in your Gmail settings

You received this email because Google detected unusual activity on your account.
Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043`,
        isRead: false,
        folder: 'inbox',
        intel: { key: 'SENT_SPAM', value: '47 spam emails sent to contacts including ray.martinez@autopartsdirect.com' },
      },
      {
        id: 'mr-003',
        from: 'Ray Martinez <ray.martinez@autopartsdirect.com>',
        subject: 'RE: Did you send this??',
        date: 'Feb 22, 2026',
        body: `Mike,

Hey man, I got a weird email from your address this morning asking me to "verify my identity" and click some link. Didn't click it but wanted to let you know. It looked like it came from your real Gmail, not a fake address.

A couple of the guys at the warehouse got the same thing. Jorge almost clicked it because he thought it was about the brake pad order from last week.

You might want to look into it. If your email got hacked, change your password ASAP. And let your other contacts know so nobody falls for it.

Let me know if you need anything. We're still on for that parts delivery Tuesday.

- Ray
Desert Auto Parts Direct
(602) 555-0318`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'mr-004',
        from: 'AutoZone Rewards <rewards@autozone.com>',
        subject: 'You earned 2,400 AutoZone Rewards points!',
        date: 'Feb 20, 2026',
        body: `Hi Mike!

Great news -- your recent purchases earned you 2,400 AutoZone Rewards points!

  RECENT ACTIVITY:
  Feb 18 - Brake rotors (pair), Duralast Gold  +800 pts
  Feb 18 - Brake pads, Duralast Gold           +600 pts
  Feb 19 - Motor oil, Mobil 1 5W-30 (5qt)      +400 pts
  Feb 19 - Oil filter, Fram Ultra Synthetic     +200 pts
  Feb 20 - Battery, DieHard Gold                +400 pts

  TOTAL POINTS BALANCE: 8,750 pts
  REWARD AVAILABLE: $20 off your next purchase of $50+

Redeem at checkout in-store or at autozone.com. Points expire December 31, 2026.

Thanks for choosing AutoZone!
AutoZone - Get in the Zone`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'mr-005',
        from: 'Carmen Rodriguez <carmen.rodriguez@gmail.com>',
        subject: 'Dinner Saturday + Diego wants to help with your computer',
        date: 'Feb 21, 2026',
        body: `Mike,

Don't forget dinner at mom's on Saturday. She's making birria and she said to tell you "no excuses this time." We need to be there by 5.

Also, Diego said he wants to come by the house Sunday to look at your email situation. He's worried about it and honestly so am I. If your business contacts are getting weird emails from your account, that's not good for the shop's reputation. Ray is understanding but not everyone will be.

Just let Diego help. I know you don't like asking the kids for tech stuff but he's literally studying computer science. This is what he does.

And PLEASE stop clicking "yes" on every pop-up that shows up on your computer. Diego says that's probably how this happened.

Love,
Carmen

P.S. Pick up tortillas on the way to mom's. The good ones from Fiesta Mart, not the grocery store ones.`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
    ],
  },

  'Tom Anderson': {
    emails: [
      {
        id: 'ta-001',
        from: 'CloudShield Pro <billing@cloudshieldpro.com>',
        subject: 'Payment Confirmation - CloudShield Pro Annual Subscription',
        date: 'Feb 19, 2026',
        body: `Thank you for your purchase!

ORDER CONFIRMATION

  Service: CloudShield Pro - Premium Security Suite
  Plan: Annual Subscription (auto-renewed from free trial)
  Amount: $399.00 USD
  Payment method: Visa ending 4821
  Transaction ID: CSP-2026-8847291
  Billing date: February 19, 2026
  Next renewal: February 19, 2027

YOUR SUBSCRIPTION INCLUDES:
  - Real-time threat protection
  - VPN service (unlimited bandwidth)
  - Password manager
  - Dark web monitoring
  - 24/7 premium support

Your free trial period ended on February 18, 2026, and your subscription has been automatically converted to a paid annual plan per the terms accepted at enrollment.

To manage your subscription or request cancellation, please call our billing support team at 1-888-247-0193. Cancellation requests must be made within 30 days of the billing date for a full refund.

Thank you for choosing CloudShield Pro.
CloudShield Pro, Inc.`,
        isRead: false,
        folder: 'inbox',
        intel: { key: 'SUBSCRIPTION_CHARGE', value: 'CloudShield Pro auto-renewed at $399/year, charged to Visa ending 4821' },
      },
      {
        id: 'ta-002',
        from: 'Rachel Anderson <rachel@andersoncreative.co>',
        subject: 'RE: What is CloudShield Pro??',
        date: 'Feb 19, 2026',
        body: `Tom,

I Googled "CloudShield Pro" and I can barely find anything about them. Their website looks like it was made in 10 minutes and the "About Us" page is full of stock photos. That is not a real company, Tom.

Do NOT call the number on that email or the pop-up. If they already charged the Visa, call the bank directly and dispute the charge. The number on the back of the card, not whatever number they gave you.

Also -- did you actually sign up for a free trial of something? Think back. Sometimes those things are buried in a software install, like when you click "Next, Next, Next" without reading.

I'll look at it tonight after Zoe goes to bed. Don't touch anything on the laptop until then.

Rachel

P.S. I moved $400 from savings to checking just in case they actually did charge us and it bounces. We can move it back once this is sorted.`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'ta-003',
        from: 'Minneapolis College of Art and Design <admissions@mcad.edu>',
        subject: 'MCAD Teen Summer Intensive - Registration Confirmation',
        date: 'Feb 15, 2026',
        body: `Dear Tom and Rachel Anderson,

Congratulations! We are pleased to confirm that Zoe Anderson has been accepted and registered for the MCAD Teen Summer Intensive program.

PROGRAM DETAILS:
  Program: Studio Art Intensive (Ages 14-17)
  Dates: June 16 - July 4, 2026 (3 weeks)
  Schedule: Monday - Friday, 9:00 AM - 4:00 PM
  Location: MCAD Main Campus, 2501 Stevens Ave, Minneapolis, MN 55404

TUITION AND FEES:
  Tuition: $2,800.00
  Materials fee: $175.00
  Registration fee: $50.00 (paid)
  TOTAL REMAINING: $2,975.00

  Payment schedule:
  - Deposit ($500): Due March 15, 2026
  - Balance ($2,475): Due May 15, 2026

Payment can be made online at mcad.edu/payment or by check mailed to the Admissions Office.

We're excited to have Zoe join us this summer! She showed exceptional promise in her portfolio submission.

Warm regards,
MCAD Admissions Office
Minneapolis College of Art and Design`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'ta-004',
        from: 'Xcel Energy <customerservice@xcelenergy.com>',
        subject: 'Your January Bill is Higher Than Usual',
        date: 'Feb 14, 2026',
        body: `Dear Tom Anderson,

We noticed your January 2026 energy bill is significantly higher than your typical usage.

  Account: ***-***-4178
  Billing period: January 1 - January 31, 2026
  Amount due: $287.43
  Your average bill (last 12 months): $158.20
  Difference: +$129.23 (81.7% higher)

POSSIBLE REASONS:
  - Extended cold snap in January (average temp 4 degrees F)
  - Increased heating due to extreme weather
  - New appliances or systems drawing additional power

If you recently installed a new furnace, it may draw more power during its initial break-in period. This is normal and usage should stabilize within 1-2 billing cycles.

Energy saving tips and budget billing options are available at xcelenergy.com/save.

Payment due: March 5, 2026

Thank you,
Xcel Energy`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
      {
        id: 'ta-005',
        from: 'Walt Anderson <walt.anderson53@aol.com>',
        subject: 'RE: computer problem',
        date: 'Feb 20, 2026',
        body: `Tom,

Your mother (God rest her) always said don't sign up for things you don't understand. I know you say you didn't sign up for this Cloud Shield thing but somewhere along the line you must have clicked something. That's how they get you.

In my day if someone tried to charge you $400 for something you didn't buy, you walked into the store and had a conversation. Can't do that with these computer companies.

My advice: call the credit card company (the number on the BACK of the card, not any number from the computer), tell them you didn't authorize it, and let them handle it. Don't call any number from a pop-up. That's how your uncle Jerry lost $2,000 to those phone scammers in 2019.

And for Pete's sake, next time you see a "free trial" on the computer, just close the window.

Love,
Dad

P.S. The VFW fish fry is this Friday. Bring Zoe. There's pie.`,
        isRead: true,
        folder: 'inbox',
        intel: null,
      },
    ],
  },
};

/**
 * Get WebMail data for a Level 3 victim.
 * @param {string} victimName - The victim's name from VICTIM_NAMES
 * @returns {object|null} WebMail data or null if not found
 */
export function getLevel3WebMail(victimName) {
  return WEBMAIL_DATA[victimName] || null;
}
