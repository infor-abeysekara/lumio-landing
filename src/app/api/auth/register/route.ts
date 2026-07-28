import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { queryMySQL } from '@/lib/db-mysql';

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
    const license_key = formData.get('license_key') as string;
    const profile_photo_file = formData.get('profile_photo') as File | null;

    if (!first_name || !last_name || !shop_name || !nic || !email || !password || !phone || !license_key) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 });
    }

    // Check if license key exists in POS MySQL database
    try {
      const mysqlResult: any = await queryMySQL('SELECT status FROM lumnixso_lumiopos_web.licenses WHERE license_key = ?', [license_key]);
      if (!mysqlResult || mysqlResult.length === 0) {
        return NextResponse.json({ error: 'Invalid POS License Key. Please check your software.' }, { status: 400 });
      }
      
      const licenseStatus = mysqlResult[0].status;
      if (licenseStatus !== 'Available' && licenseStatus !== 'Active') {
        return NextResponse.json({ error: 'This POS License Key is blocked or invalid.' }, { status: 400 });
      }
    } catch (dbErr) {
      console.error('MySQL validation error:', dbErr);
      return NextResponse.json({ error: 'Could not connect to POS License server.' }, { status: 500 });
    }

    // Check if license key is already registered in Web Dashboard
    const licenseCheck = await query('SELECT id FROM tenants WHERE license_key = $1', [license_key]);
    if (licenseCheck.rows.length > 0) {
      return NextResponse.json({ error: 'This License Key is already registered to a Cloud account.' }, { status: 409 });
    }

    // Check if email or nic already exists
    const existingCheck = await query('SELECT id FROM tenants WHERE email = $1 OR nic = $2', [email, nic]);
    if (existingCheck.rows.length > 0) {
      return NextResponse.json({ error: 'An account with this email or NIC already exists.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle Profile Photo (Convert to Base64 to store in DB since it's < 2MB)
    let profile_photo_base64 = null;
    if (profile_photo_file && profile_photo_file.size > 0) {
      if (profile_photo_file.size > 2 * 1024 * 1024) {
        return NextResponse.json({ error: 'Profile photo must be less than 2MB.' }, { status: 400 });
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(profile_photo_file.type)) {
        return NextResponse.json({ error: 'Only JPG, PNG, and WEBP formats are allowed.' }, { status: 400 });
      }

      const arrayBuffer = await profile_photo_file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      profile_photo_base64 = `data:${profile_photo_file.type};base64,${buffer.toString('base64')}`;
    }

    // Insert into tenants table
    const insertQuery = `
      INSERT INTO tenants (
        first_name, last_name, store_name, nic, email, phone, address, password, profile_photo, license_key
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;
    
    await query(insertQuery, [
      first_name, last_name, shop_name, nic, email, phone, address, hashedPassword, profile_photo_base64, license_key
    ]);

    return NextResponse.json({ success: true, message: 'Account created successfully' }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
