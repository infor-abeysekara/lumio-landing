import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1. Setup Feedbacks Table
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

    // 2. Add image_url to feedbacks
    try {
      await query('ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);');
    } catch (e) {}

    // 3. Setup Accessories Table Updates
    try {
      await query(`
        ALTER TABLE accessories 
        ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
        ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 50,
        ADD COLUMN IF NOT EXISTS specifications TEXT,
        ADD COLUMN IF NOT EXISTS shipping_returns TEXT,
        ADD COLUMN IF NOT EXISTS long_description TEXT;
      `);
      
      await query(`
        UPDATE accessories 
        SET sku = 'POS-AC-' || LPAD(id::text, 4, '0') 
        WHERE sku IS NULL;
      `);
      
      await query(`
        UPDATE accessories 
        SET shipping_returns = 'Delivery: Island-wide delivery across Sri Lanka\nProcessing: Orders processed within 1-2 business days\nSupport: Free setup assistance for POS hardware\nReturns: 7-day return policy for unused items in original packaging\nContact: WhatsApp +94 74 255 6665 or info@poslk.com'
        WHERE shipping_returns IS NULL;
      `);
    } catch (e) {}

    return NextResponse.json({ success: true, message: "Database tables and columns updated successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
