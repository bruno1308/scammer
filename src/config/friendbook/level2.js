/**
 * FriendBook data for Level 2: Government Impersonation
 * Difficulty: Key clues on family/friend profiles, not the victim's own
 *
 * Victim scam variants:
 *   David Chen — tax_undeclared_income (Tax authority — undeclared freelance income)
 *   Maria Gonzalez — customs_detained_package (Customs fee — detained international package)
 *   James Wilson — outstanding_court_fine (Court clerk — outstanding traffic fine)
 *   Priya Patel — pension_suspension (Pension authority — account suspension)
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
        portraitKey: 'fb_l2_mei_chen',
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
        portraitKey: 'fb_l2_brandon_chen',
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
        portraitKey: 'fb_l2_lily_chen',
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
          text: 'Kings win!! What a game. Brandon and I lost our voices screaming in the third quarter. Father-son nights at Golden 1 never disappoint \ud83c\udfc0\ud83d\udd25',
          time: '1 day ago',
          likes: 24,
          imageKey: 'fb_l2_post_kings_game',
          comments: [
            { author: 'mei_chen', text: 'You two are STILL hoarse this morning \ud83d\ude02' },
            { author: 'brandon_chen', text: 'BEST NIGHT EVER DAD' }
          ],
          intel: null
        },
        {
          text: "Tax season has me stressed. Between the new contractor gigs and the regular job stuff it feels like I need a PhD in accounting just to figure out what forms to fill. Mei keeps telling me to relax but easy for her to say \u2014 she IS an accountant \ud83d\ude29",
          time: '4 days ago',
          likes: 14,
          comments: [
            { author: 'mei_chen', text: 'Babe for the LAST TIME just let Steve handle it. That is literally what we pay him for \ud83d\ude02' },
            { author: 'lily_chen', text: 'Do not worry my son. Mei will take care of the numbers! She is very smart with money \ud83d\ude0a' }
          ],
          intel: { key: 'TAX_STRESS', value: "David is stressed about tax season and confused about filing his contractor income correctly" }
        },
        {
          text: 'Brandon scored the game winner in overtime today. 2-1!! This kid is going places. Proudest dad in Sacramento right now \ud83d\ude2d\u26bd',
          time: '1 week ago',
          likes: 47,
          imageKey: 'fb_l2_post_soccer_goal',
          comments: [
            { author: 'mei_chen', text: 'I cried. Full on tears in the stands. No shame.' },
            { author: 'lily_chen', text: 'My grandson is a champion!! \ud83c\udfc6' }
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
          text: "SO proud of this guy!! David just started picking up freelance project management jobs on the side through UpBuild Consulting. Between his full-time gig at Meridian and these new contracts he is working nonstop. Told him he better track every dollar for taxes \u2014 1099 income is no joke! \ud83d\udcaa\ud83d\udcb0",
          time: '3 days ago',
          likes: 48,
          comments: [
            { author: 'david_chen', text: 'Babe I literally just started, calm down about the taxes already \ud83d\ude05' },
            { author: 'lily_chen', text: 'My son is working so hard! But Mei is right, you must keep good records. Listen to your wife!' }
          ],
          intel: { key: 'FREELANCE_WORK', value: "David started freelance contracting through UpBuild Consulting on the side, earning 1099 income on top of his regular job at Meridian" }
        },
        {
          text: "Kitchen renovation is FINALLY done!! Only took 3 months longer than quoted and cost... let's not talk about what it cost. But David insisted on the top-of-the-line everything. New appliances, quartz countertops, custom cabinets. He says it's an \"investment.\" I say it's an excuse to buy a bigger grill. \ud83d\ude0d",
          time: '1 week ago',
          likes: 53,
          comments: [
            { author: 'david_chen', text: 'The grill is a separate line item and you know it \ud83d\ude02' },
            { author: 'lily_chen', text: 'The kitchen is beautiful! I made dumplings on the new stove today. Perfect!' }
          ],
          intel: { key: 'NEW_PURCHASE', value: "Major kitchen renovation recently completed with expensive upgrades \u2014 could look like unreported income funding it" }
        },
        {
          text: "Tax season is upon us \ud83d\ude29 At least we have Steve at H&R Block handling ours. I may be a CPA but I am NOT doing my own taxes. That's like a doctor operating on themselves. No thank you.",
          time: '2 weeks ago',
          likes: 34,
          comments: [
            { author: 'david_chen', text: 'Steve is the man. Been doing ours for 5 years now' },
            { author: 'lily_chen', text: 'Can Steve do mine too? I have so many forms this year with the move...' }
          ],
          intel: { key: 'FILING_DETAIL', value: "Mei is a CPA at Wallace & Associates; they use Steve at H&R Block for their own taxes and file jointly" }
        },
        {
          text: 'Yoga then wine. The only acceptable order of operations on a Friday night. \ud83e\uddd8\u200d\u2640\ufe0f\ud83c\udf77',
          time: '3 weeks ago',
          likes: 28,
          comments: [
            { author: 'david_chen', text: 'Save me a glass?' }
          ],
          intel: null
        },
        {
          text: "Brandon's report card came in \u2014 straight A's and a B+ in math. Not bad for a kid who 'doesn't like school.' Ice cream celebration tonight! \ud83c\udf66",
          time: '1 month ago',
          likes: 41,
          comments: [
            { author: 'lily_chen', text: 'My smart grandson! The B+ will be an A next time, I will help him study \ud83d\udcda' }
          ],
          intel: null
        }
      ],
      brandon_chen: [
        {
          text: 'new cleats new me!! thanks mom and dad \ud83d\udd25\u26bd',
          time: '5 days ago',
          likes: 15,
          comments: [
            { author: 'mei_chen', text: 'Score some goals in those please, they were not cheap \ud83d\ude02' }
          ],
          intel: null
        },
        {
          text: 'grandma made xiaolongbao today and i ate 14. new personal record',
          time: '1 week ago',
          likes: 22,
          comments: [
            { author: 'lily_chen', text: 'I will make more tomorrow! Growing boy needs food! \ud83e\udd5f' },
            { author: 'david_chen', text: 'That\'s my boy \ud83d\udcaa' }
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
          text: "New chapter! I have moved to Sacramento to live with my son David and his family. After 40 years in San Francisco it is hard to leave but being close to my grandson Brandon makes everything better. The house is so lively! \ud83c\udfe1\u2764\ufe0f",
          time: '2 weeks ago',
          likes: 38,
          comments: [
            { author: 'david_chen', text: 'We love having you here Mom \u2764\ufe0f' },
            { author: 'mei_chen', text: 'Best decision ever! Brandon is SO happy to have nainai here every day' }
          ],
          intel: null
        },
        {
          text: 'Found a wonderful Tai Chi group at the community center. Made three new friends already! Sacramento people are so friendly. \ud83c\udf05',
          time: '1 week ago',
          likes: 19,
          comments: [
            { author: 'mei_chen', text: 'So glad you are settling in! \u2764\ufe0f' }
          ],
          intel: null
        },
        {
          text: 'My Brandon won his soccer game today! I do not understand all the rules but I cheer the loudest. The other grandparents told me so \ud83d\ude02',
          time: '1 week ago',
          likes: 44,
          comments: [
            { author: 'brandon_chen', text: 'GRANDMA you were SO LOUD i could hear you from the field \ud83d\ude02\ud83d\ude02' },
            { author: 'david_chen', text: 'Mom you had a cowbell. A COWBELL.' }
          ],
          intel: null
        },
        {
          text: 'Learning to use this "FriendBook" so I can see my grandchild\'s photos. Technology is not easy but David is patient teacher. Hello everyone! \ud83d\udc4b',
          time: '3 weeks ago',
          likes: 27,
          comments: [
            { author: 'mei_chen', text: 'Welcome to FriendBook mama Chen! \ud83c\udf89' },
            { author: 'david_chen', text: 'You are doing great Mom!' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'FREELANCE_WORK', boost: 15, description: "Wife posted about David's new freelance contracting side jobs", category: 'primary', callHint: "Reference his 1099 contractor income through UpBuild Consulting that wasn't reported on his return" },
      { key: 'TAX_STRESS', boost: 10, description: 'David mentioned being confused about tax forms for contractor work', category: 'authority', callHint: "Show you know he's been struggling with the filing \u2014 say your records show discrepancies matching what he filed" },
      { key: 'NEW_PURCHASE', boost: 8, description: 'Expensive kitchen renovation recently completed', category: 'pressure', callHint: "Mention that large expenditures flagged against reported income \u2014 the renovation raises audit flags" },
      { key: 'FILING_DETAIL', boost: 5, description: 'Wife is a CPA; they file jointly through Steve at H&R Block', category: 'corroborating', callHint: "Reference their joint filing or their preparer to sound like you have their actual tax records" }
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
        portraitKey: 'fb_l2_carlos_gonzalez',
        isTarget: false,
        bio: 'Shift supervisor at Valero. Proud Texan. Astros forever.',
        location: 'Houston, Texas',
        birthday: 'July 28, 1985',
        relationship: 'Married to Maria Gonzalez',
        workplace: 'Shift Supervisor at Valero Energy \u2014 Houston Refinery',
        interests: ['Baseball', 'Fishing', 'BBQ', 'Trucks'],
        groups: ['Valero Houston Crew', 'Astros Nation', 'Texas Bass Fishing Club'],
        checkIns: ['Minute Maid Park', 'Academy Sports', 'Valero Houston Refinery'],
        friends: ['maria_gonzalez', 'sofia_gonzalez', 'diego_morales']
      },
      sofia_gonzalez: {
        name: 'Sofia Gonzalez',
        portraitKey: 'fb_l2_sofia_gonzalez',
        isTarget: false,
        bio: 'Girl Scout Brownie! \ud83c\udf6a I love my cat Luna and soccer!',
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
        portraitKey: 'fb_l2_diego_morales',
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
          text: "Girl Scout cookie season is HERE and Troop 4817 is ready to crush it! Sofia's goal is 200 boxes. If anyone wants Thin Mints, you know where to find us \ud83c\udf6a\ud83d\udcaa",
          time: '2 days ago',
          likes: 36,
          comments: [
            { author: 'carlos_gonzalez', text: 'I already ate a whole box of Samoas. For quality control purposes.' },
            { author: 'diego_morales', text: 'Put me down for 5 boxes. Actually 7. Actually just bring everything you have.' }
          ],
          intel: null
        },
        {
          text: "Date night with this handsome man! Dinner at Pappasito's and then a movie. Grandma has Sofia for the night. We are FREEEE \ud83d\ude02\ud83e\udd42",
          time: '5 days ago',
          likes: 42,
          comments: [
            { author: 'carlos_gonzalez', text: 'Best night out in months babe \u2764\ufe0f' }
          ],
          intel: null
        },
        {
          text: 'Monday motivation: 4 loads of laundry, 2 dozen cupcakes for the bake sale, 1 vet appointment for Luna, and somehow still need to meal prep for the week. Moms are built different. \ud83d\udcaa',
          time: '1 week ago',
          likes: 54,
          comments: [
            { author: 'diego_morales', text: 'Sis you are a superhero fr' },
            { author: 'carlos_gonzalez', text: 'I can help with the\u2014 actually nvm you do it better \ud83d\ude05' }
          ],
          intel: null
        },
        {
          text: "Beautiful Sunday at Hermann Park with the family. Sofia fed the ducks, Carlos fell asleep on the blanket within 5 minutes. Classic. \ud83e\udd86\u2600\ufe0f",
          time: '2 weeks ago',
          likes: 29,
          imageKey: 'fb_l2_post_hermann_park',
          comments: [
            { author: 'sofia_gonzalez', text: 'the ducks liked the bread i gave them!!' }
          ],
          intel: null
        }
      ],
      carlos_gonzalez: [
        {
          text: "Maria's abuela in Guadalajara is turning 80 next month! My wife has been going CRAZY putting together the perfect care package \u2014 custom photo album, Sofia's drawings, homemade dulces, even a little tablet so abuela can video call us. Shipped it out through DHL International yesterday. Maria cried packing it \ud83d\ude2d\ud83d\udce6\u2764\ufe0f",
          time: '3 days ago',
          likes: 64,
          comments: [
            { author: 'maria_gonzalez', text: 'I did NOT cry. Ok I cried a little. Abuela is going to love it so much \ud83d\ude2d' },
            { author: 'diego_morales', text: 'Sis you definitely cried. I heard you from the other room \ud83d\ude02 But that package is beautiful. Abuela will flip.' },
            { author: 'sofia_gonzalez', text: 'i drew abuela a picture of luna in a sombrero!!!' }
          ],
          intel: { key: 'INTERNATIONAL_PACKAGE', value: "Maria shipped an international care package via DHL to her grandmother in Guadalajara, Mexico for her 80th birthday" }
        },
        {
          text: "12 hour shift at Valero but the overtime is worth it. Gotta keep the lights on and Sofia in Girl Scout uniforms. Houston refinery crew putting in work \ud83d\udcaa\u26fd",
          time: '5 days ago',
          likes: 18,
          comments: [
            { author: 'maria_gonzalez', text: 'My hardworking husband \u2764\ufe0f Come home safe' }
          ],
          intel: null
        },
        {
          text: "Maria spent all weekend figuring out the customs forms for abuela's package. Address had to match exactly \u2014 Calle Reforma 247, Colonia Centro, Guadalajara. She called DHL three times to make sure everything was right. My wife does NOT play around when it comes to her abuela \ud83d\ude02\ud83d\udce6",
          time: '1 week ago',
          likes: 31,
          comments: [
            { author: 'maria_gonzalez', text: 'Carlos why are you posting our personal business!! \ud83d\ude24 Also yes I called FOUR times actually' },
            { author: 'diego_morales', text: 'Sis I could have helped you with the customs forms \ud83d\ude02 that is literally what I deal with all day' }
          ],
          intel: { key: 'RECIPIENT_DETAILS', value: "Package shipped to Calle Reforma 247, Colonia Centro, Guadalajara \u2014 Maria verified the address and customs forms multiple times" }
        },
        {
          text: 'Astros spring training starts next week. This is our year. I can feel it. \u26be\ud83e\udd20',
          time: '3 weeks ago',
          likes: 22,
          comments: [],
          intel: null
        },
        {
          text: 'New truck day!! 2024 Silverado. Carlos is a happy man. Maria is... less happy about the payments \ud83d\ude02\ud83d\udef3',
          time: '1 month ago',
          likes: 45,
          comments: [
            { author: 'maria_gonzalez', text: 'It is very nice. The PAYMENTS are not very nice. \ud83d\ude11' },
            { author: 'diego_morales', text: 'Bro that thing is clean \ud83d\udd25' }
          ],
          intel: null
        }
      ],
      sofia_gonzalez: [
        {
          text: 'luna is wearing the sweater i made her!! she looks so pretty \ud83d\udc31\ud83d\udc95',
          time: '4 days ago',
          likes: 23,
          imageKey: 'fb_l2_post_cat_sweater',
          comments: [
            { author: 'maria_gonzalez', text: 'Luna looks adorable mija! You are so creative!' },
            { author: 'carlos_gonzalez', text: 'That cat lives better than me tbh' }
          ],
          intel: null
        },
        {
          text: 'mommy is sending abuela a big box for her birthday!! i put a drawing of our whole family in it. i hope abuela likes it \ud83d\udce6\u2764\ufe0f',
          time: '5 days ago',
          likes: 37,
          comments: [
            { author: 'maria_gonzalez', text: 'Abuela is going to LOVE it mija. She will probably cry just like mommy did \ud83d\ude02\u2764\ufe0f' },
            { author: 'diego_morales', text: 'Sofia your drawing is the best thing in that whole package. Trust your tio on this \ud83d\ude02' }
          ],
          intel: { key: 'GIFT_FOR_FAMILY', value: "The package is a deeply personal birthday gift for Maria's beloved 80-year-old abuela \u2014 the whole family contributed" }
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
          text: "Maria asked me to help track her DHL shipment to Guadalajara. It shipped out last Thursday from the Houston hub, estimated delivery in 5-7 business days. International shipping is always a gamble though \u2014 she's already checking the tracking number every hour. Sis needs to RELAX \ud83d\ude02\ud83d\udce6",
          time: '2 days ago',
          likes: 14,
          comments: [
            { author: 'maria_gonzalez', text: 'I am NOT checking every hour. Just every two hours. \ud83d\ude24' },
            { author: 'carlos_gonzalez', text: 'She literally has the tracking page bookmarked on her phone AND her work computer' }
          ],
          intel: { key: 'SHIPPING_TIMING', value: "Package shipped last Thursday via DHL from Houston, 5-7 business days delivery, Maria is anxiously tracking it" }
        },
        {
          text: 'Won my client\'s asylum case today. 3 years of fighting and we finally got the approval. This is why I do this work. \ud83c\uddfa\ud83c\uddf8\u2696\ufe0f',
          time: '1 week ago',
          likes: 94,
          comments: [
            { author: 'maria_gonzalez', text: 'SO proud of you little brother!! \ud83d\ude2d\u2764\ufe0f' },
            { author: 'carlos_gonzalez', text: 'Respect bro. Doing important work out here.' }
          ],
          intel: null
        },
        {
          text: 'Buffalo Bayou at 6am before anyone else is awake. Best running trail in Houston. Peace and quiet before the chaos starts. \ud83c\udfc3\u200d\u2642\ufe0f\ud83c\udf05',
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
            { author: 'maria_gonzalez', text: 'She gets it from her mama \ud83d\ude02' },
            { author: 'sofia_gonzalez', text: 'thank you tio diego!!!!! \ud83c\udf6a\ud83c\udf6a\ud83c\udf6a' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'INTERNATIONAL_PACKAGE', boost: 15, description: "Husband posted about Maria shipping a care package to Guadalajara via DHL", category: 'primary', callHint: "Reference the DHL international shipment to Guadalajara that was flagged at the border for exceeding duty-free limits" },
      { key: 'RECIPIENT_DETAILS', boost: 10, description: 'Destination address and customs form details visible in posts', category: 'authority', callHint: "Cite the destination address (Calle Reforma 247, Colonia Centro) to prove you have the actual customs filing" },
      { key: 'GIFT_FOR_FAMILY', boost: 8, description: "The package is a birthday gift for her 80-year-old grandmother", category: 'pressure', callHint: "Mention the package will be destroyed if the fee isn't paid \u2014 she'll panic about losing abuela's birthday gift" },
      { key: 'SHIPPING_TIMING', boost: 5, description: 'Package shipped last Thursday, 5-7 business days, Maria tracking anxiously', category: 'corroborating', callHint: "Reference the shipping date and transit timeline to match what she already knows about the delivery window" }
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
        portraitKey: 'fb_l2_angela_wilson',
        isTarget: false,
        bio: 'Realtor. Mom. Hustler. Helping families find their dream home in Chicagoland.',
        location: 'Chicago, Illinois',
        birthday: 'October 17, 1982',
        relationship: 'Married to James Wilson',
        workplace: 'Licensed Real Estate Agent at Coldwell Banker \u2014 Lincoln Park Office',
        interests: ['Interior design', 'Open houses', 'Pilates', 'Brunch'],
        groups: ['Chicago Association of Realtors', 'Lincoln Park Moms', 'Coldwell Banker Top Producers'],
        checkIns: ['Coldwell Banker Lincoln Park', 'Equinox Lincoln Park', 'West Elm'],
        friends: ['james_wilson', 'jason_wilson', 'tamara_wilson']
      },
      jason_wilson: {
        name: 'Jason Wilson',
        portraitKey: 'fb_l2_jason_wilson',
        isTarget: false,
        bio: 'Senior at Lincoln Park High. Northwestern bound (hopefully) \ud83e\udd1e Track & field \ud83c\udfc3\u200d\u2642\ufe0f',
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
        portraitKey: 'fb_l2_tamara_wilson',
        isTarget: false,
        bio: 'RN at Rush University Medical Center. James\'s little sister. Auntie T to Jason.',
        location: 'Chicago, Illinois',
        birthday: 'September 8, 1985',
        relationship: 'Single',
        workplace: 'Registered Nurse at Rush University Medical Center \u2014 ER Department',
        interests: ['Travel', 'Cooking', 'Book clubs', 'Yoga'],
        groups: ['Rush Nurses Union', 'Chicago Book Club', 'South Side Community Health'],
        checkIns: ['Rush University Medical Center', 'Giordanos Pizza'],
        friends: ['james_wilson', 'angela_wilson', 'jason_wilson']
      }
    },
    posts: {
      james_wilson: [
        {
          text: "Bears lost again. I don't even know why I keep watching. It's like a toxic relationship at this point. See you all next Sunday. \ud83d\udc3b\ud83c\udfc8\ud83d\ude24",
          time: '2 days ago',
          likes: 33,
          comments: [
            { author: 'angela_wilson', text: 'You say this EVERY week babe' },
            { author: 'tamara_wilson', text: 'James you have been saying this since 1995 \ud83d\ude02' },
            { author: 'jason_wilson', text: 'dad we need to accept the bears are cursed' }
          ],
          intel: null
        },
        {
          text: 'Built Jason a new desk for his room this weekend. Nothing fancy but it\'s solid oak and the kid needs a real workspace for all these college applications. Woodworking therapy at its finest. \ud83e\udeb5',
          time: '5 days ago',
          likes: 28,
          imageKey: 'fb_l2_post_oak_desk',
          comments: [
            { author: 'angela_wilson', text: 'Looks amazing honey! The sawdust all over the garage... less amazing. \ud83d\ude02' },
            { author: 'jason_wilson', text: 'dad this desk is fire thank you \ud83d\ude4f' }
          ],
          intel: null
        },
        {
          text: "First fishing trip of the season out on Lake Michigan. Caught absolutely nothing but the sunrise was unreal. Sometimes that's enough. \ud83c\udfa3\ud83c\udf05",
          time: '1 week ago',
          likes: 19,
          comments: [
            { author: 'tamara_wilson', text: 'Big bro you never catch anything \ud83d\ude02 just admit you like sitting on a boat doing nothing' }
          ],
          intel: null
        },
        {
          text: 'Friday night blues at Kingston Mines. Nothing beats live Chicago blues. If you know you know. \ud83c\udfb5\ud83c\udfb8',
          time: '2 weeks ago',
          likes: 22,
          comments: [
            { author: 'angela_wilson', text: 'Best date night spot in the city \u2764\ufe0f' }
          ],
          intel: null
        }
      ],
      angela_wilson: [
        {
          text: "Y'all pray for James. He got rear-ended on the Kennedy Expressway yesterday near the Diversey exit. Some distracted driver plowed right into him at a dead stop. He's fine \u2014 thank God \u2014 but the bumper is destroyed, his neck is sore, and he is FUMING. Filed a police report and everything. The other driver got a citation. What a mess. \ud83d\ude24\ud83d\ude97",
          time: '4 days ago',
          likes: 52,
          comments: [
            { author: 'james_wilson', text: 'I am fine. My truck is NOT fine. And yeah I am fuming.' },
            { author: 'tamara_wilson', text: 'James!! Are you ok?? I just saw this. Come by Rush if your neck gets worse. Seriously.' },
            { author: 'jason_wilson', text: 'dad can we sue them' }
          ],
          intel: { key: 'TRAFFIC_INCIDENT', value: "James was rear-ended on the Kennedy Expressway near Diversey \u2014 police report filed, other driver cited" }
        },
        {
          text: "Update on James's fender bender: insurance is handling it but there's a whole process with the police report number and the citation. James said the officer told him to keep copies of everything in case the other driver disputes it. Case number is with the 14th District. Just glad he's ok \ud83d\ude4f",
          time: '3 days ago',
          likes: 28,
          comments: [
            { author: 'james_wilson', text: 'This is going to be a headache for weeks. I can already tell.' },
            { author: 'tamara_wilson', text: 'At least you have the police report. That other driver cannot dispute a citation.' }
          ],
          intel: { key: 'CASE_DETAIL', value: "Incident on Kennedy Expressway near Diversey, police report filed with 14th District, other driver was cited" }
        },
        {
          text: "College tour week! Jason and I are visiting Northwestern, U of I, and Wisconsin this week. My baby is growing up and I am NOT handling it well. Already cried twice and we haven't left yet. \ud83d\ude2d\u2708\ufe0f\ud83c\udf93",
          time: '2 weeks ago',
          likes: 44,
          comments: [
            { author: 'jason_wilson', text: 'MOM please do not cry during the campus tour \ud83d\ude4f' },
            { author: 'james_wilson', text: 'You got this buddy. Proud of you.' }
          ],
          intel: null
        },
        {
          text: 'Open house today in Lincoln Park! 3bd/2ba, updated kitchen, rooftop deck. Come say hi if you are in the neighborhood! \ud83c\udfe1\u2728',
          time: '3 weeks ago',
          likes: 15,
          imageKey: 'fb_l2_post_open_house',
          comments: [],
          intel: null
        }
      ],
      jason_wilson: [
        {
          text: 'PR in the 400m today!! 49.8 seconds. Sub-50 lets GOOO \ud83c\udfc3\u200d\u2642\ufe0f\ud83d\udca8',
          time: '3 days ago',
          likes: 31,
          comments: [
            { author: 'james_wilson', text: 'THATS MY SON!! Sub-50!! \ud83d\udcaa' },
            { author: 'angela_wilson', text: 'I screamed so loud the other parents moved away from me \ud83d\ude02' },
            { author: 'tamara_wilson', text: 'Jason!! That is FAST. Olympic vibes \ud83e\udd47' }
          ],
          intel: null
        },
        {
          text: 'Northwestern campus is insane. If I get in I will literally cry. Dream school right here. \ud83d\udc9c\ud83e\udd1e',
          time: '2 weeks ago',
          likes: 28,
          comments: [
            { author: 'angela_wilson', text: 'You are going to get in baby. I know it. \u2764\ufe0f' },
            { author: 'james_wilson', text: 'Work hard. Stay focused. It will happen.' }
          ],
          intel: null
        },
        {
          text: 'senior year is simultaneously the best and worst time of my life. applications, track, AP classes, no sleep. worth it tho i think??',
          time: '3 weeks ago',
          likes: 18,
          comments: [
            { author: 'tamara_wilson', text: 'It IS worth it Jason. Trust your Auntie T. The hard work pays off later \u2764\ufe0f' }
          ],
          intel: null
        }
      ],
      tamara_wilson: [
        {
          text: "So James got into that fender bender on the Kennedy and now he's paranoid about his record. He keeps asking me \"do traffic citations show up on background checks?\" Bro you are an operations manager not applying to the FBI. But I get it \u2014 he just got that promotion at Lakefront Manufacturing and he's worried about EVERYTHING now. Big bro energy \ud83d\ude02",
          time: '2 days ago',
          likes: 21,
          comments: [
            { author: 'james_wilson', text: 'T I told you that in CONFIDENCE. Also it is a legitimate question!!' },
            { author: 'angela_wilson', text: 'James you were NOT at fault. The other driver got the citation. Relax babe \ud83d\ude02' }
          ],
          intel: { key: 'WORK_IMPACT', value: "James recently promoted to Operations Manager at Lakefront Manufacturing \u2014 worried about his record affecting his career" }
        },
        {
          text: "James is still complaining about his neck from that accident. I told him to come into Rush for an X-ray but he insists he's \"fine.\" Classic big brother. Angela, MAKE him go. \ud83d\ude44",
          time: '4 days ago',
          likes: 15,
          comments: [
            { author: 'angela_wilson', text: 'I have been TRYING. You know how stubborn he is.' },
            { author: 'james_wilson', text: 'I am FINE. It is just sore.' }
          ],
          intel: { key: 'FRIEND_MENTION', value: "Tamara (sister, ER nurse) confirming James's traffic accident and injuries \u2014 the incident is well-documented among family" }
        },
        {
          text: "Just booked a solo trip to Costa Rica for spring break! After 60+ hour weeks at the hospital I deserve this. Beach. Books. No pagers. \ud83c\udfd6\ufe0f\ud83d\udcda",
          time: '2 weeks ago',
          likes: 33,
          comments: [
            { author: 'angela_wilson', text: 'YES QUEEN. You earned this!!' },
            { author: 'james_wilson', text: 'Bring me back some coffee beans sis' }
          ],
          intel: null
        },
        {
          text: "Book club pick this month: 'Lessons in Chemistry.' If you haven't read it, DO IT. We had the most heated discussion in 3 years of this club \ud83d\udcd6\ud83d\udd25",
          time: '3 weeks ago',
          likes: 14,
          comments: [],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'TRAFFIC_INCIDENT', boost: 15, description: "Wife posted about James's rear-end collision on the Kennedy Expressway", category: 'primary', callHint: "Reference the traffic incident on the Kennedy Expressway \u2014 say his citation from the accident triggered an outstanding fine in the system" },
      { key: 'CASE_DETAIL', boost: 10, description: 'Police report filed with 14th District, location near Diversey exit', category: 'authority', callHint: "Cite the 14th District police report and the Diversey/Kennedy location to sound like you have the actual court records" },
      { key: 'WORK_IMPACT', boost: 8, description: 'Just promoted at Lakefront Manufacturing, worried about his record', category: 'pressure', callHint: "Warn that an outstanding bench warrant would show up on employer background checks \u2014 he'll panic about his new promotion" },
      { key: 'FRIEND_MENTION', boost: 5, description: 'Sister confirmed the accident details publicly, well-documented incident', category: 'corroborating', callHint: "Reference details that match what multiple family members have confirmed about the accident" }
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
        portraitKey: 'fb_l2_raj_patel',
        isTarget: false,
        bio: 'Software engineer. Building the future one line of code at a time. Proud dad.',
        location: 'Edison, New Jersey',
        birthday: 'January 15, 1983',
        relationship: 'Married to Priya Patel',
        workplace: 'Senior Software Engineer at Novartis Pharmaceuticals \u2014 East Hanover Campus',
        interests: ['Coding', 'Stock market', 'Cricket', 'Chess', 'Gadgets'],
        groups: ['Novartis Tech Team', 'NJ Indian Professionals Network', 'r/wallstreetbets Alumni'],
        checkIns: ['Novartis East Hanover', 'Micro Center', 'Edison Cricket Club'],
        friends: ['priya_patel', 'dev_patel', 'sunita_patel']
      },
      dev_patel: {
        name: 'Dev Patel',
        portraitKey: 'fb_l2_dev_patel',
        isTarget: false,
        bio: 'chess knight \ud83d\udc34 Edison Chess Club ranked #2!! Math is cool (dont tell my friends)',
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
        portraitKey: 'fb_l2_sunita_patel',
        isTarget: false,
        bio: 'Blessed grandmother. Temple volunteer. My grandchild Dev is my whole world. Jai Shree Krishna \ud83d\ude4f',
        location: 'Edison, New Jersey',
        birthday: 'March 25, 1958',
        relationship: 'Widowed',
        workplace: 'Retired \u2014 Former Bank Teller at Bank of India',
        interests: ['Temple activities', 'Cooking', 'Bollywood', 'Walking', 'FriendBook'],
        groups: ['BAPS Shri Swaminarayan Mandir Edison', 'Edison Senior Citizens Club', 'Indian Grandmothers of NJ'],
        checkIns: ['BAPS Mandir Edison', 'Patel Brothers Grocery', 'Oak Tree Road'],
        friends: ['priya_patel', 'raj_patel', 'dev_patel']
      }
    },
    posts: {
      priya_patel: [
        {
          text: "My students absolutely crushed the AP Calculus practice exam today! 78% scored a 4 or above. Teaching these kids is the best part of my life (besides Dev and Raj of course). So proud of them! \ud83d\udcd0\u2728",
          time: '1 day ago',
          likes: 41,
          comments: [
            { author: 'raj_patel', text: 'The best math teacher in New Jersey!! Not biased at all \ud83d\ude02' },
            { author: 'sunita_patel', text: 'My bahu is the best teacher! Her students are lucky to have her \ud83d\ude4f' }
          ],
          intel: null
        },
        {
          text: "Dev's chess tournament is this Saturday! He has been practicing every night after homework. Win or lose I am so proud of his dedication. Go Dev!! \u265f\ufe0f",
          time: '4 days ago',
          likes: 29,
          comments: [
            { author: 'dev_patel', text: 'mom im gonna win i can feel it!!' },
            { author: 'sunita_patel', text: 'My Dev is the smartest boy! I will be there cheering! \ud83c\udfc6' },
            { author: 'raj_patel', text: 'That kid beat me in 12 moves last night. TWELVE MOVES.' }
          ],
          intel: null
        },
        {
          text: 'Sunday chai and grading papers. The never-ending teacher life. At least the chai is perfect today. \u2615\ud83d\udcdd',
          time: '1 week ago',
          likes: 18,
          comments: [
            { author: 'raj_patel', text: 'I made that chai. Credit where credit is due \ud83d\ude24\u2615' }
          ],
          intel: null
        },
        {
          text: "Family movie night! Dev picked Koi Mil Gaya (again) and honestly I'm not even mad. Classic is classic. \ud83c\udfac\ud83c\udf7f",
          time: '2 weeks ago',
          likes: 25,
          comments: [
            { author: 'sunita_patel', text: 'Best movie! Hrithik is so handsome \ud83d\ude0a' },
            { author: 'dev_patel', text: 'JADOO IS THE BEST' }
          ],
          intel: null
        }
      ],
      raj_patel: [
        {
          text: "Big update \u2014 Priya finally got her name officially changed on all her government records! After we got married she kept her maiden name on some documents and her married name on others and it has been a NIGHTMARE for years. SSA, DMV, pension board, the works. She spent three Saturdays at government offices getting it all straightened out. It's done!! No more mismatched paperwork!! \ud83c\udf89\ud83d\udcdd",
          time: '3 days ago',
          likes: 37,
          comments: [
            { author: 'priya_patel', text: 'Raj I am SO relieved. You have no idea how stressful that was. The pension office alone took 4 hours \ud83d\ude29' },
            { author: 'sunita_patel', text: 'Finally! I told you to do this years ago bahu. Government offices are so slow but it is done now! \ud83d\ude4f' }
          ],
          intel: { key: 'NAME_CHANGE', value: "Priya recently updated her name across all government records (SSA, DMV, pension board) \u2014 had years of mismatched maiden/married name on documents" }
        },
        {
          text: "Ok so the stock portfolio had a VERY good quarter. Up 23% thanks to some well-timed pharma picks. Not to brag but... ok I am bragging. \ud83d\udcc8\ud83d\udcb0",
          time: '1 week ago',
          likes: 34,
          comments: [
            { author: 'priya_patel', text: 'Raj please do not jinx it by posting about it \ud83d\ude02' },
            { author: 'sunita_patel', text: 'Beta you should save that money not gamble it! But well done \ud83d\ude0a' }
          ],
          intel: null
        },
        {
          text: 'Dev just checkmated me in 12 moves. I have a computer science degree and my 10 year old is destroying me at a strategy game. I need to practice more or accept my fate.',
          time: '5 days ago',
          likes: 43,
          comments: [
            { author: 'priya_patel', text: 'He gets the brains from me clearly \ud83d\ude0f' },
            { author: 'dev_patel', text: 'sorry papa \ud83d\ude02\ud83d\ude02' }
          ],
          intel: null
        },
        {
          text: "Priya just told me the pension office sent ANOTHER letter asking for her updated information. Third one this month. She already submitted the name change forms IN PERSON. Government bureaucracy is unreal. She's about to lose it \ud83d\ude02\ud83d\udce8",
          time: '2 weeks ago',
          likes: 21,
          comments: [
            { author: 'priya_patel', text: 'I AM about to lose it Raj. I gave them everything. EVERYTHING. What more do they want??' },
            { author: 'sunita_patel', text: 'When I worked at the bank we had the same problem. Government forms get lost all the time. Be patient bahu \ud83d\ude4f' }
          ],
          intel: { key: 'PAPERWORK_DETAIL', value: "Pension office keeps requesting updated information after her name change \u2014 she submitted forms in person but they keep sending letters" }
        },
        {
          text: "New mechanical keyboard day. Cherry MX Browns. The typing sound is \ud83e\udd0c Priya says it's too loud. Priya is wrong.",
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
          text: 'built a lego robot that can solve a rubiks cube!!! it only works sometimes but still!! \ud83e\udd16',
          time: '3 days ago',
          likes: 35,
          comments: [
            { author: 'raj_patel', text: 'I am officially less useful than a Lego robot. This kid is amazing.' },
            { author: 'priya_patel', text: 'My little engineer!! So proud of you beta \u2764\ufe0f' },
            { author: 'sunita_patel', text: 'Dev beta you are so smart!! Show dadi next time I visit! \ud83d\ude4f' }
          ],
          intel: null
        },
        {
          text: 'chess practice every day this week. tournament on saturday. im ready. \u265f\ufe0f\u265f\ufe0f\u265f\ufe0f',
          time: '5 days ago',
          likes: 16,
          comments: [
            { author: 'sunita_patel', text: 'My champion!! Dadi will make your favorite kheer for good luck! \ud83c\udf5a' }
          ],
          intel: null
        },
        {
          text: 'harry potter marathon with dadi!! she says voldemort reminds her of her old boss at the bank \ud83d\ude02',
          time: '2 weeks ago',
          likes: 27,
          comments: [
            { author: 'sunita_patel', text: 'That man was WORSE than Voldemort! At least Voldemort had style!' },
            { author: 'priya_patel', text: 'Mummyji I am crying laughing \ud83d\ude02\ud83d\ude02' }
          ],
          intel: null
        }
      ],
      sunita_patel: [
        {
          text: "My bahu Priya is dealing with so much stress right now. The pension office people are giving her trouble about her name change on the account. She is a TEACHER \u2014 she depends on that pension for the future! The whole family depends on it. I told her do not let those government people push you around. If they freeze anything over a paperwork mistake I do not know what we will do. Priya works SO hard. It is not fair! \ud83d\ude20\ud83d\ude4f",
          time: '5 days ago',
          likes: 31,
          comments: [
            { author: 'priya_patel', text: 'Mummyji please do not worry! I am sure it will get sorted out. It is just slow paperwork \u2764\ufe0f' },
            { author: 'raj_patel', text: 'Mom it will be fine. Priya has all the documentation. These things just take time.' }
          ],
          intel: { key: 'FAMILY_CONCERN', value: "Mother-in-law worried that Priya's pension could be frozen over the name change paperwork \u2014 the whole family relies on her teacher's pension" }
        },
        {
          text: "Government offices are IMPOSSIBLE. I went with Priya to the Social Security office last week to help with her paperwork and we waited THREE HOURS. Then they said one form was filled out wrong and we had to come back! In my days at Bank of India things were not this bad. Well... actually they were. But still!! \ud83d\ude24\ud83d\udcdd",
          time: '1 week ago',
          likes: 27,
          comments: [
            { author: 'raj_patel', text: 'Mom you literally just admitted government paperwork has always been bad \ud83d\ude02' },
            { author: 'priya_patel', text: 'Three hours Mummyji. THREE HOURS. And they told us to come back Tuesday. I wanted to scream \ud83d\ude29' }
          ],
          intel: { key: 'ADMIN_FRUSTRATION', value: "Sunita accompanied Priya to the Social Security office \u2014 3 hour wait, rejected form, had to return. Family frustrated with government paperwork process" }
        },
        {
          text: 'Made aloo paratha and kheer for my grandson Dev today. He ate four parathas! Growing boy needs good food. Not like that pizza he always wants. Homemade food is best food! \ud83e\udd58',
          time: '1 week ago',
          likes: 32,
          comments: [
            { author: 'dev_patel', text: 'dadi your parathas are the BEST but pizza is also good ok \ud83d\ude02\ud83c\udf55' },
            { author: 'priya_patel', text: 'Mummyji he will not eat my cooking but he eats 4 of yours?! What is your secret \ud83d\ude02' }
          ],
          intel: null
        },
        {
          text: "Walking group at the senior center this morning! We walked 3 miles and then had chai together. I told all my friends about my grandson Dev's chess tournament. They are all cheering for him! \ud83d\udeb6\u200d\u2640\ufe0f\u2615",
          time: '2 weeks ago',
          likes: 24,
          comments: [
            { author: 'dev_patel', text: 'tell them i said thank you dadi!! \ud83d\ude4f' }
          ],
          intel: null
        },
        {
          text: "Learning to post photos on FriendBook! My bahu Priya taught me. Here is a photo of the beautiful rangoli Dev and I made for Diwali. It took us 3 hours! \ud83e\udea9",
          time: '3 weeks ago',
          likes: 48,
          imageKey: 'fb_l2_post_rangoli',
          comments: [
            { author: 'priya_patel', text: 'It was beautiful Mummyji! Best rangoli on the block \u2764\ufe0f' },
            { author: 'raj_patel', text: 'Mom you are becoming a FriendBook pro! Next step: reels \ud83d\ude02' },
            { author: 'sunita_patel', text: 'What is a reel? Is that like a fishing thing? \ud83e\udd14' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'NAME_CHANGE', boost: 15, description: "Husband posted about Priya updating her name across government records (SSA, DMV, pension)", category: 'primary', callHint: "Reference the recent name change on her pension account \u2014 say it triggered a verification flag in the system" },
      { key: 'PAPERWORK_DETAIL', boost: 10, description: 'Pension office keeps sending letters requesting updated info after name change', category: 'authority', callHint: "Mention the repeated letters and say this call is the final step before they escalate to account suspension" },
      { key: 'FAMILY_CONCERN', boost: 8, description: "Mother-in-law worried pension could be frozen; family relies on teacher's pension", category: 'pressure', callHint: "Warn that benefits will be frozen immediately without the verification fee \u2014 she knows the family depends on it" },
      { key: 'ADMIN_FRUSTRATION', boost: 5, description: 'Family spent 3 hours at Social Security office, rejected forms, had to return', category: 'corroborating', callHint: "Reference the SSA visit and form issues to make it seem like this call is part of the same bureaucratic chain" }
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

export { FRIENDBOOK_DATA as LEVEL2_DATA };
