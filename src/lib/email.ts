import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailgun.org',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendLicenseEmail(to: string, name: string, orderId: string, amount: string, licenseKey: string, hasCloudDashboard: boolean = false) {
  const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo', dateStyle: 'medium', timeStyle: 'medium' });
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <script type="application/ld+json">
      {
        "@context": "http://schema.org",
        "@type": "Order",
        "merchant": {
          "@type": "Organization",
          "name": "Lumio POS"
        },
        "orderNumber": "${orderId}",
        "priceCurrency": "LKR",
        "price": "${amount}",
        "acceptedOffer": {
          "@type": "Offer",
          "itemOffered": {
            "@type": "SoftwareApplication",
            "name": "Lumio POS Pro - Software License"
          },
          "price": "${amount}",
          "priceCurrency": "LKR"
        }
      }
      </script>
    </head>
    <body>
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; color: #333; line-height: 1.6;">
        <!-- Header -->
      <div style="padding: 20px 0; border-bottom: 2px solid #2563EB;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="vertical-align: middle;">
              <img src="https://lumiopos.store/images/Logo.png" alt="LUMIO POS" style="height: 32px; vertical-align: middle; margin-right: 10px;" />
              <h1 style="color: #2563EB; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; display: inline-block; vertical-align: middle;">LUMIO POS</h1>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="color: #666; font-size: 14px; font-weight: 600;">Order Summary</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Intro -->
      <div style="padding: 20px 0;">
        <h2 style="font-size: 18px; margin-bottom: 5px;">Lumio POS Order Summary</h2>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Date: ${currentDate} LKT</p>
        
        <p style="margin-top: 20px; font-size: 14px;">Dear ${name !== 'Valued Customer' ? name : 'Customer'},</p>
        <p style="font-size: 14px;">Thank you for choosing Lumio POS. Here's a summary of your order and your software license key.</p>
      </div>

      <!-- Order Details Grid -->
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 15px;">Order Details</h3>
        <table width="100%" cellpadding="5" cellspacing="0" border="0" style="font-size: 13px;">
          <tr>
            <td width="20%" style="color: #666;">Order Date:</td>
            <td width="30%"><strong>${currentDate}</strong></td>
            <td width="20%" style="color: #666;">Payment Source:</td>
            <td width="30%"><strong>PayHere Gateway</strong></td>
          </tr>
          <tr>
            <td style="color: #666;">Order Number:</td>
            <td><strong>${orderId}</strong></td>
            <td style="color: #666;">Initial Charge:</td>
            <td><strong>Rs. ${Number(amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></td>
          </tr>
          <tr>
            <td style="color: #666;">Customer Email:</td>
            <td><strong>${to}</strong></td>
            <td style="color: #666;">Final Cost:</td>
            <td><strong>Rs. ${Number(amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></td>
          </tr>
        </table>
      </div>

      <!-- License Key Highlight -->
      <div style="background-color: #eff6ff; padding: 20px; border-radius: 6px; margin-bottom: 30px; text-align: center; border: 1px dashed #2563EB;">
        <h3 style="margin-top: 0; color: #2563EB; font-size: 16px;">Your Software License Key</h3>
        <p style="font-family: 'Courier New', Courier, monospace; font-size: 22px; font-weight: bold; letter-spacing: 2px; color: #333; margin: 10px 0;">
          ${licenseKey}
        </p>
        <p style="font-size: 12px; color: #666; margin-bottom: 0;">Keep this key safe. You will need it to activate your POS system.</p>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 30px;">
        <table width="100%" cellpadding="10" cellspacing="0" border="0" style="font-size: 13px; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #ddd;">
              <th align="left" width="55%" style="color: #333; padding-left: 0;">TITLE</th>
              <th align="center" width="10%" style="color: #333;">QTY</th>
              <th align="center" width="15%" style="color: #333;">DURATION</th>
              <th align="right" width="20%" style="color: #333; padding-right: 0;">SUB TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #eee;">
              <td align="left" style="padding-left: 0;">Lumio POS Pro - Software License</td>
              <td align="center">1</td>
              <td align="center">Lifetime</td>
              <td align="right" style="padding-right: 0;">Rs. ${hasCloudDashboard ? Number(Number(amount) - 6000).toLocaleString('en-US', {minimumFractionDigits: 2}) : Number(amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
            </tr>
            ${hasCloudDashboard ? `
            <tr style="border-bottom: 1px solid #eee;">
              <td align="left" style="padding-left: 0;">Lumio Cloud Dashboard Activation</td>
              <td align="center">1</td>
              <td align="center">1 Year</td>
              <td align="right" style="padding-right: 0;">Rs. 6,000.00</td>
            </tr>
            ` : ''}
            <tr>
              <td colspan="2"></td>
              <td align="right" style="padding-top: 20px; color: #666;">Sub Total</td>
              <td align="right" style="padding-top: 20px;">Rs. ${Number(amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td align="right" style="font-weight: bold; padding-top: 10px;">TOTAL</td>
              <td align="right" style="font-weight: bold; padding-top: 10px;">Rs. ${Number(amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Additional Details -->
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 15px;">Next Steps</h3>
        
        <p style="font-size: 13px; margin-bottom: 5px;"><strong>Software Activation:</strong></p>
        <p style="font-size: 13px; color: #666; margin-top: 0;">To activate your POS, open the Lumio POS software on your machine and enter the license key provided above when prompted. Make sure your device is connected to the internet during activation.</p>

        <p style="font-size: 13px; margin-bottom: 5px; margin-top: 15px;"><strong>Cloud Dashboard:</strong></p>
        <p style="font-size: 13px; color: #666; margin-top: 0;">You can manage your shop, view real-time analytics, and configure settings through your dedicated cloud dashboard.</p>
        
        <div style="margin-top: 15px;">
          <a href="https://lumiopos.store/login" style="background-color: #2563EB; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 13px; display: inline-block;">Login to Cloud Dashboard</a>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #888;">
        <p style="margin-bottom: 5px;">If you have any questions or concerns, please contact our support team. We're available 24/7 to assist you.</p>
        <p style="margin-bottom: 5px;">Regards,<br/><strong>Team Lumio POS</strong><br/><a href="https://lumiopos.store" style="color: #2563EB; text-decoration: none;">https://lumiopos.store</a></p>
        
        <p style="margin-top: 30px; font-size: 11px; text-align: center;">
          This is an automated message, please do not reply directly to this email.
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Lumio POS" <${process.env.SMTP_FROM || 'no-reply@lumiopos.store'}>`,
      to,
      subject: `Lumio POS Order Summary (Order# ${orderId})`,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendAdminNotificationEmail(subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Lumio POS System" <${process.env.SMTP_FROM || 'no-reply@lumiopos.store'}>`,
      to: 'infor.abeysekara@gmail.com', // Admin Email
      subject,
      html,
    });
    console.log('Admin notification sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
}

export async function sendOTPEmail(to: string, otp: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
      <div style="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
        <h2 style="color: #111827; text-align: center;">Password Reset OTP</h2>
        <p style="color: #4B5563; font-size: 16px;">Hello,</p>
        <p style="color: #4B5563; font-size: 16px;">You requested to reset your password. Use the following One-Time Password (OTP) to proceed. This OTP is valid for 15 minutes.</p>
        <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #2563EB; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #4B5563; font-size: 14px;">If you didn't request a password reset, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
        <p style="color: #9CA3AF; font-size: 12px; text-align: center;">Team Lumio POS</p>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Lumio POS System" <${process.env.SMTP_FROM || 'no-reply@lumiopos.store'}>`,
      to,
      subject: `Your Password Reset OTP - Lumio POS`,
      html,
    });
    console.log('OTP Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}
