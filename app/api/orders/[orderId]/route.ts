// 6. app/api/orders/[orderId]/route.ts 
export const runtime = 'nodejs'; 
import { NextResponse } from 'next/server'; 
 import { getWooOrder } from '@/lib/orderService';

export async function GET(req: Request, { params }: any) { const id = Number(params.orderId); try { const order = await getWooOrder(id); return NextResponse.json(order); } catch (err: any) { console.error('Error fetching Woo order:', err); return NextResponse.json({ error: err.message }, { status: 500 }); } }
