const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Get all songs
app.get('/api/songs', (req, res) => {
  db.all('SELECT * FROM songs ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create a new song
app.post('/api/songs', (req, res) => {
  const { title, youtube_url, difficulty, status } = req.body;

  if (!title || !difficulty || !status) {
    return res.status(400).json({ error: 'Title, difficulty, and status are required' });
  }

  const sql = `INSERT INTO songs (title, youtube_url, difficulty, status) VALUES (?, ?, ?, ?)`;
  const params = [title, youtube_url || null, difficulty, status];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Get the newly created song
    db.get('SELECT * FROM songs WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(row);
    });
  });
});

// Update a song (mainly for changing status via drag-and-drop)
app.put('/api/songs/:id', (req, res) => {
  const { id } = req.params;
  const { title, youtube_url, difficulty, status } = req.body;

  const sql = `
    UPDATE songs
    SET title = COALESCE(?, title),
        youtube_url = COALESCE(?, youtube_url),
        difficulty = COALESCE(?, difficulty),
        status = COALESCE(?, status)
    WHERE id = ?
  `;

  db.run(sql, [title, youtube_url, difficulty, status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Get the updated song
    db.get('SELECT * FROM songs WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
});

// Delete a song
app.delete('/api/songs/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM songs WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json({ message: 'Song deleted successfully' });
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
