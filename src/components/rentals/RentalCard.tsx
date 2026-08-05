import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { differenceInDays, isValid } from "date-fns";
import { useTranslation } from "react-i18next";
import { formatDate as formatDateIntl, formatRelativeTime } from "@/utils/formatDate";
import { Rental } from "@/types/rentals";
import { RentalStatus } from "@/constants/rental";
import {
  Clock,
  ThumbsUp,
  ThumbsDown,
  Calendar as CalendarIcon,
  Eye,
  Shield,
} from "lucide-react";

interface RentalCardProps {
  rental: Rental;
  userRole: "renter" | "owner";
  onViewDetails: (rental: Rental) => void;
  onStatusAction: (rentalId: string, action: string) => void;
}

const RentalCard = ({
  rental,
  userRole,
  onViewDetails,
  onStatusAction,
}: RentalCardProps) => {
  const { t } = useTranslation();
  // Debug logging removed after mapping fix

  const statusConfig = {
    pending: {
      color: "bg-amber-100 text-amber-800 border-amber-300",
      icon: <Clock className="h-4 w-4" />,
    },
    accepted: {
      color: "bg-blue-100 text-blue-800 border-blue-300",
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    in_progress: {
      color: "bg-green-100 text-green-800 border-green-300",
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    completed: {
      color: "bg-purple-100 text-purple-800 border-purple-300",
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    rejected: {
      color: "bg-red-100 text-red-800 border-red-300",
      icon: <ThumbsDown className="h-4 w-4" />,
    },
    cancelled: {
      color: "bg-orange-100 text-orange-800 border-orange-300",
      icon: <ThumbsDown className="h-4 w-4" />,
    },
  };

  const formatDate = (dateString: string) => formatDateIntl(dateString);

  const getTimeInfo = () => {
    const now = new Date();
    const start = new Date(rental.start_date);
    const end = new Date(rental.end_date);

    if (
      !rental.start_date ||
      !isValid(start) ||
      !rental.end_date ||
      !isValid(end)
    ) {
      return t('common.notAvailable');
    }

    if (
      rental.status === RentalStatus.ACCEPTED ||
      rental.status === RentalStatus.IN_PROGRESS
    ) {
      if (now < start) return t('rental.card.startsIn', { days: differenceInDays(start, now) });
      if (now >= start && now <= end)
        return t('rental.card.daysLeft', { days: differenceInDays(end, now) });
    }
    if (rental.status === RentalStatus.PENDING) {
      const created = new Date(rental.created_at);
      if (!rental.created_at || !isValid(created)) return t('common.notAvailable');
      return t('rental.card.requested', { time: formatRelativeTime(created) });
    }
    // For completed/cancelled/etc.
    const updated = new Date(rental.updated_at);
    if (!rental.updated_at || !isValid(updated)) return t('common.notAvailable');
    return t('rental.card.updated', { time: formatRelativeTime(updated) });
  };

  // Pricing snapshot from the backend (decimal string)
  const price = Number(rental.base_cost) || 0;

  const product = typeof rental.product === 'object' ? rental.product : null;
  const imageUrl = product?.images?.[0]?.image || '/placeholder.png';
  const productTitle = product?.title || rental.product_title || t('rental.card.untitled');
  const productCategory = product?.category || 'N/A';

  return (
    <div className="flex flex-col sm:flex-row h-auto sm:h-64 bg-gradient-to-r from-white to-leaf-100 rounded-lg border overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="w-full sm:w-2/5 md:w-2/5 lg:w-2/5 relative bg-gray-50 flex items-center justify-center aspect-[4/3]">
        <img
          src={imageUrl}
          alt={productTitle}
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* Content Section */}
      <div className="w-full sm:w-3/5 md:w-3/5 lg:w-3/5 pl-6 pr-4 py-4 flex flex-col justify-between gap-1">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-green-900 truncate">{productTitle}</h3>
            <span className="text-lg font-bold text-green-700">৳{price.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-700">
            <span className="bg-green-50 border border-green-100 px-2 py-0.5 rounded text-green-800"><b>{t('listings.category')}:</b> {productCategory}</span>
          </div>

          <div className="flex items-center gap-2 ml-2 text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 text-green-600" />
            <span>{formatDate(rental.start_date)} - {formatDate(rental.end_date)}</span>
          </div>

          <div className="bg-green-50 px-3 py-2 rounded-md border border-green-200 text-xs">
            {userRole === 'renter'
              ? t('rental.card.bharaHandlesOwner')
              : t('rental.card.bharaHandlesRenter')}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="inline-flex items-center bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200 text-xs text-green-700 font-medium">
            {getTimeInfo()}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-green-400 text-green-800 hover:bg-green-50"
            onClick={() => onViewDetails(rental)}
          >
            <Eye className="h-4 w-4 mr-1" />
            {t('rental.card.viewDetails')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
