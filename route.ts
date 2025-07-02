// 2. app/api/create-order/route.ts 
export const runtime = 'nodejs'; 
import { NextResponse } from 'next/server'; 
import { createWooOrder } from '@/lib/orderService';
export async function POST(req: Request) 
{ try { const body = await req.json(); 
       const order = await createWooOrder(body); 
       return NextResponse.json(order); } 
catch (err: any) { console.error('Error creating Woo order:', err); 
      return NextResponse.json({ error: err.message }, { status: 500 }); } }
