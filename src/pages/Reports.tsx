
import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Download, 
  BarChart4, 
  PieChart, 
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

// Mock data for various reports
const salesData = [
  { date: "Mon", sales: 12000, orders: 42 },
  { date: "Tue", sales: 19000, orders: 65 },
  { date: "Wed", sales: 15000, orders: 53 },
  { date: "Thu", sales: 22000, orders: 78 },
  { date: "Fri", sales: 28000, orders: 91 },
  { date: "Sat", sales: 35000, orders: 115 },
  { date: "Sun", sales: 25000, orders: 86 }
];

const categoryData = [
  { name: "Main Course", sales: 45000, percentage: 45 },
  { name: "Appetizers", sales: 20000, percentage: 20 },
  { name: "Desserts", sales: 15000, percentage: 15 },
  { name: "Beverages", sales: 12000, percentage: 12 },
  { name: "Sides", sales: 8000, percentage: 8 }
];

const topSellingItems = [
  { name: "Beef Wellington", sales: 96, revenue: 9600 },
  { name: "Seared Salmon", sales: 85, revenue: 8500 },
  { name: "Chocolate Lava Cake", sales: 78, revenue: 7800 },
  { name: "Garlic Truffle Fries", sales: 65, revenue: 6500 },
  { name: "Vegetable Soup", sales: 52, revenue: 5200 }
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

const Reports = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<"day" | "week" | "month">("week");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track sales, performance, and trends</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal w-[240px]"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Total Sales"
          value="₹156,000"
          change="+12.5%"
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <SummaryCard 
          title="Orders"
          value="530"
          change="+8.2%"
          trend="up"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <SummaryCard 
          title="Customers"
          value="320"
          change="+5.1%"
          trend="up"
          icon={<Users className="h-5 w-5" />}
        />
        <SummaryCard 
          title="Average Order"
          value="₹294"
          change="-2.3%"
          trend="down"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>
      
      {/* Report Tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" /> Sales
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" /> Menu Items
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Trends
          </TabsTrigger>
        </TabsList>
        
        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sales Overview</h2>
            <div className="flex space-x-2">
              <Button 
                variant={dateRange === "day" ? "default" : "outline"} 
                size="sm"
                onClick={() => setDateRange("day")}
              >
                Day
              </Button>
              <Button 
                variant={dateRange === "week" ? "default" : "outline"} 
                size="sm"
                onClick={() => setDateRange("week")}
              >
                Week
              </Button>
              <Button 
                variant={dateRange === "month" ? "default" : "outline"} 
                size="sm"
                onClick={() => setDateRange("month")}
              >
                Month
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Sales & Orders</CardTitle>
              <CardDescription>
                {dateRange === "day" ? "Hourly" : dateRange === "week" ? "Daily" : "Weekly"} sales and order comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" name="Sales (₹)" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across menu categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="sales"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value}`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Items with the highest sales volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSellingItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10 text-primary mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.sales} orders</div>
                        </div>
                      </div>
                      <div className="font-medium">₹{item.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Menu Items Tab */}
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Performance</CardTitle>
              <CardDescription>Analysis of menu item popularity and profitability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Menu performance analytics will be available in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
              <CardDescription>Historical sales data and projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: "Jan", sales: 65000, projected: 60000 },
                      { month: "Feb", sales: 78000, projected: 72000 },
                      { month: "Mar", sales: 82000, projected: 85000 },
                      { month: "Apr", sales: 95000, projected: 92000 },
                      { month: "May", sales: 110000, projected: 105000 },
                      { month: "Jun", sales: 125000, projected: 120000 },
                      { month: "Jul", sales: 145000, projected: 140000 },
                      { month: "Aug", sales: 156000, projected: 160000 },
                      { month: "Sep", sales: null, projected: 175000 },
                      { month: "Oct", sales: null, projected: 190000 },
                      { month: "Nov", sales: null, projected: 210000 },
                      { month: "Dec", sales: null, projected: 240000 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      name="Actual Sales"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="projected"
                      name="Projected Sales"
                      stroke="#82ca9d"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

const SummaryCard = ({ title, value, change, trend, icon }: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn(
          "p-2 rounded-full",
          trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
          "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn(
          "text-xs flex items-center mt-1",
          trend === "up" ? "text-green-600 dark:text-green-400" :
          "text-red-600 dark:text-red-400"
        )}>
          {trend === "up" ? (
            <ArrowUpRight className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1" />
          )}
          {change} from last period
        </p>
      </CardContent>
    </Card>
  );
};

export default Reports;
