// app/orders/[orderId]/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  startTime: number;
  endTime: number;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const [order, setOrder] = useState<Order | null>(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Load the order from history and start countdown
  useEffect(() => {
    if (!orderId) return;
    const history: Order[] = JSON.parse(localStorage.getItem('ordersHistory') || '[]');
    const found = history.find(o => o.id === orderId) || null;
    if (!found) return setOrder(null);

    setOrder(found);
    // If already completed or time has elapsed, mark complete immediately
    if (found.completed || Date.now() >= found.endTime) {
      // Update history to ensure completed flag persists
      const idx = history.findIndex(o => o.id === orderId);
      if (idx > -1) {
        history[idx].completed = true;
        history[idx].completedAt = Date.now();
        localStorage.setItem('ordersHistory', JSON.stringify(history));
        // Clear active markers
        localStorage.removeItem('currentOrderId');
        localStorage.removeItem('currentOrderStartTime');
        localStorage.removeItem('currentOrderEndTime');
        localStorage.removeItem('currentLocker');
      }
      setProgress(100);
      setCompleted(true);
      return;
    }

    // Otherwise drive a live countdown
    const tick = () => {
      const now = Date.now();
      const pct = Math.min(
        100,
        Math.max(0, ((now - found.startTime) / (found.endTime - found.startTime)) * 100)
      );
      setProgress(pct);
      if (pct >= 100) {
        // Mark complete when we hit 100%
        const h2: Order[] = JSON.parse(localStorage.getItem('ordersHistory') || '[]');
        const i2 = h2.findIndex(o => o.id === orderId);
        if (i2 > -1) {
          h2[i2].completed = true;
          h2[i2].completedAt = Date.now();
          localStorage.setItem('ordersHistory', JSON.stringify(h2));
          localStorage.removeItem('currentOrderId');
          localStorage.removeItem('currentOrderStartTime');
          localStorage.removeItem('currentOrderEndTime');
          localStorage.removeItem('currentLocker');
        }
        setCompleted(true);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleMarkComplete = () => {
    if (!order) return;
    const history: Order[] = JSON.parse(localStorage.getItem('ordersHistory') || '[]');
    const idx = history.findIndex(o => o.id === order.id);
    if (idx > -1) {
      history[idx].completed = true;
      history[idx].completedAt = Date.now();
      localStorage.setItem('ordersHistory', JSON.stringify(history));
      localStorage.removeItem('currentOrderId');
      localStorage.removeItem('currentOrderStartTime');
      localStorage.removeItem('currentOrderEndTime');
      localStorage.removeItem('currentLocker');
      setCompleted(true);
      setProgress(100);
    }
  };

  if (order === null) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <p>Order not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="w-32 h-32 mx-auto mb-4">
        <CircularProgressbar
          value={progress}
          text={order.id}
          styles={buildStyles({
            pathColor: '#10b981',
            trailColor: '#e5e7eb',
          })}
        />
      </div>
      <p className="mb-4 text-center">
        Locker: {localStorage.getItem('currentLocker') || 'N/A'}
      </p>
      <ul className="mb-4">
        {order.items.map(item => (
          <li key={item.productId} className="mb-2">
            {item.name} × {item.quantity} – {(item.price * item.quantity).toFixed(2)} MYR
          </li>
        ))}
      </ul>
      {!completed ? (
        <button
          onClick={handleMarkComplete}
          className="bg-green-600 text-white px-4 py-2 rounded block mx-auto"
        >
          Mark Complete (Kitchen)
        </button>
      ) : (
        <p className="text-center text-green-700 font-semibold">✅ This order is complete.</p>
      )}
    </div>
  );
}
