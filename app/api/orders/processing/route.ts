// 4. app/api/orders/processing/route.ts 
export const runtime = 'nodejs'; 
import { NextResponse } from 'next/server'; 
import { findProcessingOrder } from '@/lib/orderService';

export async function GET(req: Request) { const clientId = req.nextUrl.searchParams.get('clientId') || ''; if (!clientId) return NextResponse.json(null); 
                                         try { const order = await findProcessingOrder(clientId); 
                                              return NextResponse.json(order); } catch (err: any) { console.error('Error finding processing order:', err); 
                                              return NextResponse.json({ error: err.message }, { status: 500 }); } }
