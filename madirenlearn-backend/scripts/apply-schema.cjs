const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('pg');

const schemaPath = path.join(__dirname, '..', 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function applySchema() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Configure it in the backend .env file.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(schemaSql);
    await client.query('COMMIT');
    console.log('Database schema applied successfully (existing data was preserved).');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

applySchema()
  .catch((error) => {
    console.error(`Could not apply database schema: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
