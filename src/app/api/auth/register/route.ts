import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    // Validations
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Phone validation (10 digits starting with 6/7/8/9)
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: 'Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.' }, { status: 400 });
    }

    // Email duplication check
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
    }

    // Encrypt Password
    const passwordHash = await auth.hashPassword(password);

    // Save to Database
    const newUser = await db.createUser({
      id: `usr-${Math.floor(100000 + Math.random() * 900000)}`,
      name,
      email,
      phone,
      passwordHash,
      role: 'Customer',
      addresses: [],
      created_at: new Date().toISOString()
    });

    // Sign Token for Auto Login
    const token = auth.signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set('lumi_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    const { passwordHash: _, ...userProfile } = newUser;
    return NextResponse.json({
      success: true,
      user: userProfile
    });
  } catch (err) {
    console.error('Register API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
