'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params;
  const [order, setOrder] = useState<any>(null);

  const [progress, setProgress] = useState(0);
  // fetch & poll
  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch {
        setOrder(null);
      }
    };
    fetchOrder();
    const iv = setInterval(fetchOrder, 10_000);
    return () => clearInterval(iv);
  }, [orderId]);

  useEffect(() => {
    if (!order?.meta_data) return;
    const start = Number(order.meta_data.find((m: any) => m.key === "startTime")?.value);
    const end = Number(order.meta_data.find((m: any) => m.key === "endTime")?.value);

    if (order.status === "processing") {
      const tick = () => {
        const now = Date.now();
        const pct = Math.min(1, (now - start) / (end - start));
        setProgress(pct * 100);
      };
      tick();
      const iv = setInterval(tick, 1000);
      return () => clearInterval(iv);
    } else if (order.status === "ready-to-pickup") {
      setProgress(100);
    }
  }, [order]);

  if (!order) return <div>Loading order…</div>;

  // ⚠️ Guard meta_data
  const meta = order.meta_data ?? [];
  const qrPayload = meta.find((m: any) => m.key === 'qr_payload')?.value ?? '';
  const lockerNumber = meta.find((m: any) => m.key === 'locker_number')?.value ?? 'N/A';

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order {order.id}</h1>
      <p><strong>Status:</strong> {order.status}</p>
      {order.status === 'ready-to-pickup' && (
        <>
          <p><strong>Locker:</strong> {lockerNumber}</p>
          <div className="mt-4">
            <strong>QR Code:</strong>
            <QRCode value={qrPayload} />
          </div>
        </>
      )}
     {order.status === "processing" && (
        <button /* your kitchen-complete button if you want */>Mark Ready</button>
      )}
      {order.status === "pending" && (
        <button /* your simulate-payment button */>Simulate Payment</button>
      )}
    </div>
  );
}
