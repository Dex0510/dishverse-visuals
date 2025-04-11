
import React, { useEffect, useState, useRef } from 'react';
import { useFloorPlan } from '@/contexts/FloorPlanContext';
import FloorTable from './FloorTable';
import FloorFurniture from './FloorFurniture';
import FloorZone from './FloorZone';
import { 
  Plus, 
  Move, 
  Trash2, 
  Maximize, 
  RotateCw, 
  Layers, 
  Grid, 
  ZoomIn, 
  ZoomOut, 
  ArrowUpDown,
  Users,
  Eye,
  LucideProps
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Table } from '@/services/tableService';
import { TablePosition } from '@/services/floorPlanService';
import { Zone } from '@/models/furniture';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface FloorEditorProps {
  onSave?: () => void;
  onCreateZone?: () => void;
  isPreviewMode?: boolean;
}

const FloorEditor: React.FC<FloorEditorProps> = ({ 
  onSave, 
  onCreateZone,
  isPreviewMode = false
}) => {
  const {
    activeFloorId,
    tables,
    tablePositions,
    selectedItemId,
    setSelectedItemId,
    selectedItemType,
    setSelectedItemType,
    editMode,
    setEditMode,
    addTablePosition,
    removeTablePosition,
    updateTablePosition,
    furniture,
    furniturePositions,
    addFurniturePosition,
    updateFurniturePosition,
    removeFurniturePosition,
    selectedFurnitureType,
    zones,
    removeZone,
    isSimulating,
    setIsSimulating,
    simulationSpeed,
    setSimulationSpeed,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    gridSize,
    zoomLevel,
    setZoomLevel
  } = useFloorPlan();
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorWidth, setEditorWidth] = useState(0);
  const [editorHeight, setEditorHeight] = useState(0);
  const [simulatedGuests, setSimulatedGuests] = useState<{id: string, x: number, y: number, targetX: number, targetY: number, speed: number, tableId?: string}[]>([]);
  const [simulatedStaff, setSimulatedStaff] = useState<{id: string, x: number, y: number, targetX: number, targetY: number, speed: number, route: {x: number, y: number}[]}[]>([]);
  const [simulationFrame, setSimulationFrame] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      setEditorWidth(editorRef.current.clientWidth);
      setEditorHeight(editorRef.current.clientHeight);

      const resizeObserver = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        setEditorWidth(width);
        setEditorHeight(height);
      });

      resizeObserver.observe(editorRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Simulation effects
  useEffect(() => {
    if (editMode === 'simulate' && !isSimulating) {
      startSimulation();
    } else if (editMode !== 'simulate' && isSimulating) {
      stopSimulation();
    }
  }, [editMode, isSimulating]);

  const startSimulation = () => {
    setIsSimulating(true);
    
    // Create simulated guests based on tables
    const guests = [];
    const occupiedTables = tablePositions
      .filter(pos => pos.floorId === activeFloorId)
      .slice(0, 5); // Limit for performance
    
    // Create 1-4 guests per table
    for (const tablePos of occupiedTables) {
      const guestCount = Math.floor(Math.random() * 4) + 1;
      
      for (let i = 0; i < guestCount; i++) {
        guests.push({
          id: uuidv4(),
          // Start at random position near edge
          x: Math.random() * editorWidth, 
          y: editorHeight - 10,
          // Target is the table
          targetX: tablePos.x + tablePos.width / 2 + (Math.random() * 30 - 15),
          targetY: tablePos.y + tablePos.height / 2 + (Math.random() * 30 - 15),
          speed: 0.5 + Math.random() * 1,
          tableId: tablePos.id
        });
      }
    }
    
    setSimulatedGuests(guests);
    
    // Create simulated staff
    const staff = [];
    const servicePath = [
      { x: 100, y: 100 },
      { x: 200, y: 150 },
      { x: 300, y: 200 },
      { x: 400, y: 150 },
      { x: 300, y: 100 },
    ];
    
    for (let i = 0; i < 2; i++) {
      staff.push({
        id: uuidv4(),
        x: 50 + i * 50,
        y: 50,
        targetX: servicePath[0].x,
        targetY: servicePath[0].y,
        speed: 1 + Math.random() * 0.5,
        route: [...servicePath]
      });
    }
    
    setSimulatedStaff(staff);
    
    // Start animation loop
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const animate = () => {
      setSimulationFrame(prev => prev + 1);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const stopSimulation = () => {
    setIsSimulating(false);
    setSimulatedGuests([]);
    setSimulatedStaff([]);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Update simulated agents position every frame
  useEffect(() => {
    if (!isSimulating) return;
    
    // Update guests
    setSimulatedGuests(prev => prev.map(guest => {
      const dx = guest.targetX - guest.x;
      const dy = guest.targetY - guest.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 5) {
        return guest; // Guest arrived at destination
      }
      
      const speed = guest.speed * simulationSpeed;
      const vx = (dx / distance) * speed;
      const vy = (dy / distance) * speed;
      
      return {
        ...guest,
        x: guest.x + vx,
        y: guest.y + vy
      };
    }));
    
    // Update staff
    setSimulatedStaff(prev => prev.map(staff => {
      const dx = staff.targetX - staff.x;
      const dy = staff.targetY - staff.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 5) {
        // Staff arrived at waypoint, get next waypoint
        const nextWaypoint = staff.route.shift();
        
        if (nextWaypoint) {
          staff.route.push(nextWaypoint); // Cycle the waypoint to the end
          return {
            ...staff,
            targetX: nextWaypoint.x,
            targetY: nextWaypoint.y
          };
        }
      }
      
      const speed = staff.speed * simulationSpeed;
      const vx = (dx / distance) * speed;
      const vy = (dy / distance) * speed;
      
      return {
        ...staff,
        x: staff.x + vx,
        y: staff.y + vy
      };
    }));
    
  }, [simulationFrame, simulationSpeed, isSimulating]);

  const handleEditorClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    
    // If not in add mode or simulation mode, just deselect
    if (editMode !== 'add_table' && editMode !== 'add_furniture' && editMode !== 'add_zone' && editMode !== 'simulate') {
      setSelectedItemId(null);
      setSelectedItemType(null);
      return;
    }
    
    if (editMode === 'add_table' && activeFloorId) {
      // Find available tables that aren't already placed
      const placedTableIds = tablePositions.map(pos => pos.tableId);
      const availableTables = tables.filter(t => 
        t.status === 'available' && !placedTableIds.includes(t.id)
      );

      if (availableTables.length === 0) {
        toast.error("No available tables to place. Create or free up tables first.");
        return;
      }

      const tableToAdd = availableTables[0];
      const rect = editorRef.current!.getBoundingClientRect();
      
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      
      // Snap to grid if enabled
      if (snapToGrid) {
        x = Math.round(x / gridSize) * gridSize;
        y = Math.round(y / gridSize) * gridSize;
      }
      
      const newPosition: TablePosition = {
        id: `tp-${Date.now()}`,
        tableId: tableToAdd.id,
        floorId: activeFloorId,
        x,
        y,
        width: 100,
        height: 80,
        rotation: 0,
        shape: 'rectangle'
      };

      addTablePosition(newPosition);
      setEditMode('select');
      setSelectedItemId(newPosition.id);
      setSelectedItemType('table');
      toast.success(`Table ${tableToAdd.name} placed on the floor plan`);
    } 
    else if (editMode === 'add_furniture' && activeFloorId && selectedFurnitureType) {
      const furnitureItem = furniture.find(f => f.id === selectedFurnitureType);
      
      if (!furnitureItem) {
        toast.error("Please select a furniture item first");
        return;
      }
      
      const rect = editorRef.current!.getBoundingClientRect();
      
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      
      // Snap to grid if enabled
      if (snapToGrid) {
        x = Math.round(x / gridSize) * gridSize;
        y = Math.round(y / gridSize) * gridSize;
      }
      
      const newPosition = {
        id: `fp-${Date.now()}`,
        furnitureId: furnitureItem.id,
        floorId: activeFloorId,
        x,
        y,
        width: furnitureItem.width,
        height: furnitureItem.height,
        rotation: furnitureItem.defaultRotation || 0
      };
      
      addFurniturePosition(newPosition);
      setSelectedItemId(newPosition.id);
      setSelectedItemType('furniture');
      toast.success(`${furnitureItem.name} placed on the floor plan`);
    }
  };

  const handleRotateItem = () => {
    if (!selectedItemId || !selectedItemType) return;
    
    if (selectedItemType === 'table') {
      const position = tablePositions.find(pos => pos.id === selectedItemId);
      if (position) {
        const updatedPosition = {
          ...position,
          rotation: (position.rotation + 45) % 360
        };
        updateTablePosition(updatedPosition);
      }
    } 
    else if (selectedItemType === 'furniture') {
      const position = furniturePositions.find(pos => pos.id === selectedItemId);
      if (position) {
        const updatedPosition = {
          ...position,
          rotation: (position.rotation + 45) % 360
        };
        updateFurniturePosition(updatedPosition);
      }
    }
  };

  const handleChangeTableShape = () => {
    if (!selectedItemId || selectedItemType !== 'table') return;
    
    const position = tablePositions.find(pos => pos.id === selectedItemId);
    if (position) {
      const newShape = position.shape === 'rectangle' ? 'circle' : 'rectangle';
      const updatedPosition = {
        ...position,
        shape: newShape as 'rectangle' | 'circle'
      };
      updateTablePosition(updatedPosition);
    }
  };

  const handleDeleteItem = () => {
    if (!selectedItemId || !selectedItemType) return;
    
    if (editMode === 'delete') {
      if (selectedItemType === 'table') {
        removeTablePosition(selectedItemId);
      } 
      else if (selectedItemType === 'furniture') {
        removeFurniturePosition(selectedItemId);
      }
      else if (selectedItemType === 'zone') {
        removeZone(selectedItemId);
      }
      
      setSelectedItemId(null);
      setSelectedItemType(null);
      toast.success("Item removed from floor plan");
    } else {
      setEditMode('delete');
    }
  };

  const handleSave = () => {
    toast.success("Floor plan saved successfully");
    if (onSave) onSave();
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // Guest and staff agent components
  const SimulatedGuest = ({ guest }: { guest: {id: string, x: number, y: number} }) => {
    return (
      <div 
        className="absolute w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 ease-out"
        style={{
          left: `${guest.x - 10}px`,
          top: `${guest.y - 10}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Users className="h-3 w-3 text-white" />
      </div>
    );
  };
  
  const SimulatedStaff = ({ staff }: { staff: {id: string, x: number, y: number} }) => {
    return (
      <div 
        className="absolute w-5 h-5 bg-green-500 rounded-full flex items-center justify-center transition-all duration-300 ease-out"
        style={{
          left: `${staff.x - 10}px`,
          top: `${staff.y - 10}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Eye className="h-3 w-3 text-white" />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {!isPreviewMode && (
        <div className="bg-gray-100 p-2 border-b flex items-center space-x-2 overflow-x-auto">
          <ToggleGroup type="single" value={editMode} onValueChange={(value) => value && setEditMode(value as EditorMode)}>
            <ToggleGroupItem value="select">
              <Move className="h-4 w-4 mr-1" /> Select
            </ToggleGroupItem>
            <ToggleGroupItem value="resize">
              <Maximize className="h-4 w-4 mr-1" /> Resize
            </ToggleGroupItem>
            <ToggleGroupItem value="add_table">
              <Plus className="h-4 w-4 mr-1" /> Add Table
            </ToggleGroupItem>
            <ToggleGroupItem value="add_zone">
              <Layers className="h-4 w-4 mr-1" /> Add Zone
            </ToggleGroupItem>
            <ToggleGroupItem value="delete">
              <Trash2 className="h-4 w-4 mr-1" /> Remove
            </ToggleGroupItem>
          </ToggleGroup>
          
          <div className="ml-auto flex items-center space-x-2">
            {selectedItemId && selectedItemType === 'table' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRotateItem}
                >
                  <RotateCw className="h-4 w-4 mr-1" /> Rotate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleChangeTableShape}
                >
                  Shape
                </Button>
              </>
            )}
            
            {selectedItemId && selectedItemType === 'furniture' && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRotateItem}
              >
                <RotateCw className="h-4 w-4 mr-1" /> Rotate
              </Button>
            )}
            
            {editMode === 'add_zone' && (
              <Button
                size="sm"
                variant="default"
                onClick={onCreateZone}
              >
                <Layers className="h-4 w-4 mr-1" /> Create Zone
              </Button>
            )}
            
            <div className="border-l pl-2 flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomOut}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="text-xs w-8 text-center">{Math.round(zoomLevel * 100)}%</div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomIn}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="border-l pl-2 flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Grid className="h-4 w-4 text-muted-foreground" />
                <Switch
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                  size="sm"
                />
              </div>
              
              <div className="flex items-center space-x-1">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Switch
                  checked={snapToGrid}
                  onCheckedChange={setSnapToGrid}
                  size="sm"
                />
              </div>
            </div>
            
            {isSimulating && (
              <div className="border-l pl-2 flex items-center space-x-2">
                <span className="text-xs">Speed:</span>
                <Slider
                  value={[simulationSpeed]}
                  onValueChange={(v) => setSimulationSpeed(v[0])}
                  min={0.5}
                  max={3}
                  step={0.5}
                  className="w-24"
                />
              </div>
            )}
            
            <Button size="sm" onClick={handleSave}>Save Layout</Button>
          </div>
        </div>
      )}
      
      <div 
        ref={editorRef}
        className="relative flex-1 bg-white border border-dashed border-gray-300 overflow-auto"
        onClick={handleEditorClick}
      >
        {editorWidth === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading editor...</p>
          </div>
        ) : (
          <div 
            className="relative h-full w-full" 
            style={{ 
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left',
              height: editorHeight / zoomLevel,  // Adjust for zoom
              width: editorWidth / zoomLevel      // Adjust for zoom
            }}
          >
            {showGrid && (
              <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,_20px)] grid-rows-[repeat(auto-fill,_20px)] opacity-10">
                {Array.from({ length: Math.floor((editorHeight / zoomLevel) / 20) }).map((_, rowIndex) => (
                  Array.from({ length: Math.floor((editorWidth / zoomLevel) / 20) }).map((_, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="border border-gray-300"
                    />
                  ))
                ))}
              </div>
            )}
            
            {/* Render zones */}
            {zones
              .filter(zone => activeFloorId === null || zone.id.includes(activeFloorId))
              .map(zone => (
                <FloorZone
                  key={zone.id}
                  zone={zone}
                  isSelected={zone.id === selectedItemId}
                  isPreviewMode={isPreviewMode}
                />
              ))
            }
            
            {/* Render furniture */}
            {furniturePositions
              .filter(position => position.floorId === activeFloorId)
              .map(position => {
                const furnitureItem = furniture.find(f => f.id === position.furnitureId);
                if (!furnitureItem) return null;
                
                return (
                  <FloorFurniture
                    key={position.id}
                    position={position}
                    furniture={furnitureItem}
                    isSelected={position.id === selectedItemId}
                    isPreviewMode={isPreviewMode}
                  />
                );
              })
            }
            
            {/* Render tables */}
            {tablePositions.map(position => {
              const table = tables.find(t => t.id === position.tableId);
              if (!table || position.floorId !== activeFloorId) return null;
              
              return (
                <FloorTable
                  key={position.id}
                  position={position}
                  table={table}
                  isSelected={position.id === selectedItemId}
                  isPreviewMode={isPreviewMode}
                />
              );
            })}
            
            {/* Render simulated people */}
            {isSimulating && simulatedGuests.map(guest => (
              <SimulatedGuest key={guest.id} guest={guest} />
            ))}
            
            {isSimulating && simulatedStaff.map(staff => (
              <SimulatedStaff key={staff.id} staff={staff} />
            ))}
            
            {editMode === 'add_table' && !isPreviewMode && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-500 bg-white/80 px-4 py-2 rounded-full">
                  Click anywhere to place a table
                </p>
              </div>
            )}
            
            {editMode === 'add_furniture' && !isPreviewMode && selectedFurnitureType && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-500 bg-white/80 px-4 py-2 rounded-full">
                  Click anywhere to place the selected furniture
                </p>
              </div>
            )}
            
            {editMode === 'add_zone' && !isPreviewMode && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-500 bg-white/80 px-4 py-2 rounded-full">
                  Click the Create Zone button to add a new zone
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {!isPreviewMode && (
        <div className="bg-gray-100 p-2 border-t">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Mode: <strong>{editMode.replace('_', ' ')}</strong></span>
            <span>{tablePositions.filter(p => p.floorId === activeFloorId).length} tables placed</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorEditor;
