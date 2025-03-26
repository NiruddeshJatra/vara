import { 
  Check, 
  X, 
  Eye, 
  Users,
  Star,
  Calendar,
  Clock
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
  // Filter requests based on search term
  const filteredRequests = MOCK_REQUESTS.filter(
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

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Renter</TableHead>
              <TableHead>Rental Period</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">#{request.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={request.itemImage} 
                        alt={request.itemTitle}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div>
                        <div className="max-w-[200px] truncate font-medium">
                          {request.itemTitle}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Owner: {request.owner}</span>
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
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{request.renter.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{request.renter}</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-0.5" />
                          <span>{request.renterRating}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                      <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>৳{request.totalPrice}</div>
                      <div className="text-xs text-gray-500">
                        ৳{request.securityDeposit} deposit
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.hasMultipleRequests ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1 cursor-help">
                              <Users className="h-3 w-3" />
                              <span>{request.requestCount} Requests</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
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
                  <TableCell>
                    <div className="text-sm">{formatRequestDate(request.requestDate)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                      {request.hasMultipleRequests && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
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
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
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