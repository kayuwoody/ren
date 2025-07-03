// app/orders/[orderId]/page.tsx
'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import QRCode from 'react-qr-code';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useOrderEntry } from '@/lib/hooks/useOrderEntry';
import { useOrderTimer } from '@/lib/hooks/useOrderTimer';
import { useOrderMeta } from '@/lib/hooks/useOrderMeta';

export default function OrderDetailPage() {
  const { orderId } = useParams() as { orderId: string };
  const { entry, updateEntry } = useOrderEntry(orderId);
  const { progress, started, setStarted } = useOrderTimer(entry?.startTime, entry?.endTime);
  const { status, qrPayload, lockerNumber } = useOrderMeta(orderId);

  // inside OrderDetailPage, replace your existing handlePayment with:

const handlePayment = async () => {
  if (status !== 'pending' || !entry) return;
  try {
    // build line_items payload
    const line_items = entry.items.map(i => ({
      product_id: i.productId,
      quantity:   i.quantity,
    }));

    // call our API route to create (and pay) the Woo order
    const res = await fetch(`/api/orders/${orderId}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ line_items }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Create order failed');

    // patch the local entry with the Woo ID, metadata, and start the timer
    const now = Date.now();
    updateEntry({
      ...entry,
      wooId:     data.id,
      meta_data: data.meta_data,
      status:    'processing',
      startTime: now,
      endTime:   now + entry.items.reduce((sum, it) => sum + it.quantity * 120000, 0),
    });

    // kick off our local countdown
    setStarted(true);
  } catch (err: any) {
    console.error('handlePayment error:', err);
    alert('Payment simulation failed: ' + (err.message || err));
  }
};


  const handleMarkReady = async () => {
    if (status !== 'processing' || !entry.wooId) return;
    const res = await fetch(`/api/orders/${orderId}/${entry.wooId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ready-to-pickup' }),
    });
    const data = await res.json();
    updateEntry({ ...entry, status: data.status, meta_data: data.meta_data });
    setStarted(false);
  };

  if (entry === undefined) {
    return <div>Loading...</div>;
  }
  if (entry === null) {
    return <div>Order not found.</div>;
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order {entry.wooId ?? entry.id}</h1>
      <p className="mb-2"><strong>Status:</strong> {status}</p>

      {status === 'pending' && !started && (
        <button onClick={handlePayment} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Simulate Payment
        </button>
      )}

      {(started || status === 'ready-to-pickup') && (
        <div className="w-32 h-32 mx-auto mb-4">
          <CircularProgressbar
            value={status === 'processing' ? progress : 100}
            text={status === 'processing' ? `${Math.round(progress)}%` : '100%'}
            styles={buildStyles({ pathColor: '#10b981', trailColor: '#e5e7eb' })}
          />
        </div>
      )}

      {status === 'processing' && (
        <button onClick={handleMarkReady} className="bg-green-600 text-white px-4 py-2 rounded mb-4">
          Mark Ready (Kitchen)
        </button>
      )}

      {qrPayload && (
        <div className="mb-4 text-center">
          <QRCode value={qrPayload} size={128} />
          <p className="mt-2"><strong>Locker:</strong> {lockerNumber}</p>
        </div>
      )}

      <ul className="border p-4 rounded bg-white">
        {entry.items.map(item => (
          <li key={item.productId} className="mb-2">
            {item.name} × {item.quantity} – {(item.price * item.quantity).toFixed(2)} MYR
          </li>
        ))}
      </ul>
    </div>
  );
}
