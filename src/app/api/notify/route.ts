import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function logWebhook(msg: string) {
  try {
    const logPath = path.join(process.cwd(), 'public', 'webhook_log.txt');
    const time = new Date().toISOString();
    fs.appendFileSync(logPath, `[${time}] ${msg}\n`);
  } catch (e) {
    // ignore
  }
}

export async function POST(request: Request) {
  try {
    logWebhook('--- Incoming Webhook ---');
    const formData = await request.formData();
    
    const merchant_id = formData.get('merchant_id') as string;
    const order_id = formData.get('order_id') as string;
    const payhere_amount = formData.get('payhere_amount') as string;
    const payhere_currency = formData.get('payhere_currency') as string;
    const status_code = formData.get('status_code') as string;
    const md5sig = formData.get('md5sig') as string;
    
    const custom_1 = formData.get('custom_1') as string || '';
    const [processor_id, emailFromCustom] = custom_1.split('|');
    const has_cloud_dashboard = formData.get('custom_2') as string;
    
    const customer_email = (formData.get('customer_email') as string) || emailFromCustom;
    logWebhook(`Order ID: ${order_id}, Email: ${customer_email}, Status: ${status_code}`);

    const { query } = require('@/lib/db');
    const settingsRes = await query("SELECT setting_value FROM settings WHERE setting_key = 'payhere_secret'");
    
    if (settingsRes.rows.length === 0) {
      logWebhook('Error: PayHere secret not found in DB');
      return NextResponse.json({ error: 'Server Configuration Error' }, { status: 500 });
    }
    
    const merchant_secret = settingsRes.rows[0].setting_value;
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
    
    const stringToHash = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
    const generatedSignature = crypto.createHash('md5').update(stringToHash).digest('hex').toUpperCase();

    if (generatedSignature !== md5sig) {
      logWebhook(`Error: Invalid Signature! Expected ${generatedSignature}, got ${md5sig}`);
      return NextResponse.json({ error: 'Invalid Signature' }, { status: 403 });
    }

    if (status_code === '2') {
      logWebhook(`Payment Success! Checking for pending registrations...`);
      
      try {
        const pendingRes = await query("SELECT * FROM pending_registrations WHERE order_id = $1", [order_id]);
        if (pendingRes.rows.length > 0) {
          const user = pendingRes.rows[0];
          logWebhook(`Found pending registration for ${user.email}. Creating tenant account...`);
          
          await query(`
            INSERT INTO tenants (first_name, last_name, store_name, nic, email, phone, address, password)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [user.first_name, user.last_name, user.store_name, user.nic, user.email, user.phone, user.address, user.password]);
          
          await query("DELETE FROM pending_registrations WHERE order_id = $1", [order_id]);
          logWebhook(`Tenant account created successfully.`);
        } else {
          logWebhook(`No pending registration found for order ${order_id}.`);
        }
      } catch (err: any) {
        logWebhook(`Error processing pending registration: ${err.message}`);
      }

      logWebhook(`Calling PHP API...`);
      
      if (order_id.startsWith('LUMIO-HW-')) {
        logWebhook('Hardware order - skipping license generation');
      } else {
        const phpAdminUrl = 'https://lumiopos.lumnixsolutions.site/generate_license.php';
        const SHARED_API_SECRET = 'lumio_secure_api_key_2026_xyz'; 

        try {
          const phpResponse = await fetch(phpAdminUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SHARED_API_SECRET}`
            },
            body: JSON.stringify({
              order_id,
              processor_id,
              amount: payhere_amount,
              customer_email,
              has_cloud: has_cloud_dashboard === 'yes'
            })
          });

          if (!phpResponse.ok) {
            logWebhook(`PHP API failed with status: ${phpResponse.status}`);
          } else {
            const data = await phpResponse.json();
            logWebhook(`PHP API Success. Returned data: ${JSON.stringify(data)}`);
            
            if (data.license_key) {
              const { sendLicenseEmail } = await import('@/lib/email');
              logWebhook(`Attempting to send email to ${customer_email}...`);
              const sent = await sendLicenseEmail(
                customer_email,
                'Valued Customer', 
                order_id,
                payhere_amount,
                data.license_key,
                has_cloud_dashboard === 'yes'
              );
              logWebhook(`Email send result: ${sent}`);
            } else {
              logWebhook('PHP API did not return a license_key');
            }
          }
        } catch (err: any) {
          logWebhook(`Network error to PHP API: ${err?.message}`);
        }
      }
    } else {
      logWebhook(`Payment not complete. Status Code: ${status_code}`);
    }

    return NextResponse.json({ status: 'success' });
    
  } catch (error: any) {
    logWebhook(`Critical Webhook Error: ${error?.message}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
