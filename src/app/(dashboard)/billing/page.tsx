import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUserInDatabase } from "@/lib/user-helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createBillingPortalSession } from "@/lib/actions/stripe";
import { getPricingTierByPriceId } from "@/config/pricing";
import { CalendarDays, CreditCard, Package } from "lucide-react";

export default async function BillingPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/login");
  }

  const dbUser = await ensureUserInDatabase(user);
  
  // Get pricing tier information
  const currentTier = getPricingTierByPriceId(dbUser.stripePriceId);
  
  // Format subscription status
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-100 text-yellow-800">Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-gray-100 text-gray-800">Canceled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">No Subscription</Badge>;
    }
  };

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  async function handleManageBilling() {
    'use server';
    
    try {
      const portalUrl = await createBillingPortalSession();
      if (portalUrl) {
        redirect(portalUrl);
      }
    } catch (error) {
      console.error('Failed to create billing portal session:', error);
      redirect('/dashboard?error=billing_portal_failed');
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-gray-600 mt-2">Manage your subscription and billing information</p>
      </div>

      <div className="grid gap-6">
        {/* Current Plan Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-gray-500" />
                <CardTitle>Current Plan</CardTitle>
              </div>
              {getStatusBadge(dbUser.subscriptionStatus)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {currentTier?.name || 'No Plan'}
                </p>
                {currentTier && (
                  <p className="text-gray-600">
                    ${currentTier.price}/month
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Project Limit</p>
                <p className="text-xl font-semibold">
                  {dbUser.projectLimit === null ? 'Unlimited' : dbUser.projectLimit}
                </p>
              </div>
            </div>

            {currentTier && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Plan Features:</p>
                <ul className="space-y-1">
                  {currentTier.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Billing Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-gray-500" />
              <CardTitle>Billing Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Next Billing Date</p>
                <p className="font-medium">
                  {formatDate(dbUser.currentPeriodEnd)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer Since</p>
                <p className="font-medium">
                  {formatDate(dbUser.createdAt)}
                </p>
              </div>
            </div>

            {dbUser.subscriptionStatus === 'trialing' && dbUser.currentPeriodEnd && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Your trial ends on {formatDate(dbUser.currentPeriodEnd)}. 
                  Add a payment method to continue using PropVortex after your trial.
                </p>
              </div>
            )}

            {dbUser.subscriptionStatus === 'past_due' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Your subscription payment is past due. Please update your payment method to continue using PropVortex.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <CardTitle>Billing Actions</CardTitle>
            </div>
            <CardDescription>
              Manage your subscription, payment methods, and billing history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleManageBilling}>
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Manage Billing in Stripe
              </Button>
            </form>
            <p className="text-sm text-gray-500 mt-3">
              You'll be redirected to our secure billing portal powered by Stripe
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}