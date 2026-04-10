'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Shield, BadgeCheck, Crown, Eye, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguageStore, useAuthStore } from '@/lib/store';
import { translations } from '@/lib/translations';

interface SellerPanelProps {
  seller: {
    id: string;
    fullName?: string;
    companyName?: string;
    phone?: string;
    role: string;
    isVerified: boolean;
    accountType: string;
    createdAt: string;
    avatarUrl?: string;
  };
  adId: string;
  activeAdsCount: number;
  isOwner: boolean;
}

export default function SellerPanel({ seller, adId, activeAdsCount, isOwner }: SellerPanelProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { isAuthenticated } = useAuthStore();
  const [showPhone, setShowPhone] = useState(false);

  const memberSince = new Date(seller.createdAt);
  const formattedMemberSince = language === 'bn'
    ? memberSince.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })
    : memberSince.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  const sellerName = seller.accountType === 'company' && seller.companyName
    ? seller.companyName
    : seller.fullName || 'Seller';

  const phoneNumber = seller.phone || 'Not provided';

  return (
    <Card className="sticky top-4 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
            {sellerName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg truncate">{sellerName}</CardTitle>
              {seller.role === 'member' && (
                <Badge className="bg-amber-100 text-amber-700 shrink-0">
                  <Crown className="h-3 w-3 mr-1" />
                  {t.member}
                </Badge>
              )}
              {seller.isVerified && (
                <Badge className="bg-emerald-100 text-emerald-700 shrink-0">
                  <BadgeCheck className="h-3 w-3 mr-1" />
                  {t.verified}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn' ? `সদস্য: ${formattedMemberSince}` : `Member since ${formattedMemberSince}`}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Active Ads Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">
            {language === 'bn' ? 'সক্রিয় বিজ্ঞাপন' : 'Active Ads'}
          </span>
          <Link 
            href={`/?seller=${seller.id}`}
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            {activeAdsCount} {language === 'bn' ? 'টি' : 'ads'}
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {/* View All Ads Link */}
        {activeAdsCount > 1 && (
          <Link
            href={`/?seller=${seller.id}`}
            className="block text-sm text-center text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {language === 'bn' ? 'সব বিজ্ঞাপন দেখুন' : 'View All Ads'}
          </Link>
        )}

        <Separator />

        {/* Action Buttons - Only show if not owner */}
        {!isOwner && (
          <>
            {/* Show Phone Number Button */}
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setShowPhone(!showPhone)}
            >
              <Phone className="h-4 w-4" />
              {showPhone ? phoneNumber : t.showPhoneNumber}
            </Button>

            {/* Send Message Button */}
            {isAuthenticated ? (
              <Link href={`/?chat=${adId}`} className="block">
                <Button className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <MessageCircle className="h-4 w-4" />
                  {t.sendMessage}
                </Button>
              </Link>
            ) : (
              <Button
                className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700"
                disabled
                title="Login to send messages"
              >
                <MessageCircle className="h-4 w-4" />
                {t.sendMessage}
              </Button>
            )}

            <Separator />
          </>
        )}

        {/* Safety Tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {language === 'bn' ? 'নিরাপত্তা টিপ' : 'Safety Tip'}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                {t.safetyTip}
              </p>
            </div>
          </div>
        </div>

        {/* Report Ad Link - Only show if not owner */}
        {!isOwner && (
          <Link
            href={`/?report=${adId}`}
            className="block text-sm text-center text-slate-500 hover:text-red-600 transition-colors"
          >
            {t.reportAd}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
