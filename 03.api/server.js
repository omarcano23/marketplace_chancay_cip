const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = Number(process.env.PORT) || 4001;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL. Set your Supabase Postgres connection string in environment variables.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
});

const PROFILE_FIELDS = [
  'clerk_user_id',
  'role',
  'fullname',
  'email',
  'password',
  'phone',
  'company_name',
  'tax_id',
  'industry',
  'location',
  'size',
  'type',
  'services',
  'experience',
  'activity_type',
  'space_required',
  'energy_required',
];

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Chancay Hub API is running', status: 'OK' });
});

const initializeDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      clerk_user_id TEXT UNIQUE,
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
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id)');
  console.log('Connected to PostgreSQL and schema initialized.');
};

const sanitizePayload = (body) => {
  return Object.fromEntries(
    Object.entries(body).filter(([key, value]) => PROFILE_FIELDS.includes(key) && value !== undefined && value !== null && value !== '')
  );
};

const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const getUserByClerkId = async (clerkUserId) => {
  const result = await pool.query('SELECT * FROM users WHERE clerk_user_id = $1', [clerkUserId]);
  return result.rows[0] || null;
};

// Endpoint de Registro
app.post('/api/register', async (req, res) => {
  try {
    const payload = sanitizePayload(req.body);
    const fields = Object.keys(payload);
    const values = Object.values(payload);

    if (!fields.length) {
      return res.status(400).json({ error: 'No hay datos para registrar' });
    }

    const placeholders = fields.map((_, idx) => `$${idx + 1}`).join(', ');
    const sql = `INSERT INTO users (${fields.join(',')}) VALUES (${placeholders}) RETURNING id`;
    const result = await pool.query(sql, values);
    res.json({ message: 'success', id: result.rows[0].id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/profile', async (req, res) => {
  try {
    const payload = sanitizePayload(req.body);

    if (!payload.clerk_user_id || !payload.role || !payload.email) {
      return res.status(400).json({ error: 'clerk_user_id, role y email son obligatorios' });
    }

    const existingUser = await getUserByClerkId(payload.clerk_user_id);
    const fields = Object.keys(payload);
    const values = Object.values(payload);

    if (!existingUser) {
      const placeholders = fields.map((_, idx) => `$${idx + 1}`).join(', ');
      const sql = `INSERT INTO users (${fields.join(',')}) VALUES (${placeholders})`;
      const insertResult = await pool.query(`${sql} RETURNING id`, values);
      const createdUser = await getUserById(insertResult.rows[0].id);
      return res.json({ message: 'success', data: createdUser });
    }

    const updateFields = fields.filter((field) => field !== 'clerk_user_id');
    const setClause = updateFields.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
    const updateValues = updateFields.map((field) => payload[field]);

    if (!setClause) {
      return res.json({ message: 'success', data: existingUser });
    }

    await pool.query(
      `UPDATE users SET ${setClause} WHERE clerk_user_id = $${updateValues.length + 1}`,
      [...updateValues, payload.clerk_user_id]
    );
    const updatedUser = await getUserByClerkId(payload.clerk_user_id);
    res.json({ message: 'success', data: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint de Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    res.json({ message: 'success', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json({ message: 'success', data: result.rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/users/by-clerk/:clerkUserId', async (req, res) => {
  try {
    const user = await getUserByClerkId(req.params.clerkUserId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'success', data: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/matches/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let query = '';
    if (user.role === 'empresa') {
      query = "SELECT * FROM users WHERE role IN ('propietario', 'proveedor')";
    } else if (user.role === 'propietario') {
      query = "SELECT * FROM users WHERE role = 'empresa'";
    } else if (user.role === 'proveedor') {
      query = "SELECT * FROM users WHERE role = 'empresa'";
    } else {
      query = 'SELECT * FROM users WHERE 1=0';
    }

    const result = await pool.query(query);
    res.json({ message: 'success', data: result.rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'deleted', changes: result.rowCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database initialization failed:', err.message);
    process.exit(1);
  });
