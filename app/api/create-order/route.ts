// app/api/create-order/route.ts
import { NextResponse } from 'next/server';
import { createWooOrder } from '@/lib/orderService';

export async function POST(req: Request) {
  const { line_items } = await req.json();
  try {
    const wooOrder = await createWooOrder({ line_items });
    return NextResponse.json(
      { id: wooOrder.id, status: wooOrder.status, meta_data: wooOrder.meta_data },
      { status: 200 }
    );
  } catch (e: any) {
    console.error('Error creating Woo order:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
