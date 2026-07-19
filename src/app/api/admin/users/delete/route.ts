import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetId, source, superAdminPassword } = await request.json();

    if (!targetId || !source || !superAdminPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify Super Admin's password
    const adminQuery = await query('SELECT password FROM users WHERE username = $1', [session.username]);
    if (adminQuery.rows.length === 0) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const adminHash = adminQuery.rows[0].password;
    const passwordMatch = await bcrypt.compare(superAdminPassword, adminHash);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Incorrect Super Admin password. Deletion denied.' }, { status: 403 });
    }

    // Execute deletion based on source
    if (source === 'user') {
      const targetQuery = await query('SELECT username FROM users WHERE id = $1', [targetId]);
      if (targetQuery.rows.length > 0 && targetQuery.rows[0].username === session.username) {
          return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 403 });
      }
      await query('DELETE FROM users WHERE id = $1', [targetId]);
    } else if (source === 'tenant') {
      await query('DELETE FROM tenants WHERE id = $1', [targetId]);
    } else {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete user', details: error.message }, { status: 500 });
  }
}
