import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Helper to check admin access
async function checkAdminAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get('lumi_token')?.value;
  if (!token) return null;
  const payload = auth.verifyToken(token);
  if (!payload || !['Super Admin', 'Admin'].includes(payload.role)) return null;
  return payload;
}

export async function GET() {
  try {
    const charges = await db.getCharges();
    const coupons = await db.getCoupons();
    return NextResponse.json({ charges, coupons });
  } catch (err) {
    console.error('Get Charges API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await checkAdminAccess();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { chargesConfig, couponsConfig } = await request.json();

    if (chargesConfig) {
      await db.updateCharges(chargesConfig);
    }
    if (couponsConfig && Array.isArray(couponsConfig)) {
      await db.updateCoupons(couponsConfig);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update Charges API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
