'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import {
  Upload,
  Image as ImageIcon,
  X,
  Star,
  GripVertical,
  Camera,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import type { PhotoFile } from './PostAdWizard';

interface PhotoUploadProps {
  photos: PhotoFile[];
  setPhotos: React.Dispatch<React.SetStateAction<PhotoFile[]>>;
}

const MAX_PHOTOS = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function PhotoUpload({ photos, setPhotos }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguageStore();
  const t = translations[language];

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const processFiles = (files: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(files);
    const remainingSlots = MAX_PHOTOS - photos.length;

    if (remainingSlots <= 0) {
      setError(language === 'en' 
        ? `Maximum ${MAX_PHOTOS} photos allowed` 
        : `সর্বোচ্চ ${MAX_PHOTOS} টি ছবি অনুমোদিত`);
      return;
    }

    const filesToAdd = fileArray.slice(0, remainingSlots);
    const newPhotos: PhotoFile[] = [];

    for (const file of filesToAdd) {
      // Validate file
      let validationError: string | null = null;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        validationError = language === 'en' 
          ? 'Only JPG, PNG, and WEBP files are allowed'
          : 'শুধুমাত্র JPG, PNG এবং WEBP ফাইল অনুমোদিত';
      } else if (file.size > MAX_FILE_SIZE) {
        validationError = language === 'en'
          ? 'File size must be less than 5MB'
          : 'ফাইলের আকার ৫MB এর কম হতে হবে';
      }
      
      if (validationError) {
        setError(validationError);
        continue;
      }

      const preview = URL.createObjectURL(file);
      newPhotos.push({
        id: generateId(),
        file,
        preview,
        isCover: photos.length === 0 && newPhotos.length === 0,
      });
    }

    if (newPhotos.length > 0) {
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => {
      const updated = prev.filter(p => p.id !== id);
      // If we removed the cover photo, make the first one the cover
      if (updated.length > 0 && !updated.some(p => p.isCover)) {
        updated[0].isCover = true;
      }
      return updated;
    });
  };

  const handleSetCover = (id: string) => {
    setPhotos(prev => prev.map(p => ({
      ...p,
      isCover: p.id === id,
    })));
  };

  // Drag-to-reorder handlers
  const handlePhotoDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Add a ghost image
    const ghost = e.target as HTMLElement;
    ghost.style.opacity = '0.5';
  };

  const handlePhotoDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
    const ghost = e.target as HTMLElement;
    ghost.style.opacity = '1';
  };

  const handlePhotoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDropTargetIndex(index);
    }
  };

  const handlePhotoDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    setPhotos(prev => {
      const updated = [...prev];
      const [draggedPhoto] = updated.splice(draggedIndex, 1);
      updated.splice(dropIndex, 0, draggedPhoto);
      
      // Ensure first photo is always the cover
      return updated.map((p, i) => ({
        ...p,
        isCover: i === 0,
      }));
    });

    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach(p => URL.revokeObjectURL(p.preview));
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {t.uploadPhotos}
        </h2>
        <p className="text-slate-500">
          {language === 'en'
            ? 'Add up to 5 photos. First photo will be your cover image.'
            : 'সর্বোচ্চ ৫টি ছবি যোগ করুন। প্রথম ছবি আপনার কভার ইমেজ হবে।'}
        </p>
      </div>

      {/* Photo count indicator */}
      <div className="flex items-center justify-center gap-2">
        <Badge 
          variant={photos.length >= 1 ? 'default' : 'secondary'}
          className={cn(
            'text-sm py-1.5 px-3',
            photos.length >= 1 
              ? 'bg-emerald-500 hover:bg-emerald-600' 
              : 'bg-slate-200 text-slate-600'
          )}
        >
          {photos.length} / {MAX_PHOTOS} {language === 'en' ? 'photos' : 'টি ছবি'}
        </Badge>
        {photos.length >= 1 && (
          <Badge className="bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Minimum requirement met' : 'সর্বনিম্ন প্রয়োজন পূরণ হয়েছে'}
          </Badge>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Drop zone */}
      {photos.length < MAX_PHOTOS && (
        <div
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
            isDragging
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50'
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          
          <div className="flex flex-col items-center">
            <div className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors',
              isDragging ? 'bg-emerald-100' : 'bg-slate-100'
            )}>
              {isDragging ? (
                <ImageIcon className="h-8 w-8 text-emerald-500" />
              ) : (
                <Upload className="h-8 w-8 text-slate-400" />
              )}
            </div>
            
            <p className="text-slate-700 font-medium mb-2">
              {t.dragDropPhotos}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Camera className="h-4 w-4" />
                JPG, PNG, WEBP
              </span>
              <span>•</span>
              <span>{language === 'en' ? 'Max 5MB each' : 'প্রতিটি সর্বোচ্চ ৫MB'}</span>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="mt-4 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
            >
              {language === 'en' ? 'Choose Files' : 'ফাইল নির্বাচন করুন'}
            </Button>
          </div>
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {language === 'en' 
                ? 'Drag to reorder. First photo is your cover.'
                : 'পুনর্বিন্যাস করতে ড্র্যাগ করুন। প্রথম ছবি আপনার কভার।'}
            </p>
            {photos.length < MAX_PHOTOS && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                + {language === 'en' ? 'Add more' : 'আরও যোগ করুন'}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                draggable
                onDragStart={(e) => handlePhotoDragStart(e, index)}
                onDragEnd={handlePhotoDragEnd}
                onDragOver={(e) => handlePhotoDragOver(e, index)}
                onDrop={(e) => handlePhotoDrop(e, index)}
                className={cn(
                  'relative group aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-move',
                  draggedIndex === index
                    ? 'opacity-50 border-slate-300'
                    : dropTargetIndex === index
                    ? 'border-emerald-500 scale-95'
                    : photo.isCover
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-emerald-300'
                )}
              >
                {/* Image */}
                <img
                  src={photo.preview}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!photo.isCover && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetCover(photo.id);
                      }}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      title={language === 'en' ? 'Set as cover' : 'কভার হিসেবে সেট করুন'}
                    >
                      <Star className="h-4 w-4 text-amber-500" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(photo.id);
                    }}
                    className="p-2 bg-white/90 rounded-full hover:bg-red-50 transition-colors"
                    title={language === 'en' ? 'Remove' : 'সরান'}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>

                {/* Cover badge */}
                {photo.isCover && (
                  <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {language === 'en' ? 'Cover' : 'কভার'}
                  </div>
                )}

                {/* Order number */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Drag handle */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 p-1 rounded">
                    <GripVertical className="h-4 w-4 text-slate-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Helper text */}
          <p className="text-xs text-slate-500 text-center">
            {language === 'en'
              ? 'Tip: Good photos help you sell faster! Make sure your item is well-lit and clearly visible.'
              : 'টিপ: ভালো ছবি আপনাকে দ্রুত বিক্রি করতে সাহায্য করে! নিশ্চিত করুন যে আপনার আইটেম পরিষ্কার দেখা যাচ্ছে।'}
          </p>
        </div>
      )}

      {/* Empty state */}
      {photos.length === 0 && (
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Camera className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium mb-1">
            {language === 'en' ? 'No photos added yet' : 'এখনো কোনো ছবি যোগ করা হয়নি'}
          </p>
          <p className="text-slate-500 text-sm">
            {language === 'en' 
              ? 'Add at least 1 photo to continue'
              : 'চালিয়ে যেতে কমপক্ষে ১টি ছবি যোগ করুন'}
          </p>
        </div>
      )}
    </div>
  );
}
