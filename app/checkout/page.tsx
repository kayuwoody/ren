// 7. app/checkout/page.tsx (patched) "use client"; import React from 'react'; import { useCart } from '@/context/cartContext'; import { useRouter } from 'next/navigation';

export default function CheckoutPage() { const { cartItems, clearCart } = useCart(); const router = useRouter();

const handleConfirm = async () => { let clientId = localStorage.getItem('clientId'); if (!clientId) { clientId = crypto.randomUUID(); localStorage.setItem('clientId', clientId); } const processingRes = await fetch( /api/orders/processing?clientId=${clientId} ); const existing = await processingRes.json();

const transformed = cartItems.map(i => ({
  product_id: i.id,
  quantity: i.quantity,
}));

let wooOrder;
if (existing && existing.id) {
  const upd = await fetch(`/api/update-order/${existing.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ line_items: transformed }),
  });
  wooOrder = await upd.json();
} else {
  const crt = await fetch(`/api/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      line_items: transformed,
      set_paid: true,
      meta_data: [{ key: 'clientId', value: clientId }],
    }),
  });
  wooOrder = await crt.json();
}

localStorage.setItem('currentOrderId', String(wooOrder.id));
const start = Date.now();
const total = cartItems.reduce((s, i) => s + i.quantity, 0);
localStorage.setItem('startTime', String(start));
localStorage.setItem(
  'endTime',
  String(start + total * 2 * 60 * 1000)
);

clearCart();
router.push(`/orders/${wooOrder.id}`);

};

return (  Checkout  {cartItems.map(item => (  {item.name} ×{item.quantity} ${(item.price * item.quantity).toFixed(2)}  ))}  <button onClick={handleConfirm} disabled={cartItems.length === 0} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50" > {cartItems.length === 0 ? 'Cart is empty' : 'Confirm & Pay'}   ); }

