'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, MessageCircle, FileText, User, CreditCard, Shield, Tag, ArrowRight } from 'lucide-react';

const faqData = {
  posting: {
    title: 'Posting Ads',
    icon: Tag,
    questions: [
      {
        question: 'How do I post an ad on PartsChai?',
        answer: 'To post an ad, click the "Post Free Ad" button in the header. You\'ll need to create an account or log in first. Then, select a category, fill in your ad details including title, description, price, and upload photos. Submit your ad for review, and it will be live within 24 hours.',
      },
      {
        question: 'How many photos can I upload?',
        answer: 'Free users can upload up to 5 photos per ad. Members can upload up to 10 photos for Basic plan, 15 for Professional, and 20 for Enterprise plan. Clear, real photos help your ad get more views and sell faster.',
      },
      {
        question: 'Why was my ad rejected?',
        answer: 'Ads may be rejected if they violate our content guidelines. Common reasons include: prohibited items, incomplete information, misleading descriptions, stock images instead of real photos, or duplicate postings. Check your email for specific rejection reasons.',
      },
      {
        question: 'How long do ads stay active?',
        answer: 'Standard ads remain active for 30 days. After that, they expire and can be renewed. Premium members get extended ad duration based on their plan. You can also boost your ad to keep it visible longer.',
      },
      {
        question: 'Can I edit my ad after posting?',
        answer: 'Yes, you can edit your ad anytime from your dashboard. Go to "My Ads", find your ad, and click "Edit". Changes are subject to review and may take up to 24 hours to reflect.',
      },
    ],
  },
  account: {
    title: 'Account',
    icon: User,
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click "Register" in the header and fill in your details including name, email, phone number, and password. Verify your phone number via OTP, and you\'re ready to start buying and selling. Registration is free!',
      },
      {
        question: 'How do I verify my account?',
        answer: 'Phone verification is automatic during registration via OTP. For additional verification (which shows a verified badge on your profile), go to Settings > Verification and submit the required documents.',
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page. Enter your registered email address, and we\'ll send you a password reset link. Follow the link to create a new password.',
      },
      {
        question: 'Can I change my phone number?',
        answer: 'Yes, go to Settings > Profile and click "Change Phone Number". You\'ll need to verify the new number via OTP. Your old number will be removed from your account.',
      },
      {
        question: 'How do I delete my account?',
        answer: 'Go to Settings > Account > Delete Account. Please note that deleting your account will remove all your ads, messages, and saved data. This action cannot be undone.',
      },
    ],
  },
  buying: {
    title: 'Buying',
    icon: MessageCircle,
    questions: [
      {
        question: 'How do I contact a seller?',
        answer: 'On the ad details page, you can use the "Chat" button to send a message, or click "Show Phone Number" to call the seller directly. We recommend chatting first to discuss details before meeting.',
      },
      {
        question: 'Is there buyer protection?',
        answer: 'PartsChai is a marketplace platform connecting buyers and sellers. We don\'t handle payments or guarantee transactions. We recommend inspecting items in person before payment and meeting in safe, public places.',
      },
      {
        question: 'How do I save an ad for later?',
        answer: 'Click the heart icon on any ad to save it to your favorites. You can view saved ads anytime from your dashboard under "Saved Ads". You\'ll also get notifications if the price changes.',
      },
      {
        question: 'Can I negotiate the price?',
        answer: 'Many sellers enable "Negotiable" pricing. You can make an offer through the chat. Be respectful and reasonable with your offers. The seller may accept, decline, or counter-offer.',
      },
      {
        question: 'What if the item is not as described?',
        answer: 'Always inspect items before payment. If there\'s an issue after purchase, try to resolve it directly with the seller. You can report misleading ads through the "Report Ad" button.',
      },
    ],
  },
  membership: {
    title: 'Membership',
    icon: FileText,
    questions: [
      {
        question: 'What are the benefits of membership?',
        answer: 'Members enjoy benefits like auto bump-up, free top ad vouchers, more photos per ad, online shop/storefront, verified seller badge, ad analytics, and dedicated customer support. Higher tiers offer more features.',
      },
      {
        question: 'How much does membership cost?',
        answer: 'Basic membership starts at ৳499/month, Professional at ৳999/month, and Enterprise at ৳1,999/month. Save 20% with annual billing. View all plans on the Membership page.',
      },
      {
        question: 'Can I upgrade or downgrade my plan?',
        answer: 'Yes, you can change your plan anytime from your dashboard. When upgrading, you\'ll be charged the prorated difference. When downgrading, the new rate applies from your next billing cycle.',
      },
      {
        question: 'How do I cancel my membership?',
        answer: 'Go to Settings > Membership > Cancel Subscription. Your membership will remain active until the end of your current billing period. You won\'t be charged further.',
      },
      {
        question: 'Are there refunds for membership?',
        answer: 'Membership fees are non-refundable. However, if you experience issues with our services, please contact support and we\'ll work to resolve your concerns.',
      },
    ],
  },
  payments: {
    title: 'Payments',
    icon: CreditCard,
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'For membership and ad boost payments, we accept bKash, Nagad, Rocket, credit/debit cards, and bank transfer. Transaction payments between buyers and sellers are handled independently.',
      },
      {
        question: 'How do I pay for ad boosts?',
        answer: 'When you select a boost option, you\'ll be directed to our secure payment page. Choose your preferred payment method, complete the transaction, and your boost will be activated immediately.',
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption and partner with trusted payment providers. We never store your full card details on our servers. All transactions are processed securely.',
      },
      {
        question: 'What if my payment fails?',
        answer: 'If your payment fails, please check your account balance or card details. Try again with a different payment method. If the issue persists, contact your payment provider or our support team.',
      },
      {
        question: 'Can I get a refund for ad boosts?',
        answer: 'Ad boost purchases are non-refundable once activated. If you experience technical issues with your boost, please contact support within 24 hours for assistance.',
      },
    ],
  },
  safety: {
    title: 'Safety',
    icon: Shield,
    questions: [
      {
        question: 'How do I stay safe when buying?',
        answer: 'Always inspect items before payment, meet in public places, check seller profiles and reviews, keep communication on our platform, and never share personal financial information. Read our Safety Guide for more tips.',
      },
      {
        question: 'How do I report a scam or suspicious activity?',
        answer: 'Click "Report" on any ad or user profile. You can also email safety@partschai.com or call our safety hotline. We investigate all reports and take appropriate action.',
      },
      {
        question: 'What should I do if I\'ve been scammed?',
        answer: 'If you\'ve been scammed, report it immediately to us and to local law enforcement. Provide all relevant details including chat history, transaction information, and any identifying details of the scammer.',
      },
      {
        question: 'How do I block a user?',
        answer: 'Go to the user\'s profile, click the options menu (⋯), and select "Block User". Blocked users cannot contact you or view your ads. You can unblock users from your Settings.',
      },
      {
        question: 'Are seller profiles verified?',
        answer: 'Look for the "Verified" badge on seller profiles, which indicates their identity has been confirmed. "Member" badges indicate paid membership. Always check seller reviews and history before transacting.',
      },
    ],
  },
};

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState('posting');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-4">
              <HelpCircle className="h-3 w-3 mr-1" /> Help Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-slate-300">
              Find answers to common questions about buying, selling, and using PartsChai
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="posting" className="w-full">
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8 h-auto flex-wrap">
              {Object.entries(faqData).map(([key, category]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex items-center gap-2 px-3 py-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                >
                  <category.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(faqData).map(([key, category]) => (
              <TabsContent key={key} value={key}>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <category.icon className="h-5 w-5 text-emerald-600" />
                      {category.title}
                    </h2>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left text-slate-700 hover:text-emerald-600">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-slate-600">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-8 md:p-12 text-center">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Our support team is here to help you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/?page=contact">
                <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/?page=stay-safe">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Safety Guide
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
