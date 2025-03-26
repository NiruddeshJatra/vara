import React from 'react';
import { Calendar } from 'lucide-react';
import AvailabilityCalendar from '@/components/listings/AvailabilityCalendar';
import { AvailabilityPeriod } from '@/types/listings';

interface AvailabilitySectionProps {
  availabilityPeriods?: AvailabilityPeriod[];
}

export default function AvailabilitySection({ availabilityPeriods }: AvailabilitySectionProps) {
  return (
    <div className="mb-10 pb-10 border-b border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Availability</h2>
        <div className="flex items-center text-sm text-green-700 bg-green-50 px-2 py-1 rounded-md">
          <Calendar className="h-4 w-4 mr-1" />
          Available Now
        </div>
      </div>
      
      {availabilityPeriods && 
        <AvailabilityCalendar availabilityPeriods={availabilityPeriods} />
      }
    </div>
  );
} 