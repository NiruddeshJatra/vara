import { 
  Check, 
  X, 
  Eye, 
  MoreHorizontal,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

interface PendingListingsTableProps {
  searchTerm: string;
}

// Mock data for pending listings
const MOCK_LISTINGS = [
  {
    id: 1,
    title: "Samsung Galaxy S21 Ultra",
    category: "Electronics",
    owner: "Ahmed Rahman",
    price: 1200,
    securityDeposit: 5000,
    submittedDate: "2023-06-15T10:30:00Z"
  },
  {
    id: 2,
    title: "DJI Mavic Air 2 Drone",
    category: "Electronics",
    owner: "Fatima Khan",
    price: 900,
    securityDeposit: 4500,
    submittedDate: "2023-06-14T14:15:00Z"
  },
  {
    id: 3,
    title: "Canon EOS R5 Camera with RF 24-105mm Lens",
    category: "Camera",
    owner: "Mohammed Ali",
    price: 1800,
    securityDeposit: 10000,
    submittedDate: "2023-06-13T09:45:00Z"
  },
  {
    id: 4,
    title: "Apple MacBook Pro 16-inch",
    category: "Computers",
    owner: "Noor Ahmed",
    price: 2500,
    securityDeposit: 15000,
    submittedDate: "2023-06-12T16:20:00Z"
  },
  {
    id: 5,
    title: "PlayStation 5 with Two Controllers",
    category: "Gaming",
    owner: "Imran Hossain",
    price: 800,
    securityDeposit: 4000,
    submittedDate: "2023-06-11T11:10:00Z"
  }
];

const PendingListingsTable = ({ searchTerm }: PendingListingsTableProps) => {
  const [listings, setListings] = useState(MOCK_LISTINGS);
  
  // Filter listings based on search term
  const filteredListings = listings.filter(
    listing =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleView = (id: number, title: string) => {
    toast({
      title: "Viewing Details",
      description: `Viewing details for ${title}`,
      variant: "default",
    });
  };

  const handleApprove = (id: number, title: string) => {
    toast({
      title: "Listing Approved",
      description: `${title} has been approved and is now live`,
      variant: "default",
    });
    setListings(listings.filter(listing => listing.id !== id));
  };

  const handleReject = (id: number, title: string) => {
    toast({
      title: "Listing Rejected",
      description: `${title} has been rejected`,
      variant: "default",
    });
    setListings(listings.filter(listing => listing.id !== id));
  };

  const handleMoreAction = (action: string, owner: string) => {
    toast({
      title: action,
      description: `Action initiated for ${owner}`,
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
              <TableHead className="text-green-800 font-semibold">Category</TableHead>
              <TableHead className="text-green-800 font-semibold">Owner</TableHead>
              <TableHead className="text-green-800 font-semibold">
                <div className="flex items-center">
                  Price (৳) <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-green-800 font-semibold">Security Deposit</TableHead>
              <TableHead className="text-green-800 font-semibold">Submitted</TableHead>
              <TableHead className="text-right text-green-800 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <TableRow key={listing.id} className="hover:bg-green-50/50">
                  <TableCell className="font-medium text-green-700">#{listing.id}</TableCell>
                  <TableCell>
                    <div className="max-w-[250px] truncate font-medium text-green-700">
                      {listing.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      {listing.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-green-700">{listing.owner}</TableCell>
                  <TableCell className="text-green-700">৳{listing.price}/day</TableCell>
                  <TableCell className="text-green-700">৳{listing.securityDeposit}</TableCell>
                  <TableCell className="text-green-700">{formatDate(listing.submittedDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-green-300 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleView(listing.id, listing.title)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleApprove(listing.id, listing.title)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 border-green-300 hover:bg-green-50 hover:text-red-700"
                        onClick={() => handleReject(listing.id, listing.title)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-700 hover:bg-green-50"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-green-200">
                          <DropdownMenuItem onClick={() => handleMoreAction("Request more info", listing.owner)}>
                            Request more info
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMoreAction("Contact owner", listing.owner)}>
                            Contact owner
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-green-600">
                  No pending listings found matching "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingListingsTable; 