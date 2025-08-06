import { createCheckoutSession } from '@/lib/actions/stripe';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let plan = searchParams.get('plan');

  // If no plan in URL, check user metadata or session storage
  if (!plan) {
    try {
      // Check if plan is in user metadata (for OAuth signups)
      const user = await currentUser();
      if (user?.unsafeMetadata?.plan) {
        plan = user.unsafeMetadata.plan as string;
      }
    } catch (error) {
      console.error('Error checking user metadata:', error);
    }
  }

  if (!plan) {
    return redirect('/pricing');
  }

  try {
    const checkoutUrl = await createCheckoutSession(plan);
    
    if (!checkoutUrl) {
      throw new Error('Failed to create checkout session');
    }

    return redirect(checkoutUrl);
  } catch (error) {
    console.error('Checkout session error:', error);
    // Redirect to dashboard with error message
    return redirect('/dashboard?error=checkout_failed');
  }
}