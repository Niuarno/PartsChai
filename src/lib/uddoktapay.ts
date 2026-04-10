// UddoktaPay Payment Gateway Integration
// Documentation: https://uddoktapay.com/docs

import { createHmac } from 'crypto';
import { uddoktaPayConfig } from './payment-config';

export interface UddoktaPayPaymentRequest {
  fullName: string;
  email: string;
  amount: number;
  metadata?: Record<string, string>;
  redirectUrl?: string;
  webhookUrl?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface UddoktaPayPaymentResponse {
  status: boolean;
  message: string;
  data?: {
    payment_url: string;
    invoice_id: string;
  };
}

export interface UddoktaPayVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    invoice_id: string;
    transaction_id: string;
    payment_method: string;
    amount: string;
    fee: string;
    status: string;
    metadata: Record<string, string>;
    created_at: string;
    paid_at: string;
  };
}

export interface UddoktaPayWebhookData {
  invoice_id: string;
  transaction_id: string;
  payment_method: string;
  amount: string;
  fee: string;
  status: string;
  metadata: Record<string, string>;
  created_at: string;
  paid_at: string;
  hash: string;
}

/**
 * Create a payment request with UddoktaPay
 */
export async function createUddoktaPayPayment(
  params: UddoktaPayPaymentRequest
): Promise<UddoktaPayPaymentResponse> {
  const {
    fullName,
    email,
    amount,
    metadata = {},
    redirectUrl,
    webhookUrl,
    returnUrl,
    cancelUrl,
  } = params;

  const requestData = {
    full_name: fullName,
    email: email,
    amount: amount.toString(),
    metadata: metadata,
    redirect_url: redirectUrl || `${uddoktaPayConfig.redirectUrl}/payment/callback`,
    return_url: returnUrl || `${uddoktaPayConfig.redirectUrl}/payment/success`,
    cancel_url: cancelUrl || `${uddoktaPayConfig.redirectUrl}/payment/cancel`,
    webhook_url: webhookUrl || uddoktaPayConfig.webhookUrl || undefined,
  };

  try {
    const response = await fetch(`${uddoktaPayConfig.apiEndpoint}/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': uddoktaPayConfig.apiKey,
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    return result as UddoktaPayPaymentResponse;
  } catch (error) {
    console.error('UddoktaPay create payment error:', error);
    return {
      status: false,
      message: 'Failed to create payment request. Please try again.',
    };
  }
}

/**
 * Verify a payment with UddoktaPay
 */
export async function verifyUddoktaPayPayment(
  invoiceId: string
): Promise<UddoktaPayVerifyResponse> {
  try {
    const response = await fetch(`${uddoktaPayConfig.apiEndpoint}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': uddoktaPayConfig.apiKey,
      },
      body: JSON.stringify({
        invoice_id: invoiceId,
      }),
    });

    const result = await response.json();
    return result as UddoktaPayVerifyResponse;
  } catch (error) {
    console.error('UddoktaPay verify payment error:', error);
    return {
      status: false,
      message: 'Failed to verify payment. Please contact support.',
    };
  }
}

/**
 * Calculate the hash for webhook verification
 * UddoktaPay uses HMAC-SHA256 for hash verification
 */
export function calculateWebhookHash(data: UddoktaPayWebhookData): string {
  const payload = `${data.invoice_id}|${data.amount}|${data.status}|${uddoktaPayConfig.apiSecret}`;
  return createHmac('sha256', uddoktaPayConfig.apiSecret).update(payload).digest('hex');
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  data: UddoktaPayWebhookData,
  receivedHash: string
): boolean {
  const expectedHash = calculateWebhookHash(data);
  return expectedHash === receivedHash;
}

/**
 * Get all available payment methods from UddoktaPay
 */
export async function getAvailablePaymentMethods(): Promise<string[]> {
  // UddoktaPay supports multiple payment methods
  // These are typically shown on their hosted checkout page
  return [
    'bkash',
    'nagad',
    'rocket',
    'upay',
    'tap',
    'card',
  ];
}
