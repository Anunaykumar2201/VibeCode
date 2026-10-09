// store.js - In-memory store for hostel scores, raid logs, and chaos state
const initialHostels = [
  { id: 'amber', name: 'Amber War Galleon', loot: 14200, cannons: 48, flag: '🏴‍☠️' },
  { id: 'diamond', name: 'The 1926 Diamond Flagship', loot: 19260, cannons: 64, flag: '💎' },
  { id: 'jasper', name: 'Jasper Heavy Ironclad', loot: 12850, cannons: 40, flag: '🗡️' },
  { id: 'sapphire', name: 'Sapphire Ocean Raider', loot: 11200, cannons: 32, flag: '🌊' },
  { id: 'topaz', name: 'Topaz Corsair Ketch', loot: 9800, cannons: 28, flag: '⚡' },
  { id: 'aquamarine', name: 'Aquamarine Sky-Galleon (13 Decks)', loot: 16900, cannons: 72, flag: '🔱' },
  { id: 'iolite', name: 'Iolite Shadow Sloop', loot: 8900, cannons: 24, flag: '🔮' },
  { id: 'emerald', name: 'Emerald Jade Citadel', loot: 10400, cannons: 36, flag: '🐉' },
  { id: 'opal', name: 'Opal Siren Frigate', loot: 18100, cannons: 52, flag: '✨' },
  { id: 'ruby_rosaline', name: 'Ruby & Rosaline Twin Corvettes', loot: 17400, cannons: 56, flag: '🌹' },
  { id: 'international', name: 'International Diplomatic Galleon', loot: 13500, cannons: 30, flag: '🌍' }
];

let hostels = JSON.parse(JSON.stringify(initialHostels));
let chaosLevel = 0;
let raidLogs = [
  { id: 1, text: '⚔️ Amber War Galleon plundered 450 doubloons from Topaz!', timestamp: new Date().toISOString() },
  { id: 2, text: '💣 Diamond Flagship fired broadside cannons at Jasper!', timestamp: new Date().toISOString() }
];

module.exports = {
  getHostels: () => hostels,
  getHostelById: (id) => hostels.find(h => h.id === id),
  updateHostelLoot: (id, delta) => {
    const h = hostels.find(item => item.id === id);
    if (h) {
      h.loot = Math.max(0, h.loot + delta);
      return h;
    }
    return null;
  },
  getChaos: () => chaosLevel,
  setChaos: (val) => {
    chaosLevel = Math.max(0, Math.min(100, val));
    return chaosLevel;
  },
  getRaidLogs: () => raidLogs,
  addRaidLog: (text) => {
    const entry = { id: Date.now(), text, timestamp: new Date().toISOString() };
    raidLogs.unshift(entry);
    if (raidLogs.length > 30) raidLogs.pop();
    return entry;
  },
  resetAll: () => {
    hostels = JSON.parse(JSON.stringify(initialHostels));
    chaosLevel = 0;
    return true;
  }
};
