const express = require("express");
const cors = require("cors"); // Required for cross-origin requests from client
const sqlite3 = require('sqlite3').verbose()
const app = express();
const PORT = 3000;

// Enable CORS for all origins, or specify your client's origin
app.use(cors());
const db = new sqlite3.Database('app.db');

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      likes INTEGER DEFAULT 0,
      dislikes INTEGER DEFAULT 0
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      answer TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      question_id INTEGER NOT NULL,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    )
  `);
});

// tiny promisified helpers
const run = (sql, params=[]) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes, lastID: this.lastID });
    });
  });

const get = (sql, params=[]) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });

const all = (sql, params=[]) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });

db.close()

// SSE endpoint
app.get("/events", (req, res) => {
  // Set necessary headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow cross-origin requests

  let counter = 0;

  // Function to send events
  const sendEvent = () => {
    counter++;
    const message = `Server sent message ${counter} at ${new Date().toLocaleTimeString()}`;

    // SSE data format: data: [your_message]\n\n
    res.write(`data: ${message}\n\n`);
    console.log(`Sent: ${message}`);
  };

  // Send an event every 3 seconds
  const intervalId = setInterval(sendEvent, 3000);

  // Clean up when the client disconnects
  req.on("close", () => {
    clearInterval(intervalId); // Stop sending events to this client
    console.log("Client disconnected. Stopped sending events.");
    res.end(); // End the response
  });
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(
    `Open http://localhost:${PORT} in your browser to see SSE in action.`
  );
});