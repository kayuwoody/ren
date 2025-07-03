// 10. components/HeaderNav.tsx 
"use client"; 
import React, { useEffect, useState } from 'react'; 
import Link from 'next/link'; 
import { ShoppingCart, Clock } from 'lucide-react'; 
import { useCart } from '@/context/cartContext';

export default function HeaderNav() { 
const { cartItems } = useCart(); 
const [hasProcessing, setHasProcessing] = useState(false); 
const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

useEffect(() => { 
  const id = localStorage.getItem('currentOrderId'); setCurrentOrderId(id); 
  const clientId = localStorage.getItem('clientId') || ''; 
  fetch(/api/orders/processing?clientId=${clientId}) .then(r => r.json()) .then(o => setHasProcessing(!!o?.id)); }, []);

return ( <header className="w-full bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50"> 
  <nav className="flex items-center space-x-6"> 
    <Link href="/"> Home </Link> 
    <Link href="/products"> Products </Link> 
    <Link href="/orders"> Orders </Link> {cartItems.length > 0 && ( <Link href="/cart"> Cart ({cartItems.length}) </Link> )} {hasProcessing && currentOrderId && (      <Link href={/orders/${currentOrderId}}> ⏳ </Link> )} </nav> </header> ); }
