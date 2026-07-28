import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'tenant') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await query(
      'SELECT id, amount, payment_date, status, payment_method, description FROM payments WHERE tenant_id = $1 ORDER BY payment_date DESC',
      [session.id]
    );

    return NextResponse.json({ success: true, purchases: res.rows });
  } catch (error: any) {
    console.error('Fetch Purchases Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
