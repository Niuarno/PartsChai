'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Clock,
  Eye,
  Share2,
  Heart,
  Edit,
  Trash2,
  Zap,
  CheckCircle,
  Tag,
  ChevronRight,
  AlertTriangle,
  BadgeCheck,
  Crown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useLanguageStore, useAuthStore, useSavedAdsStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import ImageGallery from './ImageGallery';
import SellerPanel from './SellerPanel';
import ReportAdModal from './ReportAdModal';
import AdCard from '@/components/ads/AdCard';

interface AdDetailPageProps {
  slug: string;
}

interface AdDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  isPriceNegotiable: boolean;
  condition: string;
  locationDivision?: string;
  locationDistrict?: string;
  locationArea?: string;
  adReferenceId: string;
  viewCount: number;
  isFeatured: boolean;
  isUrgent: boolean;
  isTopAd: boolean;
  status: string;
  createdAt: string;
  publishedAt?: string;
  user: {
    id: string;
    fullName?: string;
    companyName?: string;
    phone?: string;
    role: string;
    isVerified: boolean;
    accountType: string;
    createdAt: string;
    avatarUrl?: string;
  };
  category: {
    id: string;
    nameEn: string;
    nameBn?: string;
    slug: string;
  };
  subCategory?: {
    id: string;
    nameEn: string;
    nameBn?: string;
    slug: string;
  };
  images: {
    id: string;
    imageUrl: string;
    displayOrder: number;
    isPrimary: boolean;
  }[];
  attributes: {
    id: string;
    attributeKey: string;
    attributeValue: string;
  }[];
}

export default function AdDetailPage({ slug }: AdDetailPageProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { user, isAuthenticated } = useAuthStore();
  const { savedAdIds, addSavedAd, removeSavedAd } = useSavedAdsStore();
  const router = useRouter();

  const [ad, setAd] = useState<AdDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedAds, setRelatedAds] = useState<any[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const isSaved = ad ? savedAdIds.includes(ad.id) : false;
  const isOwner = ad && user && ad.user.id === user.id;

  // Fetch ad details
  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/ads/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError(language === 'bn' ? 'বিজ্ঞাপন পাওয়া যায়নি' : 'Ad not found');
          } else {
            setError(t.somethingWentWrong);
          }
          return;
        }
        const data = await response.json();
        setAd(data.ad);

        // Fetch related ads
        if (data.ad.category?.id) {
          const relatedResponse = await fetch(
            `/api/ads?category=${data.ad.category.slug}&limit=6&exclude=${data.ad.id}`
          );
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedAds(relatedData.ads.filter((a: any) => a.id !== data.ad.id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Error fetching ad:', err);
        setError(t.somethingWentWrong);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAd();
    }
  }, [slug, language, t.somethingWentWrong]);

  // Handler functions
  const handleSaveToggle = () => {
    if (!ad) return;
    if (isSaved) {
      removeSavedAd(ad.id);
    } else {
      addSavedAd(ad.id);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: ad?.title,
          url: url,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      // Could show a toast here
    }
  };

  const handleMarkAsSold = async () => {
    if (!ad) return;
    try {
      const response = await fetch(`/api/ads/${ad.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sold' }),
      });
      if (response.ok) {
        setAd({ ...ad, status: 'sold' });
      }
    } catch (err) {
      console.error('Error marking as sold:', err);
    }
  };

  const handleDelete = async () => {
    if (!ad) return;
    try {
      const response = await fetch(`/api/ads/${ad.slug}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.push('/');
      }
    } catch (err) {
      console.error('Error deleting ad:', err);
    }
  };

  const handleBoost = () => {
    // Navigate to boost page or show boost modal
    router.push(`/?boost=${ad?.id}`);
  };

  // Time ago function
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInSeconds < 60) return t.justNow;
    if (diffInMinutes < 60) return `${diffInMinutes} ${t.minutesAgo}`;
    if (diffInHours < 24) return `${diffInHours} ${t.hoursAgo}`;
    if (diffInDays < 7) return `${diffInDays} ${t.daysAgo}`;
    if (diffInWeeks < 4) return `${diffInWeeks} ${t.weeksAgo}`;
    return `${diffInMonths} ${t.monthsAgo}`;
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !ad) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-700 mb-2">
            {error || (language === 'bn' ? 'বিজ্ঞাপন পাওয়া যায়নি' : 'Ad Not Found')}
          </h2>
          <p className="text-slate-500 mb-6">
            {language === 'bn'
              ? 'এই বিজ্ঞাপনটি আর উপলব্ধ নেই বা মুছে ফেলা হয়েছে।'
              : 'This ad is no longer available or has been removed.'}
          </p>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              {language === 'bn' ? 'হোমে ফিরে যান' : 'Go Back Home'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format dates
  const createdAt = new Date(ad.createdAt);
  const formattedDate = language === 'bn'
    ? createdAt.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    : createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeAgo = getTimeAgo(createdAt);

  // Build location string
  const locationParts = [ad.locationArea, ad.locationDistrict, ad.locationDivision].filter(Boolean);
  const locationString = locationParts.join(', ') || (language === 'bn' ? 'লোকেশন নেই' : 'Location not specified');

  // Get attribute label
  const getAttributeLabel = (key: string): string => {
    const labels: Record<string, { en: string; bn: string }> = {
      brand: { en: 'Brand', bn: 'ব্র্যান্ড' },
      model: { en: 'Model', bn: 'মডেল' },
      condition: { en: 'Condition', bn: 'অবস্থা' },
      warranty: { en: 'Warranty', bn: 'ওয়ারেন্টি' },
      purchaseDate: { en: 'Purchase Date', bn: 'ক্রয়ের তারিখ' },
      usageDuration: { en: 'Usage Duration', bn: 'ব্যবহারের সময়কাল' },
      reasonForSelling: { en: 'Reason for Selling', bn: 'বিক্রির কারণ' },
    };
    return labels[key]?.[language] || key;
  };

  // Filter out empty attributes
  const validAttributes = ad.attributes.filter(attr => attr.attributeValue);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-4 sm:mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              {t.home}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/?category=${ad.category.slug}`}>
              {language === 'bn' && ad.category.nameBn ? ad.category.nameBn : ad.category.nameEn}
            </BreadcrumbLink>
          </BreadcrumbItem>
          {ad.subCategory && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/?category=${ad.subCategory.slug}`}>
                  {language === 'bn' && ad.subCategory.nameBn ? ad.subCategory.nameBn : ad.subCategory.nameEn}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[200px] truncate">
              {ad.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Image Gallery */}
          <ImageGallery images={ad.images} title={ad.title} />

          {/* Ad Info Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              {/* Title and Badges */}
              <div className="flex flex-wrap items-start gap-2 mb-3">
                {ad.isTopAd && (
                  <Badge className="bg-amber-500 text-white">
                    {t.topAd}
                  </Badge>
                )}
                {ad.isFeatured && (
                  <Badge className="bg-purple-500 text-white">
                    {t.featured}
                  </Badge>
                )}
                {ad.isUrgent && (
                  <Badge className="bg-red-500 text-white">
                    {t.urgent}
                  </Badge>
                )}
                {ad.status === 'sold' && (
                  <Badge className="bg-slate-500 text-white">
                    {t.sold}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-3">
                {ad.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-emerald-600">
                  ৳ {formatPrice(ad.price)}
                </span>
                {ad.isPriceNegotiable && (
                  <Badge variant="secondary" className="text-emerald-700">
                    ({t.negotiable})
                  </Badge>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span>{locationString}</span>
              </div>

              {/* Category Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Link href={`/?category=${ad.category.slug}`}>
                  <Badge variant="outline" className="hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer">
                    <Tag className="h-3 w-3 mr-1" />
                    {language === 'bn' && ad.category.nameBn ? ad.category.nameBn : ad.category.nameEn}
                  </Badge>
                </Link>
                {ad.subCategory && (
                  <Link href={`/?category=${ad.subCategory.slug}`}>
                    <Badge variant="outline" className="hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {language === 'bn' && ad.subCategory.nameBn ? ad.subCategory.nameBn : ad.subCategory.nameEn}
                    </Badge>
                  </Link>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{t.postedOn} {formattedDate}</span>
                  <span className="text-slate-400">•</span>
                  <span>{timeAgo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{ad.viewCount.toLocaleString()} {t.views}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span>{t.adId}:</span>
                  <span className="font-mono">{ad.adReferenceId}</span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  {t.share}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveToggle}
                  className={cn(
                    'gap-1',
                    isSaved && 'text-red-500 border-red-200 hover:bg-red-50'
                  )}
                >
                  <Heart className={cn('h-4 w-4', isSaved && 'fill-current')} />
                  {t.save}
                </Button>
              </div>

              {/* Owner Action Buttons */}
              {isOwner && (
                <>
                  <Separator className="my-4" />
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-emerald-800 mb-3">
                      {language === 'bn' ? 'আপনার বিজ্ঞাপন পরিচালনা করুন' : 'Manage Your Ad'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/?edit=${ad.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Edit className="h-4 w-4" />
                          {t.edit}
                        </Button>
                      </Link>
                      {ad.status !== 'sold' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1">
                              <CheckCircle className="h-4 w-4" />
                              {t.markAsSold}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {language === 'bn' ? 'বিক্রিত হিসেবে চিহ্নিত করুন?' : 'Mark as Sold?'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {language === 'bn'
                                  ? 'এই বিজ্ঞাপনটি বিক্রিত হিসেবে চিহ্নিত করা হবে। এটি আর অনুসন্ধানে দেখাবে না।'
                                  : 'This ad will be marked as sold and will no longer appear in search results.'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                              <AlertDialogAction onClick={handleMarkAsSold}>
                                {t.markAsSold}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBoost}
                        className="gap-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <Zap className="h-4 w-4" />
                        {t.boost}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1 text-red-600 border-red-200 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                            {t.delete}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {language === 'bn' ? 'বিজ্ঞাপন মুছে ফেলুন?' : 'Delete Ad?'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {language === 'bn'
                                ? 'এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না। আপনার বিজ্ঞাপন স্থায়ীভাবে মুছে যাবে।'
                                : 'This action cannot be undone. This will permanently delete your ad.'}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {t.delete}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.description}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none whitespace-pre-wrap">
                {ad.description || (language === 'bn' ? 'কোনো বিবরণ নেই।' : 'No description provided.')}
              </div>
            </CardContent>
          </Card>

          {/* Specifications Card */}
          {validAttributes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.specifications}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {/* Always show condition */}
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">{t.condition}</span>
                    <span className="font-medium">
                      {ad.condition === 'new' ? t.new : t.used}
                    </span>
                  </div>
                  {validAttributes.map((attr) => (
                    <div key={attr.id} className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">{getAttributeLabel(attr.attributeKey)}</span>
                      <span className="font-medium">{attr.attributeValue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Report Link (Non-owner) */}
          {!isOwner && (
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="text-sm text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <AlertTriangle className="h-4 w-4" />
              {t.reportAd}
            </button>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <SellerPanel
            seller={ad.user}
            adId={ad.id}
            activeAdsCount={0} // Will be fetched separately
            isOwner={!!isOwner}
          />
        </div>
      </div>

      {/* Related Ads Section */}
      {relatedAds.length > 0 && (
        <section className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">
            {language === 'bn' ? 'সম্পর্কিত বিজ্ঞাপন' : 'Related Ads'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedAds.map((relatedAd) => (
              <AdCard
                key={relatedAd.id}
                ad={{
                  ...relatedAd,
                  isPriceNegotiable: relatedAd.isPriceNegotiable ?? true,
                  condition: relatedAd.condition || 'used',
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Report Modal */}
      <ReportAdModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        adId={ad.id}
        adTitle={ad.title}
      />
    </div>
  );
}
