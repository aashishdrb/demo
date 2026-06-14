import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// Helper to authenticate user
async function authenticate() {
  const cookieStore = await cookies();
  const token = cookieStore.get('lumi_token')?.value;
  if (!token) return null;
  return auth.verifyToken(token);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticate();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;
    const order = await db.getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Check authorization: Admin/Staff can see any order, Customers only their own
    if (order.user_id !== user.userId && !['Super Admin', 'Admin', 'Staff'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized access to order details.' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('Get Order details API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticate();
    if (!user || !['Super Admin', 'Admin', 'Staff'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = await params;
    const { order_status, payment_status } = await request.json();

    let updatedOrder = null;

    if (order_status) {
      updatedOrder = await db.updateOrderStatus(id, order_status);
    }
    if (payment_status) {
      updatedOrder = await db.updateOrderPaymentStatus(id, payment_status);
    }

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error('Update Order API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticate();
    if (!user || !['Super Admin', 'Admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = await params;
    const success = await db.deleteOrder(id);
    if (!success) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete Order API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
