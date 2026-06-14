import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, Product } from '@/lib/db';
import { auth } from '@/lib/auth';

// Helper to authenticate user
async function authenticate() {
  const cookieStore = await cookies();
  const token = cookieStore.get('lumi_token')?.value;
  if (!token) return null;
  return auth.verifyToken(token);
}

export async function GET() {
  try {
    const user = await authenticate();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let orders;
    if (['Super Admin', 'Admin', 'Staff'].includes(user.role)) {
      orders = await db.getOrders();
    } else {
      orders = await db.getOrdersByUserId(user.userId);
    }

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('Get Orders API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await authenticate();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { items, address, paymentMethod, chargesBreakdown, couponApplied, screenshotUrl } = await request.json();

    // 1. Basic validation
    if (!items || !items.length || !address || !paymentMethod || !chargesBreakdown) {
      return NextResponse.json({ error: 'Invalid order request payload.' }, { status: 400 });
    }

    // 2. Address validations
    if (!address.name || !address.addressLine || !address.district || !address.state) {
      return NextResponse.json({ error: 'Incomplete shipping address.' }, { status: 400 });
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      return NextResponse.json({ error: 'Pincode must be exactly 6 digits.' }, { status: 400 });
    }
    if (!/^[6-9]\d{9}$/.test(address.phone)) {
      return NextResponse.json({ error: 'Contact phone must be exactly 10 digits starting with 6, 7, 8, or 9.' }, { status: 400 });
    }

    // 3. Stock validation
    for (const item of items) {
      const dbProduct = await db.getProductById(item.product.id);
      if (!dbProduct) {
        return NextResponse.json({ error: `Product ${item.product.name} no longer exists.` }, { status: 400 });
      }
      if (dbProduct.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${item.product.name}. Only ${dbProduct.stock} left in stock.` 
        }, { status: 400 });
      }
    }

    // 4. Generate Advanced Order ID (Format: AYYMMDDOseq)
    // IST conversion for consistent Indian timezone date stamping
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    const yy = istTime.getUTCFullYear().toString().slice(-2);
    const mm = String(istTime.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(istTime.getUTCDate()).padStart(2, '0');
    const prefix = `A${yy}${mm}${dd}O`;

    const allOrders = await db.getOrders();
    const dailyOrders = allOrders.filter(o => o.order_id.startsWith(prefix));
    let maxSequence = 0;
    dailyOrders.forEach(o => {
      const seqStr = o.order_id.slice(prefix.length);
      const seqNum = parseInt(seqStr, 10);
      if (!isNaN(seqNum) && seqNum > maxSequence) {
        maxSequence = seqNum;
      }
    });
    const nextSeq = maxSequence + 1;
    const seqStr = String(nextSeq).padStart(3, '0');
    const orderId = `${prefix}${seqStr}`;

    // 5. Create Order object
    const newOrder = await db.createOrder({
      order_id: orderId,
      user_id: user.userId,
      products: items,
      subtotal: chargesBreakdown.subtotal,
      delivery_charge: chargesBreakdown.deliveryCharge,
      handling_charge: chargesBreakdown.handlingFee + chargesBreakdown.packagingFee + chargesBreakdown.festivalFee,
      total_amount: chargesBreakdown.total,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'COD' ? 'Verified' : 'Pending',
      order_status: 'Placed',
      shipping_address: address,
      chargesBreakdown,
      couponApplied,
      screenshotUrl: screenshotUrl || null,
      created_at: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      order: newOrder
    });
  } catch (err) {
    console.error('Create Order API Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
