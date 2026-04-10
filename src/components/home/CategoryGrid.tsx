'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import {
  Cpu,
  Monitor,
  HardDrive,
  MemoryStick,
  Zap,
  Box,
  Fan,
  Keyboard,
  Mouse,
  Headphones,
  Laptop,
  Wifi,
  Cable,
  Package,
} from 'lucide-react';

interface Category {
  id: string;
  nameEn: string;
  nameBn: string | null;
  slug: string;
  iconUrl: string | null;
  _count?: { ads: number };
}

interface CategoryGridProps {
  categories: Category[];
}

const iconMap: Record<string, React.ReactNode> = {
  'processors-cpus': <Cpu className="h-8 w-8" />,
  'graphics-cards-gpus': <Monitor className="h-8 w-8" />,
  'motherboards': <MemoryStick className="h-8 w-8" />,
  'ram-memory': <MemoryStick className="h-8 w-8" />,
  'storage-ssd-hdd': <HardDrive className="h-8 w-8" />,
  'power-supplies-psus': <Zap className="h-8 w-8" />,
  'computer-cases': <Box className="h-8 w-8" />,
  'cpu-coolers': <Fan className="h-8 w-8" />,
  'monitors': <Monitor className="h-8 w-8" />,
  'keyboards': <Keyboard className="h-8 w-8" />,
  'mice': <Mouse className="h-8 w-8" />,
  'headsets-audio': <Headphones className="h-8 w-8" />,
  'gaming-laptops': <Laptop className="h-8 w-8" />,
  'networking-equipment': <Wifi className="h-8 w-8" />,
  'cables-adapters': <Cable className="h-8 w-8" />,
  'other-pc-components': <Package className="h-8 w-8" />,
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">{t.browseByCategory}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/?category=${category.slug}`}>
            <Card className="group hover:shadow-lg hover:border-emerald-300 transition-all duration-300 cursor-pointer overflow-hidden">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-emerald-600 group-hover:from-emerald-100 group-hover:to-teal-100 transition-colors mb-3">
                  {iconMap[category.slug] || <Package className="h-8 w-8" />}
                </div>
                <h3 className="font-medium text-slate-800 group-hover:text-emerald-600 transition-colors text-sm line-clamp-2 min-h-[40px]">
                  {language === 'bn' ? category.nameBn || category.nameEn : category.nameEn}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {(category._count?.ads || 0).toLocaleString()} {t.ads}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
