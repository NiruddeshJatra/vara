import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Rental } from "@/types/rentals";
import { 
  MessageSquare, 
  Star, 
  Calendar, 
  DollarSign, 
  Shield, 
  Clock, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  X,
  Camera
} from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import ReviewForm from "./ReviewForm";
import { useState } from "react";
import { RentalStatus } from '@/constants/rental';

interface RentalDetailModalProps {
  rental: Rental;
  onClose: () => void;
  onStatusAction: (rentalId: number, action: string) => void;
  userRole: 'renter' | 'owner';
}

const RentalDetailModal = ({ 
  rental, 
  onClose, 
  onStatusAction,
  userRole
}: RentalDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<string>("details");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // --- Rental status logic: Only use valid statuses from RentalStatus enum. ---
  // Valid: 'pending', 'approved', 'rejected', 'cancelled', 'completed'
  // Treat 'approved' as "in progress" for UI/logic

  const isPending = rental.status === RentalStatus.PENDING;
  const isApproved = rental.status === RentalStatus.APPROVED; // "In progress"
  const isRejected = rental.status === RentalStatus.REJECTED;
  const isCancelled = rental.status === RentalStatus.CANCELLED;
  const isCompleted = rental.status === RentalStatus.COMPLETED;

  // Status badge configuration
  const getStatusConfig = (status: RentalStatus) => {
    switch(status) {
      case RentalStatus.PENDING:
        return { color: 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200', label: 'Pending Approval' };
      case RentalStatus.APPROVED:
        return { color: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200', label: 'In Progress' };
      case RentalStatus.COMPLETED:
        return { color: 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200', label: 'Completed' };
      case RentalStatus.REJECTED:
        return { color: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200', label: 'Rejected' };
      case RentalStatus.CANCELLED:
        return { color: 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200 hover:bg-orange-200', label: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200', label: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(rental.status);
  
  // --- Use real API data instead of mock/sample data. Keep design unchanged. ---
  // Images
  const productImages = Array.isArray(rental.product?.images)
    ? rental.product.images.map((img: any) => img.image)
    : [];
  const hasImages = productImages.length > 0;

  // Reviews (if you have real reviews, otherwise keep as empty array)
  const reviews = Array.isArray(rental.reviews) ? rental.reviews : [];

  // Dates (camelCase)
  const safeDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };
  const startDate = safeDate(rental.startDate);
  const endDate = safeDate(rental.endDate);
  const formatDate = (date: Date | null) => date ? format(date, 'MMM d, yyyy') : 'N/A';

  // Price and service fee
  const totalCost = typeof rental.totalCost === 'number' ? rental.totalCost : 0;
  const serviceFee = typeof rental.serviceFee === 'number' ? rental.serviceFee : 0;

  // Product info
  const productTitle = typeof rental.product?.title === 'string' ? rental.product.title : 'Product';
  const productCategory = typeof rental.product?.category === 'string' ? rental.product.category : '';
  const productDescription = typeof rental.product?.description === 'string' ? rental.product.description : '';
  const securityDeposit = typeof rental.product?.securityDeposit === 'number' ? rental.product.securityDeposit : 0;

  // Rental duration
  const rentalDuration = startDate && endDate ? differenceInCalendarDays(endDate, startDate) : 'N/A';

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!hasImages) return;
    if (direction === 'prev') {
      setActiveImageIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1));
    } else {
      setActiveImageIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 rounded-xl overflow-hidden bg-gradient-to-b from-green-50/50 to-white flex flex-col">
        {/* Top header with close button */}
        <div className="bg-gradient-to-r from-green-200 to-lime-100 px-6 py-3 flex items-center justify-between border-b border-green-300 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-green-800">Rental #{rental.id}</h2>
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
                    No images available
                  </div>
                )}
                
                {/* Navigation arrows */}
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => navigateImage('prev')}
                    className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm text-green-700"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => navigateImage('next')}
                    className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm text-green-700"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Image counter badge */}
                <div className="absolute bottom-3 right-3 bg-green-700/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Camera className="h-3 w-3" />
                  <span>{hasImages ? `${activeImageIndex + 1} of ${productImages.length}` : 'No images'}</span>
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
                  <h3 className="text-base font-semibold text-green-800">Price Summary</h3>
                  <span className="text-lg font-bold text-green-700">৳{totalCost}</span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Base price</span>
                    <span>৳{rental.totalCost} × {rentalDuration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>৳{serviceFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security deposit</span>
                    <span>৳{securityDeposit}</span>
                  </div>
                  <Separator className="my-2 bg-green-100" />
                  <div className="flex justify-between font-medium text-green-800">
                    <span>Total</span>
                    <span>৳{totalCost}</span>
                  </div>
                </div>
              </div>
              
              {/* Vara protection notice */}
              <div className="bg-gradient-to-r from-green-50 to-lime-50 rounded-lg p-3 border border-green-200 flex items-start gap-2.5">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 text-sm">Vara-Protected Transaction</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Vara handles all communications and transactions for security.
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
                    Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="timeline" 
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
                  >
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reviews" 
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>
                
                {/* Details Tab */}
                <TabsContent value="details" className="space-y-5">
                  {/* Rental period card */}
                  <div className="bg-gradient-to-r from-green-50 to-lime-50 rounded-lg overflow-hidden border border-green-200">
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <h3 className="text-base font-semibold text-green-800">Rental Period</h3>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex-1 bg-white p-3 rounded border border-green-300 text-center">
                          <p className="text-xs text-gray-500 uppercase mb-1">Start Date</p>
                          <p className="text-sm font-medium text-gray-800">
                            {formatDate(startDate)}
                          </p>
                        </div>
                        
                        <div className="flex-1 bg-white p-3 rounded border border-green-300 text-center">
                          <p className="text-xs text-gray-500 uppercase mb-1">End Date</p>
                          <p className="text-sm font-medium text-gray-800">
                            {formatDate(endDate)}
                          </p>
                        </div>
                        
                        <div className="flex-1 bg-lime-50 p-3 rounded border border-lime-300 text-center">
                          <p className="text-xs text-gray-500 uppercase mb-1">Duration</p>
                          <p className="text-sm font-medium text-lime-800">
                            {rentalDuration} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Item details */}
                  <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-white px-4 py-3 border-b border-green-100">
                      <h3 className="text-base font-semibold text-green-800">Item Details</h3>
                    </div>
                    
                    <div className="p-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-2">Specifications</h4>
                        <ul className="space-y-2.5">
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-600">Category</span>
                            <span className="font-medium text-gray-800">{productCategory}</span>
                          </li>
                          <Separator className="bg-green-50" />
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-600">Condition</span>
                            <span className="font-medium text-gray-800">Excellent</span>
                          </li>
                          <Separator className="bg-green-50" />
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-600">Security Deposit</span>
                            <span className="font-medium text-gray-800">৳{securityDeposit}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes if available */}
                  {rental.notes && (
                    <div className="bg-gradient-to-r from-amber-50 to-white rounded-lg p-3 border border-amber-200">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm mb-1">Special Notes</p>
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
                      <h3 className="text-base font-semibold text-green-800">Rental Timeline</h3>
                    </div>
                    
                    <div className="p-4">
                      <div className="space-y-0">
                        <div className="relative pl-8 pb-8">
                          <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-green-600 border-3 border-white shadow-sm"></div>
                          <div className="absolute left-2.5 top-6 h-full w-px bg-green-100"></div>
                          <div>
                            <h4 className="text-sm font-medium text-green-800">Request Submitted</h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatDate(startDate)}
                            </p>
                            <p className="mt-2 text-xs text-gray-700 bg-green-50/50 p-2 rounded border border-green-100">
                              Rental request was submitted for {productTitle}.
                            </p>
                          </div>
                        </div>
                        
                        {(rental.status !== RentalStatus.PENDING) && (
                          <div className="relative pl-8 pb-8">
                            <div className={`absolute left-0 top-1 h-5 w-5 rounded-full ${
                              rental.status === RentalStatus.REJECTED ? 'bg-red-500' : 'bg-green-600'
                            } border-3 border-white shadow-sm`}></div>
                            <div className="absolute left-2.5 top-6 h-full w-px bg-green-100"></div>
                            <div>
                              <h4 className="text-sm font-medium text-green-800">
                                Request {rental.status === RentalStatus.REJECTED ? 'Rejected' : 'Approved'}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {formatDate(endDate)}
                              </p>
                              <p className="mt-2 text-xs text-gray-700 bg-green-50/50 p-2 rounded border border-green-100">
                                {rental.status === RentalStatus.REJECTED 
                                  ? 'The rental request was rejected.' 
                                  : 'The rental request was approved and confirmed.'}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {(isApproved || isCompleted) && (
                          <div className="relative pl-8 pb-8">
                            <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-lime-600 border-3 border-white shadow-sm"></div>
                            <div className="absolute left-2.5 top-6 h-full w-px bg-green-100"></div>
                            <div>
                              <h4 className="text-sm font-medium text-green-800">Rental Started</h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {formatDate(startDate)}
                              </p>
                              <p className="mt-2 text-xs text-gray-700 bg-green-50/50 p-2 rounded border border-green-100">
                                The {productCategory} was picked up and the rental period began.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {isCompleted && (
                          <div className="relative pl-8">
                            <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-purple-600 border-3 border-white shadow-sm"></div>
                            <div>
                              <h4 className="text-sm font-medium text-green-800">Rental Completed</h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {formatDate(endDate)}
                              </p>
                              <p className="mt-2 text-xs text-gray-700 bg-green-50/50 p-2 rounded border border-green-100">
                                The item was returned in good condition and the rental was completed.
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
                      <h3 className="text-base font-semibold text-green-800">Documentation Photos</h3>
                    </div>
                    
                    <div className="p-4 space-y-5">
                      {/* Pre-rental photos */}
                      <div>
                        <h4 className="font-medium text-green-700 text-sm mb-2">Pre-Rental Condition</h4>
                        {(isPending || isApproved) ? (
                          <div className="border border-dashed border-green-200 rounded p-3 text-center bg-green-50/30">
                            <p className="text-green-600 text-xs">
                              Photos will be available once the rental begins.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map((i) => (
                              <div key={`pre-${i}`} className="aspect-square rounded overflow-hidden border border-green-200 shadow-sm">
                                <img 
                                  src={`https://images.unsplash.com/photo-151${i + 2000000}?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80`} 
                                  alt={`Pre-rental photo ${i}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Post-rental photos */}
                      <div>
                        <h4 className="font-medium text-green-700 text-sm mb-2">Post-Rental Condition</h4>
                        {(isPending || isApproved) ? (
                          <div className="border border-dashed border-green-200 rounded p-3 text-center bg-green-50/30">
                            <p className="text-green-600 text-xs">
                              Photos will be available once the rental is completed.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {[4, 5, 6].map((i) => (
                              <div key={`post-${i}`} className="aspect-square rounded overflow-hidden border border-green-200 shadow-sm">
                                <img 
                                  src={`https://images.unsplash.com/photo-151${i + 2000000}?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80`} 
                                  alt={`Post-rental photo ${i}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            ))}
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
                        <h3 className="text-base font-semibold text-green-800">Reviews &amp; Ratings</h3>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div key={review.id} className="pb-4 border-b border-green-100 last:border-0 last:pb-0">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8 border border-gray-200">
                                  <AvatarImage src={review.userImage} />
                                  <AvatarFallback className="bg-gray-100 text-gray-800">
                                    {review.userName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex flex-col gap-1 mb-1.5">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-800">{review.userName}</h4>
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
                                          {formatDate(new Date(review.createdAt))}
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
                          <p className="text-green-700 font-medium text-sm">No reviews yet</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Be the first to review this rental experience!
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
                          <h3 className="text-base font-semibold text-green-800">Leave a Review</h3>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <ReviewForm 
                          rentalId={rental.id} 
                          userRole={userRole} 
                          onSubmit={(rating, review) => {
                            onStatusAction(rental.id, 'submitReview');
                            onClose();
                          }} 
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
          {/* Contextual buttons based on status and user role */}
          {isPending && userRole === 'renter' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusAction(rental.id, 'cancel')}
              className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
            >
              Cancel Request
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
                Reject Request
              </Button>
              <Button 
                size="sm"
                onClick={() => onStatusAction(rental.id, 'approve')}
                className="bg-gradient-to-r from-green-600 to-lime-600 hover:opacity-90 text-white text-xs"
              >
                Approve Request
              </Button>
            </>
          )}
          
          {isApproved && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusAction(rental.id, 'cancel')}
              className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
            >
              Cancel Rental
            </Button>
          )}
          
          {isApproved && userRole === 'renter' && (
            <Button 
              size="sm"
              onClick={() => onStatusAction(rental.id, 'complete')}
              className="bg-green-600 hover:bg-green-700 text-white text-xs"
            >
              Complete Rental
            </Button>
          )}
          
          {isApproved && userRole === 'owner' && (
            <Button 
              size="sm"
              onClick={() => onStatusAction(rental.id, 'confirmReturn')}
              className="bg-gradient-to-r from-green-600 to-lime-600 hover:opacity-90 text-white text-xs"
            >
              Confirm Return
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentalDetailModal;
