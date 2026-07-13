import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { order_id, amount, currency } = await request.json();
    
    // Hardcoded Merchant credentials for PayHere
    const merchant_id = '1231869';
    const merchant_secret = 'MTM1ODU3MDk4MTIwNzg2Nzk5OTAxMTcwMzUzMDIxNDE4OTU1NzY4Nw==';

    // PayHere Hash generation logic
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
    const stringToHash = merchant_id + order_id + amount + currency + hashedSecret;
    const finalHash = crypto.createHash('md5').update(stringToHash).digest('hex').toUpperCase();

    return NextResponse.json({ hash: finalHash });
  } catch (error) {
    console.error('Error generating PayHere hash:', error);
    return NextResponse.json({ error: 'Failed to generate hash' }, { status: 500 });
  }
}
