import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Valida que la contraseña sea un string
const password = process.env.DB_PASSWORD;
if (!password || typeof password !== 'string') {
  throw new Error('DB_PASSWORD debe estar definido en .env y ser un string');
}

const pool = new Pool({
  user: process.env.DB_USER,
  password: password,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Error en pool de conexión:', err.message);
});

export default pool;