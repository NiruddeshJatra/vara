import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addDays } from 'date-fns';
import { format } from 'date-fns';
import { toast } from 'sonner';
import RentalFormStep from './request-modal/RentalFormStep';
import PaymentSummary from './request-modal/PaymentSummary';
import { Leaf } from 'lucide-react';

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
  
  const calculateTotal = () => {
    if (dateRange.from && dateRange.to) {
      const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
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
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      toast.success("Rental request submitted successfully!");
      navigate('/rentals');
    }, 1500);
  };
  
  const handleNext = () => step < 2 ? setStep(step + 1) : handleSubmit();
  const handleBack = () => step > 1 ? setStep(step - 1) : onClose();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-2xl border-2 border-green-100 bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Leaf className="h-6 w-6 text-green-600" strokeWidth={1.5} />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-800 text-center">
              {step === 1 ? "Request Rental" : "Confirm & Pay"}
            </DialogTitle>
          </div>
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
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="border-green-200 text-green-700 hover:bg-green-50 h-12 px-6 rounded-lg"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-green-600 hover:bg-green-700 h-12 px-8 rounded-lg shadow-sm hover:shadow-md transition-all"
            disabled={isSubmitting}
          >
            {step === 1 ? (
              <>
                Continue
                <Leaf className="ml-2 h-4 w-4" />
              </>
            ) : isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                Confirm & Pay
                <Leaf className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestRentalModal;