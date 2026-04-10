'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguageStore, useLocationStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import type { AdFormData } from './PostAdWizard';

interface AdDetailsFormProps {
  formData: AdFormData;
  setFormData: React.Dispatch<React.SetStateAction<AdFormData>>;
}

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

// Category-specific field configurations
const categoryFields: Record<string, {
  fields: { key: string; labelEn: string; labelBn: string; type: 'text' | 'select'; options?: { value: string; labelEn: string; labelBn: string }[] }[];
}> = {
  'processors-cpus': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'select', options: [
        { value: 'intel', labelEn: 'Intel', labelBn: 'ইন্টেল' },
        { value: 'amd', labelEn: 'AMD', labelBn: 'এএমডি' },
      ]},
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', type: 'text' },
      { key: 'generation', labelEn: 'Generation', labelBn: 'জেনারেশন', type: 'text' },
      { key: 'cores', labelEn: 'Cores', labelBn: 'কোর', type: 'text' },
      { key: 'threads', labelEn: 'Threads', labelBn: 'থ্রেড', type: 'text' },
      { key: 'baseClock', labelEn: 'Base Clock (GHz)', labelBn: 'বেস ক্লক (GHz)', type: 'text' },
      { key: 'socket', labelEn: 'Socket', labelBn: 'সকেট', type: 'select', options: [
        { value: 'am4', labelEn: 'AM4', labelBn: 'AM4' },
        { value: 'am5', labelEn: 'AM5', labelBn: 'AM5' },
        { value: 'lga1200', labelEn: 'LGA 1200', labelBn: 'LGA 1200' },
        { value: 'lga1700', labelEn: 'LGA 1700', labelBn: 'LGA 1700' },
        { value: 'lga1851', labelEn: 'LGA 1851', labelBn: 'LGA 1851' },
      ]},
    ],
  },
  'graphics-cards-gpus': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'select', options: [
        { value: 'nvidia', labelEn: 'NVIDIA', labelBn: 'এনভিডিয়া' },
        { value: 'amd', labelEn: 'AMD', labelBn: 'এএমডি' },
        { value: 'intel', labelEn: 'Intel', labelBn: 'ইন্টেল' },
      ]},
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', type: 'text' },
      { key: 'vram', labelEn: 'VRAM', labelBn: 'ভিআরএম', type: 'select', options: [
        { value: '4gb', labelEn: '4 GB', labelBn: '৪ জিবি' },
        { value: '6gb', labelEn: '6 GB', labelBn: '৬ জিবি' },
        { value: '8gb', labelEn: '8 GB', labelBn: '৮ জিবি' },
        { value: '12gb', labelEn: '12 GB', labelBn: '১২ জিবি' },
        { value: '16gb', labelEn: '16 GB', labelBn: '১৬ জিবি' },
        { value: '24gb', labelEn: '24 GB', labelBn: '২৪ জিবি' },
      ]},
      { key: 'memoryType', labelEn: 'Memory Type', labelBn: 'মেমোরি টাইপ', type: 'select', options: [
        { value: 'gddr5', labelEn: 'GDDR5', labelBn: 'GDDR5' },
        { value: 'gddr6', labelEn: 'GDDR6', labelBn: 'GDDR6' },
        { value: 'gddr6x', labelEn: 'GDDR6X', labelBn: 'GDDR6X' },
        { value: 'hbm2e', labelEn: 'HBM2e', labelBn: 'HBM2e' },
      ]},
    ],
  },
  'motherboards': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'select', options: [
        { value: 'asus', labelEn: 'ASUS', labelBn: 'এসুস' },
        { value: 'msi', labelEn: 'MSI', labelBn: 'এমএসআই' },
        { value: 'gigabyte', labelEn: 'Gigabyte', labelBn: 'গিগাবাইট' },
        { value: 'asrock', labelEn: 'ASRock', labelBn: 'এএসরক' },
        { value: 'biostar', labelEn: 'Biostar', labelBn: 'বায়োস্টার' },
      ]},
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', type: 'text' },
      { key: 'socket', labelEn: 'Socket', labelBn: 'সকেট', type: 'select', options: [
        { value: 'am4', labelEn: 'AM4', labelBn: 'AM4' },
        { value: 'am5', labelEn: 'AM5', labelBn: 'AM5' },
        { value: 'lga1200', labelEn: 'LGA 1200', labelBn: 'LGA 1200' },
        { value: 'lga1700', labelEn: 'LGA 1700', labelBn: 'LGA 1700' },
        { value: 'lga1851', labelEn: 'LGA 1851', labelBn: 'LGA 1851' },
      ]},
      { key: 'chipset', labelEn: 'Chipset', labelBn: 'চিপসেট', type: 'text' },
      { key: 'formFactor', labelEn: 'Form Factor', labelBn: 'ফর্ম ফ্যাক্টর', type: 'select', options: [
        { value: 'atx', labelEn: 'ATX', labelBn: 'ATX' },
        { value: 'micro-atx', labelEn: 'Micro ATX', labelBn: 'মাইক্রো ATX' },
        { value: 'mini-itx', labelEn: 'Mini ITX', labelBn: 'মিনি ITX' },
        { value: 'e-atx', labelEn: 'E-ATX', labelBn: 'E-ATX' },
      ]},
    ],
  },
  'ram-memory': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'select', options: [
        { value: 'corsair', labelEn: 'Corsair', labelBn: 'কর্সেয়ার' },
        { value: 'gskill', labelEn: 'G.Skill', labelBn: 'জি.স্কিল' },
        { value: 'kingston', labelEn: 'Kingston', labelBn: 'কিংস্টন' },
        { value: 'team', labelEn: 'Team', labelBn: 'টিম' },
        { value: 'adata', labelEn: 'ADATA', labelBn: 'এডাটা' },
        { value: 'other', labelEn: 'Other', labelBn: 'অন্যান্য' },
      ]},
      { key: 'capacity', labelEn: 'Capacity', labelBn: 'ক্ষমতা', type: 'select', options: [
        { value: '4gb', labelEn: '4 GB', labelBn: '৪ জিবি' },
        { value: '8gb', labelEn: '8 GB', labelBn: '৮ জিবি' },
        { value: '16gb', labelEn: '16 GB', labelBn: '১৬ জিবি' },
        { value: '32gb', labelEn: '32 GB', labelBn: '৩২ জিবি' },
        { value: '64gb', labelEn: '64 GB', labelBn: '৬৪ জিবি' },
      ]},
      { key: 'ramType', labelEn: 'Type', labelBn: 'টাইপ', type: 'select', options: [
        { value: 'ddr4', labelEn: 'DDR4', labelBn: 'DDR4' },
        { value: 'ddr5', labelEn: 'DDR5', labelBn: 'DDR5' },
      ]},
      { key: 'speed', labelEn: 'Speed (MHz)', labelBn: 'স্পিড (MHz)', type: 'text' },
    ],
  },
  'storage-ssd-hdd': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'select', options: [
        { value: 'samsung', labelEn: 'Samsung', labelBn: 'স্যামসাং' },
        { value: 'wd', labelEn: 'Western Digital', labelBn: 'ওয়েস্টার্ন ডিজিটাল' },
        { value: 'seagate', labelEn: 'Seagate', labelBn: 'সিগেট' },
        { value: 'crucial', labelEn: 'Crucial', labelBn: 'ক্রুসিয়াল' },
        { value: 'kingston', labelEn: 'Kingston', labelBn: 'কিংস্টন' },
        { value: 'other', labelEn: 'Other', labelBn: 'অন্যান্য' },
      ]},
      { key: 'storageType', labelEn: 'Type', labelBn: 'টাইপ', type: 'select', options: [
        { value: 'ssd', labelEn: 'SSD', labelBn: 'এসএসডি' },
        { value: 'hdd', labelEn: 'HDD', labelBn: 'এইচডিডি' },
        { value: 'nvme', labelEn: 'NVMe SSD', labelBn: 'এনভিএমই এসএসডি' },
      ]},
      { key: 'capacity', labelEn: 'Capacity', labelBn: 'ক্ষমতা', type: 'select', options: [
        { value: '128gb', labelEn: '128 GB', labelBn: '১২৮ জিবি' },
        { value: '256gb', labelEn: '256 GB', labelBn: '২৫৬ জিবি' },
        { value: '512gb', labelEn: '512 GB', labelBn: '৫১২ জিবি' },
        { value: '1tb', labelEn: '1 TB', labelBn: '১ টিবি' },
        { value: '2tb', labelEn: '2 TB', labelBn: '২ টিবি' },
        { value: '4tb', labelEn: '4 TB', labelBn: '৪ টিবি' },
      ]},
      { key: 'interface', labelEn: 'Interface', labelBn: 'ইন্টারফেস', type: 'select', options: [
        { value: 'sata', labelEn: 'SATA', labelBn: 'SATA' },
        { value: 'nvme-pcie3', labelEn: 'NVMe PCIe 3.0', labelBn: 'NVMe PCIe 3.0' },
        { value: 'nvme-pcie4', labelEn: 'NVMe PCIe 4.0', labelBn: 'NVMe PCIe 4.0' },
        { value: 'nvme-pcie5', labelEn: 'NVMe PCIe 5.0', labelBn: 'NVMe PCIe 5.0' },
      ]},
    ],
  },
  'power-supplies-psus': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'text' },
      { key: 'wattage', labelEn: 'Wattage', labelBn: 'ওয়াটেজ', type: 'select', options: [
        { value: '450w', labelEn: '450W', labelBn: '৪৫০W' },
        { value: '550w', labelEn: '550W', labelBn: '৫৫০W' },
        { value: '650w', labelEn: '650W', labelBn: '৬৫০W' },
        { value: '750w', labelEn: '750W', labelBn: '৭৫০W' },
        { value: '850w', labelEn: '850W', labelBn: '৮৫০W' },
        { value: '1000w', labelEn: '1000W', labelBn: '১০০০W' },
        { value: '1200w', labelEn: '1200W', labelBn: '১২০০W' },
      ]},
      { key: 'efficiency', labelEn: 'Efficiency Rating', labelBn: 'এফিশিয়েন্সি রেটিং', type: 'select', options: [
        { value: '80-plus', labelEn: '80 Plus', labelBn: '80 Plus' },
        { value: '80-plus-bronze', labelEn: '80 Plus Bronze', labelBn: '80 Plus Bronze' },
        { value: '80-plus-silver', labelEn: '80 Plus Silver', labelBn: '80 Plus Silver' },
        { value: '80-plus-gold', labelEn: '80 Plus Gold', labelBn: '80 Plus Gold' },
        { value: '80-plus-platinum', labelEn: '80 Plus Platinum', labelBn: '80 Plus Platinum' },
        { value: '80-plus-titanium', labelEn: '80 Plus Titanium', labelBn: '80 Plus Titanium' },
      ]},
    ],
  },
  'computer-cases': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'text' },
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', type: 'text' },
      { key: 'caseType', labelEn: 'Case Type', labelBn: 'কেস টাইপ', type: 'select', options: [
        { value: 'mid-tower', labelEn: 'Mid Tower', labelBn: 'মিড টাওয়ার' },
        { value: 'full-tower', labelEn: 'Full Tower', labelBn: 'ফুল টাওয়ার' },
        { value: 'mini-itx', labelEn: 'Mini ITX', labelBn: 'মিনি ITX' },
        { value: 'micro-atx', labelEn: 'Micro ATX', labelBn: 'মাইক্রো ATX' },
      ]},
    ],
  },
  'cpu-coolers': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'text' },
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', type: 'text' },
      { key: 'coolerType', labelEn: 'Cooler Type', labelBn: 'কুলার টাইপ', type: 'select', options: [
        { value: 'air', labelEn: 'Air Cooler', labelBn: 'এয়ার কুলার' },
        { value: 'aio-120mm', labelEn: 'AIO 120mm', labelBn: 'AIO 120mm' },
        { value: 'aio-240mm', labelEn: 'AIO 240mm', labelBn: 'AIO 240mm' },
        { value: 'aio-280mm', labelEn: 'AIO 280mm', labelBn: 'AIO 280mm' },
        { value: 'aio-360mm', labelEn: 'AIO 360mm', labelBn: 'AIO 360mm' },
        { value: 'custom-loop', labelEn: 'Custom Loop', labelBn: 'কাস্টম লুপ' },
      ]},
    ],
  },
  'monitors': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'text' },
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', type: 'text' },
      { key: 'screenSize', labelEn: 'Screen Size', labelBn: 'স্ক্রিন সাইজ', type: 'select', options: [
        { value: '21-23', labelEn: '21-23"', labelBn: '২১-২৩"' },
        { value: '24', labelEn: '24"', labelBn: '২৪"' },
        { value: '27', labelEn: '27"', labelBn: '২৭"' },
        { value: '32', labelEn: '32"', labelBn: '৩২"' },
        { value: '34-ultrawide', labelEn: '34" Ultrawide', labelBn: '৩৪" আল্ট্রাওয়াইড' },
        { value: '38-ultrawide', labelEn: '38" Ultrawide', labelBn: '৩৮" আল্ট্রাওয়াইড' },
      ]},
      { key: 'resolution', labelEn: 'Resolution', labelBn: 'রেজোলিউশন', type: 'select', options: [
        { value: '1080p', labelEn: '1080p (FHD)', labelBn: '1080p (FHD)' },
        { value: '1440p', labelEn: '1440p (QHD)', labelBn: '1440p (QHD)' },
        { value: '4k', labelEn: '4K (UHD)', labelBn: '4K (UHD)' },
      ]},
      { key: 'refreshRate', labelEn: 'Refresh Rate', labelBn: 'রিফ্রেশ রেট', type: 'select', options: [
        { value: '60hz', labelEn: '60Hz', labelBn: '60Hz' },
        { value: '75hz', labelEn: '75Hz', labelBn: '75Hz' },
        { value: '120hz', labelEn: '120Hz', labelBn: '120Hz' },
        { value: '144hz', labelEn: '144Hz', labelBn: '144Hz' },
        { value: '165hz', labelEn: '165Hz', labelBn: '165Hz' },
        { value: '240hz', labelEn: '240Hz', labelBn: '240Hz' },
      ]},
    ],
  },
  'keyboards': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'text' },
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', type: 'text' },
      { key: 'switchType', labelEn: 'Switch Type', labelBn: 'সুইচ টাইপ', type: 'select', options: [
        { value: 'mechanical-red', labelEn: 'Mechanical (Red)', labelBn: 'মেকানিক্যাল (রেড)' },
        { value: 'mechanical-blue', labelEn: 'Mechanical (Blue)', labelBn: 'মেকানিক্যাল (ব্লু)' },
        { value: 'mechanical-brown', labelEn: 'Mechanical (Brown)', labelBn: 'মেকানিক্যাল (ব্রাউন)' },
        { value: 'membrane', labelEn: 'Membrane', labelBn: 'মেমব্রেন' },
        { value: 'optical', labelEn: 'Optical', labelBn: 'অপটিক্যাল' },
      ]},
      { key: 'keyboardLayout', labelEn: 'Layout', labelBn: 'লেআউট', type: 'select', options: [
        { value: 'full', labelEn: 'Full Size', labelBn: 'ফুল সাইজ' },
        { value: 'tkl', labelEn: 'TKL (87 keys)', labelBn: 'TKL (৮৭ কী)' },
        { value: '75', labelEn: '75%', labelBn: '৭৫%' },
        { value: '65', labelEn: '65%', labelBn: '৬৫%' },
        { value: '60', labelEn: '60%', labelBn: '৬০%' },
      ]},
    ],
  },
  'mice': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'text' },
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', type: 'text' },
      { key: 'dpi', labelEn: 'Max DPI', labelBn: 'সর্বোচ্চ DPI', type: 'text' },
    ],
  },
  'headsets-audio': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'text' },
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', type: 'text' },
      { key: 'audioType', labelEn: 'Type', labelBn: 'টাইপ', type: 'select', options: [
        { value: 'gaming-headset', labelEn: 'Gaming Headset', labelBn: 'গেমিং হেডসেট' },
        { value: 'studio-headphones', labelEn: 'Studio Headphones', labelBn: 'স্টুডিও হেডফোন' },
        { value: 'speakers', labelEn: 'Speakers', labelBn: 'স্পিকার' },
        { value: 'soundbar', labelEn: 'Soundbar', labelBn: 'সাউন্ডবার' },
      ]},
    ],
  },
  'gaming-laptops': {
    fields: [
      { key: 'laptopBrand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'select', options: [
        { value: 'asus', labelEn: 'ASUS', labelBn: 'এসুস' },
        { value: 'msi', labelEn: 'MSI', labelBn: 'এমএসআই' },
        { value: 'acer', labelEn: 'Acer', labelBn: 'এসার' },
        { value: 'lenovo', labelEn: 'Lenovo', labelBn: 'লেনোভো' },
        { value: 'hp', labelEn: 'HP', labelBn: 'এইচপি' },
        { value: 'dell', labelEn: 'Dell', labelBn: 'ডেল' },
        { value: 'razer', labelEn: 'Razer', labelBn: 'রেজার' },
        { value: 'other', labelEn: 'Other', labelBn: 'অন্যান্য' },
      ]},
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', type: 'text' },
      { key: 'laptopSpecs', labelEn: 'Specifications', labelBn: 'স্পেসিফিকেশন', type: 'text' },
    ],
  },
  'networking-equipment': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'text' },
      { key: 'model', labelEn: 'Model', labelBn: 'মডেল', type: 'text' },
      { key: 'networkType', labelEn: 'Type', labelBn: 'টাইপ', type: 'select', options: [
        { value: 'router', labelEn: 'Router', labelBn: 'রাউটার' },
        { value: 'switch', labelEn: 'Switch', labelBn: 'সুইচ' },
        { value: 'access-point', labelEn: 'Access Point', labelBn: 'অ্যাক্সেস পয়েন্ট' },
        { value: 'network-card', labelEn: 'Network Card', labelBn: 'নেটওয়ার্ক কার্ড' },
        { value: 'modem', labelEn: 'Modem', labelBn: 'মডেম' },
      ]},
    ],
  },
  'cables-adapters': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'text' },
      { key: 'model', labelEn: 'Cable/Adapter Type', labelBn: 'কেবল/অ্যাডাপ্টার টাইপ', type: 'text' },
    ],
  },
  'other-pc-components': {
    fields: [
      { key: 'brand', labelEn: 'Brand', labelBn: 'ব্র্যান্ড', type: 'text' },
      { key: 'model', labelEn: 'Model/Type', labelBn: 'মডেল/টাইপ', type: 'text' },
    ],
  },
};

export default function AdDetailsForm({ formData, setFormData }: AdDetailsFormProps) {
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('');
  
  const { language } = useLanguageStore();
  const t = translations[language];

  const categorySlug = formData.category?.slug || '';
  const categoryConfig = categoryFields[categorySlug];

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDivisionChange = (divisionName: string) => {
    const div = divisions.find(d => 
      (language === 'bn' ? d.nameBn : d.nameEn) === divisionName
    );
    if (div) {
      setSelectedDivisionId(div.id);
      setFormData(prev => ({
        ...prev,
        locationDivision: divisionName,
        locationDistrict: '',
        locationArea: '',
      }));
    }
  };

  const handleDistrictChange = (districtName: string) => {
    setFormData(prev => ({
      ...prev,
      locationDistrict: districtName,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {language === 'en' ? 'Ad Details' : 'বিজ্ঞাপনের বিবরণ'}
        </h2>
        <p className="text-slate-500">
          {language === 'en'
            ? 'Fill in the details about your item'
            : 'আপনার আইটেম সম্পর্কে বিস্তারিত লিখুন'}
        </p>
      </div>

      {/* Common Fields */}
      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="title" className="text-slate-700 font-medium">
              {t.adTitle} <span className="text-red-500">*</span>
            </Label>
            <span className={cn(
              'text-sm',
              formData.title.length > 90 ? 'text-amber-600' : 'text-slate-400'
            )}>
              {formData.title.length}/100
            </span>
          </div>
          <Input
            id="title"
            placeholder={language === 'en' ? 'e.g., Intel Core i7-12700K Processor' : 'যেমন: Intel Core i7-12700K প্রসেসর'}
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value.slice(0, 100))}
            className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="description" className="text-slate-700 font-medium">
              {t.description} <span className="text-red-500">*</span>
            </Label>
            <span className={cn(
              'text-sm',
              formData.description.length > 3800 ? 'text-amber-600' : 'text-slate-400'
            )}>
              {formData.description.length}/4000
            </span>
          </div>
          <Textarea
            id="description"
            placeholder={language === 'en' 
              ? 'Describe your item in detail. Include condition, usage, any accessories included, reason for selling, etc.'
              : 'আপনার আইটেম বিস্তারিত বর্ণনা করুন। অবস্থা, ব্যবহার, কোনো অ্যাক্সেসরি অন্তর্ভুক্ত, বিক্রির কারণ ইত্যাদি উল্লেখ করুন।'}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value.slice(0, 4000))}
            rows={5}
            className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-slate-700 font-medium">
              {t.price} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                {t.currency}
              </span>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="pl-8 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                min="0"
              />
            </div>
          </div>

          {/* Price Negotiable Toggle */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">
              {t.priceNegotiable}
            </Label>
            <div className="flex items-center space-x-3 pt-2">
              <Switch
                id="negotiable"
                checked={formData.isPriceNegotiable}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isPriceNegotiable: checked }))
                }
                className="data-[state=checked]:bg-emerald-500"
              />
              <Label htmlFor="negotiable" className="text-slate-600 cursor-pointer">
                {formData.isPriceNegotiable 
                  ? (language === 'en' ? 'Yes, price is negotiable' : 'হ্যাঁ, দরদাম করা যাবে')
                  : (language === 'en' ? 'No, fixed price' : 'না, নির্দিষ্ট দাম')}
              </Label>
            </div>
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium">
            {t.condition} <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.condition}
            onValueChange={(value) => 
              setFormData(prev => ({ ...prev, condition: value as 'new' | 'used' }))
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" className="text-emerald-500" />
              <Label htmlFor="new" className="cursor-pointer text-slate-600">
                {t.new}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="used" id="used" className="text-emerald-500" />
              <Label htmlFor="used" className="cursor-pointer text-slate-600">
                {t.used}
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium">
            {t.location} <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Division */}
            <Select
              value={formData.locationDivision}
              onValueChange={handleDivisionChange}
            >
              <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                <SelectValue placeholder={t.division} />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((div) => (
                  <SelectItem key={div.id} value={language === 'bn' ? div.nameBn : div.nameEn}>
                    {language === 'bn' ? div.nameBn : div.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* District */}
            <Select
              value={formData.locationDistrict}
              onValueChange={handleDistrictChange}
              disabled={!selectedDivisionId}
            >
              <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                <SelectValue placeholder={t.district} />
              </SelectTrigger>
              <SelectContent>
                {selectedDivisionId && districts[selectedDivisionId]?.map((dist, idx) => (
                  <SelectItem key={idx} value={language === 'bn' ? dist.nameBn : dist.nameEn}>
                    {language === 'bn' ? dist.nameBn : dist.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Area */}
            <Input
              placeholder={t.area}
              value={formData.locationArea}
              onChange={(e) => handleInputChange('locationArea', e.target.value)}
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Category-Specific Fields */}
      {categoryConfig && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                {language === 'bn' && formData.category?.nameBn
                  ? formData.category.nameBn
                  : formData.category?.nameEn}
              </Badge>
              {language === 'en' ? 'Specifications' : 'স্পেসিফিকেশন'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryConfig.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    {language === 'bn' ? field.labelBn : field.labelEn}
                  </Label>
                  {field.type === 'text' ? (
                    <Input
                      value={(formData as any)[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder={language === 'bn' ? field.labelBn : field.labelEn}
                      className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  ) : field.type === 'select' && field.options ? (
                    <Select
                      value={(formData as any)[field.key] || ''}
                      onValueChange={(value) => handleInputChange(field.key, value)}
                    >
                      <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue placeholder={language === 'en' ? 'Select...' : 'নির্বাচন করুন...'} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {language === 'bn' ? option.labelBn : option.labelEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Messages */}
      <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-4">
        <p className="font-medium text-slate-700 mb-2">
          {language === 'en' ? 'Required fields:' : 'আবশ্যক ক্ষেত্র:'}
        </p>
        <ul className="space-y-1">
          <li className={cn(
            'flex items-center gap-2',
            formData.title.length >= 5 ? 'text-emerald-600' : 'text-slate-500'
          )}>
            <span>{formData.title.length >= 5 ? '✓' : '○'}</span>
            {language === 'en' ? 'Title (minimum 5 characters)' : 'শিরোনাম (কমপক্ষে ৫ অক্ষর)'}
          </li>
          <li className={cn(
            'flex items-center gap-2',
            formData.description.length >= 20 ? 'text-emerald-600' : 'text-slate-500'
          )}>
            <span>{formData.description.length >= 20 ? '✓' : '○'}</span>
            {language === 'en' ? 'Description (minimum 20 characters)' : 'বিবরণ (কমপক্ষে ২০ অক্ষর)'}
          </li>
          <li className={cn(
            'flex items-center gap-2',
            formData.price !== '' ? 'text-emerald-600' : 'text-slate-500'
          )}>
            <span>{formData.price !== '' ? '✓' : '○'}</span>
            {language === 'en' ? 'Price' : 'দাম'}
          </li>
          <li className={cn(
            'flex items-center gap-2',
            formData.locationDivision !== '' ? 'text-emerald-600' : 'text-slate-500'
          )}>
            <span>{formData.locationDivision !== '' ? '✓' : '○'}</span>
            {language === 'en' ? 'Location (Division & District)' : 'লোকেশন (বিভাগ ও জেলা)'}
          </li>
        </ul>
      </div>
    </div>
  );
}
