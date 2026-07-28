import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ASSISTANT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message } = await request.json();
    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    // Fetch SMS settings
    const settingsRes = await query(`SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('smsapi_token', 'smsapi_sender_id')`);
    let token = '';
    let senderId = '';
    
    settingsRes.rows.forEach((row: any) => {
      if (row.setting_key === 'smsapi_token') token = row.setting_value;
      if (row.setting_key === 'smsapi_sender_id') senderId = row.setting_value;
    });

    if (!token || !senderId) {
      return NextResponse.json({ error: 'SMS Gateway is not configured in Settings.' }, { status: 400 });
    }

    // Fetch all active tenant phone numbers
    const tenantsRes = await query(`SELECT phone FROM tenants WHERE status = 'ACTIVE'`);
    if (tenantsRes.rows.length === 0) {
      return NextResponse.json({ error: 'No active tenants found to broadcast.' }, { status: 400 });
    }

    // Format phone numbers (Assuming SL numbers, change 07x to 947x)
    const formattedNumbers = tenantsRes.rows.map((row: any) => {
      let num = row.phone.replace(/[^0-9]/g, '');
      if (num.startsWith('0')) {
        num = '94' + num.substring(1);
      }
      return num;
    }).filter((n: string) => n.length >= 9);

    if (formattedNumbers.length === 0) {
      return NextResponse.json({ error: 'No valid phone numbers found.' }, { status: 400 });
    }

    // Send via SMSAPI.lk
    // In SMSAPI v3, we can pass comma-separated recipients
    const recipientsStr = formattedNumbers.join(',');

    const smsPayload = {
      recipient: recipientsStr,
      sender_id: senderId,
      message: message
    };

    const smsRes = await fetch("https://dashboard.smsapi.lk/api/v3/sms/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(smsPayload)
    });

    const smsResult = await smsRes.json();
    
    if (smsRes.ok) {
      return NextResponse.json({ success: true, count: formattedNumbers.length, result: smsResult });
    } else {
      console.error('SMS API Error:', smsResult);
      return NextResponse.json({ error: 'SMS API rejected the request', details: smsResult }, { status: 400 });
    }

  } catch (error) {
    console.error('Broadcast Error:', error);
    return NextResponse.json({ error: 'Failed to send broadcast' }, { status: 500 });
  }
}
