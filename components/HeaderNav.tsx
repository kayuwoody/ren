// 10. components/HeaderNav.tsx 
"use client"; 
import React, { useEffect, useState } from 'react'; 
import Link from 'next/link'; 
import { ShoppingCart, Clock } from 'lucide-react'; 
import { useCart } from '@/context/cartContext';

export default function HeaderNav() { const { cartItems } = useCart(); const [hasProcessing, setHasProcessing] = useState(false); const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

useEffect(() => { const id = localStorage.getItem('currentOrderId'); setCurrentOrderId(id); const clientId = localStorage.getItem('clientId') || ''; fetch(/api/orders/processing?clientId=${clientId}) .then(r=>r.json()) .then(o=> setHasProcessing(!!o?.id)); }, []);

return (   Home Products Orders {cartItems.length>0 && ({cartItems.length})}  {hasProcessing && currentOrderId && ( <Link href={/orders/${currentOrderId}}> )}  ); }



