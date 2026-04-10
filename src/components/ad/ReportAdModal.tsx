'use client';

import { useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguageStore, useAuthStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReportAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  adTitle: string;
}

const reportReasons = {
  en: [
    { value: 'fraud', label: 'Fraud or Scam' },
    { value: 'counterfeit', label: 'Counterfeit or Fake Item' },
    { value: 'prohibited', label: 'Prohibited Item' },
    { value: 'wrong_category', label: 'Wrong Category' },
    { value: 'duplicate', label: 'Duplicate Ad' },
    { value: 'no_response', label: 'Seller Not Responding' },
    { value: 'item_sold', label: 'Item Already Sold' },
    { value: 'incorrect_price', label: 'Incorrect Price Information' },
    { value: 'inappropriate', label: 'Inappropriate Content' },
    { value: 'other', label: 'Other' },
  ],
  bn: [
    { value: 'fraud', label: 'জালিয়াতি বা স্ক্যাম' },
    { value: 'counterfeit', label: 'নকল বা জাল পণ্য' },
    { value: 'prohibited', label: 'নিষিদ্ধ পণ্য' },
    { value: 'wrong_category', label: 'ভুল ক্যাটাগরি' },
    { value: 'duplicate', label: 'ডুপ্লিকেট বিজ্ঞাপন' },
    { value: 'no_response', label: 'বিক্রেতা সাড়া দিচ্ছে না' },
    { value: 'item_sold', label: 'পণ্য ইতিমধ্যে বিক্রি হয়েছে' },
    { value: 'incorrect_price', label: 'ভুল মূল্য তথ্য' },
    { value: 'inappropriate', label: 'অনুপযুক্ত বিষয়বস্তু' },
    { value: 'other', label: 'অন্যান্য' },
  ],
};

export default function ReportAdModal({ isOpen, onClose, adId, adTitle }: ReportAdModalProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { isAuthenticated, user } = useAuthStore();

  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const reasons = reportReasons[language];

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      return;
    }

    if (!reason) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adId,
          reason,
          description: description || null,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          setReason('');
          setDescription('');
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setReason('');
      setDescription('');
      setSubmitStatus('idle');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {t.reportAd}
          </DialogTitle>
          <DialogDescription>
            {language === 'bn'
              ? `"${adTitle}" বিজ্ঞাপনটি রিপোর্ট করুন`
              : `Report this ad: "${adTitle}"`}
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <Alert>
            <AlertDescription>
              {language === 'bn'
                ? 'রিপোর্ট করতে অনুগ্রহ করে লগইন করুন।'
                : 'Please login to report this ad.'}
            </AlertDescription>
          </Alert>
        ) : submitStatus === 'success' ? (
          <Alert className="bg-emerald-50 border-emerald-200">
            <AlertDescription className="text-emerald-700">
              {language === 'bn'
                ? 'আপনার রিপোর্ট সফলভাবে জমা দেওয়া হয়েছে।'
                : 'Your report has been submitted successfully.'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4 py-4">
            {/* Reason Selector */}
            <div className="space-y-2">
              <Label htmlFor="reason">
                {language === 'bn' ? 'কারণ' : 'Reason'} <span className="text-red-500">*</span>
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder={language === 'bn' ? 'কারণ নির্বাচন করুন' : 'Select a reason'} />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                {language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Additional Details'}
              </Label>
              <Textarea
                id="description"
                placeholder={
                  language === 'bn'
                    ? 'আপনার রিপোর্টের বিস্তারিত বিবরণ দিন...'
                    : 'Provide additional details about your report...'
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-slate-500 text-right">
                {description.length}/500
              </p>
            </div>

            {submitStatus === 'error' && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-700">
                  {t.somethingWentWrong}. {t.pleaseTryAgain}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t.cancel}
          </Button>
          {isAuthenticated && submitStatus !== 'success' && (
            <Button
              onClick={handleSubmit}
              disabled={!reason || isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {language === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t.submit}
                </span>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
