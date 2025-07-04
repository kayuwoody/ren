// app/api/orders/[orderId]/route.ts
import { NextResponse } from "next/server";
import { getWooOrder } from "@/lib/orderService";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const id = parseInt(params.orderId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid orderId" }, { status: 400 });
  const order = await getWooOrder(id);
  return NextResponse.json(order);
}