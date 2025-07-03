// 8. app/orders/page.tsx (list) "use client"; import React, { useEffect, useState } from 'react'; import Link from 'next/link';

export default function OrdersPage() { const [orders, setOrders] = useState<any[]>([]); const clientId = localStorage.getItem('clientId') || '';

useEffect(() => { fetch('/api/orders') .then(res => res.json()) .then(all => { // filter/sort const mine = all.filter(o => o.meta_data.some(m=>m.key==='clientId'&&m.value===clientId)); const processing = mine.filter(o=>o.status==='processing'); const rest = all .filter(o=>!(processing.some(p=>p.id===o.id))) .sort((a,b)=> new Date(b.date_created).getTime() - new Date(a.date_created).getTime()); setOrders([...processing, ...rest]); }); }, []);

return (  All Orders {orders.length===0 ? ( No orders yet. ) : (  {orders.map(o => ( <li key={o.id} className={p-2 rounded ${o.status==='processing'?'bg-yellow-100':'bg-gray-100'}}> <Link href={/orders/${o.id}}>Order {o.id} — {o.status}  ))}  )}  ); }

