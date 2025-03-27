
import { useState, useEffect } from "react";
import { Clock, Check, AlertTriangle, Info, ChevronDown, Timer, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Mock active orders data
const initialOrders = [
  {
    id: "ORD-7289",
    table: "Table 4",
    customer: "John Doe",
    items: [
      { id: 1, name: "Seared Salmon", quantity: 1, special: "No lemon", status: "preparing" },
      { id: 2, name: "Garlic Truffle Fries", quantity: 1, special: "", status: "preparing" }
    ],
    status: "preparing",
    timeElapsed: 8 * 60, // seconds
    priority: "normal",
    timeCreated: "14:30"
  },
  {
    id: "ORD-7288",
    table: "Table 2",
    customer: "Lisa Wong",
    items: [
      { id: 3, name: "Beef Wellington", quantity: 2, special: "Medium rare", status: "preparing" },
      { id: 4, name: "Caprese Salad", quantity: 1, special: "Extra balsamic", status: "ready" }
    ],
    status: "preparing",
    timeElapsed: 15 * 60, // seconds
    priority: "high",
    timeCreated: "14:15"
  },
  {
    id: "ORD-7287",
    table: "Takeaway",
    customer: "Michael Chen",
    items: [
      { id: 5, name: "Vegetable Soup", quantity: 1, special: "", status: "ready" },
      { id: 6, name: "Chocolate Lava Cake", quantity: 2, special: "", status: "ready" }
    ],
    status: "ready",
    timeElapsed: 22 * 60, // seconds
    priority: "normal",
    timeCreated: "14:02"
  },
  {
    id: "ORD-7286",
    table: "Table 7",
    customer: "Sophia Davis",
    items: [
      { id: 7, name: "Garlic Truffle Fries", quantity: 1, special: "", status: "preparing" },
      { id: 8, name: "Beef Wellington", quantity: 1, special: "Well done", status: "preparing" },
      { id: 9, name: "Chocolate Lava Cake", quantity: 1, special: "Extra berries", status: "waiting" }
    ],
    status: "preparing",
    timeElapsed: 10 * 60, // seconds
    priority: "normal",
    timeCreated: "14:25"
  }
];

const KitchenDisplay = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Update time elapsed every second
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(orders.map(order => ({
        ...order,
        timeElapsed: order.timeElapsed + 1
      })));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [orders]);
  
  // Filter orders based on active filter
  const filteredOrders = activeFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === activeFilter);
  
  // Format time elapsed
  const formatTimeElapsed = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Update item status
  const updateItemStatus = (orderId: string, itemId: number, newStatus: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => 
          item.id === itemId ? { ...item, status: newStatus } : item
        );
        
        // If all items are ready, mark order as ready
        const allReady = updatedItems.every(item => item.status === "ready");
        
        return {
          ...order,
          items: updatedItems,
          status: allReady ? "ready" : "preparing"
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
  };
  
  // Complete order
  const completeOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kitchen Display</h1>
          <p className="text-muted-foreground">Manage and track incoming orders</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex gap-1">
            <Bell className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Notify Staff</span>
          </Button>
          <Button variant="outline" size="sm" className="flex gap-1">
            <Info className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Kitchen Status</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all" className="relative">
            All Orders
            <Badge variant="secondary" className="ml-1">{orders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="waiting" className="relative">
            Waiting
            <Badge variant="secondary" className="ml-1">
              {orders.filter(o => o.items.some(i => i.status === "waiting")).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="preparing" className="relative">
            Preparing
            <Badge variant="secondary" className="ml-1">
              {orders.filter(o => o.status === "preparing").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ready" className="relative">
            Ready
            <Badge variant="secondary" className="ml-1">
              {orders.filter(o => o.status === "ready").length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeFilter} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className={cn(
                    "border-l-4",
                    order.priority === "high" ? "border-l-red-500" : 
                    order.status === "ready" ? "border-l-green-500" : 
                    "border-l-yellow-500"
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {order.id}
                          {order.priority === "high" && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          {order.table} • {order.customer}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm font-medium">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {formatTimeElapsed(order.timeElapsed)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created at {order.timeCreated}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div 
                          key={item.id}
                          className={cn(
                            "p-3 rounded-lg",
                            item.status === "waiting" ? "bg-gray-100 dark:bg-gray-800" :
                            item.status === "preparing" ? "bg-yellow-50 dark:bg-yellow-950/20" :
                            "bg-green-50 dark:bg-green-950/20"
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <div className="font-medium">
                              {item.quantity}x {item.name}
                            </div>
                            <div>
                              <Badge variant={
                                item.status === "waiting" ? "outline" :
                                item.status === "preparing" ? "secondary" :
                                "default"
                              }>
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                          {item.special && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Note: {item.special}
                            </div>
                          )}
                          {item.status !== "ready" && (
                            <div className="flex space-x-2 mt-2">
                              {item.status === "waiting" && (
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => updateItemStatus(order.id, item.id, "preparing")}
                                >
                                  Start Preparing
                                </Button>
                              )}
                              {item.status === "preparing" && (
                                <Button 
                                  size="sm"
                                  className="w-full"
                                  onClick={() => updateItemStatus(order.id, item.id, "ready")}
                                >
                                  <Check className="h-4 w-4 mr-1" /> Mark Ready
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    {order.status === "ready" ? (
                      <Button 
                        className="w-full" 
                        onClick={() => completeOrder(order.id)}
                      >
                        Complete Order
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          order.items.forEach(item => {
                            if (item.status !== "ready") {
                              updateItemStatus(order.id, item.id, "ready");
                            }
                          });
                        }}
                      >
                        Mark All Ready
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-center p-12">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 w-16 h-16 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-medium text-xl mb-1">All caught up!</h3>
                <p className="text-muted-foreground mb-4">
                  No {activeFilter === "all" ? "" : activeFilter} orders to display at the moment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KitchenDisplay;
