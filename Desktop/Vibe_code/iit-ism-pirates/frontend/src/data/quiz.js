// quiz.js - Admissions Pirate Aptitude Assessment Questions & Ranks
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'How do ye handle an 8:00 AM mandatory lecture at the Great Chamber (GJLT)?',
    options: [
      { text: 'Set 14 alarms, sleep through all of \'em, and blame the ocean tide.', score: 25 },
      { text: 'Sail into the gallery in full pirate regalia and sleep with eyes wide open.', score: 50 },
      { text: 'Bribe a parrot to sit in my designated seat and screech "Present, Captain!"', score: 100 },
      { text: 'Show up at 7:55 AM with three freshly sharpened quills. (Suspiciously non-pirate)', score: 0 }
    ]
  },
  {
    id: 2,
    question: 'The mess serves mysterious grey dal that looks like bilge water. What is your course of action?',
    options: [
      { text: 'Declare a full-scale galley mutiny and demand extra fried papad.', score: 100 },
      { text: 'Douse it with 5 spoonfuls of red chili powder and swallow it without chewing.', score: 75 },
      { text: 'Sprint directly to Jasper Night Canteen for a Paneer Cheese Roll.', score: 90 },
      { text: 'Politely write a 3-page formal email to the Mess Committee.', score: 10 }
    ]
  },
  {
    id: 3,
    question: 'You encounter a 10-foot long Dhanbad monkey guarding the corridor of Amber Hostel. How do you pass?',
    options: [
      { text: 'Offer a peace tribute of one Parle-G biscuit and back away slowly bowing.', score: 100 },
      { text: 'Challenge the primate to an honorable rapier duel for corridor supremacy.', score: 85 },
      { text: 'Climb out of the window and scale the external drainage pipes.', score: 60 },
      { text: 'Try to pet it and say "good monkey". (Guaranteed trip to the Health Centre)', score: 5 }
    ]
  },
  {
    id: 4,
    question: 'How do you prepare for the End-Semester Examination with 6 hours remaining before sunrise?',
    options: [
      { text: 'Invoke ancient dark sorcery by watching 10 hours of YouTube playlists at 2.5x speed.', score: 100 },
      { text: 'Pray to Lord Irwin\'s ghost in the Heritage Building and hope for divine bell-curving.', score: 80 },
      { text: 'Accept your fate, brew a bucket of midnight grog, and start memorizing Wikipedia.', score: 70 },
      { text: 'Sleep peacefully for 8 hours because you studied consistently since August. (Alien behavior)', score: 0 }
    ]
  },
  {
    id: 5,
    question: 'What is your weapon of choice during the annual Hostel Wars water balloon siege?',
    options: [
      { text: 'High-pressure bucket launcher calibrated with thermodynamic precision.', score: 100 },
      { text: 'Water-filled surgical gloves dropped from the 13th floor of Aquamarine.', score: 95 },
      { text: 'Diplomatic neutrality while eating samosas safely behind reinforced glass.', score: 40 },
      { text: 'An umbrella with institute logo. (Instantly disintegrated)', score: 10 }
    ]
  }
];

export const PIRATE_RANKS = [
  {
    title: 'Grand Admiral of the Broken Compass',
    stars: '⭐⭐⭐⭐⭐',
    description: 'Ye possess legendary chaos intellect. You don\'t navigate the storm—the storm runs away from you! Admitted with full scholarship in Doubloons.',
    badge: '👑 HIGH ADMIRAL',
    allocatedShip: 'Aquamarine Sky-Galleon (Deck 13 Penthouse)'
  },
  {
    title: 'Master-at-Arms of Midnight Samosas',
    stars: '⭐⭐⭐⭐',
    description: 'Fearless raider of late-night canteens and master of 2.5x YouTube lecture cramming. Ready to board any exam hall with confidence!',
    badge: '⚔️ FIRST MATE',
    allocatedShip: 'Jasper Heavy Ironclad'
  },
  {
    title: 'Chief Powder Monkey & Chaos Catalyst',
    stars: '⭐⭐⭐',
    description: 'You ignite explosions wherever you step. The mess cooks fear your name and the Wi-Fi routers tremble when you plug in.',
    badge: '💣 POWDER MONKEY',
    allocatedShip: 'Amber War Galleon'
  },
  {
    title: 'Quartermaster of Lost Wi-Fi Signals',
    stars: '⭐⭐',
    description: 'Constantly wandering corridors searching for the fabled 5-bar connection. Your resilience against buffering is legendary.',
    badge: '📡 NAVIGATOR',
    allocatedShip: 'Sapphire Ocean Raider'
  },
  {
    title: 'Cabin Boy / Deck Swabber 1st Class',
    stars: '⭐',
    description: 'You tried to be too civilized for this pirate fleet. Report immediately to the Heritage Building with a bucket and mop!',
    badge: '🧹 DECK SWABBER',
    allocatedShip: 'Diamond Flagship (Bilge Deck)'
  }
];
