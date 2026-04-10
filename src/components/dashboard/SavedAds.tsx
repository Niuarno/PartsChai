'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguageStore, useSavedAdsStore, useAuthStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Image as ImageIcon, Trash2, Eye, Crown, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SavedAd {
  id: string;
  title: string;
  slug: string;
  price: number;
  isPriceNegotiable: boolean;
  condition: string;
  locationArea?: string;
  locationDistrict?: string;
  locationDivision?: string;
  status: string;
  viewCount: number;
  createdAt: string;
  category: {
    nameEn: string;
    nameBn?: string;
  };
  images: { imageUrl: string; isPrimary: boolean }[];
  user: {
    id: string;
    fullName?: string;
    role: string;
    isVerified?: boolean;
  };
}

export default function SavedAds() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { savedAdIds, removeSavedAd } = useSavedAdsStore();
  const { user } = useAuthStore();
  const [savedAds, setSavedAds] = useState<SavedAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedAds();
  }, [savedAdIds]);

  const fetchSavedAds = async () => {
    if (savedAdIds.length === 0) {
      setSavedAds([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: savedAdIds }),
      });

      if (res.ok) {
        const data = await res.json();
        setSavedAds(data.ads || []);
      }
    } catch (error) {
      console.error('Failed to fetch saved ads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (adId: string) => {
    removeSavedAd(adId);
    setSavedAds((ads) => ads.filter((ad) => ad.id !== adId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD').format(price);
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInDays = Math.floor(diffInSeconds / 86400);

    if (diffInDays < 1) return t.justNow;
    if (diffInDays < 7) return `${diffInDays} ${t.daysAgo}`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} ${t.weeksAgo}`;
    return `${Math.floor(diffInDays / 30)} ${t.monthsAgo}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">{t.savedAds}</h2>
        {savedAds.length > 0 && (
          <p className="text-sm text-slate-500">
            {savedAds.length} saved {savedAds.length === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>

      {savedAds.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">{t.noSavedAds}</p>
            <p className="text-sm text-slate-400 mb-6">{t.startBrowsing}</p>
            <Link href="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Browse Listings
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {savedAds.map((ad) => (
            <Card key={ad.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <Link
                    href={`/?ad=${ad.slug}`}
                    className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 bg-slate-100 block"
                  >
                    {ad.images[0]?.imageUrl ? (
                      <img
                        src={ad.images[0].imageUrl}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    )}
                    {ad.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        +{ad.images.length}
                      </div>
                    )}
                    {ad.status !== 'active' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge className="bg-slate-600">
                          {ad.status === 'sold' ? t.sold : t.expired}
                        </Badge>
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <Link href={`/?ad=${ad.slug}`}>
                          <h3 className="font-semibold text-slate-800 line-clamp-1 hover:text-emerald-600 transition-colors">
                            {ad.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-slate-500 mt-1">
                          {language === 'en' ? ad.category.nameEn : ad.category.nameBn || ad.category.nameEn}
                          {' • '}
                          {ad.locationArea || ad.locationDistrict || ad.locationDivision}
                        </p>

                        {/* Seller Info */}
                        <div className="flex items-center gap-2 mt-2">
                          {ad.user.role === 'member' && (
                            <Badge className="bg-amber-100 text-amber-700 text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              {t.member}
                            </Badge>
                          )}
                          {ad.user.isVerified && (
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                              <BadgeCheck className="h-3 w-3 mr-1" />
                              {t.verified}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(ad.id)}
                        className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Price & Stats */}
                    <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
                      <p className="text-lg font-bold text-emerald-600">
                        ৳ {formatPrice(ad.price)}
                        {ad.isPriceNegotiable && (
                          <span className="text-sm font-normal text-slate-500 ml-1">({t.negotiable})</span>
                        )}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {ad.viewCount}
                        </span>
                        <span>{getTimeAgo(ad.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
