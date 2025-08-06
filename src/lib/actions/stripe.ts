'use server';

import { stripe } from '@/lib/stripe';
import { pricingTiers } from '@/config/pricing';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function createCheckoutSession(plan?: string) {
  const user = await currentUser();
  
  if (!user || !user.emailAddresses[0]?.emailAddress) {
    throw new Error('User not authenticated');
  }

  const email = user.emailAddresses[0].emailAddress;
  
  // Debug logging
  console.log('🔍 Plan from form:', plan);
  console.log('🔍 Available tiers:', pricingTiers.map(t => ({ name: t.name, priceId: t.priceId })));
  
  // Default to professional plan if no plan provided
  const planName = plan || 'professional';
  console.log('🔍 Plan name being used:', planName);
  
  // Make tier matching case-insensitive
  const selectedTier = pricingTiers.find(
    tier => tier.name.toLowerCase() === planName?.toLowerCase()
  );

  // Check if tier was found
  if (!selectedTier) {
    console.error('❌ No tier found for plan:', plan);
    console.error('❌ Available tier names:', pricingTiers.map(t => t.name));
    throw new Error(`Invalid plan selected: ${plan}`);
  }

  if (!selectedTier.priceId) {
    console.error('❌ Selected tier has no price ID:', selectedTier);
    throw new Error('Selected tier has no price ID');
  }

  // Log what we're sending to Stripe
  console.log('✅ Sending to Stripe - Plan:', selectedTier.name, 'Price ID:', selectedTier.priceId);

  // Check if user exists in database
  let dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  // Create user in database if they don't exist (edge case for OAuth users)
  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        clerkId: user.id,
        email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      },
    });
  }

  // Check if user already has an active subscription
  if (dbUser.subscriptionStatus === 'active' || dbUser.subscriptionStatus === 'trialing') {
    // Return the dashboard URL if they already have a subscription
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`;
  }

  let customerId = dbUser.stripeCustomerId;

  // Create a new Stripe customer if needed
  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || email,
      metadata: {
        clerkId: user.id,
      },
    });
    
    customerId = customer.id;

    // Save the customer ID to the database
    await db.user.update({
      where: { id: dbUser.id },
      data: { stripeCustomerId: customerId },
    });
  }

  // Log the exact price ID being sent to Stripe
  console.log('🎯 Creating Stripe checkout session with:');
  console.log('   - Customer ID:', customerId);
  console.log('   - Price ID:', selectedTier.priceId);
  console.log('   - Plan name:', selectedTier.name);
  
  // Create checkout session with 30-day trial
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
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
    },
  });
  
  console.log('✅ Checkout session created:', session.id);

  // Update the user's project limit immediately based on the selected plan
  // This ensures correct limits even if the webhook fails
  const projectLimit = selectedTier.name.toLowerCase() === 'unlimited' ? null : (selectedTier.projectLimit || 10);
  
  await db.user.update({
    where: { id: dbUser.id },
    data: { 
      projectLimit: projectLimit,
      // Also update the price ID to track which plan they're subscribing to
      stripePriceId: selectedTier.priceId,
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