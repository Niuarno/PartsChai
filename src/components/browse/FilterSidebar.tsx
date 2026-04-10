'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguageStore, useLocationStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

// Bangladesh location data
const divisions = [
  { id: '1', nameEn: 'Dhaka', nameBn: 'ঢাকা' },
  { id: '2', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম' },
  { id: '3', nameEn: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: '4', nameEn: 'Khulna', nameBn: 'খুলনা' },
  { id: '5', nameEn: 'Sylhet', nameBn: 'সিলেট' },
  { id: '6', nameEn: 'Rangpur', nameBn: 'রংপুর' },
  { id: '7', nameEn: 'Barishal', nameBn: 'বরিশাল' },
  { id: '8', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
];

const districts: Record<string, { nameEn: string; nameBn: string }[]> = {
  '1': [
    { nameEn: 'Dhaka', nameBn: 'ঢাকা' },
    { nameEn: 'Gazipur', nameBn: 'গাজীপুর' },
    { nameEn: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ' },
    { nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ' },
    { nameEn: 'Narsingdi', nameBn: 'নরসিংদী' },
    { nameEn: 'Tangail', nameBn: 'টাঙ্গাইল' },
  ],
  '2': [
    { nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম' },
    { nameEn: "Cox's Bazar", nameBn: 'কক্সবাজার' },
    { nameEn: 'Feni', nameBn: 'ফেনী' },
    { nameEn: 'Noakhali', nameBn: 'নোয়াখালী' },
    { nameEn: 'Comilla', nameBn: 'কুমিল্লা' },
  ],
  '3': [
    { nameEn: 'Rajshahi', nameBn: 'রাজশাহী' },
    { nameEn: 'Bogra', nameBn: 'বগুড়া' },
    { nameEn: 'Pabna', nameBn: 'পাবনা' },
    { nameEn: 'Natore', nameBn: 'নাটোর' },
  ],
  '4': [
    { nameEn: 'Khulna', nameBn: 'খুলনা' },
    { nameEn: 'Jessore', nameBn: 'যশোর' },
    { nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া' },
  ],
  '5': [
    { nameEn: 'Sylhet', nameBn: 'সিলেট' },
    { nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার' },
    { nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ' },
  ],
  '6': [
    { nameEn: 'Rangpur', nameBn: 'রংপুর' },
    { nameEn: 'Dinajpur', nameBn: 'দিনাজপুর' },
    { nameEn: 'Nilphamari', nameBn: 'নীলফামারী' },
  ],
  '7': [
    { nameEn: 'Barishal', nameBn: 'বরিশাল' },
    { nameEn: 'Bhola', nameBn: 'ভোলা' },
    { nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী' },
  ],
  '8': [
    { nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
    { nameEn: 'Jamalpur', nameBn: 'জামালপুর' },
    { nameEn: 'Netrokona', nameBn: 'নেত্রকোনা' },
  ],
};

// Popular brands for PC parts
const brands = [
  'Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI', 'Gigabyte', 'Corsair', 'Samsung', 
  'Western Digital', 'Seagate', 'Kingston', 'Crucial', 'EVGA', 'Cooler Master',
  'NZXT', 'Logitech', 'Razer', 'SteelSeries'
];

interface FilterState {
  division: string;
  district: string;
  area: string;
  minPrice: string;
  maxPrice: string;
  condition: string;
  adType: string;
  brands: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
  categorySlug?: string;
  className?: string;
}

export default function FilterSidebar({
  filters,
  onFiltersChange,
  onApply,
  onClear,
  categorySlug,
  className,
}: FilterSidebarProps) {
  const { language } = useLanguageStore();
  const { division: storedDivision, district: storedDistrict } = useLocationStore();
  const t = translations[language];
  
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('');
  
  // Get district list when division changes (using useMemo to avoid setState in effect)
  const availableDistricts = selectedDivisionId && districts[selectedDivisionId] 
    ? districts[selectedDivisionId] 
    : [];

  const updateFilter = (key: keyof FilterState, value: string | string[]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleDivisionChange = (divisionId: string) => {
    const division = divisions.find(d => d.id === divisionId);
    setSelectedDivisionId(divisionId);
    updateFilter('division', division ? (language === 'bn' ? division.nameBn : division.nameEn) : '');
    updateFilter('district', '');
    updateFilter('area', '');
  };

  const handleDistrictChange = (districtName: string) => {
    updateFilter('district', districtName);
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    updateFilter('brands', newBrands);
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.division) count++;
    if (filters.district) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.condition && filters.condition !== 'all') count++;
    if (filters.adType && filters.adType !== 'all') count++;
    if (filters.brands.length > 0) count++;
    return count;
  };

  const getName = (en: string, bn: string) => (language === 'bn' ? bn : en);

  return (
    <div className={cn('bg-white rounded-lg border border-slate-200', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-800">{t.filter}</h3>
          {activeFilterCount() > 0 && (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              {activeFilterCount()}
            </Badge>
          )}
        </div>
        {activeFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
          >
            {t.clearAll}
          </Button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="p-4 space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto">
        {/* Location Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <MapPin className="h-4 w-4 text-emerald-600" />
            {t.location}
          </div>
          
          {/* Division Select */}
          <Select value={selectedDivisionId} onValueChange={handleDivisionChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t.division} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Divisions</SelectItem>
              {divisions.map(div => (
                <SelectItem key={div.id} value={div.id}>
                  {getName(div.nameEn, div.nameBn)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* District Select */}
          {selectedDivisionId && availableDistricts.length > 0 && (
            <Select value={filters.district} onValueChange={handleDistrictChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.district} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Districts</SelectItem>
                {availableDistricts.map((dist, idx) => (
                  <SelectItem key={idx} value={getName(dist.nameEn, dist.nameBn)}>
                    {getName(dist.nameEn, dist.nameBn)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-700">{t.priceRange}</div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="minPrice" className="sr-only">{t.minPrice}</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder={t.minPrice}
                value={filters.minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="text-sm"
              />
            </div>
            <span className="text-slate-400">-</span>
            <div className="flex-1">
              <Label htmlFor="maxPrice" className="sr-only">{t.maxPrice}</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder={t.maxPrice}
                value={filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Condition Filter */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-700">{t.conditionFilter}</div>
          <RadioGroup
            value={filters.condition || 'all'}
            onValueChange={(value) => updateFilter('condition', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="condition-all" />
              <Label htmlFor="condition-all" className="text-sm font-normal cursor-pointer">{t.all}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="condition-new" />
              <Label htmlFor="condition-new" className="text-sm font-normal cursor-pointer">{t.new}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="used" id="condition-used" />
              <Label htmlFor="condition-used" className="text-sm font-normal cursor-pointer">{t.used}</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Ad Type Filter */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-700">Ad Type</div>
          <RadioGroup
            value={filters.adType || 'all'}
            onValueChange={(value) => updateFilter('adType', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="adtype-all" />
              <Label htmlFor="adtype-all" className="text-sm font-normal cursor-pointer">{t.all}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="featured" id="adtype-featured" />
              <Label htmlFor="adtype-featured" className="text-sm font-normal cursor-pointer">{t.featured}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regular" id="adtype-regular" />
              <Label htmlFor="adtype-regular" className="text-sm font-normal cursor-pointer">Regular</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Brand Filter - Category Specific */}
        <Separator />
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-700">{t.brand}</div>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => handleBrandToggle(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer truncate">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <div className="p-4 border-t border-slate-200">
        <Button
          onClick={onApply}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {t.apply} {t.filter}
        </Button>
      </div>
    </div>
  );
}

export type { FilterState };
