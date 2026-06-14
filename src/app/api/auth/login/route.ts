import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Verify Password
    const passwordMatch = await auth.verifyPassword(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Generate JWT Token
    const token = auth.signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    // Set Token in Secure Cookie
    const cookieStore = await cookies();
    cookieStore.set('lumi_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Return User details without password hash
    const { passwordHash, ...userProfile } = user;
    return NextResponse.json({
      success: true,
      user: userProfile
    });
  } catch (err) {
    console.error('Login API Error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
