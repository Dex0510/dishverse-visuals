
import React, { useEffect, useState, useRef } from 'react';
import { useFloorPlan } from '@/contexts/FloorPlanContext';
import FloorTable from './FloorTable';
import { Plus, Move, Trash2, Maximize, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table } from '@/services/tableService';
import { TablePosition } from '@/services/floorPlanService';
import { toast } from 'sonner';

interface FloorEditorProps {
  onSave?: () => void;
}

const FloorEditor: React.FC<FloorEditorProps> = ({ onSave }) => {
  const {
    activeFloorId,
    tables,
    tablePositions,
    selectedTableId,
    setSelectedTableId,
    editMode,
    setEditMode,
    addTablePosition,
    removeTablePosition
  } = useFloorPlan();
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorWidth, setEditorWidth] = useState(0);
  const [editorHeight, setEditorHeight] = useState(0);

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

  const handleEditorClick = (e: React.MouseEvent) => {
    if (editMode === 'add' && activeFloorId) {
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
      
      const newPosition: TablePosition = {
        id: `tp-${Date.now()}`,
        tableId: tableToAdd.id,
        floorId: activeFloorId,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        width: 100,
        height: 80,
        rotation: 0,
        shape: 'rectangle'
      };

      addTablePosition(newPosition);
      setEditMode('select');
      setSelectedTableId(newPosition.id);
      toast.success(`Table ${tableToAdd.name} placed on the floor plan`);
    } else {
      setSelectedTableId(null);
    }
  };

  const handleRotateTable = () => {
    if (!selectedTableId) return;
    
    const position = tablePositions.find(pos => pos.id === selectedTableId);
    if (position) {
      const updatedPosition = {
        ...position,
        rotation: (position.rotation + 45) % 360
      };
      
      // Update the position through context
      const { updateTablePosition } = useFloorPlan();
      updateTablePosition(updatedPosition);
    }
  };

  const handleChangeTableShape = () => {
    if (!selectedTableId) return;
    
    const position = tablePositions.find(pos => pos.id === selectedTableId);
    if (position) {
      const newShape = position.shape === 'rectangle' ? 'circle' : 'rectangle';
      const updatedPosition = {
        ...position,
        shape: newShape as 'rectangle' | 'circle'
      };
      
      // Update the position through context
      const { updateTablePosition } = useFloorPlan();
      updateTablePosition(updatedPosition);
    }
  };

  const handleDeleteTable = () => {
    if (!selectedTableId) return;
    
    if (editMode === 'delete') {
      removeTablePosition(selectedTableId);
      setSelectedTableId(null);
      toast.success("Table removed from floor plan");
    } else {
      setEditMode('delete');
    }
  };

  const handleSave = () => {
    toast.success("Floor plan saved successfully");
    if (onSave) onSave();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-100 p-2 border-b flex items-center space-x-2">
        <Button
          size="sm"
          variant={editMode === 'select' ? 'default' : 'outline'}
          onClick={() => setEditMode('select')}
        >
          <Move className="h-4 w-4 mr-1" /> Move
        </Button>
        <Button
          size="sm"
          variant={editMode === 'resize' ? 'default' : 'outline'}
          onClick={() => setEditMode('resize')}
        >
          <Maximize className="h-4 w-4 mr-1" /> Resize
        </Button>
        <Button
          size="sm"
          variant={editMode === 'add' ? 'default' : 'outline'}
          onClick={() => setEditMode('add')}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Table
        </Button>
        <Button
          size="sm"
          variant={editMode === 'delete' ? 'destructive' : 'outline'}
          onClick={handleDeleteTable}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Remove
        </Button>
        
        <div className="ml-auto flex items-center space-x-2">
          {selectedTableId && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRotateTable}
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
          <Button size="sm" onClick={handleSave}>Save Layout</Button>
        </div>
      </div>
      
      <div 
        ref={editorRef}
        className="relative flex-1 bg-white border border-dashed border-gray-300 overflow-hidden"
        onClick={handleEditorClick}
      >
        {editorWidth === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading editor...</p>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,_20px)] grid-rows-[repeat(auto-fill,_20px)] opacity-10">
              {Array.from({ length: Math.floor(editorHeight / 20) }).map((_, rowIndex) => (
                Array.from({ length: Math.floor(editorWidth / 20) }).map((_, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="border border-gray-300"
                  />
                ))
              ))}
            </div>
            
            {tablePositions.map(position => {
              const table = tables.find(t => t.id === position.tableId);
              if (!table || position.floorId !== activeFloorId) return null;
              
              return (
                <FloorTable
                  key={position.id}
                  position={position}
                  table={table}
                  isSelected={position.id === selectedTableId}
                />
              );
            })}
            
            {editMode === 'add' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-500 bg-white/80 px-4 py-2 rounded-full">
                  Click anywhere to place a table
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-gray-100 p-2 border-t">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Editor mode: <strong>{editMode}</strong></span>
          <span>{tablePositions.filter(p => p.floorId === activeFloorId).length} tables placed</span>
        </div>
      </div>
    </div>
  );
};

export default FloorEditor;
