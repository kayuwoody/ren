// app/api/update-order/[orderId]/route.ts
import { NextResponse } from 'next/server';
import { updateWooOrder } from '@/lib/orderService';
console.log('🐛 [update-order] ENV:', {
  WC_STORE_URL:                  process.env.WC_STORE_URL,
  NEXT_PUBLIC_WC_STORE_URL:      process.env.NEXT_PUBLIC_WC_STORE_URL,
  NEXT_PUBLIC_WC_API_URL:        process.env.NEXT_PUBLIC_WC_API_URL,
  WC_CONSUMER_KEY:               process.env.WC_CONSUMER_KEY,
  NEXT_PUBLIC_WC_CONSUMER_KEY:   process.env.NEXT_PUBLIC_WC_CONSUMER_KEY,
  WC_CONSUMER_SECRET:            process.env.WC_CONSUMER_SECRET,
  NEXT_PUBLIC_WC_CONSUMER_SECRET:process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET,
});
export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  // support both { status } and { line_items } updates
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
