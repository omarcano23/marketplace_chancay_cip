const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { Webhook } = require('svix');

const app = express();
const PORT = Number(process.env.PORT) || 4001;
const DATABASE_URL = process.env.DATABASE_URL;
const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
const ENABLE_MOCK_USERS = process.env.ENABLE_MOCK_USERS !== 'false';
const MOCK_USERS_TOTAL = Number(process.env.MOCK_USERS_TOTAL || 50);
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
const DEFAULT_ADMIN_EMAILS = new Set(['alvarojesusmc@gmail.com']);

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
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

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

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const isAdminEmail = (email) => {
  const normalized = normalizeEmail(email);
  return DEFAULT_ADMIN_EMAILS.has(normalized) || ADMIN_EMAILS.includes(normalized);
};

const parseClerkPrimaryEmail = (evtData) => {
  if (!evtData?.email_addresses || !Array.isArray(evtData.email_addresses)) return null;
  const primaryId = evtData.primary_email_address_id;
  const primary = evtData.email_addresses.find((emailObj) => emailObj.id === primaryId);
  return primary?.email_address || null;
};

const parseClerkFullname = (evtData) => {
  const firstName = evtData?.first_name || '';
  const lastName = evtData?.last_name || '';
  const full = `${firstName} ${lastName}`.trim();
  return full || null;
};

const MOCK_INDUSTRIES = ['logistica', 'manufactura', 'agroindustrial', 'energia', 'tecnologia', 'inmobiliaria'];
const MOCK_LOCATIONS = [
  'Av. Principal 100, Chancay',
  'Km 82 Panamericana Norte, Chancay',
  'Sector Industrial Norte, Chancay',
  'Zona Logística Este, Huaral',
  'Parque Industrial Central, Chancay',
];
const MOCK_SERVICES = [
  'Consultoría técnica y estudios de prefactibilidad',
  'Servicios de ingeniería y supervisión de obra',
  'Logística de almacenamiento y distribución',
  'Mantenimiento industrial y soporte operativo',
  'Asesoría legal y estructuración comercial',
];

const buildMockUser = (index) => {
  const roleCycle = ['empresa', 'propietario', 'proveedor'];
  const role = roleCycle[(index - 1) % roleCycle.length];
  const industry = MOCK_INDUSTRIES[(index - 1) % MOCK_INDUSTRIES.length];
  const location = MOCK_LOCATIONS[(index - 1) % MOCK_LOCATIONS.length];
  const services = MOCK_SERVICES[(index - 1) % MOCK_SERVICES.length];
  const createdAt = new Date(Date.now() - index * 60 * 60 * 1000).toISOString();

  const base = {
    clerk_user_id: `mock_clerk_${index}`,
    role,
    fullname: `Usuario Mock ${index}`,
    email: `mockuser${index}@chancayhub.local`,
    password: '123456',
    phone: `+51999${String(10000 + index).slice(-5)}`,
    company_name: null,
    tax_id: null,
    industry: null,
    location: null,
    size: null,
    type: null,
    services: null,
    experience: null,
    activity_type: null,
    space_required: null,
    energy_required: null,
    created_at: createdAt,
  };

  if (role === 'empresa') {
    return {
      ...base,
      company_name: `Empresa Mock ${index} SAC`,
      tax_id: `20${String(100000000 + index).slice(-9)}`,
      industry,
      activity_type: `Operación ${industry}`,
      space_required: String(1500 + index * 20),
      energy_required: String(80 + index),
    };
  }

  if (role === 'propietario') {
    return {
      ...base,
      location,
      size: String(1000 + index * 35),
      type: index % 2 === 0 ? 'industrial' : 'logistico',
      services: 'Terreno disponible para arriendo o alianza',
    };
  }

  return {
    ...base,
    industry,
    services,
    experience: String(2 + (index % 15)),
  };
};

const ensureMockUsers = async () => {
  if (!ENABLE_MOCK_USERS || MOCK_USERS_TOTAL <= 0) return;

  const existingResult = await pool.query(
    "SELECT COUNT(*)::int AS total FROM users WHERE email LIKE 'mockuser%@chancayhub.local'"
  );
  const existing = existingResult.rows[0]?.total || 0;
  if (existing >= MOCK_USERS_TOTAL) return;

  for (let i = existing + 1; i <= MOCK_USERS_TOTAL; i += 1) {
    const m = buildMockUser(i);
    await pool.query(
      `INSERT INTO users (
        clerk_user_id, role, fullname, email, password, phone, company_name, tax_id, industry,
        location, size, type, services, experience, activity_type, space_required, energy_required, created_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,$15,$16,$17,$18
      )
      ON CONFLICT (email) DO NOTHING`,
      [
        m.clerk_user_id,
        m.role,
        m.fullname,
        m.email,
        m.password,
        m.phone,
        m.company_name,
        m.tax_id,
        m.industry,
        m.location,
        m.size,
        m.type,
        m.services,
        m.experience,
        m.activity_type,
        m.space_required,
        m.energy_required,
        m.created_at,
      ]
    );
  }

  console.log(`Mock users ensured: ${MOCK_USERS_TOTAL}`);
};

app.post('/api/webhooks/clerk', async (req, res) => {
  try {
    if (!CLERK_WEBHOOK_SIGNING_SECRET) {
      return res.status(500).json({ error: 'Missing CLERK_WEBHOOK_SIGNING_SECRET' });
    }

    const svixId = req.get('svix-id');
    const svixTimestamp = req.get('svix-timestamp');
    const svixSignature = req.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).json({ error: 'Missing Svix headers' });
    }

    const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);
    const evt = wh.verify(req.rawBody.toString(), {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });

    const eventType = evt.type;
    const data = evt.data || {};

    if (eventType === 'user.deleted') {
      const clerkUserId = data.id;
      if (clerkUserId) {
        await pool.query('DELETE FROM users WHERE clerk_user_id = $1', [clerkUserId]);
      }
      return res.status(200).json({ message: 'ok' });
    }

    if (eventType === 'user.updated') {
      const clerkUserId = data.id;
      const email = parseClerkPrimaryEmail(data);
      const fullname = parseClerkFullname(data);

      if (clerkUserId && (email || fullname)) {
        const fields = [];
        const values = [];

        if (email) {
          fields.push(`email = $${values.length + 1}`);
          values.push(email);
        }
        if (fullname) {
          fields.push(`fullname = $${values.length + 1}`);
          values.push(fullname);
        }

        if (fields.length > 0) {
          await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE clerk_user_id = $${values.length + 1}`,
            [...values, clerkUserId]
          );
        }
      }
      return res.status(200).json({ message: 'ok' });
    }

    return res.status(200).json({ message: 'ignored' });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }
});

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
    payload.email = normalizeEmail(payload.email);
    if (isAdminEmail(payload.email)) {
      payload.role = 'admin';
    }

    const fields = Object.keys(payload);
    const values = Object.values(payload);
    const existingByClerk = await getUserByClerkId(payload.clerk_user_id);

    if (existingByClerk) {
      const updateFields = fields.filter((field) => field !== 'clerk_user_id');
      const setClause = updateFields.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
      const updateValues = updateFields.map((field) => payload[field]);

      if (!setClause) {
        return res.json({ message: 'success', data: existingByClerk });
      }

      await pool.query(
        `UPDATE users SET ${setClause} WHERE clerk_user_id = $${updateValues.length + 1}`,
        [...updateValues, payload.clerk_user_id]
      );
      const updatedUser = await getUserByClerkId(payload.clerk_user_id);
      return res.json({ message: 'success', data: updatedUser });
    }

    const existingByEmail = await getUserByEmail(payload.email);
    if (existingByEmail) {
      const updateFields = fields;
      const setClause = updateFields.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
      const updateValues = updateFields.map((field) => payload[field]);

      await pool.query(
        `UPDATE users SET ${setClause} WHERE id = $${updateValues.length + 1}`,
        [...updateValues, existingByEmail.id]
      );
      const updatedUser = await getUserById(existingByEmail.id);
      return res.json({ message: 'success', data: updatedUser });
    }

    const placeholders = fields.map((_, idx) => `$${idx + 1}`).join(', ');
    const sql = `INSERT INTO users (${fields.join(',')}) VALUES (${placeholders})`;
    const insertResult = await pool.query(`${sql} RETURNING id`, values);
    const createdUser = await getUserById(insertResult.rows[0].id);
    return res.json({ message: 'success', data: createdUser });
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
    if (isAdminEmail(user.email) && user.role !== 'admin') {
      await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', user.id]);
      const updated = await getUserById(user.id);
      return res.json({ message: 'success', data: updated });
    }
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
  .then(() => ensureMockUsers())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database initialization failed:', err.message);
    process.exit(1);
  });
