
import React, { useEffect, useState } from 'react';
import { FloorPlanProvider, useFloorPlan } from '@/contexts/FloorPlanContext';
import FloorSelector from './FloorSelector';
import FloorEditor from './FloorEditor';
import { getFloorPlans, getFloors, getTablePositions } from '@/services/floorPlanService';
import { getTables } from '@/services/tableService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RestaurantMapContentProps {
  onClose: () => void;
}

export const RestaurantMapContent: React.FC<RestaurantMapContentProps> = ({ onClose }) => {
  const {
    setFloors,
    setTables,
    setTablePositions,
    activeFloorId,
    setActiveFloorId
  } = useFloorPlan();
  
  const [floorPlanId, setFloorPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load floor plans (we'll use the first one)
        const floorPlans = await getFloorPlans();
        
        if (floorPlans.length === 0) {
          toast.error("No floor plans found. Please create one first.");
          return;
        }
        
        const activePlan = floorPlans[0];
        setFloorPlanId(activePlan.id);
        
        // Load floors
        const floorsData = await getFloors(activePlan.id);
        setFloors(floorsData);
        
        // Set active floor (first one by default)
        if (floorsData.length > 0) {
          setActiveFloorId(floorsData[0].id);
        }
        
        // Load tables
        const tablesData = await getTables();
        setTables(tablesData);

        // Load table positions for all floors
        const allPositions = await Promise.all(
          floorsData.map(floor => getTablePositions(floor.id))
        );
        
        // Flatten positions array
        setTablePositions(allPositions.flat());
      } catch (error) {
        console.error("Failed to load restaurant map data:", error);
        toast.error("Failed to load floor plan data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setFloors, setTables, setTablePositions, setActiveFloorId]);

  const handleSaveMap = () => {
    // In a real implementation, this would save all data to the backend
    toast.success("Restaurant map saved successfully");
    onClose();
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading restaurant map...</p>
        </div>
      </div>
    );
  }

  if (!floorPlanId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium mb-4">No floor plans found</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white border-b">
        <h2 className="text-xl font-bold mb-4">Restaurant Floor Plan Editor</h2>
        {floorPlanId && <FloorSelector floorPlanId={floorPlanId} />}
      </div>
      
      <div className="flex-1 overflow-hidden">
        {activeFloorId ? (
          <FloorEditor onSave={handleSaveMap} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Please select or create a floor to start editing</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white border-t">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveMap}>
            Save & Close
          </Button>
        </div>
      </div>
    </div>
  );
};

const RestaurantMap: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <FloorPlanProvider>
        <RestaurantMapContent onClose={onClose} />
      </FloorPlanProvider>
    </div>
  );
};

export default RestaurantMap;
