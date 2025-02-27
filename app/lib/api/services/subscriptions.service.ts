import { auth } from '@/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const STRIPE_PRODUCTS_PATH = `${API_BASE_URL}/api/stripe/products`;

export interface SubscriptionPrice {
  priceId: string;
  created: string;
  active: boolean;
  currency: string;
  unitAmount: number;
  recurringInterval: string;
  recurringIntervalCount: number;
  estimatedRenewalDate: string;
}

export interface SubscriptionFeature {
  subscriptionFeatureId: string;
  featureText: string;
  featureOrder: number;
  isIncluded: boolean;
}

export interface Subscription {
  productId: string;
  active: boolean;
  defaultPriceId: string;
  name: string;
  description: string;
  created: string;
  updated: string;
  features: SubscriptionFeature[];
  prices: SubscriptionPrice[];
}

export interface SubscriptionRole {
  roleId: string;
  roleName: string;
}

export interface UserSubscription {
  subscriptionId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  isCanceled: boolean;
  product: {
    productId: string;
    name: string;
    description: string;
    lastPaidAmount: number;
    currentDefaultPrice: number;
    currency: string;
    recurringInterval: string;
    recurringIntervalCount: number;
    roles: SubscriptionRole[];
  };
}

export interface Invoice {
  invoiceId: string;
  created: string;
  paidAt: string;
  amountDue: number;
  status: string;
  invoicePdfUrl: string;
  productName: string;
  paymentMethodBrand: string | null;
  paymentMethodLast4: string | null;
}

export interface PaymentMethod {
  paymentMethodId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export async function getAvailableSubscriptions(): Promise<Subscription[]> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(STRIPE_PRODUCTS_PATH, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch subscriptions: ${response.statusText}`);
  }

  return response.json();
}

export async function getUserSubscription(): Promise<UserSubscription[]> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/stripe/customers/subscriptions`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user subscription: ${response.statusText}`);
  }

  return response.json();
}

export async function toggleAutoRenewal(subscriptionId: string, currentAutoRenewState: boolean): Promise<UserSubscription> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  console.log('currentAutoRenewState', currentAutoRenewState);
  console.log('subscriptionId', subscriptionId);

  const response = await fetch(
    `${API_BASE_URL}/api/stripe/customers/subscriptions/${subscriptionId}/auto-renewal`, 
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isAutoRenew: !currentAutoRenewState // Invert the current state
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to toggle auto-renewal: ${response.statusText}`);
  }

  return response.json();
}

export async function getCustomerInvoices(): Promise<Invoice[]> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/stripe/customers/invoices`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch invoices: ${response.statusText}`);
  }

  return response.json();
}

export async function getCustomerPaymentMethods(): Promise<PaymentMethod[]> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/stripe/customers/payment-methods`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch payment methods: ${response.statusText}`);
  }

  return response.json();
}

export async function createSetupIntent(): Promise<{ clientSecret: string }> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/stripe/setup-intent`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create setup intent: ${response.statusText}`);
  }

  return response.json();
}

export async function setCustomerDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/stripe/customers/payment-methods/default`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentMethodId })
  });

  if (!response.ok) {
    throw new Error(`Failed to set default payment method: ${response.statusText}`);
  }
}

export async function deleteCustomerPaymentMethod(paymentMethodId: string): Promise<void> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/stripe/customers/payment-methods/${paymentMethodId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete payment method: ${response.statusText}`);
  }
}

export async function updateSubscription({
  newPriceId,
  paymentMethodId,
  currentSubscriptionId,
  isDowngrade
}: {
  newPriceId: string;
  paymentMethodId?: string;
  currentSubscriptionId?: string;
  isDowngrade?: boolean;
}): Promise<void> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  console.log('newPriceId', newPriceId);
  console.log('paymentMethodId', paymentMethodId);
  console.log('currentSubscriptionId', currentSubscriptionId);
  console.log('isDowngrade', isDowngrade);

  // Determine the endpoint based on whether it's a downgrade
  const endpoint = isDowngrade 
    ? `${API_BASE_URL}/api/stripe/customers/subscriptions/downgrade`
    : `${API_BASE_URL}/api/stripe/customers/subscriptions/upgrade`;

  const body = isDowngrade
    ? {
        newPriceId,
        currentSubscriptionId,
      }
    : {
        newPriceId,
        paymentMethodId,
        currentSubscriptionId,
      };

  console.log('body', body);
  console.log('endpoint', endpoint);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Failed to update subscription: ${response.statusText}`);
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/stripe/customers/subscriptions/${subscriptionId}/cancel`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to cancel subscription: ${response.statusText}`);
  }
}

export async function reactivateSubscription(subscriptionId: string): Promise<void> {
  const session = await auth();
  
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/stripe/customers/subscriptions/${subscriptionId}/reactivate`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to reactivate subscription: ${response.statusText}`);
  }
} 