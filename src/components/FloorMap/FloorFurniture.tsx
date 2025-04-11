
import React, { useRef, useEffect, useState } from 'react';
import { useFloorPlan } from '@/contexts/FloorPlanContext';
import { FurnitureItem } from '@/models/furniture';
import { cn } from '@/lib/utils';

interface FloorFurnitureProps {
  position: {
    id: string;
    furnitureId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    floorId: string;
  };
  furniture: FurnitureItem;
  isSelected: boolean;
  isPreviewMode?: boolean;
}

const FloorFurniture: React.FC<FloorFurnitureProps> = ({
  position,
  furniture,
  isSelected,
  isPreviewMode = false
}) => {
  const {
    setSelectedItemId,
    setSelectedItemType,
    editMode,
    updateFurniturePosition,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    snapToGrid,
    gridSize
  } = useFloorPlan();
  
  const furnitureRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    setSelectedItemId(position.id);
    setSelectedItemType('furniture');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    if (editMode !== 'select' || isResizing) return;
    
    e.stopPropagation();
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    setIsDragging(true);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    if (editMode !== 'resize') return;
    
    e.stopPropagation();
    setResizeStart({
      width: position.width,
      height: position.height,
      x: e.clientX,
      y: e.clientY
    });
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && editMode === 'select') {
        let newX = Math.max(0, e.clientX - dragStart.x);
        let newY = Math.max(0, e.clientY - dragStart.y);
        
        // Snap to grid if enabled
        if (snapToGrid) {
          newX = Math.round(newX / gridSize) * gridSize;
          newY = Math.round(newY / gridSize) * gridSize;
        }
        
        updateFurniturePosition({
          ...position,
          x: newX,
          y: newY
        });
      } else if (isResizing && editMode === 'resize') {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = Math.max(20, resizeStart.width + deltaX);
        let newHeight = Math.max(20, resizeStart.height + deltaY);
        
        // Snap to grid if enabled
        if (snapToGrid) {
          newWidth = Math.round(newWidth / gridSize) * gridSize;
          newHeight = Math.round(newHeight / gridSize) * gridSize;
        }
        
        updateFurniturePosition({
          ...position,
          width: newWidth,
          height: newHeight
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
      if (isResizing) {
        setIsResizing(false);
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDragging, 
    isResizing, 
    dragStart, 
    resizeStart, 
    editMode, 
    position, 
    updateFurniturePosition, 
    setIsDragging, 
    setIsResizing,
    snapToGrid,
    gridSize
  ]);

  const style: React.CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${position.width}px`,
    height: `${position.height}px`,
    transform: `rotate(${position.rotation}deg)`,
    cursor: editMode === 'select' && !isPreviewMode ? 'move' : 'default',
    backgroundImage: furniture.icon ? `url(${furniture.icon})` : undefined,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: furniture.color || '#e2e8f0'
  };

  return (
    <div
      ref={furnitureRef}
      className={cn(
        'absolute flex items-center justify-center border border-gray-300 shadow-sm transition-shadow',
        isSelected && !isPreviewMode && 'ring-2 ring-blue-500 ring-offset-2',
        editMode === 'delete' && isSelected && !isPreviewMode && 'ring-2 ring-red-500 ring-offset-2'
      )}
      style={style}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      {!furniture.icon && (
        <span className="text-xs text-center px-1">{furniture.name}</span>
      )}
      
      {isSelected && editMode === 'resize' && !isPreviewMode && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default FloorFurniture;
