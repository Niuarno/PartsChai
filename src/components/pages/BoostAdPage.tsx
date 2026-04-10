'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  ArrowUp,
  AlertCircle,
  Star,
  Clock,
  Eye,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const boostTypes = [
  {
    name: 'Top Ad',
    icon: ArrowUp,
    color: 'emerald',
    description: 'Your ad appears at the top of search results and category pages',
    benefits: [
      'Appears at the very top of listings',
      'Maximum visibility to buyers',
      'Great for competitive categories',
      'Duration: 3, 7, or 14 days',
    ],
    pricing: [
      { duration: '3 days', price: 99 },
      { duration: '7 days', price: 199 },
      { duration: '14 days', price: 349 },
    ],
  },
  {
    name: 'Bump Up',
    icon: TrendingUp,
    color: 'teal',
    description: 'Refresh your ad to appear as newly posted, bringing it back to the top',
    benefits: [
      'Resets your ad\'s position',
      'Appears as a fresh listing',
      'Perfect for older ads',
      'Instant visibility boost',
    ],
    pricing: [
      { duration: '1 bump', price: 49 },
      { duration: '3 bumps', price: 129 },
      { duration: '5 bumps', price: 199 },
    ],
  },
  {
    name: 'Urgent',
    icon: AlertCircle,
    color: 'red',
    description: 'Add an urgent badge to highlight your ad and attract quick buyers',
    benefits: [
      'Eye-catching urgent badge',
      'Signals quick sale needed',
      'Attracts serious buyers',
      'Duration: 7 or 14 days',
    ],
    pricing: [
      { duration: '7 days', price: 79 },
      { duration: '14 days', price: 139 },
    ],
  },
  {
    name: 'Featured',
    icon: Star,
    color: 'amber',
    description: 'Show your ad on the homepage featured section for maximum exposure',
    benefits: [
      'Homepage placement',
      'Maximum exposure',
      'Premium positioning',
      'Best visibility available',
    ],
    pricing: [
      { duration: '3 days', price: 299 },
      { duration: '7 days', price: 499 },
      { duration: '14 days', price: 799 },
    ],
  },
];

export default function BoostAdPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <Zap className="h-3 w-3 mr-1" /> Ad Boost
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get More Views. Sell Faster.
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8">
              Boost your ads to reach more buyers and sell your PC parts quickly
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-emerald-100">
                <Eye className="h-5 w-5" />
                <span>10x more views</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-white/50" />
              <div className="flex items-center gap-2 text-emerald-100">
                <Clock className="h-5 w-5" />
                <span>Sell 3x faster</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-white/50" />
              <div className="flex items-center gap-2 text-emerald-100">
                <CheckCircle className="h-5 w-5" />
                <span>Proven results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boost Types */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Choose Your Boost Type</h2>
            <p className="text-slate-600">Different ways to maximize your ad&apos;s visibility</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {boostTypes.map((boost) => (
              <Card key={boost.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-full bg-${boost.color}-100 flex items-center justify-center shrink-0`}>
                      <boost.icon className={`h-7 w-7 text-${boost.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{boost.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{boost.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {boost.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Pricing:</h4>
                    <div className="flex flex-wrap gap-2">
                      {boost.pricing.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2"
                        >
                          <span className="text-sm text-slate-600">{option.duration}</span>
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                            ৳{option.price}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">How Boosting Works</h2>
              <p className="text-slate-600">Boost your ad in just a few clicks</p>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                    1
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Select Your Ad</h3>
                  <p className="text-sm text-slate-600">
                    Go to your dashboard and choose the ad you want to boost
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                    2
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Choose Boost Type</h3>
                  <p className="text-sm text-slate-600">
                    Select from Top Ad, Bump Up, Urgent, or Featured
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                    3
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Pay & Activate</h3>
                  <p className="text-sm text-slate-600">
                    Complete payment and your boost activates instantly
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Boost Types */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Boost Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Feature</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-700">Top Ad</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-700">Bump Up</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-700">Urgent</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-700">Featured</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-slate-600">Top of search results</td>
                      <td className="py-3 px-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><span className="text-slate-300">-</span></td>
                      <td className="py-3 px-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-slate-600">Homepage placement</td>
                      <td className="py-3 px-4 text-center"><span className="text-slate-300">-</span></td>
                      <td className="py-3 px-4 text-center"><span className="text-slate-300">-</span></td>
                      <td className="py-3 px-4 text-center"><span className="text-slate-300">-</span></td>
                      <td className="py-3 px-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-slate-600">Special badge</td>
                      <td className="py-3 px-4 text-center"><Badge className="bg-emerald-100 text-emerald-700">Top</Badge></td>
                      <td className="py-3 px-4 text-center"><span className="text-slate-300">-</span></td>
                      <td className="py-3 px-4 text-center"><Badge className="bg-red-100 text-red-700">Urgent</Badge></td>
                      <td className="py-3 px-4 text-center"><Badge className="bg-amber-100 text-amber-700">Featured</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-slate-600">Best for</td>
                      <td className="py-3 px-4 text-center text-slate-600">Visibility</td>
                      <td className="py-3 px-4 text-center text-slate-600">Older ads</td>
                      <td className="py-3 px-4 text-center text-slate-600">Quick sales</td>
                      <td className="py-3 px-4 text-center text-slate-600">Max exposure</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-600">Starting from</td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-600">৳99</td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-600">৳49</td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-600">৳79</td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-600">৳299</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-8 md:p-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Boost Your Ad?
            </h2>
            <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
              Get more views, more inquiries, and sell your PC parts faster with our powerful boost options.
            </p>
            <Link href="/?dashboard=my-ads">
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
                Boost Your Ad Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
