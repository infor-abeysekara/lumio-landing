import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'tenant') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    const shop_name = formData.get('shop_name') as string;
    const phone = formData.get('phone') as string;
    const photo = formData.get('new_profile_photo') as File | null;

    let photoBase64 = null;
    if (photo && photo.size > 0) {
      if (photo.size > 2 * 1024 * 1024) {
        return NextResponse.json({ error: 'Photo must be less than 2MB' }, { status: 400 });
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(photo.type)) {
        return NextResponse.json({ error: 'Only JPG, PNG, WEBP allowed' }, { status: 400 });
      }
      const buffer = Buffer.from(await photo.arrayBuffer());
      photoBase64 = `data:${photo.type};base64,${buffer.toString('base64')}`;
    }

    if (photoBase64) {
      await query(
        'UPDATE tenants SET first_name = $1, last_name = $2, shop_name = $3, phone = $4, profile_photo = $5 WHERE id = $6',
        [first_name, last_name, shop_name, phone, photoBase64, session.id]
      );
    } else {
      await query(
        'UPDATE tenants SET first_name = $1, last_name = $2, shop_name = $3, phone = $4 WHERE id = $5',
        [first_name, last_name, shop_name, phone, session.id]
      );
    }

    return NextResponse.json({ success: true, profile_photo: photoBase64 });
  } catch (error: any) {
    console.error('Account Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
