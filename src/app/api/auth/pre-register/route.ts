import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const order_id = formData.get('order_id') as string;
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    const shop_name = formData.get('shop_name') as string;
    const nic = formData.get('nic') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const password = formData.get('password') as string;

    if (!order_id || !first_name || !last_name || !shop_name || !nic || !email || !password || !phone) {
      return NextResponse.json({ error: `Please fill out all required fields. Missing: ${!order_id ? 'order_id ' : ''}${!first_name ? 'first_name ' : ''}${!last_name ? 'last_name ' : ''}${!shop_name ? 'shop_name ' : ''}${!nic ? 'nic ' : ''}${!email ? 'email ' : ''}${!password ? 'password ' : ''}${!phone ? 'phone ' : ''}`.trim() }, { status: 400 });
    }

    // Check if email or nic already exists in actual tenants table
    const existingCheck = await query('SELECT id FROM tenants WHERE email = $1 OR nic = $2', [email, nic]);
    if (existingCheck.rows.length > 0) {
      return NextResponse.json({ error: 'An account with this email or NIC already exists.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Note: We are ignoring profile_photo during pre-registration to simplify. They can upload it later via dashboard.

    // Insert into pending_registrations
    const insertQuery = `
      INSERT INTO pending_registrations (
        order_id, first_name, last_name, store_name, nic, email, phone, address, password
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (order_id) DO UPDATE SET 
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        store_name = EXCLUDED.store_name,
        nic = EXCLUDED.nic,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        address = EXCLUDED.address,
        password = EXCLUDED.password
    `;
    
    await query(insertQuery, [
      order_id, first_name, last_name, shop_name, nic, email, phone, address, hashedPassword
    ]);

    return NextResponse.json({ success: true, message: 'Pre-registration saved successfully' }, { status: 201 });

  } catch (error: any) {
    console.error('Pre-registration error:', error);
    return NextResponse.json({ error: 'Database Error: ' + (error.message || 'Internal server error') }, { status: 500 });
  }
}
