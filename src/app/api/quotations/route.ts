import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const res = await query('SELECT * FROM quotations ORDER BY id DESC');
    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch quotations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      client_name, 
      client_attention, 
      client_phone, 
      client_email, 
      items, 
      subtotal, 
      vat, 
      total 
    } = body;
    
    // Generate quote number
    const nextIdRes = await query("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM quotations");
    const nextId = nextIdRes.rows[0].next_id;
    const quote_number = `LUM-QT-${new Date().getFullYear()}-${String(nextId).padStart(4, '0')}`;

    const itemsJson = JSON.stringify(items);
    
    const res = await query(
      `INSERT INTO quotations 
      (quote_number, client_name, client_attention, client_phone, client_email, items, subtotal, vat, total) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [quote_number, client_name, client_attention, client_phone, client_email, itemsJson, subtotal, vat, total]
    );
    
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create quotation' }, { status: 500 });
  }
}
