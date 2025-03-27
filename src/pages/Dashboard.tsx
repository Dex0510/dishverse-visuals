
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Clock, 
  AlertCircle,
  BarChart,
  Calendar,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">{currentDate}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Today's Sales"
          value="₹24,345"
          description="+12.5% from yesterday"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="up"
        />
        <DashboardCard 
          title="Active Orders"
          value="17"
          description="5 need attention"
          icon={<ShoppingCart className="h-5 w-5" />}
          trend="neutral"
          alert={true}
        />
        <DashboardCard 
          title="Total Customers"
          value="145"
          description="+22 new today"
          icon={<Users className="h-5 w-5" />}
          trend="up"
        />
        <DashboardCard 
          title="Avg. Prep Time"
          value="24 min"
          description="-2 min from average"
          icon={<Clock className="h-5 w-5" />}
          trend="down"
        />
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <QuickActionCard 
          title="POS Terminal"
          description="Process orders and payments"
          icon={<ShoppingCart className="h-6 w-6 text-primary" />}
          link="/pos"
        />
        <QuickActionCard 
          title="Reservations"
          description="Manage today's bookings"
          icon={<Calendar className="h-6 w-6 text-primary" />}
          link="/tables"
        />
        <QuickActionCard 
          title="Sales Report"
          description="View today's performance"
          icon={<BarChart className="h-6 w-6 text-primary" />}
          link="/reports"
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Process incoming orders and view status</CardDescription>
          </div>
          <Link to="/pos">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <OrderItem 
              id="ORD-7289"
              customer="John Doe"
              time="10 min ago"
              price="₹485"
              status="preparing"
            />
            <OrderItem 
              id="ORD-7288"
              customer="Lisa Wong"
              time="25 min ago"
              price="₹950"
              status="ready"
            />
            <OrderItem 
              id="ORD-7287"
              customer="Michael Chen"
              time="45 min ago"
              price="₹1,240"
              status="delivered"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Link to="/pos" className="text-sm text-primary flex items-center hover:underline">
            View all orders
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </CardFooter>
      </Card>
      
      {/* Inventory Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Alerts</CardTitle>
          <CardDescription>Items that need restocking soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <InventoryAlert 
              item="Chicken Breast"
              currentStock="2.5 kg"
              threshold="5 kg"
              severity="high"
            />
            <InventoryAlert 
              item="Tomatoes"
              currentStock="8 kg"
              threshold="10 kg"
              severity="medium"
            />
            <InventoryAlert 
              item="Olive Oil"
              currentStock="3 bottles"
              threshold="5 bottles"
              severity="medium"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Link to="/inventory" className="text-sm text-primary flex items-center hover:underline">
            View inventory management
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  alert?: boolean;
}

const DashboardCard = ({ title, value, description, icon, trend, alert }: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn(
          "p-2 rounded-full",
          trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
          trend === "down" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="text-2xl font-bold">{value}</div>
          {alert && (
            <span className="ml-2 rounded-full bg-red-100 p-1 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </span>
          )}
        </div>
        <p className={cn(
          "text-xs mt-1",
          trend === "up" ? "text-green-600 dark:text-green-400" :
          trend === "down" ? "text-blue-600 dark:text-blue-400" :
          "text-muted-foreground"
        )}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const QuickActionCard = ({ title, description, icon, link }: QuickActionCardProps) => {
  return (
    <Link to={link}>
      <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="mr-4">
              {icon}
            </div>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

interface OrderItemProps {
  id: string;
  customer: string;
  time: string;
  price: string;
  status: "preparing" | "ready" | "delivered";
}

const OrderItem = ({ id, customer, time, price, status }: OrderItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">{id}</div>
        <div className="text-sm text-muted-foreground">{customer}</div>
      </div>
      <div className="text-sm text-muted-foreground">{time}</div>
      <div className="font-medium">{price}</div>
      <div>
        <span className={cn(
          "rounded-full px-2 py-1 text-xs font-medium",
          status === "preparing" ? "bg-yellow-100 text-yellow-800" : 
          status === "ready" ? "bg-green-100 text-green-800" :
          "bg-blue-100 text-blue-800"
        )}>
          {status}
        </span>
      </div>
    </div>
  );
};

interface InventoryAlertProps {
  item: string;
  currentStock: string;
  threshold: string;
  severity: "high" | "medium" | "low";
}

const InventoryAlert = ({ item, currentStock, threshold, severity }: InventoryAlertProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">{item}</div>
        <div className="text-sm text-muted-foreground">
          {currentStock} / {threshold}
        </div>
      </div>
      <div>
        <span className={cn(
          "rounded-full px-2 py-1 text-xs font-medium",
          severity === "high" ? "bg-red-100 text-red-800" : 
          severity === "medium" ? "bg-yellow-100 text-yellow-800" :
          "bg-green-100 text-green-800"
        )}>
          {severity === "high" ? "Critical" : severity === "medium" ? "Warning" : "Low"}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
