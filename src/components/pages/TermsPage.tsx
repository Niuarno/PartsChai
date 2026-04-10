'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, ArrowLeft, Calendar } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-4">
              <FileText className="h-3 w-3 mr-1" /> Legal Document
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-slate-300">Last updated: January 1, 2025</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10">
          {/* Introduction */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              By accessing and using PartsChai.com (&quot;the Platform&quot;), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms & Conditions, please do not use our Platform.
            </p>
            <p className="text-slate-600 leading-relaxed">
              PartsChai reserves the right to modify these terms at any time. Your continued use of the Platform following any changes indicates your acceptance of the new terms.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Description of Service */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">2. Description of Service</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              PartsChai is an online marketplace platform that connects buyers and sellers of PC parts and computer components in Bangladesh. We provide:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>A platform for posting and browsing classified advertisements for PC parts</li>
              <li>Messaging and communication tools between buyers and sellers</li>
              <li>User verification and trust features</li>
              <li>Premium membership and advertising services</li>
            </ul>
          </div>

          <Separator className="my-8" />

          {/* Account Registration */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">3. Account Registration</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              To use certain features of the Platform, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Keep your password confidential and not share it with others</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Be at least 18 years of age to create an account</li>
              <li>Not create multiple accounts for deceptive purposes</li>
            </ul>
          </div>

          <Separator className="my-8" />

          {/* User Conduct */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">4. User Conduct & Prohibited Content</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              You agree not to post, upload, or share any content that:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Is illegal, harmful, threatening, abusive, or defamatory</li>
              <li>Infringes on intellectual property rights of others</li>
              <li>Contains malware, viruses, or harmful code</li>
              <li>Promotes discrimination based on race, religion, gender, or other protected characteristics</li>
              <li>Is related to illegal items or activities</li>
              <li>Contains false, misleading, or deceptive information</li>
              <li>Spam or repetitive content</li>
              <li>Personal information of others without consent</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              Prohibited items include but are not limited to: stolen goods, counterfeit products, weapons, drugs, pirated software, and any items banned under Bangladesh law.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Transactions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">5. Transactions & Payments</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              PartsChai is a platform for connecting buyers and sellers. We are not a party to any transaction between users:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>All transactions are solely between the buyer and seller</li>
              <li>PartsChai does not guarantee the quality, safety, or legality of items listed</li>
              <li>We do not verify the accuracy of listings or seller claims</li>
              <li>Payment terms are negotiated directly between parties</li>
              <li>We are not responsible for any loss or damage arising from transactions</li>
            </ul>
          </div>

          <Separator className="my-8" />

          {/* Fees */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">6. Fees & Payments</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              While posting ads is free, we offer premium services for a fee:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Membership plans (Basic, Professional, Enterprise)</li>
              <li>Ad boost services (Top Ad, Bump Up, Featured, Urgent)</li>
              <li>Banner advertising</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              All fees are in Bangladeshi Taka (BDT) and are non-refundable unless otherwise stated. We reserve the right to change our pricing at any time.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Disclaimers */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">7. Disclaimers</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              THE PLATFORM IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, PARTSCHAI DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties that the platform will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy or reliability of content</li>
              <li>Warranties regarding the conduct of users</li>
            </ul>
          </div>

          <Separator className="my-8" />

          {/* Limitation of Liability */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">8. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              PartsChai shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses resulting from your use of or inability to use the Platform.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Intellectual Property */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">9. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              All content on the Platform, including text, graphics, logos, and software, is the property of PartsChai or its content suppliers and is protected by intellectual property laws.
            </p>
            <p className="text-slate-600 leading-relaxed">
              By posting content on the Platform, you grant PartsChai a non-exclusive, worldwide, royalty-free license to use, display, and distribute such content in connection with our services.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Termination */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">10. Termination</h2>
            <p className="text-slate-600 leading-relaxed">
              We may terminate or suspend your account and access to the Platform at our sole discretion, without prior notice, for any reason, including but not limited to violation of these Terms. Upon termination, your right to use the Platform will immediately cease.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Governing Law */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">11. Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Bangladesh. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Contact */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">12. Contact Information</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-600">Email: legal@partschai.com</p>
              <p className="text-slate-600">Phone: +880 1700-000000</p>
              <p className="text-slate-600">Address: Dhaka, Bangladesh</p>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-10 pt-6 border-t">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
