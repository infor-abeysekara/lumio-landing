// Bypass Turbopack hash bug by requiring 'pg' dynamically
const { Pool } = eval('require("pg")');

const pool = new Pool({
  user: 'lumnixso_lumiopos_landing',
  host: '127.0.0.1', // Force TCP to bypass cPanel peer authentication
  database: 'lumnixso_next_lumiopos_landing',
  password: 'lumnixso_lumiopos_landing', // ඔයා Install කරද්දි දුන්න Password එක මෙතන දාන්න
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
