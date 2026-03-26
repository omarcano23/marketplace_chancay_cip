const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 4001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Chancay Hub API is running', status: 'OK' });
});

const dbPath = path.resolve(__dirname, 'marketplace.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        fullname TEXT,
        email TEXT UNIQUE,
        password TEXT DEFAULT '123456',
        phone TEXT,
        company_name TEXT,
        tax_id TEXT,
        industry TEXT,
        location TEXT,
        size TEXT,
        type TEXT,
        services TEXT,
        experience TEXT,
        activity_type TEXT,
        space_required TEXT,
        energy_required TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
    });
  }
});

// Endpoint de Registro
app.post('/api/register', (req, res) => {
  const fields = Object.keys(req.body);
  const values = Object.values(req.body);
  const placeholders = fields.map(() => '?').join(',');
  
  const sql = `INSERT INTO users (${fields.join(',')}) VALUES (${placeholders})`;
  
  db.run(sql, values, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'success', id: this.lastID });
  });
});

// Endpoint de Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    res.json({ message: "success", user });
  });
});

app.get('/api/users', (req, res) => {
  db.all("SELECT * FROM users ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "success", data: rows });
  });
});

app.get('/api/matches/:id', (req, res) => {
  db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: "User not found" });
    
    let query = "";
    if (user.role === 'empresa') {
      query = "SELECT * FROM users WHERE role IN ('propietario', 'proveedor')";
    } else if (user.role === 'propietario') {
      query = "SELECT * FROM users WHERE role = 'empresa'";
    } else if (user.role === 'proveedor') {
      query = "SELECT * FROM users WHERE role = 'empresa'";
    }

    db.all(query, [], (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "success", data: rows });
    });
  });
});

app.delete('/api/users/:id', (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", req.params.id, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "deleted", changes: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
