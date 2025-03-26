import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Activity,
  Boxes,
  Calendar,
  ClipboardList,
  Clock,
  DollarSign,
  Home,
  LayoutDashboard,
  Package,
  Shield,
  Users,
  Bell,
  Search,
  Menu,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PendingListingsTable from "../components/admin/PendingListingsTable";
import RentalRequestsTable from "../components/admin/RentalRequestsTable";
import ActiveRentalsTable from "../components/admin/ActiveRentalsTable";
import UserManagementTable from "../components/admin/UserManagementTable";
import ReportsAndAnalytics from "../components/admin/ReportsAndAnalytics";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  // Mock dashboard statistics
  const dashboardStats = {
    totalUsers: 568,
    activeRentals: 124,
    pendingApprovals: 18,
    pendingRequests: 32,
    returnsToday: 5,
    revenue: 24650,
  };

  const handleLogout = () => {
    adminLogout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin panel",
      variant: "default",
    });
    navigate("/admin/login");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 5 unread notifications",
      variant: "default",
    });
  };

  const handleUserVerification = () => {
    handleTabChange("users");
    toast({
      title: "User Verification",
      description: "Navigating to user verification section",
      variant: "default",
    });
  };

  const handleSystemStatus = () => {
    toast({
      title: "System Status",
      description: "All systems operational",
      variant: "default",
    });
  };

  const handleAdminSettings = () => {
    toast({
      title: "Admin Settings",
      description: "Settings panel will be available soon",
      variant: "default",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Admin Sidebar */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 flex-col bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex border-r border-gray-200`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-green-600" />
            <h1 className="text-xl font-bold text-gray-800">Vara Admin</h1>
          </div>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "dashboard" ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange("dashboard")}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "listings" ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange("listings")}
              >
                <Package className="h-5 w-5" />
                <span>Listings</span>
                {dashboardStats.pendingApprovals > 0 && (
                  <Badge className="ml-auto bg-amber-100 text-amber-800 border-amber-300">{dashboardStats.pendingApprovals}</Badge>
                )}
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "requests" ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange("requests")}
              >
                <ClipboardList className="h-5 w-5" />
                <span>Rental Requests</span>
                {dashboardStats.pendingRequests > 0 && (
                  <Badge className="ml-auto bg-amber-100 text-amber-800 border-amber-300">{dashboardStats.pendingRequests}</Badge>
                )}
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "active-rentals" ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange("active-rentals")}
              >
                <Calendar className="h-5 w-5" />
                <span>Active Rentals</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "users" ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange("users")}
              >
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "reports" ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange("reports")}
              >
                <Activity className="h-5 w-5" />
                <span>Reports & Analytics</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/admin-profile.jpg" />
              <AvatarFallback className="bg-green-100 text-green-700">AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">admin@vara.com</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="mt-4 w-full border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
              <button 
                className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                onClick={handleNotificationClick}
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  5
                </span>
              </button>
              <div className="md:hidden">
                <Avatar>
                  <AvatarImage src="/admin-profile.jpg" />
                  <AvatarFallback className="bg-green-100 text-green-700">AD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="hidden md:flex border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Refresh Data
                </Button>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-gray-700">Total Users</CardTitle>
                    <CardDescription>All registered users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="h-8 w-8 text-blue-500" />
                      <span className="text-3xl font-bold">{dashboardStats.totalUsers}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-gray-700">Active Rentals</CardTitle>
                    <CardDescription>Currently in progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Boxes className="h-8 w-8 text-green-500" />
                      <span className="text-3xl font-bold">{dashboardStats.activeRentals}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-gray-700">Revenue</CardTitle>
                    <CardDescription>Total platform revenue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-8 w-8 text-yellow-500" />
                      <span className="text-3xl font-bold">৳{dashboardStats.revenue}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <ClipboardList className="h-5 w-5 text-amber-600" />
                      Pending Approvals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span>Listings</span>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">{dashboardStats.pendingApprovals}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Rental Requests</span>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">{dashboardStats.pendingRequests}</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-amber-300 text-amber-800 hover:bg-amber-100"
                      onClick={() => handleTabChange("listings")}
                    >
                      Review Pending Items
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Clock className="h-5 w-5 text-blue-600" />
                      Today's Returns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span>Items due today</span>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">{dashboardStats.returnsToday}</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-300 text-blue-800 hover:bg-blue-100"
                      onClick={() => handleTabChange("active-rentals")}
                    >
                      Process Returns
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-white border border-green-100 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Home className="h-5 w-5 text-green-600" />
                      Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        className="justify-start w-full text-left border-green-300 text-green-800 hover:bg-green-100"
                        onClick={handleUserVerification}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        User Verification
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start w-full text-left border-green-300 text-green-800 hover:bg-green-100"
                        onClick={handleSystemStatus}
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        System Status
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleAdminSettings}
                    >
                      Admin Settings
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        type: "listing", 
                        title: "Samsung Galaxy S21 Ultra", 
                        user: "Ahmed Rahman", 
                        time: "10 minutes ago",
                        action: "created"
                      },
                      { 
                        type: "rental", 
                        title: "Canon EOS R5 Camera", 
                        user: "Fatima Khan", 
                        time: "30 minutes ago",
                        action: "requested"
                      },
                      { 
                        type: "return", 
                        title: "MacBook Pro 16-inch", 
                        user: "Mohammed Ali", 
                        time: "1 hour ago",
                        action: "completed"
                      },
                      { 
                        type: "listing", 
                        title: "DJI Mavic Air 2", 
                        user: "Imran Hossain", 
                        time: "2 hours ago",
                        action: "approved"
                      },
                      { 
                        type: "rental", 
                        title: "PlayStation 5", 
                        user: "Nadia Ahmed", 
                        time: "3 hours ago",
                        action: "started"
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={
                            activity.type === "listing" ? "bg-green-100 text-green-800" :
                            activity.type === "rental" ? "bg-blue-100 text-blue-800" :
                            "bg-purple-100 text-purple-800"
                          }>
                            {activity.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-800">{activity.user}</p>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {activity.action === "created" && "Created a new listing for"}
                            {activity.action === "requested" && "Requested to rent"}
                            {activity.action === "completed" && "Completed rental return for"}
                            {activity.action === "approved" && "Got listing approved for"}
                            {activity.action === "started" && "Started rental for"}
                            <span className="font-medium"> {activity.title}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => toast({
                      title: "View all activity",
                      description: "Full activity log will be available soon",
                    })}
                  >
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "listings" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">Listing Management</h1>
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="mb-6 bg-white border border-gray-200 rounded-md p-1">
                  <TabsTrigger value="pending" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Pending Approval</TabsTrigger>
                  <TabsTrigger value="active" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Active Listings</TabsTrigger>
                  <TabsTrigger value="rejected" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Rejected</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending">
                  <PendingListingsTable searchTerm={searchTerm} />
                </TabsContent>
                
                <TabsContent value="active">
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">Active listings would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="rejected">
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">Rejected listings would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">Rental Requests</h1>
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="mb-6 bg-white border border-gray-200 rounded-md p-1">
                  <TabsTrigger value="pending" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Pending Approval</TabsTrigger>
                  <TabsTrigger value="multiple" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Multiple Requests</TabsTrigger>
                  <TabsTrigger value="approved" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Approved</TabsTrigger>
                  <TabsTrigger value="rejected" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Rejected</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending">
                  <RentalRequestsTable searchTerm={searchTerm} />
                </TabsContent>
                
                <TabsContent value="multiple">
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">Items with multiple rental requests would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="approved">
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">Approved rental requests would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="rejected">
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">Rejected rental requests would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "active-rentals" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">Active Rentals</h1>
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="mb-6 bg-white border border-gray-200 rounded-md p-1">
                  <TabsTrigger value="current" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Current Rentals</TabsTrigger>
                  <TabsTrigger value="ending-soon" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Ending Soon</TabsTrigger>
                  <TabsTrigger value="returns" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Pending Returns</TabsTrigger>
                </TabsList>
                
                <TabsContent value="current">
                  <ActiveRentalsTable searchTerm={searchTerm} />
                </TabsContent>
                
                <TabsContent value="ending-soon">
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">Rentals ending within 48 hours would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="returns">
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">Rentals awaiting return processing would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6 bg-white border border-gray-200 rounded-md p-1">
                  <TabsTrigger value="all" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">All Users</TabsTrigger>
                  <TabsTrigger value="lenders" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Lenders</TabsTrigger>
                  <TabsTrigger value="renters" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Renters</TabsTrigger>
                  <TabsTrigger value="verification" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Pending Verification</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <UserManagementTable searchTerm={searchTerm} />
                </TabsContent>
                
                <TabsContent value="lenders">
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">Users with listings would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="renters">
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">Users who have rented items would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="verification">
                  <Card className="border border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-500">Users pending identity verification would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
              <ReportsAndAnalytics />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 