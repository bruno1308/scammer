/**
 * FriendBook data for Level 3: Tech Support Scam
 * Difficulty: Clues buried in comment threads
 *
 * Intel is hidden in the back-and-forth comments on seemingly innocent posts.
 * The posts themselves are mundane -- players must read the replies carefully.
 *
 * Each victim has a unique scam variant:
 *   Karen Thompson: antivirus_expiry (Norton antivirus licence expired)
 *   Mike Rodriguez: email_compromise (Email account sent unauthorized messages)
 *   Susan Lee:      banking_alert (Unrecognized login to bank account)
 *   Tom Anderson:   subscription_trap (Free trial auto-renewed at $399/year)
 *
 * Intel categories:
 *   angle (15)       - The tech problem they actually have. Reveals the scam variant.
 *   corroborating (10) - A second data point confirming the story.
 *   emotional (8)    - Why this scares them specifically.
 *   timing (5)       - When the problem happened. No script unlock, just call boost.
 */

const FRIENDBOOK_DATA = {

  // -----------------------------------------------
  // KAREN THOMPSON (35, Denver CO, female)
  // Scam variant: antivirus_expiry
  // -----------------------------------------------
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
          // MUNDANE POST: meal prepping photo. Intel buried in the comment thread
          // where Diane asks about Karen's computer and Brian reveals the Norton issue.
          text: 'Sunday meal prep complete! 5 days of lunches, 3 dinners, AND a batch of energy balls. I am a MACHINE today. Someone give me an award',
          time: '3 hours ago',
          likes: 22,
          comments: [
            { author: 'brian_thompson', text: 'Babe you made my lunch for the week?? You are a saint' },
            { author: 'diane_morrison', text: 'Oh Karen that looks wonderful! By the way how is your computer doing? Still acting up?' },
            { author: 'karen_thompson', text: 'UGH don\'t remind me Mom. Pop-ups everywhere and everything is slow. Brian says it\'s because the Norton thing expired like 3 weeks ago' },
            { author: 'brian_thompson', text: 'I keep saying I\'ll renew it but work has been insane. Karen please don\'t click anything weird in the meantime' },
            { author: 'karen_thompson', text: 'I\'m not clicking anything!! But it\'s been like this for weeks and it\'s getting worse' }
          ],
          intel: { key: 'NORTON_EXPIRY', value: 'Norton antivirus expired about 3 weeks ago, computer unprotected since' }
        },
        {
          // MUNDANE POST: Target shopping. Intel buried in comment where Karen
          // complains about pop-ups and computer being slow -- confirms malware symptoms.
          text: 'Does anyone else just go to Target for one thing and leave with $200 worth of stuff?? Just me?? Ok cool',
          time: '1 day ago',
          likes: 45,
          comments: [
            { author: 'diane_morrison', text: 'That\'s what your father used to say about Home Depot haha' },
            { author: 'karen_thompson', text: 'Speaking of spending money I need a new computer at this rate. Mine keeps freezing and I got this pop-up that said I had 47 threats detected. Almost had a heart attack' },
            { author: 'brian_thompson', text: 'Karen. Those pop-ups ARE the threat. They\'re fake. Your computer is just slow because you have no antivirus running and probably picked up some adware' },
            { author: 'karen_thompson', text: 'Well it\'s also doing this thing where random tabs open by themselves when I\'m browsing. Is THAT normal??' },
            { author: 'brian_thompson', text: 'No that is definitely not normal. I\'ll clean it up this weekend I promise' }
          ],
          intel: { key: 'MALWARE_SYMPTOMS', value: 'Computer is slow, fake pop-ups, random tabs opening -- classic adware symptoms since Norton expired' }
        },
        {
          // MUNDANE POST: Lily's gymnastics. Intel buried in Karen's worried
          // comment about her work files being on the computer.
          text: 'Lily\'s gymnastics recital is next Saturday! She\'s been practicing her cartwheel for weeks. So proud of this kiddo',
          time: '2 days ago',
          likes: 24,
          comments: [
            { author: 'diane_morrison', text: 'I will be there with my camera!! Front row grandma!!' },
            { author: 'brian_thompson', text: 'She nailed it at practice yesterday. Going to be great' },
            { author: 'karen_thompson', text: 'I need to make the recital program on my computer and I\'m honestly terrified I\'ll lose the file. All my work stuff from the pediatrics office is on there too. Patient scheduling templates, billing reports... if I lose those I am SO screwed' },
            { author: 'brian_thompson', text: 'I told you to use the cloud backup. Please tell me you at least saved the billing stuff somewhere else' },
            { author: 'karen_thompson', text: 'Define "somewhere else"' },
            { author: 'brian_thompson', text: 'Karen.' }
          ],
          intel: { key: 'WORK_FILES_FEAR', value: 'Karen has important work files (patient scheduling, billing) on the computer and is terrified of losing them' }
        },
        {
          // MUNDANE POST: weekend hiking photo. Intel buried in a comment about
          // when exactly the Norton subscription lapsed.
          text: 'Hiked Lookout Mountain with the fam this morning! Lily made it all the way to the top without complaining once. She\'s getting so strong',
          time: '4 days ago',
          likes: 31,
          imageKey: 'fb_l3_post_family_drawing',
          comments: [
            { author: 'diane_morrison', text: 'What a beautiful day for it! Lily looks so happy!' },
            { author: 'brian_thompson', text: 'Great morning. Almost makes up for the fact that I spent Friday night trying to figure out why Karen\'s Norton auto-renew failed' },
            { author: 'karen_thompson', text: 'Wait so when did it actually expire?? You set it up last year right?' },
            { author: 'brian_thompson', text: 'It expired January 28th. The card on file was the old Chase debit card we cancelled. So it just silently stopped renewing. I only noticed when the pop-ups started around mid-February' },
            { author: 'karen_thompson', text: 'So I\'ve been unprotected for like a MONTH?! Brian!!' }
          ],
          intel: { key: 'EXPIRY_DATE', value: 'Norton expired January 28th when the linked Chase card was cancelled. Unprotected for about a month.' }
        },
        {
          // MUNDANE POST: coffee morning. No intel.
          text: 'Monday morning. Coffee is the only reason I function before 9am. This is not a personality trait, this is a medical necessity',
          time: '5 days ago',
          likes: 38,
          comments: [
            { author: 'diane_morrison', text: 'You sound just like your father! He couldn\'t form sentences without his morning cup' },
            { author: 'brian_thompson', text: 'Can confirm. She is not a person before coffee. Just a Karen-shaped warning sign' }
          ],
          intel: null
        },
        {
          // MUNDANE POST: Lily drawing. No intel.
          text: 'Lily drew a "family portrait" and apparently I have purple hair and dad is a stick figure with a laptop for a head. She\'s not wrong honestly',
          time: '6 days ago',
          likes: 41,
          comments: [
            { author: 'brian_thompson', text: 'I mean... she\'s not wrong about the laptop head thing' },
            { author: 'diane_morrison', text: 'That is going right on my fridge!! What an artist!' }
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
          text: 'Anyone else think the Dell XPS line has gone downhill? Karen\'s is fine hardware-wise but my old Thinkpad was indestructible',
          time: '5 days ago',
          likes: 6,
          comments: [
            { author: 'karen_thompson', text: 'My Dell is NOT fine, it hates me' },
            { author: 'brian_thompson', text: 'It\'s fine, you just have 47 Chrome tabs open at all times and no antivirus running' }
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
      { key: 'NORTON_EXPIRY', boost: 15, description: 'Norton antivirus expired weeks ago, computer unprotected', callHint: 'Reference the expired Norton subscription to establish the antivirus_expiry scam variant', category: 'angle', unlocks: [0, 1] },
      { key: 'MALWARE_SYMPTOMS', boost: 10, description: 'Pop-ups, slowness, random tabs opening -- adware symptoms', callHint: 'Describe exactly the symptoms she is experiencing to prove you can see her system', category: 'corroborating', unlocks: [2] },
      { key: 'WORK_FILES_FEAR', boost: 8, description: 'Terrified of losing work files (patient scheduling, billing)', callHint: 'Warn that the infection could destroy her important work files to create urgency', category: 'emotional', unlocks: [3] },
      { key: 'EXPIRY_DATE', boost: 5, description: 'Norton expired January 28th, unprotected for about a month', callHint: 'Cite the exact expiry date to sound like you have her account records', category: 'timing', unlocks: [] }
    ]
  },

  // -----------------------------------------------
  // MIKE RODRIGUEZ (48, Phoenix AZ, male)
  // Scam variant: email_compromise
  // -----------------------------------------------
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
          // MUNDANE POST: Suns game. Intel buried in comment thread where
          // Tony and Carmen mention getting weird emails from Mike's address.
          text: 'Suns game tonight!! Who\'s coming?? Got 4 tickets, section 210. LET\'S GOOO',
          time: '4 hours ago',
          likes: 19,
          comments: [
            { author: 'tony_rodriguez', text: 'I\'m in! Beers on you though' },
            { author: 'carmen_rodriguez', text: 'Have fun boys. Mike btw did you send Tony and me some weird email about a "security alert" this morning? It didn\'t look like you' },
            { author: 'mike_rodriguez', text: 'What?? No I definitely didn\'t send anything like that. Let me check' },
            { author: 'tony_rodriguez', text: 'Yeah bro I got one too. Said something about verifying my identity. From your Gmail. I just deleted it' },
            { author: 'diego_rodriguez', text: 'Dad your email might be compromised. DON\'T click anything in your sent folder until I look at it. I\'ll come by after class' }
          ],
          intel: { key: 'WEIRD_EMAILS', value: 'Mike\'s Gmail sent unauthorized security alert emails to family members (Carmen and Tony)' }
        },
        {
          // MUNDANE POST: Mustang job at the shop. Intel buried in comment
          // thread where Carmen mentions which email service he uses.
          text: 'New brake pads, rotors, and a full fluid flush on a \'67 Mustang today. This is why I love my job',
          time: '1 day ago',
          likes: 27,
          imageKey: 'fb_l3_post_mustang_brakes',
          comments: [
            { author: 'tony_rodriguez', text: 'That thing is gorgeous. Owner wants to sell?' },
            { author: 'mike_rodriguez', text: 'Not a chance, he\'s had it since high school' },
            { author: 'carmen_rodriguez', text: 'Mike you still haven\'t replied to the parts supplier email I forwarded. Check your Gmail, I sent it to your personal not the shop Outlook' },
            { author: 'mike_rodriguez', text: 'My Gmail has been weird lately, keeps logging me out. I\'ll check it when I get home' },
            { author: 'diego_rodriguez', text: 'Dad if it keeps logging you out that\'s a really bad sign. Someone might have changed your password settings' }
          ],
          intel: { key: 'EMAIL_PROVIDER', value: 'Personal email is Gmail (keeps getting logged out), work email is Outlook for the shop' }
        },
        {
          // MUNDANE POST: BBQ cookout recap. Intel buried in comment where
          // Tony reveals Mike's boss at the parts distributor got one of the spam emails.
          text: 'Sunday cookout was a hit. Brisket was perfect, 14 hours low and slow. Carmen\'s elote dip disappeared in about 5 minutes flat',
          time: '3 days ago',
          likes: 34,
          comments: [
            { author: 'carmen_rodriguez', text: 'I told you I need to make double next time! Everyone loved it' },
            { author: 'tony_rodriguez', text: 'Bro that brisket was ELITE. Best you\'ve ever done' },
            { author: 'tony_rodriguez', text: 'Oh hey btw, your buddy Ray from Desert Auto Parts texted me asking if you got hacked. He said he got some email from your address asking him to "verify account details." He almost clicked it because he thought it was shop business' },
            { author: 'mike_rodriguez', text: 'Oh no. Ray is one of my biggest parts suppliers. That\'s not good. How many people got that??' },
            { author: 'carmen_rodriguez', text: 'Mike this is serious, if your business contacts got those emails it could hurt the shop\'s reputation. Call Diego' }
          ],
          intel: { key: 'CONTACTS_AFFECTED', value: 'Mike\'s business contact Ray (parts supplier) received the spam email -- professional reputation at stake' }
        },
        {
          // MUNDANE POST: fishing trip. Intel buried in the comment where
          // Diego pinpoints when the unauthorized emails started.
          text: 'Nothing like ice fishing on a Saturday morning. Lake Pleasant at sunrise, no phone, just peace and quiet. Caught two bass and a catfish',
          time: '5 days ago',
          likes: 16,
          comments: [
            { author: 'tony_rodriguez', text: 'Jealous bro. I was pouring concrete in 95 degree heat' },
            { author: 'diego_rodriguez', text: 'Dad while you were off the grid fishing on Saturday, that\'s when the first batch of weird emails went out. Carmen showed me the timestamp -- 10:47am Saturday. You were at the lake with no signal right?' },
            { author: 'mike_rodriguez', text: 'Yeah I didn\'t even have my phone on. So someone else was sending from my account while I was gone??' },
            { author: 'diego_rodriguez', text: 'Exactly. Someone got into your Gmail Saturday morning while you had no way to notice. Classic timing' }
          ],
          intel: { key: 'INCIDENT_DATE', value: 'Unauthorized emails started Saturday morning at 10:47am while Mike was fishing with no cell signal' }
        },
        {
          // MUNDANE POST: truck talk. No intel.
          text: 'Why is my computer so slow today? Running the shop software and it takes 30 seconds to open anything',
          time: '2 days ago',
          likes: 2,
          comments: [
            { author: 'carmen_rodriguez', text: 'Just don\'t mess up QuickBooks, we need it for the shop. Tax season is coming' },
            { author: 'diego_rodriguez', text: 'How much RAM does that thing even have? You probably need to upgrade' },
            { author: 'mike_rodriguez', text: 'I don\'t know what RAM is, I fix cars not computers' }
          ],
          intel: null
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
      { key: 'WEIRD_EMAILS', boost: 15, description: 'Family received unauthorized emails from Mike\'s address', callHint: 'Reference the suspicious emails his contacts received to establish the email_compromise scam variant', category: 'angle', unlocks: [0, 1] },
      { key: 'EMAIL_PROVIDER', boost: 10, description: 'Personal email is Gmail, work email is Outlook', callHint: 'Mention Gmail specifically and the logout issue to confirm you can see his account activity', category: 'corroborating', unlocks: [2] },
      { key: 'CONTACTS_AFFECTED', boost: 8, description: 'Business contact Ray got the spam -- professional reputation at risk', callHint: 'Warn that business contacts received the emails, threatening his shop\'s reputation', category: 'emotional', unlocks: [3] },
      { key: 'INCIDENT_DATE', boost: 5, description: 'Unauthorized emails started Saturday at 10:47am', callHint: 'Cite the Saturday morning timestamp to prove you have his account logs', category: 'timing', unlocks: [] }
    ]
  },

  // -----------------------------------------------
  // SUSAN LEE (52, Seattle WA, female)
  // Scam variant: banking_alert
  // -----------------------------------------------
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
          // MUNDANE POST: new watercolor piece. Intel buried in comment thread
          // where Janet and David discuss Susan doing banking on her old laptop.
          text: 'New watercolor piece finished! Painted the view from Kerry Park at sunset. Thinking about submitting it to the Bellevue Arts Fair. Thoughts?',
          time: '5 hours ago',
          likes: 47,
          imageKey: 'fb_l3_post_watercolor_kerry',
          comments: [
            { author: 'david_lee', text: 'It\'s beautiful honey. You should absolutely submit it' },
            { author: 'janet_park', text: 'GORGEOUS unnie!! I want a print for the salon!!' },
            { author: 'kevin_lee', text: 'This is really good Mom. Do it' },
            { author: 'janet_park', text: 'Unnie are you still using that ancient laptop to submit your art? David said the thing is like 8 years old' },
            { author: 'susan_lee', text: 'It works fine for painting! And I do everything on it, banking, email, shopping...' },
            { author: 'kevin_lee', text: 'Mom you do BANKING on an 8 year old laptop?? With no security updates?? Please tell me you\'re joking' },
            { author: 'susan_lee', text: 'Kevin it has a password! That counts as security!' }
          ],
          intel: { key: 'OLD_LAPTOP', value: 'Susan does banking, email, and shopping on an old 8-year-old laptop with no security updates' }
        },
        {
          // MUNDANE POST: H Mart order. Intel buried in comments about which bank she uses.
          text: 'Finally figured out how to order from H Mart online. David set it up on my laptop for me. Technology 1, Susan 0... well, maybe Susan 0.5 because I placed the order myself!',
          time: '1 day ago',
          likes: 15,
          comments: [
            { author: 'david_lee', text: 'Just use the Wells Fargo Visa for online stuff, the Amex is for travel only. I don\'t want to sort out the statements again' },
            { author: 'susan_lee', text: 'Yes dear' },
            { author: 'janet_park', text: 'Haha you two. David is so particular about the Wells Fargo account' },
            { author: 'kevin_lee', text: 'Mom please set up two-factor authentication on your bank. I can walk you through it this weekend' }
          ],
          intel: { key: 'BANK_NAME', value: 'Susan banks with Wells Fargo (Visa debit card), also has an Amex for travel' }
        },
        {
          // MUNDANE POST: kimchi recipe. Intel buried in comment where Susan
          // worries about her savings after seeing news about bank fraud.
          text: 'Made kimchi jjigae from Mom\'s recipe today. The apartment smells amazing (David disagrees but he\'ll eat 3 bowls anyway)',
          time: '3 days ago',
          likes: 21,
          comments: [
            { author: 'david_lee', text: 'I said it smells STRONG not bad. And yes I had 3 bowls. It was delicious' },
            { author: 'janet_park', text: 'Save some for me!!!' },
            { author: 'susan_lee', text: 'Janet did you see that news story about people having their bank accounts drained? Some kind of online hack. It scared me so much I almost moved our savings to a different account' },
            { author: 'janet_park', text: 'Unnie don\'t worry too much! Just be careful with your passwords' },
            { author: 'david_lee', text: 'Susan our retirement savings are fine. But Kevin is right that you should update your laptop and set up two-factor. We have a LOT in that account' }
          ],
          intel: { key: 'SAVINGS_WORRY', value: 'Susan is anxious about bank fraud after seeing news stories; has significant retirement savings she worries about' }
        },
        {
          // MUNDANE POST: farmers market. Intel buried in comment about when
          // she noticed something odd with her bank login.
          text: 'Pike Place on a Saturday morning is pure magic. Got heirloom tomatoes, fresh flowers, and the best cheese samples. Summer vibes in February',
          time: '5 days ago',
          likes: 28,
          comments: [
            { author: 'janet_park', text: 'I\'m so jealous! Boba and I need to come next time' },
            { author: 'susan_lee', text: 'Yes!! By the way something weird happened when I checked my bank on my phone after the market. It said there was a login from an "unrecognized device" last Tuesday evening. I just hit dismiss because I thought it was David\'s iPad' },
            { author: 'david_lee', text: 'That wasn\'t me, I haven\'t logged into our bank in weeks. Susan when exactly was this?' },
            { author: 'susan_lee', text: 'It said Tuesday at 9:47pm. I assumed it was you watching something on the iPad' },
            { author: 'kevin_lee', text: 'MOM. That is NOT something you just dismiss. I\'m calling you tonight' }
          ],
          intel: { key: 'LOGIN_TIMING', value: 'Unrecognized login to her bank account on Tuesday at 9:47pm, she dismissed the alert thinking it was David' }
        },
        {
          // MUNDANE POST: K-drama night. No intel.
          text: 'Started watching "Crash Landing on You" with David. He said he\'d only watch one episode. We\'re on episode six. I told you so',
          time: '2 days ago',
          likes: 33,
          comments: [
            { author: 'david_lee', text: 'The plot is... compelling. That\'s all I will say.' },
            { author: 'janet_park', text: 'David is a K-drama convert!! I KNEW IT!!' },
            { author: 'kevin_lee', text: 'Dad said he "doesn\'t watch Korean shows" three months ago. This is incredible' }
          ],
          intel: null
        },
        {
          // MUNDANE POST: garden update. No intel.
          text: 'My dahlias are finally blooming! After months of rain and patience, look at these beauties. Seattle gardens require a special kind of stubbornness',
          time: '6 days ago',
          likes: 19,
          comments: [
            { author: 'david_lee', text: 'You have earned those flowers. Your patience is unmatched' },
            { author: 'janet_park', text: 'I kill every plant I touch. Teach me your ways unnie!' }
          ],
          intel: null
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
      { key: 'OLD_LAPTOP', boost: 15, description: 'Does banking on an 8-year-old laptop with no security updates', callHint: 'Reference her insecure laptop to establish the banking_alert scam variant', category: 'angle', unlocks: [0, 1] },
      { key: 'BANK_NAME', boost: 10, description: 'Banks with Wells Fargo (Visa debit card)', callHint: 'Name Wells Fargo specifically to prove you are calling from her bank', category: 'corroborating', unlocks: [2] },
      { key: 'SAVINGS_WORRY', boost: 8, description: 'Anxious about bank fraud, has significant retirement savings', callHint: 'Play on her fear of losing her retirement savings to fraud', category: 'emotional', unlocks: [3] },
      { key: 'LOGIN_TIMING', boost: 5, description: 'Unrecognized bank login on Tuesday at 9:47pm', callHint: 'Cite the exact Tuesday 9:47pm login to sound like you have her account security logs', category: 'timing', unlocks: [] }
    ]
  },

  // -----------------------------------------------
  // TOM ANDERSON (44, Minneapolis MN, male)
  // Scam variant: subscription_trap
  // -----------------------------------------------
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
          // MUNDANE POST: internet complaint. Intel buried in comment thread
          // where Tom describes a pop-up about a subscription auto-renewal.
          text: 'Internet has been absolutely crawling all week. Can\'t even load a video without it buffering every 5 seconds. Working from home like this is impossible',
          time: '3 hours ago',
          likes: 5,
          comments: [
            { author: 'rachel_anderson', text: 'The wifi is terrible but also did you see that weird notification that popped up on your laptop? Something about a subscription renewing?' },
            { author: 'tom_anderson', text: 'Yeah I got this pop-up saying "Your CloudShield Pro free trial has auto-renewed at $399/year." I have NO idea what CloudShield Pro even is. I don\'t remember signing up for anything' },
            { author: 'zoe_anderson', text: 'Dad that sounds like a scam pop-up. Don\'t click it' },
            { author: 'tom_anderson', text: 'But what if it already charged me?? It had what looked like an order confirmation number and everything' },
            { author: 'walt_anderson', text: 'In my day software came in a box and you knew what you were paying for' }
          ],
          intel: { key: 'SUBSCRIPTION_POPUP', value: 'Tom got a pop-up saying CloudShield Pro free trial auto-renewed at $399/year with an order confirmation number' }
        },
        {
          // MUNDANE POST: Wild game. Intel buried in comment thread where
          // Rachel identifies the service name from the notification.
          text: 'Wild game last night was INSANE. OT winner in the last 30 seconds. Zoe pretended she didn\'t care but I saw her cheering',
          time: '1 day ago',
          likes: 18,
          comments: [
            { author: 'zoe_anderson', text: 'I was cheering because it meant you\'d finally stop yelling at the TV' },
            { author: 'rachel_anderson', text: 'The neighbors probably heard you Tom' },
            { author: 'walt_anderson', text: 'That\'s my boy! Wild are looking good this year' },
            { author: 'rachel_anderson', text: 'Tom btw I looked at that subscription thing on your laptop. It says "CloudShield Pro - Premium Security Suite" and it has a phone number to call to cancel. The confirmation page looks pretty official, has a logo and everything' },
            { author: 'tom_anderson', text: 'Should I call the number? I really don\'t want to get charged $399. That\'s insane for something I never signed up for' },
            { author: 'zoe_anderson', text: 'DAD NO. Don\'t call random numbers from pop-ups. Google the company first at least' }
          ],
          intel: { key: 'SERVICE_NAME', value: 'The subscription is called "CloudShield Pro - Premium Security Suite" with an official-looking cancellation page and phone number' }
        },
        {
          // MUNDANE POST: laptop overheating. Intel buried in comment thread
          // about Tom stressing about the $399 charge on top of other expenses.
          text: 'Laptop is running hot and making that fan noise again. Sounds like a jet engine taking off. Pretty sure it\'s on its last legs',
          time: '3 days ago',
          likes: 4,
          comments: [
            { author: 'zoe_anderson', text: 'Dad your HP laptop is from like 2018, just get a new one already' },
            { author: 'tom_anderson', text: 'Between Zoe\'s MCAD summer program fees, the new furnace, and now this mystery $399 subscription charge, a new laptop is NOT in the budget. I swear money just disappears' },
            { author: 'rachel_anderson', text: 'Tom we\'ll figure it out. The furnace was necessary and Zoe\'s program is an investment. Just cancel that subscription thing and we\'re fine' },
            { author: 'walt_anderson', text: 'Just take it to that Best Buy Geek Squad like last time. They fixed it before' },
            { author: 'tom_anderson', text: 'Can\'t afford that either right now Dad. Everything is piling up' }
          ],
          intel: { key: 'BUDGET_STRESS', value: 'Tom is stressed about money -- MCAD fees, new furnace, and now the $399 subscription charge on top of everything' }
        },
        {
          // MUNDANE POST: ice fishing. Intel buried in comment where Zoe
          // pinpoints when Tom first saw the subscription notification.
          text: 'Nothing like ice fishing on a Saturday morning. 14 degrees, thermos of coffee, no cell signal. Paradise.',
          time: '5 days ago',
          likes: 22,
          comments: [
            { author: 'walt_anderson', text: 'That\'s real living right there. You catch anything?' },
            { author: 'tom_anderson', text: 'Two walleye and a northern. Enough for dinner tonight' },
            { author: 'rachel_anderson', text: 'And I had a quiet house for 6 hours. Win-win' },
            { author: 'zoe_anderson', text: 'Dad wasn\'t that the day you came home and found the subscription pop-up? You said it was on the screen when you opened your laptop Wednesday night and it was still there when you got back from fishing Saturday' },
            { author: 'tom_anderson', text: 'Yeah it first showed up Wednesday evening. Been there every time I open the browser since. Can\'t figure out how to make it go away' }
          ],
          intel: { key: 'NOTIFICATION_DATE', value: 'The subscription pop-up first appeared Wednesday evening and has persisted since, showing every time he opens the browser' }
        },
        {
          // MUNDANE POST: work from home. No intel.
          text: 'Trying to get some work done from home but everything is running slow. Between video calls dropping and files taking forever to save, I\'m about to just drive to the office',
          time: '2 days ago',
          likes: 3,
          comments: [
            { author: 'rachel_anderson', text: 'I\'m calling Comcast tomorrow, this is ridiculous. I have a client presentation on Thursday' },
            { author: 'tom_anderson', text: 'Good because I\'ve been on hold with them for 45 minutes and gave up' },
            { author: 'walt_anderson', text: 'In my day we had dial-up and we were happy about it' }
          ],
          intel: null
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
      { key: 'SUBSCRIPTION_POPUP', boost: 15, description: 'Got a pop-up about CloudShield Pro auto-renewing at $399/year', callHint: 'Reference the CloudShield Pro subscription to establish the subscription_trap scam variant', category: 'angle', unlocks: [0, 1] },
      { key: 'SERVICE_NAME', boost: 10, description: 'The service is called CloudShield Pro - Premium Security Suite', callHint: 'Use the exact name "CloudShield Pro Premium Security Suite" to sound like official support', category: 'corroborating', unlocks: [2] },
      { key: 'BUDGET_STRESS', boost: 8, description: 'Financially stressed -- MCAD fees, furnace, can\'t afford $399', callHint: 'Emphasize that you can process a full refund to relieve the financial pressure', category: 'emotional', unlocks: [3] },
      { key: 'NOTIFICATION_DATE', boost: 5, description: 'Pop-up first appeared Wednesday evening, still persisting', callHint: 'Reference the Wednesday start date to prove you have his account renewal records', category: 'timing', unlocks: [] }
    ]
  }
};

export function getLevel3FriendBook(victimName) {
  return FRIENDBOOK_DATA[victimName] || null;
}

export { FRIENDBOOK_DATA as LEVEL3_DATA };
