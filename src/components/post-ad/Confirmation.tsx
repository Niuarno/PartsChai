'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import {
  CheckCircle2,
  Plus,
  List,
  Home,
  Clock,
  Copy,
  Check,
  PartyPopper,
} from 'lucide-react';
import { useState } from 'react';

interface ConfirmationProps {
  adReferenceId: string | null;
  onPostAnother: () => void;
  onClose?: () => void;
}

export default function Confirmation({ 
  adReferenceId, 
  onPostAnother, 
  onClose 
}: ConfirmationProps) {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language];
  const router = useRouter();

  const displayId = adReferenceId || `AD-${Date.now().toString(36).toUpperCase()}`;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(displayId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleViewMyAds = () => {
    if (onClose) {
      onClose();
    }
    router.push('/?my-ads=true');
  };

  const handleGoHome = () => {
    if (onClose) {
      onClose();
    }
    router.push('/');
  };

  return (
    <div className="text-center py-8">
      {/* Success Animation */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        </div>
        <div className="absolute top-0 right-1/2 transform translate-x-16">
          <PartyPopper className="h-8 w-8 text-amber-400 animate-pulse" />
        </div>
      </div>

      {/* Success Message */}
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        {language === 'en' ? 'Congratulations!' : 'অভিনন্দন!'}
      </h2>
      <p className="text-lg text-emerald-600 font-medium mb-6">
        {t.adSubmitted}
      </p>

      {/* Ad Reference ID Card */}
      <Card className="border-emerald-200 bg-emerald-50/50 max-w-sm mx-auto mb-6">
        <CardContent className="p-4">
          <p className="text-sm text-slate-500 mb-2">
            {language === 'en' ? 'Your Ad Reference ID' : 'আপনার বিজ্ঞাপন রেফারেন্স আইডি'}
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-mono font-bold text-slate-800">
              {displayId}
            </span>
            <button
              onClick={handleCopyId}
              className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
              title={language === 'en' ? 'Copy ID' : 'আইডি কপি করুন'}
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4 text-slate-500" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Status Info */}
      <div className="flex items-center justify-center gap-2 text-slate-600 mb-8">
        <Clock className="h-4 w-4" />
        <span className="text-sm">
          {language === 'en'
            ? 'Your ad is under review and will be live within 24 hours'
            : 'আপনার বিজ্ঞাপন পর্যালোচনাধীন এবং ২৪ ঘন্টার মধ্যে লাইভ হবে'}
        </span>
      </div>

      {/* What's Next */}
      <div className="bg-slate-50 rounded-xl p-4 mb-8 max-w-md mx-auto">
        <p className="text-sm font-medium text-slate-700 mb-3">
          {language === 'en' ? "What's next?" : 'এরপর কী?'}
        </p>
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-emerald-600">1</span>
            </div>
            <span>
              {language === 'en'
                ? 'We\'ll review your ad for quality and compliance'
                : 'আমরা গুণমান এবং সম্মতির জন্য আপনার বিজ্ঞাপন পর্যালোচনা করব'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-emerald-600">2</span>
            </div>
            <span>
              {language === 'en'
                ? 'Once approved, your ad will go live'
                : 'অনুমোদিত হলে, আপনার বিজ্ঞাপন লাইভ হবে'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-emerald-600">3</span>
            </div>
            <span>
              {language === 'en'
                ? 'You\'ll be notified when buyers contact you'
                : 'ক্রেতারা যোগাযোগ করলে আপনাকে জানানো হবে'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={onPostAnother}
          variant="outline"
          className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 gap-2"
        >
          <Plus className="h-4 w-4" />
          {language === 'en' ? 'Post Another Ad' : 'আরেকটি বিজ্ঞাপন পোস্ট করুন'}
        </Button>
        
        <Button
          onClick={handleViewMyAds}
          variant="outline"
          className="border-slate-300 text-slate-600 hover:bg-slate-50 gap-2"
        >
          <List className="h-4 w-4" />
          {t.myAds}
        </Button>
        
        <Button
          onClick={handleGoHome}
          className="bg-emerald-600 hover:bg-emerald-700 gap-2"
        >
          <Home className="h-4 w-4" />
          {language === 'en' ? 'Go to Homepage' : 'হোমপেজে যান'}
        </Button>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-md mx-auto">
        <p className="text-sm font-medium text-amber-800 mb-2">
          💡 {language === 'en' ? 'Pro Tip' : 'প্রো টিপ'}
        </p>
        <p className="text-sm text-amber-700">
          {language === 'en'
            ? 'Respond quickly to buyer messages to sell faster! Enable notifications to never miss an inquiry.'
            : 'দ্রুত বিক্রি করতে ক্রেতার বার্তায় দ্রুত সাড়া দিন! কোনো অনুসন্ধান মিস না করতে নোটিফিকেশন সক্রিয় করুন।'}
        </p>
      </div>
    </div>
  );
}
