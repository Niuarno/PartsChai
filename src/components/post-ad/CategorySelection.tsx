'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
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
  ChevronDown,
  ChevronUp,
  Check,
  Loader2,
} from 'lucide-react';
import type { AdFormData, CategoryInfo, SubCategoryInfo } from './PostAdWizard';

interface CategorySelectionProps {
  formData: AdFormData;
  setFormData: React.Dispatch<React.SetStateAction<AdFormData>>;
}

const iconMap: Record<string, React.ElementType> = {
  'processors-cpus': Cpu,
  'graphics-cards-gpus': Monitor,
  'motherboards': MemoryStick,
  'ram-memory': MemoryStick,
  'storage-ssd-hdd': HardDrive,
  'power-supplies-psus': Zap,
  'computer-cases': Box,
  'cpu-coolers': Fan,
  'monitors': Monitor,
  'keyboards': Keyboard,
  'mice': Mouse,
  'headsets-audio': Headphones,
  'gaming-laptops': Laptop,
  'networking-equipment': Wifi,
  'cables-adapters': Cable,
  'other-pc-components': Package,
};

export default function CategorySelection({ formData, setFormData }: CategorySelectionProps) {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [subCategories, setSubCategories] = useState<Record<string, SubCategoryInfo[]>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { language } = useLanguageStore();
  const t = translations[language];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        const parentCategories: CategoryInfo[] = [];
        const subCatsMap: Record<string, SubCategoryInfo[]> = {};
        
        data.categories?.forEach((cat: any) => {
          if (!cat.parentId) {
            parentCategories.push({
              id: cat.id,
              nameEn: cat.nameEn,
              nameBn: cat.nameBn,
              slug: cat.slug,
            });
          } else {
            if (!subCatsMap[cat.parentId]) {
              subCatsMap[cat.parentId] = [];
            }
            subCatsMap[cat.parentId].push({
              id: cat.id,
              nameEn: cat.nameEn,
              nameBn: cat.nameBn,
              slug: cat.slug,
              parentId: cat.parentId,
            });
          }
        });
        
        setCategories(parentCategories);
        setSubCategories(subCatsMap);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setFormData(prev => ({
        ...prev,
        category,
        subCategory: null,
      }));
    }
    
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  const handleSubCategorySelect = (subCat: SubCategoryInfo) => {
    setFormData(prev => ({
      ...prev,
      subCategory: subCat,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-slate-600">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.selectCategory}</h2>
        <p className="text-slate-500">
          {language === 'en'
            ? 'Select a category, then choose a sub-category for your item'
            : 'একটি ক্যাটাগরি নির্বাচন করুন, তারপর আপনার আইটেমের জন্য সাব-ক্যাটাগরি চয়ন করুন'}
        </p>
      </div>

      {/* Selected Category Display */}
      {formData.subCategory && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-emerald-600">
                {language === 'en' ? 'Selected:' : 'নির্বাচিত:'}
              </p>
              <p className="font-semibold text-emerald-800">
                {language === 'bn' && formData.category?.nameBn
                  ? formData.category.nameBn
                  : formData.category?.nameEn}
                {' → '}
                {language === 'bn' && formData.subCategory.nameBn
                  ? formData.subCategory.nameBn
                  : formData.subCategory.nameEn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map((category) => {
          const Icon = iconMap[category.slug] || Package;
          const isExpanded = expandedCategory === category.id;
          const isSelected = formData.category?.id === category.id;
          const hasSubCategories = subCategories[category.id]?.length > 0;

          return (
            <div key={category.id} className="col-span-1">
              <Card
                className={cn(
                  'cursor-pointer transition-all duration-200 hover:shadow-md',
                  isSelected && 'ring-2 ring-emerald-500 border-emerald-300',
                  isExpanded && 'shadow-md'
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                        isSelected
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-50 text-emerald-600'
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={cn(
                        'font-medium text-sm line-clamp-2',
                        isSelected ? 'text-emerald-700' : 'text-slate-700'
                      )}>
                        {language === 'bn' && category.nameBn
                          ? category.nameBn
                          : category.nameEn}
                      </span>
                    </div>
                    {hasSubCategories && (
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Sub-categories */}
              {isExpanded && hasSubCategories && (
                <div className="mt-2 ml-4 space-y-2 border-l-2 border-emerald-200 pl-3">
                  {subCategories[category.id].map((subCat) => {
                    const isSubSelected = formData.subCategory?.id === subCat.id;
                    
                    return (
                      <button
                        key={subCat.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubCategorySelect(subCat);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          isSubSelected
                            ? 'bg-emerald-500 text-white font-medium'
                            : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>
                            {language === 'bn' && subCat.nameBn
                              ? subCat.nameBn
                              : subCat.nameEn}
                          </span>
                          {isSubSelected && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No sub-categories fallback */}
      {formData.category && !subCategories[formData.category.id]?.length && (
        <div className="text-center py-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-amber-700 text-sm">
            {language === 'en'
              ? 'No sub-categories available. You can proceed with this category.'
              : 'কোনো সাব-ক্যাটাগরি নেই। আপনি এই ক্যাটাগরি দিয়ে এগিয়ে যেতে পারেন।'}
          </p>
          <button
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                subCategory: {
                  id: prev.category!.id,
                  nameEn: prev.category!.nameEn,
                  nameBn: prev.category!.nameBn,
                  slug: prev.category!.slug,
                  parentId: prev.category!.id,
                },
              }));
            }}
            className="mt-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            {language === 'en' ? 'Proceed with this category' : 'এই ক্যাটাগরি দিয়ে এগিয়ে যান'}
          </button>
        </div>
      )}
    </div>
  );
}
