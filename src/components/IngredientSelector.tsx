
import React, { useState, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllIngredients, getSuggestedIngredients } from "@/services/dishService";
import { toast } from "sonner";

interface IngredientSelectorProps {
  selectedIngredients: string[];
  onChange: (ingredients: string[]) => void;
  dishName?: string;
}

const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  selectedIngredients,
  onChange,
  dishName = ""
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);
  
  // Load all available ingredients on component mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setIsLoadingIngredients(true);
        const ingredients = await getAllIngredients();
        const ingredientNames = ingredients.map(ing => ing.name);
        setAvailableIngredients(ingredientNames);
        filterIngredients(ingredientNames, searchQuery);
      } catch (error) {
        console.error("Failed to load ingredients:", error);
        toast.error("Failed to load ingredients");
      } finally {
        setIsLoadingIngredients(false);
      }
    };
    
    loadIngredients();
  }, []);
  
  // Filter ingredients based on search query
  useEffect(() => {
    filterIngredients(availableIngredients, searchQuery);
  }, [searchQuery, availableIngredients]);
  
  const filterIngredients = (ingredients: string[], query: string) => {
    if (!query.trim()) {
      setFilteredIngredients(
        ingredients.filter(ing => !selectedIngredients.includes(ing))
      );
    } else {
      setFilteredIngredients(
        ingredients.filter(
          ing => 
            ing.toLowerCase().includes(query.toLowerCase()) && 
            !selectedIngredients.includes(ing)
        )
      );
    }
  };
  
  const handleAddIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      const newIngredients = [...selectedIngredients, ingredient];
      onChange(newIngredients);
      setSearchQuery("");
    }
  };
  
  const handleRemoveIngredient = (ingredient: string) => {
    const newIngredients = selectedIngredients.filter(ing => ing !== ingredient);
    onChange(newIngredients);
  };
  
  const handleAddCustomIngredient = () => {
    if (searchQuery.trim() && !selectedIngredients.includes(searchQuery.trim())) {
      const newIngredients = [...selectedIngredients, searchQuery.trim()];
      onChange(newIngredients);
      setSearchQuery("");
    }
  };
  
  const handleGetSuggestions = async () => {
    if (!dishName) {
      toast.error("Please provide a dish name first");
      return;
    }
    
    try {
      setIsLoadingSuggestions(true);
      const suggestions = await getSuggestedIngredients(dishName, selectedIngredients);
      
      if (suggestions.length === 0) {
        toast.info("No additional ingredient suggestions available");
      } else {
        // Add suggested ingredients to the selected list
        const newIngredients = [...selectedIngredients];
        let added = 0;
        
        suggestions.forEach(ing => {
          if (!newIngredients.includes(ing)) {
            newIngredients.push(ing);
            added++;
          }
        });
        
        onChange(newIngredients);
        toast.success(`Added ${added} suggested ingredients`);
      }
    } catch (error) {
      console.error("Failed to get ingredient suggestions:", error);
      toast.error("Failed to get ingredient suggestions");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          {isLoadingIngredients && (
            <Loader2 className="animate-spin h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          )}
        </div>
        <Button 
          size="sm" 
          disabled={!searchQuery.trim()} 
          onClick={handleAddCustomIngredient}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!dishName || isLoadingSuggestions}
          onClick={handleGetSuggestions}
        >
          {isLoadingSuggestions ? (
            <Loader2 className="animate-spin h-4 w-4 mr-1" />
          ) : (
            <Plus className="h-4 w-4 mr-1" />
          )}
          Suggest
        </Button>
      </div>
      
      {/* Display filtered ingredients */}
      {filteredIngredients.length > 0 && (
        <div className="max-h-40 overflow-y-auto p-2 border rounded-md">
          <ul className="space-y-1">
            {filteredIngredients.slice(0, 8).map((ingredient) => (
              <li 
                key={ingredient} 
                className="cursor-pointer hover:bg-secondary p-1.5 rounded-sm flex items-center justify-between"
                onClick={() => handleAddIngredient(ingredient)}
              >
                <span>{ingredient}</span>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </li>
            ))}
            {filteredIngredients.length > 8 && (
              <li className="text-sm text-muted-foreground text-center pt-1">
                {filteredIngredients.length - 8} more...
              </li>
            )}
          </ul>
        </div>
      )}
      
      {/* Display selected ingredients */}
      <div className="flex flex-wrap gap-2 pt-2">
        {selectedIngredients.map((ingredient) => (
          <Badge key={ingredient} variant="secondary" className="text-sm flex items-center gap-1">
            {ingredient}
            <button
              type="button"
              className="ml-1 focus:outline-none"
              onClick={() => handleRemoveIngredient(ingredient)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {selectedIngredients.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No ingredients selected
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientSelector;
