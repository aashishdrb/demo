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

    const updated = await db.updateCategory(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    // Optional: If category query has changed, update all products belonging to it
    if (body.query) {
      const allProducts = await db.getProducts();
      // Wait, what query did it have before? Let's check from the database if needed, but wait!
      // If we re-categorize products, we can update any product whose .category matches the old category's name.
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (err) {
    console.error('Update Category API Error:', err);
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
    const success = await db.deleteCategory(id);
    if (!success) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete Category API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
