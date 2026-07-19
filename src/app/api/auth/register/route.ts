import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    const shop_name = formData.get('shop_name') as string;
    const nic = formData.get('nic') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const password = formData.get('password') as string;
    const profile_photo_file = formData.get('profile_photo') as File | null;

    if (!first_name || !last_name || !shop_name || !nic || !email || !password || !phone) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 });
    }

    // Check if email or nic already exists
    const existingCheck = await query('SELECT id FROM tenants WHERE email = $1 OR nic = $2', [email, nic]);
    if (existingCheck.rows.length > 0) {
      return NextResponse.json({ error: 'An account with this email or NIC already exists.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle Profile Photo (Convert to Base64 to store in DB since it's < 1MB)
    let profile_photo_base64 = null;
    if (profile_photo_file && profile_photo_file.size > 0) {
      const arrayBuffer = await profile_photo_file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      profile_photo_base64 = `data:${profile_photo_file.type};base64,${buffer.toString('base64')}`;
    }

    // Insert into tenants table
    const insertQuery = `
      INSERT INTO tenants (
        first_name, last_name, store_name, nic, email, phone, address, password, profile_photo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;
    
    await query(insertQuery, [
      first_name, last_name, shop_name, nic, email, phone, address, hashedPassword, profile_photo_base64
    ]);

    return NextResponse.json({ success: true, message: 'Account created successfully' }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
