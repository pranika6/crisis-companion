require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ========== AUTH ROUTES ==========

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const stmt = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.run(stmt, [name, email, hashed], function (err) {
      if (err) return res.status(400).json({ error: 'Email already exists' });
      res.json({ id: this.lastID, name, email });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, row.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: row.id, name: row.name, email: row.email }, JWT_SECRET, { expiresIn: '6h' });
    res.json({ token, name: row.name, email: row.email });
  });
});

// ========== POSTS ROUTES ==========

// Create post
app.post('/api/posts', (req, res) => {
  const { type, title, description, lat, lng, address, contact, user_type } = req.body;

  if (!type || !title) return res.status(400).json({ error: 'type and title required' });

  // Volunteers must be logged in to offer help
  if (type === 'offer') {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Login required to offer help' });

    try {
      jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  }

  const stmt = `INSERT INTO posts (type, title, description, lat, lng, address, contact, user_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(stmt, [type, title, description || '', lat || null, lng || null, address || '', contact || '', user_type || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

// Get all posts
app.get('/api/posts', (req, res) => {
  db.all(`SELECT * FROM posts ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get nearby posts
app.get('/api/posts/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const radiusKm = parseFloat(req.query.radius) || 5;

  if (isNaN(lat) || isNaN(lng)) return res.status(400).json({ error: 'lat and lng query params required' });

  db.all(`SELECT * FROM posts WHERE lat IS NOT NULL AND lng IS NOT NULL`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    function haversine(lat1, lon1, lat2, lon2) {
      function toRad(x) { return x * Math.PI / 180; }
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    const nearby = rows.map(r => ({
      ...r,
      distance_km: haversine(lat, lng, r.lat, r.lng)
    })).filter(r => r.distance_km <= radiusKm)
      .sort((a, b) => a.distance_km - b.distance_km);

    res.json(nearby);
  });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));