const express = require("express");
const cors = require("cors"); // Required for cross-origin requests from client
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = 3004;

// Enable CORS for all origins, or specify your client's origin
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("app.db");

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      event_id INTEGER NOT NULL,
      likes INTEGER DEFAULT 0,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);
});

// tiny promisified helpers
const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes, lastID: this.lastID });
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });

/* ========= QUESTIONS ========= */
async function createEvent({ title, description }) {
  const r = await run(`INSERT INTO events (title, description) VALUES (?, ?)`, [
    title,
    description,
  ]);
  return get(`SELECT * FROM events WHERE id = ?`, [r.lastID]);
}

app.post("/events", async (req, res) => {
  const event = await createEvent(req.body);
  res.status(201).json({ success: true, event });
});

function getEvent(id) {
  return get(`SELECT * FROM events WHERE id = ?`, [id]);
}

function listEvents() {
  return all(`SELECT * FROM events ORDER BY created_at DESC `);
}
app.get("/events", async (req, res) => {
  const events = await listEvents();
  res.json(events);
});

async function updateEvent(id, { title, description }) {
  await run(`UPDATE events SET title = ?, description = ? WHERE id = ?`, [
    title,
    description,
    id,
  ]);
  return getEvent(id);
}

async function deleteEvent(id) {
  // answers will auto-delete due to ON DELETE CASCADE
  const r = await run(`DELETE FROM events WHERE id = ?`, [id]);
  return r.changes > 0;
}

app.delete("/events/:id", (req, res) => {
  const event = deleteEvent(req.params.id);
  res.json(event);
});

async function likeEvent(id, delta = 1) {
  await run(`UPDATE events SET likes = likes + ? WHERE id = ?`, [delta, id]);
  return getEvent(id);
}

async function dislikeEvent(id, delta = 1) {
  await run(`UPDATE events SET dislikes = dislikes + ? WHERE id = ?`, [
    delta,
    id,
  ]);
  return getEvent(id);
}

/* ========= Questions ========= */
async function createQuestion({ event_id, question }) {
  const exists = await get(`SELECT id FROM events WHERE id = ?`, [event_id]);
  if (!exists) throw new Error("event not found");
  const r = await run(
    `INSERT INTO questions (question, event_id) VALUES (?, ?)`,
    [question, event_id]
  );
  return get(`SELECT * FROM questions WHERE id = ?`, [r.lastID]);
}

app.post("/question", async (req, res) => {
  const question = await createQuestion(req.body);
  res.status(201).json({ success: true, question });
});

function getAnswer(id) {
  return get(`SELECT * FROM answers WHERE id = ?`, [id]);
}

function listQuestionsByEvent(event_id) {
  return all(
    `SELECT * FROM questions WHERE event_id = ? ORDER BY created_at DESC`,
    [event_id]
  );
}

app.get("/questionsByEventId", async (req, res) => {
  const id = req.query.eventId;
  const questions = await listQuestionsByEvent(id);
  res.json(questions);
});

async function updateAnswer(id, { answer }) {
  await run(`UPDATE answers SET answer = ? WHERE id = ?`, [answer, id]);
  return getAnswer(id);
}

async function deleteAnswer(id) {
  const r = await run(`DELETE FROM answers WHERE id = ?`, [id]);
  return r.changes > 0;
}

// SSE endpoint
app.get("/events/:eventId", (req, res) => {
  // Set necessary headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow cross-origin requests

  const { eventId } = req.params;
  console.log(`Event ID: ${eventId}`);

  const sendEvent = async () => {
    try {
      const event = await getEvent(eventId);

      if (!event) {
        res.write(`data: ${JSON.stringify({ error: "Event not found" })}\n\n`);
        return;
      }

      const questions = await listQuestionsByEvent(eventId);
      const eventData = {
        ...event,
        questions: questions || [],
      };
      res.write(`data: ${JSON.stringify(eventData)}\n\n`);
    } catch (error) {
      console.error("SSE Error:", error);
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    }
  };

  sendEvent();

  const intervalId = setInterval(sendEvent, 3000);

  req.on("close", () => {
    clearInterval(intervalId);
    console.log("Client disconnected. Stopped sending events.");
    res.end();
  });
});

process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing the database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing the database:", err.message);
    } else {
      console.log("Database connection closed.");
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
