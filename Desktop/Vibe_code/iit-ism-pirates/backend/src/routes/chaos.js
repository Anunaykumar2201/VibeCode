const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/chaos
router.get('/', (req, res) => {
  res.json({ chaos: store.getChaos() });
});

// POST /api/chaos/increase
router.post('/increase', (req, res) => {
  const { amount, level } = req.body;
  let newLevel;
  if (typeof level === 'number') {
    newLevel = store.setChaos(level);
  } else {
    const delta = parseInt(amount, 10) || 5;
    newLevel = store.setChaos(store.getChaos() + delta);
  }
  res.json({ success: true, chaos: newLevel });
});

// POST /api/chaos/reset
router.post('/reset', (req, res) => {
  const resetLevel = store.setChaos(0);
  res.json({ success: true, chaos: resetLevel, message: 'The seas are calmed!' });
});

module.exports = router;
