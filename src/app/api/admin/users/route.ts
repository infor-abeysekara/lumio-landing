import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch users (Admins & Assistants)
    const usersResult = await query('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC');
    
    // Fetch tenants (Clients)
    const tenantsResult = await query('SELECT id, first_name, last_name, email, store_name, created_at FROM tenants ORDER BY created_at DESC');

    const unifiedUsers = [
      ...usersResult.rows.map((u: any) => ({
        id: u.id,
        source: 'user',
        name: u.username,
        email: 'N/A',
        store_name: 'N/A',
        role: u.role,
        created_at: u.created_at
      })),
      ...tenantsResult.rows.map((t: any) => ({
        id: t.id,
        source: 'tenant',
        name: `${t.first_name} ${t.last_name}`,
        email: t.email,
        store_name: t.store_name,
        role: 'CLIENT',
        created_at: t.created_at
      }))
    ];

    // Sort by created_at descending
    unifiedUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ users: unifiedUsers });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch users', details: error.message }, { status: 500 });
  }
}
