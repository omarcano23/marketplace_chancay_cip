const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'marketplace.db');
const db = new sqlite3.Database(dbPath);

const mockUsers = [
  {
    role: 'admin',
    fullname: 'Admin Chancay Hub',
    email: 'admin@chancay.com',
    password: 'admin123',
    company_name: 'Chancay Hub Management',
    industry: 'Administración'
  },
  {
    role: 'empresa',
    fullname: 'Carlos Mendez',
    email: 'empresa@test.com',
    password: 'password123',
    company_name: 'Logística Andina S.A.',
    industry: 'Transporte Marítimo',
    activity_type: 'Distribución de Contenedores Refrigerados',
    space_required: '15000',
    energy_required: '800',
    location: 'Zona de Actividad Logística (ZAL)'
  },
  {
    role: 'empresa',
    fullname: 'Elena Wong',
    email: 'elena@agroexport.com',
    password: 'password123',
    company_name: 'AgroChancay Export',
    industry: 'Agroindustrial',
    activity_type: 'Planta de Procesamiento de Arándanos',
    space_required: '5000',
    energy_required: '300',
    location: 'Sector Norte'
  },
  {
    role: 'propietario',
    fullname: 'Jorge Ramirez',
    email: 'propietario@test.com',
    password: 'password123',
    company_name: 'Fundo La Querencia',
    location: 'ZAL Sur, Lote A-12',
    size: '45000',
    type: 'Industrial / Logístico',
    industry: 'Inmobiliaria'
  },
  {
    role: 'propietario',
    fullname: 'Ana María Paz',
    email: 'ana@terrenos.com',
    password: 'password123',
    company_name: 'Inversiones Paz',
    location: 'Sector Norte, Km 82',
    size: '8000',
    type: 'Agroindustrial',
    industry: 'Inmobiliaria'
  },
  {
    role: 'proveedor',
    fullname: 'Ing. Miguel Torres',
    email: 'proveedor@test.com',
    password: 'password123',
    company_name: 'Tecnologías Portuarias SAC',
    services: 'Instalación de Grúas y Mantenimiento Eléctrico Industrial',
    experience: '15 años',
    industry: 'Ingeniería'
  },
  {
    role: 'proveedor',
    fullname: 'Sofía Valdivia',
    email: 'sofia@legalport.com',
    password: 'password123',
    company_name: 'Valdivia & Asociados',
    services: 'Saneamiento Legal de Terrenos y Permisos Ambientales',
    experience: '8 años',
    industry: 'Legal'
  }
];

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS users");
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    fullname TEXT,
    email TEXT UNIQUE,
    password TEXT,
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

  mockUsers.forEach(user => {
    const fields = Object.keys(user);
    const values = Object.values(user);
    const placeholders = fields.map(() => '?').join(',');
    db.run(`INSERT INTO users (${fields.join(',')}) VALUES (${placeholders})`, values);
  });
  console.log("Base de datos poblada exitosamente incluyendo al Administrador.");
});
db.close();
