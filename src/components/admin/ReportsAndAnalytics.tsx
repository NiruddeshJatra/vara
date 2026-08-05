import {
  ArrowUpRight,
  ArrowDownRight,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Download,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

// This is a mock component that would ideally use a real charting library
// like recharts, chart.js, or visx
const ReportsAndAnalytics = () => {
  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Report Download Started",
      description: `Downloading ${reportType} report as PDF`,
      variant: "default",
    });
  };

  const handlePeriodChange = (period: string) => {
    toast({
      title: "Period Changed",
      description: `Showing data for ${period}`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-green-700">Reports & Analytics</h2>
          <p className="text-sm text-gray-500">View platform performance and generate reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="thisMonth">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="lastWeek">Last Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-green-800">Total Revenue</CardTitle>
            <CardDescription className="text-green-600">All time earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-r from-white to-green-50">
                  <DollarSign className="h-6 w-6 text-green-700" />
                </div>
                <span className="text-2xl font-medium text-green-700">৳125,430</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+12.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-green-800">New Users</CardTitle>
            <CardDescription className="text-green-600">This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-r from-white to-green-50">
                  <Users className="h-6 w-6 text-green-700" />
                </div>
                <span className="text-2xl font-medium text-green-700">128</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+23.7%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-green-800">Completed Rentals</CardTitle>
            <CardDescription className="text-green-600">This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-r from-white to-green-50">
                  <Package className="h-6 w-6 text-green-700" />
                </div>
                <span className="text-2xl font-medium text-green-700">436</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+8.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-green-800">Avg. Rental Value</CardTitle>
            <CardDescription className="text-green-600">Per transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-r from-white to-green-50">
                  <TrendingUp className="h-6 w-6 text-green-700" />
                </div>
                <span className="text-2xl font-medium text-green-700">৳2,850</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+4.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Period Selection */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-green-800">Detailed Reports</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
            onClick={() => handlePeriodChange("This Week")}
          >
            Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-green-300 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
            onClick={() => handlePeriodChange("This Month")}
          >
            Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
            onClick={() => handlePeriodChange("This Quarter")}
          >
            Quarter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
            onClick={() => handlePeriodChange("This Year")}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="mb-6 bg-green-600 border border-green-600 rounded-md p-1">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Revenue</TabsTrigger>
          <TabsTrigger value="listings" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Listings</TabsTrigger>
          <TabsTrigger value="rentals" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Rentals</TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-green-800 text-white">Users</TabsTrigger>
        </TabsList>
        
        {/* Revenue Report */}
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Revenue Trends</CardTitle>
                <CardDescription className="text-green-600">Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-80 w-full flex items-center justify-center">
                  <div className="flex flex-col items-center text-green-700">
                    <LineChartIcon className="h-16 w-16 mb-2" />
                    <p>Revenue chart would be displayed here</p>
                    <p className="text-sm text-green-600">Showing data for current month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Revenue Sources</CardTitle>
                <CardDescription className="text-green-600">By category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full flex items-center justify-center mb-4">
                  <PieChartIcon className="h-16 w-16 text-green-700" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
                      <span className="text-sm text-green-700">Electronics</span>
                    </div>
                    <span className="text-sm font-medium text-green-700">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                      <span className="text-sm text-green-700">Camera Equipment</span>
                    </div>
                    <span className="text-sm font-medium text-green-700">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-300 mr-2"></div>
                      <span className="text-sm text-green-700">Gaming</span>
                    </div>
                    <span className="text-sm font-medium text-green-700">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-200 mr-2"></div>
                      <span className="text-sm text-green-700">Others</span>
                    </div>
                    <span className="text-sm font-medium text-green-700">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Listings Report */}
        <TabsContent value="listings">
          <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-green-50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-green-800">Listings Performance</CardTitle>
                <CardDescription className="text-green-600">Top categories and conversion rates</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
                onClick={() => handleDownloadReport("Listings")}
              >
                Download Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full flex items-center justify-center">
                <div className="flex flex-col items-center text-green-700">
                  <BarChartIcon className="h-16 w-16 mb-2" />
                  <p>Listings performance chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Rentals Report */}
        <TabsContent value="rentals">
          <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-green-50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-green-800">Rental Activity</CardTitle>
                <CardDescription className="text-green-600">Frequency and duration analysis</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
                onClick={() => handleDownloadReport("Rentals")}
              >
                Download Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full flex items-center justify-center">
                <div className="flex flex-col items-center text-green-700">
                  <Calendar className="h-16 w-16 mb-2" />
                  <p>Rental activity calendar would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users Report */}
        <TabsContent value="users">
          <Card className="border border-green-200 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-green-50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-green-800">User Growth</CardTitle>
                <CardDescription className="text-green-600">Registration and activity trends</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
                onClick={() => handleDownloadReport("Users")}
              >
                Download Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full flex items-center justify-center">
                <div className="flex flex-col items-center text-green-700">
                  <LineChartIcon className="h-16 w-16 mb-2" />
                  <p>User growth chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Most popular item categories by rental count</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                { category: "Electronics", count: 87, percentage: 28 },
                { category: "Camera Equipment", count: 54, percentage: 17 },
                { category: "Computers", count: 43, percentage: 14 },
                { category: "Gaming", count: 36, percentage: 12 },
                { category: "Audio Equipment", count: 28, percentage: 9 }
              ].map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{item.category}</span>
                    <span className="text-gray-500 text-sm ml-2">({item.count} rentals)</span>
                  </div>
                  <div className="relative w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-green-500 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500 ml-auto">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rental Completion Rate</CardTitle>
            <CardDescription>Status breakdown of rental transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Completed</p>
                  <p className="text-sm text-gray-500">142 rentals</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">82%</p>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '82%' }}></div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="font-medium">In Progress</p>
                  <p className="text-sm text-gray-500">24 rentals</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">14%</p>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '14%' }}></div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Cancelled</p>
                  <p className="text-sm text-gray-500">7 rentals</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-orange-600">4%</p>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500 ml-auto">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ReportsAndAnalytics; 