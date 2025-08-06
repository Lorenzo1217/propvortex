import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { pricingTiers } from '@/config/pricing';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionItem = subscription.items.data[0];
  const priceId = subscriptionItem?.price.id;
  const currentPeriodEnd = subscriptionItem?.current_period_end;
  
  // Debug subscription data
  console.log('Subscription data:', {
    id: subscription.id,
    current_period_end: currentPeriodEnd,
    status: subscription.status
  });
  
  // Find the user by Stripe customer ID
  const user = await db.user.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Determine project limit based on price ID
  const tier = pricingTiers.find(t => t.priceId === priceId);
  const projectLimit = tier?.projectLimit ?? 10; // Default to 10 if not found

  // Update user with subscription details
  await db.user.update({
    where: { id: user.id },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : new Date(),
      projectLimit: projectLimit,
    },
  });

  console.log(`Subscription created for user ${user.email}: ${subscription.id}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionItem = subscription.items.data[0];
  const priceId = subscriptionItem?.price.id;
  const currentPeriodEnd = subscriptionItem?.current_period_end;
  
  // Debug subscription data
  console.log('Subscription update data:', {
    id: subscription.id,
    current_period_end: currentPeriodEnd,
    status: subscription.status
  });
  
  const user = await db.user.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Determine project limit based on price ID
  const tier = pricingTiers.find(t => t.priceId === priceId);
  const projectLimit = tier?.projectLimit ?? 10;

  await db.user.update({
    where: { id: user.id },
    data: {
      stripePriceId: priceId,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : new Date(),
      projectLimit: projectLimit,
    },
  });

  console.log(`Subscription updated for user ${user.email}: ${subscription.id}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  const user = await db.user.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'canceled',
      // Optionally reset to free tier limits
      projectLimit: 1, // Or whatever your free tier limit is
    },
  });

  console.log(`Subscription canceled for user ${user.email}: ${subscription.id}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string | undefined;
  
  console.log(`Payment succeeded for customer ${customerId}, subscription ${subscriptionId || 'one-time'}`);
  
  // Log successful payment
  const user = await db.user.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (user) {
    console.log(`Payment of ${invoice.amount_paid / 100} ${invoice.currency} succeeded for ${user.email}`);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  const user = await db.user.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'past_due',
    },
  });

  console.log(`Payment failed for user ${user.email}, marked as past_due`);
}