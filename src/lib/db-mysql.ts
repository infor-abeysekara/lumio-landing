import mysql from 'mysql2/promise';

const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: 'lumnixso_lumiopos',
  password: 'PUT_YOUR_STRONG_PASSWORD_HERE', // ඔයා cPanel එකේ දීපු අලුත් Password එක මෙතන දාන්න
  database: 'lumnixso_lumiopos', // POS Data (sales, etc)
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function queryMySQL(sql: string, values?: any[]) {
  try {
    const [rows, fields] = await mysqlPool.execute(sql, values);
    return rows;
  } catch (error) {
    console.error('MySQL Query Error:', error);
    throw error;
  }
}
