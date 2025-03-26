import { 
  Eye, 
  Mail,
  Phone,
  Check,
  X,
  MoreHorizontal,
  Star,
  Shield,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

interface UserManagementTableProps {
  searchTerm: string;
}

// Mock data for users
const MOCK_USERS = [
  {
    id: 1001,
    name: "Ahmed Rahman",
    email: "ahmed.rahman@example.com",
    phone: "+880 1712 345678",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.9,
    joined: "2023-01-15T10:30:00Z",
    verified: true,
    type: "both", // can be 'renter', 'owner', or 'both'
    listingsCount: 5,
    rentalsCount: 7,
    status: "active"
  },
  {
    id: 1002,
    name: "Fatima Khan",
    email: "fatima.khan@example.com",
    phone: "+880 1612 876543",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.8,
    joined: "2023-02-20T14:15:00Z",
    verified: true,
    type: "owner",
    listingsCount: 3,
    rentalsCount: 0,
    status: "active"
  },
  {
    id: 1003,
    name: "Mohammed Ali",
    email: "mohammed.ali@example.com",
    phone: "+880 1812 234567",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    rating: 4.2,
    joined: "2023-02-25T09:45:00Z",
    verified: true,
    type: "both",
    listingsCount: 2,
    rentalsCount: 4,
    status: "active"
  },
  {
    id: 1004,
    name: "Noor Ahmed",
    email: "noor.ahmed@example.com",
    phone: "+880 1912 765432",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 3.5,
    joined: "2023-03-05T16:20:00Z",
    verified: false,
    type: "renter",
    listingsCount: 0,
    rentalsCount: 2,
    status: "pending_verification"
  },
  {
    id: 1005,
    name: "Imran Hossain",
    email: "imran.hossain@example.com",
    phone: "+880 1512 345678",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    rating: 4.6,
    joined: "2023-03-15T11:10:00Z",
    verified: true,
    type: "owner",
    listingsCount: 8,
    rentalsCount: 0,
    status: "active"
  },
  {
    id: 1006,
    name: "Saad Rahman",
    email: "saad.rahman@example.com",
    phone: "+880 1612 987654",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5.0,
    joined: "2023-04-10T08:30:00Z",
    verified: false,
    type: "renter",
    listingsCount: 0,
    rentalsCount: 3,
    status: "suspended"
  }
];

const UserManagementTable = ({ searchTerm }: UserManagementTableProps) => {
  const [users, setUsers] = useState(MOCK_USERS);
  
  // Filter users based on search term
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.id.toString().includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserTypeBadge = (type: string) => {
    switch(type) {
      case 'renter':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            Renter
          </Badge>
        );
      case 'owner':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Owner
          </Badge>
        );
      case 'both':
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            Renter & Owner
          </Badge>
        );
      default:
        return null;
    }
  };

  const getUserStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
            <Check className="h-3 w-3" />
            <span>Active</span>
          </Badge>
        );
      case 'pending_verification':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Pending Verification</span>
          </Badge>
        );
      case 'suspended':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1">
            <X className="h-3 w-3" />
            <span>Suspended</span>
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const handleUserClick = (userId: number, name: string) => {
    toast({
      title: "User Profile",
      description: `Viewing user profile for ${name} (ID: ${userId})`,
      variant: "default",
    });
  };
  
  const handleViewDetails = (userId: number, name: string) => {
    toast({
      title: "User Details",
      description: `Viewing detailed information for ${name}`,
      variant: "default",
    });
  };
  
  const handleVerifyUser = (userId: number, name: string) => {
    toast({
      title: "User Verified",
      description: `${name} has been verified successfully`,
      variant: "default",
    });
    setUsers(users.map(user => 
      user.id === userId 
        ? {...user, verified: true, status: 'active'} 
        : user
    ));
  };
  
  const handleSuspendUser = (userId: number, name: string) => {
    toast({
      title: "User Suspended",
      description: `${name} has been suspended`,
      variant: "default",
    });
    setUsers(users.map(user => 
      user.id === userId 
        ? {...user, status: 'suspended'} 
        : user
    ));
  };
  
  const handleSendMessage = (userId: number, name: string) => {
    toast({
      title: "Message Sent",
      description: `Message initiated to ${name}`,
      variant: "default",
    });
  };

  return (
    <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-green-50">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-green-50">
            <TableRow>
              <TableHead className="w-[60px] text-green-800 font-semibold">ID</TableHead>
              <TableHead className="text-green-800 font-semibold">User</TableHead>
              <TableHead className="text-green-800 font-semibold">Contact</TableHead>
              <TableHead className="text-green-800 font-semibold">
                <div className="flex items-center">
                  Activity <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-green-800 font-semibold">Status</TableHead>
              <TableHead className="text-green-800 font-semibold">Type</TableHead>
              <TableHead className="text-green-800 font-semibold">Joined</TableHead>
              <TableHead className="text-right text-green-800 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-green-50/50">
                  <TableCell className="font-medium text-green-700">#{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="border border-green-200">
                        <AvatarImage src={user.image} />
                        <AvatarFallback className="bg-green-100 text-green-800">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div 
                          className="font-medium text-green-700 cursor-pointer hover:text-green-500 hover:underline"
                          onClick={() => handleUserClick(user.id, user.name)}
                        >
                          {user.name}
                        </div>
                        <div className="flex items-center text-xs text-green-600">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-0.5" />
                          <span>{user.rating}</span>
                          {user.verified && (
                            <>
                              <span className="mx-1">•</span>
                              <Badge className="h-4 px-1 bg-green-100 text-green-800 text-[10px] border-green-300">Verified</Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-green-700">
                        <Mail className="h-3.5 w-3.5 text-green-600 mr-1.5" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-green-700">
                        <Phone className="h-3.5 w-3.5 text-green-600 mr-1.5" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-sm text-green-700">
                        <span>Listings:</span>
                        <span>{user.listingsCount}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-green-700">
                        <span>Rentals:</span>
                        <span>{user.rentalsCount}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getUserStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    {getUserTypeBadge(user.type)}
                  </TableCell>
                  <TableCell className="text-green-700">
                    {formatDate(user.joined)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-green-300 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleViewDetails(user.id, user.name)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View profile</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-green-300 hover:bg-green-50 hover:text-green-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-green-200">
                          <DropdownMenuItem 
                            className="cursor-pointer hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleSendMessage(user.id, user.name)}
                          >
                            Send message
                          </DropdownMenuItem>
                          {user.status === 'pending_verification' && (
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-green-50 hover:text-green-700"
                              onClick={() => handleVerifyUser(user.id, user.name)}
                            >
                              Verify user
                            </DropdownMenuItem>
                          )}
                          {user.status !== 'suspended' && (
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleSuspendUser(user.id, user.name)}
                            >
                              Suspend user
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="bg-green-100" />
                          <DropdownMenuItem className="cursor-pointer hover:bg-green-50 hover:text-green-700">
                            View activity log
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
                  No users found matching "{searchTerm}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagementTable; 