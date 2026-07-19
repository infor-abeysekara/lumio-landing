import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailgun.org',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendLicenseEmail(to: string, name: string, orderId: string, amount: string, licenseKey: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #2b54d4; margin: 0;">LUMIO POS</h1>
        <p style="color: #666; margin-top: 5px;">Payment Successful & License Issued</p>
      </div>
      
      <p>Hi ${name},</p>
      <p>Thank you for your purchase! Your payment of <strong>Rs. ${amount}</strong> for order <strong>${orderId}</strong> was successful.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2b54d4;">
        <h3 style="margin-top: 0; color: #1e293b;">Your Software License Key</h3>
        <p style="font-family: monospace; font-size: 18px; letter-spacing: 2px; color: #0f172a; margin: 0;">
          <strong>${licenseKey}</strong>
        </p>
      </div>
      
      <p>You can manage your shop, analytics, and settings through the Lumio POS Cloud Dashboard.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://lumiopos.store/login" style="background-color: #2b54d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to Cloud Dashboard</a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      
      <p style="font-size: 12px; color: #999; text-align: center;">
        Lumio POS Solutions (Pvt) Ltd<br />
        This is an automated message, please do not reply.
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Lumio POS" <${process.env.SMTP_FROM || 'no-reply@lumiopos.store'}>`,
      to,
      subject: 'Your Lumio POS License Key & Invoice',
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
