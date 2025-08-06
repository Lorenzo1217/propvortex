import { createCheckoutSession } from '@/lib/actions/stripe';
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan } = body;

    if (!plan) {
      return Response.json({ error: 'No plan provided' }, { status: 400 });
    }

    const checkoutUrl = await createCheckoutSession(plan);
    
    if (!checkoutUrl) {
      throw new Error('Failed to create checkout session');
    }

    return Response.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Checkout session error:', error);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}