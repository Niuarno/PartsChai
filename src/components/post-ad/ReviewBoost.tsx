'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  ArrowUp,
  AlertTriangle,
  Star,
  Sparkles,
  Image as ImageIcon,
  MapPin,
  Tag,
  FileText,
  Layers,
} from 'lucide-react';
import type { AdFormData, PhotoFile, BoostSelection } from './PostAdWizard';

interface ReviewBoostProps {
  formData: AdFormData;
  photos: PhotoFile[];
  boostSelection: BoostSelection;
  setBoostSelection: React.Dispatch<React.SetStateAction<BoostSelection>>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onSkip: () => void;
}

const boostOptions = [
  {
    id: 'topAd',
    icon: ArrowUp,
    titleEn: 'Top Ad',
    titleBn: 'টপ অ্যাড',
    descEn: 'Appears at the top of search results for maximum visibility',
    descBn: 'সর্বোচ্চ দৃশ্যমানতার জন্য সার্চ রেজাল্টের শীর্ষে প্রদর্শিত হবে',
    price: 199,
    color: 'amber',
  },
  {
    id: 'bumpUp',
    icon: Zap,
    titleEn: 'Bump Up',
    titleBn: 'বাম্প আপ',
    descEn: 'Refreshes your ad to appear new and brings it to the top',
    descBn: 'আপনার বিজ্ঞাপন নতুন হিসেবে রিফ্রেশ করে শীর্ষে নিয়ে আসে',
    price: 99,
    color: 'blue',
  },
  {
    id: 'urgent',
    icon: AlertTriangle,
    titleEn: 'Urgent',
    titleBn: 'জরুরি',
    descEn: 'Highlights your ad with an urgent badge for quick sales',
    descBn: 'দ্রুত বিক্রির জন্য জরুরি ব্যাজ দিয়ে আপনার বিজ্ঞাপন হাইলাইট করে',
    price: 79,
    color: 'red',
  },
  {
    id: 'featured',
    icon: Sparkles,
    titleEn: 'Featured',
    titleBn: 'ফিচার্ড',
    descEn: 'Shows on homepage featured section for more exposure',
    descBn: 'আরও এক্সপোজারের জন্য হোমপেজ ফিচার্ড সেকশনে প্রদর্শিত হবে',
    price: 149,
    color: 'purple',
  },
];

export default function ReviewBoost({
  formData,
  photos,
  boostSelection,
  setBoostSelection,
  isSubmitting,
  onSubmit,
  onSkip,
}: ReviewBoostProps) {
  const { language } = useLanguageStore();
  const t = translations[language];

  const calculateTotalBoostCost = () => {
    return boostOptions.reduce((total, option) => {
      if (boostSelection[option.id as keyof BoostSelection]) {
        return total + option.price;
      }
      return total;
    }, 0);
  };

  const toggleBoost = (id: keyof BoostSelection) => {
    setBoostSelection(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {language === 'en' ? 'Review Your Ad' : 'আপনার বিজ্ঞাপন পর্যালোচনা করুন'}
        </h2>
        <p className="text-slate-500">
          {language === 'en'
            ? 'Make sure everything looks good before posting'
            : 'পোস্ট করার আগে সবকিছু ঠিক আছে কিনা নিশ্চিত হন'}
        </p>
      </div>

      {/* Ad Summary Card */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            {language === 'en' ? 'Ad Summary' : 'বিজ্ঞাপন সারাংশ'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Layers className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{language === 'en' ? 'Category' : 'ক্যাটাগরি'}</p>
              <p className="font-medium text-slate-700">
                {language === 'bn' && formData.category?.nameBn
                  ? formData.category.nameBn
                  : formData.category?.nameEn}
                {formData.subCategory && formData.subCategory.id !== formData.category?.id && (
                  <span className="text-slate-400">
                    {' → '}
                    {language === 'bn' && formData.subCategory.nameBn
                      ? formData.subCategory.nameBn
                      : formData.subCategory.nameEn}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Tag className="h-5 w-5 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-500">{language === 'en' ? 'Title' : 'শিরোনাম'}</p>
              <p className="font-medium text-slate-700 truncate">{formData.title}</p>
            </div>
          </div>

          {/* Price & Condition */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-600 font-bold text-sm">{t.currency}</span>
            </div>
            <div>
              <p className="text-sm text-slate-500">{language === 'en' ? 'Price' : 'দাম'}</p>
              <div className="flex items-center gap-2">
                <p className="font-bold text-emerald-600 text-lg">
                  {t.currency} {parseFloat(formData.price).toLocaleString()}
                </p>
                {formData.isPriceNegotiable && (
                  <Badge variant="secondary" className="text-xs">
                    {t.negotiable}
                  </Badge>
                )}
                <Badge 
                  variant={formData.condition === 'new' ? 'default' : 'secondary'}
                  className={formData.condition === 'new' ? 'bg-emerald-500' : ''}
                >
                  {formData.condition === 'new' ? t.new : t.used}
                </Badge>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{language === 'en' ? 'Location' : 'লোকেশন'}</p>
              <p className="font-medium text-slate-700">
                {formData.locationArea && `${formData.locationArea}, `}
                {formData.locationDistrict}, {formData.locationDivision}
              </p>
            </div>
          </div>

          {/* Photos */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <ImageIcon className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{language === 'en' ? 'Photos' : 'ছবি'}</p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-700">{photos.length} {language === 'en' ? 'photos' : 'টি ছবি'}</p>
                {photos.length > 0 && (
                  <div className="flex -space-x-2">
                    {photos.slice(0, 3).map((photo, idx) => (
                      <div
                        key={photo.id}
                        className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                      >
                        <img
                          src={photo.preview}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {photos.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                        +{photos.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description preview */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-500">{language === 'en' ? 'Description' : 'বিবরণ'}</p>
              <p className="text-slate-600 text-sm line-clamp-2">{formData.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Boost Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-800">
            {language === 'en' ? 'Boost Your Ad?' : 'আপনার বিজ্ঞাপন বুস্ট করবেন?'}
          </h3>
          <p className="text-slate-500 text-sm">
            {language === 'en'
              ? 'Get more views and sell faster with boost options'
              : 'বুস্ট অপশন দিয়ে আরও বেশি ভিউ পান এবং দ্রুত বিক্রি করুন'}
          </p>
        </div>

        {/* Boost Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {boostOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = boostSelection[option.id as keyof BoostSelection];
            const colorClasses: Record<string, string> = {
              amber: 'border-amber-300 bg-amber-50',
              blue: 'border-blue-300 bg-blue-50',
              red: 'border-red-300 bg-red-50',
              purple: 'border-purple-300 bg-purple-50',
            };

            return (
              <button
                key={option.id}
                onClick={() => toggleBoost(option.id as keyof BoostSelection)}
                className={cn(
                  'relative text-left p-4 rounded-xl border-2 transition-all',
                  isSelected
                    ? colorClasses[option.color]
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isSelected ? 'bg-white/80' : 'bg-slate-100'
                  )}>
                    <Icon className={cn(
                      'h-5 w-5',
                      isSelected ? 'text-slate-700' : 'text-slate-500'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-700">
                        {language === 'en' ? option.titleEn : option.titleBn}
                      </p>
                      <p className="font-bold text-emerald-600">
                        {t.currency}{option.price}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {language === 'en' ? option.descEn : option.descBn}
                    </p>
                  </div>
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-slate-300'
                  )}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Total cost */}
        {calculateTotalBoostCost() > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">
                  {language === 'en' ? 'Total Boost Cost' : 'মোট বুস্ট খরচ'}
                </p>
                <p className="text-2xl font-bold text-emerald-700">
                  {t.currency} {calculateTotalBoostCost().toLocaleString()}
                </p>
              </div>
              <Badge className="bg-emerald-500">
                {language === 'en' ? 'Boost Selected' : 'বুস্ট নির্বাচিত'}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          variant="ghost"
          onClick={onSkip}
          disabled={isSubmitting}
          className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 order-2 sm:order-1"
        >
          {language === 'en' ? 'Skip for now' : 'এখন বাদ দিন'}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2 order-1 sm:order-2"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⏳</span>
              {language === 'en' ? 'Posting...' : 'পোস্ট হচ্ছে...'}
            </>
          ) : (
            <>
              {language === 'en' ? 'Post Ad' : 'বিজ্ঞাপন পোস্ট করুন'}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Terms notice */}
      <p className="text-xs text-slate-500 text-center">
        {language === 'en'
          ? 'By posting, you agree to our Terms & Conditions. Your ad will be reviewed before going live.'
          : 'পোস্ট করে, আপনি আমাদের শর্তাবলীতে সম্মত হন। আপনার বিজ্ঞাপন লাইভ হওয়ার আগে পর্যালোচনা করা হবে।'}
      </p>
    </div>
  );
}
