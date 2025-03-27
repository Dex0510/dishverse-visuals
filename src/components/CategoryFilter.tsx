
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <Tabs defaultValue={selectedCategory} onValueChange={onCategoryChange}>
      <TabsList className="w-full max-w-full overflow-x-auto flex-nowrap">
        <TabsTrigger value="all" className="whitespace-nowrap">
          All Categories
        </TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            className="whitespace-nowrap"
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryFilter;
