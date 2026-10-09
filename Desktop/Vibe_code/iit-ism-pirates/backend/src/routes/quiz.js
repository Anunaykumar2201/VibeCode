const express = require('express');
const router = express.Router();

router.post('/submit', (req, res) => {
  const { answers } = req.body;
  // Always return an honorable pirate rank
  res.json({
    success: true,
    rank: 'Grand Admiral of the Broken Compass',
    bounty: '10,000 Doubloons'
  });
});

module.exports = router;
