// 5. app/api/orders/route.ts 
export const runtime = 'nodejs'; 
import { NextResponse } from 'next/server'; 
import { listWooOrders } from '@/lib/orderService';

export async function GET() { try { const orders = await listWooOrders(); 
        return NextResponse.json(orders); } catch (err: any) { console.error('Error listing Woo orders:', err); 
        return NextResponse.json({ error: err.message }, { status: 500 }); } }
