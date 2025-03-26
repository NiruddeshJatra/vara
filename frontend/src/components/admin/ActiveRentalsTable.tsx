import { 
  Eye, 
  Calendar,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle,
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
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

interface ActiveRentalsTableProps {
  searchTerm: string;
}

// Mock data for active rentals
const MOCK_RENTALS = [
  {
    id: 201,
    itemId: 1,
    itemTitle: "Samsung Galaxy S21 Ultra",
    renter: "Adnan Khan",
    owner: "Ahmed Rahman",
    startDate: "2023-06-15",
    endDate: "2023-06-20",
    totalPrice: 6000,
    securityDeposit: 5000,
    progressPercent: 60,
    daysLeft: 2,
    status: "in_progress",
    returnsToday: false,
    notes: "The device was collected in good condition."
  },
  {
    id: 202,
    itemId: 2,
    itemTitle: "DJI Mavic Air 2 Drone",
    renter: "Mahmud Islam",
    owner: "Fatima Khan",
    startDate: "2023-06-12",
    endDate: "2023-06-19",
    totalPrice: 6300,
    securityDeposit: 4500,
    progressPercent: 90,
    daysLeft: 1,
    status: "in_progress",
    returnsToday: false,
    notes: ""
  },
  {
    id: 203,
    itemId: 3,
    itemTitle: "Canon EOS R5 Camera with RF 24-105mm Lens",
    renter: "Fatima Khan",
    owner: "Mohammed Ali",
    startDate: "2023-06-16",
    endDate: "2023-06-18",
    totalPrice: 3600,
    securityDeposit: 10000,
    progressPercent: 66,
    daysLeft: 1,
    status: "in_progress",
    returnsToday: true,
    notes: "Renter is a professional photographer."
  },
  {
    id: 204,
    itemId: 5,
    itemTitle: "PlayStation 5 with Two Controllers",
    renter: "Saad Rahman",
    owner: "Nadia Ahmed",
    startDate: "2023-06-17",
    endDate: "2023-06-18",
    totalPrice: 1600,
    securityDeposit: 4000,
    progressPercent: 95,
    daysLeft: 0,
    status: "in_progress",
    returnsToday: true,
    notes: "Weekend rental. Due for return today."
  },
  {
    id: 205,
    itemId: 6,
    itemTitle: "Microsoft Surface Laptop 4",
    renter: "Rahima Begum",
    owner: "Kamal Ahmed",
    startDate: "2023-06-10",
    endDate: "2023-06-18",
    totalPrice: 7200,
    securityDeposit: 9000,
    progressPercent: 98,
    daysLeft: 0,
    status: "pending_return",
    returnsToday: true,
    notes: "Rental period ended. Waiting for return processing."
  }
];

const ActiveRentalsTable = ({ searchTerm }: ActiveRentalsTableProps) => {
  const [rentals, setRentals] = useState(MOCK_RENTALS);
  
  // Filter rentals based on search term
  const filteredRentals = rentals.filter(
    rental =>
      rental.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.renter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.id.toString().includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (rental: typeof MOCK_RENTALS[0]) => {
    if (rental.status === "pending_return") {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-300 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Pending Return</span>
        </Badge>
      );
    }
    
    if (rental.returnsToday) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>Returns Today</span>
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        <span>In Progress</span>
      </Badge>
    );
  };

  const handleItemClick = (itemId: number, title: string) => {
    toast({
      title: "Item Details",
      description: `Viewing details for ${title} (ID: ${itemId})`,
      variant: "default",
    });
  };

  const handleRenterClick = (renter: string) => {
    toast({
      title: "Renter Profile",
      description: `Viewing profile for ${renter}`,
      variant: "default",
    });
  };

  const handleOwnerClick = (owner: string) => {
    toast({
      title: "Owner Profile",
      description: `Viewing profile for ${owner}`,
      variant: "default",
    });
  };

  const handleView = (id: number, title: string) => {
    toast({
      title: "Viewing Rental Details",
      description: `Viewing details for rental #${id} (${title})`,
      variant: "default",
    });
  };

  const handleProcessReturn = (id: number, title: string) => {
    toast({
      title: "Processing Return",
      description: `Initiating return process for ${title}`,
      variant: "default",
    });
    // In a real app, you would update the rental status
    setRentals(rentals.map(rental => 
      rental.id === id 
        ? {...rental, status: "pending_return"} 
        : rental
    ));
  };

  return (
    <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-green-50">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-green-50">
            <TableRow>
              <TableHead className="w-[80px] text-green-800 font-semibold">ID</TableHead>
              <TableHead className="text-green-800 font-semibold">Item</TableHead>
              <TableHead className="text-green-800 font-semibold">Parties</TableHead>
              <TableHead className="text-green-800 font-semibold">Rental Period</TableHead>
              <TableHead className="text-green-800 font-semibold">
                <div className="flex items-center">
                  Progress <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-green-800 font-semibold">Status</TableHead>
              <TableHead className="text-right text-green-800 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRentals.length > 0 ? (
              filteredRentals.map((rental) => (
                <TableRow key={rental.id} className="hover:bg-green-50/50">
                  <TableCell className="font-medium text-green-700">#{rental.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div 
                        className="max-w-[200px] truncate font-medium text-green-700 cursor-pointer hover:text-green-500 hover:underline"
                        onClick={() => handleItemClick(rental.itemId, rental.itemTitle)}
                      >
                        {rental.itemTitle}
                      </div>
                      <div className="text-xs text-green-600">
                        ৳{rental.totalPrice} (৳{rental.securityDeposit} deposit)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center">
                        <span 
                          className="text-sm font-medium text-green-700 cursor-pointer hover:text-green-500 hover:underline"
                          onClick={() => handleRenterClick(rental.renter)}
                        >
                          {rental.renter}
                        </span>
                        <span className="text-xs text-green-600 ml-1">(Renter)</span>
                      </div>
                      <div className="flex items-center">
                        <span 
                          className="text-sm font-medium text-green-700 cursor-pointer hover:text-green-500 hover:underline"
                          onClick={() => handleOwnerClick(rental.owner)}
                        >
                          {rental.owner}
                        </span>
                        <span className="text-xs text-green-600 ml-1">(Owner)</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-green-700">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 text-green-600 mr-1" />
                        <span>{formatDate(rental.startDate)}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-green-600" />
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 text-green-600 mr-1" />
                        <span>{formatDate(rental.endDate)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 w-24">
                      <Progress value={rental.progressPercent} className="h-2 bg-green-100 [&>div]:bg-green-600" />
                      <div className="flex justify-between items-center text-xs text-green-600">
                        <span>{rental.progressPercent}%</span>
                        {rental.daysLeft > 0 ? (
                          <span>{rental.daysLeft}d left</span>
                        ) : (
                          <span className="text-red-600 font-medium">Due today</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(rental)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-green-300 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleView(rental.id, rental.itemTitle)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      {rental.returnsToday && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleProcessReturn(rental.id, rental.itemTitle)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Process Return</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-green-600">
                  No active rentals found matching "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActiveRentalsTable; 