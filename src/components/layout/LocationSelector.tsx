'use client';

import { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLocationStore, useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

// Bangladesh divisions data
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
  '1': [ // Dhaka
    { nameEn: 'Dhaka', nameBn: 'ঢাকা' },
    { nameEn: 'Gazipur', nameBn: 'গাজীপুর' },
    { nameEn: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ' },
    { nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ' },
    { nameEn: 'Narsingdi', nameBn: 'নরসিংদী' },
    { nameEn: 'Tangail', nameBn: 'টাঙ্গাইল' },
  ],
  '2': [ // Chattogram
    { nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম' },
    { nameEn: "Cox's Bazar", nameBn: 'কক্সবাজার' },
    { nameEn: 'Feni', nameBn: 'ফেনী' },
    { nameEn: 'Noakhali', nameBn: 'নোয়াখালী' },
    { nameEn: 'Comilla', nameBn: 'কুমিল্লা' },
  ],
  '3': [ // Rajshahi
    { nameEn: 'Rajshahi', nameBn: 'রাজশাহী' },
    { nameEn: 'Bogra', nameBn: 'বগুড়া' },
    { nameEn: 'Pabna', nameBn: 'পাবনা' },
    { nameEn: 'Natore', nameBn: 'নাটোর' },
  ],
  '4': [ // Khulna
    { nameEn: 'Khulna', nameBn: 'খুলনা' },
    { nameEn: 'Jessore', nameBn: 'যশোর' },
    { nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া' },
  ],
  '5': [ // Sylhet
    { nameEn: 'Sylhet', nameBn: 'সিলেট' },
    { nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার' },
    { nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ' },
  ],
  '6': [ // Rangpur
    { nameEn: 'Rangpur', nameBn: 'রংপুর' },
    { nameEn: 'Dinajpur', nameBn: 'দিনাজপুর' },
    { nameEn: 'Nilphamari', nameBn: 'নীলফামারী' },
  ],
  '7': [ // Barishal
    { nameEn: 'Barishal', nameBn: 'বরিশাল' },
    { nameEn: 'Bhola', nameBn: 'ভোলা' },
    { nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী' },
  ],
  '8': [ // Mymensingh
    { nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
    { nameEn: 'Jamalpur', nameBn: 'জামালপুর' },
    { nameEn: 'Netrokona', nameBn: 'নেত্রকোনা' },
  ],
};

export default function LocationSelector() {
  const [open, setOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const { division, district, setLocation, clearLocation } = useLocationStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const getDisplayName = () => {
    if (!division) {
      return t.allOfBangladesh;
    }
    if (district) {
      return language === 'bn' 
        ? district 
        : district;
    }
    return division;
  };

  const handleSelectDivision = (divId: string, divName: string) => {
    setSelectedDivision(divId);
    setLocation(divName, null);
  };

  const handleSelectDistrict = (districtName: string) => {
    const divName = divisions.find(d => d.id === selectedDivision);
    setLocation(divName?.nameEn || null, districtName);
    setOpen(false);
  };

  const handleClearLocation = () => {
    clearLocation();
    setSelectedDivision(null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 h-auto"
        >
          <MapPin className="h-4 w-4 text-emerald-600" />
          <span className="font-medium">{getDisplayName()}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-slate-50">
            <span className="font-medium text-slate-700">{t.selectLocation}</span>
            {division && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearLocation}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
              >
                {t.clearAll}
              </Button>
            )}
          </div>

          {/* All Bangladesh Option */}
          <button
            onClick={handleClearLocation}
            className={cn(
              "flex items-center justify-between px-4 py-2.5 hover:bg-emerald-50 text-left w-full",
              !division && "bg-emerald-50"
            )}
          >
            <span className="font-medium text-slate-700">{t.allOfBangladesh}</span>
            {!division && <Check className="h-4 w-4 text-emerald-600" />}
          </button>

          {/* Divisions */}
          <div className="border-t max-h-64 overflow-y-auto">
            <div className="p-2 text-xs text-slate-500 font-medium uppercase tracking-wide bg-slate-50">
              {t.division}
            </div>
            {divisions.map((div) => (
              <div key={div.id}>
                <button
                  onClick={() => handleSelectDivision(div.id, language === 'bn' ? div.nameBn : div.nameEn)}
                  className={cn(
                    "flex items-center justify-between px-4 py-2 hover:bg-emerald-50 text-left w-full",
                    selectedDivision === div.id && "bg-emerald-50"
                  )}
                >
                  <span className="text-slate-700">
                    {language === 'bn' ? div.nameBn : div.nameEn}
                  </span>
                  {division === (language === 'bn' ? div.nameBn : div.nameEn) && !district && (
                    <Check className="h-4 w-4 text-emerald-600" />
                  )}
                </button>
                
                {/* Show districts when division is selected */}
                {selectedDivision === div.id && districts[div.id] && (
                  <div className="bg-slate-50 border-t border-b">
                    {districts[div.id].map((dist, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectDistrict(language === 'bn' ? dist.nameBn : dist.nameEn)}
                        className={cn(
                          "flex items-center justify-between px-6 py-2 hover:bg-emerald-50 text-left w-full text-sm",
                          district === (language === 'bn' ? dist.nameBn : dist.nameEn) && "bg-emerald-50 text-emerald-700"
                        )}
                      >
                        <span>{language === 'bn' ? dist.nameBn : dist.nameEn}</span>
                        {district === (language === 'bn' ? dist.nameBn : dist.nameEn) && (
                          <Check className="h-4 w-4 text-emerald-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
