import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ListingFormData } from '@/types/listings';
import { Info } from 'lucide-react';

type Props = {
  formData: ListingFormData;
  onNext: (data: Partial<ListingFormData>) => void;
  onBack: () => void;
};

const ProductHistoryStep = ({ formData, onNext, onBack }: Props) => {
  const [purchaseYear, setPurchaseYear] = useState<string>(
    formData.purchaseYear || new Date().getFullYear().toString()
  );
  const [originalPrice, setOriginalPrice] = useState<string>(
    formData.originalPrice?.toString() || ''
  );
  const [ownershipHistory, setOwnershipHistory] = useState<'firsthand' | 'secondhand'>(
    formData.ownershipHistory || 'firsthand'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      purchaseYear,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      ownershipHistory,
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Product History</h2>
        <p className="text-gray-600">
          Provide information about when you purchased this product and its ownership history.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="purchaseYear" className="text-base font-medium text-gray-700">
              Purchase Year
            </Label>
            <select
              id="purchaseYear"
              value={purchaseYear}
              onChange={(e) => setPurchaseYear(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500">
              Select the year when you purchased this product.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="originalPrice" className="text-base font-medium text-gray-700">
              Original Purchase Price
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
              <Input
                id="originalPrice"
                type="number"
                min="0"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="pl-8"
                placeholder="Enter the original price"
                required
              />
            </div>
            <p className="text-sm text-gray-500">
              Enter the price you paid when you purchased this product.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium text-gray-700">Ownership History</Label>
          <RadioGroup
            value={ownershipHistory}
            onValueChange={(value) => setOwnershipHistory(value as 'firsthand' | 'secondhand')}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="firsthand" id="firsthand" />
              <Label htmlFor="firsthand" className="text-gray-700">
                Firsthand (I am the original owner)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="secondhand" id="secondhand" />
              <Label htmlFor="secondhand" className="text-gray-700">
                Secondhand (I purchased it from someone else)
              </Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500">
            Indicate whether you are the original owner or purchased this product from someone else.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 mt-4">
        <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Info size={16} className="text-amber-600" />
          Why we ask for this information
        </h4>
        <ul className="text-md text-amber-700 space-y-1 list-disc pl-5">
          <li>Product history helps renters understand the item's background and value.</li>
          <li>This information can build trust and transparency in your listing.</li>
        </ul>
      </div>
    </form>
  );
};

export default ProductHistoryStep; 