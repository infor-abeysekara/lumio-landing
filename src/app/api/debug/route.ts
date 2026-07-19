import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position;
    `);
    const tables: any = {};
    for (const row of res.rows) {
      if (!tables[row.table_name]) tables[row.table_name] = [];
      tables[row.table_name].push(`${row.column_name} (${row.data_type})`);
    }
    return NextResponse.json(tables);
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
