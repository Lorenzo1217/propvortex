export interface PricingTier {
  name: string;
  price: number;
  priceId: string;
  projectLimit: number | null;
  features: string[];
}

// Debug: Log environment variables
console.log('🔍 Pricing Config - Environment Variables:');
console.log('   PROFESSIONAL env var:', process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL);
console.log('   UNLIMITED env var:', process.env.NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED);

export const pricingTiers: PricingTier[] = [
  {
    name: 'Professional',
    price: 149,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL || 'price_1RsbLkLO1XPbZ99QlgjkdBpE',
    projectLimit: 10,
    features: [
      'Up to 10 active projects',
      'Unlimited reports',
      'Photo uploads',
      'Weather integration',
      'Client access portal',
      'Email support',
    ],
  },
  {
    name: 'Unlimited',
    price: 349,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED || 'price_1RsbOELO1XPbZ99QaAHLJY3F',
    projectLimit: null,
    features: [
      'Unlimited projects',
      'Unlimited reports',
      'Photo uploads',
      'Weather integration',
      'Client access portal',
      'Priority email support',
      'Advanced analytics',
      'Custom branding',
    ],
  },
];

// Debug: Log the final pricing tiers
console.log('🔍 Final pricing tiers:', pricingTiers.map(t => ({ 
  name: t.name, 
  price: t.price,
  priceId: t.priceId 
})));

export const getPricingTierByPriceId = (priceId: string | null): PricingTier | null => {
  if (!priceId) return null;
  return pricingTiers.find(tier => tier.priceId === priceId) || null;
};