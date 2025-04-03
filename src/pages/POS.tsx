
import { useState } from "react";
import { 
  Search, 
  Coffee, 
  Pizza, 
  Soup, 
  Cake, 
  Beef, 
  Salad, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart as ShoppingCartIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DishVisualizer from "@/components/DishVisualizer";
import TableSelector from "@/components/TableSelector";
import { toast } from "sonner";

// Mock data for menu items
const menuItems = [
  {
    id: "1",
    name: "Seared Salmon",
    description: "Fresh Atlantic salmon with lemon-herb butter, roasted asparagus, and wild rice pilaf.",
    price: 22.99,
    category: "Main Course",
    ingredients: ["Salmon", "Lemon", "Herbs", "Asparagus", "Wild Rice"]
  },
  {
    id: "2",
    name: "Chocolate Lava Cake",
    description: "Decadent chocolate cake with a molten center, served with vanilla ice cream and fresh berries.",
    price: 8.99,
    category: "Dessert",
    ingredients: ["Chocolate", "Flour", "Sugar", "Eggs", "Vanilla Ice Cream", "Berries"]
  },
  {
    id: "3",
    name: "Garlic Truffle Fries",
    description: "Crispy golden fries tossed with garlic, truffle oil, and Parmesan cheese, served with aioli dipping sauce.",
    price: 6.99,
    category: "Appetizer",
    ingredients: ["Potatoes", "Garlic", "Truffle Oil", "Parmesan", "Aioli"]
  },
  {
    id: "4",
    name: "Caprese Salad",
    description: "Fresh tomatoes, mozzarella, and basil drizzled with balsamic reduction and olive oil.",
    price: 9.99,
    category: "Appetizer",
    ingredients: ["Tomatoes", "Mozzarella", "Basil", "Balsamic", "Olive Oil"]
  },
  {
    id: "5",
    name: "Vegetable Soup",
    description: "Hearty vegetable soup with seasonal vegetables and herbs.",
    price: 5.99,
    category: "Soup",
    ingredients: ["Carrots", "Celery", "Onion", "Potato", "Herbs"]
  },
  {
    id: "6",
    name: "Beef Wellington",
    description: "Tender filet mignon wrapped in puff pastry with mushroom duxelles.",
    price: 32.99,
    category: "Main Course",
    ingredients: ["Beef", "Pastry", "Mushrooms", "Thyme", "Mustard"]
  }
];

// Categories for filtering
const categories = [
  { id: "all", name: "All", icon: Coffee },
  { id: "Main Course", name: "Mains", icon: Beef },
  { id: "Appetizer", name: "Appetizers", icon: Pizza },
  { id: "Soup", name: "Soups", icon: Soup },
  { id: "Dessert", name: "Desserts", icon: Cake },
  { id: "Salad", name: "Salads", icon: Salad }
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const POS = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTable, setActiveTable] = useState("Select Table");
  
  // Filter menu items based on category and search query
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Add item to cart
  const addToCart = (item: typeof menuItems[0]) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      setCart([...cart, { 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: 1 
      }]);
    }
  };
  
  // Update cart item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };
  
  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };
  
  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Handle payment process
  const handlePayment = () => {
    if (activeTable === "Select Table") {
      toast.error("Please select a table first");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty. Add items before proceeding to payment");
      return;
    }

    toast.success("Order placed successfully!");
    setCart([]);
    setActiveTable("Select Table");
  };

  // Handle save order
  const handleSaveOrder = () => {
    if (activeTable === "Select Table") {
      toast.error("Please select a table first");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty. Add items before saving");
      return;
    }

    toast.success("Order saved successfully!");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Menu Section */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Point of Sale</h1>
            <p className="text-muted-foreground">Create and manage orders</p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search menu..." 
                className="pl-9 w-full sm:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex-shrink-0">
              <TableSelector 
                selectedTable={activeTable} 
                onSelectTable={setActiveTable} 
              />
            </div>
          </div>
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto gap-2">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex flex-col h-16 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <category.icon className="h-5 w-5 mb-1" />
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square">
                <DishVisualizer 
                  dishName={item.name} 
                  ingredients={item.ingredients} 
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                  </div>
                  <span className="font-bold">₹{item.price.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={() => addToCart(item)}
                >
                  Add to Order
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Order Section */}
      <div className="w-full sm:w-96 flex-shrink-0 border-l bg-card overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Current Order</h2>
          <p className="text-sm text-muted-foreground">{activeTable} • Order #{Math.floor(Math.random() * 10000)}</p>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <ShoppingCartIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="font-medium mb-1">No items in order</h3>
              <p className="text-sm text-muted-foreground">Select menu items to add to the current order.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 text-sm w-6 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-2 text-muted-foreground"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="border-t p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (10%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" onClick={handleSaveOrder}>Save Order</Button>
            <Button onClick={handlePayment}>Payment</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
