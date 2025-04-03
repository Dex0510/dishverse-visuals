
import React, { useState } from "react";
import { RefreshCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateDescription } from "@/services/dishService";
import { toast } from "sonner";

interface DescriptionGeneratorProps {
  dishName: string;
  ingredients: string[];
  value: string;
  onChange: (description: string) => void;
}

const DescriptionGenerator: React.FC<DescriptionGeneratorProps> = ({
  dishName,
  ingredients,
  value,
  onChange
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateDescription = async () => {
    if (!dishName) {
      toast.error("Please provide a dish name first");
      return;
    }
    
    if (ingredients.length === 0) {
      toast.error("Please add some ingredients first");
      return;
    }
    
    try {
      setIsGenerating(true);
      const description = await generateDescription(dishName, ingredients);
      onChange(description);
      toast.success("Description generated successfully");
    } catch (error) {
      console.error("Failed to generate description:", error);
      toast.error("Failed to generate description");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Description</label>
        <Button
          variant="ghost"
          size="sm"
          disabled={!dishName || ingredients.length === 0 || isGenerating}
          onClick={handleGenerateDescription}
        >
          {isGenerating ? (
            <Loader2 className="animate-spin h-4 w-4 mr-1" />
          ) : (
            <RefreshCcw className="h-4 w-4 mr-1" />
          )}
          Generate
        </Button>
      </div>
      <Textarea
        placeholder="Enter dish description or use the generate button..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
    </div>
  );
};

export default DescriptionGenerator;
