// src/app/(auth)/signup/[[...rest]]/page.tsx
'use client';

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { pricingTiers } from "@/config/pricing";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get('plan')?.toLowerCase();
  
  // Redirect to pricing if no plan is selected
  useEffect(() => {
    if (!plan || (plan !== 'professional' && plan !== 'unlimited')) {
      router.push('/pricing');
      return;
    }
    
    // Store plan in sessionStorage for OAuth flow
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedPlan', plan);
    }
  }, [plan, router]);

  // Get the selected pricing tier
  const selectedTier = pricingTiers.find(
    tier => tier.name.toLowerCase() === plan
  );

  if (!selectedTier) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="mb-8">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="font-bold text-2xl">PropVortex</span>
        </Link>
      </div>
      
      {/* Plan details */}
      <div className="mb-6 text-center">
        <Badge variant="secondary" className="mb-4">
          {selectedTier.name} Plan - ${selectedTier.price}/month
        </Badge>
        <h1 className="text-2xl font-bold mb-2">Start your free trial</h1>
        <p className="text-gray-600">Create your builder account in seconds</p>
        <p className="text-sm text-gray-500 mt-2">
          30-day free trial • Cancel anytime • Payment starts after trial
        </p>
      </div>
      
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            card: "shadow-lg",
          },
        }}
        unsafeMetadata={{
          plan: plan
        }}
        fallbackRedirectUrl={`/subscription/setup`}
        forceRedirectUrl={`/subscription/setup`}
      />
      
      <p className="mt-6 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
          Sign in
        </Link>
      </p>
      
      <p className="mt-2 text-sm text-gray-500">
        <Link href="/pricing" className="hover:text-gray-700">
          ← Choose a different plan
        </Link>
      </p>
    </div>
  );
}