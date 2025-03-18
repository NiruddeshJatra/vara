
import React from 'react';
import { ShieldCheck, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";

type PaymentTotal = {
  days: number;
  basePrice: number;
  securityDeposit: number;
  serviceFee: number;
  total: number;
};

type PaymentSummaryProps = {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  totals: PaymentTotal;
};

const PaymentSummary = ({ dateRange, totals }: PaymentSummaryProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <div className="flex justify-between mb-2">
          <span className="text-gray-700">Rental Period:</span>
          <span className="font-medium">
            {dateRange.from && dateRange.to ? (
              <>
                {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
              </>
            ) : "Select dates"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Duration:</span>
          <span className="font-medium">{totals.days} days</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="font-medium">Payment Summary</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">${totals.basePrice / totals.days} × {totals.days} days</span>
            <span>${totals.basePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Security deposit</span>
            <span>${totals.securityDeposit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service fee</span>
            <span>${totals.serviceFee.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between pt-2 border-t font-semibold">
            <span>Total</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-2 text-sm text-gray-600">
          <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <p>
            Your security deposit of ${totals.securityDeposit.toFixed(2)} is fully refundable 
            if the item is returned in the same condition.
          </p>
        </div>
        
        <div className="flex items-start space-x-2 text-sm text-gray-600">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p>
            By proceeding, you agree to the rental terms and conditions. 
            The owner will need to approve your request.
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="payment" className="text-sm font-medium">Payment Method</label>
        <div className="border rounded-md p-3 flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-600 mr-2" />
            <span>Credit Card ending in 4242</span>
          </div>
          <Button variant="outline" size="sm">Change</Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
