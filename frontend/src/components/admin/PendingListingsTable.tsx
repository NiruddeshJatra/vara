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
    submittedDate: "2023-06-15T10:30:00Z",
    images: 4
  },
  {
    id: 2,
    title: "DJI Mavic Air 2 Drone",
    category: "Electronics",
    owner: "Fatima Khan",
    price: 900,
    securityDeposit: 4500,
    submittedDate: "2023-06-14T14:15:00Z",
    images: 6
  },
  {
    id: 3,
    title: "Canon EOS R5 Camera with RF 24-105mm Lens",
    category: "Camera Equipment",
    owner: "Mohammed Ali",
    price: 1800,
    securityDeposit: 10000,
    submittedDate: "2023-06-13T09:45:00Z",
    images: 8
  },
  {
    id: 4,
    title: "Apple MacBook Pro 16-inch",
    category: "Computers",
    owner: "Noor Ahmed",
    price: 2500,
    securityDeposit: 15000,
    submittedDate: "2023-06-12T16:20:00Z",
    images: 5
  },
  {
    id: 5,
    title: "PlayStation 5 with Two Controllers",
    category: "Gaming",
    owner: "Imran Hossain",
    price: 800,
    securityDeposit: 4000,
    submittedDate: "2023-06-11T11:10:00Z",
    images: 3
  }
];

const PendingListingsTable = ({ searchTerm }: PendingListingsTableProps) => {
  // Filter listings based on search term
  const filteredListings = MOCK_LISTINGS.filter(
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

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Price (৳) <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Security Deposit</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Images</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">#{listing.id}</TableCell>
                  <TableCell>
                    <div className="max-w-[250px] truncate font-medium">
                      {listing.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-100">
                      {listing.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{listing.owner}</TableCell>
                  <TableCell>৳{listing.price}/day</TableCell>
                  <TableCell>৳{listing.securityDeposit}</TableCell>
                  <TableCell>{formatDate(listing.submittedDate)}</TableCell>
                  <TableCell>{listing.images} photos</TableCell>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Request more info</DropdownMenuItem>
                          <DropdownMenuItem>Contact owner</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-gray-500">
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