import { Pool } from 'pg';

const pool = new Pool({
  user: 'lumnixso_lumiopos_landing',
  host: 'localhost',
  database: 'lumnixso_next_lumiopos_landing',
  password: '@Ra200400912445', // ඔයා Install කරද්දි දුන්න Password එක මෙතන දාන්න
  port: 5432,
});

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};
