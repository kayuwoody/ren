// 3. app/api/update-order/[orderId]/route.ts 
export const runtime = 'nodejs'; 
import { NextResponse } from 'next/server'; 
import { updateWooOrder } from '@/lib/orderService';

export async function POST(req: Request, { params }: any) { const id = Number(params.orderId); 
try { const body = await req.json(); const order = await updateWooOrder(id, body); 
return NextResponse.json(order); } catch (err: any) { console.error('Error updating Woo order:', err); 
return NextResponse.json({ error: err.message }, { status: 500 }); } }
