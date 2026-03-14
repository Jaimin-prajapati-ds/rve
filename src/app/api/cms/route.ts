import { NextResponse } from 'next/server';
import { getCMSData, updateCMSData } from '@/lib/cms';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const data = await getCMSData();
    
    // Auto-seed Postgres if it's currently empty in production
    if (process.env.POSTGRES_URL && (!data || Object.keys(data).length === 0)) {
       try {
         const localData = JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/data/db.json'), 'utf-8'));
         await updateCMSData(localData);
         return NextResponse.json(localData);
       } catch (seedErr) {
         console.error('Seeding Error:', seedErr);
       }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('CMS GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!session || !secret || session.value !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newData = await req.json();
    await updateCMSData(newData);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('CMS Update Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update CMS data' 
    }, { status: 500 });
  }
}
