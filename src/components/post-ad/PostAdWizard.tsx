'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguageStore, useAuthStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Package,
  FileText,
  Image,
  Rocket,
  CheckCircle2,
} from 'lucide-react';
import CategorySelection from './CategorySelection';
import AdDetailsForm from './AdDetailsForm';
import PhotoUpload from './PhotoUpload';
import ReviewBoost from './ReviewBoost';
import Confirmation from './Confirmation';

export interface CategoryInfo {
  id: string;
  nameEn: string;
  nameBn: string | null;
  slug: string;
}

export interface SubCategoryInfo {
  id: string;
  nameEn: string;
  nameBn: string | null;
  slug: string;
  parentId: string;
}

export interface AdFormData {
  // Category
  category: CategoryInfo | null;
  subCategory: SubCategoryInfo | null;
  // Common fields
  title: string;
  description: string;
  price: string;
  isPriceNegotiable: boolean;
  condition: 'new' | 'used';
  locationDivision: string;
  locationDistrict: string;
  locationArea: string;
  // Category-specific fields
  brand: string;
  model: string;
  // CPU specific
  generation?: string;
  cores?: string;
  threads?: string;
  baseClock?: string;
  socket?: string;
  // GPU specific
  vram?: string;
  memoryType?: string;
  // Motherboard specific
  chipset?: string;
  formFactor?: string;
  // RAM specific
  capacity?: string;
  ramType?: string;
  speed?: string;
  // Storage specific
  storageType?: string;
  interface?: string;
  // PSU specific
  wattage?: string;
  efficiency?: string;
  // Case specific
  caseType?: string;
  // Monitor specific
  screenSize?: string;
  resolution?: string;
  refreshRate?: string;
  // Cooler specific
  coolerType?: string;
  // Keyboard specific
  switchType?: string;
  keyboardLayout?: string;
  // Mouse specific
  dpi?: string;
  // Audio specific
  audioType?: string;
  // Laptop specific
  laptopBrand?: string;
  laptopSpecs?: string;
  // Networking specific
  networkType?: string;
}

export interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  isCover: boolean;
}

export interface BoostSelection {
  topAd: boolean;
  bumpUp: boolean;
  urgent: boolean;
  featured: boolean;
}

const STEPS = [
  { id: 1, title: 'Category', icon: Package },
  { id: 2, title: 'Details', icon: FileText },
  { id: 3, title: 'Photos', icon: Image },
  { id: 4, title: 'Review', icon: Rocket },
  { id: 5, title: 'Done', icon: CheckCircle2 },
];

const initialFormData: AdFormData = {
  category: null,
  subCategory: null,
  title: '',
  description: '',
  price: '',
  isPriceNegotiable: true,
  condition: 'used',
  locationDivision: '',
  locationDistrict: '',
  locationArea: '',
  brand: '',
  model: '',
};

interface PostAdWizardProps {
  onClose?: () => void;
}

export default function PostAdWizard({ onClose }: PostAdWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AdFormData>(initialFormData);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [boostSelection, setBoostSelection] = useState<BoostSelection>({
    topAd: false,
    bumpUp: false,
    urgent: false,
    featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAdId, setSubmittedAdId] = useState<string | null>(null);

  const { language } = useLanguageStore();
  const { isAuthenticated } = useAuthStore();
  const t = translations[language];
  const router = useRouter();

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.subCategory !== null;
      case 2:
        return (
          formData.title.trim().length >= 5 &&
          formData.description.trim().length >= 20 &&
          formData.price !== '' &&
          parseFloat(formData.price) >= 0 &&
          formData.locationDivision !== '' &&
          formData.locationDistrict !== ''
        );
      case 3:
        return photos.length >= 1;
      case 4:
        return true;
      default:
        return true;
    }
  }, [currentStep, formData, photos]);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      router.push('/?login=true');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form data for submission
      const submitData = new FormData();
      submitData.append('categoryId', formData.category?.id || '');
      submitData.append('subCategoryId', formData.subCategory?.id || '');
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('isPriceNegotiable', String(formData.isPriceNegotiable));
      submitData.append('condition', formData.condition);
      submitData.append('locationDivision', formData.locationDivision);
      submitData.append('locationDistrict', formData.locationDistrict);
      submitData.append('locationArea', formData.locationArea);
      submitData.append('brand', formData.brand);
      submitData.append('model', formData.model);

      // Add category-specific fields
      const categorySpecificFields = [
        'generation', 'cores', 'threads', 'baseClock', 'socket',
        'vram', 'memoryType', 'chipset', 'formFactor', 'capacity',
        'ramType', 'speed', 'storageType', 'interface', 'wattage',
        'efficiency', 'caseType', 'screenSize', 'resolution', 'refreshRate',
        'coolerType', 'switchType', 'keyboardLayout', 'dpi', 'audioType',
        'laptopBrand', 'laptopSpecs', 'networkType',
      ];

      categorySpecificFields.forEach(field => {
        const value = formData[field as keyof AdFormData];
        if (value) {
          submitData.append(field, value as string);
        }
      });

      // Add boost selections
      submitData.append('boostTopAd', String(boostSelection.topAd));
      submitData.append('boostBumpUp', String(boostSelection.bumpUp));
      submitData.append('boostUrgent', String(boostSelection.urgent));
      submitData.append('boostFeatured', String(boostSelection.featured));

      // Add photos
      photos.forEach((photo, index) => {
        submitData.append(`photo${index}`, photo.file);
      });
      submitData.append('coverPhotoIndex', String(photos.findIndex(p => p.isCover)));

      const response = await fetch('/api/ads', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmittedAdId(result.adReferenceId);
        setCurrentStep(5);
      } else {
        console.error('Failed to submit ad:', result.error);
        alert(result.error || t.somethingWentWrong);
      }
    } catch (error) {
      console.error('Error submitting ad:', error);
      alert(t.somethingWentWrong);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostAnother = () => {
    setCurrentStep(1);
    setFormData(initialFormData);
    setPhotos([]);
    setBoostSelection({
      topAd: false,
      bumpUp: false,
      urgent: false,
      featured: false,
    });
    setSubmittedAdId(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CategorySelection
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <AdDetailsForm
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <PhotoUpload
            photos={photos}
            setPhotos={setPhotos}
          />
        );
      case 4:
        return (
          <ReviewBoost
            formData={formData}
            photos={photos}
            boostSelection={boostSelection}
            setBoostSelection={setBoostSelection}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onSkip={() => handleSubmit()}
          />
        );
      case 5:
        return (
          <Confirmation
            adReferenceId={submittedAdId}
            onPostAnother={handlePostAnother}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b bg-slate-50 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800">
              {t.postYourAd}
            </CardTitle>
            {onClose && currentStep < 5 && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                {t.cancel}
              </Button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-3">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      isActive
                        ? 'text-emerald-600'
                        : isCompleted
                        ? 'text-emerald-500'
                        : 'text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isActive
                          ? 'border-emerald-600 bg-emerald-50'
                          : isCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </CardContent>
        
        {/* Footer Navigation */}
        {currentStep < 5 && (
          <div className="border-t bg-slate-50 px-6 py-4 flex-shrink-0">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t.previous}
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                  {t.next}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : currentStep === 4 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                  {isSubmitting ? 'Submitting...' : t.submit}
                  {!isSubmitting && <Check className="h-4 w-4" />}
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
