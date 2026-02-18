/**
 * FriendBook data for Level 5: CEO Fraud
 * Difficulty: Clues require cross-referencing multiple profiles
 *
 * Each victim has a unique scam variant:
 *   - Sarah Mitchell: vendor_payment_redirect (supplier banking details update)
 *   - Jennifer Walsh: acquisition_escrow (CEO impersonation — acquisition wire)
 *   - Amanda Price: executive_gift_card (CEO requests gift cards → Pierogi reveal)
 *
 * Intel requires piecing together information from CEO, VP, assistant,
 * and spouse profiles — no single post gives the full picture.
 */

const FRIENDBOOK_DATA = {

  // ─────────────────────────────────────────────
  // SARAH MITCHELL — vendor_payment_redirect
  // The player poses as a supplier's billing manager and redirects
  // an upcoming vendor payment to a fraudulent account.
  // ─────────────────────────────────────────────
  'Sarah Mitchell, CFO': {
    profiles: {
      sarah_mitchell: {
        name: 'Sarah Mitchell',
        portraitKey: 'l5_victim_2',
        isTarget: true,
        bio: 'CFO @ Nexus Dynamics | NYU Stern MBA | Numbers nerd, wine enthusiast, Central Park runner',
        location: 'New York, New York',
        birthday: 'September 12, 1986',
        relationship: 'Single',
        workplace: 'Nexus Dynamics — Chief Financial Officer',
        interests: ['Corporate Finance', 'Running', 'Wine Tasting', 'Broadway', 'Crossword Puzzles'],
        groups: ['NYC CFO Roundtable', 'NYU Stern Alumni Network', 'Central Park Runners Club'],
        checkIns: ['Nexus Dynamics HQ — Midtown', 'Blue Bottle Coffee', 'Central Park'],
        friends: ['robert_chen', 'priya_kapoor', 'mark_torres']
      },
      robert_chen: {
        name: 'Robert Chen',
        portraitKey: 'fb_l5_robert_chen',
        isTarget: false,
        bio: 'CEO @ Nexus Dynamics | Building the future of enterprise logistics | Stanford GSB',
        location: 'New York, New York',
        birthday: 'April 3, 1979',
        relationship: 'Married to Diana Chen',
        workplace: 'Nexus Dynamics — Chief Executive Officer',
        interests: ['Entrepreneurship', 'Golf', 'Scotch', 'Aviation', 'Japanese Culture'],
        groups: ['YPO — Young Presidents Organization', 'Stanford GSB Alumni', 'TechCrunch Disrupt Speakers'],
        checkIns: ['Nexus Dynamics HQ — Midtown', 'Narita International Airport', 'The Peninsula Tokyo'],
        friends: ['sarah_mitchell', 'priya_kapoor', 'mark_torres']
      },
      priya_kapoor: {
        name: 'Priya Kapoor',
        portraitKey: 'fb_l5_priya_kapoor',
        isTarget: false,
        bio: 'VP of Operations @ Nexus Dynamics | Supply chain geek | Two cats named Debit and Credit',
        location: 'New York, New York',
        birthday: 'March 15, 1984',
        relationship: 'Married to Ravi Kapoor',
        workplace: 'Nexus Dynamics — Vice President of Operations',
        interests: ['Supply Chain Management', 'Cats', 'Bollywood', 'Crosswords', 'Cooking'],
        groups: ['Nexus Dynamics Leadership Team', 'NYC Supply Chain Professionals', 'NYU Stern Alumni Network'],
        checkIns: ['Nexus Dynamics HQ — Midtown', 'Trader Joe\'s — Union Square', 'Adda Indian Canteen'],
        friends: ['sarah_mitchell', 'robert_chen', 'mark_torres']
      },
      mark_torres: {
        name: 'Mark Torres',
        portraitKey: 'fb_l5_mark_torres',
        isTarget: false,
        bio: 'VP of Sales @ Nexus Dynamics | Closing deals and missing my kids\' soccer games',
        location: 'New York, New York',
        birthday: 'July 29, 1981',
        relationship: 'Married to Angela Torres',
        workplace: 'Nexus Dynamics — Vice President of Sales',
        interests: ['Sales Strategy', 'Golf', 'Coaching Youth Soccer', 'Craft Beer'],
        groups: ['Nexus Dynamics Leadership Team', 'NYC Sales Leaders Network', 'Westchester Youth Soccer'],
        checkIns: ['Nexus Dynamics HQ — Midtown', 'The Capital Grille', 'Westchester Country Club'],
        friends: ['robert_chen', 'sarah_mitchell', 'priya_kapoor']
      }
    },
    posts: {
      sarah_mitchell: [
        {
          text: 'Three years at Nexus Dynamics today! Still remember my first day when the fire alarm went off and I thought it was a hazing ritual. Turns out it was just Mark burning popcorn in the break room. Here\'s to many more years of controlled chaos.',
          time: '2 days ago',
          likes: 87,
          comments: [
            { author: 'robert_chen', text: 'Happy 3rd anniversary Sarah! Best hire I ever made. The finance team was a mess before you came in and whipped everyone into shape. Here\'s to the next 3!' },
            { author: 'sarah_mitchell', text: 'Thanks Bob! Though I recall YOU were the one who approved that Q2 budget in crayon on a napkin' },
            { author: 'robert_chen', text: 'It was a NICE napkin' },
            { author: 'mark_torres', text: 'That popcorn incident was ONE TIME. Happy anniversary Sarah!' }
          ],
          intel: null
        },
        {
          text: 'Monday morning 6am run in Central Park. Nothing like nearly getting hit by a cyclist to really wake you up before a board prep week.',
          time: '4 days ago',
          likes: 23,
          comments: [
            { author: 'mark_torres', text: 'Board prep week = caffeine IV drip week' }
          ],
          intel: null
        },
        {
          text: 'Just finished the most satisfying spreadsheet of my career. 47 tabs. Color coded. Linked formulas across every sheet. I need a life.',
          time: '1 week ago',
          likes: 34,
          comments: [
            { author: 'priya_kapoor', text: 'Can I steal your template? My supplier tracking sheet looks like a crime scene.' },
            { author: 'sarah_mitchell', text: 'Only if you share your vendor contact list. We still need to sort out the Apex wire setup before the 15th.' },
            { author: 'priya_kapoor', text: 'Deal. I\'ll send the Apex details over. Same wire format as last quarter?' },
            { author: 'sarah_mitchell', text: 'Yep, the usual wire setup. Bob signs off, I execute. Easy.' }
          ],
          intel: { key: 'PAYMENT_PROCESS', value: 'Wire payments go through Sarah after CEO sign-off; standard format each quarter' }
        },
        {
          text: 'Great panel at the CFO Roundtable this morning. Talked about managing vendor relationships during rapid growth. Timely, given everything with our supply chain expansion.',
          time: '1 week ago',
          likes: 41,
          comments: [
            { author: 'priya_kapoor', text: 'Did they cover payment fraud? I just did a whole training on vendor impersonation for my team. Scary stuff.' },
            { author: 'sarah_mitchell', text: 'Briefly. Honestly most of our vendors have been with us so long, I recognize their voices on the phone. Hard to fake that.' }
          ],
          intel: null
        }
      ],
      robert_chen: [
        {
          text: 'Congrats to Sarah Mitchell on her 3rd anniversary at Nexus Dynamics. When I hired her, three other companies were trying to poach her. Luckily, I\'m very persuasive (and we offered stock options).',
          time: '2 days ago',
          likes: 94,
          comments: [
            { author: 'sarah_mitchell', text: 'It was the stock options' },
            { author: 'robert_chen', text: 'Ouch' },
            { author: 'mark_torres', text: 'For the record, I also tried to recruit her. She chose finance over sales. Questionable judgment.' }
          ],
          intel: null
        },
        {
          text: 'Quarterly check-in with the leadership team. Priya\'s operations numbers are stellar. The Apex Industrial renewal is a big win for our supply chain stability. Proud of this team.',
          time: '5 days ago',
          likes: 76,
          comments: [
            { author: 'priya_kapoor', text: 'Thanks Bob! The Apex renewal was a beast to negotiate but we got great terms. 3-year lock-in.' },
            { author: 'sarah_mitchell', text: 'The wire setup is straightforward too. Priya got them to simplify the payment terms. Less paperwork for me for once.' },
            { author: 'robert_chen', text: 'That\'s what I like to hear. Sarah, just loop me in before you send the first payment under the new terms.' },
            { author: 'sarah_mitchell', text: 'Already on my list Bob. Payment\'s due next week.' }
          ],
          intel: { key: 'SUPPLIER_CONTRACT', value: 'Apex Industrial supplier contract just renewed for 3 years; first payment under new terms due next week' }
        },
        {
          text: 'Nothing like a 14-hour flight to catch up on reading. Halfway through "The Art of War" for the fifth time. Still finding new insights.',
          time: '5 days ago',
          likes: 38,
          comments: [
            { author: 'mark_torres', text: 'Maybe try a novel sometime Bob. Not everything has to be a strategy manual.' },
            { author: 'robert_chen', text: 'Novels don\'t close deals, Mark.' }
          ],
          intel: null
        },
        {
          text: 'Good people make good companies. Sarah runs finance like clockwork, Priya has operations humming, Mark is breaking sales records. My job is basically just drinking coffee and signing things at this point.',
          time: '1 week ago',
          likes: 58,
          comments: [
            { author: 'sarah_mitchell', text: 'You absolutely do more than that. But I appreciate the coffee budget.' },
            { author: 'priya_kapoor', text: 'The CEO who admits his team does the real work. Rare breed.' }
          ],
          intel: { key: 'CEO_SARAH_DYNAMIC', value: 'Robert trusts Sarah deeply with finances; describes her as running finance "like clockwork"' }
        }
      ],
      priya_kapoor: [
        {
          text: 'Finally closed the Apex Industrial contract renewal! 8 months of negotiations, 47 emails, 12 calls, and one very awkward dinner where I accidentally called their CEO by the wrong name. But we got the deal done. 3-year commitment, better terms, and simplified billing. Operations win!',
          time: '3 days ago',
          likes: 63,
          comments: [
            { author: 'sarah_mitchell', text: 'You called him "Steve" didn\'t you' },
            { author: 'priya_kapoor', text: 'His name is Stuart and I will never live it down' },
            { author: 'mark_torres', text: 'Congrats Priya! Apex is our biggest supplier. This is huge.' },
            { author: 'robert_chen', text: 'Outstanding work. Sarah, let\'s get the first payment queued up. The old banking details should still work but double-check with Apex\'s billing team — new contract might mean new account info.' },
            { author: 'sarah_mitchell', text: 'On it. I\'ll confirm wire details with their billing department this week.' }
          ],
          intel: null
        },
        {
          text: 'Debit knocked my coffee off the desk. Credit watched from the windowsill with zero sympathy. Cats have no respect for supply chain professionals.',
          time: '5 days ago',
          likes: 45,
          comments: [
            { author: 'sarah_mitchell', text: 'You named your cats Debit and Credit and you\'re surprised they have no loyalty?' },
            { author: 'priya_kapoor', text: 'They\'re perfectly balanced cats. One earns, one spends. Just like accounting.' }
          ],
          intel: null
        },
        {
          text: 'Vendor management tip: build real relationships with your suppliers\' billing teams. When things go sideways — and they always do — knowing the people on the other end of the wire makes all the difference. Apex\'s billing manager Brenda and I are basically best friends at this point.',
          time: '1 week ago',
          likes: 29,
          comments: [
            { author: 'sarah_mitchell', text: 'Brenda is great. She always picks up on the first ring. Makes payment processing so much smoother.' },
            { author: 'priya_kapoor', text: 'Right? And she always confirms wire details by phone before we send. Old school but it works.' }
          ],
          intel: null
        },
        {
          text: 'Quarterly operations review done. Presented to the board this morning. Apex renewal was the headline. Bob looked genuinely pleased, which is rare. The payment schedule is locked in — first wire goes out next Wednesday under the new terms.',
          time: '1 day ago',
          likes: 37,
          comments: [
            { author: 'mark_torres', text: 'Next Wednesday? Sarah, you ready?' },
            { author: 'sarah_mitchell', text: 'Ready. Just waiting on final wire confirmation from Apex\'s end.' }
          ],
          intel: { key: 'PAYMENT_DUE_DATE', value: 'First wire under the new Apex contract goes out next Wednesday; Sarah is waiting on wire confirmation' }
        }
      ],
      mark_torres: [
        {
          text: 'Crunch time at the office. Third late night this week. Priya\'s Apex deal is done so now the rest of us are playing catch-up. Angela is going to kill me if I miss another soccer game.',
          time: '2 days ago',
          likes: 18,
          comments: [
            { author: 'priya_kapoor', text: 'Don\'t blame my deal for your poor time management, Torres.' },
            { author: 'sarah_mitchell', text: 'Almost there Mark. Once I get the Apex payment sorted this week we can all breathe.' }
          ],
          intel: null
        },
        {
          text: 'Closed the Pemberton account today. Biggest Q4 deal on the books. Robert sent me a one-word text: "Finally." That\'s CEO praise in Bob-speak.',
          time: '1 week ago',
          likes: 45,
          comments: [
            { author: 'robert_chen', text: 'I also sent a thumbs up emoji. That\'s practically a standing ovation from me.' },
            { author: 'sarah_mitchell', text: 'He once told me "not bad" after I saved us $2M in tax liability. High praise indeed.' }
          ],
          intel: null
        },
        {
          text: 'Lunch with the leadership team. Priya was talking about vendor payment security protocols and Sarah glazed over within 30 seconds. "I\'ve been doing wires for 15 years, Priya, I know the drill." The finance-ops rivalry is the best thing about this company.',
          time: '4 days ago',
          likes: 29,
          comments: [
            { author: 'sarah_mitchell', text: 'In my defense, she was explaining what a wire transfer is. To a CFO. With an MBA.' },
            { author: 'priya_kapoor', text: 'I was explaining the NEW SECURITY PROTOCOL. Which you then ignored.' },
            { author: 'sarah_mitchell', text: 'I skimmed it!' },
            { author: 'robert_chen', text: 'Sarah. Read the protocol. Please.' }
          ],
          intel: null
        },
        {
          text: 'Monday motivation: We\'re one big payment away from locking in the best supplier terms Nexus has ever had. Priya and Sarah are on it. The rest of us are just cheerleaders at this point.',
          time: '4 days ago',
          likes: 22,
          comments: [
            { author: 'sarah_mitchell', text: 'Cheerleaders who still haven\'t submitted their expense reports. Hint hint, Mark.' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'SUPPLIER_CONTRACT', boost: 15, description: 'Apex Industrial contract renewed; first payment under new terms due next week', category: 'business_context', callHint: 'Reference the Apex Industrial contract renewal and new payment terms to establish credibility as their billing contact', unlocks: [0, 1] },
      { key: 'CEO_SARAH_DYNAMIC', boost: 10, description: 'CEO trusts Sarah deeply, describes her as running finance "like clockwork"', category: 'relationship', callHint: 'Mirror the trust dynamic — Sarah is used to handling payments autonomously with minimal oversight', unlocks: [2] },
      { key: 'PAYMENT_PROCESS', boost: 8, description: 'Wires go through Sarah after CEO sign-off; same format each quarter', category: 'procedural', callHint: 'Reference the standard wire setup process and CEO sign-off to make the redirect request sound routine', unlocks: [3] },
      { key: 'PAYMENT_DUE_DATE', boost: 5, description: 'First wire goes out next Wednesday; Sarah is waiting on confirmation', category: 'urgency', callHint: 'Press that the new banking details must be updated before Wednesday\'s wire or the payment will bounce', unlocks: [4] }
    ]
  },

  // ─────────────────────────────────────────────
  // JENNIFER WALSH — acquisition_escrow
  // The player impersonates CEO Robert Chen calling from Singapore
  // to authorize a confidential escrow wire for the Meridian acquisition.
  // ─────────────────────────────────────────────
  'Jennifer Walsh, CFO': {
    profiles: {
      jennifer_walsh: {
        name: 'Jennifer Walsh',
        portraitKey: 'l5_victim_2',
        isTarget: true,
        bio: 'CFO @ Nexus Dynamics (West Coast ops) | Wharton MBA | Dog mom to two golden retrievers | SF native',
        location: 'San Francisco, California',
        birthday: 'March 7, 1981',
        relationship: 'Married to Kevin Walsh',
        workplace: 'Nexus Dynamics — Chief Financial Officer, West Coast Division',
        interests: ['Corporate Finance', 'Hiking', 'Golden Retrievers', 'Napa Wine Country', 'Podcast Junkie'],
        groups: ['SF Women in Finance', 'Wharton Alumni Bay Area', 'Golden Gate Kennel Club', 'Nexus Dynamics Leadership Team'],
        checkIns: ['Nexus Dynamics SF Office — SOMA', 'Dolores Park', 'Napa Valley'],
        friends: ['robert_chen_sf', 'lisa_chen', 'amy_nakamura']
      },
      robert_chen_sf: {
        name: 'Robert Chen',
        portraitKey: 'fb_l5_robert_chen',
        isTarget: false,
        bio: 'CEO @ Nexus Dynamics | Building the future of enterprise logistics | Stanford GSB',
        location: 'New York, New York',
        birthday: 'April 3, 1979',
        relationship: 'Married to Diana Chen',
        workplace: 'Nexus Dynamics — Chief Executive Officer',
        interests: ['Entrepreneurship', 'Golf', 'Scotch', 'Aviation', 'Japanese Culture'],
        groups: ['YPO — Young Presidents Organization', 'Stanford GSB Alumni', 'Bay Area Founders Network'],
        checkIns: ['Nexus Dynamics HQ — New York', 'Singapore Changi Airport', 'The Fullerton Hotel Singapore'],
        friends: ['jennifer_walsh', 'lisa_chen', 'amy_nakamura']
      },
      lisa_chen: {
        name: 'Lisa Chen',
        portraitKey: 'fb_l5_lisa_chen',
        isTarget: false,
        bio: 'Tech recruiter | Bobby\'s wife | Foodie | SF is the best city, fight me',
        location: 'San Francisco, California',
        birthday: 'October 14, 1984',
        relationship: 'Married to Robert Chen',
        workplace: 'Sequoia Talent Partners — Senior Recruiter',
        interests: ['Recruiting', 'Food Photography', 'Hiking', 'Reality TV', 'Dim Sum'],
        groups: ['SF Foodies', 'Women in Tech Recruiting', 'Chen Family Group Chat'],
        checkIns: ['Yank Sing — Dim Sum', 'Lands End Trail', 'Gary Danko Restaurant'],
        friends: ['robert_chen_sf', 'jennifer_walsh', 'amy_nakamura']
      },
      amy_nakamura: {
        name: 'Amy Nakamura',
        portraitKey: 'fb_l5_amy_nakamura',
        isTarget: false,
        bio: 'VP Sales @ Nexus Dynamics (West Coast) | Wharton \'03 with Jen | Trivia night champion',
        location: 'San Francisco, California',
        birthday: 'December 1, 1980',
        relationship: 'Married to Tom Nakamura',
        workplace: 'Nexus Dynamics — Vice President of Sales, West Coast',
        interests: ['Sales Strategy', 'Trivia', 'Hiking', 'Japanese Cooking', 'True Crime Podcasts'],
        groups: ['Wharton Alumni Bay Area', 'SF Trivia League', 'Nexus Dynamics Leadership Team'],
        checkIns: ['Nexus Dynamics SF Office — SOMA', 'Nopa Restaurant', 'The Interval at Long Now'],
        friends: ['jennifer_walsh', 'robert_chen_sf', 'lisa_chen']
      }
    },
    posts: {
      jennifer_walsh: [
        {
          text: 'Monday morning fog roll at Dolores Park with Biscuit and Waffles before heading to the office. Sometimes I think my dogs have a better work-life balance than I do.',
          time: '1 day ago',
          likes: 53,
          imageKey: 'fb_l5_post_dogs_dolores',
          comments: [
            { author: 'amy_nakamura', text: 'Biscuit and Waffles are living their best lives. Meanwhile I\'m staring at a pivot table.' },
            { author: 'jennifer_walsh', text: 'Don\'t even talk to me about pivot tables right now Amy' }
          ],
          intel: null
        },
        {
          text: 'Nothing like a Friday happy hour with the Nexus west coast team. We earned this one. It\'s been a WEEK.',
          time: '4 days ago',
          likes: 37,
          comments: [
            { author: 'robert_chen_sf', text: 'Wish I could join. Rain check when I\'m back from Singapore, Jen?' },
            { author: 'jennifer_walsh', text: 'You\'re buying, Chief. We\'ll hold you to it.' },
            { author: 'robert_chen_sf', text: 'Deal. You pick the place, I\'ll pick the wine.' }
          ],
          intel: null
        },
        {
          text: 'Wharton reunion next month! Can\'t wait to see the old crew. @AmyNakamura we still owe that bar in Philly an apology from 2003.',
          time: '1 week ago',
          likes: 28,
          comments: [
            { author: 'amy_nakamura', text: 'We agreed to never speak of that night! But yes I already booked my flight' }
          ],
          intel: null
        },
        {
          text: 'Serious question: does anyone else answer work calls from their CEO at 11pm or is that just a me thing? Love this job but boundaries, Bob. Boundaries.',
          time: '5 days ago',
          likes: 62,
          comments: [
            { author: 'robert_chen_sf', text: 'In my defense, Singapore is 15 hours ahead. It was 2pm here.' },
            { author: 'jennifer_walsh', text: 'You could\'ve emailed! You always call when it\'s "urgent" and half the time it\'s to ask about a spreadsheet column.' },
            { author: 'robert_chen_sf', text: 'The column WAS important. And you always pick up, which I appreciate.' },
            { author: 'lisa_chen', text: 'This is peak Bobby behavior. He calls me at midnight too. From airports.' }
          ],
          intel: null
        }
      ],
      robert_chen_sf: [
        {
          text: 'Singapore bound. Back-to-back meetings with the Meridian Holdings team. If the next 72 hours go as planned, Nexus Dynamics enters a new era. Focused and ready.',
          time: '3 days ago',
          likes: 98,
          comments: [
            { author: 'jennifer_walsh', text: 'The west coast finance team is ready! Bring it on.' },
            { author: 'amy_nakamura', text: 'Is this the deal that\'s going to be "transformative"? Because you\'ve been teasing for weeks, Bob.' },
            { author: 'robert_chen_sf', text: 'All I\'ll say is: clear your calendar Friday. Both of you.' },
            { author: 'lisa_chen', text: 'Bobby promised me dinner at Gary Danko when this deal closes. I\'m holding him to it.' }
          ],
          intel: { key: 'ACQUISITION_DEAL', value: 'Robert is in Singapore meeting Meridian Holdings; deal closes within 72 hours; Jennifer\'s team is involved' }
        },
        {
          text: 'Grateful to have a team that makes miracles happen on tight timelines. You know who you are. The Meridian wire needs legal sign-off and funding this week. I know you\'ll make it happen.',
          time: '2 days ago',
          likes: 67,
          comments: [
            { author: 'jennifer_walsh', text: 'We got it Bob. Already prepping the escrow paperwork on our end.' },
            { author: 'amy_nakamura', text: 'Sales team is standing by. The revenue projections from this deal are insane.' }
          ],
          intel: null
        },
        {
          text: 'Monday thought: The best deals are the ones where both sides walk away feeling like they won. Working toward exactly that this week in Singapore.',
          time: '6 days ago',
          likes: 54,
          comments: [
            { author: 'jennifer_walsh', text: 'This is why people follow you Bob. Also because you buy good coffee for the office.' },
            { author: 'robert_chen_sf', text: 'Leadership is 40% vision, 60% coffee budget.' }
          ],
          intel: null
        },
        {
          text: 'Nothing beats closing a deal in person. The Meridian team wants to finalize over dinner Friday night Singapore time. By the time SF wakes up Saturday, Nexus will be a very different company.',
          time: '1 day ago',
          likes: 71,
          comments: [
            { author: 'amy_nakamura', text: 'Does this mean the escrow has to be funded before Friday?' },
            { author: 'robert_chen_sf', text: 'Ideally by Thursday close of business your time. Jennifer and I are sorting the details.' }
          ],
          intel: null
        }
      ],
      lisa_chen: [
        {
          text: 'Bobby has been in Singapore for 3 days and I\'ve gotten exactly ONE text. "Hotel wifi is bad." Married to a CEO, everybody. At least the dog misses me.',
          time: '2 days ago',
          likes: 44,
          comments: [
            { author: 'jennifer_walsh', text: 'He\'s been texting ME plenty about work stuff. Sorry Lisa.' },
            { author: 'lisa_chen', text: 'Of course he has. He always calls Jen before me when he\'s traveling. She\'s his work wife at this point.' },
            { author: 'robert_chen_sf', text: 'I resent the "work wife" label. Jennifer is a valued colleague.' },
            { author: 'jennifer_walsh', text: 'I do also resent it. But also, it\'s kind of accurate.' }
          ],
          intel: { key: 'CEO_TRAVEL', value: 'Robert is in Singapore with bad hotel wifi; communicates with Jennifer by phone/text rather than email when traveling' }
        },
        {
          text: 'Sunday dim sum at Yank Sing. The har gow was transcendent. Sent Bobby photos at whatever ungodly hour it is in Singapore.',
          time: '4 days ago',
          likes: 33,
          imageKey: 'fb_l5_post_dim_sum',
          comments: [
            { author: 'amy_nakamura', text: 'That siu mai was unreal. We need to make this a weekly thing.' },
            { author: 'robert_chen_sf', text: 'I\'m eating a sad hotel breakfast. Thanks for this.' }
          ],
          intel: null
        },
        {
          text: 'Placed 3 senior engineers this week. One of them is going to a company Bobby\'s been keeping an eye on. He\'s going to text me about it in 3... 2... 1...',
          time: '4 days ago',
          likes: 21,
          comments: [
            { author: 'jennifer_walsh', text: 'Lisa you cannot recruit our engineers! We already talked about this!' },
            { author: 'lisa_chen', text: 'Relax Jen, I only recruit FOR Bobby\'s company, not FROM it. Mostly.' }
          ],
          intel: null
        },
        {
          text: 'Bobby called at 3am my time to tell me the Meridian deal is "looking really good." I said "that\'s wonderful, please never call me at 3am again." Marriage is compromise.',
          time: '1 day ago',
          likes: 57,
          comments: [
            { author: 'jennifer_walsh', text: 'He called me at 3am too. At least you got good news. He asked me to re-check the escrow account setup.' },
            { author: 'amy_nakamura', text: 'Your husband needs to discover the concept of timezones.' }
          ],
          intel: null
        }
      ],
      amy_nakamura: [
        {
          text: 'When your best friend from college becomes a CFO and suddenly can\'t come to trivia night because she\'s "preparing escrow documentation." Jen, I know you still remember every Friends episode. You can do both.',
          time: '3 days ago',
          likes: 39,
          comments: [
            { author: 'jennifer_walsh', text: 'Can\'t relate, Bob has me on standby for a wire that "has to be funded by Thursday"' },
            { author: 'amy_nakamura', text: 'By Thursday?? What happened to "deals take time"?' },
            { author: 'jennifer_walsh', text: 'Bob happened. He and the Meridian team want to close Friday Singapore time. So I need the escrow funded a day before. Classic Bob timeline.' }
          ],
          intel: { key: 'DEAL_DEADLINE', value: 'Escrow wire must be funded by Thursday COB Pacific; Meridian deal closing Friday Singapore time' }
        },
        {
          text: 'Quarter just ended and my sales numbers are the best they\'ve ever been. Jen owes me a celebratory dinner. And Bob owes the whole west coast team a bonus. Don\'t think I\'m not keeping track.',
          time: '5 days ago',
          likes: 48,
          comments: [
            { author: 'jennifer_walsh', text: 'Dinner yes. Bonus... talk to Bob.' },
            { author: 'robert_chen_sf', text: 'Amy, I literally just texted you a thumbs up. That is the bonus.' }
          ],
          intel: null
        },
        {
          text: 'Trivia night victory AGAIN. That\'s 6 weeks running. The Nakamura-Walsh dynasty continues. Well, it would if Walsh would actually show up. I carried this week.',
          time: '1 week ago',
          likes: 31,
          comments: [
            { author: 'jennifer_walsh', text: 'I was there in spirit! And by spirit I mean I was on a call with Bob at midnight about acquisition paperwork.' },
            { author: 'amy_nakamura', text: 'Acquisition paperwork on a Friday night? That man is relentless.' },
            { author: 'jennifer_walsh', text: 'Tell me about it. But it\'s a big deal. Literally. The biggest Nexus has ever done.' }
          ],
          intel: { key: 'ESCROW_PRECEDENT', value: 'This is the biggest acquisition Nexus has ever done; Jennifer is handling the escrow paperwork personally' }
        },
        {
          text: 'Told my husband I need a vacation. He said "you just had one in October." Sir, that was a WORK CONFERENCE. The hotel had fluorescent lighting. That is not a vacation.',
          time: '6 days ago',
          likes: 47,
          comments: [
            { author: 'lisa_chen', text: 'This is so relatable it hurts' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'ACQUISITION_DEAL', boost: 15, description: 'Robert is in Singapore for Meridian Holdings acquisition; deal closes within 72 hours', category: 'business_context', callHint: 'Reference the Meridian Holdings deal and Singapore meetings to establish context for the urgent escrow wire', unlocks: [0, 1] },
      { key: 'CEO_TRAVEL', boost: 10, description: 'Robert is in Singapore, communicates by phone/text, bad wifi, prefers calling Jennifer directly', category: 'relationship', callHint: 'Explain calling instead of emailing because hotel wifi is terrible — matches Robert\'s known behavior', unlocks: [2] },
      { key: 'ESCROW_PRECEDENT', boost: 8, description: 'Biggest acquisition Nexus has ever done; Jennifer handling escrow personally', category: 'procedural', callHint: 'Reference that Jennifer is already prepping the escrow paperwork to make the wire request seem like the next logical step', unlocks: [3] },
      { key: 'DEAL_DEADLINE', boost: 5, description: 'Escrow must be funded by Thursday COB; deal closes Friday Singapore time', category: 'urgency', callHint: 'Push the Thursday deadline — Meridian team finalizes Friday dinner in Singapore, funds must be in place before then', unlocks: [4] }
    ]
  },

  // ─────────────────────────────────────────────
  // AMANDA PRICE — executive_gift_card
  // The player impersonates CEO Robert Chen requesting gift cards
  // for a client appreciation dinner. Amanda is secretly Pierogi
  // the scambaiter — the call will trigger a mid-call reveal.
  // ─────────────────────────────────────────────
  'Amanda Price, CFO': {
    profiles: {
      amanda_price: {
        name: 'Amanda Price',
        portraitKey: 'l5_victim_2',
        isTarget: true,
        bio: 'CFO @ Nexus Dynamics (Northeast) | Marathon runner | Mom of 2 | Spreadsheets by day, running shoes by night',
        location: 'Boston, Massachusetts',
        birthday: 'November 22, 1984',
        relationship: 'Married to David Price',
        workplace: 'Nexus Dynamics — Chief Financial Officer, Northeast Division',
        interests: ['Corporate Finance', 'Marathon Running', 'Craft Coffee', 'Baking', 'Red Sox Baseball'],
        groups: ['Boston Athletic Association', 'Boston CFO Forum', 'Nexus Dynamics Leadership Team', 'Brookline Runners Club'],
        checkIns: ['Nexus Dynamics Boston Office — Seaport', 'George Howell Coffee', 'Charles River Esplanade'],
        friends: ['robert_chen_bos', 'meg_sullivan', 'david_price']
      },
      robert_chen_bos: {
        name: 'Robert Chen',
        portraitKey: 'fb_l5_robert_chen',
        isTarget: false,
        bio: 'CEO @ Nexus Dynamics | Building the future of enterprise logistics | Stanford GSB',
        location: 'New York, New York',
        birthday: 'April 3, 1979',
        relationship: 'Married to Diana Chen',
        workplace: 'Nexus Dynamics — Chief Executive Officer',
        interests: ['Entrepreneurship', 'Golf', 'Scotch', 'Aviation', 'Japanese Culture'],
        groups: ['YPO — Young Presidents Organization', 'Stanford GSB Alumni', 'Boston Business Alliance'],
        checkIns: ['Nexus Dynamics HQ — New York', 'Logan International Airport', 'The Langham Boston'],
        friends: ['amanda_price', 'meg_sullivan', 'david_price']
      },
      meg_sullivan: {
        name: 'Meg Sullivan',
        portraitKey: 'fb_l5_meg_sullivan',
        isTarget: false,
        bio: 'Executive Assistant to Robert Chen @ Nexus Dynamics | Keeping the chaos organized since 2019 | Cat lady',
        location: 'New York, New York',
        birthday: 'May 22, 1991',
        relationship: 'Single',
        workplace: 'Nexus Dynamics — Executive Assistant to CEO',
        interests: ['Event Planning', 'Cats', 'Reality TV', 'Organization Hacks', 'Brunch'],
        groups: ['NYC Executive Assistants Network', 'Nexus Dynamics HQ Social Committee', 'Cat Lovers NYC'],
        checkIns: ['Nexus Dynamics HQ — Midtown', 'The Smith — Midtown', 'Petco — Union Square'],
        friends: ['robert_chen_bos', 'amanda_price', 'david_price']
      },
      david_price: {
        name: 'David Price',
        portraitKey: 'fb_l5_david_price',
        isTarget: false,
        bio: 'Architect @ Finch & Associates | Building stuff since \'05 | Amanda\'s biggest fan and chief kid-wrangler',
        location: 'Boston, Massachusetts',
        birthday: 'August 15, 1983',
        relationship: 'Married to Amanda Price',
        workplace: 'Finch & Associates Architecture — Senior Architect',
        interests: ['Architecture', 'Woodworking', 'Cooking', 'Red Sox', 'Board Games'],
        groups: ['AIA Boston Chapter', 'Brookline Dads Group', 'Boston Board Gamers'],
        checkIns: ['Finch & Associates — Back Bay', 'Fenway Park', 'Home Depot — Brookline'],
        friends: ['amanda_price', 'robert_chen_bos', 'meg_sullivan']
      }
    },
    posts: {
      amanda_price: [
        {
          text: 'Promoted to CFO of the Northeast division!! Still feels surreal. Robert called me at 6am to tell me — classic Bob, couldn\'t even wait until business hours. I may have cried. Don\'t tell anyone.',
          time: '1 week ago',
          likes: 112,
          comments: [
            { author: 'david_price', text: 'SO proud of you Amanda. You deserve this more than anyone.' },
            { author: 'robert_chen_bos', text: 'Well earned, Amanda. The Northeast numbers have been stellar under your watch. Now go make them even better.' },
            { author: 'meg_sullivan', text: 'Congrats Amanda!! We sent champagne to the Boston office. Don\'t tell Bob I used his corporate card.' },
            { author: 'amanda_price', text: 'Meg you are the best. And Bob, I fully intend to make them better. Watch this space.' }
          ],
          intel: { key: 'AMANDA_NEW_ROLE', value: 'Amanda was just promoted to CFO of the Northeast division last week; eager to prove herself in the new role' }
        },
        {
          text: 'Finished my long run along the Charles this morning. 18 miles. Training for Boston in April. My legs hate me but my spreadsheets are waiting so no rest for the wicked.',
          time: '4 days ago',
          likes: 67,
          imageKey: 'fb_l5_post_running_charles',
          comments: [
            { author: 'robert_chen_bos', text: 'You\'re a machine, Amanda. I get winded walking to the coffee machine.' },
            { author: 'amanda_price', text: 'Classic Bob, sending inspirational quotes at 6am from the airport lounge and then complaining about walking' },
            { author: 'robert_chen_bos', text: 'Those quotes are MOTIVATIONAL and I stand by every one of them' }
          ],
          intel: null
        },
        {
          text: 'Baked 3 dozen cookies for the office because apparently that\'s what "team building" means when you\'re the new CFO. The analysts ate them all in 20 minutes. Finance people and free food. Name a better combo.',
          time: '3 days ago',
          likes: 52,
          imageKey: 'fb_l5_post_cookies_office',
          comments: [
            { author: 'david_price', text: 'You didn\'t save any for ME?' },
            { author: 'amanda_price', text: 'There are chocolate chip ones on the counter, drama queen' },
            { author: 'meg_sullivan', text: 'Amanda you are such a dear. When I brought cookies to the NY office last month Bob ate 12 before anyone else got any.' }
          ],
          intel: null
        },
        {
          text: 'Phone rang at 5:47am. It was Bob. "Quick question about the Q4 numbers." Bob, it is FIVE FORTY SEVEN. There is nothing quick about anything at 5:47am.',
          time: '2 days ago',
          likes: 78,
          comments: [
            { author: 'david_price', text: 'I heard you say "Hi Bob" in that voice that means someone is about to get yelled at politely' },
            { author: 'robert_chen_bos', text: 'To be fair, the numbers were important. And you DID answer. That\'s why you got promoted.' },
            { author: 'amanda_price', text: 'Because you call back 47 times if I don\'t! You\'re relentless.' },
            { author: 'meg_sullivan', text: 'He does the same thing to me. I\'ve started sleeping with my phone on silent. Don\'t tell him.' }
          ],
          intel: null
        }
      ],
      robert_chen_bos: [
        {
          text: 'Year-end client appreciation season is upon us. We have 14 top-tier clients in the Northeast alone. Need to make sure we get this right. Amanda, Meg — let\'s coordinate.',
          time: '3 days ago',
          likes: 45,
          comments: [
            { author: 'meg_sullivan', text: 'Already on it Bob. I\'m putting together the event plan for the NY dinner. Should I loop in the Boston office for theirs?' },
            { author: 'robert_chen_bos', text: 'Yes. Amanda, can you handle the Boston client dinner? Meg will coordinate the NY side.' },
            { author: 'amanda_price', text: 'On it. I haven\'t been looped in on the budget yet though — Meg, can you send me last year\'s numbers?' },
            { author: 'meg_sullivan', text: 'Sending now! Last year we did gift cards for the ones who couldn\'t make the dinner.' }
          ],
          intel: { key: 'CLIENT_APPRECIATION', value: 'Year-end client appreciation underway; Amanda handling Boston dinner but hasn\'t been looped in on details yet; gift cards used for absent clients' }
        },
        {
          text: '"Success is not final, failure is not fatal: it is the courage to continue that counts." — Churchill. Sending this to the team at 6am because they need to hear it this week.',
          time: '5 days ago',
          likes: 49,
          comments: [
            { author: 'amanda_price', text: 'Classic Bob, sending inspirational quotes at 6am from the airport lounge. Never change.' },
            { author: 'robert_chen_bos', text: 'I was actually at the gym. But the sentiment stands.' }
          ],
          intel: null
        },
        {
          text: 'Grateful for a leadership team that doesn\'t need hand-holding. Amanda has the Northeast financials locked down, Meg keeps headquarters running. Sometimes the CEO\'s job is just to stay out of the way.',
          time: '1 week ago',
          likes: 73,
          comments: [
            { author: 'amanda_price', text: 'Did you just call me competent on social media? I\'m screenshotting this for my performance review.' },
            { author: 'robert_chen_bos', text: 'Don\'t push it, Price.' },
            { author: 'meg_sullivan', text: 'I\'m framing mine.' }
          ],
          intel: null
        },
        {
          text: 'Boston client dinner next week is going to be important. Several of our biggest Northeast accounts. Amanda is running point. I\'ll fly in if the schedule allows. Let\'s make it count.',
          time: '1 day ago',
          likes: 38,
          comments: [
            { author: 'amanda_price', text: 'I\'ll have everything ready Bob. This is my first big client event as CFO. Not going to mess it up.' },
            { author: 'meg_sullivan', text: 'I\'ve booked the venue and the caterer on the NY side. Amanda, do you need anything from me for Boston?' },
            { author: 'amanda_price', text: 'I think I\'m good, but I\'ll reach out if something comes up. Thanks Meg!' }
          ],
          intel: null
        }
      ],
      meg_sullivan: [
        {
          text: 'Client appreciation season is my Super Bowl. 14 clients, 2 dinners (NY and Boston), gift baskets, gift cards for the no-shows, and Bob just casually added 3 more names to the list this morning. I love this chaos. I hate this chaos.',
          time: '2 days ago',
          likes: 41,
          comments: [
            { author: 'robert_chen_bos', text: 'Meg, you thrive in chaos. That\'s why I hired you.' },
            { author: 'meg_sullivan', text: 'I thrive on COFFEE and SPITE, Bob. Very different.' },
            { author: 'amanda_price', text: 'Wait, gift cards for the no-shows? Meg, can you fill me in on the gift card protocol? I\'m new to this whole client appreciation thing at the CFO level.' },
            { author: 'meg_sullivan', text: 'Sure! Usually Bob picks them up himself last minute, or whoever is closest to the store. It\'s super informal — no procurement paperwork. Just grab them, expense it later.' }
          ],
          intel: { key: 'PROCUREMENT_BYPASS', value: 'Gift card purchases for client appreciation are informal — no procurement paperwork, bought last-minute, expensed after the fact' }
        },
        {
          text: 'My cat Winston knocked my planner off the desk. All 47 sticky notes are now on the floor. If Bob calls asking about the client dinner timeline I\'m blaming the cat.',
          time: '4 days ago',
          likes: 55,
          comments: [
            { author: 'amanda_price', text: 'Winston is doing God\'s work. You need a day off Meg.' },
            { author: 'meg_sullivan', text: 'Day off? In CLIENT APPRECIATION SEASON? Amanda, sweet summer child. You\'ll learn.' }
          ],
          intel: null
        },
        {
          text: 'Venue confirmed for the NY dinner: The Smith Midtown, private dining room, next Thursday. Now just need to wrangle the Boston dinner details. Amanda, you\'re up!',
          time: '3 days ago',
          likes: 28,
          comments: [
            { author: 'amanda_price', text: 'I\'m looking at venues this week! When\'s the Boston dinner supposed to be?' },
            { author: 'meg_sullivan', text: 'Bob wants it Thursday or Friday. The sooner the better — some of these clients are traveling next week.' },
            { author: 'robert_chen_bos', text: 'Thursday if possible. And Amanda — make sure we have the gift cards ready for the clients who can\'t attend. We can\'t have anyone feel left out.' }
          ],
          intel: { key: 'EVENT_TONIGHT', value: 'Boston client dinner planned for this Thursday or Friday; gift cards needed immediately for clients who can\'t attend' }
        },
        {
          text: 'End of year wrap-up: 87 meetings coordinated, 14 client events planned, 300+ emails answered, and I only cried in the bathroom twice. Calling that a win.',
          time: '1 week ago',
          likes: 63,
          comments: [
            { author: 'robert_chen_bos', text: 'You are the backbone of this company, Meg. Seriously.' },
            { author: 'amanda_price', text: 'Only twice?? That\'s honestly impressive.' }
          ],
          intel: null
        }
      ],
      david_price: [
        {
          text: 'Finished the Hendersons\' kitchen renovation. 6 months of work, but that island turned out beautiful. Architecture is just adult Legos with more paperwork.',
          time: '2 days ago',
          likes: 35,
          imageKey: 'fb_l5_post_kitchen_renovation',
          comments: [
            { author: 'amanda_price', text: 'When are you going to renovate OUR kitchen? It\'s been 3 years of "I\'ll get to it."' },
            { author: 'david_price', text: 'The shoemaker\'s children go barefoot, honey.' }
          ],
          intel: null
        },
        {
          text: 'Amanda is on the phone AGAIN. Something about a "client dinner" and "gift cards." She just got promoted and is already working twice as hard. I\'m proud of her but also I miss my wife.',
          time: '1 day ago',
          likes: 27,
          comments: [
            { author: 'meg_sullivan', text: 'Sorry David! Client appreciation season is brutal. I\'ll try to let her off the hook earlier tonight.' },
            { author: 'amanda_price', text: 'David I swear if you post anything else about my work I am changing the wifi password.' }
          ],
          intel: null
        },
        {
          text: 'Saturday morning pancakes with the kids. Lily asked why Mommy is working on a Saturday. I said "because Mommy just got a big promotion and is very important." She asked if that means more cookies. The answer is yes.',
          time: '3 days ago',
          likes: 58,
          comments: [
            { author: 'amanda_price', text: 'Mommy IS very important. But also very grateful for pancake duty husband.' },
            { author: 'meg_sullivan', text: 'Lily has her priorities straight.' }
          ],
          intel: null
        },
        {
          text: 'Took the kids to Fenway for the first time. Lily was more interested in the cotton candy and Jake fell asleep by the 4th inning. Nailed it.',
          time: '1 week ago',
          likes: 72,
          imageKey: 'fb_l5_post_fenway_kids',
          comments: [
            { author: 'amanda_price', text: 'The photo of Jake sleeping with a hot dog in his hand is my new lock screen' },
            { author: 'robert_chen_bos', text: 'Parenting goals. Hope they had fun, David.' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'CLIENT_APPRECIATION', boost: 15, description: 'Year-end client appreciation underway; Amanda handling Boston dinner but hasn\'t been fully looped in; gift cards for absent clients', category: 'business_context', callHint: 'Reference the client appreciation dinner and the need for gift cards for clients who can\'t attend — Amanda already knows about the event', unlocks: [0, 1] },
      { key: 'AMANDA_NEW_ROLE', boost: 10, description: 'Amanda was just promoted to CFO last week; eager to prove herself and be helpful', category: 'relationship', callHint: 'Leverage her desire to make a good impression in her new role — she won\'t want to say no to the CEO\'s first personal request', unlocks: [2] },
      { key: 'PROCUREMENT_BYPASS', boost: 8, description: 'Gift card purchases are informal — no procurement, bought last-minute, expensed later', category: 'procedural', callHint: 'Reassure her this doesn\'t need to go through procurement — just grab them and expense it, like Meg said', unlocks: [3] },
      { key: 'EVENT_TONIGHT', boost: 5, description: 'Boston client dinner is Thursday or Friday; gift cards needed immediately', category: 'urgency', callHint: 'The dinner is THIS THURSDAY — there\'s no time to go through formal channels, she needs to pick them up now', unlocks: [4] }
    ]
  }
};

/**
 * Get FriendBook data for a Level 5 victim.
 * @param {string} victimName - The victim's name from VICTIM_NAMES (e.g., "Sarah Mitchell, CFO")
 * @returns {object|null} FriendBook data or null if not found
 */
export function getLevel5FriendBook(victimName) {
  return FRIENDBOOK_DATA[victimName] || null;
}

export { FRIENDBOOK_DATA as LEVEL5_DATA };
