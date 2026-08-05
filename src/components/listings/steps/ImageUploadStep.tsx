// components/listings/ImageUploadStep.tsx
import { useCallback, useState } from 'react';
import { AlertCircle, X, Camera, Info, Image, CheckCircle2, UploadCloud, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

type Props = {
  images: File[];
  error?: string[];
  onChange: (files: File[]) => void;
  onNext?: () => void;
};

const ImageUploadStep = ({ images, error, onChange, onNext }: Props) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (files: FileList) => {
    setIsUploading(true);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        onChange([...images, ...Array.from(files)]);
      }
    }, 50);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-md sm:text-xl font-semibold text-gray-700">{t('listing.images.title')}</p>
        <div className="flex items-center text-xs sm:text-sm text-gray-500">
          <span className="font-medium">{images.length}</span>
          <span className="mx-1">{t('listing.images.added')}</span>
          {images.length > 0 && images.length < 3 && (
            <span className="text-amber-600 font-medium ml-1">{t('listing.images.recommended')}</span>
          )}
          {images.length >= 3 && (
            <CheckCircle2 className="h-4 w-4 text-green-600 ml-1" />
          )}
        </div>
      </div>

      <div className="border-2 border-dashed rounded-xl p-6 sm:p-8 text-center bg-white shadow-sm">
        <div
          className={`${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-200'} 
            relative border-2 rounded-xl min-h-[220px] flex flex-col items-center justify-center transition-colors`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-4 w-3/4 max-w-md">
              <p className="font-medium text-gray-700">{t('listing.images.uploading')}</p>
              <Progress value={uploadProgress} className="h-2 w-full [&>div]:bg-green-500" />
              <p className="text-sm text-gray-500">{t('listing.images.percentComplete', { percent: uploadProgress })}</p>
            </div>
          ) : (
            <div className="space-y-3 p-4">
              <UploadCloud size={48} className="mx-auto text-green-500" />
              <p className="font-medium text-gray-700 text-xs sm:text-sm">{t('listing.images.dragDrop')}</p>
              <p className="text-xs sm:text-sm text-gray-500">{t('listing.images.or')}</p>
              <input
                type="file"
                multiple
                accept="image/jpeg, image/png, image/jpg"
                onChange={(e) => e.target.files && handleFileChange(e.target.files)}
                className="hidden text-xs sm:text-sm md:text-base h-10 md:h-12"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer font-medium text-xs sm:text-sm transition-colors"
              >
                {t('listing.images.browse')}
              </label>
              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 flex items-center justify-center">
                  <Info size={12} className="mr-1 text-gray-400" />
                  {t('listing.images.maxSize')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && error.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-xs sm:text-sm flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <p>{error[0]}</p>
        </div>
      )}

      {images.length > 0 && (
        <>
          <h4 className="text-sm md:text-md font-medium text-gray-700 flex items-center gap-2 mt-6">
            <Image className="h-5 w-5 text-gray-500" />
            {t('listing.images.uploaded', { count: images.length })}
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {images.map((file, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <img
                  src={URL.createObjectURL(file)}
                  alt={t('listing.images.previewAlt', { index: index + 1 })}
                  className="h-36 w-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={() => onChange(images.filter((_, i) => i !== index))}
                    className="bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                    aria-label={t('listing.images.remove')}
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
                  {t('listing.images.imageLabel', { index: index + 1 })} • {(file.size / (1024 * 1024)).toFixed(1)} MB
                </div>
              </div>
            ))}

            {images.length < 10 && (
              <label
                htmlFor="file-upload-additional"
                className="flex flex-col items-center justify-center w-full h-36 cursor-pointer hover:bg-gray-50 transition-colors p-4 border border-dashed border-gray-200 rounded-lg"
              >
                <Camera size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500 text-center">{t('listing.images.addMore')}</span>
                <input
                  id="file-upload-additional"
                  type="file"
                  multiple
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={(e) => e.target.files && handleFileChange(e.target.files)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </>
      )}

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 sm:p-4 rounded-lg border border-amber-200 mt-4">
        <h6 className="text-xs sm:text-sm font-medium text-amber-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
          <Info size={18} className="text-amber-600 sm:w-4 sm:h-4" />
          {t('listing.images.tipsTitle')}
        </h6>
        <div className="space-y-2 sm:space-y-3">
          <div>
            <ul className="text-xs/5 sm:text-sm/6 text-amber-700 space-y-0.5 sm:space-y-1 list-disc pl-4 sm:pl-5">
              <li><span className="font-semibold">{t('listing.images.tip1Label')}:</span> {t('listing.images.tip1')}</li>
              <li><span className="font-semibold">{t('listing.images.tip2Label')}:</span> {t('listing.images.tip2')}</li>
              <li><span className="font-semibold">{t('listing.images.tip3Label')}:</span> {t('listing.images.tip3')}</li>
              <li><span className="font-semibold">{t('listing.images.tip4Label')}:</span> {t('listing.images.tip4')}</li>
              <li><span className="font-semibold">{t('listing.images.tip5Label')}:</span> {t('listing.images.tip5')}</li>
              <li><span className="font-semibold">{t('listing.images.tip6Label')}:</span> {t('listing.images.tip6')}</li>
            </ul>
          </div>
        </div>
      </div>

      {onNext && (
        <div className="flex justify-end mt-8">
          <Button
            onClick={onNext}
            className="bg-green-600 hover:bg-green-700"
            disabled={images.length === 0}
          >
            {t('common.continue')} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadStep;