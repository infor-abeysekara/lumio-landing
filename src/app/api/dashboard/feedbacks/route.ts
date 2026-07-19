import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await query('SELECT * FROM feedbacks WHERE tenant_id = $1 ORDER BY created_at DESC', [session.id]);
    return NextResponse.json({ success: true, feedbacks: res.rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rating, feedback_text } = await request.json();
    if (!rating || !feedback_text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Get tenant info to auto-fill name and shop
    const tenantRes = await query('SELECT first_name, last_name, store_name FROM tenants WHERE id = $1', [session.id]);
    if (tenantRes.rows.length === 0) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    
    const tenant = tenantRes.rows[0];
    const reviewerName = `${tenant.first_name} ${tenant.last_name}`;
    const shopName = tenant.store_name;

    await query(
      `INSERT INTO feedbacks (tenant_id, reviewer_name, shop_name, rating, feedback_text, status) 
       VALUES ($1, $2, $3, $4, $5, 'PENDING')`,
      [session.id, reviewerName, shopName, rating, feedback_text]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add feedback' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, rating, feedback_text } = await request.json();
    if (!id || !rating || !feedback_text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Update and reset status to PENDING
    await query(
      `UPDATE feedbacks SET rating = $1, feedback_text = $2, status = 'PENDING' WHERE id = $3 AND tenant_id = $4`,
      [rating, feedback_text, id, session.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await query('DELETE FROM feedbacks WHERE id = $1 AND tenant_id = $2', [id, session.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
  }
}
