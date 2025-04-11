
import React, { useState } from 'react';
import { useFloorPlan } from '@/contexts/FloorPlanContext';
import { Zone, ZoneType } from '@/models/furniture';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';

interface ZoneCreatorProps {
  onCancel: () => void;
}

const ZoneCreator: React.FC<ZoneCreatorProps> = ({ onCancel }) => {
  const { activeFloorId, addZone, selectedItemId, zones, updateZone } = useFloorPlan();
  
  const existingZone = selectedItemId ? zones.find(z => z.id === selectedItemId) : null;
  
  const [zone, setZone] = useState<Omit<Zone, 'id'>>({
    name: existingZone?.name || 'New Zone',
    type: existingZone?.type || 'dining',
    color: existingZone?.color || '#3b82f6',
    opacity: existingZone?.opacity || 0.2,
    x: existingZone?.x || 100,
    y: existingZone?.y || 100,
    width: existingZone?.width || 300,
    height: existingZone?.height || 200,
    furniture: existingZone?.furniture || []
  });
  
  const handleChange = (key: keyof Omit<Zone, 'id'>, value: any) => {
    setZone(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSubmit = () => {
    if (!activeFloorId) return;
    
    if (existingZone) {
      updateZone({
        ...zone,
        id: existingZone.id
      });
    } else {
      addZone({
        ...zone,
        id: uuidv4()
      });
    }
    
    onCancel();
  };
  
  const zoneTypes: { value: ZoneType, label: string }[] = [
    { value: 'dining', label: 'Dining Area' },
    { value: 'bar', label: 'Bar Area' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'waiting', label: 'Waiting Area' },
    { value: 'entrance', label: 'Entrance' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'private', label: 'Private Dining' },
    { value: 'custom', label: 'Custom' }
  ];

  return (
    <div className="p-4">
      <DialogHeader>
        <DialogTitle>{existingZone ? 'Edit Zone' : 'Create Zone'}</DialogTitle>
        <DialogDescription>
          {existingZone 
            ? 'Edit the properties of this zone' 
            : 'Define a new zone area on your floor plan'}
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="zone-name" className="text-right">Name</Label>
          <Input
            id="zone-name"
            value={zone.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="zone-type" className="text-right">Type</Label>
          <Select 
            value={zone.type} 
            onValueChange={(value) => handleChange('type', value as ZoneType)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a zone type" />
            </SelectTrigger>
            <SelectContent>
              {zoneTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="zone-color" className="text-right">Color</Label>
          <div className="col-span-3 flex items-center gap-2">
            <Input
              id="zone-color"
              type="color"
              value={zone.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              value={zone.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="zone-opacity" className="text-right">Opacity</Label>
          <div className="col-span-3 flex items-center gap-4">
            <Slider
              id="zone-opacity"
              min={0}
              max={1}
              step={0.05}
              value={[zone.opacity]}
              onValueChange={(value) => handleChange('opacity', value[0])}
              className="flex-1"
            />
            <span className="w-10 text-right">{Math.round(zone.opacity * 100)}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Size</Label>
          <div className="col-span-3 grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="zone-width" className="text-xs">Width</Label>
              <Input
                id="zone-width"
                type="number"
                value={zone.width}
                onChange={(e) => handleChange('width', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="zone-height" className="text-xs">Height</Label>
              <Input
                id="zone-height"
                type="number"
                value={zone.height}
                onChange={(e) => handleChange('height', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit}>
          {existingZone ? 'Update Zone' : 'Create Zone'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ZoneCreator;
