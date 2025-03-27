
import { Edit2, Trash2 } from "lucide-react";
import DishVisualizer from "./DishVisualizer";

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const MenuCard = ({ 
  id, 
  name, 
  description, 
  price, 
  category, 
  ingredients,
  onEdit,
  onDelete
}: MenuItemProps) => {
  return (
    <div className="glass-card rounded-xl overflow-hidden shadow-md hover-effect">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DishVisualizer 
          dishName={name} 
          ingredients={ingredients} 
          className="h-full w-full md:rounded-r-none" 
        />
        <div className="flex flex-col p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-2">
                {category}
              </span>
              <h3 className="text-xl font-semibold">{name}</h3>
            </div>
            <span className="font-medium text-lg">${price.toFixed(2)}</span>
          </div>
          
          <p className="mt-3 text-muted-foreground line-clamp-3">{description}</p>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
            <div className="flex flex-wrap gap-1.5">
              {ingredients.map((ingredient, index) => (
                <span 
                  key={index} 
                  className="inline-block px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-2 mt-auto pt-4">
            <button 
              onClick={() => onEdit(id)} 
              className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label="Edit item"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => onDelete(id)} 
              className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Delete item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
