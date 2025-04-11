
import React, { useEffect, useState } from 'react';
import { FloorPlanProvider, useFloorPlan } from '@/contexts/FloorPlanContext';
import FloorSelector from './FloorSelector';
import FloorEditor from './FloorEditor';
import FurnitureLibrary from './FurnitureLibrary';
import { getFloorPlans, getFloors, getTablePositions } from '@/services/floorPlanService';
import { getTables } from '@/services/tableService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ZoneCreator from './ZoneCreator';
import { toast } from 'sonner';
import { HelpCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { furnitureLibrary } from '@/data/furnitureLibrary';

interface RestaurantMapContentProps {
  onClose: () => void;
}

export const RestaurantMapContent: React.FC<RestaurantMapContentProps> = ({ onClose }) => {
  const {
    setFloors,
    setTables,
    setTablePositions,
    activeFloorId,
    setActiveFloorId,
    editMode,
    setEditMode,
    setFurniture,
    isSimulating,
    selectedItemType,
    selectedItemId
  } = useFloorPlan();
  
  const [floorPlanId, setFloorPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('editor');

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
        
        // Set furniture library
        setFurniture(furnitureLibrary);
        
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
  }, [setFloors, setTables, setTablePositions, setActiveFloorId, setFurniture]);

  const handleSaveMap = () => {
    // In a real implementation, this would save all data to the backend
    toast.success("Restaurant floor plan saved successfully");
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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Interactive Floor Plan Editor</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHelpDialog(true)}
            >
              <HelpCircle className="h-4 w-4 mr-1" /> 
              Tutorial
            </Button>
            {isSimulating ? (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setEditMode('select')}
              >
                Stop Simulation
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setEditMode('simulate')}
              >
                Start Simulation
              </Button>
            )}
          </div>
        </div>
        {floorPlanId && <FloorSelector floorPlanId={floorPlanId} />}
      </div>
      
      <div className="flex-1 overflow-hidden flex">
        {activeFloorId ? (
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="mx-4 mt-2">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="flex-1 flex overflow-hidden m-0 border-t mt-2">
              <div className="flex-1 overflow-hidden">
                <FloorEditor onSave={handleSaveMap} onCreateZone={() => setIsZoneDialogOpen(true)} />
              </div>
              
              <div className="w-64">
                <FurnitureLibrary />
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 m-0 border-t mt-2 relative overflow-hidden">
              <div className="absolute inset-0 p-4 bg-white">
                <h3 className="text-lg font-medium mb-4">Interactive Preview</h3>
                <div className="bg-gray-100 rounded-lg p-4 h-[calc(100%-4rem)] overflow-auto">
                  {/* Preview content - simplified version of the floor plan */}
                  <FloorEditor onSave={handleSaveMap} isPreviewMode />
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
      
      {/* Zone Creator Dialog */}
      <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
        <DialogContent>
          <ZoneCreator onCancel={() => setIsZoneDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Help/Tutorial Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-4xl">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Floor Plan Designer Tutorial</h2>
            
            <div className="grid gap-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Getting Started</h3>
                <p>Welcome to the interactive Floor Plan Designer! This tool allows you to design your restaurant layout with a simple drag-and-drop interface.</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Start by selecting or creating a floor</li>
                  <li>Use the toolbar to add tables, furniture, and define zones</li>
                  <li>Drag items to position them, and use resize handles to adjust size</li>
                  <li>Save your design when finished</li>
                </ul>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Editor Tools</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Select:</strong> Click on objects to select and move them</li>
                  <li><strong>Add Table:</strong> Place tables from your inventory</li>
                  <li><strong>Add Furniture:</strong> Place chairs, walls, and other elements</li>
                  <li><strong>Create Zone:</strong> Define areas like dining, kitchen, or bar</li>
                  <li><strong>Resize:</strong> Adjust the size of selected objects</li>
                  <li><strong>Delete:</strong> Remove selected objects from the floor plan</li>
                  <li><strong>Simulate:</strong> See how your layout functions with simulated guests and staff</li>
                </ul>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Tips for Effective Layouts</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Allow at least 18 inches between tables for comfortable movement</li>
                  <li>Group tables by size to optimize seating efficiency</li>
                  <li>Create clear paths for servers and guests</li>
                  <li>Position service stations strategically throughout dining areas</li>
                  <li>Use the simulation feature to test traffic flow during peak hours</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowHelpDialog(false)}>
                Start Designing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
