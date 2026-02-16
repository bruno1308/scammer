/**
 * FriendBook data for Level 4: Romance Scam
 * Difficulty: Clues on other people's profiles about the victim
 *
 * The victim's own profile is sparse (they're lonely, not very active).
 * Intel is found on family/friend profiles who post ABOUT the victim.
 */

const FRIENDBOOK_DATA = {
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
          text: 'Thinking of my sis Linda today. 3 years since Greg walked out on her. She deserved so much better than that man. You are stronger than you know, sis. I love you.',
          time: '1 week ago',
          likes: 27,
          comments: [
            { author: 'dave_crawford', text: 'Greg never deserved her. Period.' },
            { author: 'ashley_crawford', text: 'Aunt Linda is the strongest woman I know.' }
          ],
          intel: { key: 'DIVORCE_DETAILS', value: 'Ex-husband Greg walked out 3 years ago' }
        },
        {
          text: 'Book club tonight! Reading "Where the Crawdads Sing" finally. Better late than never!',
          time: '4 days ago',
          likes: 15,
          comments: [],
          intel: null
        },
        {
          text: 'Visited Linda and her rescue cat Biscuit this weekend! That orange tabby has her wrapped around his little paw. At least she has good company.',
          time: '2 weeks ago',
          likes: 19,
          comments: [
            { author: 'ashley_crawford', text: 'Tell Biscuit I say pspspsp' },
            { author: 'linda_foster', text: 'He misses you already! Come back soon.' }
          ],
          intel: { key: 'PET_NAME', value: 'Linda has a rescue cat named Biscuit, orange tabby' }
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
          text: 'Lord give me patience. Trying to help Linda with her finances over the phone. That no-good Greg cleaned out the savings account before he left. She got the house at least but the mortgage is killing her on one income.',
          time: '1 month ago',
          likes: 8,
          comments: [
            { author: 'dave_crawford', text: 'Babe maybe don\'t put that on Facebook' },
            { author: 'tammy_crawford', text: 'You\'re right. But I\'m still mad.' }
          ],
          intel: { key: 'FINANCIAL_SITUATION', value: 'Greg cleaned out savings, Linda got the house but struggles with mortgage on one income' }
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
          text: 'Stopped by Linda\'s on my way through Nashville to check the gutters. House needs work but she won\'t ask for help. Stubborn just like her sister.',
          time: '3 weeks ago',
          likes: 9,
          comments: [
            { author: 'tammy_crawford', text: 'Thank you baby. She never asks for anything.' }
          ],
          intel: null
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
          text: 'Throwback to girls\' weekend in Gatlinburg with Mom and Aunt Linda. Miss those days so much. She\'s been so alone since the divorce. Need to visit more. I\'m sorry Aunt Linda, nursing school is kicking my butt but I\'m coming soon I promise.',
          time: '5 days ago',
          likes: 16,
          imageKey: 'fb_l4_post_gatlinburg_weekend',
          comments: [
            { author: 'linda_foster', text: 'Oh honey don\'t you worry about me! Focus on school. I\'m so proud of you.' },
            { author: 'tammy_crawford', text: 'We need to plan another trip. All three of us.' }
          ],
          intel: { key: 'LONELINESS', value: 'Linda has been very alone since the divorce, family lives far away' }
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
          text: 'Aunt Linda sent me a care package with homemade cookies and a handwritten note. I\'m NOT crying in the library right now. She\'s the sweetest person alive.',
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
      { key: 'DIVORCE_DETAILS', boost: 15, description: 'Ex-husband Greg left 3 years ago' },
      { key: 'FINANCIAL_SITUATION', boost: 10, description: 'Greg took the savings, mortgage is a struggle' },
      { key: 'LONELINESS', boost: 8, description: 'Linda is isolated and alone since divorce' },
      { key: 'PET_NAME', boost: 5, description: 'Rescue cat named Biscuit' }
    ]
  },

  'Robert Kim': {
    profiles: {
      robert_kim: {
        name: 'Robert Kim',
        portraitKey: 'l4_victim_2',
        isTarget: true,
        bio: 'Teaching history at Pacific View High. One day at a time.',
        location: 'San Diego, California',
        birthday: 'March 22, 1977',
        relationship: 'Widowed',
        workplace: 'Pacific View High School - History Teacher',
        interests: ['Surfing', 'History', 'Photography'],
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
          text: 'Two years. Miss you every single day, Jen.',
          time: '1 week ago',
          likes: 47,
          comments: [
            { author: 'daniel_kim', text: 'Love you, bro.' },
            { author: 'grace_kim', text: 'She was the best. Thinking of you Rob.' }
          ],
          intel: null
        },
        {
          text: 'Good morning from La Jolla. The ocean doesn\'t fix anything but it helps.',
          time: '3 weeks ago',
          likes: 12,
          comments: [],
          intel: null
        }
      ],
      daniel_kim: [
        {
          text: '2 years without Jennifer. My brother Rob hasn\'t been the same since she lost her battle with cancer. If you know him, reach out. He won\'t ask for help. He never does. I worry about him every day.',
          time: '1 week ago',
          likes: 89,
          comments: [
            { author: 'grace_kim', text: 'We\'re here for him. Always.' },
            { author: 'justin_kim', text: 'Uncle Rob is the strongest person I know' }
          ],
          intel: { key: 'WIFE_DEATH', value: 'Wife Jennifer died of cancer 2 years ago, Robert is deeply grieving' }
        },
        {
          text: 'BridgePoint Labs just closed Series B! Grateful for this incredible team. Next stop: changing how hospitals handle patient data. Jen would\'ve had a lot of opinions about our UX. Miss her feedback.',
          time: '2 weeks ago',
          likes: 203,
          comments: [
            { author: 'grace_kim', text: 'So proud of you! Jennifer would be too.' }
          ],
          intel: null
        },
        {
          text: 'Sunday Korean BBQ with the fam. Even got Rob to drive up from San Diego. The man needs to eat more. Justin challenged him to a meat-eating contest. It was ugly.',
          time: '3 weeks ago',
          likes: 45,
          comments: [
            { author: 'justin_kim', text: 'I won and nobody can tell me different' },
            { author: 'robert_kim', text: 'You absolutely did not win.' }
          ],
          intel: null
        },
        {
          text: 'Rob keeps saying the life insurance is "enough" but he\'s not touching the principal. Living off his teacher salary and savings. I offered to help and he nearly bit my head off. Kim stubbornness is genetic I guess.',
          time: '1 month ago',
          likes: 14,
          comments: [
            { author: 'grace_kim', text: 'Honey maybe don\'t put family finances online...' },
            { author: 'daniel_kim', text: 'You\'re right. But someone needed to say it.' }
          ],
          intel: { key: 'FINANCIAL_STATUS', value: 'Has life insurance payout but won\'t touch it, living off teacher salary and savings' }
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
          text: 'So proud of Robert for going back to teaching after leaving the law firm. He walked away from partner track to teach AP History at a public school. Jennifer would be so proud. She always said he was meant to be a teacher.',
          time: '2 weeks ago',
          likes: 56,
          comments: [
            { author: 'daniel_kim', text: 'She really did say that. Every Thanksgiving.' },
            { author: 'robert_kim', text: 'Best decision I ever made. Well, second best.' }
          ],
          intel: { key: 'CAREER_CHANGE', value: 'Robert left a law firm to become a high school teacher after Jennifer\'s death' }
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
          text: 'Family yoga in the park. Daniel lasted 12 minutes. Justin lasted 8. Robert actually stayed the whole class and said "Jen would\'ve liked this." Progress.',
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
          text: 'Uncle Rob took me surfing at La Jolla today! First time he\'s actually smiled in months. He even laughed when I wiped out. That felt really good to see.',
          time: '5 days ago',
          likes: 34,
          imageKey: 'fb_l4_post_surfing_lajolla',
          comments: [
            { author: 'grace_kim', text: 'This makes my heart so happy.' },
            { author: 'daniel_kim', text: 'Get him out there more, bud. It\'s good for him.' }
          ],
          intel: { key: 'HOBBY', value: 'Robert surfs at La Jolla, it\'s his escape from grief' }
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
      { key: 'WIFE_DEATH', boost: 15, description: 'Wife Jennifer died of cancer 2 years ago' },
      { key: 'CAREER_CHANGE', boost: 10, description: 'Left law firm to teach after Jennifer\'s death' },
      { key: 'FINANCIAL_STATUS', boost: 8, description: 'Has life insurance but won\'t touch it' },
      { key: 'HOBBY', boost: 5, description: 'Surfs at La Jolla to cope with grief' }
    ]
  },

  'Patricia Martinez': {
    profiles: {
      patricia_martinez: {
        name: 'Patricia Martinez',
        portraitKey: 'l4_victim_3',
        isTarget: true,
        bio: 'Abuela. Gardener. Missing my Miguel.',
        location: 'Albuquerque, New Mexico',
        birthday: 'December 3, 1963',
        relationship: 'Widowed',
        workplace: 'Retired - Former school cafeteria manager',
        interests: ['Gardening', 'Cooking', 'Church'],
        groups: ['San Felipe de Neri Parish'],
        checkIns: ['Old Town Albuquerque'],
        friends: ['rosa_martinez_herrera', 'chris_herrera']
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
        friends: ['patricia_martinez', 'chris_herrera']
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
        friends: ['patricia_martinez', 'rosa_martinez_herrera']
      }
    },
    posts: {
      patricia_martinez: [
        {
          text: 'My chile plants are coming in nicely this year. Miguel always said I had the best green chile in the neighborhood. I still grow enough for two.',
          time: '1 week ago',
          likes: 7,
          comments: [
            { author: 'rosa_martinez_herrera', text: 'Save some for us when we visit Mama! Elena needs to learn to love green chile early.' }
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
          text: 'Feel so guilty living so far from Mom. She doesn\'t complain but the house feels so empty without Dad. Video calls aren\'t the same. Elena reaches for the screen every time and Mom just cries. I need to figure out how to be there more.',
          time: '4 days ago',
          likes: 31,
          comments: [
            { author: 'chris_herrera', text: 'We\'ll fly her out next month. I already looked at flights.' },
            { author: 'patricia_martinez', text: 'Mija don\'t worry about me. I have my garden and my church. You focus on that beautiful baby.' }
          ],
          intel: { key: 'ISOLATION', value: 'Patricia lives alone in empty house, daughter is far away in Denver, deeply lonely' }
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
          intel: { key: 'MONEY_WORRIES', value: 'Miguel\'s pension barely covers expenses, property taxes rising, too proud to accept help' }
        },
        {
          text: 'Big presentation at work today. Altitude is pitching for the Colorado Tourism account. If we land this I might actually sleep again someday.',
          time: '3 weeks ago',
          likes: 24,
          comments: [
            { author: 'chris_herrera', text: 'You\'re gonna crush it babe' }
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
          intel: { key: 'DAILY_ROUTINE', value: 'Walks to San Felipe church every morning, has done so since Miguel died 4 years ago' }
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
          text: 'Rosa\'s mom mentioned she\'s been seeing Dr. Reyes about her hip again. It\'s been bothering her for months but she didn\'t tell Rosa because she "didn\'t want to worry anyone." We should really fly her out here so Grace can take a look. That woman is too stubborn for her own good.',
          time: '2 weeks ago',
          likes: 8,
          comments: [
            { author: 'rosa_martinez_herrera', text: 'WHAT?! She told me she was fine!! I\'m calling her right now.' },
            { author: 'chris_herrera', text: 'Don\'t be mad at her. She just doesn\'t want to be a burden.' }
          ],
          intel: { key: 'HEALTH_CONCERN', value: 'Patricia has hip problems, seeing Dr. Reyes, hides health issues from family' }
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
      ]
    },
    intelKeys: [
      { key: 'ISOLATION', boost: 15, description: 'Lives alone, daughter far away, deeply lonely' },
      { key: 'HEALTH_CONCERN', boost: 10, description: 'Hip problems, seeing Dr. Reyes, hides it from family' },
      { key: 'MONEY_WORRIES', boost: 8, description: 'Miguel\'s pension barely covers bills' },
      { key: 'DAILY_ROUTINE', boost: 5, description: 'Walks to San Felipe church every morning' }
    ]
  },

  'William Brooks': {
    profiles: {
      william_brooks: {
        name: 'William Brooks',
        portraitKey: 'l4_victim_2',
        isTarget: true,
        bio: 'CPA. Charlotte native. Figuring it out.',
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
          text: 'Interesting article about changes to the 2026 tax code. Small business owners take note.',
          time: '1 week ago',
          likes: 2,
          comments: [],
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
          text: 'Dad texted "miss you kiddo" at 2am again. I know the empty nest is hitting hard now that Tyler left for State too. I wish he\'d talk to someone but he just buries himself in work. It\'s been 5 years since the divorce and I don\'t think he\'s had a real conversation with anyone besides Steve.',
          time: '3 days ago',
          likes: 23,
          comments: [
            { author: 'tyler_brooks', text: 'Yeah he texted me too. Said he was "just up working." At 2am. On a Saturday.' },
            { author: 'steve_hendricks', text: 'I check on him. He\'s okay. Just... Will being Will.' }
          ],
          intel: { key: 'DIVORCE_LONELINESS', value: 'Divorced 5 years, both kids moved out, texts them at 2am, deeply lonely and isolated' }
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
          text: 'Dad sold the boat to help with my tuition. Told me not to tell Megan. I hate that he pretends everything is fine when he\'s clearly struggling. He loved that stupid boat. It was the one thing he kept from before the divorce.',
          time: '6 days ago',
          likes: 15,
          comments: [
            { author: 'steve_hendricks', text: 'Your dad is a good man, Tyler. The best.' },
            { author: 'megan_brooks', text: 'TYLER. Why didn\'t you tell me? We need to talk.' }
          ],
          intel: { key: 'FINANCIAL', value: 'Sold his boat to pay tuition, financially struggling, keeps it from his kids' }
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
          text: 'Dragged Will out for beers at Duckworth\'s tonight. Dude needs to stop moping. 5 years divorced and still not over it. Diane moved on ages ago. Someone set this man up already! He\'s got a good job, full head of hair, and he can grill a mean steak. Ladies, form an orderly line.',
          time: '4 days ago',
          likes: 38,
          comments: [
            { author: 'megan_brooks', text: 'PLEASE someone date my father I am begging' },
            { author: 'william_brooks', text: 'Steve. Come on man.' },
            { author: 'steve_hendricks', text: 'The truth hurts buddy. You need a life.' }
          ],
          intel: { key: 'DIVORCE_LONELINESS', value: 'Divorced 5 years, both kids moved out, texts them at 2am, deeply lonely and isolated' }
        },
        {
          text: 'Will tried Bumble for like 2 days and deleted it. Said "nobody wants a boring accountant." Bro, you are a CATCH. You own your own firm, you coach Little League on weekends, and you make the best smoked brisket in Mecklenburg County. I\'m gonna make him a profile myself.',
          time: '2 weeks ago',
          likes: 29,
          comments: [
            { author: 'megan_brooks', text: 'DO IT. I give you full permission.' },
            { author: 'tyler_brooks', text: 'This is so embarrassing please stop' },
            { author: 'william_brooks', text: 'I am going to change my locks.' }
          ],
          intel: { key: 'DATING_ATTEMPTS', value: 'Tried Bumble briefly, has very low self-esteem about dating, thinks he\'s boring' }
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
      { key: 'DIVORCE_LONELINESS', boost: 15, description: '5 years divorced, empty nest, deeply lonely' },
      { key: 'KIDS_DISTANT', boost: 10, description: 'Both kids moved away, texts at 2am, misses them' },
      { key: 'FINANCIAL', boost: 8, description: 'Sold his boat for tuition, struggling financially' },
      { key: 'DATING_ATTEMPTS', boost: 5, description: 'Tried dating apps, very low self-esteem' }
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
