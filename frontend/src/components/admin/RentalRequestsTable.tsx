import { 
  Check, 
  X, 
  Eye, 
  Users,
  Star,
  Calendar,
  Clock,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

interface RentalRequestsTableProps {
  searchTerm: string;
}

// Mock data for rental requests
const MOCK_REQUESTS = [
  {
    id: 101,
    itemId: 1,
    itemTitle: "Samsung Galaxy S21 Ultra",
    itemImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60",
    renter: "Adnan Khan",
    renterRating: 4.7,
    owner: "Ahmed Rahman",
    ownerRating: 4.9,
    startDate: "2023-06-20",
    endDate: "2023-06-25",
    totalPrice: 6000,
    securityDeposit: 5000,
    requestDate: "2023-06-15T10:30:00Z",
    hasMultipleRequests: true,
    requestCount: 3,
    notes: "First time using the service. Will take good care of the device."
  },
  {
    id: 102,
    itemId: 3,
    itemTitle: "Canon EOS R5 Camera with RF 24-105mm Lens",
    itemImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60",
    renter: "Fatima Khan",
    renterRating: 4.8,
    owner: "Mohammed Ali",
    ownerRating: 4.2,
    startDate: "2023-06-22",
    endDate: "2023-06-24",
    totalPrice: 3600,
    securityDeposit: 10000,
    requestDate: "2023-06-14T14:15:00Z",
    hasMultipleRequests: false,
    requestCount: 1,
    notes: "I'm a professional photographer and need this for a wedding shoot."
  },
  {
    id: 103,
    itemId: 4,
    itemTitle: "Apple MacBook Pro 16-inch",
    itemImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60",
    renter: "Noor Ahmed",
    renterRating: 3.5,
    owner: "Imran Hossain",
    ownerRating: 4.6,
    startDate: "2023-06-25",
    endDate: "2023-07-02",
    totalPrice: 17500,
    securityDeposit: 15000,
    requestDate: "2023-06-13T09:45:00Z",
    hasMultipleRequests: true,
    requestCount: 2,
    notes: "Need for a business trip. Will be extremely careful with it."
  },
  {
    id: 104,
    itemId: 5,
    itemTitle: "PlayStation 5 with Two Controllers",
    itemImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60",
    renter: "Saad Rahman",
    renterRating: 5.0,
    owner: "Nadia Ahmed",
    ownerRating: 4.7,
    startDate: "2023-06-18",
    endDate: "2023-06-19",
    totalPrice: 1600,
    securityDeposit: 4000,
    requestDate: "2023-06-12T16:20:00Z",
    hasMultipleRequests: false,
    requestCount: 1,
    notes: "Weekend gaming with friends. Previous renter, always return items in perfect condition."
  },
  {
    id: 105,
    itemId: 2,
    itemTitle: "DJI Mavic Air 2 Drone",
    itemImage: "https://images.unsplash.com/photo-1524143986875-3b098d78b363?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60",
    renter: "Mahmud Islam",
    renterRating: 4.2,
    owner: "Fatima Khan",
    ownerRating: 4.8,
    startDate: "2023-06-21",
    endDate: "2023-06-28",
    totalPrice: 6300,
    securityDeposit: 4500,
    requestDate: "2023-06-11T11:10:00Z",
    hasMultipleRequests: true,
    requestCount: 4,
    notes: "Planning to use for aerial videography around Dhaka. I have experience with drones."
  }
];

const RentalRequestsTable = ({ searchTerm }: RentalRequestsTableProps) => {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  
  // Filter requests based on search term
  const filteredRequests = requests.filter(
    request =>
      request.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.renter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toString().includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatRequestDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleView = (id: number, title: string) => {
    toast({
      title: "Viewing Request Details",
      description: `Viewing rental request for ${title}`,
      variant: "default",
    });
  };

  const handleApprove = (id: number, title: string, renter: string) => {
    toast({
      title: "Request Approved",
      description: `Rental request for ${title} has been approved for ${renter}`,
      variant: "default",
    });
    setRequests(requests.filter(request => request.id !== id));
  };

  const handleReject = (id: number, title: string, renter: string) => {
    toast({
      title: "Request Rejected",
      description: `Rental request from ${renter} for ${title} has been rejected`,
      variant: "default",
    });
    setRequests(requests.filter(request => request.id !== id));
  };

  const handleCompare = (id: number, count: number) => {
    toast({
      title: "Comparing Requests",
      description: `Comparing ${count} requests for this item`,
      variant: "default",
    });
  };

  const handleItemClick = (itemId: number, title: string) => {
    toast({
      title: "Item Details",
      description: `Viewing details for ${title} (ID: ${itemId})`,
      variant: "default",
    });
  };

  const handleOwnerClick = (owner: string, rating: number) => {
    toast({
      title: "Owner Profile",
      description: `Viewing profile for ${owner} (Rating: ${rating})`,
      variant: "default",
    });
  };

  const handleRenterClick = (renter: string, rating: number) => {
    toast({
      title: "Renter Profile",
      description: `Viewing profile for ${renter} (Rating: ${rating})`,
      variant: "default",
    });
  };

  return (
    <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-green-50">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-green-50">
            <TableRow>
              <TableHead className="w-[80px] text-green-800 font-semibold">ID</TableHead>
              <TableHead className="text-green-800 font-semibold">Item</TableHead>
              <TableHead className="text-green-800 font-semibold">Renter</TableHead>
              <TableHead className="text-green-800 font-semibold">Rental Period</TableHead>
              <TableHead className="text-green-800 font-semibold">
                <div className="flex items-center">
                  Price (৳) <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-green-800 font-semibold">Status</TableHead>
              <TableHead className="text-green-800 font-semibold">Requested</TableHead>
              <TableHead className="text-right text-green-800 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <TableRow key={request.id} className="hover:bg-green-50/50">
                  <TableCell className="font-medium text-green-700">#{request.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <div 
                          className="max-w-[200px] truncate font-medium text-green-700 cursor-pointer hover:text-green-500 hover:underline"
                          onClick={() => handleItemClick(request.itemId, request.itemTitle)}
                        >
                          {request.itemTitle}
                        </div>
                        <div className="flex items-center text-xs text-green-600">
                          <span 
                            className="cursor-pointer hover:text-green-500 hover:underline"
                            onClick={() => handleOwnerClick(request.owner, request.ownerRating)}
                          >
                            Owner: {request.owner}
                          </span>
                          <span className="mx-1">•</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-0.5" />
                            <span>{request.ownerRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div 
                        className="font-medium text-green-700 cursor-pointer hover:text-green-500 hover:underline"
                        onClick={() => handleRenterClick(request.renter, request.renterRating)}
                      >
                        {request.renter}
                      </div>
                      <div className="flex items-center text-xs text-green-600">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-0.5" />
                        <span>{request.renterRating}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-green-700">
                      <Calendar className="h-3.5 w-3.5 text-green-600" />
                      <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-green-700">৳{request.totalPrice}</div>
                      <div className="text-xs text-green-600">
                        ৳{request.securityDeposit} deposit
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.hasMultipleRequests ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1 cursor-help">
                              <Users className="h-3 w-3" />
                              <span>{request.requestCount} Reqs</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white text-green-800 border border-green-200">
                            <p>This item has multiple rental requests.<br/>Select the best renter.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-300 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Pending</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-green-700">
                    <div className="text-sm">{formatRequestDate(request.requestDate)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-green-300 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleView(request.id, request.itemTitle)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleApprove(request.id, request.itemTitle, request.renter)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 border-green-300 hover:bg-green-50 hover:text-red-700"
                        onClick={() => handleReject(request.id, request.itemTitle, request.renter)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                      {request.hasMultipleRequests && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleCompare(request.id, request.requestCount)}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Compare
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-green-600">
                  No rental requests found matching "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RentalRequestsTable; 