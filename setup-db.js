const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:postgres@localhost:5432/lumio_landing_db' });

async function setup() {
  await client.connect();
  console.log('Connected to DB');

  try {
    await client.query(`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS is_subscribed BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
    `);
    console.log('Altered tenants table');

    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id),
        amount DECIMAL(10, 2) NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'success',
        payment_method VARCHAR(100),
        description TEXT
      );
    `);
    console.log('Created payments table');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
setup();
