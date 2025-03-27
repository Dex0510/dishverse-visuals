
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

interface MenuListProps {
  items: MenuItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

const MenuList: React.FC<MenuListProps> = ({
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
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="glass-card rounded-xl overflow-hidden hover-effect"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 relative">
              <DishVisualizer
                dishName={item.name}
                ingredients={item.ingredients}
                className="h-48 md:h-full w-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="p-4 md:w-3/4 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <span className="font-medium text-lg">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              <div className="mt-auto flex">
                <div className="flex-shrink-0">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.ingredients.slice(0, 5).map((ingredient, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {item.ingredients.length > 5 && (
                      <span className="inline-block px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground">
                        +{item.ingredients.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center ml-auto space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                  </Button>
                  
                  {isAdmin && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit && onEdit(item.id)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete && onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuList;
