const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimitPkg = require('express-rate-limit');
const { z } = require('zod');
const { Pool } = require('pg');
const { Webhook } = require('svix');
const { clerkMiddleware, getAuth, clerkClient } = require('@clerk/express');

const app = express();
app.disable('x-powered-by');
const rateLimit = rateLimitPkg.rateLimit || rateLimitPkg;

const PORT = Number(process.env.PORT) || 4001;
const DATABASE_URL = process.env.DATABASE_URL;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;
const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
const TRUST_PROXY = process.env.TRUST_PROXY;
const ENABLE_MOCK_USERS =
  process.env.ENABLE_MOCK_USERS === 'true' || process.env.NODE_ENV === 'development';
const MOCK_USERS_TOTAL = Number(process.env.MOCK_USERS_TOTAL || 50);
const CORS_ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:4000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const DB_SSL_REJECT_UNAUTHORIZED = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';
const DB_SSL_CA = process.env.DB_SSL_CA ? process.env.DB_SSL_CA.replace(/\\n/g, '\n') : null;
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
const DEFAULT_ADMIN_EMAILS = new Set(['alvarojesusmc@gmail.com']);
const SELF_SERVICE_ROLES = new Set(['empresa', 'propietario', 'proveedor']);
const asPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL. Set your Supabase Postgres connection string in environment variables.');
  process.exit(1);
}
if (!CLERK_SECRET_KEY) {
  console.error('Missing CLERK_SECRET_KEY. Required to validate user tokens in the API.');
  process.exit(1);
}
if (!CLERK_PUBLISHABLE_KEY) {
  console.error('Missing CLERK_PUBLISHABLE_KEY. Required by Clerk middleware in backend.');
  process.exit(1);
}

const isLocalDatabase =
  DATABASE_URL.includes('localhost') ||
  DATABASE_URL.includes('127.0.0.1') ||
  DATABASE_URL.includes('@db.local');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: isLocalDatabase
    ? false
    : DB_SSL_CA
      ? { rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED, ca: DB_SSL_CA }
      : { rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED },
});

const PROFILE_FIELDS = [
  'fullname',
  'email',
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

const profileBodySchema = z.object({
  role: z.enum(['empresa', 'propietario', 'proveedor']).optional(),
  fullname: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().max(254).optional(),
  phone: z.string().trim().min(1).max(32).optional(),
  company_name: z.string().trim().min(1).max(120).optional(),
  tax_id: z.string().trim().min(1).max(32).optional(),
  industry: z.string().trim().min(1).max(80).optional(),
  location: z.string().trim().min(1).max(200).optional(),
  size: z.string().trim().min(1).max(32).optional(),
  type: z.string().trim().min(1).max(40).optional(),
  services: z.string().trim().min(1).max(1000).optional(),
  experience: z.string().trim().min(1).max(32).optional(),
  activity_type: z.string().trim().min(1).max(120).optional(),
  space_required: z.string().trim().min(1).max(32).optional(),
  energy_required: z.string().trim().min(1).max(32).optional(),
}).strict();

const numericIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
}).strict();

const clerkIdParamsSchema = z.object({
  clerkUserId: z.string().trim().min(3).max(128).regex(/^[A-Za-z0-9_:-]+$/),
}).strict();

const apiLimiter = rateLimit({
  windowMs: asPositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  limit: asPositiveInt(process.env.RATE_LIMIT_MAX, 200),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (req) => req.originalUrl.startsWith('/api/webhooks/clerk'),
  message: { error: 'Too many requests, try again later' },
});

const profileWriteLimiter = rateLimit({
  windowMs: asPositiveInt(process.env.RATE_LIMIT_PROFILE_WINDOW_MS, 10 * 60 * 1000),
  limit: asPositiveInt(process.env.RATE_LIMIT_PROFILE_MAX, 40),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many profile update requests' },
});

const adminMutationLimiter = rateLimit({
  windowMs: asPositiveInt(process.env.RATE_LIMIT_ADMIN_WINDOW_MS, 10 * 60 * 1000),
  limit: asPositiveInt(process.env.RATE_LIMIT_ADMIN_MAX, 30),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many admin mutation requests' },
});

const webhookLimiter = rateLimit({
  windowMs: asPositiveInt(process.env.RATE_LIMIT_WEBHOOK_WINDOW_MS, 60 * 1000),
  limit: asPositiveInt(process.env.RATE_LIMIT_WEBHOOK_MAX, 120),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many webhook requests' },
});

if (TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
} else if (/^\d+$/.test(String(TRUST_PROXY || ''))) {
  app.set('trust proxy', Number(TRUST_PROXY));
}

app.use(
  bodyParser.json({
    limit: '1mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'none'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (CORS_ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('CORS origin denied'));
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use('/api', apiLimiter);
app.use(clerkMiddleware({ secretKey: CLERK_SECRET_KEY, publishableKey: CLERK_PUBLISHABLE_KEY }));

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
  await pool.query('ALTER TABLE public.users DROP COLUMN IF EXISTS password');
  await pool.query('ALTER TABLE public.users ENABLE ROW LEVEL SECURITY');
  await pool.query('REVOKE ALL ON TABLE public.users FROM PUBLIC');
  await pool.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        EXECUTE 'REVOKE ALL ON TABLE public.users FROM anon';
      END IF;
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        EXECUTE 'REVOKE ALL ON TABLE public.users FROM authenticated';
      END IF;
    END
    $$;
  `);
  console.log('Connected to PostgreSQL and schema initialized.');
};

const sanitizePayload = (body) => {
  if (!body || typeof body !== 'object') return {};
  const normalizedEntries = Object.entries(body).map(([key, value]) => [
    key,
    typeof value === 'string' ? value.trim() : value,
  ]);

  return Object.fromEntries(
    normalizedEntries.filter(([key, value]) =>
      PROFILE_FIELDS.includes(key) && value !== undefined && value !== null && value !== ''
    )
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

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  error.expose = true;
  return error;
};

const parseSchemaOrThrow = (schema, value, label) => {
  const parsed = schema.safeParse(value);
  if (parsed.success) return parsed.data;

  const firstIssue = parsed.error.issues[0];
  const issuePath = firstIssue?.path?.length ? firstIssue.path.join('.') : 'payload';
  const issueMessage = firstIssue?.message || 'invalid value';
  throw createHttpError(400, `Invalid ${label}: ${issuePath} ${issueMessage}`);
};

const sendApiError = (res, err, fallbackMessage) => {
  const status = Number(err?.status || 0);
  if (status >= 400 && status < 500 && err?.expose) {
    return res.status(status).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: fallbackMessage });
};

const validateBody = (schema) => (req, res, next) => {
  try {
    req.validatedBody = parseSchemaOrThrow(schema, req.body, 'request body');
    return next();
  } catch (err) {
    return sendApiError(res, err, 'Invalid request body');
  }
};

const validateParams = (schema) => (req, res, next) => {
  try {
    req.params = parseSchemaOrThrow(schema, req.params, 'request params');
    return next();
  } catch (err) {
    return sendApiError(res, err, 'Invalid request params');
  }
};

const requireApiAuth = (req, res, next) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.authUserId = auth.userId;
  return next();
};

const attachRequester = async (req, res, next) => {
  try {
    const requester = await getUserByClerkId(req.authUserId);
    if (!requester) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    req.requester = requester;
    return next();
  } catch (err) {
    return next(err);
  }
};

const requireAdminRole = (req, res, next) => {
  if (req.requester?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  return next();
};

const requireSelfOrAdminByClerkId = (req, res, next) => {
  if (req.requester?.role === 'admin' || req.params.clerkUserId === req.authUserId) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden' });
};

const requireSelfOrAdminByNumericId = (req, res, next) => {
  const requestedUserId = String(req.params.id || '');
  if (!/^\d+$/.test(requestedUserId)) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  if (req.requester?.role === 'admin' || String(req.requester?.id) === requestedUserId) {
    return next();
  }

  return res.status(403).json({ error: 'Forbidden' });
};

const getVerifiedClerkEmail = async (clerkUserId) => {
  const user = await clerkClient.users.getUser(clerkUserId);
  const primary = user.emailAddresses.find(
    (emailObj) => emailObj.id === user.primaryEmailAddressId
  );
  return normalizeEmail(primary?.emailAddress || '');
};

const upsertProfileForAuthUser = async (authUserId, body) => {
  const payload = sanitizePayload(body);
  payload.clerk_user_id = authUserId;
  payload.email = await getVerifiedClerkEmail(authUserId);

  if (!payload.email) {
    throw createHttpError(400, 'email es obligatorio');
  }

  const existingByClerk = await getUserByClerkId(authUserId);
  const requestedRole = normalizeEmail(body?.role);

  if (existingByClerk) {
    payload.role = existingByClerk.role;
    if (existingByClerk.role !== 'admin' && isAdminEmail(payload.email)) {
      payload.role = 'admin';
    }

    const updateFields = Object.keys(payload).filter((field) => field !== 'clerk_user_id');
    if (!updateFields.length) {
      return existingByClerk;
    }

    const setClause = updateFields.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
    const updateValues = updateFields.map((field) => payload[field]);

    await pool.query(
      `UPDATE users SET ${setClause} WHERE clerk_user_id = $${updateValues.length + 1}`,
      [...updateValues, authUserId]
    );
    return getUserByClerkId(authUserId);
  }

  if (isAdminEmail(payload.email)) {
    payload.role = 'admin';
  } else {
    if (!SELF_SERVICE_ROLES.has(requestedRole)) {
      throw createHttpError(400, 'role inválido');
    }
    payload.role = requestedRole;
  }

  const existingByEmail = await getUserByEmail(payload.email);
  if (existingByEmail) {
    if (
      existingByEmail.clerk_user_id &&
      String(existingByEmail.clerk_user_id) !== String(authUserId)
    ) {
      throw createHttpError(409, 'El correo ya pertenece a otra cuenta');
    }

    const updateFields = Object.keys(payload);
    const setClause = updateFields.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
    const updateValues = updateFields.map((field) => payload[field]);

    await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $${updateValues.length + 1}`,
      [...updateValues, existingByEmail.id]
    );
    return getUserById(existingByEmail.id);
  }

  const fields = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = fields.map((_, idx) => `$${idx + 1}`).join(', ');
  const sql = `INSERT INTO users (${fields.join(',')}) VALUES (${placeholders}) RETURNING id`;
  const insertResult = await pool.query(sql, values);
  return getUserById(insertResult.rows[0].id);
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
        clerk_user_id, role, fullname, email, phone, company_name, tax_id, industry,
        location, size, type, services, experience, activity_type, space_required, energy_required, created_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,$14,$15,$16,$17
      )
      ON CONFLICT (email) DO NOTHING`,
      [
        m.clerk_user_id,
        m.role,
        m.fullname,
        m.email,
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

app.post('/api/webhooks/clerk', webhookLimiter, async (req, res) => {
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
app.post('/api/register', profileWriteLimiter, requireApiAuth, validateBody(profileBodySchema), async (req, res) => {
  try {
    const profile = await upsertProfileForAuthUser(req.authUserId, req.validatedBody);
    return res.json({ message: 'success', id: profile.id });
  } catch (err) {
    return sendApiError(res, err, 'No se pudo registrar el perfil');
  }
});

app.post('/api/profile', profileWriteLimiter, requireApiAuth, validateBody(profileBodySchema), async (req, res) => {
  try {
    const profile = await upsertProfileForAuthUser(req.authUserId, req.validatedBody);
    return res.json({ message: 'success', data: profile });
  } catch (err) {
    return sendApiError(res, err, 'No se pudo guardar el perfil');
  }
});

app.get('/api/users', requireApiAuth, attachRequester, requireAdminRole, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return res.json({ message: 'success', data: result.rows });
  } catch (err) {
    return sendApiError(res, err, 'No se pudieron listar los usuarios');
  }
});

app.get(
  '/api/users/by-clerk/:clerkUserId',
  requireApiAuth,
  attachRequester,
  validateParams(clerkIdParamsSchema),
  requireSelfOrAdminByClerkId,
  async (req, res) => {
  try {
    const user = await getUserByClerkId(req.params.clerkUserId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (isAdminEmail(user.email) && user.role !== 'admin') {
      await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', user.id]);
      const updated = await getUserById(user.id);
      return res.json({ message: 'success', data: updated });
    }
    return res.json({ message: 'success', data: user });
  } catch (err) {
    return sendApiError(res, err, 'No se pudo recuperar el usuario');
  }
});

app.get(
  '/api/matches/:id',
  requireApiAuth,
  attachRequester,
  validateParams(numericIdParamsSchema),
  requireSelfOrAdminByNumericId,
  async (req, res) => {
  try {
    const isAdmin = req.requester?.role === 'admin';
    const user = isAdmin ? await getUserById(req.params.id) : req.requester;
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
    return res.json({ message: 'success', data: result.rows });
  } catch (err) {
    return sendApiError(res, err, 'No se pudieron recuperar los matches');
  }
});

app.delete(
  '/api/users/:id',
  adminMutationLimiter,
  requireApiAuth,
  attachRequester,
  validateParams(numericIdParamsSchema),
  requireAdminRole,
  async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    return res.json({ message: 'deleted', changes: result.rowCount });
  } catch (err) {
    return sendApiError(res, err, 'No se pudo eliminar el usuario');
  }
});

app.use((err, req, res, next) => {
  if (err && err.message === 'CORS origin denied') {
    return res.status(403).json({ error: 'CORS origin denied' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
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
