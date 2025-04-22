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
import { useState, useEffect } from "react";
import axios from 'axios';

interface UserManagementTableProps {
  searchTerm: string;
}

const UserManagementTable = ({ searchTerm }: UserManagementTableProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('admin_token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || ''}/api/admin/users/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.detail || err.message || 'Failed to fetch users.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(
    user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm) ||
      user.id?.toString().includes(searchTerm)
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

  if (loading) {
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
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-green-600">
                  Loading...
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (error) {
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
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-green-600">
                  {error}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

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