// app/orders/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface WooOrder {
  id: number;
  status: string;
  date_created: string;
  line_items: { quantity: number }[];
  meta_data: { key: string; value: any }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<WooOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const resp = await fetch('/api/orders');
        const data: WooOrder[] = await resp.json();
        if (!resp.ok) {
          console.error('Failed to fetch orders', data);
          setLoading(false);
          return;
        }
        setOrders(data);
      } catch (e) {
        console.error('Error loading orders:', e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (loading) {
    return <div className="p-4">Loading orders…</div>;
  }
  if (orders.length === 0) {
    return <div className="p-4">No orders yet.</div>;
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <ul className="space-y-2">
        {orders.map(o => {
          const itemCount = o.line_items.reduce((sum, item) => sum + item.quantity, 0);
          const completed = o.status === 'ready-to-pickup';
          const locker = o.meta_data.find(m => m.key === 'locker_number')?.value;
          const qr = o.meta_data.find(m => m.key === 'qr_payload')?.value;
          return (
            <li
              key={o.id}
              className={`border p-3 rounded ${completed ? 'bg-gray-200 text-gray-600' : 'bg-white'}`}
            >
              <p><strong>Order #{o.id}</strong> — {itemCount} items</p>
              <p><strong>Status:</strong> {completed ? 'Completed' : 'In Progress'}</p>
              {completed && qr && (
                <div className="mt-2">
                  <p><strong>Locker:</strong> {locker}</p>
                  <p><strong>QR:</strong> {qr}</p>
                </div>
              )}
              <Link href={`/orders/${o.id}`} className="text-blue-600 underline mt-2 block">
                View Details
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
