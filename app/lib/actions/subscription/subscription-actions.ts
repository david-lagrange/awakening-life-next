'use server';

import { getAvailableSubscriptions, type SubscriptionFeature, getUserSubscription, toggleAutoRenewal, getCustomerInvoices, getCustomerPaymentMethods, PaymentMethod, Invoice, createSetupIntent, setCustomerDefaultPaymentMethod, deleteCustomerPaymentMethod, updateSubscription, cancelSubscription, reactivateSubscription } from '../../api/services/subscriptions.service';  
import { revalidatePath } from 'next/cache';

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  features: SubscriptionFeature[];
  price: number;
  interval: string;
  productId?: string;
  priceId?: string;
}

export type SubscriptionState = {
  plans?: SubscriptionPlan[];
  error?: string;
}

export async function fetchSubscriptionPlans(): Promise<SubscriptionState> {
  try {
    const subscriptions = await getAvailableSubscriptions();
    
    const plans = subscriptions.map((sub, index) => ({
      id: index,
      name: sub.name,
      description: sub.description,
      features: sub.features,
      price: sub.prices[0].unitAmount,
      interval: sub.prices[0].recurringInterval,
      productId: sub.productId,
      priceId: sub.defaultPriceId
    }));

    return { plans: plans };
    
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return {
      error: 'Failed to load subscription plans. Please try again later.',
    };
  }
}

export interface UserSubscriptionDetails {
  subscriptionId: string;
  status: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  isCanceled: boolean;
  productName: string;
  productId: string;
  productDescription: string;
  productCurrency: string;
  productRecurringInterval: string;
  productRecurringIntervalCount: number;
  productLastPaidAmount: number;
  productCurrentDefaultPrice: number;
  roles: { roleId: string; roleName: string; }[];
}

export async function fetchUserSubscriptions(): Promise<UserSubscriptionDetails[] | null> {
  try {
    const subscriptions = await getUserSubscription();
    
    if (subscriptions.length === 0) {
      return null;
    }

    const userSubscriptions = subscriptions.map(subscription => ({
      subscriptionId: subscription.subscriptionId,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      autoRenew: subscription.autoRenew,
      isCanceled: subscription.isCanceled,
      productName: subscription.product.name,
      productId: subscription.product.productId,
      productDescription: subscription.product.description,
      productCurrency: subscription.product.currency,
      productRecurringInterval: subscription.product.recurringInterval,
      productRecurringIntervalCount: subscription.product.recurringIntervalCount,
      productLastPaidAmount: subscription.product.lastPaidAmount,
      productCurrentDefaultPrice: subscription.product.currentDefaultPrice,
      roles: subscription.product.roles
    }));

    return userSubscriptions;
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    return null;
  }
}

export async function toggleSubscriptionAutoRenewal(
  subscriptionId: string, 
  currentAutoRenewState: boolean
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await toggleAutoRenewal(subscriptionId, currentAutoRenewState);
    return { success: true };
  } catch (error) {
    console.error('Error toggling auto-renewal:', error);
    return {
      success: false,
      error: 'Failed to update auto-renewal settings. Please try again later.',
    };
  }
}

export type { Invoice, PaymentMethod } from '../../api/services/subscriptions.service';

export async function fetchCustomerInvoices(): Promise<{
  invoices?: Invoice[];
  error?: string;
}> {
  try {
    const invoices = await getCustomerInvoices();
    return { invoices };
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return {
      error: 'Failed to load invoice history. Please try again later.',
    };
  }
}

export async function fetchCustomerPaymentMethods(): Promise<{
  paymentMethods?: PaymentMethod[];
  error?: string;
}> {
  try {
    const paymentMethods = await getCustomerPaymentMethods();
    return { paymentMethods };
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return {
      error: 'Failed to load payment methods. Please try again later.',
    };
  }
}

export async function initializeSetupIntent(): Promise<{
  clientSecret?: string;
  error?: string;
}> {
  try {
    const { clientSecret } = await createSetupIntent();
    return { clientSecret };
  } catch (error) {
    console.error('Error creating setup intent:', error);
    return {
      error: 'Failed to initialize payment setup. Please try again later.',
    };
  }
}

export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await setCustomerDefaultPaymentMethod(paymentMethodId);
    
    // Revalidate the payment methods page
    revalidatePath('/account/billing/payment-methods');
    
    return { success: true };
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return {
      success: false,
      error: 'Failed to set default payment method. Please try again later.',
    };
  }
}

export async function deletePaymentMethod(paymentMethodId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await deleteCustomerPaymentMethod(paymentMethodId);
    
    // Revalidate the payment methods page
    revalidatePath('/account/billing/payment-methods');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return {
      success: false,
      error: 'Failed to delete payment method. Please try again later.',
    };
  }
}

export interface SubscriptionChangeParams {
  newPriceId: string;
  paymentMethodId?: string;
  currentSubscriptionId?: string;
  isDowngrade?: boolean;
}

export async function changeSubscription({
  newPriceId,
  paymentMethodId,
  currentSubscriptionId,
  isDowngrade
}: SubscriptionChangeParams): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await updateSubscription({
      newPriceId,
      paymentMethodId,
      currentSubscriptionId,
      isDowngrade
    });
    
    // Revalidate relevant paths
    revalidatePath('/account/billing');
    revalidatePath('/account/subscription');
    
    return { success: true };
  } catch (error) {
    console.error('Error changing subscription:', error);
    return {
      success: false,
      error: 'Failed to change subscription. Please try again later.',
    };
  }
}

export async function revalidatePaymentMethods() {
  'use server';
  // can this sleep for a bit?
  await new Promise(resolve => setTimeout(resolve, 1000));
  revalidatePath('/account/billing/payment-methods');
}

export async function cancelCurrentSubscription(subscriptionId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await cancelSubscription(subscriptionId);
    
    // Revalidate relevant paths
    revalidatePath('/account/billing');
    revalidatePath('/account/subscription');
    
    return { success: true };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return {
      success: false,
      error: 'Failed to cancel subscription. Please try again later.',
    };
  }
}

export async function reactivateCurrentSubscription(subscriptionId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await reactivateSubscription(subscriptionId);
    
    // Revalidate relevant paths
    revalidatePath('/account/billing');
    revalidatePath('/account/subscription');
    
    return { success: true };
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return {
      success: false,
      error: 'Failed to reactivate subscription. Please try again later.',
    };
  }
} 