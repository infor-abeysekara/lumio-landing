import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Username/Email and password are required' }, { status: 400 });
    }

    // 1. Check if user exists in the 'users' table (Super Admin or Assistant)
    // We check by username or email (if email was added to users, but it's username for admins)
    let dbUser = null;
    let role = null;
    let userId = null;
    let userName = null;

    const userResult = await query('SELECT * FROM users WHERE username = $1', [identifier]);
    
    if (userResult.rows.length > 0) {
      dbUser = userResult.rows[0];
      role = dbUser.role;
      userId = dbUser.id;
      userName = dbUser.username;
    } else {
      // 2. If not found in 'users', check 'tenants' table (Clients)
      const tenantResult = await query('SELECT * FROM tenants WHERE email = $1', [identifier]);
      if (tenantResult.rows.length > 0) {
        dbUser = tenantResult.rows[0];
        role = 'CLIENT';
        userId = dbUser.id;
        userName = dbUser.first_name + ' ' + dbUser.last_name;
      }
    }

    if (!dbUser) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify Password using bcrypt
    const passwordMatch = await bcrypt.compare(password, dbUser.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT Token
    const token = await signToken({
      id: userId,
      username: userName,
      role: role
    });

    const cookieStore = await cookies();
    cookieStore.set('lumio_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({ success: true, role: role });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
