
import React, { useState } from 'react';
import { useFloorPlan } from '@/contexts/FloorPlanContext';
import { Button } from '@/components/ui/button';
import { Plus, Building, Building2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFloor } from '@/services/floorPlanService';
import { toast } from 'sonner';

interface FloorSelectorProps {
  floorPlanId: string;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({ floorPlanId }) => {
  const { floors, setFloors, activeFloorId, setActiveFloorId } = useFloorPlan();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');
  
  const handleAddFloor = async () => {
    if (!newFloorName.trim()) {
      toast.error("Please enter a floor name");
      return;
    }
    
    try {
      const newFloor = await createFloor({
        name: newFloorName,
        floorPlanId: floorPlanId,
        order: floors.length
      });
      
      setFloors([...floors, newFloor]);
      setActiveFloorId(newFloor.id);
      setNewFloorName('');
      setIsDialogOpen(false);
      toast.success(`Floor "${newFloorName}" created successfully`);
    } catch (error) {
      console.error("Failed to create floor:", error);
      toast.error("Failed to create floor. Please try again.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {floors.map((floor) => (
        <Button
          key={floor.id}
          variant={activeFloorId === floor.id ? 'default' : 'outline'}
          onClick={() => setActiveFloorId(floor.id)}
        >
          <Building2 className="h-4 w-4 mr-1" />
          {floor.name}
        </Button>
      ))}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Floor
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Floor</DialogTitle>
            <DialogDescription>
              Create a new floor for your restaurant layout.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Floor Name
              </Label>
              <Input
                id="name"
                value={newFloorName}
                onChange={(e) => setNewFloorName(e.target.value)}
                placeholder="e.g. Ground Floor, First Floor, Rooftop"
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddFloor}>
              Create Floor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FloorSelector;
