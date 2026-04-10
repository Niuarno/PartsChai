'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowUpCircle,
  TrendingUp,
  AlertTriangle,
  Star,
  CheckCircle,
  Loader2,
  Zap,
} from 'lucide-react';
import { boostPackages, type BoostPackage } from '@/lib/payment-config';

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  adTitle: string;
  userId: string;
  userEmail: string;
  userName: string;
}

const boostTypeIcons: Record<string, React.ReactNode> = {
  top_ad: <ArrowUpCircle className="h-5 w-5 text-amber-500" />,
  bump_up: <TrendingUp className="h-5 w-5 text-blue-500" />,
  urgent: <AlertTriangle className="h-5 w-5 text-red-500" />,
  featured: <Star className="h-5 w-5 text-purple-500" />,
};

const boostTypeLabels: Record<string, string> = {
  top_ad: 'Top Ad',
  bump_up: 'Bump Up',
  urgent: 'Urgent',
  featured: 'Featured',
};

const boostTypeDescriptions: Record<string, string> = {
  top_ad: 'Your ad appears at the top of search results',
  bump_up: 'Your ad moves to the top instantly as if newly posted',
  urgent: 'Adds an urgent badge to attract quick buyers',
  featured: 'Your ad appears on homepage and category pages',
};

export default function BoostModal({
  isOpen,
  onClose,
  adId,
  adTitle,
  userId,
  userEmail,
  userName,
}: BoostModalProps) {
  const [selectedType, setSelectedType] = useState<string>('top_ad');
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const packagesByType = boostPackages.reduce((acc, pkg) => {
    if (!acc[pkg.type]) {
      acc[pkg.type] = [];
    }
    acc[pkg.type].push(pkg);
    return acc;
  }, {} as Record<string, BoostPackage[]>);

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setError(null);
  };

  const handlePayment = async () => {
    if (!selectedPackage) {
      setError('Please select a package');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment/create-boost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adId,
          packageId: selectedPackage,
          userId,
          userEmail,
          userName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      if (data.paymentUrl) {
        // Redirect to UddoktaPay checkout
        window.location.href = data.paymentUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPkg = boostPackages.find(p => p.id === selectedPackage);
  const totalPrice = selectedPkg?.price || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Boost Your Ad</DialogTitle>
          <DialogDescription>
            Get more views and sell faster with our boost options
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Ad: </p>
          <p className="font-medium text-slate-800 line-clamp-1">{adTitle}</p>
        </div>

        <Tabs value={selectedType} onValueChange={setSelectedType}>
          <TabsList className="grid grid-cols-4 mb-4">
            {Object.keys(packagesByType).map((type) => (
              <TabsTrigger key={type} value={type} className="flex items-center gap-1 text-xs sm:text-sm">
                {boostTypeIcons[type]}
                <span className="hidden sm:inline">{boostTypeLabels[type]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(packagesByType).map(([type, packages]) => (
            <TabsContent key={type} value={type} className="mt-0">
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  {boostTypeIcons[type]}
                  <span className="font-medium">{boostTypeLabels[type]}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {boostTypeDescriptions[type]}
                </p>
              </div>

              <RadioGroup value={selectedPackage} onValueChange={handlePackageSelect}>
                <div className="grid gap-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handlePackageSelect(pkg.id)}
                    >
                      <RadioGroupItem value={pkg.id} id={pkg.id} className="sr-only" />
                      <div className="flex-1">
                        <Label htmlFor={pkg.id} className="cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-slate-800">{pkg.name}</span>
                              <p className="text-sm text-muted-foreground">{pkg.description}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-emerald-600">৳{pkg.price}</span>
                            </div>
                          </div>
                        </Label>
                      </div>
                      {selectedPackage === pkg.id && (
                        <CheckCircle className="absolute right-4 top-4 h-5 w-5 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </TabsContent>
          ))}
        </Tabs>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Order Summary */}
        {selectedPackage && (
          <Card className="bg-slate-50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Package:</span>
                <span className="font-medium">{selectedPkg?.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{selectedPkg?.durationDays} days</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-emerald-600">৳{totalPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods Info */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <Zap className="h-4 w-4" />
          <span>Pay securely via bKash, Nagad, Rocket, or Card through UddoktaPay</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={!selectedPackage || isLoading}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay ৳{totalPrice}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
