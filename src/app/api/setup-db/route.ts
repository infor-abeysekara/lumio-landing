import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
          id SERIAL PRIMARY KEY,
          tenant_id INTEGER REFERENCES tenants(id) NULL,
          reviewer_name VARCHAR(255) NOT NULL,
          shop_name VARCHAR(255) NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          feedback_text TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'PENDING',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return NextResponse.json({ success: true, message: "Feedbacks table created successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
