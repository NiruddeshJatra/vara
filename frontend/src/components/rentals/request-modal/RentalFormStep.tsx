
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ItemSummary from './ItemSummary';
import DateRangePicker from './DateRangePicker';

type RentalFormStepProps = {
  item: {
    name: string;
    image: string;
    price: number;
    duration: string;
  };
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: (value: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  rentalNotes: string;
  setRentalNotes: (value: string) => void;
};

const RentalFormStep = ({ 
  item, 
  dateRange, 
  setDateRange, 
  rentalNotes, 
  setRentalNotes 
}: RentalFormStepProps) => {
  return (
    <div className="space-y-6 py-4">
      <ItemSummary 
        itemName={item.name}
        itemImage={item.image}
        itemPrice={item.price}
        itemDuration={item.duration}
      />
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date-range">Rental Period</Label>
          <DateRangePicker 
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea 
            id="notes" 
            placeholder="Any special requests or information for the owner..." 
            className="resize-none"
            value={rentalNotes}
            onChange={(e) => setRentalNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default RentalFormStep;
