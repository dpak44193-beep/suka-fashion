import React, { useRef } from 'react';
import { ImagePlus, Video, X } from 'lucide-react';
import { MAX_PRODUCT_PHOTOS, readImageFiles, readVideoFile } from '../../lib/fileUpload';
import { toast } from 'sonner';

interface ProductMediaUploadProps {
  images: string[];
  video?: string;
  onImagesChange: (images: string[], primaryImage: string) => void;
  onVideoChange: (video: string | undefined) => void;
}

export const ProductMediaUpload: React.FC<ProductMediaUploadProps> = ({
  images,
  video,
  onImagesChange,
  onVideoChange,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const slotsLeft = MAX_PRODUCT_PHOTOS - images.length;

  const handlePhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    if (images.length >= MAX_PRODUCT_PHOTOS) {
      toast.error(`Maximum ${MAX_PRODUCT_PHOTOS} photos allowed`);
      e.target.value = '';
      return;
    }

    try {
      const urls = await readImageFiles(files, slotsLeft);
      const merged = [...images, ...urls].slice(0, MAX_PRODUCT_PHOTOS);
      onImagesChange(merged, merged[0]);
      toast.success(`${urls.length} photo(s) added`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
    e.target.value = '';
  };

  const handleVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await readVideoFile(file);
      onVideoChange(url);
      toast.success('Video added');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    onImagesChange(next, next[0] ?? '');
  };

  return (
    <div className="space-y-4 border border-[var(--border)] rounded-xl p-4 bg-[var(--background)]">
      <div>
        <p className="text-sm font-semibold mb-1">Product photos</p>
        <p className="text-xs text-gray-500 mb-3">
          Import up to {MAX_PRODUCT_PHOTOS} photos from your device ({images.length}/{MAX_PRODUCT_PHOTOS})
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {images.map((src, index) => (
            <div key={`${src.slice(0, 24)}-${index}`} className="relative aspect-square rounded-xl overflow-hidden border bg-white">
              <img src={src} alt="" className="w-full h-full object-cover" />
              {index === 0 && (
                <span className="absolute top-1 left-1 text-[10px] bg-[var(--primary)] px-1.5 py-0.5 rounded text-[var(--primary-foreground)]">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                aria-label="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {slotsLeft > 0 && (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-1 text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors"
            >
              <ImagePlus className="w-6 h-6" />
              <span className="text-xs">Add photo</span>
            </button>
          )}
        </div>

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotos}
        />
        {images.length < MAX_PRODUCT_PHOTOS && (
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="text-sm text-[var(--primary-dark)] font-medium hover:underline"
          >
            Import photos from device
          </button>
        )}
      </div>

      <div className="border-t border-[var(--border)] pt-4">
        <p className="text-sm font-semibold mb-1">Product video</p>
        <p className="text-xs text-gray-500 mb-3">Optional — one video (MP4, WebM)</p>

        {video ? (
          <div className="relative rounded-xl overflow-hidden border bg-black max-w-md">
            <video src={video} controls className="w-full max-h-48" />
            <button
              type="button"
              onClick={() => onVideoChange(undefined)}
              className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white"
              aria-label="Remove video"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideo}
            />
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm hover:bg-white transition-colors"
            >
              <Video className="w-4 h-4" />
              Import video from device
            </button>
          </>
        )}
      </div>
    </div>
  );
};

