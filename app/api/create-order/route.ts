// 2. app/api/create-order/route.ts export 
import { NextResponse } from 'next/server';
import { createWooOrder } from '@/lib/orderService';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // 1. Validate line_items array
    if (
      !Array.isArray(payload.line_items) ||
      payload.line_items.length === 0 ||
      payload.line_items.some(
        (li: any) =>
          typeof li.product_id !== 'number' || typeof li.quantity !== 'number'
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid or missing line_items — each must have numeric product_id and quantity' },
        { status: 400 }
      );
    }

    // 2. Ensure meta_data exists and set_paid is boolean
    payload.meta_data = Array.isArray(payload.meta_data)
      ? payload.meta_data
      : [];
    payload.set_paid = Boolean(payload.set_paid);

    // 3. Create the order in WooCommerce
    const data = await createWooOrder(payload);
    return NextResponse.json(data);
  } catch (err: any) {
    // Log the WooCommerce response body if available
    console.error(
      '[create-order] Error creating Woo order:',
      err.response?.data || err.message
    );
    const message =
      err.response?.data?.message || 'Unexpected error creating order';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
