import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Rental } from "@/types/rentals";
import {
  MessageSquare,
  Star,
  Calendar,
  Shield,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Camera
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate as formatDateIntl, formatDateTime as formatDateTimeIntl } from "@/utils/formatDate";
import ReviewForm from "./ReviewForm";
import { useEffect, useState } from "react";
import { RentalStatus, RENTAL_STATUS_DISPLAY } from '@/constants/rental';
import rentalService from "@/services/rental.service";
import reviewService from "@/services/review.service";
import { Review } from "@/types/rentals";
import { toast } from "@/components/ui/use-toast";

interface RentalDetailModalProps {
  rental: Rental;
  onClose: () => void;
  onStatusAction: (rentalId: string, action: string) => void;
  userRole: 'renter' | 'owner';
}

interface RentalPhotoItem {
  id: string;
  photo: string;
  photo_type: 'pre_rental' | 'post_rental';
}

const RentalDetailModal = ({
  rental,
  onClose,
  onStatusAction,
  userRole
}: RentalDetailModalProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("details");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [rentalPhotos, setRentalPhotos] = useState<RentalPhotoItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // --- Rental status logic: statuses match backend strings exactly. ---
  const isPending = rental.status === RentalStatus.PENDING;
  const isAccepted = rental.status === RentalStatus.ACCEPTED;
  const isInProgress = rental.status === RentalStatus.IN_PROGRESS;
  const isCompleted = rental.status === RentalStatus.COMPLETED;

  // Status badge configuration
  const getStatusConfig = (status: RentalStatus) => {
    switch(status) {
      case RentalStatus.PENDING:
        return { color: 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200', label: t('rental.status.pendingApproval') };
      case RentalStatus.ACCEPTED:
        return { color: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200', label: t('rental.status.accepted') };
      case RentalStatus.IN_PROGRESS:
        return { color: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200', label: t('rental.status.in_progress') };
      case RentalStatus.COMPLETED:
        return { color: 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200', label: t('rental.status.completed') };
      case RentalStatus.REJECTED:
        return { color: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200', label: t('rental.status.rejected') };
      case RentalStatus.CANCELLED:
        return { color: 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200', label: t('rental.status.cancelled') };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200', label: t('rental.status.unknown') };
    }
  };

  const statusConfig = getStatusConfig(rental.status);

  // --- Real API data. ---
  const product = typeof rental.product === 'object' ? rental.product : null;
  const productImages = Array.isArray(product?.images)
    ? product.images.map((img) => img.image)
    : [];
  const hasImages = productImages.length > 0;

  // Counterpart info — full name, trust level and rating only; no phone
  // (contact between parties is handled by Bhara off-platform)
  const counterpart = userRole === 'renter' ? rental.owner_info : rental.renter_info;
  const counterpartLabel = userRole === 'renter' ? t('rental.modal.owner') : t('rental.modal.renter');
  const counterpartVerified =
    counterpart?.trust_level === 'verified' || counterpart?.trust_level === 'partner';

  // Dates
  const safeDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };
  const start_date = safeDate(rental.start_date);
  const end_date = safeDate(rental.end_date);
  const formatDate = (date: Date | null) => date ? formatDateIntl(date) : 'N/A';
  const formatDateTime = (date: Date | null) => date ? formatDateTimeIntl(date) : 'N/A';

  // Pricing snapshot from the backend (frozen at request time)
  const unitPrice = Number(rental.unit_price) || 0;
  const base_cost = Number(rental.base_cost) || 0;
  const security_deposit = Number(rental.security_deposit) || 0;

  // Product info
  const productTitle = product?.title || rental.product_title || t('rental.modal.product');
  const productCategory = product?.category ? t('categories.' + product.category, { defaultValue: product.category }) : '';
  const productDescription = product?.description || '';
  void productDescription;

  // Rental duration from the request itself
  const rentalDuration = `${rental.duration} ${t('rental.units.' + rental.duration_unit, { count: rental.duration })}`;

  // Settlement (computed by the backend from staff-entered payment records)
  const settlement = rental.settlement;

  // Timeline from real status_history entries
  const statusHistory = Array.isArray(rental.status_history) ? rental.status_history : [];

  const timelineLabel = (status: RentalStatus) => {
    switch (status) {
      case RentalStatus.PENDING: return t('rental.timeline.submitted');
      case RentalStatus.ACCEPTED: return t('rental.timeline.accepted');
      case RentalStatus.IN_PROGRESS: return t('rental.timeline.started');
      case RentalStatus.COMPLETED: return t('rental.timeline.completed');
      case RentalStatus.REJECTED: return t('rental.timeline.rejected');
      case RentalStatus.CANCELLED: return t('rental.timeline.cancelled');
      default: return t('rental.status.' + status, { defaultValue: RENTAL_STATUS_DISPLAY[status] || status });
    }
  };

  const timelineDotColor = (status: RentalStatus) => {
    switch (status) {
      case RentalStatus.REJECTED: return 'bg-red-500';
      case RentalStatus.CANCELLED: return 'bg-orange-500';
      case RentalStatus.IN_PROGRESS: return 'bg-lime-600';
      case RentalStatus.COMPLETED: return 'bg-purple-600';
      default: return 'bg-green-600';
    }
  };

  // Documentation photos — real uploads, available once the rental begins
  useEffect(() => {
    let cancelled = false;
    if (isAccepted || isInProgress || isCompleted) {
      rentalService.getRentalPhotos(rental.id)
        .then((photos) => {
          if (!cancelled) setRentalPhotos(photos as RentalPhotoItem[]);
        })
        .catch(() => {
          if (!cancelled) setRentalPhotos([]);
        });
    }
    return () => { cancelled = true; };
  }, [rental.id, isAccepted, isInProgress, isCompleted]);

  // Public reviews for this rental (renter-to-owner, fetched by product)
  useEffect(() => {
    let cancelled = false;
    const productId = typeof rental.product === 'object' ? rental.product.id : rental.product;
    if (productId) {
      reviewService.getProductReviews(productId)
        .then(({ reviews }) => {
          if (!cancelled) setReviews(reviews.filter((r) => r.rental === rental.id));
        })
        .catch(() => {
          if (!cancelled) setReviews([]);
        });
    }
    return () => { cancelled = true; };
  }, [rental.id, rental.product]);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {
      await reviewService.createReview(rental.id, rating, comment);
      toast({ title: t('review.submittedTitle'), description: t('review.submittedDesc') });
      onClose();
    } catch (error: any) {
      const fieldErrors = error.response?.data?.data;
      const firstError = fieldErrors && typeof fieldErrors === 'object'
        ? Object.values(fieldErrors).find((v) => Array.isArray(v) && v.length)
        : null;
      toast({
        title: t('review.failedTitle'),
        description: (firstError as string[] | null)?.[0] || error.response?.data?.message || t('review.submitFailed'),
        variant: "destructive",
      });
    }
  };

  const preRentalPhotos = rentalPhotos.filter((p) => p.photo_type === 'pre_rental');
  const postRentalPhotos = rentalPhotos.filter((p) => p.photo_type === 'post_rental');

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!hasImages) return;
    if (direction === 'prev') {
      setActiveImageIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1));
    } else {
      setActiveImageIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
    }
  };

  // Renter can cancel a pending request, or an accepted rental before it starts
  const canRenterCancel =
    userRole === 'renter' &&
    (isPending || (isAccepted && start_date !== null && start_date > new Date()));

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 rounded-xl overflow-hidden bg-gradient-to-b from-green-50/50 to-white flex flex-col">
        {/* Top header with close button */}
        <div className="bg-gradient-to-r from-green-200 to-lime-100 px-6 py-3 flex items-center justify-between border-b border-green-300 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-green-800">{t('rental.modal.rentalNo', { id: String(rental.id).slice(0, 8) })}</h2>
              <p className="text-sm text-green-600">{productTitle}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Badge className={`${statusConfig.color} text-xs px-2.5 py-0.5 mr-8 font-medium hover:opacity`}>
              {statusConfig.label}
            </Badge>
          </div>
        </div>

        {/* Main content wrapper - flex-grow to take available space */}
        <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
          {/* Left column - Images and price - Scrollable independently */}
          <div className="w-full lg:w-2/5 bg-gradient-to-b from-green-50 to-white p-2 sm:p-4 md:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-green-100">
            <div className="space-y-5">
              {/* Main image view */}
              <div className="relative rounded-lg overflow-hidden bg-white border border-green-200 shadow-md aspect-square">
                {hasImages ? (
                  <img
                    src={productImages[activeImageIndex]}
                    alt={`${productTitle} - Image ${activeImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500">
                    {t('rental.modal.noImages')}
                  </div>
                )}

                {/* Navigation arrows */}
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigateImage('prev')}
                    className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm text-green-700"
                    aria-label={t('rental.modal.prevImage')}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm text-green-700"
                    aria-label={t('rental.modal.nextImage')}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Image counter badge */}
                <div className="absolute bottom-3 right-3 bg-green-700/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Camera className="h-3 w-3" />
                  <span>{hasImages ? t('rental.modal.imageCounter', { current: activeImageIndex + 1, total: productImages.length }) : t('rental.modal.noImagesShort')}</span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-1.5">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                      index === activeImageIndex
                        ? 'border-green-500 shadow-sm scale-105'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${productTitle} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Rental price card */}
              <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-4 border border-green-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-semibold text-green-800">{t('rental.modal.priceSummary')}</h3>
                  <span className="text-lg font-bold text-green-700">৳{base_cost}</span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>{t('rental.modal.basePrice')}</span>
                    <span>৳{unitPrice} × {rentalDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('rental.modal.depositRefundable')}</span>
                    <span>৳{security_deposit}</span>
                  </div>
                  <Separator className="my-2 bg-green-100" />
                  <div className="flex justify-between font-medium text-green-800">
                    <span>{t('rental.modal.total')}</span>
                    <span>৳{base_cost}</span>
                  </div>
                </div>
              </div>

              {/* Counterpart info — name, trust badge, rating; never a phone number */}
              {counterpart && (
                <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-4 border border-green-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-green-200">
                      <AvatarFallback className="bg-green-100 text-green-800">
                        {counterpart.full_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-green-800 truncate">{counterpart.full_name}</p>
                        {counterpartVerified && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 gap-1 text-[10px] px-1.5 py-0">
                            <CheckCircle className="w-3 h-3" />
                            {counterpart.trust_level === 'partner' ? t('profilePage.partner') : t('profilePage.verified')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-600">
                        <span>{counterpartLabel}</span>
                        {counterpart.average_rating !== null && (
                          <>
                            <span>·</span>
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span>{counterpart.average_rating}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bhara protection notice */}
              <div className="bg-gradient-to-r from-green-50 to-lime-50 rounded-lg p-3 border border-green-200 flex items-start gap-2.5">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 text-sm">{t('rental.modal.protectedTitle')}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {t('rental.modal.protectedDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Details tabs - Scrollable independently */}
          <div className="flex-1 flex flex-col p-2 sm:p-4 md:p-6 overflow-y-auto">
            <div className="p-0">
              <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="w-full mb-5 bg-green-50 p-1 border border-green-200 rounded-full">
                  <TabsTrigger
                    value="details"
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
                  >
                    {t('rental.modal.tabDetails')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
                  >
                    {t('rental.modal.tabTimeline')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
                  >
                    {t('rental.modal.tabReviews')}
                  </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-5">
                  {/* Rental period card */}
                  <div className="bg-gradient-to-r from-green-50 to-lime-50 rounded-lg overflow-hidden border border-green-200">
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <h3 className="text-base font-semibold text-green-800">{t('rental.modal.rentalPeriod')}</h3>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex-1 bg-white p-3 rounded border border-green-300 text-center">
                          <p className="text-xs text-gray-500 uppercase mb-1">{t('listings.startDate')}</p>
                          <p className="text-sm font-medium text-gray-800">
                            {formatDate(start_date)}
                          </p>
                        </div>

                        <div className="flex-1 bg-white p-3 rounded border border-green-300 text-center">
                          <p className="text-xs text-gray-500 uppercase mb-1">{t('listings.endDate')}</p>
                          <p className="text-sm font-medium text-gray-800">
                            {formatDate(end_date)}
                          </p>
                        </div>

                        <div className="flex-1 bg-lime-50 p-3 rounded border border-lime-300 text-center">
                          <p className="text-xs text-gray-500 uppercase mb-1">{t('rental.modal.duration')}</p>
                          <p className="text-sm font-medium text-lime-800">
                            {rentalDuration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item details */}
                  <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-white px-4 py-3 border-b border-green-100">
                      <h3 className="text-base font-semibold text-green-800">{t('rental.modal.itemDetails')}</h3>
                    </div>

                    <div className="p-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-2">{t('rental.modal.specifications')}</h4>
                        <ul className="space-y-2.5">
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-600">{t('listings.category')}</span>
                            <span className="font-medium text-gray-800">{productCategory}</span>
                          </li>
                          <Separator className="bg-green-50" />
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-600">{t('listings.securityDeposit')}</span>
                            <span className="font-medium text-gray-800">৳{security_deposit}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Settlement — from staff-recorded payment records */}
                  {settlement && (
                    <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-50 to-white px-4 py-3 border-b border-green-100">
                        <h3 className="text-base font-semibold text-green-800">{t('rental.settlement.title')}</h3>
                      </div>

                      <div className="p-4">
                        <ul className="space-y-2.5">
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-600">{t('rental.settlement.rentPaid')}</span>
                            <span className="font-medium text-gray-800">৳{Number(settlement.rent_paid) || 0}</span>
                          </li>
                          <Separator className="bg-green-50" />
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-600">{t('rental.settlement.depositHeld')}</span>
                            <span className="font-medium text-gray-800">৳{Number(settlement.deposit_held) || 0}</span>
                          </li>
                          <Separator className="bg-green-50" />
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-600">{t('rental.settlement.depositReturned')}</span>
                            <span className="font-medium text-gray-800">৳{Number(settlement.deposit_returned) || 0}</span>
                          </li>
                          <Separator className="bg-green-50" />
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-600">{t('rental.settlement.ownerPaid')}</span>
                            <span className="font-medium text-gray-800">৳{Number(settlement.owner_paid) || 0}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Notes if available */}
                  {rental.notes && (
                    <div className="bg-gradient-to-r from-amber-50 to-white rounded-lg p-3 border border-amber-200">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm mb-1">{t('rental.modal.specialNotes')}</p>
                          <p className="text-xs text-gray-700">{rental.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Timeline Tab */}
                <TabsContent value="timeline" className="space-y-5">
                  <div className="bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-green-100">
                      <h3 className="text-base font-semibold text-green-800">{t('rental.modal.timelineTitle')}</h3>
                    </div>

                    <div className="p-4">
                      <div className="space-y-0">
                        {statusHistory.length > 0 ? (
                          statusHistory.map((entry, index) => {
                            const isLast = index === statusHistory.length - 1;
                            return (
                              <div key={index} className={`relative pl-8 ${isLast ? '' : 'pb-8'}`}>
                                <div className={`absolute left-0 top-1 h-5 w-5 rounded-full ${timelineDotColor(entry.status)} border-3 border-white shadow-sm`}></div>
                                {!isLast && (
                                  <div className="absolute left-2.5 top-6 h-full w-px bg-green-100"></div>
                                )}
                                <div>
                                  <h4 className="text-sm font-medium text-green-800">{timelineLabel(entry.status)}</h4>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {formatDateTime(safeDate(entry.timestamp))}
                                  </p>
                                  {entry.note && (
                                    <p className="mt-2 text-xs text-gray-700 bg-green-50/50 p-2 rounded border border-green-100">
                                      {entry.note}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="relative pl-8">
                            <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-green-600 border-3 border-white shadow-sm"></div>
                            <div>
                              <h4 className="text-sm font-medium text-green-800">{t('rental.timeline.submitted')}</h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {formatDate(safeDate(rental.created_at))}
                              </p>
                              <p className="mt-2 text-xs text-gray-700 bg-green-50/50 p-2 rounded border border-green-100">
                                {t('rental.timeline.submittedFor', { title: productTitle })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Documentation Photos */}
                  <div className="bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-green-100">
                      <h3 className="text-base font-semibold text-green-800">{t('rental.photos.title')}</h3>
                    </div>

                    <div className="p-4 space-y-5">
                      {/* Pre-rental photos */}
                      <div>
                        <h4 className="font-medium text-green-700 text-sm mb-2">{t('rental.photos.preTitle')}</h4>
                        {preRentalPhotos.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {preRentalPhotos.map((photo) => (
                              <div key={photo.id} className="aspect-square rounded overflow-hidden border border-green-200 shadow-sm">
                                <img
                                  src={photo.photo}
                                  alt={t('rental.photos.preTitle')}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border border-dashed border-green-200 rounded p-3 text-center bg-green-50/30">
                            <p className="text-green-600 text-xs">
                              {isPending
                                ? t('rental.photos.availableAfterStart')
                                : t('rental.photos.noPrePhotos')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Post-rental photos */}
                      <div>
                        <h4 className="font-medium text-green-700 text-sm mb-2">{t('rental.photos.postTitle')}</h4>
                        {postRentalPhotos.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {postRentalPhotos.map((photo) => (
                              <div key={photo.id} className="aspect-square rounded overflow-hidden border border-green-200 shadow-sm">
                                <img
                                  src={photo.photo}
                                  alt={t('rental.photos.postTitle')}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border border-dashed border-green-200 rounded p-3 text-center bg-green-50/30">
                            <p className="text-green-600 text-xs">
                              {isCompleted
                                ? t('rental.photos.noPostPhotos')
                                : t('rental.photos.availableAfterComplete')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-5">
                  <div className="bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-green-100">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <h3 className="text-base font-semibold text-green-800">{t('review.sectionTitle')}</h3>
                      </div>
                    </div>

                    <div className="p-4">
                      {reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div key={review.id} className="pb-4 border-b border-green-100 last:border-0 last:pb-0">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8 border border-gray-200">
                                  <AvatarFallback className="bg-gray-100 text-gray-800">
                                    {review.reviewer_name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex flex-col gap-1 mb-1.5">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-800">{review.reviewer_name}</h4>
                                      <div className="flex items-center mt-1">
                                        <div className="flex">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`h-3.5 w-3.5 ${
                                                i < review.rating
                                                  ? 'text-yellow-500 fill-yellow-500'
                                                  : 'text-gray-300'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        <span className="ml-2 text-xs text-gray-500">
                                          {formatDate(safeDate(review.created_at))}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-700 bg-green-50/50 p-2 rounded border border-green-100">
                                    {review.comment}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare className="mx-auto h-10 w-10 text-green-200 mb-2" />
                          <p className="text-green-700 font-medium text-sm">{t('review.noReviews')}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {t('review.beFirstRental')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review form appears if rental is completed */}
                  {isCompleted && (
                    <div className="bg-gradient-to-r from-green-50 to-lime-50 rounded-lg border border-green-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-green-100">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <h3 className="text-base font-semibold text-green-800">{t('review.leaveReview')}</h3>
                        </div>
                      </div>

                      <div className="p-4">
                        <ReviewForm
                          rentalId={rental.id}
                          userRole={userRole}
                          onSubmit={handleReviewSubmit}
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Action buttons - Fixed position at bottom of modal */}
        <div className="border-t border-green-200 bg-gradient-to-r from-green-50 to-white px-2 sm:px-5 py-3 flex flex-wrap gap-2 justify-end flex-shrink-0 sticky bottom-0 z-10">
          {/* Contextual buttons based on status and user role.
              in_progress -> completed and the return confirmation are
              Bhara-staff-only transitions (Django admin) — no buttons here. */}
          {canRenterCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusAction(rental.id, 'cancel')}
              className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
            >
              {isPending ? t('rental.actions.cancelRequest') : t('rental.actions.cancelRental')}
            </Button>
          )}

          {isPending && userRole === 'owner' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusAction(rental.id, 'reject')}
                className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
              >
                {t('rental.actions.reject')}
              </Button>
              <Button
                size="sm"
                onClick={() => onStatusAction(rental.id, 'accept')}
                className="bg-gradient-to-r from-green-600 to-lime-600 hover:opacity-90 text-white text-xs"
              >
                {t('rental.actions.accept')}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentalDetailModal;
