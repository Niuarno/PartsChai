'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PaymentStatusProps {
  status: 'success' | 'error' | 'cancel' | 'callback';
  message?: string;
  invoiceId?: string;
}

export default function PaymentStatus({ status, message, invoiceId }: PaymentStatusProps) {
  const [isVerifying, setIsVerifying] = useState(status === 'callback');

  const verifyPayment = async (invId: string) => {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceId: invId }),
      });

      const data = await response.json();
      
      // Redirect based on result
      if (data.success) {
        window.location.href = '/?payment=success';
      } else {
        window.location.href = `/?payment=error&message=${encodeURIComponent(data.error || 'Payment verification failed')}`;
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      window.location.href = '/?payment=error&message=Payment verification failed';
    }
  };

  useEffect(() => {
    // If this is a callback, verify the payment
    if (status === 'callback' && invoiceId) {
      verifyPayment(invoiceId);
    }
  }, [status, invoiceId]);

  if (isVerifying) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Verifying Payment...
            </h2>
            <p className="text-slate-600">
              Please wait while we confirm your payment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusContent = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-emerald-500" />,
          title: 'Payment Successful!',
          description: 'Your boost has been activated. Your ad will now get more visibility.',
          bgColor: 'bg-emerald-50',
          button: (
            <Link href="/?dashboard=true">
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                Go to My Ads
              </Button>
            </Link>
          ),
        };
      case 'error':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Payment Failed',
          description: message || 'Something went wrong with your payment. Please try again.',
          bgColor: 'bg-red-50',
          button: (
            <Link href="/?dashboard=true">
              <Button className="bg-slate-600 hover:bg-slate-700">
                Try Again
              </Button>
            </Link>
          ),
        };
      case 'cancel':
        return {
          icon: <XCircle className="h-16 w-16 text-amber-500" />,
          title: 'Payment Cancelled',
          description: 'You cancelled the payment. You can try again anytime.',
          bgColor: 'bg-amber-50',
          button: (
            <Link href="/?dashboard=true">
              <Button className="bg-slate-600 hover:bg-slate-700">
                Go to My Ads
              </Button>
            </Link>
          ),
        };
      default:
        return {
          icon: <Loader2 className="h-16 w-16 animate-spin text-emerald-500" />,
          title: 'Processing...',
          description: 'Please wait while we process your payment.',
          bgColor: 'bg-slate-50',
          button: null,
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className={`p-8 text-center ${content.bgColor} rounded-lg`}>
          <div className="flex justify-center mb-4">
            {content.icon}
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            {content.title}
          </h2>
          <p className="text-slate-600 mb-6">
            {content.description}
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/">
              <Button variant="outline">
                Go to Homepage
              </Button>
            </Link>
            {content.button}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
