'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Check,
  X,
  Star,
  Zap,
  Crown,
  Building2,
  ArrowRight,
  CreditCard,
  Shield,
  TrendingUp,
  Users,
  BarChart3,
  HeadphonesIcon,
  BadgeCheck,
  Store,
  ImageIcon,
  Sparkles,
} from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    icon: Zap,
    monthlyPrice: 499,
    yearlyPrice: 4790,
    description: 'Perfect for casual sellers',
    color: 'emerald',
    popular: false,
    features: [
      { name: '10 active ads', included: true },
      { name: '10 photos per ad', included: true },
      { name: 'Auto bump-up (2x/month)', included: true },
      { name: 'Basic ad analytics', included: true },
      { name: 'Member badge', included: true },
      { name: 'Priority support', included: false },
      { name: 'Online shop/storefront', included: false },
      { name: 'Verified seller badge', included: false },
      { name: 'Top ad vouchers', included: false },
      { name: 'Supercharged ads', included: false },
    ],
  },
  {
    name: 'Professional',
    icon: Crown,
    monthlyPrice: 999,
    yearlyPrice: 9590,
    description: 'Ideal for regular sellers',
    color: 'teal',
    popular: true,
    features: [
      { name: '25 active ads', included: true },
      { name: '15 photos per ad', included: true },
      { name: 'Auto bump-up (4x/month)', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Member badge', included: true },
      { name: 'Priority support', included: true },
      { name: 'Online shop/storefront', included: true },
      { name: 'Verified seller badge', included: true },
      { name: '2 Top ad vouchers/month', included: true },
      { name: 'Supercharged ads', included: false },
    ],
  },
  {
    name: 'Enterprise',
    icon: Building2,
    monthlyPrice: 1999,
    yearlyPrice: 19190,
    description: 'For power sellers & shops',
    color: 'purple',
    popular: false,
    features: [
      { name: 'Unlimited active ads', included: true },
      { name: '20 photos per ad', included: true },
      { name: 'Daily auto bump-up', included: true },
      { name: 'Full analytics dashboard', included: true },
      { name: 'Premium member badge', included: true },
      { name: 'Dedicated support manager', included: true },
      { name: 'Customizable storefront', included: true },
      { name: 'Verified seller badge', included: true },
      { name: '5 Top ad vouchers/month', included: true },
      { name: 'Supercharged ads', included: true },
    ],
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: 'More Visibility',
    description: 'Your ads get more views with auto bump-ups and top ad placements',
  },
  {
    icon: Shield,
    title: 'Build Trust',
    description: 'Verified seller badge shows buyers you\'re a trusted seller',
  },
  {
    icon: BarChart3,
    title: 'Track Performance',
    description: 'Analytics show you how your ads are performing',
  },
  {
    icon: Store,
    title: 'Your Own Shop',
    description: 'Create a professional storefront to showcase all your listings',
  },
  {
    icon: ImageIcon,
    title: 'More Photos',
    description: 'Upload more photos per ad to show every detail',
  },
  {
    icon: HeadphonesIcon,
    title: 'Priority Support',
    description: 'Get faster help from our dedicated support team',
  },
];

export default function MembershipPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-4">
              <Sparkles className="h-3 w-3 mr-1" /> Membership
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Grow Your Business with{' '}
              <span className="text-emerald-400">PartsChai Membership</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8">
              Unlock premium features to sell faster, reach more buyers, and grow your PC parts business
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={billingPeriod === 'monthly' ? 'default' : 'outline'}
                onClick={() => setBillingPeriod('monthly')}
                className={billingPeriod === 'monthly' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/30 text-white hover:bg-white/10'}
              >
                Monthly
              </Button>
              <Button
                variant={billingPeriod === 'yearly' ? 'default' : 'outline'}
                onClick={() => setBillingPeriod('yearly')}
                className={billingPeriod === 'yearly' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-white/30 text-white hover:bg-white/10'}
              >
                Yearly
                <Badge className="ml-2 bg-amber-500 text-white">Save 20%</Badge>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Sign Up */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Get Started in 3 Easy Steps</h2>
            <p className="text-slate-600">Start enjoying member benefits in minutes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center">
                1
              </div>
              <CardContent className="pt-16 pb-6 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Select Category</h3>
                <p className="text-sm text-slate-600">
                  Choose if you&apos;re an individual seller or a business
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center">
                2
              </div>
              <CardContent className="pt-16 pb-6 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Select Plan</h3>
                <p className="text-sm text-slate-600">
                  Pick the plan that fits your selling needs
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center">
                3
              </div>
              <CardContent className="pt-16 pb-6 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <BadgeCheck className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Business Info</h3>
                <p className="text-sm text-slate-600">
                  Complete your profile and start selling
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Choose Your Plan</h2>
            <p className="text-slate-600">All plans include free ad posting</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative overflow-hidden ${
                  plan.popular ? 'border-2 border-emerald-500 shadow-lg' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardContent className={`p-6 ${plan.popular ? 'pt-10' : ''}`}>
                  <div className="text-center mb-6">
                    <div
                      className={`w-14 h-14 rounded-full bg-${plan.color}-100 flex items-center justify-center mx-auto mb-3`}
                    >
                      <plan.icon className={`h-7 w-7 text-${plan.color}-600`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                    <p className="text-sm text-slate-500">{plan.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-slate-800">
                        ৳{billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-slate-500">
                        /{billingPeriod === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingPeriod === 'yearly' && (
                      <p className="text-sm text-emerald-600 mt-1">
                        Save ৳{plan.monthlyPrice * 12 - plan.yearlyPrice}/year
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-slate-300 shrink-0" />
                        )}
                        <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    Select {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Member Benefits</h2>
            <p className="text-slate-600">Why become a PartsChai member?</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <benefit.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{benefit.title}</h3>
                    <p className="text-sm text-slate-600">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-8 md:p-12 text-center">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
              Join thousands of successful sellers on PartsChai. Start your membership today and sell more PC parts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/?page=contact">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
