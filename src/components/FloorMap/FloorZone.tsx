
import React, { useRef, useEffect, useState } from 'react';
import { useFloorPlan } from '@/contexts/FloorPlanContext';
import { Zone } from '@/models/furniture';
import { cn } from '@/lib/utils';

interface FloorZoneProps {
  zone: Zone;
  isSelected: boolean;
  isPreviewMode?: boolean;
}

const FloorZone: React.FC<FloorZoneProps> = ({ 
  zone, 
  isSelected,
  isPreviewMode = false
}) => {
  const {
    setSelectedItemId,
    setSelectedItemType,
    editMode,
    updateZone,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    snapToGrid,
    gridSize
  } = useFloorPlan();
  
  const zoneRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    setSelectedItemId(zone.id);
    setSelectedItemType('zone');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    if (editMode !== 'select' || isResizing) return;
    
    e.stopPropagation();
    setDragStart({
      x: e.clientX - zone.x,
      y: e.clientY - zone.y
    });
    setIsDragging(true);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    if (editMode !== 'resize') return;
    
    e.stopPropagation();
    setResizeStart({
      width: zone.width,
      height: zone.height,
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
        
        updateZone({
          ...zone,
          x: newX,
          y: newY
        });
      } else if (isResizing && editMode === 'resize') {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = Math.max(100, resizeStart.width + deltaX);
        let newHeight = Math.max(100, resizeStart.height + deltaY);
        
        // Snap to grid if enabled
        if (snapToGrid) {
          newWidth = Math.round(newWidth / gridSize) * gridSize;
          newHeight = Math.round(newHeight / gridSize) * gridSize;
        }
        
        updateZone({
          ...zone,
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
    zone, 
    updateZone, 
    setIsDragging, 
    setIsResizing,
    snapToGrid,
    gridSize
  ]);

  const style: React.CSSProperties = {
    left: `${zone.x}px`,
    top: `${zone.y}px`,
    width: `${zone.width}px`,
    height: `${zone.height}px`,
    backgroundColor: zone.color,
    opacity: zone.opacity,
    cursor: editMode === 'select' && !isPreviewMode ? 'move' : 'default',
    pointerEvents: isPreviewMode ? 'none' : 'auto',
    zIndex: 0, // Keep zones below furniture and tables
  };

  return (
    <div
      ref={zoneRef}
      className={cn(
        'absolute rounded-md border-2',
        isSelected && !isPreviewMode && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent',
        editMode === 'delete' && isSelected && !isPreviewMode && 'ring-2 ring-red-500 ring-offset-2 ring-offset-transparent'
      )}
      style={style}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium">
        {zone.name}
      </div>
      
      {isSelected && editMode === 'resize' && !isPreviewMode && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default FloorZone;
