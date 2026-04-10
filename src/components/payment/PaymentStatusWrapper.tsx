'use client';

import dynamic from 'next/dynamic';

// Dynamically import PaymentStatus to avoid SSR issues
const PaymentStatus = dynamic(() => import('./PaymentStatus'), {
  ssr: false,
});

interface PaymentStatusWrapperProps {
  status: 'success' | 'error' | 'cancel' | 'callback';
  message?: string;
  invoiceId?: string;
}

export default function PaymentStatusWrapper({ status, message, invoiceId }: PaymentStatusWrapperProps) {
  return <PaymentStatus status={status} message={message} invoiceId={invoiceId} />;
}
