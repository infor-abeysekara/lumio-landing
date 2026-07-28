import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Users Table (Super Admin & Assistants)
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Tenants Table (Stores using Lumio POS)
    await query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        store_name VARCHAR(255) NOT NULL,
        nic VARCHAR(20) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_photo TEXT,
        license_key VARCHAR(255),
        has_cloud_access BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        plan VARCHAR(100) DEFAULT 'FREE',
        addons JSONB,
        next_billing_date DATE,
        bank_slip_url TEXT,
        activation_status VARCHAR(50) DEFAULT 'NONE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(email)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_tenants_license_key ON tenants(license_key)`);

    // Add columns if they don't exist (for existing tables)
    try {
      await query(`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS bank_slip_url TEXT`);
      await query(`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS activation_status VARCHAR(50) DEFAULT 'NONE'`);
    } catch(e: any) {
      if (e.code !== '42701') console.error('Error adding columns to tenants:', e.message);
    }

    // 2.5 Pending Registrations Table (For PayHere Deferred Account Creation)
    await query(`
      CREATE TABLE IF NOT EXISTS pending_registrations (
        order_id VARCHAR(100) PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        store_name VARCHAR(255) NOT NULL,
        nic VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Settings Table (Global Configs)
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT NOT NULL
      )
    `);

    // 4. Quotations Table
    await query(`
      CREATE TABLE IF NOT EXISTS quotations (
        id SERIAL PRIMARY KEY,
        quote_number VARCHAR(50) UNIQUE NOT NULL,
        client_name VARCHAR(255),
        client_attention VARCHAR(255),
        client_phone VARCHAR(50),
        client_email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'DRAFT',
        items JSONB,
        subtotal DECIMAL(15, 2),
        vat DECIMAL(15, 2),
        total DECIMAL(15, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Update Accessories Table
    await query(`
      CREATE TABLE IF NOT EXISTS accessories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image_url VARCHAR(255),
        is_in_stock BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add is_approved and long_description columns safely
    try {
      await query(`ALTER TABLE accessories ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true`);
      await query(`ALTER TABLE accessories ADD COLUMN IF NOT EXISTS long_description TEXT`);
    } catch (e: any) {
      // Column might already exist, ignore error (code 42701)
      if (e.code !== '42701') console.error('Error adding columns to accessories:', e.message);
    }

    // 6. Feedbacks Table
    await query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id SERIAL PRIMARY KEY,
        reviewer_name VARCHAR(255) NOT NULL,
        shop_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL,
        feedback_text TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert or Update Default Super Admin
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('@Ra200400912445', 10);
    
    const adminCheck = await query("SELECT count(*) FROM users WHERE username = 'ravindu2004'");
    if (parseInt(adminCheck.rows[0].count) === 0) {
      await query(`
        INSERT INTO users (username, password, role) VALUES ('ravindu2004', $1, 'SUPER_ADMIN')
      `, [hashedPassword]); 
    } else {
      await query(`
        UPDATE users SET password = $1 WHERE username = 'ravindu2004'
      `, [hashedPassword]);
    }

    // Insert or update default settings
    await query(`
      INSERT INTO settings (setting_key, setting_value) VALUES 
      ('payhere_merchant_id', '1231869'),
      ('payhere_secret', 'NDA1ODE1MzQ3MTc1MzE2OTY3MzE0MDk0NTQ5NDgwMjI3MDkxOA=='),
      ('software_price', '65000'),
      ('payment_gateway_enabled', 'true')
      ON CONFLICT (setting_key) DO UPDATE 
      SET setting_value = EXCLUDED.setting_value
    `);

    // Insert some default accessories if table is empty
    const accCheck = await query('SELECT count(*) FROM accessories');
    if (parseInt(accCheck.rows[0].count) === 0) {
      await query(`
        INSERT INTO accessories (name, description, price, category, image_url, is_in_stock, is_approved) VALUES
        ('THERMAL PAPER ROLL', '80x76mm thermal paper roll for 80mm POS receipt printers.', 300, 'Other Accessories', '/images/paper-roll.jpg', true, true),
        ('38X25 TC DT BARCODE LABEL', '38x25mm thermal direct transfer barcode labels.', 850, 'Other Accessories', '/images/barcode-label.jpg', true, true),
        ('Cash Drawer - 5 Bill 4 Coin', 'Heavy-duty POS cash drawer.', 14500, 'Other Accessories', '/images/cash-drawer.jpg', true, true),
        ('i3 3rd Full Set Computer', 'Intel i3 desktop computer with 8GB RAM, 128GB SSD + 500GB HDD, 22" monitor.', 45000, 'Computers', '/images/computer.jpg', true, true),
        ('Xprinter XP-T80Q 80mm', 'Compact 80mm thermal receipt printer with auto cutter.', 17500, 'POS Printers', '/images/printer-t80q.jpg', true, true),
        ('XP-Q838L 80mm Thermal Printer', '80mm direct thermal receipt printer.', 18500, 'POS Printers', '/images/printer-q838l.jpg', true, true),
        ('XP-365 USB Dual-mode Printer', 'USB dual-mode label and receipt printer.', 24999, 'POS Printers', '/images/printer-xp365.jpg', true, true),
        ('WIRED HANDHELD BARCODE', 'USB wired handheld 1D laser barcode scanner.', 10500, 'Barcode Scanners', '/images/scanner.jpg', true, true)
      `);
    }

    return NextResponse.json({ message: 'Database initialized successfully with new schemas (v2)' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to initialize database', details: error.message }, { status: 500 });
  }
}
