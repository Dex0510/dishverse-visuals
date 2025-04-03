
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DishVisualizerProps {
  dishName: string;
  ingredients: string[];
  className?: string;
}

const DishVisualizer: React.FC<DishVisualizerProps> = ({
  dishName,
  ingredients,
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
        // Here we're just using a placeholder as we don't have a real image API
        // In a real app, you'd call an actual image generation API
        createPlaceholderImage();
      } catch (err) {
        console.error("Failed to generate image:", err);
        setError("Failed to load image");
        createPlaceholderImage();
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [dishName, ingredients]);

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
        </div>
      </div>
    );
  }

  return <img src={imageUrl} alt={dishName} className={cn("object-cover", className)} />;
};

export default DishVisualizer;
