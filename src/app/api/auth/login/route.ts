import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!user || !pass || !secret) {
    console.error('SERVER_ERROR: Admin credentials or session secret not configured in environment variables.');
    return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
  }

  if (username === user && password === pass) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
