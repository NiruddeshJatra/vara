import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Rental } from "@/pages/Rentals";
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
  
  // Status badge configuration
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'pending':
        return { color: 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200', label: 'Pending Approval' };
      case 'accepted':
        return { color: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200', label: 'Accepted' };
      case 'in_progress':
        return { color: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200', label: 'In Progress' };
      case 'completed':
        return { color: 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200', label: 'Completed' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200', label: 'Rejected' };
      case 'cancelled':
        return { color: 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200 hover:bg-orange-200', label: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200', label: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(rental.status);
  const rentalDuration = differenceInCalendarDays(new Date(rental.endTime), new Date(rental.startTime));
  
  // Calculate service fee (8% of base price total)
  const serviceFee = Math.round(rental.basePrice * rentalDuration * 0.08);
  
  // Sample images for the carousel
  const sampleImages = [
    rental.itemImage,
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  ];

  // Sample reviews data
  const sampleReviews = [
    {
      id: 1,
      userName: "Ahmed Khan",
      userImage: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      comment: "Great experience renting this item. The owner was very helpful and the item was in excellent condition.",
      createdAt: "2023-06-15T10:30:00Z"
    },
    {
      id: 2,
      userName: "Sara Rahman",
      userImage: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      comment: "The item was as described. Pickup and return process was smooth.",
      createdAt: "2023-05-22T14:15:00Z"
    }
  ];

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setActiveImageIndex(prev => (prev === 0 ? sampleImages.length - 1 : prev - 1));
    } else {
      setActiveImageIndex(prev => (prev === sampleImages.length - 1 ? 0 : prev + 1));
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
              <p className="text-sm text-green-600">{rental.itemTitle}</p>
                        </div>
              </div>
              
          <div className="flex items-center">
            <Badge className={`${statusConfig.color} text-xs px-2.5 py-0.5 mr-8 font-medium hover:opacity`}>
              {statusConfig.label}
                </Badge>
              </div>
            </div>
            
        {/* Main content wrapper - flex-grow to take available space */}
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          {/* Left column - Images and price - Scrollable independently */}
          <div className="md:w-2/5 bg-gradient-to-b from-green-50 to-white p-5 overflow-y-auto border-r border-green-100">
            <div className="space-y-5">
              {/* Main image view */}
              <div className="relative rounded-lg overflow-hidden bg-white border border-green-200 shadow-md aspect-square">
                <img 
                  src={sampleImages[activeImageIndex]} 
                  alt={`${rental.itemTitle} - Image ${activeImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                
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
                  <span>{activeImageIndex + 1} of {sampleImages.length}</span>
                    </div>
                  </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-1.5">
                {sampleImages.map((image, index) => (
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
                      alt={`${rental.itemTitle} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              
              {/* Rental price card */}
              <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-4 border border-green-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-semibold text-green-800">Price Summary</h3>
                  <span className="text-lg font-bold text-green-700">৳{rental.totalPrice}</span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Base price</span>
                    <span>৳{rental.basePrice} × {rentalDuration} days</span>
                    </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>৳{serviceFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security deposit</span>
                    <span>৳{rental.securityDeposit}</span>
                  </div>
                  <Separator className="my-2 bg-green-100" />
                  <div className="flex justify-between font-medium text-green-800">
                    <span>Total</span>
                    <span>৳{rental.totalPrice}</span>
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
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-green-50/30">
            <div className="p-5 pb-24">
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
                            {format(new Date(rental.startTime), "MMM d, yyyy")}
                          </p>
            </div>
            
                        <div className="flex-1 bg-white p-3 rounded border border-green-300 text-center">
                          <p className="text-xs text-gray-500 uppercase mb-1">End Date</p>
                          <p className="text-sm font-medium text-gray-800">
                            {format(new Date(rental.endTime), "MMM d, yyyy")}
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
                            <span className="font-medium text-gray-800">{rental.itemCategory}</span>
                          </li>
                          <Separator className="bg-green-50" />
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-600">Condition</span>
                            <span className="font-medium text-gray-800">Excellent</span>
                          </li>
                          <Separator className="bg-green-50" />
                          <li className="flex justify-between text-sm">
                            <span className="text-gray-600">Security Deposit</span>
                            <span className="font-medium text-gray-800">৳{rental.securityDeposit}</span>
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
                              {format(new Date(rental.createdAt), "MMMM d, yyyy")}
                            </p>
                            <p className="mt-2 text-xs text-gray-700 bg-green-50/50 p-2 rounded border border-green-100">
                              Rental request was submitted for {rental.itemTitle}.
                            </p>
                          </div>
                </div>
                
                {(rental.status !== 'pending') && (
                          <div className="relative pl-8 pb-8">
                            <div className={`absolute left-0 top-1 h-5 w-5 rounded-full ${
                              rental.status === 'rejected' ? 'bg-red-500' : 'bg-green-600'
                            } border-3 border-white shadow-sm`}></div>
                            <div className="absolute left-2.5 top-6 h-full w-px bg-green-100"></div>
                            <div>
                              <h4 className="text-sm font-medium text-green-800">
                      Request {rental.status === 'rejected' ? 'Rejected' : 'Approved'}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {format(new Date(rental.updatedAt), "MMMM d, yyyy")}
                              </p>
                              <p className="mt-2 text-xs text-gray-700 bg-green-50/50 p-2 rounded border border-green-100">
                                {rental.status === 'rejected' 
                                  ? 'The rental request was rejected.' 
                                  : 'The rental request was approved and confirmed.'}
                              </p>
                    </div>
                  </div>
                )}
                
                {(rental.status === 'in_progress' || rental.status === 'completed') && (
                          <div className="relative pl-8 pb-8">
                            <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-lime-600 border-3 border-white shadow-sm"></div>
                            <div className="absolute left-2.5 top-6 h-full w-px bg-green-100"></div>
                            <div>
                              <h4 className="text-sm font-medium text-green-800">Rental Started</h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {format(new Date(rental.startTime), "MMMM d, yyyy")}
                              </p>
                              <p className="mt-2 text-xs text-gray-700 bg-green-50/50 p-2 rounded border border-green-100">
                                The {rental.itemCategory} was picked up and the rental period began.
                              </p>
                    </div>
                  </div>
                )}
                
                {rental.status === 'completed' && (
                          <div className="relative pl-8">
                            <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-purple-600 border-3 border-white shadow-sm"></div>
                            <div>
                              <h4 className="text-sm font-medium text-green-800">Rental Completed</h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {format(new Date(rental.endTime), "MMMM d, yyyy")}
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
              {rental.status === 'pending' || rental.status === 'accepted' ? (
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
              {rental.status !== 'completed' ? (
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
                      {sampleReviews.length > 0 ? (
                        <div className="space-y-4">
                          {sampleReviews.map((review) => (
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
                                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
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
                  {rental.status === "completed" && (
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
        <div className="border-t border-green-200 bg-gradient-to-r from-green-50 to-white px-5 py-3 flex flex-wrap gap-2 justify-end flex-shrink-0 sticky bottom-0 z-10">
          {/* Contextual buttons based on status and user role */}
          {rental.status === 'pending' && userRole === 'renter' && (
              <Button 
                variant="outline" 
              size="sm"
                onClick={() => onStatusAction(rental.id, 'cancel')}
              className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
              >
                Cancel Request
              </Button>
          )}
          
          {rental.status === 'pending' && userRole === 'owner' && (
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
                onClick={() => onStatusAction(rental.id, 'accept')}
                className="bg-gradient-to-r from-green-600 to-lime-600 hover:opacity-90 text-white text-xs"
              >
                Accept Request
              </Button>
            </>
          )}
          
          {rental.status === 'accepted' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusAction(rental.id, 'cancel')}
              className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
            >
              Cancel Rental
            </Button>
          )}
          
          {rental.status === 'in_progress' && userRole === 'renter' && (
            <Button 
              size="sm"
              onClick={() => onStatusAction(rental.id, 'complete')}
              className="bg-green-600 hover:bg-green-700 text-white text-xs"
            >
              Complete Rental
            </Button>
          )}
          
          {rental.status === 'in_progress' && userRole === 'owner' && (
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
