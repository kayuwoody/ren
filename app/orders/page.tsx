// 8. app/orders/page.tsx (list) 
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: number;
  status: string;
  date_created: string;
  meta_data: { key: string; value: any }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const clientId = typeof window !== 'undefined' ? localStorage.getItem('clientId') || '' : '';

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then((all: Order[]) => {
        // filter/sort
        const mine = all.filter(o =>
          o.meta_data.some(m => m.key === 'clientId' && m.value === clientId)
        );
        const processing = mine.filter(o => o.status === 'processing');
        const rest = all
          .filter(o => !processing.some(p => p.id === o.id))
          .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
        setOrders([...processing, ...rest]);
      });
  }, [clientId]);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map(o => (
            <li
              key={o.id}
              className={`p-2 rounded ${
                o.status === 'processing' ? 'bg-yellow-100' : 'bg-gray-100'
              }`}
            >
              <Link href={`/orders/${o.id}`}>Order {o.id} — {o.status}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
