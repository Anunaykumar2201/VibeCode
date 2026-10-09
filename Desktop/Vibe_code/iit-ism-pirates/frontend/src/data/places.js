// places.js - 21 Campus Locations for The Isle of IIT (ISM) Pirate Treasure Map
// Grouped into 7 distinct zones with zero overlapping coordinates (>7% minimum distance).

export const ZONES = [
  { id: 'harbour_gate', name: 'Harbour Gate', description: 'South gateway where arriving privateer fleets anchor' },
  { id: 'academic_bay', name: 'Academic Bay', description: 'Central highland bastions of navigation and engineering arts' },
  { id: 'student_cove', name: 'Student Cove', description: 'East inlet of pirate culture, inventions, and festive assemblies' },
  { id: 'galley_wharf', name: 'Galley and Infirmary Wharf', description: 'Southwest taverns and medical quarters' },
  { id: 'sports_shores', name: 'Sports Shores', description: 'Southern tournament arena and athletic battle plains' },
  { id: 'hidden_isle', name: 'The Hidden Isle', description: 'Northwest green sanctuary and contemplative palm groves' },
  { id: 'treasure_caves', name: 'Treasure Caves', description: 'Northern subterranean halls where mining and engineering guilds dig' }
];

export const PLACES = [
  // 1. Harbour Gate
  {
    id: 'main_entrance',
    name: 'Sea Gate of Dhanbad (Main Gate)',
    realName: 'IIT (ISM) Dhanbad',
    zone: 'Harbour Gate',
    category: 'administration',
    categoryLabel: 'Harbour Gate',
    icon: '🚪',
    x: 50,
    y: 88,
    hours: '05:00 - 23:00 (Passports Checked)',
    openTime: '05:00',
    closeTime: '23:00',
    alwaysOpen: false,
    rating: 4.5,
    pirateNotes: 'The fortified stone sea portal greeting all newly arrived crews entering the 1926 archipelago.',
    description: 'Main campus entrance on Police Line Road with security sentinels and visitor registration.'
  },

  // 2. Academic Bay
  {
    id: 'admin_block',
    name: 'High Admiralty Command (Admin Block)',
    realName: 'Administrative Block',
    zone: 'Academic Bay',
    category: 'academic',
    categoryLabel: 'Academic Bay',
    icon: '🏛️',
    x: 44,
    y: 28,
    built: 1926,
    hours: '09:00 - 17:30 (Mon-Fri)',
    openTime: '09:00',
    closeTime: '17:30',
    alwaysOpen: false,
    rating: 4.8,
    pirateNotes: 'Where High Admirals decree institute charters, academic schedules, and manage the fleet.',
    description: 'Central administrative headquarters housing the Director\'s office, deans, and academic governance.'
  },
  {
    id: 'main_academic_building',
    name: 'The Great Navigation Deck',
    realName: 'Main Academic Building',
    zone: 'Academic Bay',
    category: 'academic',
    categoryLabel: 'Academic Bay',
    icon: '🏫',
    x: 54,
    y: 33,
    hours: '08:00 - 18:30 (Mon-Fri)',
    openTime: '08:00',
    closeTime: '18:30',
    alwaysOpen: false,
    rating: 4.7,
    pirateNotes: 'Endless corridors where scallywags navigate between morning tutorials, labs, and ship drills.',
    description: 'Primary central academic building with tutorial halls, department chambers, and lecture theatres.'
  },
  {
    id: 'olhc',
    name: 'Old Chamber of Torment (OLHC)',
    realName: 'Old Lecture Hall Complex',
    zone: 'Academic Bay',
    category: 'academic',
    categoryLabel: 'Academic Bay',
    icon: '⚡',
    x: 38,
    y: 38,
    hours: '08:00 - 18:00 (Mon-Fri)',
    openTime: '08:00',
    closeTime: '18:00',
    alwaysOpen: false,
    rating: 4.1,
    pirateNotes: 'Stepped gallery lecture complex where foundational engineering courses and drills take place.',
    description: 'Lecture complex featuring multiple stepped lecture halls for engineering courses.'
  },
  {
    id: 'central_library',
    name: 'Sacred Archives of Forbidden Scrolls',
    realName: 'Central Library',
    zone: 'Academic Bay',
    category: 'academic',
    categoryLabel: 'Academic Bay',
    icon: '📚',
    x: 48,
    y: 44,
    hours: '09:00 - 23:45 (Mon-Sun)',
    openTime: '09:00',
    closeTime: '23:45',
    alwaysOpen: false,
    rating: 4.8,
    pirateNotes: 'Air-conditioned sanctuary of charts and scrolls where silence is strictly enforced under penalty of plank.',
    description: 'State-of-the-art multi-storey central library with quiet study halls and digital archives.'
  },

  // 3. Student Cove
  {
    id: 'penman_auditorium',
    name: 'Council of the Damned (Penman)',
    realName: 'Penman Auditorium',
    zone: 'Student Cove',
    category: 'student',
    categoryLabel: 'Student Cove',
    icon: '🎭',
    x: 65,
    y: 38,
    hours: '08:30 - 21:00',
    openTime: '08:30',
    closeTime: '21:00',
    alwaysOpen: false,
    rating: 4.6,
    pirateNotes: 'Grand theatrical amphitheatre where annual sea festivals (Srijan & Concetto) erupt into pirate revelry.',
    description: 'Historic auditorium for orientations, convocations, cultural fests and guest lectures.'
  },
  {
    id: 'sac',
    name: 'Buccaneer Arena (SAC)',
    realName: 'Student Activity Centre',
    zone: 'Student Cove',
    category: 'student',
    categoryLabel: 'Student Cove',
    icon: '⚔️',
    x: 74,
    y: 52,
    hours: '06:00 - 00:00',
    openTime: '06:00',
    closeTime: '00:00',
    alwaysOpen: false,
    rating: 4.9,
    pirateNotes: 'Where scallywags train in swordplay (badminton), cannon-lifting (gym), and music room shanties.',
    description: 'Hub for student clubs, indoor sports courts, gymnasium, and student recreation.'
  },
  {
    id: 'edc',
    name: 'Captain\'s Manor (EDC)',
    realName: 'EDC',
    zone: 'Student Cove',
    category: 'student',
    categoryLabel: 'Student Cove',
    icon: '🏨',
    x: 78,
    y: 25,
    hours: '08:00 - 22:00 (Reception 24h)',
    openTime: '08:00',
    closeTime: '22:00',
    alwaysOpen: false,
    rating: 4.9,
    pirateNotes: 'Luxury suites reserved for visiting admirals, corporate headhunters, and distinguished pirate guests.',
    description: 'Executive Development Centre guest house with conference rooms and suites.'
  },
  {
    id: 'nvcti',
    name: 'Tinkerers\' Forge of Inventions',
    realName: 'NVCTI',
    zone: 'Student Cove',
    category: 'student',
    categoryLabel: 'Student Cove',
    icon: '⚙️',
    x: 62,
    y: 48,
    hours: '09:00 - 18:00 (Mon-Sat)',
    openTime: '09:00',
    closeTime: '18:00',
    alwaysOpen: false,
    rating: 4.9,
    pirateNotes: 'Where rogue engineers design automated treasure drones, IoT prototypes, and mechanical gear.',
    description: 'Naresh Vashisht Centre for Tinkering & Innovation equipped with 3D printers, robotics, and maker labs.'
  },

  // 4. Galley and Infirmary Wharf
  {
    id: 'main_canteen',
    name: 'Grog & Grub Tavern',
    realName: 'Main Canteen',
    zone: 'Galley and Infirmary Wharf',
    category: 'services',
    categoryLabel: 'Galley Wharf',
    icon: '🍗',
    x: 38,
    y: 62,
    hours: '07:00 - 23:30',
    openTime: '07:00',
    closeTime: '23:30',
    alwaysOpen: false,
    rating: 4.2,
    pirateNotes: 'Hot samosas, egg rolls, and infinite sweet chai fueled by desperate midnight exam crammers.',
    description: 'Central campus food and beverage hub serving hot meals, tea, refreshments, and snacks.'
  },
  {
    id: 'health_centre',
    name: 'Barber-Surgeon\'s Quarters',
    realName: 'IIT Health Centre',
    zone: 'Galley and Infirmary Wharf',
    category: 'services',
    categoryLabel: 'Infirmary Wharf',
    icon: '⚕️',
    x: 26,
    y: 70,
    hours: '24 Hours Open',
    openTime: '00:00',
    closeTime: '23:59',
    alwaysOpen: true,
    rating: 4.7,
    pirateNotes: 'Cures sea scurvy, bandaging skirmish wounds, and providing round-the-clock emergency remedy.',
    description: 'On-campus 24x7 medical facility with resident doctors, pharmacy, and emergency care.'
  },

  // 5. Sports Shores
  {
    id: 'upper_ground',
    name: 'Upper Deck Plains',
    realName: 'Upper Ground',
    zone: 'Sports Shores',
    category: 'sports',
    categoryLabel: 'Sports Shores',
    icon: '🏏',
    x: 42,
    y: 76,
    hours: '06:00 - 20:00',
    openTime: '06:00',
    closeTime: '20:00',
    alwaysOpen: false,
    rating: 4.5,
    pirateNotes: 'Where hostel ships battle for territorial bragging rights and cricket championship trophies.',
    description: 'Recreational ground frequently used for cricket tournaments and student athletic practice.'
  },
  {
    id: 'squash_complex',
    name: 'Cannonball Rebound Court',
    realName: 'Squash Court',
    zone: 'Sports Shores',
    category: 'sports',
    categoryLabel: 'Sports Shores',
    icon: '🎾',
    x: 58,
    y: 74,
    hours: '06:00 - 21:30',
    openTime: '06:00',
    closeTime: '21:30',
    alwaysOpen: false,
    rating: 4.6,
    pirateNotes: 'Enclosed indoor court where quick-footed privateers dodge rubber balls moving at cannon speed.',
    description: 'Enclosed indoor squash courts available for student recreation and competitive matches.'
  },

  // 6. The Hidden Isle
  {
    id: 'coronation_park',
    name: 'Captain\'s Garden of Contemplation',
    realName: 'IIT ISM Garden',
    zone: 'The Hidden Isle',
    category: 'garden',
    categoryLabel: 'The Hidden Isle',
    icon: '🌴',
    x: 20,
    y: 25,
    hours: '05:00 - 22:00',
    openTime: '05:00',
    closeTime: '22:00',
    alwaysOpen: false,
    rating: 4.8,
    pirateNotes: 'Lush palm trees and fountains where pirates meditate on how they will pass tomorrow\'s surprise viva.',
    description: 'Landscaped heritage gardens with green lawns and heritage fountains near the Admin sector.'
  },

  // 7. Treasure Caves (Departments)
  {
    id: 'mining_dept',
    name: 'Underground Treasure Mine',
    realName: 'Mining Engineering',
    zone: 'Treasure Caves',
    category: 'departments',
    categoryLabel: 'Treasure Caves',
    icon: '⛏️',
    x: 30,
    y: 16,
    built: 1926,
    hours: '08:30 - 18:00 (Mon-Fri)',
    openTime: '08:30',
    closeTime: '18:00',
    alwaysOpen: false,
    rating: 5.0,
    pirateNotes: 'Has a simulated underground coal mine tunnel where true pirates learn to dig for precious ores.',
    description: 'Department of Mining Engineering founded in 1926 with model mine galleries and rock mechanics labs.'
  },
  {
    id: 'geology_dept',
    name: 'Crystal & Fossil Caverns',
    realName: 'Applied Geology',
    zone: 'Treasure Caves',
    category: 'departments',
    categoryLabel: 'Treasure Caves',
    icon: '💎',
    x: 40,
    y: 14,
    hours: '09:00 - 17:30 (Mon-Fri)',
    openTime: '09:00',
    closeTime: '17:30',
    alwaysOpen: false,
    rating: 4.9,
    pirateNotes: 'Vault of glittering rocks, rare minerals, fossils, and geological cartography scrolls.',
    description: 'Department of Applied Geology featuring petrology laboratories and mineral collections.'
  },
  {
    id: 'geophysics_dept',
    name: 'Seismic Echo Chambers',
    realName: 'Applied Geophysics',
    zone: 'Treasure Caves',
    category: 'departments',
    categoryLabel: 'Treasure Caves',
    icon: '🌋',
    x: 52,
    y: 15,
    hours: '09:00 - 17:30 (Mon-Fri)',
    openTime: '09:00',
    closeTime: '17:30',
    alwaysOpen: false,
    rating: 4.8,
    pirateNotes: 'Detects planetary tremors, sonic reflections, and subsurface treasure pockets deep below sea bed.',
    description: 'Department of Applied Geophysics specializing in seismic imaging, gravity, and magnetic exploration.'
  },
  {
    id: 'petroleum_dept',
    name: 'Black Gold Siphon Guild',
    realName: 'Petroleum Engineering',
    zone: 'Treasure Caves',
    category: 'departments',
    categoryLabel: 'Treasure Caves',
    icon: '🛢️',
    x: 62,
    y: 18,
    hours: '09:00 - 17:30 (Mon-Fri)',
    openTime: '09:00',
    closeTime: '17:30',
    alwaysOpen: false,
    rating: 4.9,
    pirateNotes: 'Deep ocean drilling masters siphoning liquid black gold from subterranean pressure vaults.',
    description: 'Department of Petroleum Engineering with drilling simulators and reservoir characterization labs.'
  },
  {
    id: 'fuel_mineral_dept',
    name: 'Smelters\' Forge & Crucible',
    realName: 'Fuel/Mineral/Metallurgical Engineering',
    zone: 'Treasure Caves',
    category: 'departments',
    categoryLabel: 'Treasure Caves',
    icon: '🔥',
    x: 22,
    y: 38,
    hours: '08:30 - 17:30 (Mon-Fri)',
    openTime: '08:30',
    closeTime: '17:30',
    alwaysOpen: false,
    rating: 4.7,
    pirateNotes: 'Where raw mineral booty is refined, smelted, and forged into cannons and gleaming bullion.',
    description: 'Department of Fuel, Minerals and Metallurgical Engineering specializing in ore processing.'
  },
  {
    id: 'electrical_dept',
    name: 'Lightning Harvesters\' Spire',
    realName: 'Electrical Engineering',
    zone: 'Treasure Caves',
    category: 'departments',
    categoryLabel: 'Treasure Caves',
    icon: '⚡',
    x: 30,
    y: 48,
    hours: '08:30 - 18:00 (Mon-Fri)',
    openTime: '08:30',
    closeTime: '18:00',
    alwaysOpen: false,
    rating: 4.8,
    pirateNotes: 'Harnesses high-voltage lightning bolts to power automated galley motors and navigational beacons.',
    description: 'Department of Electrical Engineering with power systems, machines, and microgrid research labs.'
  },
  {
    id: 'management_dept',
    name: 'Quartermasters\' Trade Treasury',
    realName: 'Management Studies and Industrial Engineering',
    zone: 'Treasure Caves',
    category: 'departments',
    categoryLabel: 'Treasure Caves',
    icon: '📈',
    x: 20,
    y: 54,
    hours: '09:00 - 17:30 (Mon-Fri)',
    openTime: '09:00',
    closeTime: '17:30',
    alwaysOpen: false,
    rating: 4.6,
    pirateNotes: 'Master economists strategizing plunder logistics, pirate crew dividends, and fleet market trades.',
    description: 'Department of Management Studies and Industrial Engineering & Management.'
  }
];

// Alias for compatibility
export const CAMPUS_LOCATIONS = PLACES;

// Helper to check live open/closed status
export function isPlaceOpen(place) {
  if (place.alwaysOpen) return true;
  if (!place.openTime || !place.closeTime) return true;

  try {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = place.openTime.split(':').map(Number);
    const [closeH, closeM] = place.closeTime.split(':').map(Number);

    const openMinutes = openH * 60 + openM;
    let closeMinutes = closeH * 60 + closeM;

    // Check if open past midnight (e.g. 06:00 to 00:00)
    if (closeMinutes === 0) closeMinutes = 24 * 60;
    if (closeMinutes < openMinutes) {
      return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
    }

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  } catch {
    return true;
  }
}
