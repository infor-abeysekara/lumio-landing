import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query('SELECT * FROM categories ORDER BY name ASC');
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    
    const res = await query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create category (might already exist)' }, { status: 500 });
  }
}
