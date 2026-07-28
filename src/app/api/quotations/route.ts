import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendAdminNotificationEmail } from '@/lib/email';

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

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
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const rateData = rateLimitMap.get(ip);
    
    if (rateData) {
      if (now - rateData.timestamp < RATE_LIMIT_WINDOW_MS) {
        if (rateData.count >= RATE_LIMIT_MAX) {
          return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        rateData.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

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

    // Send email notification to admin
    await sendAdminNotificationEmail(
      `New Quotation Generated - ${quote_number}`,
      `
      <h3>New Quotation Record</h3>
      <p><strong>Quote No:</strong> ${quote_number}</p>
      <p><strong>Client:</strong> ${client_name}</p>
      <p><strong>Contact:</strong> ${client_phone} | ${client_email}</p>
      <p><strong>Total Value:</strong> LKR ${Number(total).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
      <br/>
      <p>Log in to the dashboard to view full quotation details.</p>
      `
    );
    
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create quotation' }, { status: 500 });
  }
}
