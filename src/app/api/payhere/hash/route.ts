import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { order_id, amount, currency } = await request.json();
    
    // Fetch Merchant credentials from database
    const settingsRes = await query("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('payhere_merchant_id', 'payhere_secret')");
    let merchant_id = '';
    let merchant_secret = '';
    
    settingsRes.rows.forEach((row: any) => {
      if (row.setting_key === 'payhere_merchant_id') merchant_id = row.setting_value;
      if (row.setting_key === 'payhere_secret') merchant_secret = row.setting_value;
    });

    if (!merchant_id || !merchant_secret) {
      return NextResponse.json({ error: 'PayHere credentials not configured in settings' }, { status: 500 });
    }

    // PayHere Hash generation logic
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
    const stringToHash = merchant_id + order_id + amount + currency + hashedSecret;
    const finalHash = crypto.createHash('md5').update(stringToHash).digest('hex').toUpperCase();

    return NextResponse.json({ hash: finalHash, merchant_id });
  } catch (error) {
    console.error('Error generating PayHere hash:', error);
    return NextResponse.json({ error: 'Failed to generate hash' }, { status: 500 });
  }
}
