'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Image as ImageIcon, BadgeCheck, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguageStore, useSavedAdsStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface AdCardProps {
  ad: {
    id: string;
    title: string;
    slug: string;
    price: number;
    isPriceNegotiable: boolean;
    condition: string;
    locationArea?: string;
    locationDistrict?: string;
    locationDivision?: string;
    createdAt: string;
    isFeatured: boolean;
    isUrgent: boolean;
    isTopAd: boolean;
    images: { imageUrl: string; isPrimary: boolean }[];
    user: {
      id: string;
      fullName?: string;
      role: string;
      isVerified?: boolean;
    };
    category: {
      nameEn: string;
      nameBn?: string;
    };
  };
  variant?: 'grid' | 'list' | 'horizontal';
}

export default function AdCard({ ad, variant = 'grid' }: AdCardProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { savedAdIds, addSavedAd, removeSavedAd } = useSavedAdsStore();
  const [isHovered, setIsHovered] = useState(false);

  const isSaved = savedAdIds.includes(ad.id);
  const primaryImage = ad.images.find((img) => img.isPrimary)?.imageUrl || ad.images[0]?.imageUrl;
  const imageCount = ad.images.length;
  const timeAgo = getTimeAgo(new Date(ad.createdAt), language);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeSavedAd(ad.id);
    } else {
      addSavedAd(ad.id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (variant === 'list') {
    return (
      <Link href={`/?ad=${ad.slug}`}>
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-emerald-300">
          <div className="flex">
            {/* Image */}
            <div className="relative w-48 h-36 shrink-0 bg-slate-100">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon className="h-12 w-12" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {ad.isTopAd && (
                  <Badge className="bg-amber-500 text-white text-xs">Top Ad</Badge>
                )}
                {ad.isFeatured && (
                  <Badge className="bg-purple-500 text-white text-xs">{t.featured}</Badge>
                )}
                {ad.isUrgent && (
                  <Badge className="bg-red-500 text-white text-xs">{t.urgent}</Badge>
                )}
              </div>

              {/* Image Count */}
              {imageCount > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                  +{imageCount} photos
                </div>
              )}
            </div>

            {/* Content */}
            <CardContent className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {ad.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {ad.category.nameEn} • {ad.locationArea || ad.locationDistrict || ad.locationDivision}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveToggle}
                  className={cn(
                    'shrink-0',
                    isSaved ? 'text-red-500 hover:text-red-600' : 'text-slate-400 hover:text-red-500'
                  )}
                >
                  <Heart className={cn('h-5 w-5', isSaved && 'fill-current')} />
                </Button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-xl font-bold text-emerald-600">
                  ৳ {formatPrice(ad.price)}
                  {ad.isPriceNegotiable && (
                    <span className="text-sm font-normal text-slate-500 ml-1">({t.negotiable})</span>
                  )}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  {ad.user.role === 'member' && (
                    <Badge className="bg-amber-100 text-amber-700">
                      <Crown className="h-3 w-3 mr-1" />
                      {t.member}
                    </Badge>
                  )}
                  {ad.user.isVerified && (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <BadgeCheck className="h-3 w-3 mr-1" />
                      {t.verified}
                    </Badge>
                  )}
                  <span>{timeAgo}</span>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  // Grid variant (default)
  return (
    <Link href={`/?ad=${ad.slug}`}>
      <Card
        className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-emerald-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={ad.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <ImageIcon className="h-16 w-16" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {ad.isTopAd && (
              <Badge className="bg-amber-500 text-white text-xs shadow">Top Ad</Badge>
            )}
            {ad.isFeatured && (
              <Badge className="bg-purple-500 text-white text-xs shadow">{t.featured}</Badge>
            )}
            {ad.isUrgent && (
              <Badge className="bg-red-500 text-white text-xs shadow">{t.urgent}</Badge>
            )}
          </div>

          {/* Member Badge */}
          <div className="absolute top-2 right-2">
            {ad.user.role === 'member' && (
              <Badge className="bg-amber-500/90 text-white text-xs shadow">
                <Crown className="h-3 w-3 mr-1" />
                {t.member}
              </Badge>
            )}
            {ad.user.isVerified && (
              <Badge className="bg-emerald-500/90 text-white text-xs shadow mt-1">
                <BadgeCheck className="h-3 w-3 mr-1" />
                {t.verified}
              </Badge>
            )}
          </div>

          {/* Image Count */}
          {imageCount > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {imageCount}
            </div>
          )}

          {/* Save Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSaveToggle}
            className={cn(
              'absolute bottom-2 left-2 w-8 h-8 bg-white/90 hover:bg-white transition-all',
              isSaved ? 'text-red-500' : 'text-slate-400',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Heart className={cn('h-4 w-4', isSaved && 'fill-current')} />
          </Button>
        </div>

        {/* Content */}
        <CardContent className="p-3">
          <h3 className="font-semibold text-slate-800 line-clamp-2 group-hover:text-emerald-600 transition-colors min-h-[48px]">
            {ad.title}
          </h3>

          <div className="mt-2 space-y-1">
            <p className="text-lg font-bold text-emerald-600">
              ৳ {formatPrice(ad.price)}
              {ad.isPriceNegotiable && (
                <span className="text-xs font-normal text-slate-500 ml-1">({t.negotiable})</span>
              )}
            </p>

            <p className="text-sm text-slate-500 truncate">
              {ad.locationArea || ad.locationDistrict || ad.locationDivision}
            </p>

            <p className="text-xs text-slate-400">
              {timeAgo}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function getTimeAgo(date: Date, language: 'en' | 'bn'): string {
  const t = translations[language];
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
}
