import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Ensure password_resets table exists
async function ensureTableExists() {
  await query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id SERIAL PRIMARY KEY,
      identifier VARCHAR(255) NOT NULL,
      otp VARCHAR(10) NULL,
      reset_token VARCHAR(255) NULL,
      expires_at TIMESTAMP NOT NULL
    );
  `);
}

function maskPhone(phone: string) {
  if (!phone) return '';
  // Show first 5 chars and mask the rest
  if (phone.length <= 5) return phone;
  const visible = phone.substring(0, 5);
  const masked = '*'.repeat(phone.length - 5);
  return visible + masked;
}

export async function POST(request: Request) {
  try {
    await ensureTableExists();
    const body = await request.json();
    const { action, identifier } = body;

    if (!identifier) {
      return NextResponse.json({ error: 'Email or Username is required' }, { status: 400 });
    }

    if (action === 'identify') {
      const res = await query('SELECT * FROM tenants WHERE email = $1', [identifier]);
      if (res.rows.length === 0) {
        return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
      }
      
      const user = res.rows[0];
      const phoneHint = maskPhone(user.phone);
      
      return NextResponse.json({ success: true, phoneHint });
    }
    
    if (action === 'verify-send') {
      const { nic, phone } = body;
      const res = await query('SELECT * FROM tenants WHERE email = $1 AND nic = $2 AND phone = $3', [identifier, nic, phone]);
      
      if (res.rows.length === 0) {
        return NextResponse.json({ error: 'Verification failed. NIC or Phone number is incorrect.' }, { status: 400 });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      // Clear existing OTPs for this user
      await query('DELETE FROM password_resets WHERE identifier = $1', [identifier]);
      
      // Insert new OTP
      await query('INSERT INTO password_resets (identifier, otp, expires_at) VALUES ($1, $2, $3)', [identifier, otp, expiresAt]);

      // Send OTP via Email using the transporter from lib/email.ts
      const { sendOTPEmail } = await import('@/lib/email');
      const emailSent = await sendOTPEmail(identifier, otp);

      if (!emailSent) {
        console.error("Failed to send email OTP, falling back to SMS only if available.");
      }

      // Send OTP via SMSAPI.lk
      try {
        let formattedPhone = phone.trim();
        // Ensure phone starts with 94 if it's 07x
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '94' + formattedPhone.substring(1);
        }
        
        const smsRes = await fetch('https://dashboard.smsapi.lk/api/v3/sms/send', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer 600|7C2nwGHodtNhPMec49YiIo8GZyFFHetWsyk3QjIs',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            recipient: formattedPhone,
            sender_id: 'SMSAPI Demo',
            type: 'plain',
            message: `Your Lumio POS Password Reset OTP is: ${otp}. It is valid for 15 minutes. Do not share this with anyone.`
          })
        });
        
        if (!smsRes.ok) {
           console.error("SMS API Error:", await smsRes.text());
        }
      } catch (smsError) {
        console.error("Failed to send SMS OTP:", smsError);
      }
      
      return NextResponse.json({ success: true, message: 'OTP sent successfully via Email and SMS' });
    }

    if (action === 'verify-otp') {
      const { otp } = body;
      const res = await query('SELECT * FROM password_resets WHERE identifier = $1 AND otp = $2 AND expires_at > NOW()', [identifier, otp]);
      
      if (res.rows.length === 0) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
      }

      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Update the row with reset token and clear OTP so it can't be reused
      await query('UPDATE password_resets SET otp = NULL, reset_token = $1, expires_at = $2 WHERE id = $3', 
        [resetToken, new Date(Date.now() + 15 * 60 * 1000), res.rows[0].id]
      );

      return NextResponse.json({ success: true, resetToken });
    }

    if (action === 'reset') {
      const { resetToken, newPassword } = body;
      const res = await query('SELECT * FROM password_resets WHERE identifier = $1 AND reset_token = $2 AND expires_at > NOW()', [identifier, resetToken]);
      
      if (res.rows.length === 0) {
        return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
      }

      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await query('UPDATE tenants SET password = $1 WHERE email = $2', [hashedPassword, identifier]);

      // Delete the reset token
      await query('DELETE FROM password_resets WHERE identifier = $1', [identifier]);

      return NextResponse.json({ success: true, message: 'Password reset successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Forgot password API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
