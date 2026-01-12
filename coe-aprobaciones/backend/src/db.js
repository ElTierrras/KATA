import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  user: process.env.DB_USER || 'dev',
  password: process.env.DB_PASSWORD || 'katapassword',
  database: process.env.DB_NAME || 'aprobaciones',
});

export default pool;