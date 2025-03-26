import { 
  Eye, 
  Mail,
  Phone,
  Check,
  X,
  MoreHorizontal,
  Star,
  Shield
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
  // Filter users based on search term
  const filteredUsers = MOCK_USERS.filter(
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

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">#{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-0.5" />
                          <span>{user.rating}</span>
                          {user.verified && (
                            <>
                              <span className="mx-1">•</span>
                              <Badge className="h-4 px-1 bg-blue-100 text-blue-800 text-[10px]">Verified</Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {user.listingsCount > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">{user.listingsCount}</span>
                          <span className="text-gray-500"> listings</span>
                        </div>
                      )}
                      {user.rentalsCount > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">{user.rentalsCount}</span>
                          <span className="text-gray-500"> rentals</span>
                        </div>
                      )}
                      {user.listingsCount === 0 && user.rentalsCount === 0 && (
                        <div className="text-sm text-gray-500">No activity yet</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getUserStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    {getUserTypeBadge(user.type)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(user.joined)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View profile</span>
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
                          <DropdownMenuItem>
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {user.verified ? "Revoke Verification" : "Verify User"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "active" ? (
                            <DropdownMenuItem className="text-red-600">
                              Suspend Account
                            </DropdownMenuItem>
                          ) : user.status === "suspended" ? (
                            <DropdownMenuItem className="text-green-600">
                              Reactivate Account
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
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