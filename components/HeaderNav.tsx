// components/HeaderNav.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/cartContext';
import { Home, Grid as GridIcon, Box, Clock, ShoppingCart } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function HeaderNav() {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [currentOrderPath, setCurrentOrderPath] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    function updateOrderInfo() {  
      const historyJson = localStorage.getItem('ordersHistory') || '[]';
      const history: any[] = JSON.parse(historyJson);
      const active = history.find(o => o.status === 'processing');
      if (active) {
        const id = active.wooId ?? active.id;
        setCurrentOrderPath(`/orders/${id}`);
        const now = Date.now();
        const start = active.startTime;
        const end = active.endTime;
        if (start && end) {
          const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
          setProgress(pct);
        } else {
          setProgress(0);
        }
      } else {
        setCurrentOrderPath(null);
        setProgress(0);
      }
    }
    updateOrderInfo();
    const iv = setInterval(updateOrderInfo, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <header className="w-full bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center text-gray-800 hover:text-gray-600">
          <Home className="w-6 h-6" />
          <span className="ml-2 font-semibold">Home</span>
        </Link>
        <Link href="/products" className="flex items-center text-gray-800 hover:text-gray-600">
          <GridIcon className="w-6 h-6" />
          <span className="ml-2 font-semibold">Products</span>
        </Link>
        <Link href="/orders" className="flex items-center text-gray-800 hover:text-gray-600">
         <Box className="w-6 h-6" />
          <span className="ml-2 font-semibold">Orders</span>
        </Link>
        <Link href="/cart" className="relative flex items-center text-gray-800 hover:text-gray-600">
          <ShoppingCart className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="ml-2 font-semibold">Cart</span>
        </Link>
      </div>
     {/* Clock icon linking to the current in-progress order */}
      {currentOrderPath && (
        <div className="relative w-8 h-8">
          <CircularProgressbar
            value={progress}
            strokeWidth={8}
            styles={buildStyles({ pathColor: '#10b981', trailColor: '#e5e7eb' })}
          />
          <Link href={currentOrderPath} className="absolute inset-0 flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-700" />
          </Link>
        </div>
              )}
    </header>
  );
}
