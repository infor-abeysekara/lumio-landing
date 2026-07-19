import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Attempt to add new columns safely
    try {
      await query("ALTER TABLE users ADD COLUMN full_name VARCHAR(255)");
      await query("ALTER TABLE users ADD COLUMN email VARCHAR(255)");
      await query("ALTER TABLE users ADD COLUMN phone VARCHAR(50)");
      await query("ALTER TABLE users ADD COLUMN nic VARCHAR(20)");
    } catch (e: any) {
      // Ignore if columns already exist
    }

    const res = await query("SELECT id, username, full_name, email, phone, nic, role, created_at FROM users WHERE role = 'ASSISTANT' ORDER BY created_at DESC");
    return NextResponse.json({ success: true, assistants: res.rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assistants' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { username, password, full_name, email, phone, nic } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Check if username exists
    const existing = await query('SELECT id FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Attempt to add new columns safely before insert
    try {
      await query("ALTER TABLE users ADD COLUMN full_name VARCHAR(255)");
      await query("ALTER TABLE users ADD COLUMN email VARCHAR(255)");
      await query("ALTER TABLE users ADD COLUMN phone VARCHAR(50)");
      await query("ALTER TABLE users ADD COLUMN nic VARCHAR(20)");
    } catch (e: any) {
      // Ignore if columns already exist
    }

    // Insert
    await query(
      "INSERT INTO users (username, password, role, full_name, email, phone, nic) VALUES ($1, $2, 'ASSISTANT', $3, $4, $5, $6)",
      [username, hashedPassword, full_name || '', email || '', phone || '', nic || '']
    );

    return NextResponse.json({ success: true, message: 'Assistant added successfully' });
  } catch (error) {
    console.error('Error adding assistant:', error);
    return NextResponse.json({ error: 'Failed to add assistant' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await query("DELETE FROM users WHERE id = $1 AND role = 'ASSISTANT'", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete assistant' }, { status: 500 });
  }
}
