import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserByClerkId } from './user-helpers';
import { pricingTiers } from '@/config/pricing';

export async function checkSubscription(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      currentPeriodEnd: true,
    },
  });

  if (!user) return false;

  const isActive = user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing';
  const isPeriodValid = user.currentPeriodEnd ? user.currentPeriodEnd > new Date() : false;

  return isActive && isPeriodValid;
}

export async function getSubscriptionStatus(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      currentPeriodEnd: true,
      stripePriceId: true,
      projectLimit: true,
      _count: {
        select: {
          projects: true,
        },
      },
    },
  });

  if (!user) return null;

  // Find the plan name based on price ID
  const plan = pricingTiers.find(tier => tier.priceId === user.stripePriceId);
  const planName = plan?.name || 'Free';

  return {
    status: user.subscriptionStatus || 'inactive',
    currentPeriodEnd: user.currentPeriodEnd,
    planName,
    projectLimit: user.projectLimit,
    projectCount: user._count.projects,
    isActive: user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing',
  };
}

export async function canCreateProject(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      projectLimit: true,
      _count: {
        select: {
          projects: true,
        },
      },
    },
  });

  if (!user) return false;

  // If projectLimit is null, it means unlimited projects
  if (user.projectLimit === null) return true;

  // Otherwise check if they're under the limit
  return user._count.projects < user.projectLimit;
}

export async function requireSubscription() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/login');
  }

  const dbUser = await getUserByClerkId(user.id);
  
  if (!dbUser) {
    redirect('/login');
  }

  const hasSubscription = await checkSubscription(dbUser.id);
  
  if (!hasSubscription) {
    redirect('/subscription/setup');
  }

  return dbUser;
}