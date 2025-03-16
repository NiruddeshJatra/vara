// components/listings/ImageUploadStep.tsx
import { useCallback, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  images: File[];
  error?: string;
  onChange: (files: File[]) => void;
};

const ImageUploadStep = ({ images, error, onChange }: Props) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (files: FileList) => {
    const validFiles = Array.from(files).filter(file => 
      ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type) && 
      file.size <= 5 * 1024 * 1024
    );
    onChange([...images, ...validFiles]);
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
    if (e.dataTransfer.files) {
      handleFileChange(e.dataTransfer.files);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed rounded-lg p-6 text-center bg-white">
        <div 
          className={`${dragActive ? 'border-green-500 bg-green-50' : 'border-transparent'} 
            relative border-2 rounded-md min-h-[200px] flex flex-col items-center justify-center`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-2">
            <p className="font-medium">Drag and drop images here</p>
            <p className="text-sm text-gray-500">or</p>
            <input
              type="file"
              multiple
              accept="image/jpeg, image/png, image/jpg"
              onChange={(e) => e.target.files && handleFileChange(e.target.files)}
              className="hidden text-sm md:text-base h-10 md:h-12"
              id="file-upload"
            />
            <label 
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
            >
              Select Files
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Maximum 5MB per image (JPG, JPEG, PNG only)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {images.map((file, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              className="h-32 w-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, i) => i !== index))}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 hover:bg-red-600"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadStep;