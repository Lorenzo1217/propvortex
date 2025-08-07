import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUserInDatabase } from "@/lib/user-helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle } from "lucide-react";
import { createCheckoutSession } from "@/lib/actions/stripe";
import { pricingTiers } from "@/config/pricing";
import { getSubscriptionStatus } from "@/lib/subscription";
import Link from "next/link";
import { db } from "@/lib/db";

// Move handleContinueToPayment outside component
async function handleContinueToPayment(formData: FormData) {
  'use server';
  
  const plan = formData.get('plan') as string;
  
  let checkoutUrl: string | null = null;
  
  try {
    checkoutUrl = await createCheckoutSession(plan);
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    redirect('/dashboard?error=checkout_failed');
  }
  
  if (checkoutUrl) {
    redirect(checkoutUrl);
  } else {
    redirect('/dashboard?error=no_checkout_url');
  }
}

export default async function SubscriptionSetupPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/login");
  }

  let dbUser;
  try {
    dbUser = await ensureUserInDatabase(user);
  } catch (error) {
    console.error('Error ensuring user in database:', error);
    // Fallback: try to get user by clerk ID
    const existingUser = await db.user.findUnique({
      where: { clerkId: user.id }
    });
    if (existingUser) {
      dbUser = existingUser;
    } else {
      throw error;
    }
  }
  
  // Clear any incomplete Stripe data so users can switch plans freely
  if (dbUser && dbUser.stripeCustomerId && dbUser.subscriptionStatus !== 'active' && dbUser.subscriptionStatus !== 'trialing') {
    await db.user.update({
      where: { id: dbUser.id },
      data: { 
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null
      }
    });
    // Refresh the user data
    dbUser = await db.user.findUnique({
      where: { clerkId: user.id }
    });
  }
  
  // Get subscription status
  const subscriptionStatus = dbUser ? await getSubscriptionStatus(dbUser.id) : null;
  
  // Check if user has an active subscription
  const hasActiveSubscription = subscriptionStatus?.isActive || false;

  // Get the plan from user metadata or default to professional
  const plan = (user.unsafeMetadata?.plan as string) || 'professional';
  
  const selectedTier = pricingTiers.find(
    tier => tier.name.toLowerCase() === plan.toLowerCase()
  ) || pricingTiers[0]; // Default to first tier if not found

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        {hasActiveSubscription && subscriptionStatus ? (
          // Show current subscription status
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Subscription Active</CardTitle>
              <CardDescription>
                You have an active subscription to PropVortex.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Current Plan</p>
                <div className="flex items-center justify-center space-x-2">
                  <Badge variant="default" className="text-lg py-1 px-3">
                    {subscriptionStatus.planName}
                  </Badge>
                  <span className="text-2xl font-bold">
                    ${pricingTiers.find(t => t.name === subscriptionStatus.planName)?.price || 0}/mo
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {subscriptionStatus.projectLimit 
                    ? `${subscriptionStatus.projectCount}/${subscriptionStatus.projectLimit} projects used`
                    : `${subscriptionStatus.projectCount} projects (Unlimited)`
                  }
                </p>
              </div>

              {subscriptionStatus.currentPeriodEnd && (
                <div className="bg-green-50 rounded-lg p-4 text-sm text-green-800">
                  <p className="font-medium">
                    {subscriptionStatus.status === 'trialing' ? 'Trial ends' : 'Renews'} on{' '}
                    {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              )}

              <Button asChild className="w-full" size="lg">
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            </CardContent>
          </>
        ) : (
          // Show subscription setup flow
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Complete Your Subscription Setup</CardTitle>
              <CardDescription>
                You're almost there! Complete your payment setup to start using PropVortex.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Selected Plan</p>
                <div className="flex items-center justify-center space-x-2">
                  <Badge variant="secondary" className="text-lg py-1 px-3">
                    {selectedTier.name}
                  </Badge>
                  <span className="text-2xl font-bold">${selectedTier.price}/mo</span>
                </div>
                <p className="text-sm text-gray-500">
                  {selectedTier.projectLimit 
                    ? `Up to ${selectedTier.projectLimit} projects`
                    : 'Unlimited projects'
                  }
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">✨ 30-Day Free Trial</p>
                <p>No charges today. Cancel anytime during your trial.</p>
              </div>

              <form>
                <input type="hidden" name="plan" value={plan} />
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  formAction={handleContinueToPayment}
                >
                  Continue to Payment
                </Button>
              </form>

              <p className="text-xs text-center text-gray-500 mt-4">
                By continuing, you agree to our terms of service and privacy policy.
                Your payment information is securely processed by Stripe.
              </p>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}