/**
 * FriendBook data for Level 3: Tech Support Scam
 * Difficulty: Clues buried in comment threads
 *
 * Intel is hidden in the back-and-forth comments on seemingly innocent posts.
 * The posts themselves are mundane — players must read the replies carefully.
 *
 * Victims: Karen Thompson, Mike Rodriguez, Susan Lee, Tom Anderson
 */

const FRIENDBOOK_DATA = {

  // ─────────────────────────────────────────────
  // KAREN THOMPSON (35, Denver CO, female)
  // ─────────────────────────────────────────────
  'Karen Thompson': {
    profiles: {
      karen_thompson: {
        name: 'Karen Thompson',
        portraitKey: 'l3_victim_2',
        isTarget: true,
        bio: 'Mom life + yoga + too much coffee. Living for the weekends.',
        location: 'Denver, Colorado',
        birthday: 'June 22, 1990',
        relationship: 'Married to Brian Thompson',
        workplace: 'Office Manager at Rocky Mountain Pediatrics',
        interests: ['Yoga', 'Hiking', 'True Crime Podcasts', 'Meal Prepping', 'Target Runs'],
        groups: ['Denver Moms Connect', 'Colorado Hiking Families', 'Instant Pot Recipes & Tips'],
        checkIns: ['Red Rocks Amphitheatre', 'Target - Highlands Ranch', 'Snooze AM Eatery'],
        friends: ['brian_thompson', 'lily_thompson', 'diane_morrison']
      },
      brian_thompson: {
        name: 'Brian Thompson',
        portraitKey: 'fb_l3_brian_thompson',
        isTarget: false,
        bio: 'Software dev. Husband. Dad. Board game nerd. He/Him.',
        location: 'Denver, Colorado',
        birthday: 'November 3, 1988',
        relationship: 'Married to Karen Thompson',
        workplace: 'Senior Developer at Datastream Solutions (Remote)',
        interests: ['Board Games', 'Coding', 'Craft Beer', 'PC Gaming', 'Disc Golf'],
        groups: ['Denver Board Game Meetup', 'r/programming Alumni', 'Colorado Craft Beer Society'],
        checkIns: ['Cerebral Brewing', 'Hyatt Regency Denver', 'Disc Golf Course - Bear Creek'],
        friends: ['karen_thompson', 'lily_thompson', 'diane_morrison']
      },
      lily_thompson: {
        name: 'Lily Thompson',
        portraitKey: 'fb_l3_lily_thompson',
        isTarget: false,
        bio: 'I am 7 and I like horses and rainbows! (managed by Mom)',
        location: 'Denver, Colorado',
        birthday: 'September 15, 2018',
        relationship: 'Single',
        workplace: 'Student at Crestview Elementary',
        interests: ['Horses', 'Drawing', 'Roblox', 'Gymnastics'],
        groups: ['Crestview Elementary Parents & Kids'],
        checkIns: ['Denver Zoo', 'Elitch Gardens', 'Crestview Elementary'],
        friends: ['karen_thompson', 'brian_thompson', 'diane_morrison']
      },
      diane_morrison: {
        name: 'Diane Morrison',
        portraitKey: 'fb_l3_diane_morrison',
        isTarget: false,
        bio: 'Retired librarian. Grandma to the best little girl in the world. Books are life.',
        location: 'Boulder, Colorado',
        birthday: 'February 8, 1965',
        relationship: 'Divorced',
        workplace: 'Boulder Public Library (Retired)',
        interests: ['Reading', 'Book Clubs', 'Quilting', 'Gardening', 'Spoiling Grandchildren'],
        groups: ['Boulder Book Club', 'Quilters of Colorado', 'Boulder Senior Center Events'],
        checkIns: ['Boulder Bookworm', 'Boulder Public Library', 'Karen\'s House'],
        friends: ['karen_thompson', 'brian_thompson', 'lily_thompson']
      }
    },

    posts: {
      karen_thompson: [
        {
          text: 'Ugh my computer has been SO slow this week. Everything takes forever to load and I keep getting these weird pop-up things. Is Mercury in retrograde or something?? lol',
          time: '3 hours ago',
          likes: 4,
          comments: [
            { author: 'diane_morrison', text: 'Oh no honey. Did you renew that Norton thing Brian set up for you? Those subscriptions expire you know' },
            { author: 'brian_thompson', text: 'Your Dell is only 2 years old, it shouldn\'t be slow. DON\'T click those pop-ups. I\'ll look at it tonight' },
            { author: 'karen_thompson', text: 'Ok ok I won\'t click anything. But hurry, I need it for work tomorrow' }
          ],
          intel: { key: 'ANTIVIRUS', value: 'Norton antivirus set up by husband Brian' }
        },
        {
          text: 'I literally cannot remember a single password anymore. I have like 47 accounts and they all want different requirements. Upper case lower case special character a blood sacrifice...',
          time: '2 days ago',
          likes: 18,
          comments: [
            { author: 'diane_morrison', text: 'Just use Lily\'s birthday like I told you, easy to remember! That\'s what I do with yours' },
            { author: 'brian_thompson', text: 'MOM. DIANE. Please do NOT use birthdays as passwords. I will set you both up with a password manager this weekend I swear' },
            { author: 'karen_thompson', text: 'lol Brian is gonna have an aneurysm' }
          ],
          intel: { key: 'PASSWORD_HINT', value: 'Uses daughter Lily\'s birthday as password' }
        },
        {
          text: 'Sunday morning vibes. Lily made me "breakfast in bed" which was a granola bar on a paper plate. 10/10 would recommend',
          time: '4 days ago',
          likes: 32,
          comments: [
            { author: 'diane_morrison', text: 'That is the sweetest thing!! She is such a little angel' },
            { author: 'brian_thompson', text: 'She also used every dish in the kitchen trying to make eggs first. I cleaned up lol' }
          ],
          intel: null
        },
        {
          text: 'Does anyone else just go to Target for one thing and leave with $200 worth of stuff?? Just me?? Ok cool',
          time: '6 days ago',
          likes: 45,
          comments: [
            { author: 'diane_morrison', text: 'That\'s what your father used to say about Home Depot haha' }
          ],
          intel: null
        },
        {
          text: 'Computer froze AGAIN in the middle of a report. Brian is "working" so I can\'t bother him. Someone please send help or a new laptop',
          time: '1 day ago',
          likes: 7,
          comments: [
            { author: 'brian_thompson', text: 'I was in a standup meeting babe. And don\'t click those pop-ups, remember when you almost gave them your Chase login? Just close the browser and reopen' },
            { author: 'karen_thompson', text: 'THAT WAS ONE TIME and the page looked really real ok' },
            { author: 'diane_morrison', text: 'What happened with Chase?? Karen Louise you need to be more careful!' }
          ],
          intel: { key: 'BANK_NAME', value: 'Banks with Chase, almost entered login on fake site before' }
        },
        {
          text: 'Lily\'s gymnastics recital is next Saturday! She\'s been practicing her cartwheel for weeks. So proud of this kiddo',
          time: '5 days ago',
          likes: 24,
          comments: [
            { author: 'diane_morrison', text: 'I will be there with my camera!! Front row grandma!!' },
            { author: 'brian_thompson', text: 'She nailed it at practice yesterday. Going to be great' }
          ],
          intel: null
        }
      ],
      brian_thompson: [
        {
          text: 'Huge release today at work. 6 months of refactoring finally paying off. CI/CD pipeline green across the board',
          time: '1 day ago',
          likes: 14,
          comments: [
            { author: 'karen_thompson', text: 'I understood maybe 3 of those words but I\'m proud of you!!' }
          ],
          intel: null
        },
        {
          text: 'Board game night was a success. Wingspan continues to be the GOAT. Dominated Karen at Ticket to Ride afterward',
          time: '3 days ago',
          likes: 9,
          comments: [
            { author: 'karen_thompson', text: 'You did NOT dominate me, I let you win because Lily was getting cranky' },
            { author: 'brian_thompson', text: 'Sure sure' }
          ],
          intel: null
        },
        {
          text: 'Anyone else think the Dell XPS line has gone downhill? Karen\'s is fine but my old Thinkpad was indestructible',
          time: '5 days ago',
          likes: 6,
          comments: [
            { author: 'karen_thompson', text: 'My Dell is NOT fine, it hates me' },
            { author: 'brian_thompson', text: 'It\'s fine, you just have 47 Chrome tabs open at all times' }
          ],
          intel: null
        },
        {
          text: 'Working from home pro tip: noise cancelling headphones are not optional when your 7 year old is home sick from school',
          time: '1 week ago',
          likes: 21,
          comments: [
            { author: 'diane_morrison', text: 'You could always drop her off at Grandma\'s house!' },
            { author: 'karen_thompson', text: 'He says this like he doesn\'t love the lunch break dance parties' }
          ],
          intel: null
        }
      ],
      diane_morrison: [
        {
          text: 'Finished another quilt for the church auction! This one has a sunflower pattern. Took 3 months but I love how it turned out',
          time: '2 days ago',
          likes: 16,
          comments: [
            { author: 'karen_thompson', text: 'Mom that is BEAUTIFUL. You should sell these on Etsy!' },
            { author: 'diane_morrison', text: 'Oh I don\'t know how to do all that internet selling stuff' }
          ],
          intel: null
        },
        {
          text: 'Book club pick this month is "Lessons in Chemistry." Has anyone read it? No spoilers please!',
          time: '4 days ago',
          likes: 8,
          comments: [
            { author: 'karen_thompson', text: 'SO good. You\'ll love it. The dog is the best character' }
          ],
          intel: null
        },
        {
          text: 'Lily wants to have a sleepover at Grandma\'s this weekend! We are going to make cookies and watch Frozen for the 100th time',
          time: '6 days ago',
          likes: 22,
          comments: [
            { author: 'karen_thompson', text: 'She has been counting down the days!! Thank you Mom' },
            { author: 'brian_thompson', text: 'Date night for us then!' }
          ],
          intel: null
        },
        {
          text: 'Technology will be the death of me. Tried to video call Karen and somehow turned on some filter that gave me dog ears. Lily thought it was hilarious',
          time: '1 week ago',
          likes: 11,
          comments: [
            { author: 'karen_thompson', text: 'I have the screenshot saved forever lol' },
            { author: 'brian_thompson', text: 'Diane you are a treasure' }
          ],
          intel: null
        }
      ],
      lily_thompson: [
        {
          text: 'I drew a picture of my family!! Daddy is the tall one and mommy has big hair and grandma has a book (posted by Mom)',
          time: '3 days ago',
          likes: 38,
          imageKey: 'fb_l3_post_family_drawing',
          comments: [
            { author: 'diane_morrison', text: 'I LOVE IT!! Going right on my fridge!!' },
            { author: 'brian_thompson', text: 'I don\'t think I\'m that tall but I\'ll take it' },
            { author: 'karen_thompson', text: 'My hair is NOT that big... is it??' }
          ],
          intel: null
        }
      ]
    },

    intelKeys: [
      { key: 'BANK_NAME', boost: 15, description: 'Karen banks with Chase' },
      { key: 'ANTIVIRUS', boost: 10, description: 'Norton antivirus subscription' },
      { key: 'COMPUTER_MODEL', boost: 8, description: 'Uses a Dell computer (2 years old)' },
      { key: 'PASSWORD_HINT', boost: 5, description: 'Uses daughter\'s birthday as passwords' }
    ]
  },

  // ─────────────────────────────────────────────
  // MIKE RODRIGUEZ (48, Phoenix AZ, male)
  // ─────────────────────────────────────────────
  'Mike Rodriguez': {
    profiles: {
      mike_rodriguez: {
        name: 'Mike Rodriguez',
        portraitKey: 'l3_victim_1',
        isTarget: true,
        bio: 'Small business owner. Proud dad. Phoenix born and raised. Go Suns!',
        location: 'Phoenix, Arizona',
        birthday: 'March 29, 1977',
        relationship: 'Married to Carmen Rodriguez',
        workplace: 'Owner, Rodriguez Auto Repair',
        interests: ['Cars', 'Phoenix Suns', 'Fishing', 'BBQ', 'Classic Rock'],
        groups: ['Phoenix Small Business Network', 'Arizona Fishing Club', 'Suns Fans United'],
        checkIns: ['Rodriguez Auto Repair', 'Footprint Center', 'Lake Pleasant', 'Home Depot'],
        friends: ['carmen_rodriguez', 'diego_rodriguez', 'tony_rodriguez']
      },
      carmen_rodriguez: {
        name: 'Carmen Rodriguez',
        portraitKey: 'fb_l3_carmen_rodriguez',
        isTarget: false,
        bio: 'Dental hygienist by day, soccer mom by... also day. Blessed life.',
        location: 'Phoenix, Arizona',
        birthday: 'August 17, 1980',
        relationship: 'Married to Mike Rodriguez',
        workplace: 'Hygienist at Sonoran Smiles Dental',
        interests: ['Cooking', 'Soccer', 'Gardening', 'Reality TV', 'Church'],
        groups: ['Our Lady of Guadalupe Parish', 'Phoenix Foodies', 'Sonoran Smiles Team'],
        checkIns: ['Sonoran Smiles Dental', 'Sprouts Farmers Market', 'Our Lady of Guadalupe Church'],
        friends: ['mike_rodriguez', 'diego_rodriguez', 'tony_rodriguez']
      },
      diego_rodriguez: {
        name: 'Diego Rodriguez',
        portraitKey: 'fb_l3_diego_rodriguez',
        isTarget: false,
        bio: 'GCC student. Comp Sci major. Future game dev. Currently just gaming.',
        location: 'Phoenix, Arizona',
        birthday: 'January 5, 2006',
        relationship: 'Single',
        workplace: 'Student at Glendale Community College',
        interests: ['Video Games', 'Programming', 'Anime', 'Skateboarding', 'YouTube'],
        groups: ['GCC Gaming Club', 'Arizona Esports', 'PC Master Race'],
        checkIns: ['Glendale Community College', 'GameStop', 'In-N-Out Burger'],
        friends: ['mike_rodriguez', 'carmen_rodriguez', 'tony_rodriguez']
      },
      tony_rodriguez: {
        name: 'Tony Rodriguez',
        portraitKey: 'fb_l3_tony_rodriguez',
        isTarget: false,
        bio: 'Building things since \'98. Foreman at Copper State Construction. Mike\'s little brother.',
        location: 'Tempe, Arizona',
        birthday: 'July 12, 1981',
        relationship: 'Divorced',
        workplace: 'Foreman at Copper State Construction',
        interests: ['Weightlifting', 'UFC', 'Trucks', 'Country Music', 'Poker Night'],
        groups: ['Arizona Construction Workers Union', 'Tempe Poker League', 'UFC Fight Club AZ'],
        checkIns: ['Copper State Construction HQ', 'LA Fitness Tempe', 'Twin Peaks Restaurant'],
        friends: ['mike_rodriguez', 'carmen_rodriguez', 'diego_rodriguez']
      }
    },

    posts: {
      mike_rodriguez: [
        {
          text: 'Something wrong with my email this morning. Keeps saying "session expired" and won\'t let me back in. Anybody else having issues?',
          time: '4 hours ago',
          likes: 3,
          comments: [
            { author: 'carmen_rodriguez', text: 'Is it your Gmail or your work Outlook acting up? If it\'s the shop email call that IT guy' },
            { author: 'mike_rodriguez', text: 'The personal one. I\'ll figure it out' },
            { author: 'diego_rodriguez', text: 'Dad just clear your cookies. Also change your password if it\'s being weird' }
          ],
          intel: { key: 'EMAIL_PROVIDER', value: 'Personal email is Gmail, work uses Outlook' }
        },
        {
          text: 'Got a pop-up on the computer saying "YOUR PC IS INFECTED - CALL THIS NUMBER IMMEDIATELY." Real official looking with a Microsoft logo. Almost called it. Closed it instead. These scammers are getting creative',
          time: '1 day ago',
          likes: 11,
          comments: [
            { author: 'tony_rodriguez', text: 'Bro didn\'t you already pay $200 to those fake Microsoft guys last year? Glad you learned lol' },
            { author: 'mike_rodriguez', text: 'Man shut up I don\'t need to be reminded' },
            { author: 'carmen_rodriguez', text: 'Tony don\'t be mean. At least he didn\'t fall for it this time' },
            { author: 'diego_rodriguez', text: 'Dad I told you to stop using Internet Explorer, use Chrome. IE hasn\'t been supported in years' }
          ],
          intel: { key: 'RECENT_SCAM', value: 'Paid $200 to fake Microsoft support last year' }
        },
        {
          text: 'Suns game tonight!! Who\'s coming?? Got 4 tickets, section 210. LET\'S GOOO',
          time: '3 days ago',
          likes: 19,
          comments: [
            { author: 'tony_rodriguez', text: 'I\'m in! Beers on you though' },
            { author: 'diego_rodriguez', text: 'Can\'t, got a study group. Take pics' },
            { author: 'carmen_rodriguez', text: 'Have fun boys. Don\'t stay out too late, you have an 8am appointment at the shop' }
          ],
          intel: null
        },
        {
          text: 'New brake pads, rotors, and a full fluid flush on a \'67 Mustang today. This is why I love my job',
          time: '5 days ago',
          likes: 27,
          imageKey: 'fb_l3_post_mustang_brakes',
          comments: [
            { author: 'tony_rodriguez', text: 'That thing is gorgeous. Owner wants to sell?' },
            { author: 'mike_rodriguez', text: 'Not a chance, he\'s had it since high school' }
          ],
          intel: null
        },
        {
          text: 'Why is my computer so slow today? Running the shop software and it takes 30 seconds to open anything',
          time: '2 days ago',
          likes: 2,
          comments: [
            { author: 'carmen_rodriguez', text: 'Just don\'t mess up QuickBooks, we need it for the shop. Tax season is coming' },
            { author: 'diego_rodriguez', text: 'How much RAM does that thing even have? You probably need to upgrade' },
            { author: 'mike_rodriguez', text: 'I don\'t know what RAM is, I fix cars not computers' }
          ],
          intel: { key: 'WORK_SOFTWARE', value: 'Uses QuickBooks for the auto repair shop' }
        }
      ],
      carmen_rodriguez: [
        {
          text: 'Made abuela\'s tamale recipe for the church potluck. Everyone asked for the recipe but that one stays in the family',
          time: '2 days ago',
          likes: 34,
          comments: [
            { author: 'mike_rodriguez', text: 'Best tamales in Phoenix and that\'s a fact' },
            { author: 'tony_rodriguez', text: 'Save me some!!' }
          ],
          intel: null
        },
        {
          text: 'So proud of Diego for making the Dean\'s List!! All that late night studying paid off. My baby is growing up',
          time: '4 days ago',
          likes: 42,
          comments: [
            { author: 'diego_rodriguez', text: 'Mom please stop calling me baby on here' },
            { author: 'mike_rodriguez', text: 'That\'s my boy!! Dinner anywhere you want this weekend, on me' },
            { author: 'tony_rodriguez', text: 'Nice work nephew! Smarter than your old man for sure' }
          ],
          intel: null
        },
        {
          text: 'Monday morning. Coffee. Flossing motivational poster. Let\'s do this. #DentalHygienistLife',
          time: '6 days ago',
          likes: 8,
          comments: [
            { author: 'mike_rodriguez', text: 'You\'re the only person I know who genuinely loves Mondays' }
          ],
          intel: null
        },
        {
          text: 'Mike just asked me how to "make the internet go faster." I love this man but technology is not his gift',
          time: '1 day ago',
          likes: 23,
          comments: [
            { author: 'tony_rodriguez', text: 'Lmaooo that tracks' },
            { author: 'diego_rodriguez', text: 'Mom tell him to restart the router. That fixes it like 90% of the time' },
            { author: 'mike_rodriguez', text: 'I can hear you all laughing from the other room' }
          ],
          intel: null
        }
      ],
      diego_rodriguez: [
        {
          text: 'Finally beat Elden Ring. 127 hours. No guides. I am a god',
          time: '3 days ago',
          likes: 15,
          comments: [
            { author: 'tony_rodriguez', text: 'Is that a video game? Go outside nephew' },
            { author: 'diego_rodriguez', text: 'OK boomer' }
          ],
          intel: null
        },
        {
          text: 'Built my first web app for my CS class!! It\'s a to-do list but still, I BUILT it. Runs on localhost and everything',
          time: '5 days ago',
          likes: 22,
          comments: [
            { author: 'carmen_rodriguez', text: 'I have no idea what that means but I\'m so proud!!' },
            { author: 'mike_rodriguez', text: 'Can you build something to make the shop computer faster?' },
            { author: 'diego_rodriguez', text: 'Dad that\'s not how it works lol' }
          ],
          intel: null
        },
        {
          text: 'Trying to help my dad with his computer over the phone is a special kind of torture. "Where\'s the search bar?" WHICH search bar Dad, there are 4 on your screen because you installed every toolbar known to man',
          time: '2 days ago',
          likes: 31,
          comments: [
            { author: 'mike_rodriguez', text: 'I did NOT install those, they just showed up' },
            { author: 'carmen_rodriguez', text: 'Be patient with your father mijo' },
            { author: 'diego_rodriguez', text: 'They "just showed up" because you click Yes on everything' }
          ],
          intel: null
        }
      ],
      tony_rodriguez: [
        {
          text: 'Another 12 hour day on the Scottsdale job. This sun is no joke. Hydrate or die, people',
          time: '1 day ago',
          likes: 9,
          comments: [
            { author: 'carmen_rodriguez', text: 'Stay safe out there Tony! I\'ll bring you boys lunch tomorrow' },
            { author: 'mike_rodriguez', text: 'Tough as nails, little bro' }
          ],
          intel: null
        },
        {
          text: 'Poker night this Friday. Bring cash, not excuses. Last time Mike wrote me an IOU on a napkin',
          time: '4 days ago',
          likes: 7,
          comments: [
            { author: 'mike_rodriguez', text: 'I paid you back! Eventually!' },
            { author: 'tony_rodriguez', text: '3 months later yeah' }
          ],
          intel: null
        },
        {
          text: 'New truck day!! 2024 F-150 in Velocity Blue. She\'s beautiful. Named her Azul',
          time: '1 week ago',
          likes: 35,
          imageKey: 'fb_l3_post_new_truck',
          comments: [
            { author: 'mike_rodriguez', text: 'Sharp!! Bring it by the shop I\'ll give her a once-over' },
            { author: 'carmen_rodriguez', text: 'Men and naming their trucks... congratulations Tony lol' },
            { author: 'diego_rodriguez', text: 'That color is actually sick' }
          ],
          intel: null
        }
      ]
    },

    intelKeys: [
      { key: 'EMAIL_PROVIDER', boost: 15, description: 'Personal email is Gmail' },
      { key: 'RECENT_SCAM', boost: 10, description: 'Paid $200 to fake Microsoft support before' },
      { key: 'COMPUTER_SETUP', boost: 8, description: 'Still uses Internet Explorer' },
      { key: 'WORK_SOFTWARE', boost: 5, description: 'Uses QuickBooks for business' }
    ]
  },

  // ─────────────────────────────────────────────
  // SUSAN LEE (52, Seattle WA, female)
  // ─────────────────────────────────────────────
  'Susan Lee': {
    profiles: {
      susan_lee: {
        name: 'Susan Lee',
        portraitKey: 'l3_victim_4',
        isTarget: true,
        bio: 'Loving wife and mom. Watercolor painter on the weekends. Seattle rain is my aesthetic.',
        location: 'Seattle, Washington',
        birthday: 'October 11, 1973',
        relationship: 'Married to David Lee',
        workplace: 'Administrative Coordinator at UW Medical Center',
        interests: ['Watercolor Painting', 'Gardening', 'Cooking', 'Farmers Markets', 'K-Dramas'],
        groups: ['Seattle Watercolor Society', 'Bellevue Korean Community', 'Pike Place Market Fans'],
        checkIns: ['Pike Place Market', 'UW Medical Center', 'Bellevue Botanical Garden', 'H Mart'],
        friends: ['david_lee', 'kevin_lee', 'janet_park']
      },
      david_lee: {
        name: 'David Lee',
        portraitKey: 'fb_l3_david_lee',
        isTarget: false,
        bio: 'Aerospace engineer at Boeing. Weekend golfer. Terrible singer, great dad.',
        location: 'Seattle, Washington',
        birthday: 'April 2, 1970',
        relationship: 'Married to Susan Lee',
        workplace: 'Senior Systems Engineer at Boeing',
        interests: ['Golf', 'Aviation', 'Woodworking', 'Scotch Whisky', 'NPR'],
        groups: ['Boeing Employees Golf League', 'Seattle Woodworkers Guild', 'Aviation History Buffs'],
        checkIns: ['Boeing Everett Factory', 'Newcastle Golf Club', 'Lowe\'s - Bellevue'],
        friends: ['susan_lee', 'kevin_lee', 'janet_park']
      },
      kevin_lee: {
        name: 'Kevin Lee',
        portraitKey: 'fb_l3_kevin_lee',
        isTarget: false,
        bio: 'New grad at Amazon. SDE1. Surviving on coffee and stock vesting schedules. Go Huskies!',
        location: 'Seattle, Washington',
        birthday: 'December 20, 2001',
        relationship: 'In a Relationship',
        workplace: 'Software Development Engineer at Amazon',
        interests: ['Tech', 'Basketball', 'Coffee', 'Photography', 'Sneakers'],
        groups: ['Amazon New Grads 2025', 'UW Alumni Network', 'Seattle Tech Workers'],
        checkIns: ['Amazon HQ2 - Bellevue', 'Storyville Coffee', 'Climate Pledge Arena'],
        friends: ['susan_lee', 'david_lee', 'janet_park']
      },
      janet_park: {
        name: 'Janet Park',
        portraitKey: 'fb_l3_janet_park',
        isTarget: false,
        bio: 'Nail salon owner. Susan\'s little sister. Dog mom to Boba. Living my best life.',
        location: 'Bellevue, Washington',
        birthday: 'May 25, 1976',
        relationship: 'Married to Steve Park',
        workplace: 'Owner, Luxe Nails & Spa',
        interests: ['Nail Art', 'Shopping', 'K-Pop', 'Hiking', 'Small Business Life'],
        groups: ['Bellevue Small Business Association', 'K-Pop Fan Club PNW', 'Nail Tech Community'],
        checkIns: ['Luxe Nails & Spa', 'Bellevue Square', 'H Mart', 'Din Tai Fung'],
        friends: ['susan_lee', 'david_lee', 'kevin_lee']
      }
    },

    posts: {
      susan_lee: [
        {
          text: 'Online shopping is dangerous. I just spent 2 hours on Nordstrom\'s website and my cart has 14 items in it. Someone stop me',
          time: '5 hours ago',
          likes: 12,
          comments: [
            { author: 'janet_park', text: 'DON\'T STOP. Treat yourself unnie!!' },
            { author: 'david_lee', text: 'Make sure you\'re on the real Chase site when you check out, not a fake one. Those phishing emails have been going around again' },
            { author: 'susan_lee', text: 'David I know how to shop online' },
            { author: 'kevin_lee', text: 'Mom just use the app, it\'s safer than the browser' }
          ],
          intel: { key: 'BANKING_INFO', value: 'Banks with Chase, husband warns about phishing' }
        },
        {
          text: 'My computer is doing that thing again where Safari freezes and I have to force quit everything. So frustrating. I was in the middle of editing my watercolors for the gallery submission!',
          time: '1 day ago',
          likes: 6,
          comments: [
            { author: 'kevin_lee', text: 'Mom your MacBook is fine, just close Safari and reopen it. How many tabs do you have open? Be honest' },
            { author: 'susan_lee', text: '... a few' },
            { author: 'janet_park', text: 'Remember that "Apple support" call you got? Kevin was so mad lol' },
            { author: 'kevin_lee', text: 'I WAS mad. Apple does NOT cold call people. That was 100% a scam' },
            { author: 'susan_lee', text: 'I hung up before giving them anything so it\'s fine!!' }
          ],
          intel: { key: 'PREVIOUS_INCIDENT', value: 'Received a fake Apple support call, Kevin caught it' }
        },
        {
          text: 'New watercolor piece finished! Painted the view from Kerry Park at sunset. Thinking about submitting it to the Bellevue Arts Fair. Thoughts?',
          time: '3 days ago',
          likes: 47,
          imageKey: 'fb_l3_post_watercolor_kerry',
          comments: [
            { author: 'david_lee', text: 'It\'s beautiful honey. You should absolutely submit it' },
            { author: 'janet_park', text: 'GORGEOUS unnie!! I want a print for the salon!!' },
            { author: 'kevin_lee', text: 'This is really good Mom. Do it' }
          ],
          intel: null
        },
        {
          text: 'Made kimchi jjigae from Mom\'s recipe today. The apartment smells amazing (David disagrees but he\'ll eat 3 bowls anyway)',
          time: '5 days ago',
          likes: 21,
          comments: [
            { author: 'david_lee', text: 'I said it smells STRONG not bad. And yes I had 3 bowls. It was delicious' },
            { author: 'janet_park', text: 'Save some for me!!!' },
            { author: 'kevin_lee', text: 'Mom\'s jjigae hits different. Can I come over for dinner this weekend?' }
          ],
          intel: null
        },
        {
          text: 'Finally figured out how to order from H Mart online. David set it up on my laptop for me. Technology 1, Susan 0... well, maybe Susan 0.5 because I placed the order myself!',
          time: '2 days ago',
          likes: 15,
          comments: [
            { author: 'david_lee', text: 'Just use the Visa for online stuff, the Amex is for travel only. I don\'t want to sort out the statements again' },
            { author: 'susan_lee', text: 'Yes dear' },
            { author: 'janet_park', text: 'Haha you two. David is so particular about money stuff' }
          ],
          intel: { key: 'PAYMENT_METHOD', value: 'Has a Visa for everyday purchases and an Amex for travel' }
        }
      ],
      david_lee: [
        {
          text: 'Golf season is upon us. Newcastle was in perfect condition today. Shot an 84, which for me is basically a miracle',
          time: '2 days ago',
          likes: 11,
          comments: [
            { author: 'susan_lee', text: 'Congrats! I have no idea if that\'s good but you seem happy so' },
            { author: 'kevin_lee', text: 'Nice Dad! We should play together soon' }
          ],
          intel: null
        },
        {
          text: 'Finished the bookshelf for Susan\'s art studio. Red oak, hand-joined, Danish oil finish. Probably my best piece yet',
          time: '4 days ago',
          likes: 28,
          imageKey: 'fb_l3_post_bookshelf',
          comments: [
            { author: 'susan_lee', text: 'It\'s PERFECT. I love it so much. You\'re so talented' },
            { author: 'janet_park', text: 'David can you make me some shelves for the salon??' },
            { author: 'david_lee', text: 'For you Janet, of course. Give me dimensions' }
          ],
          intel: null
        },
        {
          text: '787 program update presentation went well today. 30 years in aerospace and I still get a kick out of watching these birds fly',
          time: '6 days ago',
          likes: 16,
          comments: [
            { author: 'kevin_lee', text: 'That\'s awesome Dad. Boeing is lucky to have you' },
            { author: 'susan_lee', text: 'My husband the rocket scientist (close enough)' }
          ],
          intel: null
        },
        {
          text: 'Weekend project: helping Susan set up her new printer. Estimated time: 15 minutes. Actual time: 3 hours and 2 trips to Best Buy',
          time: '1 week ago',
          likes: 19,
          comments: [
            { author: 'susan_lee', text: 'But it works now! And it prints my paintings beautifully!' },
            { author: 'kevin_lee', text: 'Printers are the worst technology ever invented. I\'m an engineer and I can\'t set them up either' }
          ],
          intel: null
        }
      ],
      kevin_lee: [
        {
          text: 'Survived my first month at Amazon. The coffee is free and the code reviews are brutal. Living the dream',
          time: '1 day ago',
          likes: 33,
          comments: [
            { author: 'susan_lee', text: 'So proud of you Kevin!! Eat real food please, not just coffee' },
            { author: 'david_lee', text: 'Welcome to the grind, son. It gets better. Or you get used to it. Same thing' },
            { author: 'janet_park', text: 'Our little Kevin all grown up! Can you get me an employee discount??' }
          ],
          intel: null
        },
        {
          text: 'Mom called me at work to ask why her "internet page" wasn\'t working. It was Safari. She had 43 tabs open. FORTY THREE',
          time: '3 days ago',
          likes: 26,
          comments: [
            { author: 'susan_lee', text: 'I need those tabs Kevin!! They have recipes and articles I\'m reading!' },
            { author: 'david_lee', text: 'She also has 3 toolbars installed somehow' },
            { author: 'janet_park', text: 'Haha at least she calls you and not some random number from a pop-up' },
            { author: 'kevin_lee', text: 'Don\'t even joke about that Janet' }
          ],
          intel: null
        },
        {
          text: 'Sneaker drop this Saturday. The new Jordan 4s in Military Blue. Setting 3 alarms',
          time: '5 days ago',
          likes: 14,
          imageKey: 'fb_l3_post_sneaker_jordans',
          comments: [
            { author: 'david_lee', text: 'You spend more on shoes than I spend on golf. Impressive' }
          ],
          intel: null
        }
      ],
      janet_park: [
        {
          text: 'Grand opening week at Luxe Nails 2.0! New location, bigger space, and Boba has his own corner with a dog bed. Come visit us in Bellevue!',
          time: '2 days ago',
          likes: 39,
          imageKey: 'fb_l3_post_salon_grand_opening',
          comments: [
            { author: 'susan_lee', text: 'So proud of you Janet!! I\'ll be there Saturday with David. Booked us both appointments' },
            { author: 'kevin_lee', text: 'Congrats Auntie!! The new place looks amazing' },
            { author: 'david_lee', text: 'Congratulations Janet! Susan has already decided on my nail color apparently' }
          ],
          intel: null
        },
        {
          text: 'Boba learned a new trick today. He can shake! My genius baby boy. Who says Shih Tzus aren\'t smart?',
          time: '4 days ago',
          likes: 25,
          imageKey: 'fb_l3_post_dog_shake',
          comments: [
            { author: 'susan_lee', text: 'He is the CUTEST. We need another puppy playdate with him' },
            { author: 'kevin_lee', text: 'Boba is literally my favorite member of this family' }
          ],
          intel: null
        },
        {
          text: 'Clients keep asking me about nail inspo. Made an Instagram for the salon! Follow us @luxenailsspa for designs and Boba content',
          time: '6 days ago',
          likes: 18,
          comments: [
            { author: 'susan_lee', text: 'Followed!! Your work is so beautiful Janet. I\'m always showing people my nails after I visit you' },
            { author: 'janet_park', text: 'My best advertisement right there' }
          ],
          intel: null
        }
      ]
    },

    intelKeys: [
      { key: 'BANKING_INFO', boost: 15, description: 'Banks with Chase' },
      { key: 'PREVIOUS_INCIDENT', boost: 10, description: 'Received a fake Apple support scam call' },
      { key: 'COMPUTER_DETAILS', boost: 8, description: 'Uses a MacBook with Safari' },
      { key: 'PAYMENT_METHOD', boost: 5, description: 'Visa for everyday, Amex for travel' }
    ]
  },

  // ─────────────────────────────────────────────
  // TOM ANDERSON (44, Minneapolis MN, male)
  // ─────────────────────────────────────────────
  'Tom Anderson': {
    profiles: {
      tom_anderson: {
        name: 'Tom Anderson',
        portraitKey: 'l3_victim_3',
        isTarget: true,
        bio: 'Project manager by day, hockey dad by night. Minnesota nice is not a myth.',
        location: 'Minneapolis, Minnesota',
        birthday: 'January 18, 1981',
        relationship: 'Married to Rachel Anderson',
        workplace: 'Senior Project Manager at Hennepin Health Systems',
        interests: ['Hockey', 'Fishing', 'Woodworking', 'Minnesota Wild', 'Home Improvement'],
        groups: ['Minnesota Wild Fanatics', 'Minneapolis Dads Club', 'Lake Minnetonka Fishing Association'],
        checkIns: ['Xcel Energy Center', 'Lake Minnetonka', 'Lowe\'s - Minnetonka', 'Target Center'],
        friends: ['rachel_anderson', 'zoe_anderson', 'walt_anderson']
      },
      rachel_anderson: {
        name: 'Rachel Anderson',
        portraitKey: 'fb_l3_rachel_anderson',
        isTarget: false,
        bio: 'Marketing consultant. Wine enthusiast. Perpetually cold. Zoe\'s #1 fan.',
        location: 'Minneapolis, Minnesota',
        birthday: 'September 7, 1983',
        relationship: 'Married to Tom Anderson',
        workplace: 'Independent Marketing Consultant (Anderson Creative)',
        interests: ['Marketing', 'Wine Tasting', 'Running', 'Interior Design', 'Podcasts'],
        groups: ['Minneapolis Marketing Professionals', 'Wine Club MN', 'Minneapolis Running Club'],
        checkIns: ['Anderson Creative (Home Office)', 'Spoon and Stable', 'Minnehaha Falls', 'France 44 Wine Bar'],
        friends: ['tom_anderson', 'zoe_anderson', 'walt_anderson']
      },
      zoe_anderson: {
        name: 'Zoe Anderson',
        portraitKey: 'fb_l3_zoe_anderson',
        isTarget: false,
        bio: 'Artist. 15. MCAD summer program. She/they. Art is life, everything else is homework.',
        location: 'Minneapolis, Minnesota',
        birthday: 'April 30, 2010',
        relationship: 'Single',
        workplace: 'Student at Southwest High School',
        interests: ['Digital Art', 'Painting', 'Studio Ghibli', 'Thrift Shopping', 'Spotify'],
        groups: ['Southwest Art Club', 'MCAD Teen Summer Program', 'Studio Ghibli Fan Club'],
        checkIns: ['Minneapolis Institute of Art', 'Southwest High School', 'Ragstock Vintage'],
        friends: ['tom_anderson', 'rachel_anderson', 'walt_anderson']
      },
      walt_anderson: {
        name: 'Walt Anderson',
        portraitKey: 'fb_l3_walt_anderson',
        isTarget: false,
        bio: 'Retired mechanic. 50 years turning wrenches. Now I just fix things around the house and drive Tom crazy.',
        location: 'St. Paul, Minnesota',
        birthday: 'June 3, 1953',
        relationship: 'Widowed',
        workplace: 'Anderson\'s Auto Service (Retired)',
        interests: ['Classic Cars', 'Fishing', 'Crossword Puzzles', 'Fox News', 'Coffee'],
        groups: ['St. Paul VFW Post 295', 'Minnesota Classic Car Club', 'Silver Sneakers Fitness'],
        checkIns: ['VFW Post 295', 'Keys Cafe', 'Tom\'s House', 'Lake Calhoun'],
        friends: ['tom_anderson', 'rachel_anderson', 'zoe_anderson']
      }
    },

    posts: {
      tom_anderson: [
        {
          text: 'Internet has been absolutely crawling all week. Can\'t even load a video without it buffering every 5 seconds. Working from home like this is impossible',
          time: '3 hours ago',
          likes: 5,
          comments: [
            { author: 'rachel_anderson', text: 'I\'m calling Comcast tomorrow, this is ridiculous. I have a client presentation on Thursday and I can\'t have it freezing' },
            { author: 'tom_anderson', text: 'Good because I\'ve been on hold with them for 45 minutes and gave up' },
            { author: 'zoe_anderson', text: 'The wifi in my room is literally nonexistent. I can\'t even upload my art portfolio' },
            { author: 'walt_anderson', text: 'In my day we had dial-up and we were happy about it' }
          ],
          intel: { key: 'ISP', value: 'Internet service provider is Comcast' }
        },
        {
          text: 'Laptop is running hot and making that fan noise again. Sounds like a jet engine taking off. Pretty sure it\'s on its last legs',
          time: '1 day ago',
          likes: 4,
          comments: [
            { author: 'zoe_anderson', text: 'Dad your HP laptop is from like 2018, just get a new one already' },
            { author: 'tom_anderson', text: 'It works fine! Mostly. Sometimes.' },
            { author: 'rachel_anderson', text: 'Tom it does NOT work fine. You complained about it 3 times yesterday' },
            { author: 'walt_anderson', text: 'Just take it to that Best Buy Geek Squad like last time. They fixed it before' }
          ],
          intel: { key: 'DEVICE_INFO', value: 'Uses an HP laptop from 2018, overheating issues' }
        },
        {
          text: 'Wild game last night was INSANE. OT winner in the last 30 seconds. Zoe pretended she didn\'t care but I saw her cheering',
          time: '3 days ago',
          likes: 18,
          comments: [
            { author: 'zoe_anderson', text: 'I was cheering because it meant you\'d finally stop yelling at the TV' },
            { author: 'rachel_anderson', text: 'The neighbors probably heard you Tom' },
            { author: 'walt_anderson', text: 'That\'s my boy! Wild are looking good this year' }
          ],
          intel: null
        },
        {
          text: 'Nothing like ice fishing on a Saturday morning. 14 degrees, thermos of coffee, no cell signal. Paradise.',
          time: '5 days ago',
          likes: 22,
          comments: [
            { author: 'walt_anderson', text: 'That\'s real living right there. You catch anything?' },
            { author: 'tom_anderson', text: 'Two walleye and a northern. Enough for dinner tonight' },
            { author: 'rachel_anderson', text: 'And I had a quiet house for 6 hours. Win-win' }
          ],
          intel: null
        },
        {
          text: 'Trying to get some work done from home but everything is running slow. Between video calls dropping and files taking forever to save, I\'m about to just drive to the office',
          time: '2 days ago',
          likes: 3,
          comments: [
            { author: 'rachel_anderson', text: 'Don\'t let them touch the laptop if you take it somewhere, all my client files are on there too. I need the Henderson deck by Friday' },
            { author: 'tom_anderson', text: 'I know I know. I\'ll back everything up first' },
            { author: 'walt_anderson', text: 'Just take it to that Best Buy Geek Squad like last time' }
          ],
          intel: { key: 'PREVIOUS_SUPPORT', value: 'Has used Best Buy Geek Squad for computer help before' }
        }
      ],
      rachel_anderson: [
        {
          text: 'Client presentation nailed!! New branding campaign for a Twin Cities restaurant group. Love what I do',
          time: '2 days ago',
          likes: 29,
          comments: [
            { author: 'tom_anderson', text: 'That\'s my girl!! You worked so hard on this one' },
            { author: 'zoe_anderson', text: 'The logo is really good Mom. I helped with the color palette btw' },
            { author: 'rachel_anderson', text: 'You did! Zoe picked the accent colors and they loved them' }
          ],
          intel: null
        },
        {
          text: 'Training for the Minneapolis Marathon in June. Did 8 miles today in 18 degree weather. I can\'t feel my face but my Garmin says I PR\'d so worth it??',
          time: '4 days ago',
          likes: 17,
          comments: [
            { author: 'tom_anderson', text: 'You\'re insane and I love you. Hot chocolate waiting when you get home' },
            { author: 'walt_anderson', text: 'You\'re tougher than Tom ever was!' }
          ],
          intel: null
        },
        {
          text: 'Working from the couch today because someone (Tom) is doing a video call in the office and the wifi can\'t handle us both. We need a better setup',
          time: '1 day ago',
          likes: 8,
          comments: [
            { author: 'tom_anderson', text: 'Blame Comcast not me!' },
            { author: 'zoe_anderson', text: 'We literally have the worst internet in the neighborhood. Maya next door has like 500 mbps' }
          ],
          intel: null
        },
        {
          text: 'Wine night with the girls tonight. I have earned this. Tom is on Zoe duty. Good luck honey',
          time: '6 days ago',
          likes: 14,
          comments: [
            { author: 'tom_anderson', text: 'We\'ll be fine! Pizza and a movie right Zoe?' },
            { author: 'zoe_anderson', text: 'Only if I pick the movie' },
            { author: 'tom_anderson', text: 'Deal' }
          ],
          intel: null
        }
      ],
      zoe_anderson: [
        {
          text: 'New digital painting!! Inspired by Spirited Away. Took 12 hours but really happy with how the water turned out. Swipe for process video',
          time: '2 days ago',
          likes: 41,
          imageKey: 'fb_l3_post_digital_painting',
          comments: [
            { author: 'rachel_anderson', text: 'Zoe this is STUNNING. You are so talented baby' },
            { author: 'tom_anderson', text: 'Wow Zo. This is incredible. You get the art gene from your mom' },
            { author: 'walt_anderson', text: 'I don\'t know what that movie is but the painting is very pretty Zoe' }
          ],
          intel: null
        },
        {
          text: 'Got accepted to the MCAD summer intensive!! 3 weeks of studio art with actual college professors. I\'m freaking out',
          time: '5 days ago',
          likes: 52,
          comments: [
            { author: 'rachel_anderson', text: 'SO PROUD OF YOU!!! We\'re celebrating tonight!!' },
            { author: 'tom_anderson', text: 'That\'s our girl!! MCAD here she comes!!' },
            { author: 'walt_anderson', text: 'Congratulations sweetheart! Grandma would be so proud' }
          ],
          intel: null
        },
        {
          text: 'Thrift haul today: vintage denim jacket ($8), 90s band tee ($3), and a frame for my art ($2). Total spent: $13. I am the queen of thrifting',
          time: '4 days ago',
          likes: 19,
          comments: [
            { author: 'rachel_anderson', text: 'Ok that jacket is actually amazing. Can I borrow it?' },
            { author: 'zoe_anderson', text: 'Absolutely not' }
          ],
          intel: null
        }
      ],
      walt_anderson: [
        {
          text: 'Beautiful morning at Keys Cafe. Eggs, bacon, pancakes, and the crossword. Retired life isn\'t so bad',
          time: '1 day ago',
          likes: 12,
          comments: [
            { author: 'tom_anderson', text: 'Save me a seat next time Dad. I miss our breakfasts' },
            { author: 'rachel_anderson', text: 'Walt you are living the dream' }
          ],
          intel: null
        },
        {
          text: 'Fixed Tom\'s garbage disposal today. He was going to call a plumber for a $5 part. I raised him better than that',
          time: '3 days ago',
          likes: 15,
          comments: [
            { author: 'tom_anderson', text: 'In my defense I didn\'t know it was a $5 part. Thanks Dad' },
            { author: 'rachel_anderson', text: 'Walt you are always saving us. What would we do without you??' },
            { author: 'walt_anderson', text: 'Pay a plumber $200 apparently' }
          ],
          intel: null
        },
        {
          text: 'VFW fish fry this Friday! $12 all you can eat. Best walleye in St. Paul. Bring the family Tom',
          time: '5 days ago',
          likes: 9,
          comments: [
            { author: 'tom_anderson', text: 'We\'ll be there! Zoe might even come if there\'s dessert' },
            { author: 'zoe_anderson', text: 'There better be pie' },
            { author: 'walt_anderson', text: 'There is always pie' }
          ],
          intel: null
        },
        {
          text: 'Tom says his computer is acting up again. That boy spends more time fighting with technology than using it. Takes after his old man I guess',
          time: '2 days ago',
          likes: 7,
          comments: [
            { author: 'tom_anderson', text: 'Dad you don\'t even have a computer' },
            { author: 'walt_anderson', text: 'Exactly. No problems' },
            { author: 'rachel_anderson', text: 'He has a point Tom' }
          ],
          intel: null
        }
      ]
    },

    intelKeys: [
      { key: 'ISP', boost: 15, description: 'Internet provider is Comcast' },
      { key: 'DEVICE_INFO', boost: 10, description: 'Uses an HP laptop from 2018' },
      { key: 'PREVIOUS_SUPPORT', boost: 8, description: 'Has used Best Buy Geek Squad before' },
      { key: 'WORK_USAGE', boost: 5, description: 'Shares laptop with wife\'s client files' }
    ]
  }
};

export function getLevel3FriendBook(victimName) {
  return FRIENDBOOK_DATA[victimName] || null;
}
