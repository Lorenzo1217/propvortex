export interface PricingTier {
  name: string;
  price: number;
  priceId: string;
  projectLimit: number | null;
  features: string[];
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Professional',
    price: 149,
    priceId: 'price_1RsbLkLO1XPbZ99QlgjkdBpE',
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
    priceId: 'price_1RsbOELO1XPbZ99QaAHLJY3F',
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

export const getPricingTierByPriceId = (priceId: string | null): PricingTier | null => {
  if (!priceId) return null;
  return pricingTiers.find(tier => tier.priceId === priceId) || null;
};