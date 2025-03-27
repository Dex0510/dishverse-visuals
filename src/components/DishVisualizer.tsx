
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { generate3DImage } from "../services/dishService";

interface DishVisualizerProps {
  dishName: string;
  ingredients?: string[];
  description?: string;
  className?: string;
}

const DishVisualizer = ({ 
  dishName, 
  ingredients = [], 
  description = "", 
  className = "" 
}: DishVisualizerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchImage = async () => {
      // Don't attempt to fetch if no dish name is provided
      if (!dishName) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In development, we can use a fallback image if the API isn't available
        if (process.env.NODE_ENV === 'development' && !process.env.VITE_USE_REAL_API) {
          // Simulate API call with a delay
          setTimeout(() => {
            setImageUrl(`https://dummyimage.com/600x400/000/fff&text=${dishName.replace(/\s+/g, '+')}`);
            setIsLoading(false);
          }, 1500);
        } else {
          // Call the actual API
          const url = await generate3DImage({
            dish_name: dishName,
            ingredients: ingredients,
            description: description
          });
          setImageUrl(url);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to generate 3D image:", err);
        setError("Failed to generate image. Using fallback.");
        setImageUrl(`https://dummyimage.com/600x400/000/fff&text=${dishName.replace(/\s+/g, '+')}`);
        setIsLoading(false);
      }
    };
    
    fetchImage();
  }, [dishName, ingredients, description]);

  return (
    <div className={`relative overflow-hidden rounded-xl aspect-square ${className}`}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="h-full w-full float-animation">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={dishName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20" />
          )}
          
          {error && (
            <div className="absolute top-2 right-2 left-2 bg-destructive/90 text-destructive-foreground text-xs px-2 py-1 rounded">
              {error}
            </div>
          )}
          
          <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-lg">
            <h3 className="font-medium truncate">{dishName}</h3>
            {ingredients.length > 0 && (
              <p className="text-xs text-white/80 truncate">
                {ingredients.slice(0, 3).join(", ")}
                {ingredients.length > 3 ? "..." : ""}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DishVisualizer;
