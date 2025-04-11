
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { furnitureLibrary, getAllCategories, getItemsByCategory } from '@/data/furnitureLibrary';
import { FurnitureItem } from '@/models/furniture';
import { useFloorPlan } from '@/contexts/FloorPlanContext';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const FurnitureLibrary: React.FC = () => {
  const { 
    editMode, 
    setEditMode, 
    selectedFurnitureType, 
    setSelectedFurnitureType 
  } = useFloorPlan();
  
  const categories = getAllCategories();
  
  const handleSelectFurniture = (item: FurnitureItem) => {
    setSelectedFurnitureType(item.id);
    setEditMode('add_furniture');
  };
  
  // Dynamically get the icon component
  const getIconComponent = (iconName: string) => {
    // Remove "Icon" suffix if present
    const cleanIconName = iconName.endsWith('Icon') 
      ? iconName.substring(0, iconName.length - 4) 
      : iconName;
      
    // @ts-ignore - dynamic import from lucide-react
    const Icon = LucideIcons[cleanIconName];
    
    if (!Icon) {
      console.warn(`Icon ${cleanIconName} not found`);
      return LucideIcons.HelpCircle;
    }
    
    return Icon;
  };

  return (
    <div className="h-full border-l border-border">
      <div className="p-4 border-b">
        <h2 className="font-medium">Furniture & Elements</h2>
        <p className="text-xs text-muted-foreground">
          Drag and drop items onto the floor plan
        </p>
      </div>
      
      <Tabs defaultValue={categories[0]}>
        <TabsList className="w-full justify-start px-4 pt-2">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {capitalizeFirstLetter(category)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-0">
            <ScrollArea className="h-[calc(100vh-230px)]">
              <div className="grid grid-cols-2 gap-2 p-4">
                {getItemsByCategory(category).map(item => {
                  const IconComponent = getIconComponent(item.icon);
                  const isSelected = selectedFurnitureType === item.id && editMode === 'add_furniture';
                  
                  return (
                    <div 
                      key={item.id}
                      className={cn(
                        "p-2 border rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-accent hover:border-primary transition-colors",
                        isSelected && "bg-accent border-primary"
                      )}
                      onClick={() => handleSelectFurniture(item)}
                    >
                      <div className="w-10 h-10 flex items-center justify-center">
                        <IconComponent size={24} />
                      </div>
                      <div className="mt-1 text-center">
                        <p className="text-xs font-medium">{item.name}</p>
                        {item.capacity && (
                          <p className="text-xs text-muted-foreground">Seats: {item.capacity}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FurnitureLibrary;
