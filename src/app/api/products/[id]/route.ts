import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const res = await query('SELECT * FROM accessories WHERE id = $1', [id]);
    
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch accessory details' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    await query('DELETE FROM accessories WHERE id = $1', [id]);
    
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete accessory' }, { status: 500 });
  }
}
