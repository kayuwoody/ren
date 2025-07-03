// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { listWooOrders } from '@/lib/orderService';


export async function GET() {
    console.log('🐛 [orders route] ENV WC_CONSUMER_KEY:', process.env.WC_CONSUMER_KEY);
  console.log('🐛 [orders route] ENV NEXT_PUBLIC_WC_CONSUMER_KEY:', process.env.NEXT_PUBLIC_WC_CONSUMER_KEY);
  try {
    const orders = await listWooOrders();
    return NextResponse.json(orders);
  } catch (e: any) {
    console.error('Error listing Woo orders:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const payload = await req.json();
  try {
    const wooOrder = await updateWooOrder(Number(params.orderId), payload);
    return NextResponse.json(
      { id: wooOrder.id, status: wooOrder.status, meta_data: wooOrder.meta_data },
      { status: 200 }
    );
  } catch (e: any) {
    console.error('Error updating Woo order:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
