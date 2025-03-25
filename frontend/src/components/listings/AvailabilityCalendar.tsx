import { AvailabilityPeriod } from '@/types/listings';

interface Props {
  availabilityPeriods: AvailabilityPeriod[];
}

const AvailabilityCalendar = ({ availabilityPeriods }: Props) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-4">Availability Calendar</h3>
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">
          Showing availability for {availabilityPeriods.length} periods
        </span>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;