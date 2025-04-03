
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { generate3DImage } from "@/services/dishService";

interface DishVisualizerProps {
  dishName: string;
  ingredients: string[];
  description?: string;
  className?: string;
}

const DishVisualizer: React.FC<DishVisualizerProps> = ({
  dishName,
  ingredients,
  description,
  className,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Generate a deterministic color based on the dish name
    const getColorFromString = (str: string): string => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash % 360);
      return `hsl(${hue}, 70%, 80%)`;
    };

    // Create a simple placeholder with dish name
    const createPlaceholderImage = () => {
      const color = getColorFromString(dishName);
      setImageUrl(null);
      setIsLoading(false);
    };

    // Try to fetch an actual image
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        
        if (dishName && ingredients.length > 0) {
          const imageUrl = await generate3DImage({ 
            dish_name: dishName, 
            ingredients: ingredients,
            description: description 
          });
          
          if (imageUrl) {
            setImageUrl(imageUrl);
          } else {
            createPlaceholderImage();
          }
        } else {
          createPlaceholderImage();
        }
      } catch (err) {
        console.error("Failed to generate image:", err);
        setError("Failed to load image");
        createPlaceholderImage();
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [dishName, ingredients, description]);

  // Get the first letter of each word in the dish name
  const initials = dishName
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full h-full bg-muted flex items-center justify-center",
          className
        )}
      >
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !imageUrl) {
    // Fallback to a nice looking placeholder
    const bgColor = `bg-primary/10`;
    
    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center text-primary-foreground",
          bgColor,
          className
        )}
      >
        <div className="flex flex-col items-center justify-center text-center p-4">
          <div className="text-4xl font-bold mb-2">{initials}</div>
          <div className="text-sm font-medium text-muted-foreground max-w-[80%]">
            {dishName}
          </div>
          {description && (
            <div className="text-xs mt-2 text-muted-foreground max-w-[80%] line-clamp-3">
              {description}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <img src={imageUrl} alt={dishName} className={cn("object-cover", className)} />;
};

export default DishVisualizer;
