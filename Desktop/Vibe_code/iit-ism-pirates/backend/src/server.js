const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/hostels', require('./routes/hostels'));
app.use('/api/chaos', require('./routes/chaos'));
app.use('/api/treasure', require('./routes/treasure'));
app.use('/api/quiz', require('./routes/quiz'));

// Root test endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    realm: 'IIT (ISM) Pirate Archipelago Backend',
    timestamp: new Date().toISOString()
  });
});

// Optionally serve static frontend directly if accessed through express
app.use(express.static(path.join(__dirname, '../../frontend')));

app.listen(PORT, () => {
  console.log(`🏴‍☠️ Pirate Ship API Server running at http://localhost:${PORT}`);
});
