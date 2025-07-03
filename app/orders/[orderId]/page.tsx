// 9. app/orders/[orderId]/page.tsx (detail) 
"use client"; 
import React, { useEffect, useState } from 'react'; 
import { useRouter } from 'next/navigation'; 
import QRCode from 'react-qr-code'; 
import { CircularProgressbar } from 'react-circular-progressbar'; 
import 'react-circular-progressbar/dist/styles.css';

export default function OrderDetailPage({ params }: any) { const orderId = params.orderId; const [order, setOrder] = useState(null); const [progress, setProgress] = useState(0);

const start = Number(localStorage.getItem('startTime')); const end   = Number(localStorage.getItem('endTime'));

useEffect(() => { const fetchOrder = async () => { try { const res = await fetch(/api/orders/${orderId}); const data = await res.json(); setOrder(data); } catch (_){/.../} }; fetchOrder(); const iv = setInterval(fetchOrder, 10000); return () => clearInterval(iv); }, [orderId]);

useEffect(() => { if (order?.status === 'processing') { const tick = () => { const now = Date.now(); const pct = Math.min(1,(now-start)/(end-start)); setProgress(pct*100); }; tick(); const iv = setInterval(tick,1000); return () => clearInterval(iv); } else if (order?.status==='ready-to-pickup') { setProgress(100); } }, [order]);

if (!order) return Loading…;

return (  Order {order.id} <div style={{width:100,height:100,margin:'auto'}}> <CircularProgressbar value={progress} text={${Math.round(progress)}%} />  Status: {order.status} {order.status==='ready-to-pickup' && (  <QRCode value={order.meta_data.find(m=>m.key==='qr_payload')?.value || ''} /> Locker: {order.meta_data.find(m=>m.key==='locker_number')?.value}  )}  ); }
