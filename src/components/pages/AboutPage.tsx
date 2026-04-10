'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Cpu,
  Monitor,
  ShoppingCart,
  Store,
  Users,
  Shield,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  Zap,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-4">
              About PartsChai
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Bangladesh&apos;s Premier{' '}
              <span className="text-emerald-400">PC Parts Marketplace</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300">
              Connecting PC enthusiasts across Bangladesh to buy and sell computer components safely and easily.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-600 mb-4">
              PartsChai was founded with a simple mission: to create the most trusted and efficient marketplace for PC parts in Bangladesh. We believe everyone deserves access to quality computer components at fair prices.
            </p>
            <p className="text-slate-600 mb-6">
              Whether you&apos;re building your first gaming PC, upgrading your workstation, or selling spare parts, PartsChai provides a safe platform with verified sellers and secure transactions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                <Shield className="h-3 w-3 mr-1" /> Safe Trading
              </Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                <Users className="h-3 w-3 mr-1" /> 8,000+ Sellers
              </Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                <MapPin className="h-3 w-3 mr-1" /> 64 Districts
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600">15K+</div>
                <div className="text-sm text-slate-600">Active Listings</div>
              </CardContent>
            </Card>
            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-teal-600">50K+</div>
                <div className="text-sm text-slate-600">Happy Users</div>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-amber-600">16</div>
                <div className="text-sm text-slate-600">Categories</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-100 border-slate-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-slate-700">24/7</div>
                <div className="text-sm text-slate-600">Support</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Can Buy/Sell */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">What You Can Buy & Sell</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From processors to peripherals, find everything you need for your PC build
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: Cpu, name: 'Processors / CPUs', count: '1,234' },
              { icon: Monitor, name: 'Graphics Cards', count: '892' },
              { icon: Cpu, name: 'Motherboards', count: '567' },
              { icon: Zap, name: 'RAM / Memory', count: '456' },
              { icon: Monitor, name: 'Storage (SSD/HDD)', count: '678' },
              { icon: Zap, name: 'Power Supplies', count: '345' },
              { icon: Cpu, name: 'Computer Cases', count: '234' },
              { icon: Monitor, name: 'CPU Coolers', count: '189' },
              { icon: Monitor, name: 'Monitors', count: '423' },
              { icon: Cpu, name: 'Keyboards', count: '312' },
              { icon: Zap, name: 'Mice', count: '287' },
              { icon: Monitor, name: 'Headsets & Audio', count: '198' },
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-200 transition-colors">
                    <item.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-medium text-slate-800 text-sm">{item.name}</h3>
                  <p className="text-xs text-slate-500">{item.count} listings</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">How It Works</h2>
          <p className="text-slate-600">Simple steps to buy or sell on PartsChai</p>
        </div>
        
        {/* For Buyers */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-emerald-600" />
            For Buyers
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: 1, title: 'Browse & Search', desc: 'Find PC parts by category, location, or price' },
              { step: 2, title: 'Contact Seller', desc: 'Chat or call the seller directly' },
              { step: 3, title: 'Inspect & Verify', desc: 'Check the product before buying' },
              { step: 4, title: 'Complete Purchase', desc: 'Pay and pick up your item' },
            ].map((item) => (
              <Card key={item.step} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-sm">
                  {item.step}
                </div>
                <CardContent className="p-6 pt-10">
                  <h4 className="font-semibold text-slate-800 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* For Sellers */}
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Store className="h-5 w-5 text-emerald-600" />
            For Sellers
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: 1, title: 'Create Account', desc: 'Sign up for free in seconds' },
              { step: 2, title: 'Post Your Ad', desc: 'Add photos, description, and price' },
              { step: 3, title: 'Respond to Buyers', desc: 'Answer questions and negotiate' },
              { step: 4, title: 'Sell & Earn', desc: 'Meet buyer and complete sale' },
            ].map((item) => (
              <Card key={item.step} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-teal-100 text-teal-600 font-bold flex items-center justify-center text-sm">
                  {item.step}
                </div>
                <CardContent className="p-6 pt-10">
                  <h4 className="font-semibold text-slate-800 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-slate-300">We&apos;re here to help you with any questions</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-sm text-slate-300">+880 1700-000000</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-sm text-slate-300">support@partschai.com</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Support Hours</h3>
                  <p className="text-sm text-slate-300">Sat-Thu: 9AM - 9PM</p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center">
              <Link href="/?page=contact">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
