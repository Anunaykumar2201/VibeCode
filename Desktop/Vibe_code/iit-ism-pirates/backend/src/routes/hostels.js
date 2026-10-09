const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/hostels
router.get('/', (req, res) => {
  res.json({
    hostels: store.getHostels(),
    logs: store.getRaidLogs()
  });
});

// POST /api/hostels/raid
router.post('/raid', (req, res) => {
  const { targetId, lootStolen, attackerName } = req.body;
  const stolen = parseInt(lootStolen, 10) || 100;
  const updated = store.updateHostelLoot(targetId, -stolen);
  
  if (!updated) {
    return res.status(404).json({ error: 'Target hostel not found' });
  }

  const log = store.addRaidLog(`⚔️ ${attackerName || 'A rogue crew'} plundered ${stolen} doubloons from ${updated.name}!`);

  res.json({
    success: true,
    updatedHostel: updated,
    log
  });
});

module.exports = router;
