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
    const products = await db.getProducts();
    return NextResponse.json({ products });
  } catch (err) {
    console.error('Get Products API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await checkAdminAccess();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, category, price, discount_price, stock, image, ingredients, bestSeller, sizes, tags, hidden } = body;

    if (!name || !description || !category || !price || !image) {
      return NextResponse.json({ error: 'Missing required product fields.' }, { status: 400 });
    }

    const newProduct = await db.createProduct({
      id: `lumi-${Math.floor(100 + Math.random() * 900)}`,
      name,
      description,
      category,
      price: Number(price),
      discount_price: Number(discount_price || price),
      stock: Number(stock || 0),
      image,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      bestSeller: !!bestSeller,
      science: [
        { title: 'Derm Active Ingredients', text: `Formulated specifically with high-performance ${category.toLowerCase()} active compounds.` }
      ],
      rating: 4.8,
      reviewsCount: 1,
      created_at: new Date().toISOString(),
      sizes: Array.isArray(sizes) ? sizes : undefined,
      tags: Array.isArray(tags) ? tags : [],
      hidden: !!hidden
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err) {
    console.error('Create Product API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
