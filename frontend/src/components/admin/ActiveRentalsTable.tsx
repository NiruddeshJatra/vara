import { 
  Eye, 
  Calendar,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle
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
import { Progress } from "@/components/ui/progress";

interface ActiveRentalsTableProps {
  searchTerm: string;
}

// Mock data for active rentals
const MOCK_RENTALS = [
  {
    id: 201,
    itemId: 1,
    itemTitle: "Samsung Galaxy S21 Ultra",
    itemImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60",
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
    itemImage: "https://images.unsplash.com/photo-1524143986875-3b098d78b363?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60",
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
    itemImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60",
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
    itemImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60",
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
    itemImage: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=60",
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
  // Filter rentals based on search term
  const filteredRentals = MOCK_RENTALS.filter(
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

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Parties</TableHead>
              <TableHead>Rental Period</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRentals.length > 0 ? (
              filteredRentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">#{rental.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={rental.itemImage} 
                        alt={rental.itemTitle}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div>
                        <div className="max-w-[200px] truncate font-medium">
                          {rental.itemTitle}
                        </div>
                        <div className="text-xs text-gray-500">
                          ৳{rental.totalPrice} (৳{rental.securityDeposit} deposit)
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                            {rental.renter.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <span className="font-medium">{rental.renter}</span>
                          <span className="text-xs text-gray-500 ml-1">(Renter)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs bg-green-100 text-green-800">
                            {rental.owner.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <span className="font-medium">{rental.owner}</span>
                          <span className="text-xs text-gray-500 ml-1">(Owner)</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1" />
                        <span>{formatDate(rental.startDate)}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1" />
                        <span>{formatDate(rental.endDate)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 w-24">
                      <Progress value={rental.progressPercent} className="h-2" />
                      <div className="flex justify-between items-center text-xs text-gray-500">
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
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      {(rental.returnsToday || rental.status === "pending_return") && (
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                        >
                          Process Return
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
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