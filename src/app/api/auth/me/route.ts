import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('lumi_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = auth.verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null });
    }

    const user = await db.getUserById(payload.userId);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    const { passwordHash, ...userProfile } = user;
    return NextResponse.json({ user: userProfile });
  } catch (err) {
    console.error('Session profile me API error:', err);
    return NextResponse.json({ user: null });
  }
}

// Support updating user addresses from dashboard
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('lumi_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const payload = auth.verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { addresses } = await request.json();
    if (!Array.isArray(addresses)) {
      return NextResponse.json({ error: 'Invalid addresses payload.' }, { status: 400 });
    }

    // Validate each address (Pincode: 6 digits, Mobile: 10 digits starting with 6-9)
    for (const addr of addresses) {
      if (!addr.name || !addr.addressLine || !addr.district || !addr.state) {
        return NextResponse.json({ error: 'All address fields are required.' }, { status: 400 });
      }
      if (!/^\d{6}$/.test(addr.pincode)) {
        return NextResponse.json({ error: 'Pincode must be exactly 6 digits.' }, { status: 400 });
      }
      if (!/^[6-9]\d{9}$/.test(addr.phone)) {
        return NextResponse.json({ error: 'Mobile phone must be exactly 10 digits starting with 6, 7, 8, or 9.' }, { status: 400 });
      }
    }

    const updatedUser = await db.updateUserAddresses(payload.userId, addresses);
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const { passwordHash: _, ...userProfile } = updatedUser;
    return NextResponse.json({ success: true, user: userProfile });
  } catch (err) {
    console.error('Update Profile API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
