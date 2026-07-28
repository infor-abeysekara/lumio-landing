import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { queryMySQL } from '@/lib/db-mysql';

// In-memory rate limiting (Limits to 10 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  const entry = rateLimitMap.get(ip);
  if (!entry || (now - entry.lastReset > windowMs)) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true;
  }

  entry.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests, please try again later' }, { status: 429 });
    }

    const { license_key } = await request.json();

    if (!license_key) {
      return NextResponse.json({ error: 'License key is required' }, { status: 400 });
    }

    // 1. First check the PostgreSQL 'tenants' table for web account details
    const pgResult = await query('SELECT first_name, last_name, store_name, email, phone, password, profile_photo FROM tenants WHERE license_key = $1', [license_key]);
    
    if (pgResult.rows.length > 0) {
      const tenant = pgResult.rows[0];
      return NextResponse.json({
        success: true,
        source: 'WEB_ACCOUNT',
        data: {
          first_name: tenant.first_name,
          last_name: tenant.last_name,
          shop_name: tenant.store_name,
          email: tenant.email,
          contact: tenant.phone,
          password: tenant.password, // hashed password
          profile_photo: tenant.profile_photo || null // Base64
        }
      });
    }

    // 2. If not found in Next.js DB, check Cloud MySQL 'licenses' table
    try {
      const mysqlResult: any = await queryMySQL('SELECT customer_name, status FROM licenses WHERE license_key = ?', [license_key]);
      
      if (mysqlResult.length > 0) {
        const license = mysqlResult[0];
        
        if (license.status !== 'Active' && license.status !== 'Available') {
             return NextResponse.json({ error: 'License is blocked or inactive' }, { status: 403 });
        }

        return NextResponse.json({
          success: true,
          source: 'PHP_LICENSE',
          data: {
            first_name: license.customer_name || 'Customer',
            last_name: '',
            shop_name: license.customer_name || 'My Shop',
            email: '',
            contact: '',
            password: '', // No web password exists
            profile_photo: null
          }
        });
      }
    } catch (mysqlErr) {
      console.error('MySQL Verification Error:', mysqlErr);
      // fallback to return 404 below
    }

    return NextResponse.json({ error: 'Invalid License Key' }, { status: 404 });

  } catch (error) {
    console.error('Verify License Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
