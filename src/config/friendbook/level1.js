/**
 * FriendBook data for Level 1: Gift Card Refund Scam
 * Difficulty: Easy — clues are on the victim's own profile
 */

const FRIENDBOOK_DATA = {
  'Dorothy Miller': {
    profiles: {
      dorothy_miller: {
        name: 'Dorothy Miller',
        portraitKey: 'l1_victim_1',
        isTarget: true,
        bio: 'Retired schoolteacher. Proud grandma. God is good.',
        location: 'Des Moines, Iowa',
        birthday: 'March 14, 1952',
        relationship: 'Widowed',
        workplace: 'Des Moines Elementary (retired 2017)',
        interests: ['Gardening', 'Baking', 'Church choir', 'Puzzles'],
        groups: ['Des Moines Gardening Club', 'First Baptist Church', 'Amazon Deals Hunters'],
        checkIns: ['Walgreens', 'First Baptist Church', 'Hy-Vee Grocery'],
        friends: ['karen_mitchell', 'mike_mitchell', 'emma_mitchell']
      },
      karen_mitchell: {
        name: 'Karen Mitchell',
        portraitKey: null,
        isTarget: false,
        bio: 'Mom. Wife. Exhausted. \u{1f4cd} Minneapolis',
        location: 'Minneapolis, Minnesota',
        birthday: 'June 22, 1980',
        relationship: 'Married to Mike Mitchell',
        workplace: 'Target Corporate \u2014 Marketing Manager',
        interests: ['Running', 'Wine', 'PTA drama'],
        groups: ['Minneapolis Moms Group'],
        checkIns: [],
        friends: ['dorothy_miller', 'mike_mitchell', 'emma_mitchell']
      },
      mike_mitchell: {
        name: 'Mike Mitchell',
        portraitKey: null,
        isTarget: false,
        bio: 'Dad jokes are my love language',
        location: 'Minneapolis, Minnesota',
        birthday: 'November 3, 1978',
        relationship: 'Married to Karen Mitchell',
        workplace: 'Wells Fargo \u2014 IT Department',
        interests: ['Grilling', 'Vikings football', 'Dad jokes'],
        groups: ['Minneapolis Dads BBQ Club'],
        checkIns: ['CVS Pharmacy', 'Home Depot'],
        friends: ['dorothy_miller', 'karen_mitchell', 'emma_mitchell']
      },
      emma_mitchell: {
        name: 'Emma Mitchell',
        portraitKey: null,
        isTarget: false,
        bio: '\u{1f984} unicorns are real \u{1f984} almost 8!!',
        location: 'Minneapolis, Minnesota',
        birthday: 'February 24, 2018',
        relationship: null,
        workplace: null,
        interests: ['Unicorns', 'Frozen', 'Roblox', 'Drawing'],
        groups: [],
        checkIns: [],
        friends: ['dorothy_miller', 'karen_mitchell', 'mike_mitchell']
      }
    },
    posts: {
      dorothy_miller: [
        {
          text: "Just ordered a little something on Amazon for my granddaughter Emma's birthday! She's going to be 8 \u2014 where does the time go? \u{1f381}",
          time: '2 hours ago',
          likes: 8,
          comments: [
            { author: 'karen_mitchell', text: "Mom you always spoil her \u{1f602} She's already asking what Grandma got her!" }
          ],
          intel: { key: 'GRANDCHILD_NAME', value: "Granddaughter's name is Emma" }
        },
        {
          text: "Beautiful morning at First Baptist. Pastor Dave's sermon really spoke to me today. Feeling blessed. \u{1f64f}",
          time: '1 day ago',
          likes: 14,
          comments: [
            { author: 'karen_mitchell', text: 'Love you Mom \u2764\ufe0f' }
          ],
          intel: null
        },
        {
          text: "My tomatoes are finally coming in! Harold would have been so proud of this year's garden. Miss you every day, sweetheart. \u{1f331}",
          time: '3 days ago',
          likes: 22,
          comments: [
            { author: 'mike_mitchell', text: "Those look amazing Dorothy! Save some for us when we visit?" },
            { author: 'karen_mitchell', text: "Dad loved your garden. He'd say 'best tomatoes in Iowa' \u2764\ufe0f" }
          ],
          intel: { key: 'LATE_SPOUSE', value: "Late husband's name was Harold" }
        },
        {
          text: "Does anyone know how to stop those pop-up ads on my computer? I keep clicking the X but more appear. My grandson said not to click anything but it's hard when they cover the whole screen!",
          time: '5 days ago',
          likes: 3,
          comments: [
            { author: 'mike_mitchell', text: "Dorothy do NOT click those! I'll remote in this weekend and clean it up for you." },
            { author: 'karen_mitchell', text: "Mom PLEASE just call Mike when that happens \u{1f64f}" }
          ],
          intel: null
        }
      ],
      karen_mitchell: [
        {
          text: "Can't believe my baby turns 8 next Tuesday! Planning a unicorn party because obviously \u{1f984}\u2728 Emma's already picked out her purple dress",
          time: '1 day ago',
          likes: 31,
          comments: [
            { author: 'dorothy_miller', text: "Oh I wish I could be there in person! Sending a big box of surprises \u{1f4e6}" },
            { author: 'mike_mitchell', text: 'I have been assigned balloon duty \u{1fae1}' }
          ],
          intel: { key: 'GRANDCHILD_BIRTHDAY', value: "Emma turns 8 next Tuesday, unicorn party" }
        },
        {
          text: 'School pickup line is my personal purgatory. 45 minutes. FORTY. FIVE. MINUTES.',
          time: '3 days ago',
          likes: 47,
          comments: [],
          intel: null
        }
      ],
      mike_mitchell: [
        {
          text: "Pro tip: CVS gift cards make great last-minute gifts. Not that I would know anything about forgetting anniversaries... \u{1f605}",
          time: '4 days ago',
          likes: 12,
          comments: [
            { author: 'karen_mitchell', text: "Michael. Thomas. Mitchell. \u{1f624}" }
          ],
          intel: { key: 'GIFT_CARD_STORE', value: 'Family buys gift cards at CVS' }
        },
        {
          text: "Vikings game day! Who's coming over? Bringing the smoker out \u{1f3c8}\u{1f525}",
          time: '6 days ago',
          likes: 8,
          comments: [],
          intel: null
        }
      ],
      emma_mitchell: [
        {
          text: "my cat mr whiskers learned a new trick!! he sits when i say sit!! well sometimes \u{1f431}",
          time: '2 days ago',
          likes: 18,
          comments: [
            { author: 'dorothy_miller', text: "Mr. Whiskers is such a smart kitty! Just like his owner \u{1f60a}" }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'GRANDCHILD_NAME', boost: 15, description: "Granddaughter's name" },
      { key: 'GRANDCHILD_BIRTHDAY', boost: 10, description: "Granddaughter's birthday" },
      { key: 'LATE_SPOUSE', boost: 8, description: "Late husband's name" },
      { key: 'GIFT_CARD_STORE', boost: 5, description: 'Where family buys gift cards' }
    ]
  },

  'Harold Patterson': {
    profiles: {
      harold_patterson: {
        name: 'Harold Patterson',
        portraitKey: 'l1_victim_2',
        isTarget: true,
        bio: 'Korean War vet. Retired postal worker. Love the desert sunsets.',
        location: 'Tucson, Arizona',
        birthday: 'January 8, 1948',
        relationship: 'Widowed',
        workplace: 'USPS Tucson (retired 2010)',
        interests: ['Fishing', 'Woodworking', 'Classic cars', 'Western movies'],
        groups: ['Tucson VFW Post 549', 'Arizona Bass Fishing Club', 'Saguaro Woodworkers Guild'],
        checkIns: ['Walgreens', 'Tucson VA Medical Center', 'Bass Pro Shops'],
        friends: ['richard_patterson', 'lisa_patterson', 'tyler_patterson']
      },
      richard_patterson: {
        name: 'Richard Patterson',
        portraitKey: null,
        isTarget: false,
        bio: 'If it has an engine, I can fix it. \u{1f527}',
        location: 'Phoenix, Arizona',
        birthday: 'September 15, 1976',
        relationship: 'Married to Lisa Patterson',
        workplace: 'Desert Sun Auto Repair \u2014 Owner',
        interests: ['Cars', 'Motorcycles', 'Camping', 'Craft beer'],
        groups: ['Phoenix Car Enthusiasts', 'Arizona Off-Road Club'],
        checkIns: ['AutoZone', 'O\'Reilly Auto Parts'],
        friends: ['harold_patterson', 'lisa_patterson', 'tyler_patterson']
      },
      lisa_patterson: {
        name: 'Lisa Patterson',
        portraitKey: null,
        isTarget: false,
        bio: 'School nurse by day, book club queen by night. \u{1f4da}',
        location: 'Phoenix, Arizona',
        birthday: 'April 2, 1979',
        relationship: 'Married to Richard Patterson',
        workplace: 'Sunrise Elementary \u2014 School Nurse',
        interests: ['Reading', 'Yoga', 'Book club', 'Hiking'],
        groups: ['Phoenix Book Lovers', 'Valley Yoga Community'],
        checkIns: ['Barnes & Noble', 'Trader Joe\'s'],
        friends: ['harold_patterson', 'richard_patterson', 'tyler_patterson']
      },
      tyler_patterson: {
        name: 'Tyler Patterson',
        portraitKey: null,
        isTarget: false,
        bio: 'Hoops \u{1f3c0} | Class of 2028 | just got my license \u{1f697}\u{1f4a8}',
        location: 'Phoenix, Arizona',
        birthday: 'July 19, 2010',
        relationship: null,
        workplace: null,
        interests: ['Basketball', 'Video games', 'Driving', 'Sneakers'],
        groups: ['Mountain View HS Basketball'],
        checkIns: [],
        friends: ['harold_patterson', 'richard_patterson', 'lisa_patterson']
      }
    },
    posts: {
      harold_patterson: [
        {
          text: "Took my grandson Tyler out to Patagonia Lake this weekend. Taught him to tie a proper clinch knot \u2014 took him about 20 tries but he got it! Kid's a natural once he puts the phone down. \u{1f3a3}",
          time: '1 day ago',
          likes: 19,
          comments: [
            { author: 'richard_patterson', text: 'Ha! Took ME about 50 tries when you taught me, Dad.' },
            { author: 'tyler_patterson', text: 'grandpa i caught a bigger one than you and you know it \u{1f60e}' }
          ],
          intel: { key: 'GRANDSON_NAME', value: "Grandson's name is Tyler" }
        },
        {
          text: "Five years without you, Ruth. Still make your coffee every morning \u2014 two sugars, splash of cream, just how you liked it. The house is too quiet. \u{1f495}",
          time: '3 days ago',
          likes: 34,
          comments: [
            { author: 'lisa_patterson', text: 'She was the most wonderful woman. We miss her every day. \u2764\ufe0f' },
            { author: 'richard_patterson', text: "Love you Dad. Mom's watching over all of us." }
          ],
          intel: { key: 'LATE_WIFE', value: "Late wife's name was Ruth, died 2020" }
        },
        {
          text: "Well, I finally did it \u2014 ordered myself a new laptop from Best Buy. My old one was slower than molasses. Richard says I need to \"set up the cloud\" whatever that means. Wish Ruth was here, she was always better with these gadgets than me.",
          time: '4 days ago',
          likes: 7,
          comments: [
            { author: 'richard_patterson', text: "Dad I told you I'd come set it up this weekend. Please don't click on anything until I get there." },
            { author: 'lisa_patterson', text: 'Exciting! You can video call Tyler now \u{1f60a}' }
          ],
          intel: { key: 'RECENT_PURCHASE', value: 'Harold recently bought a new laptop from Best Buy' }
        },
        {
          text: "Picked up my prescriptions at Walgreens and the pharmacist remembered my name. Small town kindness still exists, folks. Also got some of those butterscotch candies Ruth always loved. Old habits. \u{1f62c}",
          time: '6 days ago',
          likes: 11,
          comments: [
            { author: 'lisa_patterson', text: 'Harold you are the sweetest man. \u2764\ufe0f' }
          ],
          intel: { key: 'PHARMACY', value: 'Harold picks up prescriptions at Walgreens' }
        },
        {
          text: "Beautiful sunset over the Catalinas tonight. God's country right here. \u{1f305}",
          time: '1 week ago',
          likes: 16,
          comments: [],
          intel: null
        }
      ],
      richard_patterson: [
        {
          text: "Customer brought in a '69 Mustang Boss 302 today. I may have spent a little too long \"diagnosing\" it. Some cars you just gotta appreciate. \u{1f697}\u2764\ufe0f",
          time: '2 days ago',
          likes: 24,
          comments: [
            { author: 'harold_patterson', text: 'Now THAT is an automobile. Your grandfather had a \'67 Fastback. Best car I ever rode in.' }
          ],
          intel: null
        },
        {
          text: "Dad's new laptop arrives tomorrow. Taking bets on how many times he calls me before Friday asking how to \"get to the Google.\" Love you, Pops. \u{1f602}",
          time: '5 days ago',
          likes: 15,
          comments: [
            { author: 'lisa_patterson', text: 'Be nice! \u{1f602} Your dad is trying!' },
            { author: 'harold_patterson', text: 'I can read this you know, Richard.' }
          ],
          intel: null
        },
        {
          text: "Tyler passed his driving test first try! Chip off the old block. Now I just need to survive being his passenger. \u{1f64f}\u{1f697}",
          time: '1 week ago',
          likes: 38,
          comments: [
            { author: 'harold_patterson', text: "Congratulations Tyler!! Don't drive too fast now. \u{1f60a}" },
            { author: 'tyler_patterson', text: 'thanks dad!! can i borrow the truck this weekend??' },
            { author: 'richard_patterson', text: 'Absolutely not. \u{1f602}' }
          ],
          intel: null
        }
      ],
      lisa_patterson: [
        {
          text: "Book club pick this month: \"Lessons in Chemistry.\" Already 200 pages in and I can't put it down. Who else is reading? \u{1f4d6}",
          time: '3 days ago',
          likes: 9,
          comments: [],
          intel: null
        },
        {
          text: "Harold sent Tyler a $50 Walgreens gift card for \"no reason.\" That man spoils this kid rotten and I am HERE for it. \u{1f62d}\u2764\ufe0f",
          time: '5 days ago',
          likes: 14,
          comments: [
            { author: 'harold_patterson', text: "A grandfather's privilege! \u{1f60a}" },
            { author: 'tyler_patterson', text: 'thanks grandpa!!! \u{1f64f}\u{1f64f}' }
          ],
          intel: null
        }
      ],
      tyler_patterson: [
        {
          text: "grandpa tried to facetime me but called regular phone and then hung up and tried again 4 times \u{1f602}\u{1f602} love this man",
          time: '1 day ago',
          likes: 22,
          comments: [
            { author: 'harold_patterson', text: 'The buttons are too small! And why does it need the \"wifi\" to work??' },
            { author: 'richard_patterson', text: 'Dad... \u{1f926}\u200d\u2642\ufe0f' }
          ],
          intel: null
        },
        {
          text: "27 points in the game tonight!! varsity next year for sure \u{1f3c0}\u{1f525}",
          time: '4 days ago',
          likes: 31,
          comments: [
            { author: 'lisa_patterson', text: 'SO proud of you!! \u{1f3c0}\u2764\ufe0f' },
            { author: 'harold_patterson', text: 'That\'s my boy!! Wish I could have been there. Next game I\'m driving up!' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'GRANDSON_NAME', boost: 15, description: "Grandson's name" },
      { key: 'LATE_WIFE', boost: 10, description: "Late wife's name" },
      { key: 'RECENT_PURCHASE', boost: 8, description: 'Recent laptop purchase' },
      { key: 'PHARMACY', boost: 5, description: 'Pharmacy he uses' }
    ]
  },

  'Betty Nakamura': {
    profiles: {
      betty_nakamura: {
        name: 'Betty Nakamura',
        portraitKey: 'l1_victim_3',
        isTarget: true,
        bio: 'Retired librarian. Watercolor painter. Baking experiments welcome! \u{1f3a8}',
        location: 'Portland, Oregon',
        birthday: 'October 5, 1957',
        relationship: 'Married to Ken Nakamura',
        workplace: 'Multnomah County Library (retired 2020)',
        interests: ['Watercolor painting', 'Baking', 'Book clubs', 'Birdwatching'],
        groups: ['Portland Watercolor Society', 'Powell\'s Book Club', 'Audubon Society Portland'],
        checkIns: ['Fred Meyer', 'Powell\'s Books', 'Portland Japanese Garden'],
        friends: ['ken_nakamura', 'yuki_nakamura_davis', 'marcus_davis']
      },
      ken_nakamura: {
        name: 'Ken Nakamura',
        portraitKey: null,
        isTarget: false,
        bio: 'Retired engineer. Still tinkering. Betty says I have too many projects.',
        location: 'Portland, Oregon',
        birthday: 'February 18, 1955',
        relationship: 'Married to Betty Nakamura',
        workplace: 'Boeing Portland (retired 2018)',
        interests: ['Model trains', 'Woodworking', 'Sudoku', 'Jazz'],
        groups: ['Pacific Northwest Model Railroad Club', 'Portland Jazz Appreciation Society'],
        checkIns: ['Home Depot', 'Woodcraft Portland'],
        friends: ['betty_nakamura', 'yuki_nakamura_davis', 'marcus_davis']
      },
      yuki_nakamura_davis: {
        name: 'Yuki Nakamura-Davis',
        portraitKey: null,
        isTarget: false,
        bio: 'Engineer at Intel. Mom to the world\'s cutest kindergartener. Coffee addict. \u2615',
        location: 'Hillsboro, Oregon',
        birthday: 'August 12, 1986',
        relationship: 'Married to Marcus Davis',
        workplace: 'Intel Corporation \u2014 Senior Process Engineer',
        interests: ['Running', 'Coffee', 'STEM education', 'Photography'],
        groups: ['Women in STEM Portland', 'Hillsboro Parents Network'],
        checkIns: ['Intel Ronler Acres', 'Starbucks'],
        friends: ['betty_nakamura', 'ken_nakamura', 'marcus_davis']
      },
      marcus_davis: {
        name: 'Marcus Davis',
        portraitKey: null,
        isTarget: false,
        bio: 'Freelance photographer. Stay-at-home dad. Living the dream (the tired version).',
        location: 'Hillsboro, Oregon',
        birthday: 'December 1, 1984',
        relationship: 'Married to Yuki Nakamura-Davis',
        workplace: 'Marcus Davis Photography \u2014 Freelance',
        interests: ['Photography', 'Cooking', 'Hiking', 'Board games'],
        groups: ['Portland Photographers Collective', 'Oregon Hiking Club'],
        checkIns: ['Forest Park', 'New Seasons Market'],
        friends: ['betty_nakamura', 'ken_nakamura', 'yuki_nakamura_davis']
      }
    },
    posts: {
      betty_nakamura: [
        {
          text: "50 years with this wonderful man! Ken surprised me with breakfast in bed and a bouquet of peonies \u2014 my favorite since our first date. Here's to 50 more. Happy anniversary, my love. \u{1f495}",
          time: '1 day ago',
          likes: 67,
          comments: [
            { author: 'yuki_nakamura_davis', text: 'Happy anniversary Mom and Dad!!! \u2764\ufe0f\u2764\ufe0f\u2764\ufe0f You two are the best.' },
            { author: 'marcus_davis', text: 'Goals. Truly. Happy anniversary!' },
            { author: 'ken_nakamura', text: 'Best 50 years of my life, Betty. \u{1f60a}' }
          ],
          intel: { key: 'HUSBAND_NAME', value: "Husband's name is Ken, married 50 years" }
        },
        {
          text: "Made a little watercolor card for my granddaughter Hana's art show at school. She insisted on adding \"sparkles\" so we glued on some glitter together. My kitchen is now 40% glitter. Worth it. \u2728\u{1f3a8}",
          time: '3 days ago',
          likes: 28,
          comments: [
            { author: 'marcus_davis', text: 'She has been talking about the card all week. You made her day, Betty!' },
            { author: 'yuki_nakamura_davis', text: 'Mom the glitter is also in my car now somehow \u{1f602}' }
          ],
          intel: { key: 'GRANDDAUGHTER', value: "Granddaughter's name is Hana, in kindergarten" }
        },
        {
          text: "Ken tried to help me order new watercolor brushes online and somehow we ended up on a page asking for our credit card to \"verify our Amazon account.\" Closed the whole thing. Is that normal? These computers make me so nervous. \u{1f615}",
          time: '4 days ago',
          likes: 5,
          comments: [
            { author: 'yuki_nakamura_davis', text: 'MOM. That was a scam page. Please do NOT enter your credit card anywhere like that. I am coming over Saturday to look at your computer.' },
            { author: 'ken_nakamura', text: 'I told her not to worry about it but Yuki you should probably take a look.' }
          ],
          intel: { key: 'TECH_STRUGGLE', value: 'Betty and Ken had a computer scam scare recently' }
        },
        {
          text: "Big Fred Meyer run today \u2014 stocked up on baking supplies. Going to attempt Ken's mother's mochi recipe this weekend. Wish me luck! Last time was... crunchy. \u{1f605}",
          time: '5 days ago',
          likes: 12,
          comments: [
            { author: 'ken_nakamura', text: 'It was not that bad. Only a little crunchy.' },
            { author: 'yuki_nakamura_davis', text: 'Dad you are a diplomat \u{1f602}' }
          ],
          intel: { key: 'SHOPPING_HABIT', value: 'Betty shops at Fred Meyer' }
        },
        {
          text: "Spotted a Varied Thrush in the backyard this morning! First one this season. Ken said \"it's just a bird\" but I got a beautiful photo. He doesn't understand. \u{1f426}",
          time: '1 week ago',
          likes: 15,
          comments: [
            { author: 'marcus_davis', text: 'Great shot Betty! The lighting is perfect.' }
          ],
          intel: null
        }
      ],
      ken_nakamura: [
        {
          text: "Finally finished the N-scale mountain tunnel for the train layout. Only took 6 months, 3 trips to Home Depot, and one very patient wife. \u{1f682}",
          time: '2 days ago',
          likes: 16,
          comments: [
            { author: 'betty_nakamura', text: 'It looks wonderful, honey. Now please clean up the garage. \u{1f60a}' },
            { author: 'yuki_nakamura_davis', text: 'Dad your train room is getting out of hand and I love it \u{1f602}' }
          ],
          intel: null
        },
        {
          text: "Happy anniversary to my beautiful Betty. 50 years and she still laughs at my bad jokes. That's love, folks. \u{1f338}",
          time: '1 day ago',
          likes: 52,
          comments: [
            { author: 'betty_nakamura', text: 'I laugh DESPITE them, Ken. \u2764\ufe0f' }
          ],
          intel: null
        }
      ],
      yuki_nakamura_davis: [
        {
          text: "Hana's first art show at school today! She painted a family portrait \u2014 we're all purple apparently. So proud of this creative kiddo. \u{1f3a8}\u{1f49c}",
          time: '2 days ago',
          likes: 33,
          comments: [
            { author: 'betty_nakamura', text: "She gets her artistic talent from her grandmother, obviously! \u{1f60a}" },
            { author: 'marcus_davis', text: 'I am NOT purple. I am a very distinguished shade of violet.' }
          ],
          intel: null
        },
        {
          text: "Mom's anniversary coming up and she still can't figure out how to open email attachments. I love her but I am going to lose my mind. Setting up a family tech support rotation with Marcus.",
          time: '5 days ago',
          likes: 21,
          comments: [
            { author: 'ken_nakamura', text: 'I can open attachments! Sometimes.' },
            { author: 'betty_nakamura', text: 'The buttons are very small, Yuki.' }
          ],
          intel: null
        }
      ],
      marcus_davis: [
        {
          text: "Kindergarten field trip to the Japanese Garden. 15 kids, 2 parents, 1 photographer dad trying not to let anyone fall in the koi pond. Success (barely). \u{1f4f8}",
          time: '3 days ago',
          likes: 19,
          comments: [
            { author: 'yuki_nakamura_davis', text: 'You are a hero. A tired hero.' },
            { author: 'betty_nakamura', text: 'I hope Hana loved it! The garden is so beautiful this time of year.' }
          ],
          intel: null
        },
        {
          text: "Hana asked me to photograph her stuffed animals \"for their portfolio.\" I now have 47 professional headshots of teddy bears. This is my life.",
          time: '6 days ago',
          likes: 42,
          comments: [
            { author: 'betty_nakamura', text: "That is the most adorable thing I've ever heard! \u{1f60d}" },
            { author: 'ken_nakamura', text: 'Frame them all.' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'HUSBAND_NAME', boost: 15, description: "Husband's name" },
      { key: 'GRANDDAUGHTER', boost: 10, description: "Granddaughter's name" },
      { key: 'TECH_STRUGGLE', boost: 8, description: 'Recent computer scare' },
      { key: 'SHOPPING_HABIT', boost: 5, description: 'Grocery store she uses' }
    ]
  },

  'Earl Washington': {
    profiles: {
      earl_washington: {
        name: 'Earl Washington',
        portraitKey: 'l1_victim_4',
        isTarget: true,
        bio: 'Retired postal worker. Deacon at Ebenezer Baptist. Chess player. Go Falcons!',
        location: 'Atlanta, Georgia',
        birthday: 'May 22, 1952',
        relationship: 'Widowed',
        workplace: 'USPS Atlanta (retired 2014)',
        interests: ['Chess', 'Gospel music', 'Fishing', 'Atlanta Falcons'],
        groups: ['Ebenezer Baptist Church', 'Atlanta Chess Club', 'USPS Retirees Association'],
        checkIns: ['Ebenezer Baptist Church', 'Kroger', 'Atlanta Beltline'],
        friends: ['denise_washington_taylor', 'jerome_taylor', 'marcus_taylor']
      },
      denise_washington_taylor: {
        name: 'Denise Washington-Taylor',
        portraitKey: null,
        isTarget: false,
        bio: 'Attorney. Mother. Daughter. Trying to do it all. \u2696\ufe0f',
        location: 'Atlanta, Georgia',
        birthday: 'March 9, 1981',
        relationship: 'Married to Jerome Taylor',
        workplace: 'Washington & Associates \u2014 Family Law Attorney',
        interests: ['Running', 'True crime podcasts', 'Brunch', 'Gardening'],
        groups: ['Georgia Bar Association', 'Atlanta Women Lawyers', 'Decatur Runners Club'],
        checkIns: ['Piedmont Park', 'Flying Biscuit Cafe'],
        friends: ['earl_washington', 'jerome_taylor', 'marcus_taylor']
      },
      jerome_taylor: {
        name: 'Jerome Taylor',
        portraitKey: null,
        isTarget: false,
        bio: 'Principal at Westlake High. Shaping the future one student at a time.',
        location: 'Atlanta, Georgia',
        birthday: 'August 17, 1979',
        relationship: 'Married to Denise Washington-Taylor',
        workplace: 'Westlake High School \u2014 Principal',
        interests: ['Education', 'Basketball', 'Grilling', 'Jazz'],
        groups: ['Georgia Principals Association', 'Atlanta Educators Network'],
        checkIns: ['Westlake High School', 'Home Depot'],
        friends: ['earl_washington', 'denise_washington_taylor', 'marcus_taylor']
      },
      marcus_taylor: {
        name: 'Marcus Taylor',
        portraitKey: null,
        isTarget: false,
        bio: 'future engineer \u{1f916} | robotics team captain | coding is life | 14',
        location: 'Atlanta, Georgia',
        birthday: 'November 30, 2011',
        relationship: null,
        workplace: null,
        interests: ['Robotics', 'Python coding', 'Minecraft', 'Legos'],
        groups: ['Westlake HS Robotics Club', 'Atlanta Youth STEM League'],
        checkIns: [],
        friends: ['earl_washington', 'denise_washington_taylor', 'jerome_taylor']
      }
    },
    posts: {
      earl_washington: [
        {
          text: "So proud of my daughter Denise \u2014 she just won her biggest case yet. That girl worked her way through law school while raising a baby. If her mama Gloria could see her now... \u{1f62d}\u{1f4aa}",
          time: '1 day ago',
          likes: 45,
          comments: [
            { author: 'denise_washington_taylor', text: 'Daddy stop you\'re gonna make me cry at work \u{1f62d}\u2764\ufe0f' },
            { author: 'jerome_taylor', text: 'Your father has been telling every person at church about this. EVERY person. \u{1f602}' }
          ],
          intel: { key: 'DAUGHTER_NAME', value: "Daughter's name is Denise" }
        },
        {
          text: "My grandson Marcus showed me his robot at the science fair yesterday. It picks up objects and sorts them by color! This boy is going to change the world, I swear. Built the whole thing himself. \u{1f916}\u{1f3c6}",
          time: '3 days ago',
          likes: 38,
          comments: [
            { author: 'marcus_taylor', text: 'thanks grandpa!! you were the loudest person cheering \u{1f602}\u{1f602}' },
            { author: 'denise_washington_taylor', text: 'Dad you literally stood up and clapped for 30 seconds. There were other kids presenting. \u{1f926}\u200d\u2640\ufe0f\u{1f602}' },
            { author: 'jerome_taylor', text: 'He earned every clap. First place!' }
          ],
          intel: { key: 'GRANDSON_HOBBY', value: "Grandson Marcus does robotics, won first place at science fair" }
        },
        {
          text: "Sunday morning at Ebenezer Baptist. Choir was on FIRE today. Gloria always said the choir sounded like heaven itself. Seven years without her and Sundays still feel empty in that pew. But God is good. \u{1f64f}",
          time: '4 days ago',
          likes: 29,
          comments: [
            { author: 'denise_washington_taylor', text: 'Mama is singing right along with them, Daddy. I know it. \u2764\ufe0f' },
            { author: 'jerome_taylor', text: 'Amen, Mr. Washington.' }
          ],
          intel: { key: 'LATE_WIFE', value: "Late wife's name was Gloria, died 2019" }
        },
        {
          text: "Checked in at Ebenezer Baptist Church. \u{1f4cd}",
          time: '4 days ago',
          likes: 6,
          comments: [],
          intel: { key: 'CHURCH', value: 'Earl attends Ebenezer Baptist Church' }
        },
        {
          text: "Beat three people at chess club today. These young folks think they can out-think an old mailman. Not yet! \u265f\ufe0f\u{1f60e}",
          time: '6 days ago',
          likes: 17,
          comments: [
            { author: 'marcus_taylor', text: 'grandpa you STILL wont teach me your opening move \u{1f624}' },
            { author: 'earl_washington', text: 'Trade secret, young man! \u{1f602}' }
          ],
          intel: null
        },
        {
          text: "Trying to figure out how to print a shipping label from my email. Denise said to \"right click\" but nothing happens when I click the right side of the mouse. Why do they make these things so complicated?",
          time: '1 week ago',
          likes: 4,
          comments: [
            { author: 'denise_washington_taylor', text: "Daddy I will come over after work and show you. Please don't click on any random links." },
            { author: 'marcus_taylor', text: 'grandpa just press the button on the RIGHT side of the mouse not the right side of the screen \u{1f602}' }
          ],
          intel: null
        }
      ],
      denise_washington_taylor: [
        {
          text: "This man right here raised me solo after Mama passed, worked double shifts at the post office, and STILL made it to every single recital, game, and school play. Happy Father's Day to the greatest man I know. Love you, Daddy. \u{1f62d}\u2764\ufe0f",
          time: '5 days ago',
          likes: 72,
          comments: [
            { author: 'earl_washington', text: 'Baby girl you are my whole heart. Your mama would be so proud of the woman you became.' },
            { author: 'jerome_taylor', text: 'The best father-in-law a man could ask for.' }
          ],
          intel: null
        },
        {
          text: "Marcus got first place at the district science fair!!! My baby is a genius \u{1f916}\u{1f3c6} Next stop: state competition! Jerome and Dad are already planning the road trip.",
          time: '3 days ago',
          likes: 55,
          comments: [
            { author: 'earl_washington', text: 'STATE! Oh lord I need to iron my good shirt!' },
            { author: 'marcus_taylor', text: 'dad already has the hotel booked \u{1f602}' }
          ],
          intel: null
        }
      ],
      jerome_taylor: [
        {
          text: "Proud principal moment: our robotics team made regionals! Even prouder dad moment: my son is team captain. Trying to maintain professional composure at school. Failing. \u{1f602}\u{1f916}",
          time: '2 days ago',
          likes: 34,
          comments: [
            { author: 'earl_washington', text: 'That boy has the Washington brains AND the Taylor work ethic! Can\'t lose!' },
            { author: 'denise_washington_taylor', text: 'Did you do the embarrassing cheer again?' },
            { author: 'jerome_taylor', text: 'I plead the fifth.' }
          ],
          intel: null
        },
        {
          text: "Family cookout at Earl's this Sunday. I'm on ribs. Mr. Washington insists he's on the potato salad. Nobody argue with the man about his potato salad. \u{1f356}",
          time: '6 days ago',
          likes: 18,
          comments: [
            { author: 'earl_washington', text: "Gloria's recipe. Non-negotiable." },
            { author: 'denise_washington_taylor', text: 'I will bring the sweet tea. Daddy do NOT let Jerome touch the grill unsupervised again.' }
          ],
          intel: null
        }
      ],
      marcus_taylor: [
        {
          text: "my robot can now sort objects AND stack them!!! 2 months of coding and it finally works!! going to states!! \u{1f916}\u{1f916}\u{1f916}",
          time: '2 days ago',
          likes: 27,
          comments: [
            { author: 'earl_washington', text: "That's my grandson! \u{1f4aa}\u{1f4aa}" },
            { author: 'jerome_taylor', text: 'Proud of you, son.' }
          ],
          intel: null
        },
        {
          text: "grandpa tried to video call me but accidentally posted a selfie to his timeline instead \u{1f602}\u{1f602}\u{1f602} i love him",
          time: '5 days ago',
          likes: 33,
          comments: [
            { author: 'denise_washington_taylor', text: 'I just saw that. Daddy does NOT know how to delete it either \u{1f602}' },
            { author: 'earl_washington', text: 'How do I remove this?? Marcus HELP' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'DAUGHTER_NAME', boost: 15, description: "Daughter's name" },
      { key: 'GRANDSON_HOBBY', boost: 10, description: "Grandson's robotics hobby" },
      { key: 'LATE_WIFE', boost: 8, description: "Late wife's name" },
      { key: 'CHURCH', boost: 5, description: 'Church he attends' }
    ]
  },

  "Margaret O'Brien": {
    profiles: {
      margaret_obrien: {
        name: "Margaret O'Brien",
        portraitKey: 'l1_victim_5',
        isTarget: true,
        bio: "Proud Bostonian since 1945. Sox fan for life. Great-grandma to the world's sweetest baby.",
        location: 'Boston, Massachusetts',
        birthday: 'September 28, 1945',
        relationship: 'Widowed',
        workplace: 'Massachusetts General Hospital (retired 1998, RN)',
        interests: ['Knitting', 'Red Sox', 'Crossword puzzles', 'Irish cooking'],
        groups: ['South Boston Senior Center', 'St. Patrick\'s Parish', 'Red Sox Nation'],
        checkIns: ['Stop & Shop', 'St. Patrick\'s Church', 'South Boston Senior Center'],
        friends: ['patrick_obrien', 'colleen_obrien', 'baby_fiona_obrien']
      },
      patrick_obrien: {
        name: "Patrick O'Brien",
        portraitKey: null,
        isTarget: false,
        bio: 'BFD Ladder 17. 25 years on the job. Proudest day: when Fiona was born.',
        location: 'Boston, Massachusetts',
        birthday: 'March 17, 1971',
        relationship: "Married to Colleen O'Brien",
        workplace: 'Boston Fire Department \u2014 Ladder 17, Lieutenant',
        interests: ['Fishing', 'Red Sox', 'Woodworking', 'Coaching Little League'],
        groups: ['Boston Firefighters Local 718', 'Southie Little League'],
        checkIns: ['Fenway Park', 'Sullivan\'s Castle Island'],
        friends: ['margaret_obrien', 'colleen_obrien', 'baby_fiona_obrien']
      },
      colleen_obrien: {
        name: "Colleen O'Brien",
        portraitKey: null,
        isTarget: false,
        bio: 'Dental hygienist. New grandma. Sleep-deprived but loving it. \u{1f476}',
        location: 'Boston, Massachusetts',
        birthday: 'July 14, 1975',
        relationship: "Married to Patrick O'Brien",
        workplace: 'Beacon Hill Dental \u2014 Dental Hygienist',
        interests: ['Cooking', 'Walking', 'Baby clothes shopping', 'True crime shows'],
        groups: ['South Boston Moms & Grandmoms', 'New England Dental Hygienists'],
        checkIns: ['Buy Buy Baby', 'Whole Foods'],
        friends: ['margaret_obrien', 'patrick_obrien', 'baby_fiona_obrien']
      },
      baby_fiona_obrien: {
        name: "Fiona O'Brien",
        portraitKey: null,
        isTarget: false,
        bio: "\u{1f476} 8 months old \u{1f476} already has more personality than most adults",
        location: 'Boston, Massachusetts',
        birthday: 'June 10, 2025',
        relationship: null,
        workplace: null,
        interests: ['Being adorable', 'Mashed bananas', 'Peek-a-boo', 'Napping'],
        groups: [],
        checkIns: [],
        friends: ['margaret_obrien', 'patrick_obrien', 'colleen_obrien']
      }
    },
    posts: {
      margaret_obrien: [
        {
          text: "Happy St. Patrick's Day from Southie! My Patrick was born on this very day 55 years ago and I've been blessed ever since. The whole family went to the parade \u2014 even little Fiona wore a tiny green hat! Frank would have loved that. \u2618\ufe0f\u{1f49a}",
          time: '2 days ago',
          likes: 41,
          comments: [
            { author: 'patrick_obrien', text: 'Thanks Ma! Best birthday present is spending it with you and the family. \u2764\ufe0f' },
            { author: 'colleen_obrien', text: 'Fiona stole the show in that hat!! Everyone was stopping us on the street \u{1f49a}' }
          ],
          intel: { key: 'SON_NAME', value: "Son's name is Patrick, born on St. Patrick's Day" }
        },
        {
          text: "My great-granddaughter Fiona smiled at me today and I swear my heart grew three sizes. Eight months old and she's already got me wrapped around her tiny finger. Knitting her a little Red Sox blanket. \u{1f476}\u2764\ufe0f",
          time: '3 days ago',
          likes: 36,
          comments: [
            { author: 'colleen_obrien', text: 'Margaret she lights up every time she sees you! You have the magic touch \u{1f60d}' },
            { author: 'patrick_obrien', text: 'Ma you\'ve knit that kid more blankets than she has years on earth \u{1f602}' }
          ],
          intel: { key: 'GREAT_GRANDCHILD', value: "Great-granddaughter Fiona, 8 months old" }
        },
        {
          text: "Frank passed eight years ago today. Forty-two years of marriage and I still reach for his side of the bed every morning. Miss you, my love. Save me a seat up there. \u{1f54a}\ufe0f\u2764\ufe0f",
          time: '5 days ago',
          likes: 53,
          comments: [
            { author: 'patrick_obrien', text: 'Miss you every day, Dad. The best man I ever knew.' },
            { author: 'colleen_obrien', text: 'He was the kindest soul. Sending love, Margaret. \u2764\ufe0f' }
          ],
          intel: { key: 'LATE_HUSBAND', value: "Late husband's name was Frank, died 2018, married 42 years" }
        },
        {
          text: "Walked to Stop & Shop this morning and the nice young man at the register helped me carry my bags to the bench outside. There are still good people in this world. Picked up some of those cookies Patrick likes. \u{1f36a}",
          time: '6 days ago',
          likes: 14,
          comments: [
            { author: 'patrick_obrien', text: 'Ma you should let me drive you! Stop carrying bags!' },
            { author: 'margaret_obrien', text: 'Patrick Michael, I have walked to that store for 40 years and I am not stopping now.' }
          ],
          intel: { key: 'STORE', value: 'Margaret shops at Stop & Shop' }
        },
        {
          text: "Sox opening day next week! Frank and I never missed one in 30 years. Patrick's taking me this year \u2014 same seats Frank used to get. Section 27, row 5. Go Sox! \u26be\u2764\ufe0f",
          time: '1 week ago',
          likes: 23,
          comments: [
            { author: 'patrick_obrien', text: "Wouldn't miss it, Ma. Dad's seats." },
            { author: 'colleen_obrien', text: 'Fiona and I will hold down the fort! Take pictures! \u26be' }
          ],
          intel: null
        }
      ],
      patrick_obrien: [
        {
          text: "24 hour shift done. Came home to my Ma's soda bread and my granddaughter's smile. Best welcome home committee a man could ask for. \u{1f692}\u{1f35e}\u{1f476}",
          time: '1 day ago',
          likes: 29,
          comments: [
            { author: 'margaret_obrien', text: "You work too hard, sweetheart. Eat before it gets cold." },
            { author: 'colleen_obrien', text: 'Fiona was watching the door all morning waiting for you \u{1f62d}' }
          ],
          intel: null
        },
        {
          text: "Ma called me at the firehouse because her \"computer screen went blue and is yelling at her.\" It was a Windows update. She thought she was being hacked. I love this woman. \u{1f602}\u2764\ufe0f",
          time: '4 days ago',
          likes: 44,
          comments: [
            { author: 'margaret_obrien', text: "It WAS yelling, Patrick! It said DO NOT TURN OFF YOUR COMPUTER! What was I supposed to think?!" },
            { author: 'colleen_obrien', text: 'Oh Margaret \u{1f602}\u{1f602}\u{1f602} Never change' }
          ],
          intel: null
        },
        {
          text: "Happy birthday to the toughest, sweetest, most stubborn woman in all of Southie \u2014 my Ma. 81 years young and she still walks to Stop & Shop every morning \"for the exercise.\" I love you, Ma. \u{1f382}\u2764\ufe0f",
          time: '1 week ago',
          likes: 58,
          comments: [
            { author: 'margaret_obrien', text: "Oh Patrick, you're making an old woman cry! Thank you, sweetheart." },
            { author: 'colleen_obrien', text: "Happy birthday Margaret!! Fiona \"helped\" frost your cake \u{1f370}\u{1f476}" }
          ],
          intel: null
        }
      ],
      colleen_obrien: [
        {
          text: "Fiona said \"dada\" today and Patrick literally cried. This 200lb firefighter sat on the kitchen floor and CRIED. I have video. It will be shown at her wedding. \u{1f602}\u{1f62d}",
          time: '1 day ago',
          likes: 61,
          comments: [
            { author: 'margaret_obrien', text: "Oh! That is just precious! Frank cried when Patrick said his first word too. Must run in the family! \u{1f60a}" },
            { author: 'patrick_obrien', text: 'I had something in my eye. Both eyes. For 10 minutes.' }
          ],
          intel: null
        },
        {
          text: "Margaret taught me her secret brown bread recipe today. She's been guarding it for 50 years but apparently having a great-grandchild earns you access to the vault. \u{1f35e}\u{1f511}",
          time: '4 days ago',
          likes: 22,
          comments: [
            { author: 'margaret_obrien', text: "Well someone needs to carry on the tradition! And you earned it, dear. \u{1f60a}" },
            { author: 'patrick_obrien', text: "WAIT. Ma I've been asking for that recipe for 20 YEARS!" },
            { author: 'margaret_obrien', text: "You can't bake, Patrick." }
          ],
          intel: null
        }
      ],
      baby_fiona_obrien: [
        {
          text: "fiona update: learned to clap today!! \u{1f44f}\u{1f476} (posted by mommy because fiona can't type yet obviously)",
          time: '3 days ago',
          likes: 35,
          comments: [
            { author: 'margaret_obrien', text: "What a smart girl!! She is going to be something special, I just know it! \u{1f60d}" },
            { author: 'patrick_obrien', text: 'That\'s my girl!! \u{1f44f}\u{1f44f}\u{1f44f}' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'SON_NAME', boost: 15, description: "Son's name" },
      { key: 'GREAT_GRANDCHILD', boost: 10, description: "Great-granddaughter's name" },
      { key: 'LATE_HUSBAND', boost: 8, description: "Late husband's name" },
      { key: 'STORE', boost: 5, description: 'Grocery store she uses' }
    ]
  }
};

export function getLevel1FriendBook(victimName) {
  return FRIENDBOOK_DATA[victimName] || null;
}
