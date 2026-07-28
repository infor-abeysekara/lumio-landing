import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    if (session.role === 'tenant') {
      const res = await query('SELECT id, first_name, last_name, shop_name, email, phone, profile_photo, is_subscribed FROM tenants WHERE id = $1', [session.id]);
      if (res.rows.length > 0) {
        const user = res.rows[0];
        return NextResponse.json({ 
          role: session.role, 
          username: session.username,
          first_name: user.first_name,
          last_name: user.last_name,
          shop_name: user.shop_name,
          profile_photo: user.profile_photo,
          is_subscribed: user.is_subscribed
        });
      }
    }
    
    // For admin or fallback
    return NextResponse.json({ role: session.role, username: session.username });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
