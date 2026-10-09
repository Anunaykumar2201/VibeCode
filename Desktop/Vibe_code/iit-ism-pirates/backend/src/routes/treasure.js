const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({ totalCoins: 5, message: 'Scattered across the 7 seas of Dhanbad.' });
});

module.exports = router;
