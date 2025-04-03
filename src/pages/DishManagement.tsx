
import { useState, useEffect } from "react";
import { 
  PlusCircle, 
  Search, 
  Loader2, 
  Edit, 
  Trash2, 
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  getAllDishes, 
  createDish, 
  updateDish, 
  deleteDish,
  Dish
} from "@/services/dishService";
import DishForm from "@/components/DishForm";
import DishVisualizer from "@/components/DishVisualizer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { menuAPI } from "@/services/restaurantService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

const DishManagement = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [deletingDishId, setDeletingDishId] = useState<string | null>(null);
  
  // Load all dishes and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load dishes
        const fetchedDishes = await getAllDishes();
        setDishes(fetchedDishes);
        
        // Load categories
        try {
          const fetchedCategories = await menuAPI.getCategories();
          setCategories(fetchedCategories);
        } catch (err) {
          // If categories fail to load, extract them from dishes
          const uniqueCategories = Array.from(
            new Set(fetchedDishes.map(dish => dish.category))
          );
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Failed to load dishes:", err);
        setError("Failed to load dishes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter dishes based on search query
  const filteredDishes = dishes.filter(dish => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      dish.name.toLowerCase().includes(lowerQuery) ||
      dish.description.toLowerCase().includes(lowerQuery) ||
      dish.category.toLowerCase().includes(lowerQuery) ||
      dish.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery))
    );
  });
  
  const handleCreateDish = (dish: Omit<Dish, 'id'>) => {
    const addDish = async () => {
      try {
        const newDish = await createDish(dish);
        setDishes([...dishes, newDish]);
        setFormOpen(false);
        toast.success(`${newDish.name} has been added to the menu`);
      } catch (err) {
        console.error("Failed to create dish:", err);
        toast.error("Failed to create dish");
      }
    };
    
    addDish();
  };
  
  const handleUpdateDish = (dish: Omit<Dish, 'id'>) => {
    if (!editingDish) return;
    
    const updateDishItem = async () => {
      try {
        const updatedDish = await updateDish(editingDish.id, dish);
        setDishes(dishes.map(d => d.id === editingDish.id ? updatedDish : d));
        setFormOpen(false);
        setEditingDish(null);
        toast.success(`${updatedDish.name} has been updated`);
      } catch (err) {
        console.error("Failed to update dish:", err);
        toast.error("Failed to update dish");
      }
    };
    
    updateDishItem();
  };
  
  const handleDeleteConfirm = async () => {
    if (!deletingDishId) return;
    
    try {
      await deleteDish(deletingDishId);
      setDishes(dishes.filter(d => d.id !== deletingDishId));
      toast.success("Dish has been deleted");
    } catch (err) {
      console.error("Failed to delete dish:", err);
      toast.error("Failed to delete dish");
    } finally {
      setDeletingDishId(null);
    }
  };
  
  const openCreateForm = () => {
    setEditingDish(null);
    setFormOpen(true);
  };
  
  const openEditForm = (dish: Dish) => {
    setEditingDish(dish);
    setFormOpen(true);
  };
  
  const confirmDelete = (id: string) => {
    setDeletingDishId(id);
  };
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center text-center p-8">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dish Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, update and manage your menu items
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search dishes..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button onClick={openCreateForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Dish
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredDishes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => (
            <Card key={dish.id} className="overflow-hidden">
              <div className="aspect-square">
                <DishVisualizer
                  dishName={dish.name}
                  ingredients={dish.ingredients}
                  description={dish.description}
                  className="h-full w-full"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{dish.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {dish.ingredients.slice(0, 3).join(", ")}
                      {dish.ingredients.length > 3 && "..."}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{dish.category}</p>
                  </div>
                  <span className="font-bold">₹{dish.price.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openEditForm(dish)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => confirmDelete(dish.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "No dishes match your search" : "No dishes in your menu yet"}
          </p>
          <Button onClick={openCreateForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Dish
          </Button>
        </div>
      )}
      
      {/* Dish Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDish ? `Edit ${editingDish.name}` : "Create New Dish"}
            </DialogTitle>
          </DialogHeader>
          <DishForm
            onSubmit={editingDish ? handleUpdateDish : handleCreateDish}
            initialData={editingDish || undefined}
            categories={categories}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deletingDishId} 
        onOpenChange={(open) => !open && setDeletingDishId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this dish
              from your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DishManagement;
