/**
 * FriendBook data for Level 4: Trust & Confidence Scams
 * Difficulty: Victim's own profile is SPARSE — intel is on OTHER people's profiles
 *
 * Each victim has a unique scam variant:
 *   - Linda Foster: debt_restructuring (Debt consolidation service)
 *   - Robert Kim: investment_opportunity (Investment / bond opportunity)
 *   - Patricia Martinez: customs_shipping_fee (International shipping / customs fee)
 *   - William Brooks: charity_matching (Disaster relief charity matching)
 *
 * Intel categories:
 *   - vulnerability (boost 15, unlocks [0,1]): Core emotional/financial situation — REVEALS THE SCAM ANGLE
 *   - specificity (boost 10, unlocks [2]): Concrete detail making the scam feel real
 *   - urgency (boost 8, unlocks [3]): Why acting NOW matters to them
 *   - trust_bridge (boost 5, unlocks []): Explains how you "found" them (call boost only)
 */

const FRIENDBOOK_DATA = {

  // ─────────────────────────────────────────────
  // LINDA FOSTER (56, Nashville TN, female)
  // Scam variant: debt_restructuring
  // ─────────────────────────────────────────────
  'Linda Foster': {
    profiles: {
      linda_foster: {
        name: 'Linda Foster',
        portraitKey: 'l4_victim_1',
        isTarget: true,
        bio: 'Nashville born and raised. Just me and Biscuit now.',
        location: 'Nashville, Tennessee',
        birthday: 'September 8, 1969',
        relationship: 'Divorced',
        workplace: 'Vanderbilt Medical Center - Billing Dept',
        interests: ['Sunsets', 'Cats', 'Country music'],
        groups: ['Nashville Rescue Cats'],
        checkIns: ['Centennial Park'],
        friends: ['tammy_crawford', 'dave_crawford', 'ashley_crawford']
      },
      tammy_crawford: {
        name: 'Tammy Crawford',
        portraitKey: 'fb_l4_tammy_crawford',
        isTarget: false,
        bio: 'Wife. Mom. Sister. Memphis girl with a big mouth and a bigger heart.',
        location: 'Memphis, Tennessee',
        birthday: 'April 17, 1973',
        relationship: 'Married to Dave Crawford',
        workplace: 'FedEx - Regional Office Manager',
        interests: ['Book clubs', 'Wine nights', 'Zumba', 'Gospel music', 'Cooking'],
        groups: ['Memphis Book Club', 'Women of Faith Memphis', 'Crawford Family'],
        checkIns: ['Beale Street', 'Corky\'s BBQ', 'FedEx Forum'],
        friends: ['linda_foster', 'dave_crawford', 'ashley_crawford']
      },
      dave_crawford: {
        name: 'Dave Crawford',
        portraitKey: 'fb_l4_dave_crawford',
        isTarget: false,
        bio: 'Long haul trucker. On the road more than I\'m home. Go Titans.',
        location: 'Memphis, Tennessee',
        birthday: 'January 30, 1971',
        relationship: 'Married to Tammy Crawford',
        workplace: 'Werner Enterprises - OTR Driver',
        interests: ['Football', 'Fishing', 'Truck restoration'],
        groups: ['Titans Nation', 'Truckers of America'],
        checkIns: ['Flying J Truck Stop', 'Bass Pro Shops'],
        friends: ['linda_foster', 'tammy_crawford', 'ashley_crawford']
      },
      ashley_crawford: {
        name: 'Ashley Crawford',
        portraitKey: 'fb_l4_ashley_crawford',
        isTarget: false,
        bio: '22 | UTK c/o 2026 | future nurse | coffee addict',
        location: 'Knoxville, Tennessee',
        birthday: 'July 2, 2003',
        relationship: 'Single',
        workplace: 'University of Tennessee - Nursing Student',
        interests: ['Nursing school', 'Coffee', 'Hiking', 'TikTok', 'Taylor Swift'],
        groups: ['UTK Nursing 2026', 'Smoky Mountain Hikers'],
        checkIns: ['Starbucks Knoxville', 'Great Smoky Mountains'],
        friends: ['linda_foster', 'tammy_crawford', 'dave_crawford']
      }
    },
    posts: {
      linda_foster: [
        {
          text: 'Pretty sunset tonight from the back porch. Biscuit and I just sat and watched it.',
          time: '3 days ago',
          likes: 4,
          imageKey: 'fb_l4_post_sunset_porch',
          comments: [
            { author: 'tammy_crawford', text: 'Beautiful sis. Call me later? Miss you.' }
          ],
          intel: null
        },
        {
          text: 'Happy 1 year gotcha day to my sweet Biscuit! Best decision I ever made going to that shelter.',
          time: '2 weeks ago',
          likes: 11,
          imageKey: 'fb_l4_post_biscuit_gotcha',
          comments: [
            { author: 'ashley_crawford', text: 'BISCUIT!! I love that little orange face!' },
            { author: 'tammy_crawford', text: 'Biscuit is the luckiest cat in Nashville. Love you Linda.' }
          ],
          intel: null
        }
      ],
      tammy_crawford: [
        {
          text: 'Lord give me patience. Trying to help Linda sort through bills over the phone. Greg cleaned out the savings before he left and she\'s been drowning ever since. He left her with ALL the debt — credit cards, the medical bills from Mama\'s last year, and that mortgage. She\'s too proud to ask for help but I can hear it in her voice. 3 years of this.',
          time: '5 days ago',
          likes: 14,
          comments: [
            { author: 'dave_crawford', text: 'Babe maybe don\'t put family stuff on here...' },
            { author: 'tammy_crawford', text: 'You\'re right. But I\'m so angry for her.' },
            { author: 'linda_foster', text: 'Tammy!! I told you I\'m handling it. Please take this down.' }
          ],
          intel: { key: 'DEBT_SITUATION', value: 'Ex-husband Greg left her with all the debt — credit cards, medical bills, mortgage. Struggling for 3 years since divorce.' }
        },
        {
          text: 'Book club tonight! Reading "Where the Crawdads Sing" finally. Better late than never!',
          time: '1 week ago',
          likes: 15,
          comments: [],
          intel: null
        },
        {
          text: 'Visited Linda and her rescue cat Biscuit this weekend! That orange tabby has her wrapped around his little paw. At least she has good company. She mentioned the credit card companies are calling every day now. I told her to look into one of those consolidation programs but she doesn\'t trust them. I don\'t blame her honestly.',
          time: '2 weeks ago',
          likes: 19,
          comments: [
            { author: 'ashley_crawford', text: 'Tell Biscuit I say pspspsp' },
            { author: 'linda_foster', text: 'He misses you already! Come back soon.' },
            { author: 'dave_crawford', text: 'Maybe check with that credit counseling place through her work? Vanderbilt has an employee assistance program I think.' }
          ],
          intel: { key: 'DEBT_TYPE', value: 'Credit card debt is the worst — companies calling daily. Tammy suggested consolidation but Linda doesn\'t trust them. Dave mentioned Vanderbilt employee assistance.' }
        },
        {
          text: 'Made Mama\'s cornbread recipe for the church potluck. Dave ate half the pan before I even left the house.',
          time: '3 weeks ago',
          likes: 34,
          comments: [
            { author: 'dave_crawford', text: 'No regrets.' }
          ],
          intel: null
        },
        {
          text: 'Thinking of my sis Linda today. 3 years since Greg walked out. She deserved so much better than that man. You are stronger than you know, sis. I love you.',
          time: '1 month ago',
          likes: 27,
          comments: [
            { author: 'dave_crawford', text: 'Greg never deserved her. Period.' },
            { author: 'ashley_crawford', text: 'Aunt Linda is the strongest woman I know.' }
          ],
          intel: null
        }
      ],
      dave_crawford: [
        {
          text: 'Another 2,000 miles down. Missing my girls back home. At least the sunsets out here on I-40 aren\'t bad.',
          time: '2 days ago',
          likes: 12,
          comments: [
            { author: 'tammy_crawford', text: 'Come home safe baby. Dinner will be waiting.' }
          ],
          intel: null
        },
        {
          text: 'Stopped by Linda\'s on my way through Nashville to check the gutters. House needs work but she won\'t ask for help. Found a letter from Discover Financial on the kitchen counter — something about a final notice. Didn\'t say anything but it worried me. Tammy and I are gonna have to step in whether she likes it or not.',
          time: '2 weeks ago',
          likes: 9,
          comments: [
            { author: 'tammy_crawford', text: 'Thank you baby. We need to talk about this. She can\'t ignore those letters.' }
          ],
          intel: { key: 'PAYMENT_DEADLINE', value: 'Final notice letter from Discover Financial on her counter. Dave thinks they need to intervene before it goes to collections.' }
        },
        {
          text: 'Titans game day! Who we got this year? Can\'t be worse than last season. ...right?',
          time: '1 month ago',
          likes: 22,
          comments: [],
          intel: null
        }
      ],
      ashley_crawford: [
        {
          text: 'Throwback to girls\' weekend in Gatlinburg with Mom and Aunt Linda. Miss those days so much. She\'s been so stressed lately. I overheard Mom telling Dad that Aunt Linda called crying last week because some debt collector threatened to put a lien on her house. I hate that she\'s going through this alone.',
          time: '5 days ago',
          likes: 16,
          imageKey: 'fb_l4_post_gatlinburg_weekend',
          comments: [
            { author: 'linda_foster', text: 'Oh honey don\'t you worry about me! Focus on school. I\'m so proud of you.' },
            { author: 'tammy_crawford', text: 'We need to plan another trip. All three of us. And Ashley Marie, we talked about not posting family business online.' }
          ],
          intel: { key: 'CREDITOR_REFERENCE', value: 'A debt collector threatened to put a lien on her house. Linda called Tammy crying about it.' }
        },
        {
          text: 'Survived my pharmacology midterm!! Treated myself to the biggest latte Starbucks can make.',
          time: '1 week ago',
          likes: 38,
          comments: [
            { author: 'tammy_crawford', text: 'That\'s my girl!! So proud!' }
          ],
          intel: null
        },
        {
          text: 'Hiking Clingmans Dome this weekend! Any trail buddies want to join?',
          time: '2 weeks ago',
          likes: 24,
          comments: [],
          intel: null
        },
        {
          text: 'Aunt Linda sent me a care package with homemade cookies and a handwritten note. I\'m NOT crying in the library right now. She\'s the sweetest person alive and she deserves better than what life has thrown at her.',
          time: '1 month ago',
          likes: 42,
          comments: [
            { author: 'tammy_crawford', text: 'That\'s my sister. Heart of gold.' },
            { author: 'linda_foster', text: 'Just a little something to keep you going sweetie!' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'DEBT_SITUATION', boost: 15, description: 'Greg left her with all the debt — drowning for 3 years', category: 'vulnerability', callHint: 'Reference her debt situation sympathetically to establish you know her case. Opens the debt consolidation pitch.', unlocks: [0, 1] },
      { key: 'DEBT_TYPE', boost: 10, description: 'Credit card debt is worst, companies calling daily', category: 'specificity', callHint: 'Mention credit card debt specifically and that creditors have been calling. Makes the consolidation offer feel targeted to her situation.', unlocks: [2] },
      { key: 'PAYMENT_DEADLINE', boost: 8, description: 'Final notice from Discover, threat of lien on house', category: 'urgency', callHint: 'Reference the final notice or collections timeline. Create urgency — "if we don\'t act before the lien is filed, your options narrow."', unlocks: [3] },
      { key: 'CREDITOR_REFERENCE', boost: 5, description: 'Debt collector threatened a lien on her house', category: 'trust_bridge', callHint: 'Claim your firm was flagged when her account came up in the creditor system. Explains how you got her number.', unlocks: [4] }
    ]
  },

  // ─────────────────────────────────────────────
  // ROBERT KIM (48, San Diego CA, male)
  // Scam variant: investment_opportunity
  // ─────────────────────────────────────────────
  'Robert Kim': {
    profiles: {
      robert_kim: {
        name: 'Robert Kim',
        portraitKey: 'l4_victim_2',
        isTarget: true,
        bio: 'Took early retirement from the firm. Figuring out what\'s next.',
        location: 'San Diego, California',
        birthday: 'March 22, 1977',
        relationship: 'Single',
        workplace: 'Retired - Former VP at Meridian Capital Partners',
        interests: ['Surfing', 'History books', 'Photography'],
        groups: ['San Diego Surfers'],
        checkIns: ['La Jolla Shores'],
        friends: ['daniel_kim', 'grace_kim', 'justin_kim']
      },
      daniel_kim: {
        name: 'Daniel Kim',
        portraitKey: 'fb_l4_daniel_kim',
        isTarget: false,
        bio: 'Tech entrepreneur. CEO @ BridgePoint Labs. Proud dad. Trying to be there for the people who matter.',
        location: 'Los Angeles, California',
        birthday: 'November 14, 1980',
        relationship: 'Married to Grace Kim',
        workplace: 'BridgePoint Labs - CEO & Founder',
        interests: ['Startups', 'AI', 'Running', 'Korean BBQ', 'Basketball'],
        groups: ['LA Tech Founders', 'Kim Family Group', 'UCLA Alumni'],
        checkIns: ['LAX', 'Staples Center', 'Kang Ho Dong Baekjeong'],
        friends: ['robert_kim', 'grace_kim', 'justin_kim']
      },
      grace_kim: {
        name: 'Grace Kim',
        portraitKey: 'fb_l4_grace_kim',
        isTarget: false,
        bio: 'Pediatrician at Children\'s Hospital LA. Mom to Justin. Coffee is a food group.',
        location: 'Los Angeles, California',
        birthday: 'June 5, 1982',
        relationship: 'Married to Daniel Kim',
        workplace: 'Children\'s Hospital Los Angeles - Pediatrician',
        interests: ['Medicine', 'Yoga', 'Cooking', 'K-dramas', 'Reading'],
        groups: ['CHLA Staff', 'LA Korean Moms', 'Kim Family Group'],
        checkIns: ['Children\'s Hospital LA', 'Whole Foods Los Feliz'],
        friends: ['robert_kim', 'daniel_kim', 'justin_kim']
      },
      justin_kim: {
        name: 'Justin Kim',
        portraitKey: 'fb_l4_justin_kim',
        isTarget: false,
        bio: '16 | junior year grind | surf + skate | lakers fan',
        location: 'Los Angeles, California',
        birthday: 'August 19, 2009',
        relationship: null,
        workplace: null,
        interests: ['Surfing', 'Skateboarding', 'Gaming', 'Lakers', 'Photography'],
        groups: ['LA Skate Crew', 'Pacific Surf Club Jr'],
        checkIns: ['Venice Beach', 'The Berrics'],
        friends: ['robert_kim', 'daniel_kim', 'grace_kim']
      }
    },
    posts: {
      robert_kim: [
        {
          text: 'Good morning from La Jolla. The ocean doesn\'t care about your portfolio. That\'s why I like it.',
          time: '4 days ago',
          likes: 12,
          comments: [
            { author: 'daniel_kim', text: 'Poetic. You should write a book, bro.' }
          ],
          intel: null
        },
        {
          text: 'Interesting article about municipal bonds in the Journal today. Old habits die hard.',
          time: '3 weeks ago',
          likes: 5,
          comments: [],
          intel: null
        }
      ],
      daniel_kim: [
        {
          text: 'Worried about Rob. He took early retirement from Meridian Capital last year — said he wanted his savings to "work for him" instead of the other way around. But he\'s just sitting on it. He keeps reading about bond yields and dividend strategies but won\'t pull the trigger on anything. Classic analysis paralysis. The man spent 20 years managing other people\'s money and now he\'s afraid to manage his own.',
          time: '3 days ago',
          likes: 18,
          comments: [
            { author: 'grace_kim', text: 'Honey, maybe talk to him privately instead of posting this?' },
            { author: 'daniel_kim', text: 'You\'re right. But it\'s been a year and he\'s barely earning interest on a savings account. It drives me crazy.' },
            { author: 'robert_kim', text: 'I can see this, Daniel.' }
          ],
          intel: { key: 'RETIREMENT_SAVINGS', value: 'Took early retirement from Meridian Capital. Has significant savings but won\'t invest — afraid to manage his own money after managing others\' for 20 years. Wants passive income.' }
        },
        {
          text: 'BridgePoint Labs just closed Series B! Grateful for this incredible team. Next stop: changing how hospitals handle patient data.',
          time: '2 weeks ago',
          likes: 203,
          comments: [
            { author: 'grace_kim', text: 'So proud of you!' },
            { author: 'robert_kim', text: 'Congratulations little brother. Genuinely proud.' }
          ],
          intel: null
        },
        {
          text: 'Sunday Korean BBQ with the fam. Even got Rob to drive up from San Diego. Justin challenged him to a meat-eating contest. It was ugly.',
          time: '3 weeks ago',
          likes: 45,
          comments: [
            { author: 'justin_kim', text: 'I won and nobody can tell me different' },
            { author: 'robert_kim', text: 'You absolutely did not win.' }
          ],
          intel: null
        },
        {
          text: 'Had lunch with Rob yesterday. He finally told me how much he\'s sitting on — between his Meridian severance, 401k rollover, and savings, the man has almost $800K just collecting dust in a checking account. He said his old colleague Marcus Chen at Pacific Ridge Advisors keeps calling him about some bond fund but he doesn\'t know if he trusts anyone in the industry anymore. I get it. But $800K in a CHECKING account, Rob? Come on.',
          time: '1 month ago',
          likes: 11,
          comments: [
            { author: 'grace_kim', text: 'Daniel! You cannot post people\'s financial details online!' },
            { author: 'daniel_kim', text: 'Okay okay deleting soon. But SOMEONE needs to talk sense into him.' }
          ],
          intel: { key: 'SAVINGS_AMOUNT', value: 'Has nearly $800K between severance, 401k, and savings sitting in a checking account. Old colleague Marcus Chen at Pacific Ridge Advisors has been trying to reach him.' }
        },
        {
          text: 'Lakers courtside tonight! Perks of closing a funding round. Justin is losing his mind.',
          time: '5 weeks ago',
          likes: 67,
          comments: [
            { author: 'justin_kim', text: 'BEST. DAD. EVER.' }
          ],
          intel: null
        }
      ],
      grace_kim: [
        {
          text: 'Robert called Daniel last night pretty upset. Said he watched that Netflix documentary about retirees losing everything to inflation and it hit close to home. He keeps saying "I should be DOING something with this money" but he\'s paralyzed. Daniel told him about index funds but Rob wants something more structured. I think he just misses having someone tell him what to do — 20 years at a firm does that to you.',
          time: '1 week ago',
          likes: 14,
          comments: [
            { author: 'daniel_kim', text: 'He needs a financial advisor. A real one. Not Marcus.' },
            { author: 'grace_kim', text: 'Agreed. Someone independent. Not someone trying to sell him a product.' }
          ],
          intel: { key: 'MARKET_WINDOW', value: 'Watched a documentary about retirees losing savings to inflation — now anxious. Feels he\'s missing out and should be investing but is paralyzed. Afraid of falling behind.' }
        },
        {
          text: 'Long shift at CHLA but seeing kids get better makes it all worth it. Came home to Daniel and Justin making "dinner" which was just four kinds of ramen combined into one pot.',
          time: '4 days ago',
          likes: 33,
          comments: [
            { author: 'daniel_kim', text: 'It was FUSION cuisine' },
            { author: 'justin_kim', text: 'It was actually really good tho' }
          ],
          intel: null
        },
        {
          text: 'Justin\'s photography is getting really good. He gets it from his Uncle Rob. Those two bonding over cameras has been the best thing for both of them.',
          time: '3 weeks ago',
          likes: 28,
          comments: [],
          intel: null
        },
        {
          text: 'Family yoga in the park. Daniel lasted 12 minutes. Justin lasted 8. Robert actually stayed the whole class. Progress.',
          time: '1 month ago',
          likes: 41,
          comments: [
            { author: 'daniel_kim', text: '12 minutes is generous, my legs gave out at 9' }
          ],
          intel: null
        }
      ],
      justin_kim: [
        {
          text: 'Uncle Rob took me surfing at La Jolla today! He was telling me about how his old work buddy Marcus keeps bugging him about some investment thing. He said "everyone wants a piece when they think you\'re sitting on money." I didn\'t really get it but he seemed annoyed. Anyway the waves were sick.',
          time: '5 days ago',
          likes: 34,
          imageKey: 'fb_l4_post_surfing_lajolla',
          comments: [
            { author: 'grace_kim', text: 'Glad you two had a good time!' },
            { author: 'daniel_kim', text: 'Marcus is pushy. Rob should just block him honestly.' }
          ],
          intel: { key: 'FRIEND_REFERRAL', value: 'Marcus Chen from Pacific Ridge Advisors keeps contacting Robert about investments. Robert\'s annoyed but hasn\'t blocked him — the name carries weight.' }
        },
        {
          text: 'New board!! Dad got me the Firewire for my birthday. Can\'t wait to take it out this weekend.',
          time: '2 weeks ago',
          likes: 29,
          imageKey: 'fb_l4_post_new_surfboard',
          comments: [
            { author: 'daniel_kim', text: 'Happy birthday champ!' }
          ],
          intel: null
        },
        {
          text: 'Shot some film photos at Venice today. Uncle Rob taught me about manual exposure last month and now I can\'t stop shooting everything.',
          time: '3 weeks ago',
          likes: 22,
          imageKey: 'fb_l4_post_film_photos_venice',
          comments: [
            { author: 'robert_kim', text: 'Your compositions are getting really good, Justin. Keep shooting.' }
          ],
          intel: null
        },
        {
          text: 'Lakers game with Dad tonight LET\'S GOOO',
          time: '5 weeks ago',
          likes: 18,
          comments: [],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'RETIREMENT_SAVINGS', boost: 15, description: 'Early retirement from Meridian Capital, sitting on savings, wants passive income', category: 'vulnerability', callHint: 'Reference his retirement and desire for passive income. Opens the investment pitch — "we specialize in structured income for recently retired professionals."', unlocks: [0, 1] },
      { key: 'SAVINGS_AMOUNT', boost: 10, description: 'Nearly $800K in a checking account, knows Marcus Chen at Pacific Ridge', category: 'specificity', callHint: 'Reference the scale of his holdings or the type of accounts. Makes the bond offering feel tailored to his bracket.', unlocks: [2] },
      { key: 'MARKET_WINDOW', boost: 8, description: 'Anxious about inflation eroding savings, fears missing out', category: 'urgency', callHint: 'Reference inflation risk and the limited allocation window. "Rates lock Friday — after that, the yield drops significantly."', unlocks: [3] },
      { key: 'FRIEND_REFERRAL', boost: 5, description: 'Marcus Chen at Pacific Ridge Advisors has been contacting him', category: 'trust_bridge', callHint: 'Claim to be calling on behalf of Marcus Chen or Pacific Ridge Advisors. Gives you an immediate in.', unlocks: [4] }
    ]
  },

  // ─────────────────────────────────────────────
  // PATRICIA MARTINEZ (62, Albuquerque NM, female)
  // Scam variant: customs_shipping_fee
  // ─────────────────────────────────────────────
  'Patricia Martinez': {
    profiles: {
      patricia_martinez: {
        name: 'Patricia Martinez',
        portraitKey: 'l4_victim_3',
        isTarget: true,
        bio: 'Abuela. Gardener. Missing my family.',
        location: 'Albuquerque, New Mexico',
        birthday: 'December 3, 1963',
        relationship: 'Widowed',
        workplace: 'Retired - Former school cafeteria manager',
        interests: ['Gardening', 'Cooking', 'Church'],
        groups: ['San Felipe de Neri Parish'],
        checkIns: ['Old Town Albuquerque'],
        friends: ['rosa_martinez_herrera', 'chris_herrera', 'marco_martinez']
      },
      rosa_martinez_herrera: {
        name: 'Rosa Martinez-Herrera',
        portraitKey: 'fb_l4_rosa_martinez_herrera',
        isTarget: false,
        bio: 'Marketing director by day, mom to baby Elena by night. Denver transplant from ABQ. Miss home.',
        location: 'Denver, Colorado',
        birthday: 'May 19, 1990',
        relationship: 'Married to Chris Herrera',
        workplace: 'Altitude Marketing Group - Director',
        interests: ['Marketing', 'Hiking', 'Photography', 'New Mexican food', 'Mommy blogs'],
        groups: ['Denver Working Moms', 'Martinez Family', 'ABQ Expats in Denver'],
        checkIns: ['Red Rocks', 'Casa Bonita', 'DIA'],
        friends: ['patricia_martinez', 'chris_herrera', 'marco_martinez']
      },
      chris_herrera: {
        name: 'Chris Herrera',
        portraitKey: 'fb_l4_chris_herrera',
        isTarget: false,
        bio: 'Restaurant guy. Dad to Elena. Trying to keep up with Rosa.',
        location: 'Denver, Colorado',
        birthday: 'October 11, 1988',
        relationship: 'Married to Rosa Martinez-Herrera',
        workplace: 'Rio Grande Cantina - General Manager',
        interests: ['Restaurants', 'Craft beer', 'Broncos', 'Grilling', 'Dadlife'],
        groups: ['Denver Restaurant Managers', 'Broncos Fans', 'Martinez Family'],
        checkIns: ['Rio Grande Cantina', 'Coors Field', 'Denver Beer Co'],
        friends: ['patricia_martinez', 'rosa_martinez_herrera', 'marco_martinez']
      },
      marco_martinez: {
        name: 'Marco Martinez',
        portraitKey: 'fb_l4_marco_martinez',
        isTarget: false,
        bio: 'Petroleum engineer. Living the expat life in Calgary. Miss you Mama.',
        location: 'Calgary, Alberta, Canada',
        birthday: 'August 25, 1986',
        relationship: 'Single',
        workplace: 'Suncor Energy - Senior Petroleum Engineer',
        interests: ['Hockey', 'Skiing', 'Cooking', 'Hiking', 'Cars'],
        groups: ['Suncor Calgary Team', 'New Mexicans Abroad', 'Martinez Family'],
        checkIns: ['Calgary International Airport', 'Banff National Park', 'Suncor Energy Centre'],
        friends: ['patricia_martinez', 'rosa_martinez_herrera', 'chris_herrera']
      }
    },
    posts: {
      patricia_martinez: [
        {
          text: 'My chile plants are coming in nicely this year. Miguel always said I had the best green chile in the neighborhood. I still grow enough for two.',
          time: '1 week ago',
          likes: 7,
          comments: [
            { author: 'rosa_martinez_herrera', text: 'Save some for us when we visit Mama! Elena needs to learn to love green chile early.' },
            { author: 'marco_martinez', text: 'Ship me some to Calgary!! I can\'t find real Hatch chile anywhere up here.' }
          ],
          intel: null
        },
        {
          text: 'Shared a recipe for posole on the church group page. Hope people try it. Nice to feel useful.',
          time: '3 weeks ago',
          likes: 3,
          comments: [],
          intel: null
        }
      ],
      rosa_martinez_herrera: [
        {
          text: 'Video called Mom tonight and she was showing me the box she\'s putting together for Marco in Calgary. His birthday is next week and she\'s been collecting things for months — homemade tamales, dried chile, a framed photo of Dad, and that little santo from the church she had blessed by Father Antonio. She\'s shipping it through that international courier service Marco used last time. She misses him SO much.',
          time: '2 days ago',
          likes: 24,
          comments: [
            { author: 'chris_herrera', text: 'Your mom is the sweetest woman alive.' },
            { author: 'marco_martinez', text: 'Rosaaaa don\'t tell me what\'s in it!! It\'s supposed to be a surprise! But also... I miss her too. So much.' },
            { author: 'patricia_martinez', text: 'Rosa! You ruined the surprise! Oh mija.' }
          ],
          intel: { key: 'RELATIVE_ABROAD', value: 'Son Marco lives in Calgary, Canada. Patricia is deeply attached and misses him terribly. She\'s shipping him a birthday care package through an international courier.' }
        },
        {
          text: 'Elena took her first steps today!! Of course it was toward the dog and not toward me or Chris. Priorities I guess.',
          time: '1 week ago',
          likes: 87,
          imageKey: 'fb_l4_post_baby_first_steps',
          comments: [
            { author: 'patricia_martinez', text: 'Oh my baby!! I wish I was there to see it! Send me the video!' },
            { author: 'chris_herrera', text: 'The dog was equally surprised' }
          ],
          intel: null
        },
        {
          text: 'Helped Mom with her bills this weekend over FaceTime. She says she\'s fine but Dad\'s pension barely covers everything. Property taxes went up again and she won\'t even consider selling the house. "Your father built this house, Rosa." I know Mama. I know.',
          time: '2 weeks ago',
          likes: 18,
          comments: [
            { author: 'chris_herrera', text: 'We can help more. Let\'s talk about it.' },
            { author: 'rosa_martinez_herrera', text: 'I know. She just won\'t accept money from us. Too proud.' }
          ],
          intel: null
        },
        {
          text: 'Mom walks to San Felipe church every single morning, rain or shine. 4 years of that routine since Dad passed. At least she has her faith and her community there. Father Antonio checks on her which I\'m grateful for.',
          time: '1 month ago',
          likes: 22,
          comments: [
            { author: 'patricia_martinez', text: 'Father Antonio is a good man. He reminds me of your father sometimes.' }
          ],
          intel: null
        }
      ],
      chris_herrera: [
        {
          text: 'Sunday brunch rush was insane. 200 covers before noon. I need a nap and a beer. In that order.',
          time: '2 days ago',
          likes: 15,
          comments: [
            { author: 'rosa_martinez_herrera', text: 'My hero. Bring home leftovers?' }
          ],
          intel: null
        },
        {
          text: 'Rosa\'s mom is stressing about the package she sent to Marco in Calgary. She used GlobalPost Express because Marco used them before and they delivered to his apartment. She called them twice already to check on the tracking. I told her it\'s fine — international shipping just takes time. But she\'s convinced something will go wrong. That package has like $200 worth of homemade food and a photo she can\'t replace.',
          time: '4 days ago',
          likes: 8,
          comments: [
            { author: 'rosa_martinez_herrera', text: 'She called me too. Three times. She\'s so worried it won\'t get there before his birthday on Friday.' },
            { author: 'marco_martinez', text: 'Tell Mama it\'s fine! GlobalPost always delivers. Even up here.' }
          ],
          intel: { key: 'COURIER_CONTEXT', value: 'Used GlobalPost Express for shipping. Already called them twice to check tracking. Marco has used them before. Package contains irreplaceable items.' }
        },
        {
          text: 'Elena discovered avocados today. She is OBSESSED. Future New Mexican confirmed.',
          time: '1 week ago',
          likes: 29,
          imageKey: 'fb_l4_post_baby_avocado',
          comments: [
            { author: 'patricia_martinez', text: 'Just like her mama! Rosa ate avocados at that age too.' }
          ],
          intel: null
        },
        {
          text: 'Broncos home opener this weekend. Who\'s got tickets? Need a guys\' day badly.',
          time: '3 weeks ago',
          likes: 11,
          comments: [],
          intel: null
        },
        {
          text: 'Tried to make Patricia\'s posole recipe. It was... not great. The woman is a wizard in the kitchen and I am a fraud.',
          time: '1 month ago',
          likes: 19,
          comments: [
            { author: 'rosa_martinez_herrera', text: 'Babe you used canned hominy. That\'s where you went wrong.' },
            { author: 'patricia_martinez', text: 'I\'ll teach you next time you visit mijo. It\'s all in the chile.' }
          ],
          intel: null
        }
      ],
      marco_martinez: [
        {
          text: 'Calgary life update: it\'s -25C and I\'m dreaming of green chile enchiladas. Miss you Mama. Miss Albuquerque. Miss the sun. At least the paycheck is good.',
          time: '3 days ago',
          likes: 21,
          comments: [
            { author: 'patricia_martinez', text: 'Come home mijo. There\'s always a plate for you.' },
            { author: 'rosa_martinez_herrera', text: 'You chose Canada, hermano. This is what you get.' }
          ],
          intel: null
        },
        {
          text: 'Sent Mama something special for her saint\'s day last month through GlobalPost. She called me crying when it arrived. Said it reminded her of Papa. I swear that woman\'s heart is bigger than all of New Mexico.',
          time: '1 week ago',
          likes: 31,
          comments: [
            { author: 'patricia_martinez', text: 'It\'s on my nightstand mijo. I look at it every night.' },
            { author: 'rosa_martinez_herrera', text: 'Okay NOW I\'m crying at work.' }
          ],
          intel: { key: 'SENDER_NAME', value: 'Marco Martinez in Calgary. He has sent packages to Patricia before via GlobalPost. She treasures everything he sends.' }
        },
        {
          text: 'Birthday is Friday! Rosa already accidentally told me what Mama is sending. But honestly I\'m just excited to get anything from home. Counting down the days. Hope the package makes it through customs okay — last time it got held up for 3 days because of the food items.',
          time: '5 days ago',
          likes: 17,
          comments: [
            { author: 'rosa_martinez_herrera', text: 'I said I was SORRY. And yeah customs was a pain last time but it got there eventually.' },
            { author: 'chris_herrera', text: 'Happy early birthday bro. Your mom has been packing that box for weeks.' }
          ],
          intel: { key: 'BIRTHDAY_PACKAGE', value: 'Marco\'s birthday is Friday. Package with homemade food may get held at customs — it happened before with food items. Patricia will panic if she hears there\'s a delay.' }
        },
        {
          text: 'Banff was incredible this weekend. Sometimes Canada reminds me why I stayed. Then Monday hits and I want to go home.',
          time: '2 weeks ago',
          likes: 26,
          imageKey: 'fb_l4_post_banff_hiking',
          comments: [],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'RELATIVE_ABROAD', boost: 15, description: 'Son Marco lives in Calgary, Canada — shipping him a birthday package', category: 'vulnerability', callHint: 'Establish that you\'re calling about a package addressed to Marco Martinez in Calgary. Her emotional attachment makes her desperate to resolve any issue.', unlocks: [0, 1] },
      { key: 'SENDER_NAME', boost: 10, description: 'Marco Martinez in Calgary, has received packages from her before', category: 'specificity', callHint: 'Use Marco\'s full name and Calgary address. Reference that this isn\'t the first shipment on the account — builds legitimacy.', unlocks: [2] },
      { key: 'BIRTHDAY_PACKAGE', boost: 8, description: 'Marco\'s birthday is Friday, customs held food items before', category: 'urgency', callHint: '"The package contains food items flagged by Canadian customs. If duties aren\'t paid by Thursday, it will be returned to sender and won\'t arrive for his birthday."', unlocks: [3] },
      { key: 'COURIER_CONTEXT', boost: 5, description: 'Uses GlobalPost Express, already called them twice about tracking', category: 'trust_bridge', callHint: 'Identify yourself as GlobalPost Express customs clearance department. She\'s already expecting a call back from them.', unlocks: [4] }
    ]
  },

  // ─────────────────────────────────────────────
  // WILLIAM BROOKS (53, Charlotte NC, male)
  // Scam variant: charity_matching
  // ─────────────────────────────────────────────
  'William Brooks': {
    profiles: {
      william_brooks: {
        name: 'William Brooks',
        portraitKey: 'l4_victim_4',
        isTarget: true,
        bio: 'CPA. Charlotte native. Quiet life.',
        location: 'Charlotte, North Carolina',
        birthday: 'February 14, 1972',
        relationship: 'Divorced',
        workplace: 'Brooks & Associates Accounting - Owner',
        interests: ['Sports', 'Grilling'],
        groups: ['Panthers Fans Charlotte'],
        checkIns: ['Duckworth\'s Grill & Taphouse'],
        friends: ['megan_brooks', 'tyler_brooks', 'steve_hendricks']
      },
      megan_brooks: {
        name: 'Megan Brooks',
        portraitKey: 'fb_l4_megan_brooks',
        isTarget: false,
        bio: '23 | just moved to Raleigh | marketing coordinator | dog mom to Pretzel',
        location: 'Raleigh, North Carolina',
        birthday: 'April 8, 2002',
        relationship: 'Single',
        workplace: 'Red Hat - Marketing Coordinator',
        interests: ['Marketing', 'Dogs', 'Brunch', 'Running', 'True crime podcasts'],
        groups: ['Raleigh Young Professionals', 'Red Hat New Hires 2025'],
        checkIns: ['Beasley\'s Chicken + Honey', 'Umstead State Park'],
        friends: ['william_brooks', 'tyler_brooks', 'steve_hendricks']
      },
      tyler_brooks: {
        name: 'Tyler Brooks',
        portraitKey: 'fb_l4_tyler_brooks',
        isTarget: false,
        bio: '20 | NC State engineering | wolfpack | building stuff',
        location: 'Raleigh, North Carolina',
        birthday: 'September 27, 2005',
        relationship: 'Single',
        workplace: 'NC State University - Mechanical Engineering',
        interests: ['Engineering', 'Gaming', 'Basketball', 'Cars', 'Wolfpack football'],
        groups: ['NC State Engineering 2027', 'Wolfpack Student Section'],
        checkIns: ['PNC Arena', 'Hunt Library NCSU'],
        friends: ['william_brooks', 'megan_brooks', 'steve_hendricks']
      },
      steve_hendricks: {
        name: 'Steve Hendricks',
        portraitKey: 'fb_l4_steve_hendricks',
        isTarget: false,
        bio: 'Sales director. Golf addict. Will\'s college buddy since \'92. Still trying to get this man to live a little.',
        location: 'Charlotte, North Carolina',
        birthday: 'June 3, 1971',
        relationship: 'Married to Paula Hendricks',
        workplace: 'Lowe\'s Corporate - Regional Sales Director',
        interests: ['Golf', 'Craft beer', 'Panthers football', 'Poker', 'Grilling'],
        groups: ['Charlotte Golf Club', 'UNC Charlotte Alumni', 'Panthers Season Ticket Holders'],
        checkIns: ['Quail Hollow Club', 'Bank of America Stadium', 'Whiskey Warehouse'],
        friends: ['william_brooks', 'megan_brooks', 'tyler_brooks']
      }
    },
    posts: {
      william_brooks: [
        {
          text: 'Thinking about Cedar Creek today. Hope everyone\'s okay out there.',
          time: '3 days ago',
          likes: 5,
          comments: [
            { author: 'steve_hendricks', text: 'Saw the news. Terrible. Your grandma\'s old place still standing?' },
            { author: 'william_brooks', text: 'Don\'t know. Can\'t reach Uncle Earl.' }
          ],
          intel: null
        },
        {
          text: 'Good game tonight.',
          time: '3 weeks ago',
          likes: 3,
          comments: [
            { author: 'steve_hendricks', text: 'Dude that\'s the most exciting thing you\'ve posted in 6 months. Really living on the edge, Will.' }
          ],
          intel: null
        }
      ],
      megan_brooks: [
        {
          text: 'Dad\'s been glued to the news about the flooding in Cedar Creek. That\'s where Grandma Brooks grew up and half the family still lives there. Uncle Earl and Aunt Dolores lost power three days ago and nobody can reach them. Dad donated to the Red Cross but I can tell he feels helpless. He grew up spending every summer there. He keeps saying "I wish I could do more." I wish I could do more too.',
          time: '2 days ago',
          likes: 31,
          comments: [
            { author: 'tyler_brooks', text: 'Dad called me at midnight about this. He sounded really shook. I\'ve never heard him like that.' },
            { author: 'steve_hendricks', text: 'Will is the kind of guy who feels everything and shows nothing. Cedar Creek is his heart.' },
            { author: 'william_brooks', text: 'I\'m fine. Just worried about Earl and Dolores.' }
          ],
          intel: { key: 'HOMETOWN_CONNECTION', value: 'Cedar Creek is his family\'s hometown. Flooding disaster — Uncle Earl and Aunt Dolores lost power and are unreachable. William feels helpless and deeply connected to the community.' }
        },
        {
          text: 'First week at Red Hat done!! Everyone is SO nice. Raleigh is growing on me. Pretzel already has a favorite park.',
          time: '1 week ago',
          likes: 52,
          comments: [
            { author: 'william_brooks', text: 'So proud of you Meggie.' },
            { author: 'tyler_brooks', text: 'Come to a State game!! Raleigh is great.' }
          ],
          intel: null
        },
        {
          text: 'Brunch at Beasley\'s is a religious experience. That fried chicken biscuit. I may never leave Raleigh.',
          time: '2 weeks ago',
          likes: 31,
          comments: [],
          intel: null
        },
        {
          text: 'Running my first 10K next month! Training in this heat is brutal but Pretzel is a great running buddy. Dad said he\'d come watch if he "can figure out the schedule." Classic Dad excuse but I love him.',
          time: '3 weeks ago',
          likes: 28,
          comments: [
            { author: 'steve_hendricks', text: 'I\'ll drag him there. Count on it.' }
          ],
          intel: null
        },
        {
          text: 'Happy Father\'s Day to the best dad in the world. Even when things were hard you never let us see it. You gave up so much for Tyler and me. We see it even if you think we don\'t. Love you Dad.',
          time: '2 months ago',
          likes: 44,
          comments: [
            { author: 'william_brooks', text: 'You two are the best thing I ever did. Love you both.' },
            { author: 'tyler_brooks', text: 'What Meg said. Love you Pops.' }
          ],
          intel: null
        }
      ],
      tyler_brooks: [
        {
          text: 'Dad sent me a link about volunteering in Cedar Creek this weekend. I think he wants to go but won\'t admit it. Uncle Earl finally called — he and Aunt Dolores are okay but their house took water damage. They\'re staying at Cedar Creek Baptist Church which is running a shelter. Dad said he\'s wiring money to the church\'s relief fund but I can tell it doesn\'t feel like enough for him.',
          time: '1 day ago',
          likes: 19,
          comments: [
            { author: 'megan_brooks', text: 'Of course Cedar Creek Baptist is running the shelter. That church is the backbone of that town. I\'m going to donate too.' },
            { author: 'steve_hendricks', text: 'Will called me about driving down there. I told him let\'s wait until the roads clear. He wasn\'t happy about it.' }
          ],
          intel: { key: 'AFFECTED_FAMILY', value: 'Uncle Earl and Aunt Dolores had water damage to their house. Staying at Cedar Creek Baptist Church shelter. William already sent money to the church relief fund.' }
        },
        {
          text: 'Wolfpack wins!! What a game! Student section was INSANE.',
          time: '2 weeks ago',
          likes: 41,
          comments: [
            { author: 'megan_brooks', text: 'Go Pack!!' }
          ],
          intel: null
        },
        {
          text: 'Engineering lab at 8am should be illegal. Who designed this schedule?? An enemy of humanity.',
          time: '3 weeks ago',
          likes: 33,
          comments: [],
          intel: null
        },
        {
          text: 'Built my first working robot arm in mechatronics lab today. It only crushed one soda can by accident. Calling that a win.',
          time: '1 month ago',
          likes: 27,
          imageKey: 'fb_l4_post_robot_arm',
          comments: [
            { author: 'william_brooks', text: 'That\'s my boy. Send me a video?' }
          ],
          intel: null
        }
      ],
      steve_hendricks: [
        {
          text: 'Will has barely slept since the Cedar Creek flooding started. He\'s been on the phone with everyone he can reach down there, coordinating with the church, looking up FEMA procedures. The man is a CPA running spreadsheets on disaster relief at 3am. I told him "you can\'t solve this with Excel, buddy." He said "watch me." That\'s Will Brooks for you. He\'d give the shirt off his back for Cedar Creek. Honestly I\'m worried he\'s going to drain his account trying to help everyone.',
          time: '1 day ago',
          likes: 42,
          comments: [
            { author: 'megan_brooks', text: 'This is so Dad. He won\'t take care of himself but he\'ll move mountains for other people.' },
            { author: 'william_brooks', text: 'Steve. Come on man. I\'m fine.' },
            { author: 'steve_hendricks', text: 'You\'re NOT fine. But you\'re a good man. Best I know.' }
          ],
          intel: { key: 'GUILT_EXPRESSION', value: 'Hasn\'t slept, running relief spreadsheets at 3am, calling everyone in Cedar Creek. Feels deeply guilty he isn\'t there. Would drain his account to help.' }
        },
        {
          text: 'Will brought up Cedar Creek Baptist Church at poker night. Said they\'re the only organization on the ground right now and they need donations badly. He matched everyone\'s contribution at the table. That\'s $600 he probably can\'t afford but try telling him that.',
          time: '3 days ago',
          likes: 29,
          comments: [
            { author: 'megan_brooks', text: 'Dad... please take care of yourself too.' },
            { author: 'tyler_brooks', text: 'That\'s our Pops.' }
          ],
          intel: { key: 'COMMUNITY_ORG', value: 'Cedar Creek Baptist Church is the main relief organization. William already donated $600 matching his poker buddies. The church is the focal point of the community.' }
        },
        {
          text: 'Shot a 78 at Quail Hollow today. My best round this year. Will was supposed to come but canceled last minute. Shocker.',
          time: '3 weeks ago',
          likes: 17,
          comments: [
            { author: 'william_brooks', text: 'I had client meetings. Next time.' },
            { author: 'steve_hendricks', text: 'You always have client meetings. On Saturday.' }
          ],
          intel: null
        },
        {
          text: 'Panthers tailgate this Sunday! Bringing the smoker, the cooler, and a very reluctant William Brooks. Who\'s in?',
          time: '1 month ago',
          likes: 22,
          comments: [
            { author: 'william_brooks', text: 'I didn\'t agree to this.' },
            { author: 'steve_hendricks', text: 'And yet you\'ll be there. With your brisket.' }
          ],
          intel: null
        },
        {
          text: 'Poker night at my place this Friday. Need 2 more. Will is bringing his sad accountant energy as usual.',
          time: '5 weeks ago',
          likes: 14,
          comments: [],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'HOMETOWN_CONNECTION', boost: 15, description: 'Cedar Creek flooding — family hometown, Uncle Earl and Aunt Dolores affected', category: 'vulnerability', callHint: 'Reference the Cedar Creek flooding and his family connection. Opens the charity matching pitch — "we\'re partnering with local organizations in affected areas."', unlocks: [0, 1] },
      { key: 'AFFECTED_FAMILY', boost: 10, description: 'Uncle Earl and Aunt Dolores at Cedar Creek Baptist Church shelter', category: 'specificity', callHint: 'Mention specific affected families or the church shelter. Makes the charity feel like it knows the situation on the ground.', unlocks: [2] },
      { key: 'GUILT_EXPRESSION', boost: 8, description: 'Running spreadsheets at 3am, feels guilty he isn\'t there helping', category: 'urgency', callHint: '"The matching window closes tonight. Your $500 becomes $1,500 for Cedar Creek families." His guilt makes him act fast.', unlocks: [3] },
      { key: 'COMMUNITY_ORG', boost: 5, description: 'Cedar Creek Baptist Church is the relief hub, already donated $600', category: 'trust_bridge', callHint: 'Claim partnership with Cedar Creek Baptist Church or say the church referred his name as a community supporter. Instant credibility.', unlocks: [4] }
    ]
  }
};

/**
 * Get FriendBook data for a Level 4 victim.
 * @param {string} victimName - The victim's name from VICTIM_NAMES
 * @returns {object|null} FriendBook data or null if not found
 */
export function getLevel4FriendBook(victimName) {
  return FRIENDBOOK_DATA[victimName] || null;
}

export { FRIENDBOOK_DATA as LEVEL4_DATA };
