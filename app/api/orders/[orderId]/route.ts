// app/api/orders/[orderId]/route.ts
import { NextResponse } from 'next/server';
import { getWooOrder } from '@/lib/orderService';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await getWooOrder(Number(params.orderId));
    return NextResponse.json(order);
  } catch (e: any) {
    console.error('Error fetching Woo order:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
