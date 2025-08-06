'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

export default function OAuthCheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCheckout() {
      // Get plan from sessionStorage (set during signup)
      const plan = sessionStorage.getItem('selectedPlan');
      
      if (!plan) {
        router.push('/pricing');
        return;
      }

      try {
        // Call the checkout API
        const response = await fetch('/api/stripe/checkout-oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan }),
        });

        const data = await response.json();

        if (data.url) {
          // Clear the plan from sessionStorage
          sessionStorage.removeItem('selectedPlan');
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL received');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        router.push('/dashboard?error=checkout_failed');
      }
    }

    handleCheckout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <h2 className="text-xl font-semibold">Setting up your subscription...</h2>
            <p className="text-gray-600 text-center">
              Please wait while we redirect you to complete your payment setup.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}