const { Pool } = require('pg');

const pool = new Pool({
  user: 'lumnixso_lumiopos_landing',
  host: '127.0.0.1',
  database: 'lumnixso_next_lumiopos_landing',
  password: 'lumnixso_lumiopos_landing',
  port: 5432,
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query('ALTER TABLE feedbacks ADD COLUMN image_url VARCHAR(255);');
    console.log('Successfully added image_url column to feedbacks table.');
  } catch (e) {
    if (e.code === '42701') {
      console.log('Column image_url already exists.');
    } else {
      console.error(e);
    }
  } finally {
    client.release();
    pool.end();
  }
}

run();
