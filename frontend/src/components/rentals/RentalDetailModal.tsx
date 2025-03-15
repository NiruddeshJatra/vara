
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Rental } from "@/pages/Rentals";
import { MessageSquare, Star, Calendar, DollarSign, Shield, Clock, AlertTriangle } from "lucide-react";
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
  
  // Status badge configuration
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending Approval' };
      case 'accepted':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Accepted' };
      case 'in_progress':
        return { color: 'bg-green-100 text-green-800 border-green-200', label: 'In Progress' };
      case 'completed':
        return { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Completed' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800 border-red-200', label: 'Rejected' };
      case 'cancelled':
        return { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(rental.status);
  const rentalDuration = differenceInCalendarDays(new Date(rental.endTime), new Date(rental.startTime));
  
  // Sample images for the carousel
  const sampleImages = [
    rental.itemImage,
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  ];

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Rental Details 
            <span className="text-gray-500">#{rental.id}</span>
          </DialogTitle>
          <Badge className={`${statusConfig.color} self-start mt-2`}>
            {statusConfig.label}
          </Badge>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          
          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            {/* Item Details Section */}
            <div>
              <h3 className="text-lg font-medium mb-3">Item Information</h3>
              <div className="rounded-lg overflow-hidden mb-4">
                <Carousel>
                  <CarouselContent>
                    {sampleImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="h-60 w-full rounded-md overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${rental.itemTitle} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-lg">{rental.itemTitle}</h4>
                <Badge variant="outline" className="mt-1">
                  {rental.itemCategory}
                </Badge>
                <p className="mt-2 text-gray-600">
                  This is a high-quality item available for rental. Perfect for your needs, well-maintained and ready to use.
                </p>
                <Button variant="link" className="p-0 mt-1 h-auto text-green-600">
                  View Full Item Details
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {/* Rental Information Section */}
            <div>
              <h3 className="text-lg font-medium mb-3">Rental Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Rental Period</p>
                    <p className="text-gray-600">
                      {format(new Date(rental.startTime), "MMM d, yyyy")} - {format(new Date(rental.endTime), "MMM d, yyyy")}
                    </p>
                    <p className="text-sm text-gray-500">{rentalDuration} days total</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Pricing</p>
                    <div className="text-gray-600 space-y-1">
                      <p>Base Price: ${rental.basePrice}/day × {rentalDuration} days</p>
                      <p>Security Deposit: ${rental.securityDeposit}</p>
                      <p className="font-semibold text-black">Total: ${rental.totalPrice}</p>
                    </div>
                  </div>
                </div>
                
                {rental.notes && (
                  <div className="flex items-start gap-3 col-span-1 md:col-span-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Notes</p>
                      <p className="text-gray-600">{rental.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* Participants Section */}
            <div>
              <h3 className="text-lg font-medium mb-3">Participants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={rental.ownerImage} />
                    <AvatarFallback>{rental.ownerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{rental.ownerName}</p>
                    <p className="text-sm text-gray-500">Owner</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm">4.9 (42 reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={rental.renterImage} />
                    <AvatarFallback>{rental.renterName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{rental.renterName}</p>
                    <p className="text-sm text-gray-500">Renter</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm">4.8 (15 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => onStatusAction(rental.id, 'contact')}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Message {userRole === 'renter' ? 'Owner' : 'Renter'}</span>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Rental Timeline</h3>
              <div className="space-y-4">
                <div className="relative pl-6 pb-6 border-l-2 border-green-200">
                  <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-green-500"></div>
                  <div className="font-medium">Request Submitted</div>
                  <div className="text-sm text-gray-600">{format(new Date(rental.createdAt), "MMM d, yyyy 'at' h:mm a")}</div>
                </div>
                
                {(rental.status !== 'pending') && (
                  <div className="relative pl-6 pb-6 border-l-2 border-green-200">
                    <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-green-500"></div>
                    <div className="font-medium">
                      Request {rental.status === 'rejected' ? 'Rejected' : 'Approved'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(rental.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                )}
                
                {(rental.status === 'in_progress' || rental.status === 'completed') && (
                  <div className="relative pl-6 pb-6 border-l-2 border-green-200">
                    <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-green-500"></div>
                    <div className="font-medium">Rental Started</div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(rental.startTime), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                )}
                
                {rental.status === 'completed' && (
                  <div className="relative pl-6">
                    <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-green-500"></div>
                    <div className="font-medium">Rental Completed</div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(rental.endTime), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Rental Documentation</h3>
              
              {/* Pre-rental photos */}
              <h4 className="font-medium text-gray-700 mb-2">Pre-Rental Photos</h4>
              {rental.status === 'pending' || rental.status === 'accepted' ? (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center mb-6">
                  <p className="text-gray-500">
                    Photos will be available once the rental begins.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={`pre-${i}`} className="aspect-square rounded-md overflow-hidden border border-gray-200">
                      <img 
                        src={`https://images.unsplash.com/photo-151${i + 2000000}?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80`} 
                        alt={`Pre-rental photo ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Post-rental photos */}
              <h4 className="font-medium text-gray-700 mb-2">Post-Rental Photos</h4>
              {rental.status !== 'completed' ? (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-500">
                    Photos will be available once the rental is completed.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[4, 5, 6].map((i) => (
                    <div key={`post-${i}`} className="aspect-square rounded-md overflow-hidden border border-gray-200">
                      <img 
                        src={`https://images.unsplash.com/photo-151${i + 2000000}?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80`} 
                        alt={`Post-rental photo ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Review form appears if on details tab and rental is completed */}
        {activeTab === "details" && rental.status === "completed" && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-3">Leave a Review</h3>
            <ReviewForm 
              rentalId={rental.id} 
              userRole={userRole} 
              onSubmit={(rating, review) => {
                onStatusAction(rental.id, 'submitReview');
                onClose();
              }} 
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 justify-end mt-6 pt-4 border-t border-gray-100">
          {/* Contextual buttons based on status and user role */}
          {rental.status === 'pending' && userRole === 'renter' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => onStatusAction(rental.id, 'cancel')}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Cancel Request
              </Button>
            </>
          )}
          
          {rental.status === 'pending' && userRole === 'owner' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => onStatusAction(rental.id, 'reject')}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Reject Request
              </Button>
              <Button 
                onClick={() => onStatusAction(rental.id, 'accept')}
                className="bg-green-600 hover:bg-green-700"
              >
                Accept Request
              </Button>
            </>
          )}
          
          {rental.status === 'accepted' && (
            <Button 
              variant="outline" 
              onClick={() => onStatusAction(rental.id, 'cancel')}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Cancel Rental
            </Button>
          )}
          
          {rental.status === 'in_progress' && userRole === 'renter' && (
            <Button 
              onClick={() => onStatusAction(rental.id, 'complete')}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Rental
            </Button>
          )}
          
          {rental.status === 'in_progress' && userRole === 'owner' && (
            <Button 
              onClick={() => onStatusAction(rental.id, 'confirmReturn')}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Return
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentalDetailModal;
