import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Auto-migrate schema for new columns requested by user
    try {
      await query(`
        ALTER TABLE accessories 
        ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
        ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 50,
        ADD COLUMN IF NOT EXISTS specifications TEXT,
        ADD COLUMN IF NOT EXISTS shipping_returns TEXT,
        ADD COLUMN IF NOT EXISTS long_description TEXT
      `);
      // Update existing rows to have default values if they are null
      await query(`
        UPDATE accessories 
        SET sku = 'POS-AC-' || LPAD(id::text, 4, '0') 
        WHERE sku IS NULL
      `);
      await query(`
        UPDATE accessories 
        SET shipping_returns = 'Delivery: Island-wide delivery across Sri Lanka\nProcessing: Orders processed within 1-2 business days\nSupport: Free setup assistance for POS hardware\nReturns: 7-day return policy for unused items in original packaging\nContact: WhatsApp +94 74 255 6665 or info@poslk.com'
        WHERE shipping_returns IS NULL
      `);
      // Create categories table
      await query(`
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      // Seed default categories if table is empty
      const catCount = await query('SELECT COUNT(*) FROM categories');
      if (parseInt(catCount.rows[0].count) === 0) {
        await query(`
          INSERT INTO categories (name) VALUES 
          ('POS Printers'),
          ('Barcode Scanners'),
          ('Computers'),
          ('Other Accessories')
        `);
      }
    } catch (e) {
      // Ignore if it fails (already exists or db locked)
    }

    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');
    
    let res;
    if (all === 'true') {
      res = await query('SELECT * FROM accessories ORDER BY id DESC');
    } else {
      res = await query('SELECT * FROM accessories WHERE is_approved = true ORDER BY id DESC');
    }
    
    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch accessories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const isApproved = session?.role === 'SUPER_ADMIN';

    // Upgrade table schema if necessary (so image_url can hold Base64 strings)
    try {
      await query(`ALTER TABLE accessories ALTER COLUMN image_url TYPE TEXT`);
    } catch (e) {
      // Ignore if already changed or errors
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const category = formData.get('category') as string;
    const sku = (formData.get('sku') as string) || null;
    const stock_quantity = parseInt((formData.get('stock_quantity') as string) || '50');
    const specifications = (formData.get('specifications') as string) || null;
    const shipping_returns = (formData.get('shipping_returns') as string) || null;
    const long_description = (formData.get('long_description') as string) || null;
    const image_file = formData.get('image_file') as File | null;
    
    let image_url = null;
    
    if (image_file && image_file.size > 0) {
      const arrayBuffer = await image_file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      image_url = `data:${image_file.type};base64,${buffer.toString('base64')}`;
    }

    const res = await query(
      'INSERT INTO accessories (name, description, price, category, image_url, is_approved, sku, stock_quantity, specifications, shipping_returns, long_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, description, price, category, image_url, isApproved, sku, stock_quantity, specifications, shipping_returns, long_description]
    );
    
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add accessory' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    const isApproved = session?.role === 'SUPER_ADMIN';

    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const category = formData.get('category') as string;
    const sku = (formData.get('sku') as string) || null;
    const stock_quantity = parseInt((formData.get('stock_quantity') as string) || '50');
    const specifications = (formData.get('specifications') as string) || null;
    const shipping_returns = (formData.get('shipping_returns') as string) || null;
    const long_description = (formData.get('long_description') as string) || null;
    const image_file = formData.get('image_file') as File | null;
    
    let res;
    if (image_file && image_file.size > 0) {
      const arrayBuffer = await image_file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const image_url = `data:${image_file.type};base64,${buffer.toString('base64')}`;

      res = await query(
        'UPDATE accessories SET name=$1, description=$2, price=$3, category=$4, image_url=$5, is_approved=$6, sku=$7, stock_quantity=$8, specifications=$9, shipping_returns=$10, long_description=$11 WHERE id=$12 RETURNING *',
        [name, description, price, category, image_url, isApproved, sku, stock_quantity, specifications, shipping_returns, long_description, id]
      );
    } else {
      res = await query(
        'UPDATE accessories SET name=$1, description=$2, price=$3, category=$4, is_approved=$5, sku=$6, stock_quantity=$7, specifications=$8, shipping_returns=$9, long_description=$10 WHERE id=$11 RETURNING *',
        [name, description, price, category, isApproved, sku, stock_quantity, specifications, shipping_returns, long_description, id]
      );
    }
    
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update accessory' }, { status: 500 });
  }
}
