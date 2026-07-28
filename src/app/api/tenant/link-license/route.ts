import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { query } from "@/lib/db";
import { queryMySQL } from "@/lib/db-mysql";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lumio_super_secret_key_2026_xyz'
);

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('lumio_session')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token using jose
    let decoded;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      decoded = verified.payload as { id: string; role: string };
    } catch (err) {
       return NextResponse.json({ error: "Invalid token format" }, { status: 401 });
    }
    
    if (decoded.role !== 'CLIENT') {
      return NextResponse.json({ error: "Forbidden. Only tenants can link licenses." }, { status: 403 });
    }

    const { license_key } = await request.json();

    if (!license_key) {
      return NextResponse.json({ error: "License key is required" }, { status: 400 });
    }

    // Verify license in MySQL
    try {
      const mysqlResult: any = await queryMySQL('SELECT status FROM lumnixso_lumiopos_web.licenses WHERE license_key = ?', [license_key]);
      if (!mysqlResult || mysqlResult.length === 0) {
        return NextResponse.json({ error: 'Invalid POS License Key.' }, { status: 400 });
      }
    } catch (dbErr: any) {
      console.error('MySQL validation error:', dbErr);
      return NextResponse.json({ error: 'DB Error: ' + (dbErr.message || 'Could not connect to POS License server.') }, { status: 500 });
    }

    // Check if license key is already linked to someone else in PostgreSQL
    const licenseCheck = await query('SELECT id FROM tenants WHERE license_key = $1 AND id != $2', [license_key, decoded.id]);
    if (licenseCheck.rows.length > 0) {
      return NextResponse.json({ error: 'This License Key is already linked to another account.' }, { status: 409 });
    }

    // Update the database (grant cloud access and 1-year expiry)
    await query("UPDATE tenants SET license_key = $1, has_cloud_access = true, next_billing_date = CURRENT_DATE + INTERVAL '1 year' WHERE id = $2", [license_key, decoded.id]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error linking license:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
