'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdCard from '@/components/ads/AdCard';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/translations';

interface Ad {
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
}

interface FeaturedAdsProps {
  ads: Ad[];
}

export default function FeaturedAds({ ads }: FeaturedAdsProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  if (ads.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{t.featuredAds}</h2>
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="h-8 w-8 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="h-8 w-8 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ads.map((ad) => (
          <div key={ad.id} className="w-72 shrink-0">
            <AdCard ad={ad} />
          </div>
        ))}
      </div>
    </section>
  );
}
