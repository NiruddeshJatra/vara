import {
  ArrowUpRight,
  ArrowDownRight,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// This is a mock component that would ideally use a real charting library
// like recharts, chart.js, or visx
const ReportsAndAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Reports & Analytics</h2>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">৳245,500</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">vs last month</span>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-0.5" />
                <span>12.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>New Users</CardDescription>
            <CardTitle className="text-2xl">34</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">vs last month</span>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-0.5" />
                <span>8.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Rentals</CardDescription>
            <CardTitle className="text-2xl">142</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">vs last month</span>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-0.5" />
                <span>5.7%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Rental Value</CardDescription>
            <CardTitle className="text-2xl">৳1,730</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">vs last month</span>
              <div className="flex items-center text-red-600 text-sm font-medium">
                <ArrowDownRight className="h-4 w-4 mr-0.5" />
                <span>2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="rentals">Rentals</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Line
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Bar
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Pie
            </Button>
          </div>
        </div>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                Total platform revenue including service fees and security deposits
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for chart - in a real app, we'd use a charting library */}
              <div className="h-80 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <LineChartIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Revenue chart would be displayed here</p>
                  <p className="text-xs text-gray-400 mt-1">Using a charting library like Recharts</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">Last updated: June 18, 2023</div>
              <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>Listings by Category</CardTitle>
              <CardDescription>
                Distribution of active listings across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <PieChartIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Listings chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">Last updated: June 18, 2023</div>
              <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="rentals">
          <Card>
            <CardHeader>
              <CardTitle>Rental Activity</CardTitle>
              <CardDescription>
                Number of rentals started and completed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <BarChartIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Rental activity chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">Last updated: June 18, 2023</div>
              <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                New user registrations and active users over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <LineChartIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">User growth chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">Last updated: June 18, 2023</div>
              <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </CardFooter>
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