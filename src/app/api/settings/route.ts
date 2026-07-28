import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // We attempt to create the table here if it doesn't exist to avoid migration issues
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT NOT NULL
      );
    `);

    // Ensure default value exists
    await query(`
      INSERT INTO settings (setting_key, setting_value) 
      VALUES ('software_price', '65000') 
      ON CONFLICT (setting_key) DO NOTHING;
    `);

    const result = await query("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('software_price', 'payment_gateway_enabled')");
    
    // Convert rows to an object
    const settings = result.rows.reduce((acc: Record<string, string>, row: any) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Fallback to default if DB fails
    return NextResponse.json({ 
      success: true, 
      settings: { software_price: '65000' } 
    });
  }
}
