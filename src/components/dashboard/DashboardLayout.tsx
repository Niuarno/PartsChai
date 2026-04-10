'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from './Sidebar';
import MyAds from './MyAds';
import Settings from './Settings';
import SavedAds from './SavedAds';
import { useAuthStore, useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PlusCircle,
  MessageSquare,
  Crown,
  Store,
  BarChart3,
  HelpCircle,
  Bookmark,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const router = useRouter();
  const searchParams = useSearchParams();
  const [manualSection, setManualSection] = useState<string | null>(null);

  // Compute active section from URL or manual selection
  const activeSection = useMemo(() => {
    if (manualSection) return manualSection;
    const urlSection = searchParams.get('section');
    return urlSection || 'my-ads';
  }, [searchParams, manualSection]);

  // Check authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/?login=true');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const isMember = user?.role === 'member' || user?.role === 'admin';

  const renderContent = () => {
    switch (activeSection) {
      case 'my-ads':
        return <MyAds />;
      case 'saved-ads':
        return <SavedAds />;
      case 'settings':
        return <Settings />;
      case 'post-ad':
        return (
          <div className="text-center py-12">
            <PlusCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">{t.postFreeAd}</h2>
            <p className="text-slate-500 mb-6">Create a new listing to sell your PC parts</p>
            <Link href="/?post-ad=true">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                {t.postFreeAd}
              </Button>
            </Link>
          </div>
        );
      case 'messages':
        return (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">{t.messages}</h2>
            <p className="text-slate-500">Your conversations with buyers and sellers will appear here</p>
          </div>
        );
      case 'saved-searches':
        return (
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">{t.savedSearches}</h2>
            <p className="text-slate-500">Save your search filters for quick access later</p>
          </div>
        );
      case 'membership':
        return <MembershipSection />;
      case 'my-shop':
        if (!isMember) {
          return <MembershipSection />;
        }
        return (
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">{t.myShop}</h2>
            <p className="text-slate-500">Create your online storefront to showcase all your products</p>
          </div>
        );
      case 'analytics':
        if (!isMember) {
          return <MembershipSection />;
        }
        return (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">{t.analytics}</h2>
            <p className="text-slate-500">View insights and analytics for your listings</p>
          </div>
        );
      case 'help':
        return (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">{t.helpSupport}</h2>
            <p className="text-slate-500 mb-4">Get help with using PartsChai</p>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Email: support@partschai.com</p>
              <p className="text-sm text-slate-600">Phone: +880 1234-567890</p>
            </div>
          </div>
        );
      default:
        return <MyAds />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeSection={activeSection} onSectionChange={setManualSection} />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              {t.dashboard}
            </h1>
            <p className="text-slate-500 mt-1">
              Welcome back, {user?.fullName || 'User'}!
            </p>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Membership Section Component
function MembershipSection() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { user } = useAuthStore();
  const isMember = user?.role === 'member' || user?.role === 'admin';

  const benefits = [
    { key: 'autoBumpUp', icon: '🔄' },
    { key: 'freeTopAdVouchers', icon: '🎫' },
    { key: 'morePhotosPerAd', icon: '📸' },
    { key: 'onlineShop', icon: '🏪' },
    { key: 'verifiedSellerBadge', icon: '✅' },
    { key: 'memberBadge', icon: '👑' },
    { key: 'adAnalytics', icon: '📊' },
    { key: 'superchargedAds', icon: '⚡' },
    { key: 'buyerTracking', icon: '👥' },
    { key: 'dedicatedSupport', icon: '🎧' },
    { key: 'trustCredibility', icon: '🛡️' },
  ];

  const plans = [
    { name: 'Basic', price: 299, period: 'month', features: ['5x Auto Bump', '5 Top Ad Vouchers', '15 Photos/Ad'] },
    { name: 'Pro', price: 499, period: 'month', features: ['10x Auto Bump', '10 Top Ad Vouchers', '20 Photos/Ad', 'Online Shop'], popular: true },
    { name: 'Enterprise', price: 999, period: 'month', features: ['Unlimited Bumps', 'Unlimited Vouchers', 'Unlimited Photos', 'Priority Support'] },
  ];

  if (isMember) {
    return (
      <div className="text-center py-12">
        <Crown className="h-16 w-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">You are a Member!</h2>
        <p className="text-slate-500">Enjoy all member benefits</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {benefits.slice(0, 6).map((benefit) => (
            <div key={benefit.key} className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
              <span>{benefit.icon}</span>
              <span className="text-sm text-slate-700">
                {t[benefit.key as keyof typeof t]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            {t.memberBenefits}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {benefits.map((benefit) => (
              <div key={benefit.key} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-lg">{benefit.icon}</span>
                <span className="text-sm text-slate-700">
                  {t[benefit.key as keyof typeof t]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? 'border-emerald-500 relative' : ''}>
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold text-emerald-600">৳{plan.price}</span>
                <span className="text-slate-500">{t.perMonth}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                variant={plan.popular ? 'default' : 'outline'}
              >
                {t.selectPlan}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-sm text-slate-500">
        {t.saveWithAnnual}
      </p>
    </div>
  );
}
