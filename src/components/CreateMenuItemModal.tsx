
import { useState, useEffect } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DishVisualizer from "./DishVisualizer";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
}

interface CreateMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (menuItem: MenuItem) => void;
  editingItem?: MenuItem | null;
}

const categoryOptions = [
  "Appetizer",
  "Main Course",
  "Dessert",
  "Beverage",
  "Side",
  "Special"
];

const CreateMenuItemModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingItem 
}: CreateMenuItemModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [newIngredient, setNewIngredient] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description);
      setPrice(editingItem.price.toString());
      setCategory(editingItem.category);
      setIngredients(editingItem.ingredients);
    } else {
      resetForm();
    }
  }, [editingItem, isOpen]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory(categoryOptions[0]);
    setIngredients([]);
    setNewIngredient("");
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== "" && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !price || ingredients.length === 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with security best practices
    setTimeout(() => {
      const menuItem: MenuItem = {
        id: editingItem?.id || crypto.randomUUID(),
        name,
        description,
        price: parseFloat(price),
        category,
        ingredients
      };
      
      onSave(menuItem);
      setIsSubmitting(false);
      onClose();
      resetForm();
    }, 1000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl w-full mx-auto rounded-xl overflow-hidden border-none p-0">
        <div className="flex justify-between items-center border-b p-4">
          <DialogTitle className="text-lg font-semibold">
            {editingItem ? "Edit Menu Item" : "Create New Menu Item"}
          </DialogTitle>
          <button
            onClick={handleClose}
            className="rounded-full p-1 hover:bg-secondary transition-colors"
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-5 gap-6 p-6">
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Dish Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter dish name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the dish"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Price ($)
                  </label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="ingredients" className="text-sm font-medium">
                  Ingredients
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="ingredients"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Add an ingredient"
                  />
                  <Button
                    type="button"
                    onClick={handleAddIngredient}
                    variant="secondary"
                    size="icon"
                  >
                    <Plus size={18} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center space-x-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                    >
                      <span>{ingredient}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-secondary-foreground/70 hover:text-secondary-foreground"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                {ingredients.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Please add at least one ingredient
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !name || !description || !price || ingredients.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>{editingItem ? "Update" : "Create"} Menu Item</>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Dish Preview</h3>
              <DishVisualizer
                dishName={name || "New Dish"}
                ingredients={ingredients}
                className="w-full aspect-square"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMenuItemModal;
