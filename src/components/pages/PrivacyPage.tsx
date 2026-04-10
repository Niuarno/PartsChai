'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, ArrowLeft, Cookie, Lock, Eye, Database, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-4">
              <Shield className="h-3 w-3 mr-1" /> Privacy
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-slate-300">Last updated: January 1, 2025</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10">
          {/* Introduction */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">1. Introduction</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              PartsChai (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.
            </p>
            <p className="text-slate-600 leading-relaxed">
              By using PartsChai, you consent to the collection and use of your information as described in this policy.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Data Collection */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-600" />
              2. Information We Collect
            </h2>
            
            <h3 className="font-semibold text-slate-700 mb-3">Personal Information</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              When you register and use our Platform, we may collect:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mb-6">
              <li>Name and email address</li>
              <li>Phone number</li>
              <li>Location (division, district, area)</li>
              <li>Profile photo</li>
              <li>Company name (for business accounts)</li>
              <li>Payment information for premium services</li>
            </ul>

            <h3 className="font-semibold text-slate-700 mb-3">Automatically Collected Information</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We automatically collect certain information when you use our Platform:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Device information (type, operating system, browser)</li>
              <li>IP address and location data</li>
              <li>Browsing history and pages visited</li>
              <li>Search queries</li>
              <li>Time and date of visits</li>
              <li>Referring website addresses</li>
            </ul>
          </div>

          <Separator className="my-8" />

          {/* Data Usage */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-600" />
              3. How We Use Your Information
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We use the information we collect for various purposes:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>To provide and maintain our services</li>
              <li>To process transactions and send related information</li>
              <li>To send promotional communications (with your consent)</li>
              <li>To respond to your inquiries and support requests</li>
              <li>To improve our Platform and user experience</li>
              <li>To detect and prevent fraud and abuse</li>
              <li>To comply with legal obligations</li>
              <li>To personalize content and recommendations</li>
            </ul>
          </div>

          <Separator className="my-8" />

          {/* Data Sharing */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">4. Information Sharing</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li><strong>With other users:</strong> Basic profile information is visible to other users when you post ads or communicate with them</li>
              <li><strong>Service providers:</strong> Third parties who help us operate and improve our Platform</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With your consent:</strong> When you authorize us to share your information</li>
            </ul>
          </div>

          <Separator className="my-8" />

          {/* Cookies */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Cookie className="h-5 w-5 text-emerald-600" />
              5. Cookies & Tracking Technologies
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            
            <div className="grid gap-3 mb-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-slate-800">Essential Cookies</h4>
                  <p className="text-sm text-slate-600">Required for basic functionality like login and security</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-slate-800">Analytics Cookies</h4>
                  <p className="text-sm text-slate-600">Help us understand how you use our Platform</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-slate-800">Marketing Cookies</h4>
                  <p className="text-sm text-slate-600">Used to deliver relevant advertisements</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-slate-800">Preference Cookies</h4>
                  <p className="text-sm text-slate-600">Remember your settings and preferences</p>
                </CardContent>
              </Card>
            </div>

            <p className="text-slate-600 leading-relaxed">
              You can control cookies through your browser settings. However, disabling certain cookies may affect your ability to use some features of our Platform.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Data Security */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-600" />
              6. Data Security
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure servers and databases</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </div>

          <Separator className="my-8" />

          {/* User Rights */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-600" />
              7. Your Rights
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restriction:</strong> Request limited processing of your data</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              To exercise these rights, please contact us at privacy@partschai.com.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Data Retention */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">8. Data Retention</h2>
            <p className="text-slate-600 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will delete or anonymize your personal information within 30 days, unless retention is required by law.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Children's Privacy */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-slate-600 leading-relaxed">
              Our Platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Policy Updates */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">10. Policy Updates</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through our Platform. Your continued use of our Platform after changes indicates acceptance of the updated policy.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Contact */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">11. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-600">Email: privacy@partschai.com</p>
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
