
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface DishVisualizerProps {
  dishName: string;
  ingredients?: string[];
  className?: string;
}

const DishVisualizer = ({ dishName, ingredients = [], className = "" }: DishVisualizerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading time for 3D model
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [dishName, ingredients]);

  // In a real app, we would connect to a 3D model API here
  // For now, we'll use a placeholder with some visual effects

  return (
    <div className={`relative overflow-hidden rounded-xl aspect-square ${className}`}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="h-full w-full float-animation">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Placeholder for 3D model */}
            <div className="relative w-3/4 h-3/4 rounded-full bg-gradient-to-br from-orange-200 to-amber-400 dark:from-orange-500 dark:to-amber-600 opacity-90 shadow-xl">
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-white/30 dark:bg-white/10 blur-md" />
            </div>
          </div>
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
