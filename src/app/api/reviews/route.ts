import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const reviews = await db.getReviewsByProductId(productId);
    const totalCount = reviews.length;
    const averageRating = totalCount > 0 
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1))
      : 0;

    const starBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
      if (star >= 1 && star <= 5) {
        starBreakdown[star]++;
      }
    });

    return NextResponse.json({
      success: true,
      reviews,
      totalCount,
      averageRating,
      starBreakdown
    });
  } catch (err) {
    console.error('Fetch Reviews API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('lumi_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. Login required.' }, { status: 401 });
    }

    const userPayload = auth.verifyToken(token);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized. Invalid session.' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid review parameters.' }, { status: 400 });
    }

    // Check if user is a verified buyer
    const userOrders = await db.getOrdersByUserId(userPayload.userId);
    const hasBought = userOrders.some((order) => 
      order.order_status === 'Delivered' || order.order_status === 'Confirmed' || order.order_status === 'Shipped' || order.order_status === 'Packed'
        ? order.products.some((item) => item.product.id === productId)
        : false
    );

    const review = await db.createOrUpdateReview({
      productId,
      userId: userPayload.userId,
      userName: userPayload.name,
      rating,
      comment: comment || '',
      verifiedBuyer: hasBought
    });

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error('Submit Review API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
