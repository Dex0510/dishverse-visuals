
import { useState } from "react";
import { Search, Filter, ArrowUpDown, MoreHorizontal, Plus, AlertTriangle, XCircle, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
import { cn } from "@/lib/utils";

// Mock data for inventory items
const inventoryItems = [
  { 
    id: 1, 
    name: "Chicken Breast", 
    category: "Meat", 
    unit: "kg", 
    current: 2.5, 
    minimum: 5,
    supplier: "Farm Fresh Foods",
    price: 220.00,
    lastUpdated: "2023-06-12"
  },
  { 
    id: 2, 
    name: "Tomatoes", 
    category: "Vegetables", 
    unit: "kg", 
    current: 8, 
    minimum: 10,
    supplier: "Green Valley Produce",
    price: 80.00,
    lastUpdated: "2023-06-14"
  },
  { 
    id: 3, 
    name: "Basmati Rice", 
    category: "Grains", 
    unit: "kg", 
    current: 15, 
    minimum: 10,
    supplier: "Global Grains Inc.",
    price: 125.00,
    lastUpdated: "2023-06-10"
  },
  { 
    id: 4, 
    name: "Olive Oil", 
    category: "Oils", 
    unit: "bottle", 
    current: 3, 
    minimum: 5,
    supplier: "Mediterranean Imports",
    price: 450.00,
    lastUpdated: "2023-06-08"
  },
  { 
    id: 5, 
    name: "Salmon Fillet", 
    category: "Seafood", 
    unit: "kg", 
    current: 4, 
    minimum: 3,
    supplier: "Ocean Harvest",
    price: 800.00,
    lastUpdated: "2023-06-14"
  },
  { 
    id: 6, 
    name: "Black Pepper", 
    category: "Spices", 
    unit: "kg", 
    current: 0.5, 
    minimum: 1,
    supplier: "Spice Traders",
    price: 600.00,
    lastUpdated: "2023-06-01"
  },
  { 
    id: 7, 
    name: "Flour", 
    category: "Baking", 
    unit: "kg", 
    current: 12, 
    minimum: 8,
    supplier: "Baker's Supply Co.",
    price: 45.00,
    lastUpdated: "2023-06-07"
  },
  { 
    id: 8, 
    name: "Eggs", 
    category: "Dairy", 
    unit: "dozen", 
    current: 6, 
    minimum: 10,
    supplier: "Farm Fresh Foods",
    price: 90.00,
    lastUpdated: "2023-06-13"
  },
];

// Mock data for suppliers
const suppliers = [
  { id: 1, name: "Farm Fresh Foods", contact: "John Davis", phone: "+1 (555) 123-4567", email: "john@farmfresh.com" },
  { id: 2, name: "Green Valley Produce", contact: "Sarah Wilson", phone: "+1 (555) 234-5678", email: "sarah@greenvalley.com" },
  { id: 3, name: "Global Grains Inc.", contact: "Michael Lee", phone: "+1 (555) 345-6789", email: "michael@globalgrains.com" },
  { id: 4, name: "Mediterranean Imports", contact: "Elena Costa", phone: "+1 (555) 456-7890", email: "elena@meditimports.com" },
  { id: 5, name: "Ocean Harvest", contact: "David Kim", phone: "+1 (555) 567-8901", email: "david@oceanharvest.com" },
  { id: 6, name: "Spice Traders", contact: "Raj Patel", phone: "+1 (555) 678-9012", email: "raj@spicetraders.com" },
  { id: 7, name: "Baker's Supply Co.", contact: "Amanda Brown", phone: "+1 (555) 789-0123", email: "amanda@bakerssupply.com" },
];

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [isNewSupplierDialogOpen, setIsNewSupplierDialogOpen] = useState(false);
  
  // Filter inventory items based on search query and category
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || item.category === category;
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = ["all", ...new Set(inventoryItems.map(item => item.category))];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Track stock levels and manage suppliers</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Inventory Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
                <DialogDescription>
                  Enter details to add a new item to your inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item-name" className="text-right">
                    Name
                  </Label>
                  <Input id="item-name" placeholder="Item name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <select
                    id="category"
                    className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {categories.filter(c => c !== "all").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="new">+ Add New Category</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">
                    Supplier
                  </Label>
                  <select
                    id="supplier"
                    className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right">
                    Unit
                  </Label>
                  <Input id="unit" placeholder="e.g. kg, liter, dozen" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="current" className="text-right">
                    Current Stock
                  </Label>
                  <Input id="current" type="number" min="0" step="0.1" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minimum" className="text-right">
                    Min. Level
                  </Label>
                  <Input id="minimum" type="number" min="0" step="0.1" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price per Unit
                  </Label>
                  <Input id="price" type="number" min="0" step="0.01" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNewItemDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={() => setIsNewItemDialogOpen(false)}>
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
        </TabsList>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search inventory..." 
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCategory("all")}>
                    All Categories
                  </DropdownMenuItem>
                  {categories.filter(c => c !== "all").map(cat => (
                    <DropdownMenuItem key={cat} onClick={() => setCategory(cat)}>
                      {cat}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="h-4 w-4 mr-2" /> Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                  <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                  <DropdownMenuItem>Stock (Low to High)</DropdownMenuItem>
                  <DropdownMenuItem>Stock (High to Low)</DropdownMenuItem>
                  <DropdownMenuItem>Last Updated</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Price per Unit</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">
                            {item.current} {item.unit}
                          </div>
                          {item.current < item.minimum && (
                            <div className="text-red-500" title="Below minimum level">
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Min: {item.minimum} {item.unit}
                        </div>
                      </TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>₹{item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Update Stock</DropdownMenuItem>
                            <DropdownMenuItem>Edit Item</DropdownMenuItem>
                            <DropdownMenuItem>Create Purchase Order</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete Item
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
        
        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search suppliers..." 
                className="pl-9 w-full"
              />
            </div>
            
            <Dialog open={isNewSupplierDialogOpen} onOpenChange={setIsNewSupplierDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add Supplier</DialogTitle>
                  <DialogDescription>
                    Enter details to add a new supplier to your inventory system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="supplier-name" className="text-right">
                      Name
                    </Label>
                    <Input id="supplier-name" placeholder="Supplier name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact-person" className="text-right">
                      Contact Person
                    </Label>
                    <Input id="contact-person" placeholder="Contact name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input id="phone" placeholder="Phone number" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" placeholder="Email address" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input id="address" placeholder="Business address" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Input id="notes" placeholder="Additional notes" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsNewSupplierDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={() => setIsNewSupplierDialogOpen(false)}>
                    Add Supplier
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{supplier.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Create Purchase Order
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>Contact: {supplier.contact}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-1 text-sm">
                    <div>{supplier.phone}</div>
                    <div>{supplier.email}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Items</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Purchase Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>Track and manage purchase orders with suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center p-8">
                <div className="rounded-full bg-secondary w-16 h-16 flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No Purchase Orders</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a purchase order to restock your inventory.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Purchase Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
