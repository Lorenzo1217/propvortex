'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Home, Building2 } from 'lucide-react';
import { useBrand } from '@/components/providers/brand-provider';

export function DashboardNav() {
  const pathname = usePathname();
  const showBilling = pathname === '/dashboard';
  const { company } = useBrand();

  const linkClass = (isActive: boolean) => {
    const base = "px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors";
    if (isActive) {
      return `${base} bg-brand-accent text-white`;
    }
    return `${base} text-gray-700 hover:text-gray-900 hover:bg-gray-100`;
  };

  return (
    <div className="hidden md:flex items-center space-x-1 ml-8">
      <Link 
        href="/dashboard" 
        className={linkClass(pathname === '/dashboard')}
      >
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      <Link 
        href="/projects" 
        className={linkClass(pathname.startsWith('/projects'))}
      >
        <Building2 className="h-4 w-4" />
        <span>Projects</span>
      </Link>
      <Link 
        href="/company/settings" 
        className={linkClass(pathname.startsWith('/company'))}
      >
        <Building2 className="h-4 w-4" />
        <span>Company</span>
      </Link>
      {showBilling && (
        <Link 
          href="/billing" 
          className={linkClass(pathname === '/billing')}
        >
          <CreditCard className="h-4 w-4" />
          <span>Billing</span>
        </Link>
      )}
    </div>
  );
}