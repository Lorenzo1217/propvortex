'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Home } from 'lucide-react';

export function DashboardNav() {
  const pathname = usePathname();
  const showBilling = pathname === '/dashboard';

  return (
    <div className="hidden md:flex items-center space-x-1 ml-8">
      <Link 
        href="/dashboard" 
        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex items-center space-x-2"
      >
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      {showBilling && (
        <Link 
          href="/billing" 
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex items-center space-x-2"
        >
          <CreditCard className="h-4 w-4" />
          <span>Billing</span>
        </Link>
      )}
    </div>
  );
}