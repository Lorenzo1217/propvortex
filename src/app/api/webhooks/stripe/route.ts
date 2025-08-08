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
    console.log(`🔍 Webhook received: ${event.type}`);
    console.log(`🔍 Event ID: ${event.id}`);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

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
        console.log(`⚠️ Unhandled event type: ${event.type}`);
        console.log(`📋 Event data:`, JSON.stringify(event.data.object, null, 2));
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

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ Checkout session completed:', session.id);
  console.log('📧 Customer email:', session.customer_email);
  console.log('👤 Customer ID:', session.customer);
  console.log('📦 Subscription ID:', session.subscription);
  
  // Get metadata
  const clerkId = session.metadata?.clerkId;
  const plan = session.metadata?.plan;
  const email = session.metadata?.email || session.customer_email;
  
  console.log('🔍 Session metadata:', { clerkId, plan, email });
  
  if (!clerkId) {
    console.error('❌ No clerkId found in session metadata');
    return;
  }

  if (!email) {
    console.error('❌ No email found in session');
    return;
  }

  // Get the subscription details
  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;
  
  if (!subscriptionId || !customerId) {
    console.error('❌ Missing subscription or customer ID');
    return;
  }

  // Retrieve the subscription to get price details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
  
  console.log('💰 Price ID:', priceId);
  console.log('📅 Current period end:', currentPeriodEnd);
  
  // Determine project limit based on price ID
  const tier = pricingTiers.find(t => t.priceId === priceId);
  const projectLimit = tier?.projectLimit; // null for unlimited, number for limited
  
  console.log('🎯 Tier found:', tier?.name);
  console.log('📊 Project limit:', projectLimit);
  
  try {
    // Find or create the user
    let user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      console.log('👤 Creating new user in database');
      user = await db.user.create({
        data: {
          clerkId,
          email,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          stripePriceId: priceId,
          subscriptionStatus: 'active',
          currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : new Date(),
          projectLimit,
        },
      });
      console.log('✅ User created:', user.email);
    } else {
      console.log('👤 Updating existing user');
      await db.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          stripePriceId: priceId,
          subscriptionStatus: 'active',
          currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : new Date(),
          projectLimit,
        },
      });
      console.log('✅ User updated:', user.email);
    }
  } catch (error) {
    console.error('❌ Error handling checkout session:', error);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionItem = subscription.items.data[0];
  const priceId = subscriptionItem?.price.id;
  const currentPeriodEnd = subscriptionItem?.current_period_end;
  
  console.log('Subscription created:', {
    id: subscription.id,
    customer: customerId,
    status: subscription.status
  });
  
  // Get the clerk ID from subscription metadata
  const clerkId = (subscription.metadata?.clerkId || (subscription as any).metadata?.clerkId) as string;
  
  if (!clerkId) {
    console.error('No clerkId found in subscription metadata');
    return;
  }

  // Get customer details from Stripe
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  
  // Find or create the user
  let user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    // Create the user if they don't exist
    user = await db.user.create({
      data: {
        clerkId,
        email: customer.email || '',
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        subscriptionStatus: subscription.status,
        currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : new Date(),
        projectLimit: pricingTiers.find(t => t.priceId === priceId)?.projectLimit,
      },
    });
    console.log(`Created new user for subscription: ${user.email}`);
  } else {
    // Update existing user with subscription details
    await db.user.update({
      where: { id: user.id },
      data: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        subscriptionStatus: subscription.status,
        currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : new Date(),
        projectLimit: pricingTiers.find(t => t.priceId === priceId)?.projectLimit,
      },
    });
    console.log(`Updated user subscription: ${user.email}`);
  }
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
  const projectLimit = tier?.projectLimit; // null for unlimited, number for limited

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
  // Get subscription ID from invoice lines
  const subscriptionId = invoice.lines?.data?.[0]?.subscription as string | null;
  
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