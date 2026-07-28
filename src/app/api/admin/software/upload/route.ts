import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ASSISTANT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!type || (type !== 'client' && type !== 'server')) {
      return NextResponse.json({ error: 'Invalid software type' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/downloads
    const downloadsDir = join(process.cwd(), 'public', 'downloads');
    
    // Ensure directory exists
    try {
      await mkdir(downloadsDir, { recursive: true });
    } catch (e) {
      // Directory already exists or can't be created
    }

    // Get original extension
    const originalName = file.name;
    const extension = originalName.includes('.') ? originalName.substring(originalName.lastIndexOf('.')) : '.exe';
    const baseName = type === 'server' ? 'LumioPOS_Server_Setup' : 'LumioPOS_Client_Setup';
    const fileName = `${baseName}${extension}`;
    
    const filePath = join(downloadsDir, fileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, message: `${type === 'server' ? 'Server' : 'Client'} software uploaded successfully` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload software' }, { status: 500 });
  }
}
