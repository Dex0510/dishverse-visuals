
import { useState } from "react";
import { Search, Plus, MoreHorizontal, UserCircle, Mail, Phone, Calendar, Tag, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock data for customers
const customers = [
  { 
    id: 1, 
    name: "John Smith", 
    email: "john.smith@example.com", 
    phone: "+1 (555) 123-4567", 
    visits: 8,
    lastVisit: "2023-06-12",
    totalSpent: 4500,
    favoriteItems: ["Beef Wellington", "Chocolate Lava Cake"],
    tags: ["regular", "high-value"],
    notes: "Prefers window seating, allergic to nuts"
  },
  { 
    id: 2, 
    name: "Emily Johnson", 
    email: "emily.johnson@example.com", 
    phone: "+1 (555) 987-6543", 
    visits: 5,
    lastVisit: "2023-06-08",
    totalSpent: 2800,
    favoriteItems: ["Seared Salmon", "Vegetable Soup"],
    tags: ["regular"],
    notes: "Vegetarian options preferred"
  },
  { 
    id: 3, 
    name: "Michael Brown", 
    email: "michael.brown@example.com", 
    phone: "+1 (555) 456-7890", 
    visits: 12,
    lastVisit: "2023-06-14",
    totalSpent: 7200,
    favoriteItems: ["Garlic Truffle Fries", "Caprese Salad"],
    tags: ["vip", "regular", "high-value"],
    notes: "Celebrates birthday in September, likes red wine"
  },
  { 
    id: 4, 
    name: "Sophia Davis", 
    email: "sophia.davis@example.com", 
    phone: "+1 (555) 234-5678", 
    visits: 2,
    lastVisit: "2023-05-30",
    totalSpent: 980,
    favoriteItems: ["Vegetable Soup"],
    tags: ["new"],
    notes: ""
  },
  { 
    id: 5, 
    name: "Robert Wilson", 
    email: "robert.wilson@example.com", 
    phone: "+1 (555) 345-6789", 
    visits: 7,
    lastVisit: "2023-06-10",
    totalSpent: 3500,
    favoriteItems: ["Beef Wellington", "Caprese Salad"],
    tags: ["regular"],
    notes: "Prefers booth seating"
  },
];

// Mock data for loyalty programs
const loyaltyPrograms = [
  { id: 1, name: "Silver Membership", minSpend: 0, discount: "5%", description: "Basic membership with 5% discount" },
  { id: 2, name: "Gold Membership", minSpend: 5000, discount: "10%", description: "Mid-tier membership with 10% discount and birthday rewards" },
  { id: 3, name: "Platinum Membership", minSpend: 10000, discount: "15%", description: "Premium membership with 15% discount, birthday rewards, and priority reservations" },
];

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  
  // Filter customers based on search query and active tag
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = activeTag === "all" || customer.tags.includes(activeTag);
    
    return matchesSearch && matchesTag;
  });
  
  // Get unique tags
  const uniqueTags = ["all"];
  customers.forEach(customer => {
    customer.tags.forEach(tag => {
      if (!uniqueTags.includes(tag)) {
        uniqueTags.push(tag);
      }
    });
  });
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`
      : parts[0].charAt(0);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">Manage customers and loyalty programs</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add Customer</DialogTitle>
                <DialogDescription>
                  Enter customer details to add them to your database.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer-name" className="text-right">
                    Name
                  </Label>
                  <Input id="customer-name" placeholder="Full name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" type="email" placeholder="Email address" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone" placeholder="Phone number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">
                    Tags
                  </Label>
                  <Input id="tags" placeholder="e.g. vip, regular (comma separated)" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Input id="notes" placeholder="Additional notes" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNewCustomerDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={() => setIsNewCustomerDialogOpen(false)}>
                  Add Customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Programs</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & Reviews</TabsTrigger>
        </TabsList>
        
        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search customers..." 
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {uniqueTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant={activeTag === tag ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Visits</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm flex flex-col">
                          <div className="flex items-center">
                            <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.visits}</TableCell>
                      <TableCell>₹{customer.totalSpent}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {customer.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="capitalize">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{customer.lastVisit}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                            <DropdownMenuItem>View Orders</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete Customer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Loyalty Programs Tab */}
        <TabsContent value="loyalty" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Loyalty Tiers</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Create Program
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            {loyaltyPrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{program.name}</CardTitle>
                    <Badge>{program.discount}</Badge>
                  </div>
                  <CardDescription>
                    Min. Spend: ₹{program.minSpend}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{program.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    View Members
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Special Offers</CardTitle>
              <CardDescription>Create targeted promotions for specific customer segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Birthday Reward</h3>
                      <p className="text-sm text-muted-foreground">Free dessert for customers on their birthday month</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
                
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Returning Customer Discount</h3>
                      <p className="text-sm text-muted-foreground">10% off for customers who haven't visited in 30+ days</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Create New Offer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback</CardTitle>
              <CardDescription>Recent reviews and customer feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>MS</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Michael Smith</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 fill-yellow-400" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">
                    "Amazing dining experience! The Beef Wellington was perfectly cooked, and the service was exceptional. Will definitely be returning soon!"
                  </p>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>June 10, 2023</span>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>EJ</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Emily Johnson</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <svg 
                          key={star}
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 fill-yellow-400" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 fill-gray-300" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm">
                    "Great food, but the wait time was a bit longer than expected. The Seared Salmon was delicious and well-presented."
                  </p>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>June 8, 2023</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" /> View All Reviews
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Customers;
