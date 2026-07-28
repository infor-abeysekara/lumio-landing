import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1. Add subscription columns to tenants
    await query(`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS is_subscribed BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP;
    `);

    // 2. Create payments table
    await query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id),
        amount DECIMAL(10, 2) NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'success',
        payment_method VARCHAR(100),
        description TEXT
      );
    `);

    // 3. Add email verification column to tenants (just for future)
    await query(`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
    `);

    return NextResponse.json({ success: true, message: 'Database updated successfully' });
  } catch (error: any) {
    console.error('DB Update Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
