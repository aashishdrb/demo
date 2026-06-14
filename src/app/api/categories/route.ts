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
  if (!payload || !['Super Admin', 'Admin', 'Staff'].includes(payload.role)) return null;
  return payload;
}

export async function GET() {
  try {
    const categories = await db.getCategories();
    return NextResponse.json({ categories });
  } catch (err) {
    console.error('Get Categories API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await checkAdminAccess();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { name, query, image, banner, description } = await request.json();

    if (!name || !query || !image) {
      return NextResponse.json({ error: 'Missing required category fields (name, query, image).' }, { status: 400 });
    }

    const newCategory = await db.createCategory({
      id: `cat-${Math.floor(100 + Math.random() * 900)}`,
      name,
      query,
      image,
      banner: banner || image,
      description: description || ''
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (err) {
    console.error('Create Category API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
