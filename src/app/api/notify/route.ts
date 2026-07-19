import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // PayHere sends data as application/x-www-form-urlencoded
    const formData = await request.formData();
    
    const merchant_id = formData.get('merchant_id') as string;
    const order_id = formData.get('order_id') as string;
    const payhere_amount = formData.get('payhere_amount') as string;
    const payhere_currency = formData.get('payhere_currency') as string;
    const status_code = formData.get('status_code') as string;
    const md5sig = formData.get('md5sig') as string;
    
    // We passed the Processor ID in custom_1
    const processor_id = formData.get('custom_1') as string;
    const has_cloud_dashboard = formData.get('custom_2') as string;
    const customer_email = formData.get('customer_email') as string; // PayHere sometimes sends this

    // 1. Verify the MD5 Signature to ensure the request is actually from PayHere
    const merchant_secret = 'MjcyNjcyODQ4OTI1MzQ3NjI1NzgzMjc4NzIwNTI2NDI2ODc3MjQwOQ==';
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
    
    const stringToHash = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
    const generatedSignature = crypto.createHash('md5').update(stringToHash).digest('hex').toUpperCase();

    if (generatedSignature !== md5sig) {
      console.error('Invalid PayHere Signature!');
      return NextResponse.json({ error: 'Invalid Signature' }, { status: 403 });
    }

    // 2. Check if the payment was successful (status_code === '2')
    if (status_code === '2') {
      console.log(`Payment Success for Order: ${order_id}. Processor ID: ${processor_id}`);
      
      // 3. Handle based on Order Type
      if (order_id.startsWith('LUMIO-HW-')) {
        console.log('Hardware order paid. We should notify the shop owner via email or database!');
        // NOTE: A real implementation would send an email here using nodemailer
        // or insert into a "hardware_orders" table.
      } else {
        // Software License Order - Send secure POST request to PHP Admin Portal
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
            console.error('Failed to communicate with PHP Admin Portal');
          } else {
            console.log('Successfully triggered License Generation on PHP Admin Portal');
            
            try {
              const data = await phpResponse.json();
              if (data.license_key) {
                // If the PHP script returns the generated license key, send the email
                const { sendLicenseEmail } = await import('@/lib/email');
                const customer_first_name = formData.get('custom_1') as string; // Ideally pass the name from checkout
                await sendLicenseEmail(
                  customer_email,
                  'Valued Customer', // You can pass the actual name via a custom field if you want
                  order_id,
                  payhere_amount,
                  data.license_key
                );
                console.log('License email sent successfully to', customer_email);
              } else {
                console.log('No license key returned by PHP script, skipping email.');
              }
            } catch (e) {
              console.error('Failed to parse PHP response or send email', e);
            }
          }
        } catch (err) {
          console.error('Network error when calling PHP Admin Portal:', err);
        }
      }
    } else {
      console.log(`Payment failed or pending. Status Code: ${status_code}`);
    }

    // Always return 200 OK to PayHere so they know we received the webhook
    return NextResponse.json({ status: 'success' });
    
  } catch (error) {
    console.error('Error processing PayHere webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
