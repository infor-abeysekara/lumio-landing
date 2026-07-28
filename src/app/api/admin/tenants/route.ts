import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ASSISTANT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await query(`
      SELECT 
        id, 
        first_name, 
        last_name, 
        store_name, 
        email, 
        phone, 
        status, 
        plan, 
        has_cloud_access,
        created_at 
      FROM tenants 
      ORDER BY created_at DESC
    `);
    
    return NextResponse.json({ tenants: res.rows });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 });
  }
}
