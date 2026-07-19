import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('@Ra200400912445', 10);
    
    const adminCheck = await query("SELECT count(*) FROM users WHERE username = 'ravindu2004'");
    if (parseInt(adminCheck.rows[0].count) === 0) {
      await query(`
        INSERT INTO users (username, password, role) VALUES ('ravindu2004', $1, 'SUPER_ADMIN')
      `, [hashedPassword]); 
    } else {
      await query(`
        UPDATE users SET password = $1 WHERE username = 'ravindu2004'
      `, [hashedPassword]);
    }

    return NextResponse.json({ message: 'Success! Password updated.' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed', details: error.message }, { status: 500 });
  }
}
