
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addDays } from 'date-fns';
import { format } from 'date-fns';
import { toast } from 'sonner';
import RentalFormStep from './request-modal/RentalFormStep';
import PaymentSummary from './request-modal/PaymentSummary';

// Create a specific type for the item in RequestRentalModal that doesn't require onQuickView
type RequestRentalItemProps = {
  id: number;
  name: string;
  image: string;
  images?: string[];
  category: string;
  price: number;
  duration: string;
  distance: number;
  rating: number;
  reviewCount: number;
};

type RequestRentalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: RequestRentalItemProps;
};

const RequestRentalModal = ({ isOpen, onClose, item }: RequestRentalModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: addDays(new Date(), 3)
  });
  const [rentalNotes, setRentalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate total based on date range
  const calculateTotal = () => {
    if (dateRange.from && dateRange.to) {
      const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
      // Assuming price is per day
      return {
        days,
        basePrice: item.price * days,
        securityDeposit: 100,
        serviceFee: 5,
        total: item.price * days + 100 + 5
      };
    }
    return {
      days: 0,
      basePrice: 0,
      securityDeposit: 100,
      serviceFee: 5,
      total: 0
    };
  };

  const totals = calculateTotal();
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      toast.success("Rental request submitted successfully!");
      navigate('/rentals');
    }, 1500);
  };
  
  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {step === 1 ? "Request Rental Details" : "Confirm & Pay"}
          </DialogTitle>
        </DialogHeader>
        
        {step === 1 ? (
          <RentalFormStep 
            item={item}
            dateRange={dateRange}
            setDateRange={setDateRange}
            rentalNotes={rentalNotes}
            setRentalNotes={setRentalNotes}
          />
        ) : (
          <PaymentSummary 
            dateRange={dateRange}
            totals={totals}
          />
        )}
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={handleBack}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {step === 1 ? 'Next' : isSubmitting ? 'Submitting...' : 'Confirm & Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestRentalModal;
