import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// Helper to check admin access
async function checkAdminAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get('lumi_token')?.value;
  if (!token) return null;
  const payload = auth.verifyToken(token);
  if (!payload || !['Super Admin', 'Admin', 'Staff'].includes(payload.role)) return null;
  return payload;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAdminAccess();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await db.updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    console.error('Update Product API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAdminAccess();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = await params;
    const success = await db.deleteProduct(id);
    if (!success) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete Product API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
