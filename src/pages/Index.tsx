
import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Share2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import CreateMenuItemModal from "@/components/CreateMenuItemModal";
import { toast } from "sonner";
import ViewToggle from "@/components/ViewToggle";
import CategoryFilter from "@/components/CategoryFilter";
import MenuGrid from "@/components/MenuGrid";
import MenuList from "@/components/MenuList";
import CartDrawer from "@/components/CartDrawer";
import CartButton from "@/components/CartButton";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
}

// Sample data
const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Seared Salmon",
    description: "Fresh Atlantic salmon seared to perfection, served with lemon-herb butter, roasted asparagus, and wild rice pilaf.",
    price: 22.99,
    category: "Main Course",
    ingredients: ["Salmon", "Lemon", "Herbs", "Asparagus", "Wild Rice"]
  },
  {
    id: "2",
    name: "Chocolate Lava Cake",
    description: "Decadent chocolate cake with a molten center, served with vanilla bean ice cream and fresh berries.",
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
  }
];

// Extract unique categories
const allCategories = [...new Set(initialMenuItems.map(item => item.category))];

const Index = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  
  const handleCreateItem = () => {
    setEditingItem(null);
    setShowCreateModal(true);
  };

  const handleEditItem = (id: string) => {
    const itemToEdit = menuItems.find(item => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setShowCreateModal(true);
    }
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast.success("Menu item deleted successfully");
  };

  const handleSaveItem = (item: MenuItem) => {
    if (editingItem) {
      setMenuItems(menuItems.map(menuItem => 
        menuItem.id === item.id ? item : menuItem
      ));
      toast.success("Menu item updated successfully");
    } else {
      setMenuItems([...menuItems, item]);
      toast.success("Menu item created successfully");
    }
    setShowCreateModal(false);
  };

  // Filter menu items based on search query and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navbar />
      
      {/* Cart Button (fixed position) */}
      <div className="fixed right-6 bottom-6 z-40">
        <CartButton onClick={() => setShowCartDrawer(true)} />
      </div>
      
      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={showCartDrawer} 
        onClose={() => setShowCartDrawer(false)} 
      />
      
      <main className="container mx-auto px-6 pt-28 pb-20">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-20 max-w-4xl mx-auto">
          <span className="inline-block text-sm font-medium text-primary">RESTAURANT MENU MANAGEMENT</span>
          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Visualize Your Menu with <span className="text-primary">AI-Powered 3D</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Showcase your restaurant's dishes with stunning 3D visualizations. 
            Enhance your menu with detailed dish descriptions and AI-generated images.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleCreateItem}
              className="btn-primary inline-flex items-center"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Dish
            </button>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              View Full Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
        
        {/* Search, Category Filter, and View Toggle */}
        <section className="mb-8 space-y-6">
          {/* Search Input */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dishes, ingredients, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 py-2 pr-4 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>
          
          {/* Category and View Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <CategoryFilter 
              categories={allCategories} 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            <ViewToggle 
              currentView={viewType} 
              onViewChange={setViewType} 
            />
          </div>
        </section>
        
        {/* Menu Items */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Menu Items</h2>
            <button 
              onClick={handleCreateItem}
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Add Item
            </button>
          </div>
          
          {filteredMenuItems.length > 0 ? (
            viewType === "grid" ? (
              <MenuGrid 
                items={filteredMenuItems}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                isAdmin={true}
              />
            ) : (
              <MenuList 
                items={filteredMenuItems}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                isAdmin={true}
              />
            )
          ) : (
            <div className="text-center py-16 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No menu items found</p>
              <button
                onClick={handleCreateItem}
                className="btn-primary inline-flex items-center"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create First Item
              </button>
            </div>
          )}
        </section>
        
        {/* Features Section */}
        <section className="py-16 mt-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Powerful Features for Restaurants</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Elevate your menu presentation with these exclusive tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cube"><path d="m21 16-9 5-9-5V8l9-5 9 5v8z"/><path d="m21 8-9 5-9-5"/></svg>
              </div>
              <h3 className="text-lg font-semibold">3D Dish Visualization</h3>
              <p className="mt-2 text-muted-foreground">
                Generate realistic 3D images of your dishes based on descriptions and ingredients
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              </div>
              <h3 className="text-lg font-semibold">AI Ingredient Suggestions</h3>
              <p className="mt-2 text-muted-foreground">
                Receive smart ingredient recommendations to enhance your dishes
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Share2 size={24} />
              </div>
              <h3 className="text-lg font-semibold">Digital Menu Sharing</h3>
              <p className="mt-2 text-muted-foreground">
                Share your interactive menu with customers through QR codes and links
              </p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2023 DishVerse. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* Create/Edit Menu Item Modal */}
      <CreateMenuItemModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />
    </div>
  );
};

export default Index;
