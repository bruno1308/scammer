/**
 * FriendBook data for Level 1: Consumer Refund Scams
 * Difficulty: Easy — clues are on the victim's own profile
 *
 * Intel redesign: each piece of intel makes the scam story CREDIBLE
 * rather than just revealing personal trivia.
 *
 * Categories per victim:
 *   primary (boost 15)       — The specific purchase/transaction to reference
 *   corroborating (boost 10) — A detail that makes you sound like you have their file
 *   authority (boost 8)      — Payment method or account detail adding legitimacy
 *   timing (boost 5)         — When it happened, making the claim date-specific
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
        portraitKey: 'fb_l1_karen_mitchell',
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
        portraitKey: 'fb_l1_mike_mitchell',
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
        portraitKey: 'fb_l1_emma_mitchell',
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
          text: "Just ordered the LEGO Unicorn set on Amazon for my granddaughter Emma's birthday! $49.99 \u2014 a little pricey but she's been begging for months. She's going to be 8 \u2014 where does the time go? \u{1f381}",
          time: '2 hours ago',
          likes: 8,
          comments: [
            { author: 'karen_mitchell', text: "Mom you always spoil her \u{1f602} She's already asking what Grandma got her!" }
          ],
          intel: { key: 'AMAZON_ORDER', value: 'Dorothy ordered a LEGO Unicorn set ($49.99) on Amazon for her granddaughter' }
        },
        {
          text: "Beautiful morning at First Baptist. Pastor Dave's sermon really spoke to me today. Feeling blessed. \u{1f64f}",
          time: '1 day ago',
          likes: 14,
          imageKey: 'fb_l1_post_church_sermon',
          comments: [
            { author: 'karen_mitchell', text: 'Love you Mom \u2764\ufe0f' }
          ],
          intel: null
        },
        {
          text: "My tomatoes are finally coming in! Harold would have been so proud of this year's garden. Miss you every day, sweetheart. \u{1f331}",
          time: '3 days ago',
          likes: 22,
          imageKey: 'fb_l1_post_tomatoes',
          comments: [
            { author: 'mike_mitchell', text: "Those look amazing Dorothy! Save some for us when we visit?" },
            { author: 'karen_mitchell', text: "Dad loved your garden. He'd say 'best tomatoes in Iowa' \u2764\ufe0f" }
          ],
          intel: null
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
          intel: { key: 'ORDER_DETAILS', value: "Dorothy ordered a LEGO Unicorn set for $49.99 as a birthday gift \u2014 Emma turns 8 next Tuesday" }
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
          text: "Dorothy just texted me asking if her Visa got charged twice for the Amazon order. Told her it's probably just a pending hold. She worries about every little charge on that card \u2014 she uses her Visa debit for everything online. \u{1f602}",
          time: '1 day ago',
          likes: 6,
          comments: [
            { author: 'karen_mitchell', text: "She called me about it too! Mom, if you're reading this, it's FINE \u{1f602}" }
          ],
          intel: { key: 'PAYMENT_CARD', value: 'Dorothy used her Visa debit card for the Amazon purchase' }
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
          text: "grandma ordered me a birthday present on saturday and it says it shipped already!! tracking says delivery by wednesday!! i think its the unicorn lego set!!! \u{1f984}\u{1f984}\u{1f984}",
          time: '1 day ago',
          likes: 14,
          comments: [
            { author: 'dorothy_miller', text: "No peeking, young lady! \u{1f60a}" },
            { author: 'karen_mitchell', text: "Emma do NOT look at Grandma's order history again \u{1f624}" }
          ],
          intel: { key: 'DELIVERY_STATUS', value: "Dorothy's Amazon order shipped Saturday, tracking shows delivery by Wednesday" }
        },
        {
          text: "my cat mr whiskers learned a new trick!! he sits when i say sit!! well sometimes \u{1f431}",
          time: '3 days ago',
          likes: 18,
          comments: [
            { author: 'dorothy_miller', text: "Mr. Whiskers is such a smart kitty! Just like his owner \u{1f60a}" }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'AMAZON_ORDER', boost: 15, description: 'Ordered a LEGO Unicorn set ($49.99) on Amazon', category: 'primary', callHint: 'Reference her specific Amazon order for the LEGO set to establish you have her account on file' },
      { key: 'ORDER_DETAILS', boost: 10, description: 'Order was $49.99 birthday gift for granddaughter', category: 'corroborating', callHint: 'Mention the $49.99 charge and the item description to sound like you are reading her order record' },
      { key: 'PAYMENT_CARD', boost: 8, description: 'Paid with Visa debit card', category: 'authority', callHint: 'Say "the Visa debit card on file" to sound like you see her payment method' },
      { key: 'DELIVERY_STATUS', boost: 5, description: 'Order shipped Saturday, delivery by Wednesday', category: 'timing', callHint: 'Mention the shipping status or Saturday order date to make the billing error feel date-specific' }
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
        portraitKey: 'fb_l1_richard_patterson',
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
        portraitKey: 'fb_l1_lisa_patterson',
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
        portraitKey: 'fb_l1_tyler_patterson',
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
          imageKey: 'fb_l1_post_fishing_lake',
          comments: [
            { author: 'richard_patterson', text: 'Ha! Took ME about 50 tries when you taught me, Dad.' },
            { author: 'tyler_patterson', text: 'grandpa i caught a bigger one than you and you know it \u{1f60e}' }
          ],
          intel: null
        },
        {
          text: "Checked my Arizona Federal Credit Union statement and there's a charge for $347 from some electronics store I've never heard of. I didn't buy anything! Richard says call the bank but I hate those phone menus. This kind of thing never happened with checkbooks. \u{1f620}",
          time: '2 days ago',
          likes: 5,
          comments: [
            { author: 'richard_patterson', text: "Dad do NOT call any number from a random email. Let me look at it when I come Saturday. Could be fraud." },
            { author: 'lisa_patterson', text: "Harold, freeze the card just in case. Richard will sort it out." }
          ],
          intel: { key: 'BANK_NAME', value: "Harold's bank is Arizona Federal Credit Union \u2014 he saw a suspicious charge on his statement" }
        },
        {
          text: "Well, I finally did it \u2014 used my debit card to order myself a new laptop from Best Buy online. $489 on my checking account. My old one was slower than molasses. Richard says I need to \"set up the cloud\" whatever that means. Wish Ruth was here, she was always better with these gadgets than me.",
          time: '4 days ago',
          likes: 7,
          comments: [
            { author: 'richard_patterson', text: "Dad I told you I'd come set it up this weekend. Please don't click on anything until I get there." },
            { author: 'lisa_patterson', text: 'Exciting! You can video call Tyler now \u{1f60a}' }
          ],
          intel: { key: 'RECENT_CHARGE', value: 'Harold recently purchased a laptop from Best Buy for $489 using his debit card' }
        },
        {
          text: "Beautiful sunset over the Catalinas tonight. God's country right here. \u{1f305}",
          time: '1 week ago',
          likes: 16,
          imageKey: 'fb_l1_post_sunset_catalinas',
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
          text: "Dad just called me about a weird charge on his checking account. He's had the same Arizona Federal debit card for 15 years and barely uses it online. Told him a hundred times to check the app but he still reads the paper statements with a magnifying glass. I'll look into it Saturday. \u{1f626}",
          time: '1 day ago',
          likes: 8,
          comments: [
            { author: 'lisa_patterson', text: 'Let me know if you need me to call the bank. I can go through the fraud process with them.' },
            { author: 'harold_patterson', text: 'I do NOT need an app, Richard. The paper works fine.' }
          ],
          intel: { key: 'ACCOUNT_TYPE', value: "Harold uses a checking account with a debit card at Arizona Federal \u2014 has had the account for 15 years" }
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
          text: "Harold's been stressing about that charge on his account since Thursday. He barely slept worrying about it. Richard's going over Saturday to help him sort it out with Arizona Federal. Poor guy just used his debit card online for the first time for that laptop and now he thinks the internet is stealing from him. \u{1f622}",
          time: '1 day ago',
          likes: 6,
          comments: [
            { author: 'richard_patterson', text: "I'll handle it. Just need him to stop panicking." },
            { author: 'harold_patterson', text: 'I am NOT panicking. I am concerned.' }
          ],
          intel: { key: 'TRANSACTION_TIMING', value: 'The suspicious charge appeared on Thursday (about 3 days ago) \u2014 shortly after his first online purchase' }
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
      { key: 'BANK_NAME', boost: 15, description: 'Banks at Arizona Federal Credit Union', category: 'primary', callHint: 'Say "Arizona Federal Credit Union fraud department" to sound like you are his actual bank' },
      { key: 'RECENT_CHARGE', boost: 10, description: 'Recent $489 Best Buy laptop purchase on debit card', category: 'corroborating', callHint: 'Reference his $489 Best Buy purchase to explain how the "unauthorized charge" appeared on his account' },
      { key: 'ACCOUNT_TYPE', boost: 8, description: 'Checking account with debit card, 15-year customer', category: 'authority', callHint: 'Say "your checking account" or "debit card ending in" to sound like you are looking at his account file' },
      { key: 'TRANSACTION_TIMING', boost: 5, description: 'Suspicious charge appeared Thursday', category: 'timing', callHint: 'Say "the charge from Thursday" to match the timeline he already knows' }
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
        portraitKey: 'fb_l1_ken_nakamura',
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
        portraitKey: 'fb_l1_yuki_nakamura_davis',
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
        portraitKey: 'fb_l1_marcus_davis',
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
          text: "Refilled my blood pressure medication and the arthritis pills through NorthwestRx this morning. Three prescriptions total and they charged my Blue Cross card $214! When did pills get so expensive? Ken says I should ask the doctor about generics but I don't want to mess with what's working. \u{1f48a}\u{1f614}",
          time: '1 day ago',
          likes: 9,
          comments: [
            { author: 'yuki_nakamura_davis', text: 'Mom, generics are the same thing. Ask Dr. Tanaka next visit. $214 is ridiculous.' },
            { author: 'ken_nakamura', text: 'The blood pressure one alone was $89. I checked.' }
          ],
          intel: { key: 'PHARMACY_ORDER', value: 'Betty ordered prescriptions through NorthwestRx online pharmacy \u2014 total was $214' }
        },
        {
          text: "Made a little watercolor card for my granddaughter Hana's art show at school. She insisted on adding \"sparkles\" so we glued on some glitter together. My kitchen is now 40% glitter. Worth it. \u2728\u{1f3a8}",
          time: '3 days ago',
          likes: 28,
          imageKey: 'fb_l1_post_watercolor_card',
          comments: [
            { author: 'marcus_davis', text: 'She has been talking about the card all week. You made her day, Betty!' },
            { author: 'yuki_nakamura_davis', text: 'Mom the glitter is also in my car now somehow \u{1f602}' }
          ],
          intel: null
        },
        {
          text: "Ken tried to help me order new watercolor brushes online and somehow we ended up on a page asking for our credit card to \"verify our Amazon account.\" Closed the whole thing. Is that normal? These computers make me so nervous. \u{1f615}",
          time: '4 days ago',
          likes: 5,
          comments: [
            { author: 'yuki_nakamura_davis', text: 'MOM. That was a scam page. Please do NOT enter your credit card anywhere like that. I am coming over Saturday to look at your computer.' },
            { author: 'ken_nakamura', text: 'I told her not to worry about it but Yuki you should probably take a look.' }
          ],
          intel: null
        },
        {
          text: "Big Fred Meyer run today \u2014 stocked up on baking supplies. Going to attempt Ken's mother's mochi recipe this weekend. Wish me luck! Last time was... crunchy. \u{1f605}",
          time: '5 days ago',
          likes: 12,
          comments: [
            { author: 'ken_nakamura', text: 'It was not that bad. Only a little crunchy.' },
            { author: 'yuki_nakamura_davis', text: 'Dad you are a diplomat \u{1f602}' }
          ],
          intel: null
        },
        {
          text: "Spotted a Varied Thrush in the backyard this morning! First one this season. Ken said \"it's just a bird\" but I got a beautiful photo. He doesn't understand. \u{1f426}",
          time: '1 week ago',
          likes: 15,
          imageKey: 'fb_l1_post_bird_photo',
          comments: [
            { author: 'marcus_davis', text: 'Great shot Betty! The lighting is perfect.' }
          ],
          intel: null
        }
      ],
      ken_nakamura: [
        {
          text: "Betty's pharmacy bill this month is highway robbery. $214 for three medications! The blood pressure pill, the arthritis one, and the thyroid medication. Back in my day a doctor visit AND the prescription cost you twenty bucks. I told her to switch to that Canadian pharmacy Yuki found but she \"trusts NorthwestRx.\" Loyalty is expensive. \u{1f4b8}",
          time: '1 day ago',
          likes: 11,
          comments: [
            { author: 'betty_nakamura', text: 'Ken, I have been going to the same pharmacy for five years. I am not changing now.' },
            { author: 'yuki_nakamura_davis', text: 'Dad the Canadian one requires a whole new signup process. Just let Mom use NorthwestRx.' }
          ],
          intel: { key: 'PRESCRIPTION_DETAILS', value: 'Betty takes three medications: blood pressure, arthritis, and thyroid \u2014 total $214' }
        },
        {
          text: "Finally finished the N-scale mountain tunnel for the train layout. Only took 6 months, 3 trips to Home Depot, and one very patient wife. \u{1f682}",
          time: '3 days ago',
          likes: 16,
          imageKey: 'fb_l1_post_model_train',
          comments: [
            { author: 'betty_nakamura', text: 'It looks wonderful, honey. Now please clean up the garage. \u{1f60a}' },
            { author: 'yuki_nakamura_davis', text: 'Dad your train room is getting out of hand and I love it \u{1f602}' }
          ],
          intel: null
        },
        {
          text: "Happy anniversary to my beautiful Betty. 50 years and she still laughs at my bad jokes. That's love, folks. \u{1f338}",
          time: '4 days ago',
          likes: 52,
          comments: [
            { author: 'betty_nakamura', text: 'I laugh DESPITE them, Ken. \u2764\ufe0f' }
          ],
          intel: null
        }
      ],
      yuki_nakamura_davis: [
        {
          text: "Mom called me upset because NorthwestRx charged her Blue Cross card for the full $214 but she thought the insurance was supposed to cover more. I looked into it and her old plan changed their formulary \u2014 the blood pressure med doubled in price since last year. Spent an hour on the phone with Blue Cross. Healthcare in this country... \u{1f621}",
          time: '12 hours ago',
          likes: 27,
          comments: [
            { author: 'betty_nakamura', text: 'Thank you for calling them, sweetie. I just can\'t deal with those phone menus.' },
            { author: 'ken_nakamura', text: 'Did they say anything about the blood pressure medication coverage?' },
            { author: 'yuki_nakamura_davis', text: 'Still waiting on a callback. I\'ll let you know.' }
          ],
          intel: { key: 'BILLING_METHOD', value: 'Betty pays for prescriptions with her Blue Cross insurance card \u2014 coverage recently changed' }
        },
        {
          text: "Hana's first art show at school today! She painted a family portrait \u2014 we're all purple apparently. So proud of this creative kiddo. \u{1f3a8}\u{1f49c}",
          time: '2 days ago',
          likes: 33,
          imageKey: 'fb_l1_post_hana_art_show',
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
          text: "Betty told me she placed her refill order yesterday morning and is already anxious the confirmation email hasn't come. I checked for her \u2014 it was in her spam folder. NorthwestRx sends the confirmation right away but her email flags everything. Took 20 minutes to explain what a spam folder is. Worth it for the cookies she gave me as thanks. \u{1f36a}",
          time: '12 hours ago',
          likes: 14,
          comments: [
            { author: 'betty_nakamura', text: 'Those cookies were for Hana! But you can have some too. \u{1f60a}' },
            { author: 'yuki_nakamura_davis', text: 'Marcus you are a saint. Also save me a cookie.' }
          ],
          intel: { key: 'REFILL_TIMING', value: 'Betty placed her prescription refill order yesterday morning' }
        },
        {
          text: "Hana asked me to photograph her stuffed animals \"for their portfolio.\" I now have 47 professional headshots of teddy bears. This is my life.",
          time: '6 days ago',
          likes: 42,
          imageKey: 'fb_l1_post_teddy_bears',
          comments: [
            { author: 'betty_nakamura', text: "That is the most adorable thing I've ever heard! \u{1f60d}" },
            { author: 'ken_nakamura', text: 'Frame them all.' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'PHARMACY_ORDER', boost: 15, description: 'Recent prescription order from NorthwestRx for $214', category: 'primary', callHint: 'Reference her recent NorthwestRx order to establish you are calling from the pharmacy billing department' },
      { key: 'PRESCRIPTION_DETAILS', boost: 10, description: 'Three medications: blood pressure, arthritis, thyroid', category: 'corroborating', callHint: 'Mention her specific medications to sound like you are reading her prescription file' },
      { key: 'BILLING_METHOD', boost: 8, description: 'Pays with Blue Cross insurance card', category: 'authority', callHint: 'Reference her Blue Cross card or insurance billing to sound like you see her payment records' },
      { key: 'REFILL_TIMING', boost: 5, description: 'Refill order placed yesterday morning', category: 'timing', callHint: 'Say "your refill from yesterday morning" to match the exact timeline' }
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
        portraitKey: 'fb_l1_denise_washington_taylor',
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
        portraitKey: 'fb_l1_jerome_taylor',
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
        portraitKey: 'fb_l1_marcus_taylor',
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
          text: "My internet bill from Peachtree Broadband came in at $127 this month. WHAT. I signed up for the Basic 50 plan at $65/month three years ago and the bill just keeps going up! Denise says I should call and complain but every time I call them I'm on hold for an hour. This is robbery. \u{1f620}",
          time: '1 day ago',
          likes: 12,
          comments: [
            { author: 'denise_washington_taylor', text: "Daddy I will call them for you. $127 for basic internet is insane. They're overcharging you." },
            { author: 'jerome_taylor', text: 'Earl, we pay $65 for the same speed. They are definitely padding your bill.' },
            { author: 'marcus_taylor', text: 'grandpa you should switch to fiber!! its way faster AND cheaper' }
          ],
          intel: { key: 'ISP_PROVIDER', value: "Earl's internet provider is Peachtree Broadband \u2014 he's being charged $127/month for basic internet" }
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
          intel: null
        },
        {
          text: "Sunday morning at Ebenezer Baptist. Choir was on FIRE today. Gloria always said the choir sounded like heaven itself. Seven years without her and Sundays still feel empty in that pew. But God is good. \u{1f64f}",
          time: '4 days ago',
          likes: 29,
          comments: [
            { author: 'denise_washington_taylor', text: 'Mama is singing right along with them, Daddy. I know it. \u2764\ufe0f' },
            { author: 'jerome_taylor', text: 'Amen, Mr. Washington.' }
          ],
          intel: null
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
          text: "Called Peachtree Broadband about Daddy's bill. They put me on hold for 40 MINUTES and then told me the rate is \"correct\" because he has \"premium support\" bundled in at $62/month. He never signed up for premium support! He's on the Basic 50 plan \u2014 should be $65 flat. I am filing a complaint with the state AG's office. This company is preying on seniors. \u{1f621}",
          time: '8 hours ago',
          likes: 34,
          comments: [
            { author: 'earl_washington', text: 'Premium support?? I have never heard of that in my life!' },
            { author: 'jerome_taylor', text: 'Get \'em, Denise. Put that law degree to work. \u{1f602}' }
          ],
          intel: { key: 'PLAN_DETAILS', value: "Earl is on the Basic 50 plan ($65/month) but being charged $127 due to unauthorized 'premium support' add-on at $62/month" }
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
          text: "i set up grandpa's internet for him last month because peachtree broadband said he needed a \"technician visit\" for $75. i did it in 10 minutes. he's been a customer since 2021 and they still try to charge him for basic stuff. \u{1f620}",
          time: '2 days ago',
          likes: 24,
          comments: [
            { author: 'denise_washington_taylor', text: 'Marcus you are a good grandson. And Peachtree is going to hear from me.' },
            { author: 'earl_washington', text: 'That boy saved me $75! I owe him some of my potato salad.' }
          ],
          intel: { key: 'ACCOUNT_HISTORY', value: "Earl has been a Peachtree Broadband customer since 2021 \u2014 about 5 years" }
        },
        {
          text: "ok so i looked at grandpa's peachtree broadband billing history and they added \"premium support\" to his account back in October without him knowing. thats 6 months of extra charges at $62/month he never signed up for!! this is a scam fr \u{1f621}\u{1f621}",
          time: '1 day ago',
          likes: 19,
          comments: [
            { author: 'denise_washington_taylor', text: 'Marcus how did you find this?? Can you send me a screenshot?' },
            { author: 'marcus_taylor', text: 'i logged into his account and looked at the billing history. the extra charge started in october.' },
            { author: 'earl_washington', text: 'OCTOBER?! That is five months of stealing from me!' }
          ],
          intel: { key: 'BILLING_ISSUE', value: 'Unauthorized "premium support" add-on has been on his account since October \u2014 6 months of extra $62/month charges' }
        },
        {
          text: "my robot can now sort objects AND stack them!!! 2 months of coding and it finally works!! going to states!! \u{1f916}\u{1f916}\u{1f916}",
          time: '3 days ago',
          likes: 27,
          imageKey: 'fb_l1_post_robot_project',
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
          imageKey: 'fb_l1_post_earl_selfie',
          comments: [
            { author: 'denise_washington_taylor', text: 'I just saw that. Daddy does NOT know how to delete it either \u{1f602}' },
            { author: 'earl_washington', text: 'How do I remove this?? Marcus HELP' }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'ISP_PROVIDER', boost: 15, description: 'Internet provider is Peachtree Broadband', category: 'primary', callHint: 'Say "Peachtree Broadband billing department" to sound like his actual internet provider' },
      { key: 'PLAN_DETAILS', boost: 10, description: 'On Basic 50 plan at $65/month, being charged $127', category: 'corroborating', callHint: 'Reference his Basic 50 plan and the $127 charge to sound like you are looking at his account' },
      { key: 'BILLING_ISSUE', boost: 8, description: 'Unauthorized premium support add-on since October', category: 'authority', callHint: 'Mention the "premium support" charge to confirm you found the billing error he already suspects' },
      { key: 'ACCOUNT_HISTORY', boost: 5, description: 'Customer since 2021 (about 5 years)', category: 'timing', callHint: 'Say "as a customer since 2021" to sound like you are reading his account history' }
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
        portraitKey: 'fb_l1_patrick_obrien',
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
        portraitKey: 'fb_l1_colleen_obrien',
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
        portraitKey: 'fb_l1_baby_fiona_obrien',
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
          text: "Went to see Dr. Callahan at Mass General on Wednesday for my checkup. My MassHealth Plus plan covered the visit but he wants to run more bloodwork because my cholesterol is \"a little high.\" A little high! I'm 81 years old, what does he expect? Anyway, at least the staff there are wonderful. \u{1f3e5}",
          time: '2 days ago',
          likes: 18,
          comments: [
            { author: 'patrick_obrien', text: "Ma, please listen to the doctor. We want you around for a long time." },
            { author: 'colleen_obrien', text: 'Margaret did they say when the results come back? We can go with you to the follow-up.' }
          ],
          intel: { key: 'INSURANCE_PROVIDER', value: "Margaret is insured through MassHealth Plus \u2014 it covered her recent checkup at Mass General" }
        },
        {
          text: "My great-granddaughter Fiona smiled at me today and I swear my heart grew three sizes. Eight months old and she's already got me wrapped around her tiny finger. Knitting her a little Red Sox blanket. \u{1f476}\u2764\ufe0f",
          time: '3 days ago',
          likes: 36,
          comments: [
            { author: 'colleen_obrien', text: 'Margaret she lights up every time she sees you! You have the magic touch \u{1f60d}' },
            { author: 'patrick_obrien', text: 'Ma you\'ve knit that kid more blankets than she has years on earth \u{1f602}' }
          ],
          intel: null
        },
        {
          text: "Frank passed eight years ago today. Forty-two years of marriage and I still reach for his side of the bed every morning. Miss you, my love. Save me a seat up there. \u{1f54a}\ufe0f\u2764\ufe0f",
          time: '5 days ago',
          likes: 53,
          comments: [
            { author: 'patrick_obrien', text: 'Miss you every day, Dad. The best man I ever knew.' },
            { author: 'colleen_obrien', text: 'He was the kindest soul. Sending love, Margaret. \u2764\ufe0f' }
          ],
          intel: null
        },
        {
          text: "Walked to Stop & Shop this morning and the nice young man at the register helped me carry my bags to the bench outside. There are still good people in this world. Picked up some of those cookies Patrick likes. \u{1f36a}",
          time: '6 days ago',
          likes: 14,
          comments: [
            { author: 'patrick_obrien', text: 'Ma you should let me drive you! Stop carrying bags!' },
            { author: 'margaret_obrien', text: 'Patrick Michael, I have walked to that store for 40 years and I am not stopping now.' }
          ],
          intel: null
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
          text: "Ma called me after her doctor's appointment worried about the bloodwork. I told her it's routine but she's convinced \"high cholesterol\" means something terrible. She's been a nurse for 30 years, she KNOWS what it means, she just worries. Reminded her that her MassHealth Plus plan covers everything including the lab work. She pays the premium by auto-debit from her checking account every month and still asks me \"am I covered?\" every single time. \u{1f602}\u2764\ufe0f",
          time: '1 day ago',
          likes: 19,
          comments: [
            { author: 'margaret_obrien', text: "I am NOT worried, Patrick. I just like to be informed." },
            { author: 'colleen_obrien', text: 'Margaret you called Patrick three times about it. You were a LITTLE worried. \u{1f602}' }
          ],
          intel: { key: 'PAYMENT_METHOD', value: "Margaret pays her MassHealth Plus premium by auto-debit from her checking account monthly" }
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
          text: "Drove Margaret to her follow-up bloodwork at Mass General this morning. Dr. Callahan ordered a full lipid panel and a thyroid check. She insisted on going in alone \u2014 \"I was a nurse here for 25 years, Colleen, I know where the lab is.\" This was on Wednesday. Still waiting on results. She's been checking the mail every day for the letter. \u{1f605}\u2764\ufe0f",
          time: '1 day ago',
          likes: 15,
          comments: [
            { author: 'margaret_obrien', text: 'The results should come any day now. I just want to know so I can stop thinking about it.' },
            { author: 'patrick_obrien', text: "Ma they'll call you. Stop checking the mailbox." }
          ],
          intel: { key: 'RECENT_CLAIM', value: "Margaret had bloodwork done at Mass General on Wednesday \u2014 lipid panel and thyroid check ordered by Dr. Callahan" }
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
          intel: { key: 'COVERAGE_DETAILS', value: "Margaret's MassHealth Plus plan covers doctor visits, lab work, and prescriptions \u2014 she's had the plan for years" }
        }
      ]
    },
    intelKeys: [
      { key: 'INSURANCE_PROVIDER', boost: 15, description: 'Insured through MassHealth Plus', category: 'primary', callHint: 'Say "MassHealth Plus claims department" to sound like you are calling from her actual insurance provider' },
      { key: 'RECENT_CLAIM', boost: 10, description: 'Recent bloodwork claim at Mass General (lipid panel, thyroid)', category: 'corroborating', callHint: 'Reference her bloodwork from Mass General to sound like you see the claim in your system' },
      { key: 'COVERAGE_DETAILS', boost: 8, description: 'Plan covers visits, lab work, and prescriptions', category: 'authority', callHint: 'Mention her plan coverage details to sound like you are reading her policy file' },
      { key: 'PAYMENT_METHOD', boost: 5, description: 'Pays premium by auto-debit from checking account', category: 'timing', callHint: 'Reference the auto-debit payment method to sound like you have her billing records' }
    ]
  }
};

export function getLevel1FriendBook(victimName) {
  return FRIENDBOOK_DATA[victimName] || null;
}

export { FRIENDBOOK_DATA as LEVEL1_DATA };
