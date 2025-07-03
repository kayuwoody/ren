// app/checkout/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cartContext';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  const handleConfirm = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Merge cart into local order history
    const history: any[] = JSON.parse(localStorage.getItem('ordersHistory') || '[]');
    let current = history.find(o => o.status === 'processing');
    if (!current) {
      const ts = Date.now();
      current = { id: String(ts), items: [], status: 'processing', createdAt: ts, updatedAt: ts };
      history.unshift(current);
    }
    // Merge items into current order
    cartItems.forEach(ci => {
      const exist = current.items.find((i: any) => i.productId === ci.productId);
      if (exist) {
        exist.quantity += ci.quantity;
      } else {
        current.items.push({ ...ci });
      }
    });
    // Update timestamps for timer
    const now = Date.now();
    current.startTime = now;
    const duration = current.items.reduce((sum: number, i: any) => sum + i.quantity * 120000, 0);
    current.endTime = now + duration;
    current.updatedAt = now;

    // Persist local history before Woo call
    localStorage.setItem('ordersHistory', JSON.stringify(history));

    // Prepare Woo payload
    const line_items = current.items.map((i: any) => ({ product_id: i.productId, quantity: i.quantity }));

    try {
      let data: any;
      if (current.wooId) {
        // Update existing WooCommerce order
        const res = await fetch(`/api/update-order/${current.wooId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line_items }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update order failed');
      } else {
        // Create new WooCommerce order
        const res = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line_items }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Create order failed');
      }

      // Persist Woo data in local history
      current.wooId = data.id;
      current.meta_data = data.meta_data;
      current.status = data.status;
      history[0] = current;
      localStorage.setItem('ordersHistory', JSON.stringify(history));

      // Clear cart and navigate to the Woo order detail
      clearCart();
      router.push(`/orders/${data.id}`);
    } catch (err: any) {
      console.error('Error handling Woo order:', err);
      alert('Unable to submit order; please try again.');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <ul className="mb-4">
        {cartItems.map(item => (
          <li key={item.productId} className="flex justify-between py-1">
            <span>{item.name} × {item.quantity}</span>
            <span>{(item.price * item.quantity).toFixed(2)} MYR</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleConfirm}
        disabled={cartItems.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Confirm &amp; Place Order
      </button>
    </div>
  );
}
