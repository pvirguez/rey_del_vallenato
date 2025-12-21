const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create songs table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      youtube_url TEXT,
      difficulty TEXT CHECK(difficulty IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,
      status TEXT CHECK(status IN ('Want to Learn', 'Currently Learning', 'Learned', 'Mastered')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Songs table ready');
    }
  });
});

module.exports = db;
