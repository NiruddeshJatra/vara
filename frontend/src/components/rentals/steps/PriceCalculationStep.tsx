// components/rentals/steps/PriceCalculationStep.tsx
import { ChevronLeft, ChevronRight, Calculator, Clock, Calendar, Banknote, Shield, BadgePercent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RentalRequestFormData, Product, DurationUnit } from '@/types/listings';
import { useEffect } from 'react';
import { format } from 'date-fns';

interface Props {
  product: Product;
  formData: RentalRequestFormData & {
    totalCost: number;
    serviceFee: number;
    securityDeposit: number;
  };
  onNext: () => void;
  onPrev: () => void;
}

const PriceCalculationStep = ({ product, formData, onNext, onPrev }: Props) => {
  // Use the selected pricing tier from form data instead of defaulting to first one
  const selectedTier = product.pricingTiers?.find(
    (tier) => tier.durationUnit === formData.durationUnit
  ) || { durationUnit: 'day' as DurationUnit, price: 0, maxPeriod: 30 };
  
  // Use form data's security deposit instead of product's
  const securityDeposit = formData.securityDeposit || 0;
  const durationUnit = formData.durationUnit || 'day';
  
  useEffect(() => {
    console.log('PriceCalculationStep - Product:', product);
    console.log('PriceCalculationStep - Form data:', formData);
  }, [product, formData]);
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set';
    return format(date, 'MMMM dd, yyyy');
  };
  
  // Calculate end date
  const calculateEndDate = () => {
    if (!formData.startDate) return 'Not set';
    
    const endDate = new Date(formData.startDate);
    
    switch(durationUnit) {
      case 'day':
        endDate.setDate(endDate.getDate() + formData.duration);
        break;
      case 'week':
        endDate.setDate(endDate.getDate() + (formData.duration * 7));
        break;
      case 'month':
        endDate.setMonth(endDate.getMonth() + formData.duration);
        break;
    }
    
    return format(endDate, 'MMMM dd, yyyy');
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const basePrice = selectedTier.price || 0;
  const baseCost = basePrice * formData.duration;
  const serviceFee = formData.serviceFee || (baseCost * 0.05);
  const totalCost = formData.totalCost || (baseCost + serviceFee + securityDeposit);

  return (
    <div className="space-y-6 md:space-y-8 px-2">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">Price Calculation</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50/50 rounded-lg border border-gray-200 p-4 space-y-3">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-green-700" />
            Rental Period
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium text-gray-900">{formatDate(formData.startDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">End Date:</span>
              <span className="font-medium text-gray-900">{calculateEndDate()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-gray-900">{formData.duration} {durationUnit}{formData.duration > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50/50 rounded-lg border border-gray-200 p-4 space-y-3">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <Calculator className="mr-2 h-5 w-5 text-green-700" />
            Cost Breakdown
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pricing Tier:</span>
              <span className="font-medium text-gray-900">{selectedTier.durationUnit} ({selectedTier.maxPeriod} max)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Price:</span>
              <span className="font-medium text-gray-900">{formatCurrency(basePrice)} per {durationUnit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rental Cost:</span>
              <span className="font-medium text-gray-900">{formatCurrency(baseCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 flex items-center">
                <BadgePercent className="h-3.5 w-3.5 mr-1 text-amber-600" />
                Service Fee (5%):
              </span>
              <span className="font-medium text-gray-900">{formatCurrency(serviceFee)}</span>
            </div>
            {securityDeposit > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center">
                  <Shield className="h-3.5 w-3.5 mr-1 text-green-600" />
                  Security Deposit:
                </span>
                <span className="font-medium text-gray-900">{formatCurrency(securityDeposit)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg border border-green-200 mt-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-green-800">Total Cost</h3>
            <p className="text-sm text-green-700">
              For {formData.duration} {durationUnit}{formData.duration > 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-800">{formatCurrency(totalCost)}</div>
            <p className="text-xs text-green-700">
              {securityDeposit > 0 ? `(Includes refundable ${formatCurrency(securityDeposit)} deposit)` : ''}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          className="border-green-300 hover:bg-green-50"
          onClick={onPrev}
        >
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onNext}
        >
          Continue to Additional Info <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PriceCalculationStep;