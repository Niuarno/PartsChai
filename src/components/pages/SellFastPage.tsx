'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  FileText,
  DollarSign,
  MessageSquare,
  Zap,
  Eye,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Sparkles,
  TrendingUp,
  Star,
} from 'lucide-react';

export default function SellFastPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <Sparkles className="h-3 w-3 mr-1" /> Seller Tips
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sell Faster on PartsChai
            </h1>
            <p className="text-lg md:text-xl text-emerald-100">
              Expert tips to get your PC parts sold quickly and at the best price
            </p>
          </div>
        </div>
      </section>

      {/* Main Tips */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {/* Tip 1: Detailed Descriptions */}
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 bg-emerald-100 p-6 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <FileText className="h-8 w-8" />
                  </div>
                </div>
                <CardContent className="md:w-3/4 p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Badge className="bg-emerald-500 text-white">Tip #1</Badge>
                    <h3 className="text-xl font-bold text-slate-800">Write Detailed Descriptions</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    A detailed description helps buyers understand exactly what you&apos;re selling. Include:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Brand and model name',
                      'Condition (new, used, refurbished)',
                      'Age of the product and how long you\'ve used it',
                      'Any defects or issues',
                      'Reason for selling',
                      'What\'s included in the sale (box, accessories, warranty)',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
            </Card>

            {/* Tip 2: Real Photos */}
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 bg-teal-100 p-6 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-teal-500 text-white flex items-center justify-center">
                    <Camera className="h-8 w-8" />
                  </div>
                </div>
                <CardContent className="md:w-3/4 p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Badge className="bg-teal-500 text-white">Tip #2</Badge>
                    <h3 className="text-xl font-bold text-slate-800">Use Real Photos</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Clear, real photos build trust and help your ad stand out. Follow these guidelines:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Take photos in good lighting',
                      'Show the actual product, not stock images',
                      'Include close-ups of important details',
                      'Photograph any scratches or defects honestly',
                      'Upload 4-8 photos from different angles',
                      'Use a clean background',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
            </Card>

            {/* Tip 3: Competitive Pricing */}
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 bg-amber-100 p-6 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <DollarSign className="h-8 w-8" />
                  </div>
                </div>
                <CardContent className="md:w-3/4 p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Badge className="bg-amber-500 text-white">Tip #3</Badge>
                    <h3 className="text-xl font-bold text-slate-800">Set Competitive Prices</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Pricing your item correctly is key to selling quickly. Here&apos;s how:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Research similar items on PartsChai',
                      'Check current market prices for new items',
                      'Consider depreciation for used items',
                      'Price slightly higher to allow negotiation room',
                      'Be realistic about your asking price',
                      'Offer bundle discounts for multiple items',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Boost Your Ad&apos;s Visibility</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Get more views and sell faster with these powerful features
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Negotiable Pricing */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">Enable Negotiable Pricing</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Allow buyers to make offers. Being flexible on price attracts more interested buyers and can lead to faster sales.
                </p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Free Feature</Badge>
              </CardContent>
            </Card>

            {/* Boost Your Ad */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">Boost Your Ad</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Get your ad seen by more people with Top Ad, Bump Up, or Featured placements. Prices start from just ৳50.
                </p>
                <Link href="/?page=boost-ad">
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer">
                    Learn More
                  </Badge>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Response */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">Respond Quickly</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Fast responses to buyer questions increase your chances of selling. Try to reply within a few hours.
                </p>
                <Badge variant="secondary" className="bg-teal-100 text-teal-700">Free Tip</Badge>
              </CardContent>
            </Card>

            {/* Membership */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">Become a Member</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Get premium features like auto bump-up, more photos, and a verified seller badge with membership.
                </p>
                <Link href="/?page=membership">
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer">
                    View Plans
                  </Badge>
                </Link>
              </CardContent>
            </Card>

            {/* Complete Profile */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">Complete Your Profile</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Add a profile photo and verify your phone number. Buyers trust sellers with complete profiles more.
                </p>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">Free Feature</Badge>
              </CardContent>
            </Card>

            {/* Post at Right Time */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">Post at Peak Times</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Post your ads in the evening (6-10 PM) or on weekends when more buyers are browsing.
                </p>
                <Badge variant="secondary" className="bg-rose-100 text-rose-700">Free Tip</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help Selling?</h2>
            <p className="text-slate-300 mb-8">
              Our support team is here to help you get the most out of your selling experience
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Card className="bg-white/10 border-white/20 w-full sm:w-auto">
                <CardContent className="p-4 flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-400" />
                  <div className="text-left">
                    <p className="text-xs text-slate-400">Call Us</p>
                    <p className="font-medium">+880 1700-000000</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 w-full sm:w-auto">
                <CardContent className="p-4 flex items-center gap-3">
                  <Mail className="h-5 w-5 text-emerald-400" />
                  <div className="text-left">
                    <p className="text-xs text-slate-400">Email Us</p>
                    <p className="font-medium">support@partschai.com</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/?post-ad=true">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto">
                  Post Your Ad Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/?page=contact">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
