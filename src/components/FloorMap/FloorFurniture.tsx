import React, { useRef, useEffect, useState } from 'react';
import { useFloorPlan } from '@/contexts/FloorPlanContext';
import { FurnitureItem } from '@/models/furniture';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

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
      } else if (isResizing && editMode === 'resize' && furniture.isResizable) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = Math.max(furniture.minWidth || 30, resizeStart.width + deltaX);
        let newHeight = Math.max(furniture.minHeight || 30, resizeStart.height + deltaY);
        
        // Respect max dimensions if specified
        if (furniture.maxWidth) {
          newWidth = Math.min(newWidth, furniture.maxWidth);
        }
        
        if (furniture.maxHeight) {
          newHeight = Math.min(newHeight, furniture.maxHeight);
        }
        
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
    furniture,
    snapToGrid,
    gridSize
  ]);

  // Get the appropriate icon component from lucide-react
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
  
  const IconComponent = getIconComponent(furniture.icon);

  // Determine furniture styling based on category
  const getFurnitureStyle = () => {
    switch (furniture.category) {
      case 'seating':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      case 'structural':
        return 'bg-gray-100 border-gray-500 text-gray-700';
      case 'decor':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'service':
        return 'bg-purple-100 border-purple-500 text-purple-700';
      case 'equipment':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const style: React.CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${position.width}px`,
    height: `${position.height}px`,
    transform: `rotate(${position.rotation}deg)`,
    cursor: editMode === 'select' && !isPreviewMode ? 'move' : 'default',
  };
  
  const { name, capacity } = furniture;

  return (
    <div
      ref={furnitureRef}
      className={cn(
        'absolute flex flex-col items-center justify-center border-2 shadow-sm transition-shadow',
        getFurnitureStyle(),
        isSelected && !isPreviewMode && 'ring-2 ring-blue-500 ring-offset-2',
        editMode === 'delete' && isSelected && !isPreviewMode && 'ring-2 ring-red-500 ring-offset-2'
      )}
      style={style}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <IconComponent className="h-6 w-6" />
      
      {(position.width > 60 && position.height > 50) && (
        <>
          <span className="font-medium text-xs mt-1">{name}</span>
          {capacity && <span className="text-xs">{capacity} seats</span>}
        </>
      )}
      
      {isSelected && editMode === 'resize' && furniture.isResizable && !isPreviewMode && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default FloorFurniture;
