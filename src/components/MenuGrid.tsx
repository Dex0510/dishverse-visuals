
import React from "react";
import { ShoppingCart, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DishVisualizer from "./DishVisualizer";
import { useCart } from "@/contexts/CartContext";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
}

interface MenuGridProps {
  items: MenuItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const { addItem } = useCart();

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="glass-card rounded-xl overflow-hidden hover-effect flex flex-col"
        >
          <div className="relative aspect-square">
            <DishVisualizer
              dishName={item.name}
              ingredients={item.ingredients}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                {item.category}
              </span>
            </div>
          </div>
          <div className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <span className="font-medium">${item.price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
              {item.description}
            </p>
            <div className="flex justify-between items-center mt-auto">
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => handleAddToCart(item)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
              
              {isAdmin && (
                <div className="flex space-x-2 ml-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit && onEdit(item.id)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete && onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
