/**
 * FriendBook data for Level 5: CEO Fraud
 * Difficulty: Clues require cross-referencing multiple profiles
 *
 * The player impersonates Robert Chen, CEO of Nexus Dynamics.
 * Each victim is a CFO. The FriendBook profiles represent
 * the CEO's professional/personal network. The player pieces together:
 *   - Where the CEO is (traveling/unreachable)
 *   - Internal company details for convincing impersonation
 *   - Personal dynamics between CEO and CFO
 *   - The "Meridian acquisition" pretext for the wire transfer
 */

const FRIENDBOOK_DATA = {
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
        friends: ['robert_chen', 'diana_chen', 'mark_torres']
      },
      robert_chen: {
        name: 'Robert Chen',
        portraitKey: null,
        isTarget: false,
        bio: 'CEO @ Nexus Dynamics | Building the future of enterprise logistics | Stanford GSB',
        location: 'New York, New York',
        birthday: 'April 3, 1979',
        relationship: 'Married to Diana Chen',
        workplace: 'Nexus Dynamics — Chief Executive Officer',
        interests: ['Entrepreneurship', 'Golf', 'Scotch', 'Aviation', 'Japanese Culture'],
        groups: ['YPO — Young Presidents Organization', 'Stanford GSB Alumni', 'TechCrunch Disrupt Speakers'],
        checkIns: ['Nexus Dynamics HQ — Midtown', 'Narita International Airport', 'The Peninsula Tokyo'],
        friends: ['sarah_mitchell', 'diana_chen', 'mark_torres']
      },
      diana_chen: {
        name: 'Diana Chen',
        portraitKey: null,
        isTarget: false,
        bio: 'Yoga instructor | Plant mom | Trying to get my husband to take a real vacation for once',
        location: 'New York, New York',
        birthday: 'January 18, 1982',
        relationship: 'Married to Robert Chen',
        workplace: 'Sunrise Yoga Studio — Instructor & Co-Owner',
        interests: ['Yoga', 'Meditation', 'Indoor Plants', 'Cooking', 'Travel Photography'],
        groups: ['NYC Yoga Community', 'Upper East Side Moms', 'Plant Lovers NYC'],
        checkIns: ['Sunrise Yoga Studio', 'Whole Foods Market — Columbus Circle', 'JFK International Airport'],
        friends: ['robert_chen', 'sarah_mitchell', 'mark_torres']
      },
      mark_torres: {
        name: 'Mark Torres',
        portraitKey: null,
        isTarget: false,
        bio: 'VP of Sales @ Nexus Dynamics | Closing deals and missing my kids\' soccer games',
        location: 'New York, New York',
        birthday: 'July 29, 1981',
        relationship: 'Married to Angela Torres',
        workplace: 'Nexus Dynamics — Vice President of Sales',
        interests: ['Sales Strategy', 'Golf', 'Coaching Youth Soccer', 'Craft Beer'],
        groups: ['Nexus Dynamics Leadership Team', 'NYC Sales Leaders Network', 'Westchester Youth Soccer'],
        checkIns: ['Nexus Dynamics HQ — Midtown', 'The Capital Grille', 'Westchester Country Club'],
        friends: ['robert_chen', 'sarah_mitchell', 'diana_chen']
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
          intel: { key: 'CEO_CFO_DYNAMIC', value: 'Robert calls her Sarah, she calls him Bob; informal, joking relationship' }
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
            { author: 'diana_chen', text: 'Robert does the same thing but with flight itineraries lol' },
            { author: 'sarah_mitchell', text: 'We are both spreadsheet people. It\'s why it works!' }
          ],
          intel: null
        },
        {
          text: 'Great panel at the CFO Roundtable this morning. Talked about managing rapid-growth acquisitions. Timely, given... well, I can\'t say yet.',
          time: '1 week ago',
          likes: 41,
          comments: [
            { author: 'mark_torres', text: 'The suspense is killing me' },
            { author: 'robert_chen', text: '...' }
          ],
          intel: null
        }
      ],
      robert_chen: [
        {
          text: 'Wheels up to Tokyo. Two weeks of back-to-back meetings with the Tanaka Group. Big things on the horizon for Nexus Dynamics. Stay tuned.',
          time: '5 days ago',
          likes: 112,
          comments: [
            { author: 'diana_chen', text: 'Two weeks?! You said 10 days last time we talked about this!' },
            { author: 'robert_chen', text: 'The schedule expanded. I\'ll make it up to you.' },
            { author: 'mark_torres', text: 'When are you back from the Tanaka meetings? Need your sign-off on the Q1 deck before the board sees it.' },
            { author: 'robert_chen', text: 'Thursday at the latest. Just send it to my cell if you need me before then.' }
          ],
          intel: { key: 'CEO_LOCATION', value: 'Robert is in Tokyo for 2 weeks meeting with the Tanaka Group' }
        },
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
          text: 'Exciting times ahead for Nexus. Can\'t share details yet, but Q1 is shaping up to be transformative. The team has been working around the clock on this one.',
          time: '1 week ago',
          likes: 76,
          comments: [
            { author: 'mark_torres', text: 'Transformative is an understatement. Let\'s gooo' },
            { author: 'robert_chen', text: 'Keep it under wraps until the board signs off Thursday' },
            { author: 'sarah_mitchell', text: 'My spreadsheets are ready' }
          ],
          intel: { key: 'ACQUISITION_DETAIL', value: 'Big Q1 announcement pending board approval on Thursday' }
        },
        {
          text: 'Nothing like a 14-hour flight to catch up on reading. Halfway through "The Art of War" for the fifth time. Still finding new insights.',
          time: '5 days ago',
          likes: 38,
          comments: [
            { author: 'diana_chen', text: 'You promised you\'d watch that yoga documentary I sent you' },
            { author: 'robert_chen', text: 'Next flight. Promise.' }
          ],
          intel: null
        }
      ],
      diana_chen: [
        {
          text: 'Missing my hubby! Tokyo business trip week 2 and the apartment feels so empty. Even the plants look sad. Come home soon Robert!',
          time: '1 day ago',
          likes: 28,
          comments: [
            { author: 'mark_torres', text: 'He\'s been texting the sales team at 3am our time so he\'s definitely not sleeping either' },
            { author: 'diana_chen', text: 'Robert says the Tokyo deal closes this week, barely sleeping. I just want him home in one piece.' },
            { author: 'sarah_mitchell', text: 'We\'ll send him back soon Diana! Promise!' }
          ],
          intel: { key: 'URGENCY_CONTEXT', value: 'Tokyo deal closes this week, Robert is barely sleeping, working around the clock' }
        },
        {
          text: 'Morning yoga flow to start the week right. Teaching the 6am class all month since Robert isn\'t here to complain about the alarm.',
          time: '3 days ago',
          likes: 42,
          comments: [
            { author: 'sarah_mitchell', text: 'I should come to your class! Need something to calm my nerves this week' },
            { author: 'diana_chen', text: 'You\'re always welcome! First class free for Nexus people' }
          ],
          intel: null
        },
        {
          text: 'Attempted Robert\'s sushi recipe tonight. He would be horrified. The rice was crunchy. I\'m ordering takeout.',
          time: '5 days ago',
          likes: 56,
          comments: [
            { author: 'robert_chen', text: 'Please tell me you didn\'t use the good knife' },
            { author: 'diana_chen', text: '...define "good knife"' }
          ],
          intel: null
        },
        {
          text: 'Counting down the days until Robert is back. He promised a proper date night — no phones, no emails, no "just one quick call to the Tokyo office." I\'m holding him to it.',
          time: '6 days ago',
          likes: 31,
          comments: [],
          intel: null
        }
      ],
      mark_torres: [
        {
          text: 'Big things coming for Nexus! Q1 is going to be huge. Can\'t say more than that but if you know, you know.',
          time: '3 days ago',
          likes: 63,
          comments: [
            { author: 'sarah_mitchell', text: 'Mark. NDA. Remember the NDA.' },
            { author: 'mark_torres', text: 'I didn\'t say anything specific!' },
            { author: 'robert_chen', text: 'Mark.' },
            { author: 'mark_torres', text: '...shutting up now' }
          ],
          intel: null
        },
        {
          text: 'Crunch time at the office. Third late night this week. The things we do for transformative deals. Angela is going to kill me if I miss another soccer game.',
          time: '2 days ago',
          likes: 18,
          comments: [
            { author: 'diana_chen', text: 'Join the club. At least your spouse is in the same timezone.' },
            { author: 'sarah_mitchell', text: 'Almost there Mark. This week is the big push.' }
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
          text: 'Monday motivation: We\'re one board meeting away from Nexus Dynamics becoming a very different company. Thursday can\'t come fast enough.',
          time: '4 days ago',
          likes: 29,
          comments: [
            { author: 'sarah_mitchell', text: 'The wire protocol alone is going to be a marathon. Already prepping the accounts.' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'CEO_LOCATION', boost: 15, description: 'CEO is in Tokyo for Tanaka Group meetings' },
      { key: 'ACQUISITION_DETAIL', boost: 10, description: 'Big deal pending board approval Thursday' },
      { key: 'CEO_CFO_DYNAMIC', boost: 8, description: 'CEO and CFO have informal, joking relationship' },
      { key: 'URGENCY_CONTEXT', boost: 5, description: 'Tokyo deal closes this week, crunch time' }
    ]
  },

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
        portraitKey: null,
        isTarget: false,
        bio: 'CEO @ Nexus Dynamics | Building the future of enterprise logistics | Stanford GSB',
        location: 'New York, New York',
        birthday: 'April 3, 1979',
        relationship: 'Married to Diana Chen',
        workplace: 'Nexus Dynamics — Chief Executive Officer',
        interests: ['Entrepreneurship', 'Golf', 'Scotch', 'Aviation', 'Japanese Culture'],
        groups: ['YPO — Young Presidents Organization', 'Stanford GSB Alumni', 'Bay Area Founders Network'],
        checkIns: ['Nexus Dynamics HQ — New York', 'SFO International Airport', 'Gary Danko Restaurant'],
        friends: ['jennifer_walsh', 'lisa_chen', 'amy_nakamura']
      },
      lisa_chen: {
        name: 'Lisa Chen',
        portraitKey: null,
        isTarget: false,
        bio: 'Tech recruiter | Bobby\'s little sister | Foodie | SF is the best city, fight me',
        location: 'San Francisco, California',
        birthday: 'October 14, 1984',
        relationship: 'In a Relationship',
        workplace: 'Sequoia Talent Partners — Senior Recruiter',
        interests: ['Recruiting', 'Food Photography', 'Hiking', 'Reality TV', 'Dim Sum'],
        groups: ['SF Foodies', 'Women in Tech Recruiting', 'Chen Family Group Chat'],
        checkIns: ['Yank Sing — Dim Sum', 'Lands End Trail', 'Gary Danko Restaurant'],
        friends: ['robert_chen_sf', 'jennifer_walsh', 'amy_nakamura']
      },
      amy_nakamura: {
        name: 'Amy Nakamura',
        portraitKey: null,
        isTarget: false,
        bio: 'VP Operations @ Pacific Coast Bank | Wharton \'03 with Jen | Trivia night champion',
        location: 'San Francisco, California',
        birthday: 'December 1, 1980',
        relationship: 'Married to Tom Nakamura',
        workplace: 'Pacific Coast Bank — Vice President, Operations',
        interests: ['Banking', 'Trivia', 'Hiking', 'Japanese Cooking', 'True Crime Podcasts'],
        groups: ['Wharton Alumni Bay Area', 'SF Trivia League', 'Pacific Coast Bank Leadership'],
        checkIns: ['Pacific Coast Bank — FiDi', 'Nopa Restaurant', 'The Interval at Long Now'],
        friends: ['jennifer_walsh', 'robert_chen_sf', 'lisa_chen']
      }
    },
    posts: {
      jennifer_walsh: [
        {
          text: 'Monday morning fog roll at Dolores Park with Biscuit and Waffles before heading to the office. Sometimes I think my dogs have a better work-life balance than I do.',
          time: '1 day ago',
          likes: 53,
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
            { author: 'robert_chen_sf', text: 'Wish I could join. Rain check when I\'m back, Jen?' },
            { author: 'jennifer_walsh', text: 'You\'re buying, Chief. We\'ll hold you to it.' },
            { author: 'robert_chen_sf', text: 'Deal. You pick the place, I\'ll pick the wine.' }
          ],
          intel: { key: 'RELATIONSHIP_STYLE', value: 'Jennifer calls Robert "Chief" jokingly, he calls her "Jen"; relaxed rapport' }
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
            { author: 'robert_chen_sf', text: 'In my defense, it was only 8pm in my timezone' },
            { author: 'jennifer_walsh', text: 'You were in NEW YORK. Same timezone.' },
            { author: 'robert_chen_sf', text: '...I plead the fifth' },
            { author: 'lisa_chen', text: 'This is peak Bobby behavior honestly' }
          ],
          intel: null
        }
      ],
      robert_chen_sf: [
        {
          text: 'Exciting new chapter ahead for Nexus Dynamics. Can\'t share details yet, but the pieces are finally coming together. Grateful for an incredible team making this possible.',
          time: '3 days ago',
          likes: 98,
          comments: [
            { author: 'jennifer_walsh', text: 'The finance team is ready! Bring it on.' },
            { author: 'amy_nakamura', text: 'Is this the Meridian thing Jen can\'t talk about?' },
            { author: 'jennifer_walsh', text: 'AMY. Oh my god.' },
            { author: 'robert_chen_sf', text: 'I\'m going to pretend I didn\'t see that.' },
            { author: 'lisa_chen', text: 'lol Bobby your poker face is terrible even online' }
          ],
          intel: { key: 'DEAL_DETAILS', value: 'The deal involves Meridian; Jennifer is handling finance side' }
        },
        {
          text: 'Layover in SFO on the way to London. 3 hours to kill. Anyone free for a quick coffee in the international terminal? No? Just me and my carry-on then.',
          time: '5 days ago',
          likes: 41,
          comments: [
            { author: 'lisa_chen', text: 'Bobby finally visiting! Oh wait, it\'s just a layover on the way to London for that deal' },
            { author: 'robert_chen_sf', text: 'I\'ll make it up to you. Dinner at Gary Danko when I\'m back.' },
            { author: 'lisa_chen', text: 'I\'m holding you to that. Mom says hi btw.' },
            { author: 'jennifer_walsh', text: 'You were in MY city for 3 hours and didn\'t tell me??' },
            { author: 'robert_chen_sf', text: 'Jen it was 5am. I know you value sleep.' }
          ],
          intel: { key: 'CEO_TRAVEL', value: 'Robert is traveling to London for a deal; had SFO layover' }
        },
        {
          text: 'Monday thought: The best deals are the ones where both sides walk away feeling like they won. Working toward exactly that this week.',
          time: '6 days ago',
          likes: 54,
          comments: [
            { author: 'jennifer_walsh', text: 'This is why people follow you Bob. Also because you buy good coffee for the office.' },
            { author: 'robert_chen_sf', text: 'Leadership is 40% vision, 60% coffee budget.' }
          ],
          intel: null
        },
        {
          text: 'Grateful to have a team that makes miracles happen on tight timelines. You know who you are. The wire needs to go out this week and I know you\'ll make it happen.',
          time: '2 days ago',
          likes: 67,
          comments: [
            { author: 'jennifer_walsh', text: 'We got it Bob. Already on it.' }
          ],
          intel: null
        }
      ],
      lisa_chen: [
        {
          text: 'Bobby finally visiting! Oh wait, it\'s just a layover on the way to London for that deal. My brother everybody. Hasn\'t had a proper SF visit in 4 months. Mom is keeping count.',
          time: '5 days ago',
          likes: 33,
          comments: [
            { author: 'robert_chen_sf', text: 'I promise I\'ll come for a full weekend after this London thing wraps up. Tell Mom I love her.' },
            { author: 'lisa_chen', text: 'She says "love doesn\'t pay for dim sum" which I think means she wants you to take her to Yank Sing' },
            { author: 'amy_nakamura', text: 'Your brother is the CEO and he can\'t even plan a proper visit? Sounds about right for tech bros lol' }
          ],
          intel: null
        },
        {
          text: 'Sunday dim sum at Yank Sing. The har gow was transcendent. Bobby is missing out and I will be texting him photos at whatever ungodly hour it is in London.',
          time: '2 days ago',
          likes: 44,
          comments: [
            { author: 'amy_nakamura', text: 'That siu mai was unreal. We need to make this a weekly thing.' },
            { author: 'robert_chen_sf', text: 'I\'m eating a sad airport sandwich. Thanks for this.' }
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
          text: 'Happy birthday to the world\'s busiest big brother! Somewhere between London and a conference call, I hope you eat some cake. Love you Bobby!',
          time: '6 days ago',
          likes: 57,
          comments: [
            { author: 'robert_chen_sf', text: 'Thanks sis! No cake but the hotel sent up a very fancy fruit plate. Close enough.' },
            { author: 'jennifer_walsh', text: 'Happy birthday Bob! The SF office sent you a card. It\'s on your desk in NY whenever you surface.' }
          ],
          intel: null
        }
      ],
      amy_nakamura: [
        {
          text: 'When your best friend from college becomes a CFO and suddenly can\'t come to trivia night because she\'s "preparing wire transfer protocols." Jen, I know you still remember every Friends episode. You can do both.',
          time: '3 days ago',
          likes: 39,
          comments: [
            { author: 'jennifer_walsh', text: 'Can\'t relate, my boss has me on standby for a wire that "has to go out this week"' },
            { author: 'amy_nakamura', text: 'Your boss needs to learn about work-life balance' },
            { author: 'jennifer_walsh', text: 'He\'s in London right now and STILL calling me at midnight. That ship has sailed.' }
          ],
          intel: { key: 'TIMING_PRESSURE', value: 'Jennifer on standby for a wire transfer that must go out this week' }
        },
        {
          text: 'Pacific Coast Bank Q4 numbers are in and I am cautiously optimistic. Also my team brought donuts. Unrelated to my optimism but not hurting it.',
          time: '5 days ago',
          likes: 22,
          comments: [
            { author: 'jennifer_walsh', text: 'Donuts solve everything. Can you send some to our office?' }
          ],
          intel: null
        },
        {
          text: 'Trivia night victory AGAIN. That\'s 6 weeks running. The Nakamura-Walsh dynasty continues. Well, it would if Walsh would actually show up. I carried this week.',
          time: '1 week ago',
          likes: 31,
          comments: [
            { author: 'jennifer_walsh', text: 'I was there in spirit! And by spirit I mean I was on a call with London until 9pm.' },
            { author: 'amy_nakamura', text: 'London? Is this about that big deal?' },
            { author: 'jennifer_walsh', text: 'You know I can\'t talk about it. Stop fishing!' }
          ],
          intel: null
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
      { key: 'CEO_TRAVEL', boost: 15, description: 'CEO is in London for a deal (SFO layover)' },
      { key: 'DEAL_DETAILS', boost: 10, description: 'The deal involves "Meridian"' },
      { key: 'RELATIONSHIP_STYLE', boost: 8, description: 'CEO and CFO call each other Bob/Jen/Chief' },
      { key: 'TIMING_PRESSURE', boost: 5, description: 'Wire transfer must go out this week' }
    ]
  },

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
        friends: ['robert_chen_bos', 'karen_chen', 'david_price']
      },
      robert_chen_bos: {
        name: 'Robert Chen',
        portraitKey: null,
        isTarget: false,
        bio: 'CEO @ Nexus Dynamics | Building the future of enterprise logistics | Stanford GSB',
        location: 'New York, New York',
        birthday: 'April 3, 1979',
        relationship: 'Married to Diana Chen',
        workplace: 'Nexus Dynamics — Chief Executive Officer',
        interests: ['Entrepreneurship', 'Golf', 'Scotch', 'Aviation', 'Japanese Culture'],
        groups: ['YPO — Young Presidents Organization', 'Stanford GSB Alumni', 'Boston Business Alliance'],
        checkIns: ['Nexus Dynamics HQ — New York', 'Logan International Airport', 'Singapore Changi Airport'],
        friends: ['amanda_price', 'karen_chen', 'david_price']
      },
      karen_chen: {
        name: 'Karen Chen',
        portraitKey: null,
        isTarget: false,
        bio: 'Retired teacher | Proud mom & grandma | Wellesley, MA | My son runs a company and still can\'t make Sunday dinner',
        location: 'Wellesley, Massachusetts',
        birthday: 'May 8, 1953',
        relationship: 'Widowed',
        workplace: 'Wellesley Public Schools (retired 2018)',
        interests: ['Gardening', 'Cooking', 'Mahjong', 'Grandchildren', 'PBS Documentaries'],
        groups: ['Wellesley Garden Club', 'Wellesley Mahjong Ladies', 'Chen Family Group Chat'],
        checkIns: ['Wellesley Farmers Market', 'Roche Bros. Grocery', 'First Parish Church — Wellesley'],
        friends: ['robert_chen_bos', 'amanda_price', 'david_price']
      },
      david_price: {
        name: 'David Price',
        portraitKey: null,
        isTarget: false,
        bio: 'Architect @ Finch & Associates | Building stuff since \'05 | Amanda\'s biggest fan and chief kid-wrangler',
        location: 'Boston, Massachusetts',
        birthday: 'August 15, 1983',
        relationship: 'Married to Amanda Price',
        workplace: 'Finch & Associates Architecture — Senior Architect',
        interests: ['Architecture', 'Woodworking', 'Cooking', 'Red Sox', 'Board Games'],
        groups: ['AIA Boston Chapter', 'Brookline Dads Group', 'Boston Board Gamers'],
        checkIns: ['Finch & Associates — Back Bay', 'Fenway Park', 'Home Depot — Brookline'],
        friends: ['amanda_price', 'robert_chen_bos', 'karen_chen']
      }
    },
    posts: {
      amanda_price: [
        {
          text: 'Big week ahead! Not allowed to say more but if all goes well... let\'s just say I\'ll be running my next marathon with a very big smile.',
          time: '2 days ago',
          likes: 44,
          comments: [
            { author: 'david_price', text: 'The Meridian thing?' },
            { author: 'amanda_price', text: 'DAVID. What part of NDA do you not understand??' },
            { author: 'david_price', text: 'Sorry sorry sorry. "The unnamed thing." Better?' },
            { author: 'amanda_price', text: 'I am confiscating your FriendBook privileges' }
          ],
          intel: { key: 'ACQUISITION_INTEL', value: 'Amanda working on the Meridian deal this week; it\'s under NDA' }
        },
        {
          text: 'Finished my long run along the Charles this morning. 18 miles. Training for Boston in April. My legs hate me but my spreadsheets are waiting so no rest for the wicked.',
          time: '4 days ago',
          likes: 67,
          comments: [
            { author: 'robert_chen_bos', text: 'You\'re a machine, Amanda. I get winded walking to the coffee machine.' },
            { author: 'amanda_price', text: 'Classic Bob, sending inspirational quotes at 6am from the airport lounge and then complaining about walking' },
            { author: 'robert_chen_bos', text: 'Those quotes are MOTIVATIONAL and I stand by every one of them' }
          ],
          intel: { key: 'BOSS_PERSONALITY', value: 'Robert sends motivational quotes at 6am from airports; Amanda teases him about it' }
        },
        {
          text: 'Baked 3 dozen cookies for the office because apparently that\'s what "team building" means when you\'re the CFO. The analysts ate them all in 20 minutes. Finance people and free food. Name a better combo.',
          time: '1 week ago',
          likes: 52,
          comments: [
            { author: 'david_price', text: 'You didn\'t save any for ME?' },
            { author: 'amanda_price', text: 'There are chocolate chip ones on the counter, drama queen' },
            { author: 'karen_chen', text: 'Amanda you are such a dear. Robert never bakes for anyone.' }
          ],
          intel: null
        },
        {
          text: 'Phone rang at 5:47am. It was Bob. "Quick question about the Singapore numbers." Bob, it is FIVE FORTY SEVEN. There is nothing quick about anything at 5:47am.',
          time: '3 days ago',
          likes: 78,
          comments: [
            { author: 'david_price', text: 'I heard you say "Hi Bob" in that voice that means someone is about to get yelled at politely' },
            { author: 'robert_chen_bos', text: 'To be fair, the numbers were important. And you DID answer.' },
            { author: 'amanda_price', text: 'Because you call back 47 times if I don\'t! You\'re relentless.' }
          ],
          intel: null
        }
      ],
      robert_chen_bos: [
        {
          text: 'Singapore bound. Critical meetings this week with the Meridian team. If the next 72 hours go as planned, Nexus Dynamics enters a new era. Focused.',
          time: '4 days ago',
          likes: 89,
          comments: [
            { author: 'amanda_price', text: 'The Boston finance team is locked and loaded. We\'re ready on our end Bob.' },
            { author: 'karen_chen', text: 'Singapore?! Robert you were supposed to come to dinner this Sunday!' },
            { author: 'robert_chen_bos', text: 'Mom, I\'ll make it up to you. This is important.' },
            { author: 'david_price', text: 'Isn\'t your boss supposed to be in Singapore this week? @amanda_price' },
            { author: 'amanda_price', text: 'Yes David, that is literally what this post says.' }
          ],
          intel: { key: 'CEO_WHEREABOUTS', value: 'Robert is in Singapore for critical Meridian meetings; missed Sunday dinner' }
        },
        {
          text: '"Success is not final, failure is not fatal: it is the courage to continue that counts." — Churchill. Sending this to the team at 6am because they need to hear it this week.',
          time: '3 days ago',
          likes: 45,
          comments: [
            { author: 'amanda_price', text: 'Classic Bob, sending inspirational quotes at 6am from the airport lounge. Never change.' },
            { author: 'robert_chen_bos', text: 'I was actually in the hotel gym. But the sentiment stands.' },
            { author: 'karen_chen', text: 'Robert your father used to say the same kind of things. He would be so proud.' }
          ],
          intel: null
        },
        {
          text: 'Grateful for a leadership team that doesn\'t need hand-holding. Amanda has the financials locked down, the legal team is on standby, and operations is humming. Sometimes the CEO\'s job is just to stay out of the way.',
          time: '1 week ago',
          likes: 73,
          comments: [
            { author: 'amanda_price', text: 'Did you just call me competent on social media? I\'m screenshotting this for my performance review.' },
            { author: 'robert_chen_bos', text: 'Don\'t push it, Price.' }
          ],
          intel: null
        },
        {
          text: 'Layover in Tokyo on the way to Singapore. Only 2 hours but managed to find decent ramen in the terminal. The little wins matter.',
          time: '5 days ago',
          likes: 32,
          comments: [
            { author: 'david_price', text: 'Airport ramen? Bold move.' },
            { author: 'robert_chen_bos', text: 'Narita has surprisingly good options. Trust me on this.' }
          ],
          intel: null
        }
      ],
      karen_chen: [
        {
          text: 'Robert said he can\'t make Sunday dinner AGAIN. Something about Singapore and a "critical meeting." I told him his grandmother didn\'t come to this country so he could skip meatloaf.',
          time: '3 days ago',
          likes: 64,
          comments: [
            { author: 'david_price', text: 'Karen your meatloaf is worth canceling any meeting for. Isn\'t your boss supposed to be in Singapore this week? @amanda_price' },
            { author: 'amanda_price', text: 'He IS in Singapore, David. And yes Karen, I\'ll make sure he calls you when he lands.' },
            { author: 'karen_chen', text: 'Thank you Amanda. At least SOMEONE in that company has manners.' },
            { author: 'robert_chen_bos', text: 'Mom I can see this. I WILL call you. I promise.' }
          ],
          intel: null
        },
        {
          text: 'My son is too busy for email but apparently texts Amanda at all hours about work. At 5am, 11pm, weekends. I told him that\'s no way to treat people but he says "Amanda gets it, she\'s like me." Kids these days.',
          time: '1 day ago',
          likes: 38,
          comments: [
            { author: 'amanda_price', text: 'Karen he is NOT wrong. We are both insane workaholics. But I appreciate you defending my sleep schedule!' },
            { author: 'david_price', text: 'Can confirm, Amanda\'s phone buzzes at all hours. "Bob" is basically a third person in our marriage at this point.' },
            { author: 'karen_chen', text: 'David you are a saint for putting up with it.' }
          ],
          intel: { key: 'COMMUNICATION_PATTERN', value: 'Robert texts/calls Amanda at all hours rather than emailing when traveling' }
        },
        {
          text: 'Mahjong victory! Three games in a row. Dorothy says I\'m cheating but I\'m just that good. Some of us still have sharp minds even at 72.',
          time: '4 days ago',
          likes: 29,
          comments: [
            { author: 'robert_chen_bos', text: 'Mom you have always been the most competitive person I know. I got it from you.' },
            { author: 'karen_chen', text: 'Flattery won\'t make up for missing dinner, Robert.' }
          ],
          intel: null
        },
        {
          text: 'Beautiful day in Wellesley. Planted the last of the spring bulbs. Robert always helped me with the garden when he was little. Now he gardens spreadsheets instead. I suppose that\'s fine too.',
          time: '1 week ago',
          likes: 43,
          comments: [
            { author: 'amanda_price', text: 'This is the sweetest thing I\'ve read all week Karen' },
            { author: 'david_price', text: 'Karen we need to come help with the garden this weekend. I\'ll bring the kids.' }
          ],
          intel: null
        }
      ],
      david_price: [
        {
          text: 'Finished the Hendersons\' kitchen renovation. 6 months of work, but that island turned out beautiful. Architecture is just adult Legos with more paperwork.',
          time: '2 days ago',
          likes: 35,
          comments: [
            { author: 'amanda_price', text: 'When are you going to renovate OUR kitchen? It\'s been 3 years of "I\'ll get to it."' },
            { author: 'david_price', text: 'The shoemaker\'s children go barefoot, honey.' }
          ],
          intel: null
        },
        {
          text: 'Amanda has been on the phone since 6am. Something big happening at work. I know better than to ask. Last time I asked she said "it\'s a $47,000 wire transfer protocol, David" in a voice that meant "stop asking."',
          time: '1 day ago',
          likes: 27,
          comments: [
            { author: 'karen_chen', text: 'Robert is the same way. All secrets and phone calls. When he was 10 he was the same about his science fair project. Some things never change.' },
            { author: 'amanda_price', text: 'David I swear if you post anything else about my work I am changing the wifi password.' }
          ],
          intel: null
        },
        {
          text: 'Saturday morning pancakes with the kids. Lily asked why Mommy is working on a Saturday. I said "because Mommy is very important and very tired." She accepted this explanation.',
          time: '3 days ago',
          likes: 58,
          comments: [
            { author: 'amanda_price', text: 'Mommy IS very tired. But also very grateful for pancake duty husband.' },
            { author: 'karen_chen', text: 'You two are wonderful parents. And David your pancakes are excellent.' }
          ],
          intel: null
        },
        {
          text: 'Took the kids to Fenway for the first time. Lily was more interested in the cotton candy and Jake fell asleep by the 4th inning. Nailed it.',
          time: '1 week ago',
          likes: 72,
          comments: [
            { author: 'amanda_price', text: 'The photo of Jake sleeping with a hot dog in his hand is my new lock screen' },
            { author: 'robert_chen_bos', text: 'Parenting goals. Hope they had fun, David.' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'CEO_WHEREABOUTS', boost: 15, description: 'CEO is in Singapore for Meridian meetings' },
      { key: 'ACQUISITION_INTEL', boost: 10, description: 'The deal is Meridian, under NDA, closing this week' },
      { key: 'BOSS_PERSONALITY', boost: 8, description: 'CEO sends 6am motivational quotes from airports' },
      { key: 'COMMUNICATION_PATTERN', boost: 5, description: 'CEO texts/calls CFO at all hours instead of email' }
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
