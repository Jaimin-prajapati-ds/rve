import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const secret = process.env.ADMIN_SESSION_SECRET || 'authenticated';

  if (!session || session.value !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // IF WE HAVE BLOB TOKEN (Vercel Prod), use Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(file.name, file, {
        access: 'public',
      });
      return NextResponse.json({ success: true, url: blob.url });
    }

    // LOCAL Fallback for Dev
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = join(process.cwd(), 'public/uploads');
    
    // Ensure directory exists locally
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {}

    const path = join(uploadDir, filename);
    await writeFile(path, buffer);
    
    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
}
