import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const plainTextPassword = 'lumioposadmin';
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
    
    await query(`
      UPDATE users 
      SET password = $1 
      WHERE username = 'admin'
    `, [hashedPassword]);

    return NextResponse.json({ 
      success: true, 
      message: 'Admin password successfully hashed and updated to lumioposadmin!' 
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update admin password', details: error.message }, { status: 500 });
  }
}
