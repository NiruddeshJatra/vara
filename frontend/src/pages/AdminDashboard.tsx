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
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevTab, setPrevTab] = useState("dashboard");
  const { adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  // --- FETCH REAL DASHBOARD DATA ---
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeRentals: 0,
    pendingApprovals: 0,
    pendingRequests: 0,
    returnsToday: 0,
    revenue: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setStatsError(null);
      try {
        // Replace with your actual API endpoint
        const token = localStorage.getItem('admin_token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || ''}/api/admin/dashboard-stats/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardStats(response.data);
      } catch (error: any) {
        setStatsError(
          error?.response?.data?.detail || error.message || 'Failed to fetch dashboard stats.'
        );
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

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
    if (tab !== activeTab) {
      setPrevTab(activeTab);
      setActiveTab(tab);
    }
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

  const getSlideDirection = (tab: string) => {
    if (prevTab === tab) return "";

    const tabOrder = ["dashboard", "listings", "requests", "active-rentals", "users", "reports"];
    const currentIndex = tabOrder.indexOf(activeTab);
    const tabIndex = tabOrder.indexOf(tab);

    if (currentIndex === -1 || tabIndex === -1) return "";

    return currentIndex > tabIndex
      ? "animate-slide-right"
      : "animate-slide-left";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Admin Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 flex-col bg-gradient-to-r from-green-900 to-green-700 shadow-lg transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:flex border-r border-green-700`}
      >
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-white" />
            <h1 className="text-xl font-bold text-white">Bhara Admin</h1>
          </div>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md group ${activeTab === "dashboard" ? "bg-white/20 text-white font-medium" : "text-green-100 hover:bg-white/10"
                  }`}
                onClick={() => handleTabChange("dashboard")}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md group ${activeTab === "listings" ? "bg-white/20 text-white font-medium" : "text-green-100 hover:bg-white/10"
                  }`}
                onClick={() => handleTabChange("listings")}
              >
                <Package className="h-5 w-5" />
                <span>Listings</span>
                {dashboardStats.pendingApprovals > 0 && (
                  <Badge className="text-xs ml-auto bg-amber-100 text-amber-800 border-amber-300 transition-all group-hover:bg-amber-200">{dashboardStats.pendingApprovals}</Badge>
                )}
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md group ${activeTab === "requests" ? "bg-white/20 text-white font-medium" : "text-green-100 hover:bg-white/10"
                  }`}
                onClick={() => handleTabChange("requests")}
              >
                <ClipboardList className="h-5 w-5" />
                <span>Requests</span>
                {dashboardStats.pendingRequests > 0 && (
                  <Badge className="text-xs ml-auto bg-amber-100 text-amber-800 border-amber-300 transition-all group-hover:bg-amber-200">{dashboardStats.pendingRequests}</Badge>
                )}
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${activeTab === "active-rentals" ? "bg-white/20 text-white font-medium" : "text-green-100 hover:bg-white/10"
                  }`}
                onClick={() => handleTabChange("active-rentals")}
              >
                <Calendar className="h-5 w-5" />
                <span>Active Rentals</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${activeTab === "users" ? "bg-white/20 text-white font-medium" : "text-green-100 hover:bg-white/10"
                  }`}
                onClick={() => handleTabChange("users")}
              >
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${activeTab === "reports" ? "bg-white/20 text-white font-medium" : "text-green-100 hover:bg-white/10"
                  }`}
                onClick={() => handleTabChange("reports")}
              >
                <Activity className="h-5 w-5" />
                <span>Reports & Analytics</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-green-700">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/admin-profile.jpg" />
              <AvatarFallback className="bg-white text-green-700">AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-leaf-100">Admin User</p>
              <p className="text-xs text-green-200">admin@bhara.com</p>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleLogout}
            className="mt-4 w-full bg-white text-green-700 hover:bg-green-100 hover:text-green-800 font-semibold"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pr-6">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden text-green-700 hover:text-green-900 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 h-10 border-green-500 focus:border-green-500 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="relative p-2 text-green-700 hover:text-green-900 hover:bg-green-100 rounded-full"
                onClick={handleNotificationClick}
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full text-xs text-white flex items-center justify-center">
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
          <div className={`${activeTab === "dashboard" ? getSlideDirection("dashboard") : "hidden"}`}>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-green-800">Dashboard Overview</h1>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="hidden md:flex border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800"
                >
                  Refresh Data
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-green-800">Total Users</CardTitle>
                    <CardDescription className="text-green-600">All registered users</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-12">
                    <div className="flex items-center gap-2">
                      <div className="py-2 rounded-full bg-gradient-to-r from-white to-green-50">
                        <Users className="h-8 w-8 text-green-700" />
                      </div>
                      <span className="text-3xl font-medium text-green-600">{dashboardStats.totalUsers}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-green-800">Active Rentals</CardTitle>
                    <CardDescription className="text-green-600">Currently in progress</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-12">
                    <div className="flex items-center gap-2">
                      <div className="py-2 rounded-full bg-gradient-to-r from-white to-green-50">
                        <Boxes className="h-8 w-8 text-green-700" />
                      </div>
                      <span className="text-3xl font-medium text-green-600">{dashboardStats.activeRentals}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-green-800">Revenue</CardTitle>
                    <CardDescription className="text-green-600">Total platform revenue</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-12">
                    <div className="flex items-center gap-2">
                      <div className="py-2 rounded-full bg-gradient-to-r from-white to-green-50">
                        <DollarSign className="h-8 w-8 text-green-700" />
                      </div>
                      <span className="text-3xl font-medium text-green-600">৳{dashboardStats.revenue}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <ClipboardList className="h-5 w-5 text-green-700" />
                      Pending Approvals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Listings</span>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">{dashboardStats.pendingApprovals}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Rental Requests</span>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">{dashboardStats.pendingRequests}</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button
                      variant="outline"
                      className="w-full border-green-400 text-green-700 hover:bg-green-50 hover:text-green-800 font-semibold"
                      onClick={() => handleTabChange("listings")}
                    >
                      Review Pending Items
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-gradient-to-br from-lime-50 to-white border border-lime-100 hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Clock className="h-5 w-5 text-green-700" />
                      Today's Returns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Items due today</span>
                        <Badge variant="outline" className="bg-lime-100 text-lime-800 border-lime-300">{dashboardStats.returnsToday}</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button
                      variant="outline"
                      className="w-full border-green-400 text-green-700 hover:bg-green-50 hover:text-green-800 font-semibold"
                      onClick={() => handleTabChange("active-rentals")}
                    >
                      Process Returns
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-gradient-to-br from-leaf-100 to-white border border-green-100 hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Home className="h-5 w-5 text-green-700" />
                      Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="justify-start w-full text-left border-green-300 text-green-700 hover:bg-green-50"
                        onClick={handleUserVerification}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        User Verification
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start w-full text-left border-green-300 text-green-700 hover:bg-green-50"
                        onClick={handleSystemStatus}
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        System Status
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button
                      variant="outline"
                      className="w-full border-green-400 text-green-700 hover:bg-green-50 hover:text-green-800 font-semibold"
                      onClick={handleAdminSettings}
                    >
                      Admin Settings
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">Recent Activity</CardTitle>
                  <CardDescription className="text-green-600">Latest actions on the platform</CardDescription>
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
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-green-100 last:border-0">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={
                            activity.type === "listing" ? "bg-green-100 text-green-800" :
                              activity.type === "rental" ? "bg-green-100 text-green-800" :
                                "bg-green-100 text-green-800"
                          }>
                            {activity.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-green-700">{activity.user}</p>
                            <span className="text-xs text-green-600">{activity.time}</span>
                          </div>
                          <p className="text-sm text-green-600">
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
                <CardFooter className="flex justify-center">
                  <Button
                    variant="outline"
                    className="px-8 bg-green-600 text-white hover:text-green-50 hover:bg-green-700"
                    onClick={() => toast({
                      title: "View all activity",
                      description: "Full activity log will be available soon",
                      variant: "default",
                    })}
                  >
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className={`${activeTab === "listings" ? getSlideDirection("listings") : "hidden"}`}>
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-green-800">Listing Management</h1>
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="mb-6 bg-green-600 border border-green-600 rounded-md p-1">
                  <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Pending Approval</TabsTrigger>
                  <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Active Listings</TabsTrigger>
                  <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                  <PendingListingsTable searchTerm={searchTerm} />
                </TabsContent>

                <TabsContent value="active">
                  <Card className="border border-green-200 bg-gradient-to-b from-white to-green-50">
                    <CardContent className="pt-6">
                      <p className="text-center text-green-600">Active listings would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="rejected">
                  <Card className="border border-green-200 bg-gradient-to-b from-white to-green-50">
                    <CardContent className="pt-6">
                      <p className="text-center text-green-600">Rejected listings would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className={`${activeTab === "requests" ? getSlideDirection("requests") : "hidden"}`}>
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-green-800">Rental Requests</h1>
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="mb-6 bg-green-600 border border-green-600 rounded-md p-1">
                  <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Pending Approval</TabsTrigger>
                  <TabsTrigger value="multiple" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Multiple Requests</TabsTrigger>
                  <TabsTrigger value="approved" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Approved</TabsTrigger>
                  <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                  <RentalRequestsTable searchTerm={searchTerm} />
                </TabsContent>

                <TabsContent value="multiple">
                  <Card className="border border-green-200 bg-gradient-to-b from-white to-green-50">
                    <CardContent className="pt-6">
                      <p className="text-center text-green-600">Items with multiple rental requests would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="approved">
                  <Card className="border border-green-200 bg-gradient-to-b from-white to-green-50">
                    <CardContent className="pt-6">
                      <p className="text-center text-green-600">Approved rental requests would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="rejected">
                  <Card className="border border-green-200 bg-gradient-to-b from-white to-green-50">
                    <CardContent className="pt-6">
                      <p className="text-center text-green-600">Rejected rental requests would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className={`${activeTab === "active-rentals" ? getSlideDirection("active-rentals") : "hidden"}`}>
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-green-800">Active Rentals</h1>
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="mb-6 bg-green-600 border border-green-600 rounded-md p-1">
                  <TabsTrigger value="current" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Current Rentals</TabsTrigger>
                  <TabsTrigger value="ending-soon" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Ending Soon</TabsTrigger>
                  <TabsTrigger value="returns" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Pending Returns</TabsTrigger>
                </TabsList>

                <TabsContent value="current">
                  <ActiveRentalsTable searchTerm={searchTerm} />
                </TabsContent>

                <TabsContent value="ending-soon">
                  <Card className="border border-green-200 bg-gradient-to-b from-white to-green-50">
                    <CardContent className="pt-6">
                      <p className="text-center text-green-600">Rentals ending within 48 hours would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="returns">
                  <Card className="border border-green-200 bg-gradient-to-b from-white to-green-50">
                    <CardContent className="pt-6">
                      <p className="text-center text-green-600">Rentals awaiting return processing would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className={`${activeTab === "users" ? getSlideDirection("users") : "hidden"}`}>
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-green-800">User Management</h1>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6 bg-green-600 border border-green-600 rounded-md p-1">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">All Users</TabsTrigger>
                  <TabsTrigger value="lenders" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Lenders</TabsTrigger>
                  <TabsTrigger value="renters" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Renters</TabsTrigger>
                  <TabsTrigger value="verification" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Pending Verification</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <UserManagementTable searchTerm={searchTerm} />
                </TabsContent>

                <TabsContent value="lenders">
                  <Card className="border border-green-200 bg-gradient-to-b from-white to-green-50">
                    <CardContent className="pt-6">
                      <p className="text-center text-green-600">Users with listings would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="renters">
                  <Card className="border border-green-200 bg-gradient-to-b from-white to-green-50">
                    <CardContent className="pt-6">
                      <p className="text-center text-green-600">Users who have rented items would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="verification">
                  <Card className="border border-green-200 bg-gradient-to-b from-white to-green-50">
                    <CardContent className="pt-6">
                      <p className="text-center text-green-600">Users pending identity verification would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className={`${activeTab === "reports" ? getSlideDirection("reports") : "hidden"}`}>
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-green-800">Reports & Analytics</h1>
              <ReportsAndAnalytics />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

// Add this to your CSS or tailwind.config.js extend section
const styles = `
@keyframes slideRight {
  from {
    transform: translateX(-10%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideLeft {
  from {
    transform: translateX(10%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-right {
  animation: slideRight 0.3s ease-out forwards;
}

.animate-slide-left {
  animation: slideLeft 0.3s ease-out forwards;
}
`;