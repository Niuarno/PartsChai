// Payment Gateway Configuration
// This file contains all payment gateway settings that can be easily updated

export interface PaymentGatewayConfig {
  name: string;
  displayName: string;
  isActive: boolean;
  apiEndpoint: string;
  apiKey: string;
  apiSecret: string;
  redirectUrl: string;
  webhookUrl: string;
  currency: string;
  locale: string;
}

// UddoktaPay Configuration
// Update these values with your actual UddoktaPay credentials
export const uddoktaPayConfig: PaymentGatewayConfig = {
  name: 'uddoktapay',
  displayName: 'UddoktaPay',
  isActive: true,
  // Sandbox URL: https://sandbox.uddoktapay.com
  // Production URL: https://payment.uddoktapay.com
  apiEndpoint: process.env.UDDOKTAPAY_API_ENDPOINT || 'https://sandbox.uddoktapay.com/api',
  apiKey: process.env.UDDOKTAPAY_API_KEY || 'your-api-key-here',
  apiSecret: process.env.UDDOKTAPAY_API_SECRET || 'your-api-secret-here',
  redirectUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  webhookUrl: process.env.UDDOKTAPAY_WEBHOOK_URL || '',
  currency: 'BDT',
  locale: 'bn',
};

// Payment Gateway Factory
// This allows easy addition of more payment gateways in the future
export const paymentGateways: Record<string, PaymentGatewayConfig> = {
  uddoktapay: uddoktaPayConfig,
  // Add more gateways here in the future:
  // sslcommerz: sslCommerzConfig,
  // bkash: bkashConfig,
  // nagad: nagadConfig,
  // stripe: stripeConfig,
};

// Get active payment gateway
export function getActivePaymentGateway(): PaymentGatewayConfig | null {
  for (const gateway of Object.values(paymentGateways)) {
    if (gateway.isActive) {
      return gateway;
    }
  }
  return null;
}

// Boost Package Pricing
export interface BoostPackage {
  id: string;
  name: string;
  type: 'top_ad' | 'bump_up' | 'urgent' | 'featured';
  durationDays: number;
  price: number;
  description: string;
}

export const boostPackages: BoostPackage[] = [
  // Top Ad Packages
  {
    id: 'top_ad_1',
    name: 'Top Ad - 1 Day',
    type: 'top_ad',
    durationDays: 1,
    price: 49,
    description: 'Your ad appears at the top of search results for 1 day',
  },
  {
    id: 'top_ad_3',
    name: 'Top Ad - 3 Days',
    type: 'top_ad',
    durationDays: 3,
    price: 99,
    description: 'Your ad appears at the top of search results for 3 days',
  },
  {
    id: 'top_ad_7',
    name: 'Top Ad - 7 Days',
    type: 'top_ad',
    durationDays: 7,
    price: 199,
    description: 'Your ad appears at the top of search results for 7 days',
  },
  {
    id: 'top_ad_14',
    name: 'Top Ad - 14 Days',
    type: 'top_ad',
    durationDays: 14,
    price: 349,
    description: 'Your ad appears at the top of search results for 14 days',
  },
  // Bump Up Packages
  {
    id: 'bump_up_1',
    name: 'Bump Up - Single',
    type: 'bump_up',
    durationDays: 1,
    price: 29,
    description: 'Your ad moves to the top of listings instantly',
  },
  // Urgent Packages
  {
    id: 'urgent_3',
    name: 'Urgent - 3 Days',
    type: 'urgent',
    durationDays: 3,
    price: 79,
    description: 'Adds an urgent badge to attract quick buyers',
  },
  {
    id: 'urgent_7',
    name: 'Urgent - 7 Days',
    type: 'urgent',
    durationDays: 7,
    price: 149,
    description: 'Adds an urgent badge to attract quick buyers',
  },
  {
    id: 'urgent_14',
    name: 'Urgent - 14 Days',
    type: 'urgent',
    durationDays: 14,
    price: 249,
    description: 'Adds an urgent badge to attract quick buyers',
  },
  // Featured Packages
  {
    id: 'featured_1',
    name: 'Featured - 1 Day',
    type: 'featured',
    durationDays: 1,
    price: 99,
    description: 'Your ad appears on the homepage and category pages',
  },
  {
    id: 'featured_3',
    name: 'Featured - 3 Days',
    type: 'featured',
    durationDays: 3,
    price: 249,
    description: 'Your ad appears on the homepage and category pages',
  },
  {
    id: 'featured_7',
    name: 'Featured - 7 Days',
    type: 'featured',
    durationDays: 7,
    price: 499,
    description: 'Your ad appears on the homepage and category pages',
  },
];

export function getBoostPackageById(id: string): BoostPackage | undefined {
  return boostPackages.find(pkg => pkg.id === id);
}

export function getBoostPackagesByType(type: string): BoostPackage[] {
  return boostPackages.filter(pkg => pkg.type === type);
}
