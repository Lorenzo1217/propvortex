'use server';

import { stripe } from '@/lib/stripe';
import { pricingTiers } from '@/config/pricing';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function createCheckoutSession(plan?: string) {
  const user = await currentUser();
  
  if (!user || !user.emailAddresses[0]?.emailAddress) {
    throw new Error('User not authenticated');
  }

  const email = user.emailAddresses[0].emailAddress;
  
  // Default to professional plan if no plan provided
  const planName = plan || 'professional';
  
  // Make tier matching case-insensitive
  const selectedTier = pricingTiers.find(
    tier => tier.name.toLowerCase() === planName?.toLowerCase()
  );

  // Check if tier was found
  if (!selectedTier) {
    throw new Error(`Invalid plan selected: ${plan}`);
  }

  if (!selectedTier.priceId) {
    throw new Error('Selected tier has no price ID');
  }

  // Update user's metadata with the current plan selection
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.id, {
      unsafeMetadata: {
        plan: planName
      }
    });
  } catch (error) {
    // Continue with checkout even if metadata update fails
    console.error('Failed to update user metadata:', error);
  }

  // Check if user already has an active subscription
  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  if (dbUser?.subscriptionStatus === 'active' || dbUser?.subscriptionStatus === 'trialing') {
    // Return the dashboard URL if they already have a subscription
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`;
  }

  // Create checkout session with 30-day trial
  // Let Stripe create the customer during checkout
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price: selectedTier.priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 30,
      metadata: {
        clerkId: user.id,
        plan: selectedTier.name,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?welcome=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
    metadata: {
      clerkId: user.id,
      plan: selectedTier.name,
      email: email,
    },
  });

  return session.url;
}

export async function createBillingPortalSession() {
  const user = await currentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get user from database
  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser || !dbUser.stripeCustomerId) {
    throw new Error('No Stripe customer found for user');
  }

  // Create a billing portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/billing`,
  });

  return session.url;
}