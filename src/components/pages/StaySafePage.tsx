'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  AlertTriangle,
  Eye,
  MapPin,
  CreditCard,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  UserCheck,
  Flag,
  ArrowRight,
} from 'lucide-react';

export default function StaySafePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-4">
              <Shield className="h-3 w-3 mr-1" /> Safety Guide
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Stay Safe on <span className="text-emerald-400">PartsChai</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300">
              Your safety is our priority. Learn how to buy and sell PC parts securely.
            </p>
          </div>
        </div>
      </section>

      {/* General Safety Tips */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">General Safety Tips</h2>
          </div>
          
          <div className="grid gap-4">
            {[
              {
                icon: Eye,
                title: 'Inspect Before Payment',
                description: 'Always inspect the product thoroughly before making any payment. Check that it matches the description and works as expected.',
                color: 'emerald',
              },
              {
                icon: MapPin,
                title: 'Meet in Public Places',
                description: 'Arrange to meet in safe, public locations like shopping malls, coffee shops, or police stations. Avoid meeting at private addresses.',
                color: 'teal',
              },
              {
                icon: UserCheck,
                title: 'Verify Seller Identity',
                description: 'Check the seller\'s profile, ratings, and history on PartsChai. Verified sellers with good reviews are generally more trustworthy.',
                color: 'blue',
              },
              {
                icon: CreditCard,
                title: 'Pay After Verification',
                description: 'Never pay in advance before seeing the product. Use cash on delivery or pay only after you\'ve verified the item.',
                color: 'amber',
              },
              {
                icon: MessageCircle,
                title: 'Keep Communications on Platform',
                description: 'Use PartsChai chat for all communications. This creates a record and helps us assist you if there\'s an issue.',
                color: 'purple',
              },
            ].map((tip, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full bg-${tip.color}-100 flex items-center justify-center shrink-0`}>
                    <tip.icon className={`h-6 w-6 text-${tip.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{tip.title}</h3>
                    <p className="text-sm text-slate-600">{tip.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scam Warnings */}
      <section className="bg-red-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Scam Warnings</h2>
            </div>
            
            <div className="grid gap-4">
              {[
                {
                  title: 'Fake Payment Services',
                  description: 'Scammers may ask you to use fake payment services or apps. Only use trusted payment methods and never share your banking credentials.',
                  redFlags: ['Requests to use unknown payment apps', 'Links to suspicious websites', 'Asking for OTP or banking PIN'],
                },
                {
                  title: 'Advance Fee Scams',
                  description: 'Never pay any fee before receiving your item. Legitimate sellers don\'t ask for shipping fees, insurance, or customs fees upfront.',
                  redFlags: ['Requests for shipping fees before delivery', 'Customs or insurance charges', 'Asking for advance payments'],
                },
                {
                  title: 'Phishing Emails & Messages',
                  description: 'PartsChai will never ask for your password or personal information via email. Be cautious of fake emails claiming to be from us.',
                  redFlags: ['Suspicious email addresses', 'Requests for password or personal info', 'Urgent action required messages'],
                },
                {
                  title: 'Overpayment Scams',
                  description: 'If a buyer sends more money than agreed and asks for a refund, it\'s likely a scam. The original payment will bounce.',
                  redFlags: ['Buyer sending excess payment', 'Requests to refund the difference', 'Payment via cheque or money order'],
                },
              ].map((scam, index) => (
                <Card key={index} className="border-red-200 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-800">{scam.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{scam.description}</p>
                      </div>
                    </div>
                    <div className="ml-8">
                      <p className="text-xs font-medium text-slate-500 mb-2">Red Flags:</p>
                      <ul className="space-y-1">
                        {scam.redFlags.map((flag, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Protections */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <Lock className="h-5 w-5 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Platform Protections</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Verified Sellers', desc: 'Look for verified badges on seller profiles indicating their identity has been confirmed' },
              { title: 'Secure Messaging', desc: 'All chats are encrypted and monitored for suspicious activity' },
              { title: 'Ad Moderation', desc: 'Every ad is reviewed before going live to prevent fraudulent listings' },
              { title: 'Report System', desc: 'Report suspicious users or ads with one click for quick action' },
              { title: 'Block Users', desc: 'Block any user to prevent them from contacting you' },
              { title: 'Safety Alerts', desc: 'Get notified about common scams in your area' },
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-medium text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Report */}
      <section className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Flag className="h-5 w-5 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold">How to Report a Scam</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                    Report an Ad
                  </h3>
                  <ol className="space-y-2 text-sm text-slate-300">
                    <li>1. Go to the ad details page</li>
                    <li>2. Click &quot;Report Ad&quot; button</li>
                    <li>3. Select the reason for reporting</li>
                    <li>4. Provide additional details</li>
                    <li>5. Submit your report</li>
                  </ol>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-amber-400" />
                    Report a User
                  </h3>
                  <ol className="space-y-2 text-sm text-slate-300">
                    <li>1. Go to the user&apos;s profile</li>
                    <li>2. Click the options menu (⋯)</li>
                    <li>3. Select &quot;Report User&quot;</li>
                    <li>4. Choose the reason</li>
                    <li>5. Submit your report</li>
                  </ol>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-slate-300 mb-4">
                If you&apos;ve been scammed or see suspicious activity, contact us immediately
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Card className="bg-white/10 border-white/20 w-full sm:w-auto">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Phone className="h-5 w-5 text-emerald-400" />
                    <span>+880 1700-000000</span>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20 w-full sm:w-auto">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Mail className="h-5 w-5 text-emerald-400" />
                    <span>safety@partschai.com</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-2">Stay Safe, Trade Smart</h3>
            <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
              Remember: If a deal seems too good to be true, it probably is. Trust your instincts and report suspicious activity.
            </p>
            <Link href="/?page=contact">
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
                Contact Safety Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
