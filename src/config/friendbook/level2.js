/**
 * FriendBook data for Level 2: IRS Tax Scam
 * Difficulty: Key clues on family member profiles, not the victim's own
 */

const FRIENDBOOK_DATA = {
  'David Chen': {
    profiles: {
      david_chen: {
        name: 'David Chen',
        portraitKey: 'l2_victim_1',
        isTarget: true,
        bio: 'Proud dad. Sacramento born and raised. Go Kings!',
        location: 'Sacramento, California',
        birthday: 'August 19, 1983',
        relationship: 'Married to Mei Chen',
        workplace: 'Senior Project Manager',
        interests: ['Basketball', 'Grilling', 'Home improvement', 'Photography'],
        groups: ['Sacramento Kings Fans', 'Arden Park Neighborhood Watch', 'Dad Life'],
        checkIns: ['Golden 1 Center', 'Home Depot', 'In-N-Out Burger'],
        friends: ['mei_chen', 'brandon_chen', 'lily_chen']
      },
      mei_chen: {
        name: 'Mei Chen',
        portraitKey: null,
        isTarget: false,
        bio: 'CPA by day, wine mom by night. Numbers are my love language.',
        location: 'Sacramento, California',
        birthday: 'April 3, 1986',
        relationship: 'Married to David Chen',
        workplace: 'Senior Accountant at Wallace & Associates',
        interests: ['Wine tasting', 'Yoga', 'True crime podcasts', 'Cooking'],
        groups: ['Sacramento Working Moms', 'Napa Valley Wine Club', 'Wallace & Associates Team'],
        checkIns: ['Whole Foods Market', 'CorePower Yoga', 'Wallace & Associates'],
        friends: ['david_chen', 'brandon_chen', 'lily_chen']
      },
      brandon_chen: {
        name: 'Brandon Chen',
        portraitKey: null,
        isTarget: false,
        bio: 'Soccer is life. #12. Sacramento United FC U-13',
        location: 'Sacramento, California',
        birthday: 'January 7, 2014',
        relationship: null,
        workplace: null,
        interests: ['Soccer', 'Minecraft', 'Pokemon cards', 'YouTube'],
        groups: ['Sacramento United FC Youth'],
        checkIns: ['Elk Grove Regional Park', 'Dave & Busters'],
        friends: ['david_chen', 'mei_chen', 'lily_chen']
      },
      lily_chen: {
        name: 'Lily Chen',
        portraitKey: null,
        isTarget: false,
        bio: 'Grateful grandmother. New chapter in Sacramento with my family.',
        location: 'Sacramento, California',
        birthday: 'November 22, 1957',
        relationship: 'Widowed',
        workplace: 'Retired — Former Teacher, San Francisco Unified',
        interests: ['Tai Chi', 'Mahjong', 'Gardening', 'Cooking'],
        groups: ['Sacramento Chinese Community Center', 'Tai Chi in the Park'],
        checkIns: ['Sacramento Chinese Community Center', 'Trader Joes'],
        friends: ['david_chen', 'mei_chen', 'brandon_chen']
      }
    },
    posts: {
      david_chen: [
        {
          text: 'Kings win!! What a game. Brandon and I lost our voices screaming in the third quarter. Father-son nights at Golden 1 never disappoint 🏀🔥',
          time: '1 day ago',
          likes: 24,
          comments: [
            { author: 'mei_chen', text: 'You two are STILL hoarse this morning 😂' },
            { author: 'brandon_chen', text: 'BEST NIGHT EVER DAD' }
          ],
          intel: null
        },
        {
          text: 'Weekend project: finally tackling the back deck. Only took me 6 months of "I\'ll get to it next weekend." Wish me luck.',
          time: '4 days ago',
          likes: 18,
          comments: [
            { author: 'mei_chen', text: 'I have been waiting since AUGUST, David. August.' },
            { author: 'lily_chen', text: 'My son is very handy! I will make lunch for the workers 😊' }
          ],
          intel: null
        },
        {
          text: 'Brandon scored the game winner in overtime today. 2-1!! This kid is going places. Proudest dad in Sacramento right now 😭⚽',
          time: '1 week ago',
          likes: 47,
          comments: [
            { author: 'mei_chen', text: 'I cried. Full on tears in the stands. No shame.' },
            { author: 'lily_chen', text: 'My grandson is a champion!! 🏆' }
          ],
          intel: null
        },
        {
          text: 'Beautiful Saturday morning. Mom is out doing tai chi in the park, Mei is at yoga, Brandon is at practice. Just me and the grill. Life is good.',
          time: '2 weeks ago',
          likes: 31,
          comments: [],
          intel: null
        }
      ],
      mei_chen: [
        {
          text: "SO proud of this guy!! David just got promoted to Senior Project Manager at Meridian Construction Group! All those late nights and weekend calls paid off. Celebratory dinner at the Firehouse tonight! 🥂🎉",
          time: '3 days ago',
          likes: 62,
          comments: [
            { author: 'david_chen', text: 'Babe you are embarrassing me 😅 but thank you ❤️' },
            { author: 'lily_chen', text: 'So proud of my son! You work so hard. You deserve this!' }
          ],
          intel: { key: 'EMPLOYER_NAME', value: "David works at Meridian Construction Group, recently promoted to Senior PM" }
        },
        {
          text: "Tax season is upon us 😩 At least we have Steve at H&R Block handling ours. I may be a CPA but I am NOT doing my own taxes. That's like a doctor operating on themselves. No thank you.",
          time: '1 week ago',
          likes: 34,
          comments: [
            { author: 'david_chen', text: 'Steve is the man. Been doing ours for 5 years now' },
            { author: 'lily_chen', text: 'Can Steve do mine too? I have so many forms this year with the move...' }
          ],
          intel: { key: 'TAX_FILING', value: "They use Steve at H&R Block for taxes, filing jointly" }
        },
        {
          text: "Kitchen renovation is FINALLY done!! Only took 3 months longer than quoted and cost... let's not talk about what it cost. But these countertops? Worth every penny. 😍",
          time: '2 weeks ago',
          likes: 53,
          comments: [
            { author: 'david_chen', text: 'I still have PTSD from picking tile samples' },
            { author: 'lily_chen', text: 'The kitchen is beautiful! I made dumplings on the new stove today. Perfect!' }
          ],
          intel: { key: 'RECENT_PURCHASE', value: "Major kitchen renovation recently completed, expensive" }
        },
        {
          text: 'Yoga then wine. The only acceptable order of operations on a Friday night. 🧘‍♀️🍷',
          time: '3 weeks ago',
          likes: 28,
          comments: [
            { author: 'david_chen', text: 'Save me a glass?' }
          ],
          intel: null
        },
        {
          text: "Brandon's report card came in — straight A's and a B+ in math. Not bad for a kid who 'doesn't like school.' Ice cream celebration tonight! 🍦",
          time: '1 month ago',
          likes: 41,
          comments: [
            { author: 'lily_chen', text: 'My smart grandson! The B+ will be an A next time, I will help him study 📚' }
          ],
          intel: null
        }
      ],
      brandon_chen: [
        {
          text: 'new cleats new me!! thanks mom and dad 🔥⚽',
          time: '5 days ago',
          likes: 15,
          comments: [
            { author: 'mei_chen', text: 'Score some goals in those please, they were not cheap 😂' }
          ],
          intel: null
        },
        {
          text: 'grandma made xiaolongbao today and i ate 14. new personal record',
          time: '1 week ago',
          likes: 22,
          comments: [
            { author: 'lily_chen', text: 'I will make more tomorrow! Growing boy needs food! 🥟' },
            { author: 'david_chen', text: 'That\'s my boy 💪' }
          ],
          intel: null
        },
        {
          text: 'minecraft tournament this weekend wish me luck!! my friend tyler and i have been practicing all week',
          time: '2 weeks ago',
          likes: 9,
          comments: [],
          intel: null
        }
      ],
      lily_chen: [
        {
          text: "New chapter! I have moved to Sacramento to live with my son David and his family. After 40 years in San Francisco it is hard to leave but being close to my grandson Brandon makes everything better. The house is so lively! 🏡❤️",
          time: '2 weeks ago',
          likes: 38,
          comments: [
            { author: 'david_chen', text: 'We love having you here Mom ❤️' },
            { author: 'mei_chen', text: 'Best decision ever! Brandon is SO happy to have nainai here every day' }
          ],
          intel: { key: 'MOTHER_LIVES_WITH', value: "Lily recently moved to Sacramento to live with David's family" }
        },
        {
          text: 'Found a wonderful Tai Chi group at the community center. Made three new friends already! Sacramento people are so friendly. 🌅',
          time: '1 week ago',
          likes: 19,
          comments: [
            { author: 'mei_chen', text: 'So glad you are settling in! ❤️' }
          ],
          intel: null
        },
        {
          text: 'My Brandon won his soccer game today! I do not understand all the rules but I cheer the loudest. The other grandparents told me so 😂',
          time: '1 week ago',
          likes: 44,
          comments: [
            { author: 'brandon_chen', text: 'GRANDMA you were SO LOUD i could hear you from the field 😂😂' },
            { author: 'david_chen', text: 'Mom you had a cowbell. A COWBELL.' }
          ],
          intel: null
        },
        {
          text: 'Learning to use this "FriendBook" so I can see my grandchild\'s photos. Technology is not easy but David is patient teacher. Hello everyone! 👋',
          time: '3 weeks ago',
          likes: 27,
          comments: [
            { author: 'mei_chen', text: 'Welcome to FriendBook mama Chen! 🎉' },
            { author: 'david_chen', text: 'You are doing great Mom!' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'EMPLOYER_NAME', boost: 15, description: "David's employer (Meridian Construction)" },
      { key: 'TAX_FILING', boost: 10, description: 'Tax preparer (Steve at H&R Block)' },
      { key: 'RECENT_PURCHASE', boost: 8, description: 'Recent kitchen renovation' },
      { key: 'MOTHER_LIVES_WITH', boost: 5, description: 'Mother recently moved in' }
    ]
  },

  'Maria Gonzalez': {
    profiles: {
      maria_gonzalez: {
        name: 'Maria Gonzalez',
        portraitKey: 'l2_victim_2',
        isTarget: true,
        bio: 'Mama bear. Girl Scout troop leader. Houston strong.',
        location: 'Houston, Texas',
        birthday: 'March 12, 1988',
        relationship: 'Married to Carlos Gonzalez',
        workplace: 'Office Manager at Lone Star Dental',
        interests: ['Baking', 'Girl Scouts', 'Crafts', 'Tejano music'],
        groups: ['Houston Girl Scout Leaders', 'Lone Star Dental Team', 'Heights Neighborhood Moms'],
        checkIns: ['Fiesta Mart', 'Hermann Park', 'Lone Star Dental'],
        friends: ['carlos_gonzalez', 'sofia_gonzalez', 'diego_morales']
      },
      carlos_gonzalez: {
        name: 'Carlos Gonzalez',
        portraitKey: null,
        isTarget: false,
        bio: 'Shift supervisor at Valero. Proud Texan. Astros forever.',
        location: 'Houston, Texas',
        birthday: 'July 28, 1985',
        relationship: 'Married to Maria Gonzalez',
        workplace: 'Shift Supervisor at Valero Energy — Houston Refinery',
        interests: ['Baseball', 'Fishing', 'BBQ', 'Trucks'],
        groups: ['Valero Houston Crew', 'Astros Nation', 'Texas Bass Fishing Club'],
        checkIns: ['Minute Maid Park', 'Academy Sports', 'Valero Houston Refinery'],
        friends: ['maria_gonzalez', 'sofia_gonzalez', 'diego_morales']
      },
      sofia_gonzalez: {
        name: 'Sofia Gonzalez',
        portraitKey: null,
        isTarget: false,
        bio: 'Girl Scout Brownie! 🍪 I love my cat Luna and soccer!',
        location: 'Houston, Texas',
        birthday: 'September 5, 2017',
        relationship: null,
        workplace: null,
        interests: ['Girl Scouts', 'Soccer', 'Drawing', 'Cats'],
        groups: ['Brownie Troop 4817'],
        checkIns: ['Hermann Park', 'Houston Zoo'],
        friends: ['maria_gonzalez', 'carlos_gonzalez', 'diego_morales']
      },
      diego_morales: {
        name: 'Diego Morales',
        portraitKey: null,
        isTarget: false,
        bio: 'Immigration attorney. Fighting the good fight. Maria\'s little brother (she reminds me daily).',
        location: 'Houston, Texas',
        birthday: 'December 1, 1990',
        relationship: 'Single',
        workplace: 'Associate Attorney at Morales & Vega Immigration Law',
        interests: ['Running', 'Legal podcasts', 'Cooking', 'Soccer'],
        groups: ['Houston Bar Association', 'Texas Immigration Lawyers Network', 'Heights Running Club'],
        checkIns: ['Buffalo Bayou Trail', 'Morales & Vega Immigration Law'],
        friends: ['maria_gonzalez', 'carlos_gonzalez', 'sofia_gonzalez']
      }
    },
    posts: {
      maria_gonzalez: [
        {
          text: "Girl Scout cookie season is HERE and Troop 4817 is ready to crush it! Sofia's goal is 200 boxes. If anyone wants Thin Mints, you know where to find us 🍪💪",
          time: '2 days ago',
          likes: 36,
          comments: [
            { author: 'carlos_gonzalez', text: 'I already ate a whole box of Samoas. For quality control purposes.' },
            { author: 'diego_morales', text: 'Put me down for 5 boxes. Actually 7. Actually just bring everything you have.' }
          ],
          intel: null
        },
        {
          text: "Date night with this handsome man! Dinner at Pappasito's and then a movie. Grandma has Sofia for the night. We are FREEEE 😂🥂",
          time: '5 days ago',
          likes: 42,
          comments: [
            { author: 'carlos_gonzalez', text: 'Best night out in months babe ❤️' }
          ],
          intel: null
        },
        {
          text: 'Monday motivation: 4 loads of laundry, 2 dozen cupcakes for the bake sale, 1 vet appointment for Luna, and somehow still need to meal prep for the week. Moms are built different. 💪',
          time: '1 week ago',
          likes: 54,
          comments: [
            { author: 'diego_morales', text: 'Sis you are a superhero fr' },
            { author: 'carlos_gonzalez', text: 'I can help with the— actually nvm you do it better 😅' }
          ],
          intel: null
        },
        {
          text: "Beautiful Sunday at Hermann Park with the family. Sofia fed the ducks, Carlos fell asleep on the blanket within 5 minutes. Classic. 🦆☀️",
          time: '2 weeks ago',
          likes: 29,
          comments: [
            { author: 'sofia_gonzalez', text: 'the ducks liked the bread i gave them!!' }
          ],
          intel: null
        }
      ],
      carlos_gonzalez: [
        {
          text: "12 hour shift at Valero but the overtime is worth it. Gotta keep the lights on and Sofia in Girl Scout uniforms. Houston refinery crew putting in work 💪⛽",
          time: '3 days ago',
          likes: 18,
          comments: [
            { author: 'maria_gonzalez', text: 'My hardworking husband ❤️ Come home safe' }
          ],
          intel: { key: 'HUSBAND_EMPLOYER', value: "Carlos works at Valero Energy, Houston Refinery" }
        },
        {
          text: "Y'all Maria's Etsy shop is actually blowing up?? She sold 30 custom cake toppers last month alone. My wife is a whole entrepreneur on the side and still runs the house like a boss 🎂👑",
          time: '1 week ago',
          likes: 57,
          comments: [
            { author: 'maria_gonzalez', text: 'CARLOS why did you post this 😳 it is just a little side thing' },
            { author: 'diego_morales', text: 'Maria you need a business license for real though. Let me help you set that up sis' }
          ],
          intel: { key: 'SIDE_BUSINESS', value: "Maria has an Etsy shop selling custom cake toppers, significant side income" }
        },
        {
          text: "You are NOT going to believe this. Maria scratched a lottery ticket at Fiesta Mart and won $500!! We never win anything!! Steak dinner tonight baby 🥩🎰",
          time: '2 weeks ago',
          likes: 71,
          comments: [
            { author: 'maria_gonzalez', text: 'I literally screamed in the store. The cashier thought something was wrong 😂' },
            { author: 'diego_morales', text: 'Hey Maria remember your favorite brother when tax time comes 😂 jk congrats!!' }
          ],
          intel: { key: 'RECENT_WINDFALL', value: "Won $500 on a scratch-off lottery ticket recently" }
        },
        {
          text: 'Astros spring training starts next week. This is our year. I can feel it. ⚾🤠',
          time: '3 weeks ago',
          likes: 22,
          comments: [],
          intel: null
        },
        {
          text: 'New truck day!! 2024 Silverado. Carlos is a happy man. Maria is... less happy about the payments 😂🛻',
          time: '1 month ago',
          likes: 45,
          comments: [
            { author: 'maria_gonzalez', text: 'It is very nice. The PAYMENTS are not very nice. 😑' },
            { author: 'diego_morales', text: 'Bro that thing is clean 🔥' }
          ],
          intel: null
        }
      ],
      sofia_gonzalez: [
        {
          text: 'luna is wearing the sweater i made her!! she looks so pretty 🐱💕',
          time: '4 days ago',
          likes: 23,
          comments: [
            { author: 'maria_gonzalez', text: 'Luna looks adorable mija! You are so creative!' },
            { author: 'carlos_gonzalez', text: 'That cat lives better than me tbh' }
          ],
          intel: null
        },
        {
          text: 'i sold 12 boxes of cookies today at the table!! im gonna reach my goal!!!',
          time: '1 week ago',
          likes: 19,
          comments: [
            { author: 'diego_morales', text: 'Sofia you are a sales MACHINE. Future CEO over here.' }
          ],
          intel: null
        }
      ],
      diego_morales: [
        {
          text: "Tax season reminder: if you have any immigration-related tax questions, my firm does free consultations. Also helped my sister Maria and Carlos with their return this year since their usual guy was booked. Turns out being a lawyer is good for something 😂📋",
          time: '5 days ago',
          likes: 28,
          comments: [
            { author: 'maria_gonzalez', text: 'Thank you hermanito! You saved us the H&R Block fee this year 🙏' },
            { author: 'carlos_gonzalez', text: 'Diego is the family MVP right now' }
          ],
          intel: { key: 'TAX_PREP', value: "Diego (brother/immigration lawyer) helped prepare Maria and Carlos's taxes this year" }
        },
        {
          text: 'Won my client\'s asylum case today. 3 years of fighting and we finally got the approval. This is why I do this work. 🇺🇸⚖️',
          time: '1 week ago',
          likes: 94,
          comments: [
            { author: 'maria_gonzalez', text: 'SO proud of you little brother!! 😭❤️' },
            { author: 'carlos_gonzalez', text: 'Respect bro. Doing important work out here.' }
          ],
          intel: null
        },
        {
          text: 'Buffalo Bayou at 6am before anyone else is awake. Best running trail in Houston. Peace and quiet before the chaos starts. 🏃‍♂️🌅',
          time: '2 weeks ago',
          likes: 16,
          comments: [],
          intel: null
        },
        {
          text: "Sofia asked me to buy 10 boxes of Girl Scout cookies. I said 3. She negotiated me up to 8. This child is going to be a better lawyer than me someday.",
          time: '3 weeks ago',
          likes: 38,
          comments: [
            { author: 'maria_gonzalez', text: 'She gets it from her mama 😂' },
            { author: 'sofia_gonzalez', text: 'thank you tio diego!!!!! 🍪🍪🍪' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'HUSBAND_EMPLOYER', boost: 15, description: "Husband works at Valero Energy" },
      { key: 'SIDE_BUSINESS', boost: 10, description: 'Etsy shop side income' },
      { key: 'TAX_PREP', boost: 8, description: 'Brother prepared their taxes' },
      { key: 'RECENT_WINDFALL', boost: 5, description: '$500 lottery scratch-off win' }
    ]
  },

  'James Wilson': {
    profiles: {
      james_wilson: {
        name: 'James Wilson',
        portraitKey: 'l2_victim_3',
        isTarget: true,
        bio: 'Chicago guy. Bears fan (unfortunately). Working hard so my kid can go to a good school.',
        location: 'Chicago, Illinois',
        birthday: 'February 5, 1981',
        relationship: 'Married to Angela Wilson',
        workplace: 'Operations Manager',
        interests: ['Football', 'Blues music', 'Fishing', 'Woodworking'],
        groups: ['Chicago Bears Fan Club', 'Lincoln Park Dads', 'Illinois Anglers Association'],
        checkIns: ['Soldier Field', 'Lou Malnatis', 'Lake Michigan Pier'],
        friends: ['angela_wilson', 'jason_wilson', 'tamara_wilson']
      },
      angela_wilson: {
        name: 'Angela Wilson',
        portraitKey: null,
        isTarget: false,
        bio: 'Realtor. Mom. Hustler. Helping families find their dream home in Chicagoland.',
        location: 'Chicago, Illinois',
        birthday: 'October 17, 1982',
        relationship: 'Married to James Wilson',
        workplace: 'Licensed Real Estate Agent at Coldwell Banker — Lincoln Park Office',
        interests: ['Interior design', 'Open houses', 'Pilates', 'Brunch'],
        groups: ['Chicago Association of Realtors', 'Lincoln Park Moms', 'Coldwell Banker Top Producers'],
        checkIns: ['Coldwell Banker Lincoln Park', 'Equinox Lincoln Park', 'West Elm'],
        friends: ['james_wilson', 'jason_wilson', 'tamara_wilson']
      },
      jason_wilson: {
        name: 'Jason Wilson',
        portraitKey: null,
        isTarget: false,
        bio: 'Senior at Lincoln Park High. Northwestern bound (hopefully) 🤞 Track & field 🏃‍♂️',
        location: 'Chicago, Illinois',
        birthday: 'May 22, 2008',
        relationship: null,
        workplace: null,
        interests: ['Track & field', 'Video games', 'College prep', 'Sneakers'],
        groups: ['Lincoln Park HS Track Team', 'Northwestern Class of 2030 (Hopefuls)'],
        checkIns: ['Lincoln Park High School', 'Nike Chicago'],
        friends: ['james_wilson', 'angela_wilson', 'tamara_wilson']
      },
      tamara_wilson: {
        name: 'Tamara Wilson',
        portraitKey: null,
        isTarget: false,
        bio: 'RN at Rush University Medical Center. James\'s little sister. Auntie T to Jason.',
        location: 'Chicago, Illinois',
        birthday: 'September 8, 1985',
        relationship: 'Single',
        workplace: 'Registered Nurse at Rush University Medical Center — ER Department',
        interests: ['Travel', 'Cooking', 'Book clubs', 'Yoga'],
        groups: ['Rush Nurses Union', 'Chicago Book Club', 'South Side Community Health'],
        checkIns: ['Rush University Medical Center', 'Giordanos Pizza'],
        friends: ['james_wilson', 'angela_wilson', 'jason_wilson']
      }
    },
    posts: {
      james_wilson: [
        {
          text: "Bears lost again. I don't even know why I keep watching. It's like a toxic relationship at this point. See you all next Sunday. 🐻🏈😤",
          time: '2 days ago',
          likes: 33,
          comments: [
            { author: 'angela_wilson', text: 'You say this EVERY week babe' },
            { author: 'tamara_wilson', text: 'James you have been saying this since 1995 😂' },
            { author: 'jason_wilson', text: 'dad we need to accept the bears are cursed' }
          ],
          intel: null
        },
        {
          text: 'Built Jason a new desk for his room this weekend. Nothing fancy but it\'s solid oak and the kid needs a real workspace for all these college applications. Woodworking therapy at its finest. 🪵',
          time: '5 days ago',
          likes: 28,
          comments: [
            { author: 'angela_wilson', text: 'Looks amazing honey! The sawdust all over the garage... less amazing. 😂' },
            { author: 'jason_wilson', text: 'dad this desk is fire thank you 🙏' }
          ],
          intel: null
        },
        {
          text: "First fishing trip of the season out on Lake Michigan. Caught absolutely nothing but the sunrise was unreal. Sometimes that's enough. 🎣🌅",
          time: '1 week ago',
          likes: 19,
          comments: [
            { author: 'tamara_wilson', text: 'Big bro you never catch anything 😂 just admit you like sitting on a boat doing nothing' }
          ],
          intel: null
        },
        {
          text: 'Friday night blues at Kingston Mines. Nothing beats live Chicago blues. If you know you know. 🎵🎸',
          time: '2 weeks ago',
          likes: 22,
          comments: [
            { author: 'angela_wilson', text: 'Best date night spot in the city ❤️' }
          ],
          intel: null
        }
      ],
      angela_wilson: [
        {
          text: "HUGE congrats to my husband James on 15 years at Lakefront Manufacturing! They surprised him with an award at the company dinner. So proud of this man and everything he's built for our family. 🏆❤️",
          time: '4 days ago',
          likes: 68,
          comments: [
            { author: 'james_wilson', text: 'Aww babe you did not have to post this 😅' },
            { author: 'tamara_wilson', text: 'My big brother!! 15 years?! That is DEDICATION. Congrats James! 🎉' },
            { author: 'jason_wilson', text: 'thats crazy dad. 15 years. im proud of you fr' }
          ],
          intel: { key: 'EMPLOYER', value: "James works at Lakefront Manufacturing, 15 years tenure" }
        },
        {
          text: "IT'S SOLD!! Just closed on the Wilson family rental property in Wicker Park. 18 months on the market but we got above asking in the end. Time to celebrate and also time to talk to the accountant about capital gains 😂💰🏠",
          time: '1 week ago',
          likes: 51,
          comments: [
            { author: 'james_wilson', text: 'My wife the closer!! Great work babe 🎉' },
            { author: 'tamara_wilson', text: 'Wow!! That Wicker Park property? The market must be crazy right now' }
          ],
          intel: { key: 'PROPERTY_SALE', value: "Sold a rental property in Wicker Park, capital gains implications" }
        },
        {
          text: "College tour week! Jason and I are visiting Northwestern, U of I, and Wisconsin this week. My baby is growing up and I am NOT handling it well. Already cried twice and we haven't left yet. 😭✈️🎓",
          time: '2 weeks ago',
          likes: 44,
          comments: [
            { author: 'jason_wilson', text: 'MOM please do not cry during the campus tour 🙏' },
            { author: 'james_wilson', text: 'You got this buddy. Proud of you.' }
          ],
          intel: null
        },
        {
          text: "Had to pull from Jason's 529 plan to cover the application fees and campus visit travel. 6 schools at $75-90 each plus flights and hotels adds up FAST. College is a scam but we are playing the game anyway. 💸😩",
          time: '2 weeks ago',
          likes: 37,
          comments: [
            { author: 'james_wilson', text: 'It will be worth it. That kid is going places.' },
            { author: 'tamara_wilson', text: 'The 529 is for exactly this though! Don\'t stress about it Ang.' }
          ],
          intel: { key: 'COLLEGE_SAVINGS', value: "529 college savings plan with recent withdrawals for application costs" }
        },
        {
          text: 'Open house today in Lincoln Park! 3bd/2ba, updated kitchen, rooftop deck. Come say hi if you are in the neighborhood! 🏡✨',
          time: '3 weeks ago',
          likes: 15,
          comments: [],
          intel: null
        }
      ],
      jason_wilson: [
        {
          text: 'PR in the 400m today!! 49.8 seconds. Sub-50 lets GOOO 🏃‍♂️💨',
          time: '3 days ago',
          likes: 31,
          comments: [
            { author: 'james_wilson', text: 'THATS MY SON!! Sub-50!! 💪' },
            { author: 'angela_wilson', text: 'I screamed so loud the other parents moved away from me 😂' },
            { author: 'tamara_wilson', text: 'Jason!! That is FAST. Olympic vibes 🥇' }
          ],
          intel: null
        },
        {
          text: 'Northwestern campus is insane. If I get in I will literally cry. Dream school right here. 💜🤞',
          time: '2 weeks ago',
          likes: 28,
          comments: [
            { author: 'angela_wilson', text: 'You are going to get in baby. I know it. ❤️' },
            { author: 'james_wilson', text: 'Work hard. Stay focused. It will happen.' }
          ],
          intel: null
        },
        {
          text: 'senior year is simultaneously the best and worst time of my life. applications, track, AP classes, no sleep. worth it tho i think??',
          time: '3 weeks ago',
          likes: 18,
          comments: [
            { author: 'tamara_wilson', text: 'It IS worth it Jason. Trust your Auntie T. The hard work pays off later ❤️' }
          ],
          intel: null
        }
      ],
      tamara_wilson: [
        {
          text: "Tax question for the group: anyone have a good accountant rec? I've been going to my brother and Angela's guy Steve for years but wondering if I should shop around. Steve at Peterson & Associates on Clark St — anyone else use him?",
          time: '6 days ago',
          likes: 8,
          comments: [
            { author: 'angela_wilson', text: "Steve is great! He's done ours forever. But I get wanting to compare. Let me know what you find!" },
            { author: 'james_wilson', text: 'Steve is solid T. Been doing our taxes for like 8 years.' }
          ],
          intel: { key: 'ACCOUNTANT_NAME', value: "Their accountant is Steve at Peterson & Associates on Clark St" }
        },
        {
          text: 'Night shift at Rush ER. 14 hours. 3 coffees deep. Being a nurse is glamorous they said. Rewarding they said. They were right about rewarding at least. 😅☕',
          time: '1 week ago',
          likes: 41,
          comments: [
            { author: 'james_wilson', text: 'You are a hero Tam. For real.' },
            { author: 'angela_wilson', text: 'We appreciate you so much Tamara ❤️' }
          ],
          intel: null
        },
        {
          text: "Just booked a solo trip to Costa Rica for spring break! After 60+ hour weeks at the hospital I deserve this. Beach. Books. No pagers. 🏖️📚",
          time: '2 weeks ago',
          likes: 33,
          comments: [
            { author: 'angela_wilson', text: 'YES QUEEN. You earned this!!' },
            { author: 'james_wilson', text: 'Bring me back some coffee beans sis' }
          ],
          intel: null
        },
        {
          text: "Book club pick this month: 'Lessons in Chemistry.' If you haven't read it, DO IT. We had the most heated discussion in 3 years of this club 📖🔥",
          time: '3 weeks ago',
          likes: 14,
          comments: [],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'EMPLOYER', boost: 15, description: "James's employer (Lakefront Manufacturing)" },
      { key: 'PROPERTY_SALE', boost: 10, description: 'Rental property sale (capital gains)' },
      { key: 'COLLEGE_SAVINGS', boost: 8, description: '529 plan withdrawals' },
      { key: 'ACCOUNTANT_NAME', boost: 5, description: 'Accountant Steve at Peterson & Associates' }
    ]
  },

  'Priya Patel': {
    profiles: {
      priya_patel: {
        name: 'Priya Patel',
        portraitKey: 'l2_victim_4',
        isTarget: true,
        bio: 'Math teacher. Chess mom. Chai addict. Edison NJ.',
        location: 'Edison, New Jersey',
        birthday: 'June 8, 1984',
        relationship: 'Married to Raj Patel',
        workplace: 'Math Teacher at Edison High School',
        interests: ['Teaching', 'Chess', 'Reading', 'Bollywood movies', 'Chai'],
        groups: ['Edison Teachers Association', 'Edison Chess Club Parents', 'NJ Indian Community Network'],
        checkIns: ['Edison High School', 'Patel Brothers Grocery', 'Oak Tree Road'],
        friends: ['raj_patel', 'dev_patel', 'sunita_patel']
      },
      raj_patel: {
        name: 'Raj Patel',
        portraitKey: null,
        isTarget: false,
        bio: 'Software engineer. Building the future one line of code at a time. Proud dad.',
        location: 'Edison, New Jersey',
        birthday: 'January 15, 1983',
        relationship: 'Married to Priya Patel',
        workplace: 'Senior Software Engineer at Novartis Pharmaceuticals — East Hanover Campus',
        interests: ['Coding', 'Stock market', 'Cricket', 'Chess', 'Gadgets'],
        groups: ['Novartis Tech Team', 'NJ Indian Professionals Network', 'r/wallstreetbets Alumni'],
        checkIns: ['Novartis East Hanover', 'Micro Center', 'Edison Cricket Club'],
        friends: ['priya_patel', 'dev_patel', 'sunita_patel']
      },
      dev_patel: {
        name: 'Dev Patel',
        portraitKey: null,
        isTarget: false,
        bio: 'chess knight 🐴 Edison Chess Club ranked #2!! Math is cool (dont tell my friends)',
        location: 'Edison, New Jersey',
        birthday: 'October 30, 2015',
        relationship: null,
        workplace: null,
        interests: ['Chess', 'Math', 'Legos', 'Harry Potter', 'Coding'],
        groups: ['Edison Chess Club', 'Lego Robotics Club'],
        checkIns: ['Edison Public Library', 'Edison Chess Club'],
        friends: ['priya_patel', 'raj_patel', 'sunita_patel']
      },
      sunita_patel: {
        name: 'Sunita Patel',
        portraitKey: null,
        isTarget: false,
        bio: 'Blessed grandmother. Temple volunteer. My grandchild Dev is my whole world. Jai Shree Krishna 🙏',
        location: 'Edison, New Jersey',
        birthday: 'March 25, 1958',
        relationship: 'Widowed',
        workplace: 'Retired — Former Bank Teller at Bank of India',
        interests: ['Temple activities', 'Cooking', 'Bollywood', 'Walking', 'FriendBook'],
        groups: ['BAPS Shri Swaminarayan Mandir Edison', 'Edison Senior Citizens Club', 'Indian Grandmothers of NJ'],
        checkIns: ['BAPS Mandir Edison', 'Patel Brothers Grocery', 'Oak Tree Road'],
        friends: ['priya_patel', 'raj_patel', 'dev_patel']
      }
    },
    posts: {
      priya_patel: [
        {
          text: "My students absolutely crushed the AP Calculus practice exam today! 78% scored a 4 or above. Teaching these kids is the best part of my life (besides Dev and Raj of course). So proud of them! 📐✨",
          time: '1 day ago',
          likes: 41,
          comments: [
            { author: 'raj_patel', text: 'The best math teacher in New Jersey!! Not biased at all 😂' },
            { author: 'sunita_patel', text: 'My bahu is the best teacher! Her students are lucky to have her 🙏' }
          ],
          intel: null
        },
        {
          text: "Dev's chess tournament is this Saturday! He has been practicing every night after homework. Win or lose I am so proud of his dedication. Go Dev!! ♟️",
          time: '4 days ago',
          likes: 29,
          comments: [
            { author: 'dev_patel', text: 'mom im gonna win i can feel it!!' },
            { author: 'sunita_patel', text: 'My Dev is the smartest boy! I will be there cheering! 🏆' },
            { author: 'raj_patel', text: 'That kid beat me in 12 moves last night. TWELVE MOVES.' }
          ],
          intel: null
        },
        {
          text: 'Sunday chai and grading papers. The never-ending teacher life. At least the chai is perfect today. ☕📝',
          time: '1 week ago',
          likes: 18,
          comments: [
            { author: 'raj_patel', text: 'I made that chai. Credit where credit is due 😤☕' }
          ],
          intel: null
        },
        {
          text: "Family movie night! Dev picked Koi Mil Gaya (again) and honestly I'm not even mad. Classic is classic. 🎬🍿",
          time: '2 weeks ago',
          likes: 25,
          comments: [
            { author: 'sunita_patel', text: 'Best movie! Hrithik is so handsome 😊' },
            { author: 'dev_patel', text: 'JADOO IS THE BEST' }
          ],
          intel: null
        }
      ],
      raj_patel: [
        {
          text: "Big news — our Novartis team just shipped the new clinical trial data platform! 8 months of work and it is finally live. Pharma tech is not glamorous but it saves lives. Proud of the team. 💻🏥",
          time: '3 days ago',
          likes: 52,
          comments: [
            { author: 'priya_patel', text: 'So proud of you! All those late nights were worth it ❤️' },
            { author: 'sunita_patel', text: 'My son works at the best company! Saving lives with computers! 🙏' }
          ],
          intel: { key: 'HUSBAND_COMPANY', value: "Raj works at Novartis Pharmaceuticals as a senior software engineer" }
        },
        {
          text: "Ok so the stock portfolio had a VERY good quarter. Up 23% thanks to some well-timed pharma picks. Not to brag but... ok I am bragging. 📈💰",
          time: '1 week ago',
          likes: 34,
          comments: [
            { author: 'priya_patel', text: 'Raj please do not jinx it by posting about it 😂' },
            { author: 'sunita_patel', text: 'Beta you should save that money not gamble it! But well done 😊' }
          ],
          intel: { key: 'INVESTMENT', value: "Significant stock portfolio with 23% quarterly gains, pharma sector picks" }
        },
        {
          text: 'Dev just checkmated me in 12 moves. I have a computer science degree and my 10 year old is destroying me at a strategy game. I need to practice more or accept my fate.',
          time: '5 days ago',
          likes: 43,
          comments: [
            { author: 'priya_patel', text: 'He gets the brains from me clearly 😏' },
            { author: 'dev_patel', text: 'sorry papa 😂😂' }
          ],
          intel: null
        },
        {
          text: 'Cricket match with the Edison crew this Sunday! Missing the IPL but at least we have our parking lot league. Who needs a stadium? 🏏😂',
          time: '2 weeks ago',
          likes: 21,
          comments: [
            { author: 'priya_patel', text: 'Please do not pull your hamstring again. Please.' }
          ],
          intel: null
        },
        {
          text: "New mechanical keyboard day. Cherry MX Browns. The typing sound is 🤌 Priya says it's too loud. Priya is wrong.",
          time: '3 weeks ago',
          likes: 17,
          comments: [
            { author: 'priya_patel', text: 'Raj I can hear you typing FROM THE BEDROOM. It sounds like a tiny construction site.' },
            { author: 'dev_patel', text: 'dad can i get one for my birthday??' }
          ],
          intel: null
        }
      ],
      dev_patel: [
        {
          text: 'built a lego robot that can solve a rubiks cube!!! it only works sometimes but still!! 🤖',
          time: '3 days ago',
          likes: 35,
          comments: [
            { author: 'raj_patel', text: 'I am officially less useful than a Lego robot. This kid is amazing.' },
            { author: 'priya_patel', text: 'My little engineer!! So proud of you beta ❤️' },
            { author: 'sunita_patel', text: 'Dev beta you are so smart!! Show dadi next time I visit! 🙏' }
          ],
          intel: null
        },
        {
          text: 'chess practice every day this week. tournament on saturday. im ready. ♟️♟️♟️',
          time: '5 days ago',
          likes: 16,
          comments: [
            { author: 'sunita_patel', text: 'My champion!! Dadi will make your favorite kheer for good luck! 🍚' }
          ],
          intel: null
        },
        {
          text: 'harry potter marathon with dadi!! she says voldemort reminds her of her old boss at the bank 😂',
          time: '2 weeks ago',
          likes: 27,
          comments: [
            { author: 'sunita_patel', text: 'That man was WORSE than Voldemort! At least Voldemort had style!' },
            { author: 'priya_patel', text: 'Mummyji I am crying laughing 😂😂' }
          ],
          intel: null
        }
      ],
      sunita_patel: [
        {
          text: "So proud of my bahu Priya! She has been tutoring the neighborhood children in math every Saturday for FREE. Three kids from Oak Tree Road come to the house and Priya teaches them for 2 hours. She charges nothing even though she should! Such a generous heart. 🙏📚",
          time: '5 days ago',
          likes: 39,
          comments: [
            { author: 'priya_patel', text: 'Mummyji you are making me blush 😳 it is just a little thing, the kids need the help' },
            { author: 'raj_patel', text: 'Mom she actually does charge the Sharma kids. $30/hour each. She just didn\'t tell you 😂' },
            { author: 'priya_patel', text: 'RAJ!! 😤 ok fine yes the Sharmas insisted on paying. And the Mehta family. But the Gupta boy I teach for free because his family is going through a hard time!' }
          ],
          intel: { key: 'SIDE_INCOME', value: "Priya tutors neighborhood kids for cash ($30/hr), some paid some free" }
        },
        {
          text: "Wonderful puja at BAPS mandir today! Priya organized the donation drive for the temple renovation fund. We collected $12,000 from the community! My bahu has such a big heart. Every family contributed. Jai Shree Krishna 🙏🕉️",
          time: '1 week ago',
          likes: 56,
          comments: [
            { author: 'priya_patel', text: 'The whole community came together! So grateful for everyone who donated 🙏' },
            { author: 'raj_patel', text: 'Great work organizing this Priya. The temple renovation is going to be amazing.' }
          ],
          intel: { key: 'CHARITABLE', value: "Priya organized temple donation drive, $12K collected for renovation" }
        },
        {
          text: 'Made aloo paratha and kheer for my grandson Dev today. He ate four parathas! Growing boy needs good food. Not like that pizza he always wants. Homemade food is best food! 🥘',
          time: '1 week ago',
          likes: 32,
          comments: [
            { author: 'dev_patel', text: 'dadi your parathas are the BEST but pizza is also good ok 😂🍕' },
            { author: 'priya_patel', text: 'Mummyji he will not eat my cooking but he eats 4 of yours?! What is your secret 😂' }
          ],
          intel: null
        },
        {
          text: "Walking group at the senior center this morning! We walked 3 miles and then had chai together. I told all my friends about my grandson Dev's chess tournament. They are all cheering for him! 🚶‍♀️☕",
          time: '2 weeks ago',
          likes: 24,
          comments: [
            { author: 'dev_patel', text: 'tell them i said thank you dadi!! 🙏' }
          ],
          intel: null
        },
        {
          text: "Learning to post photos on FriendBook! My bahu Priya taught me. Here is a photo of the beautiful rangoli Dev and I made for Diwali. It took us 3 hours! 🪔",
          time: '3 weeks ago',
          likes: 48,
          comments: [
            { author: 'priya_patel', text: 'It was beautiful Mummyji! Best rangoli on the block ❤️' },
            { author: 'raj_patel', text: 'Mom you are becoming a FriendBook pro! Next step: reels 😂' },
            { author: 'sunita_patel', text: 'What is a reel? Is that like a fishing thing? 🤔' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'HUSBAND_COMPANY', boost: 15, description: "Husband works at Novartis Pharmaceuticals" },
      { key: 'INVESTMENT', boost: 10, description: 'Stock portfolio with big gains' },
      { key: 'SIDE_INCOME', boost: 8, description: 'Tutoring kids for cash' },
      { key: 'CHARITABLE', boost: 5, description: 'Organized temple donation drive' }
    ]
  },
};

/**
 * Get FriendBook data for a Level 2 victim.
 * @param {string} victimName - The victim's name from VICTIM_NAMES
 * @returns {object|null} FriendBook data or null if not found
 */
export function getLevel2FriendBook(victimName) {
  return FRIENDBOOK_DATA[victimName] || null;
}
