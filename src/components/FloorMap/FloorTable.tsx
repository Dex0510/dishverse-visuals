
import React, { useRef, useEffect, useState } from 'react';
import { useFloorPlan } from '@/contexts/FloorPlanContext';
import { TablePosition } from '@/services/floorPlanService';
import { Table } from '@/services/tableService';
import { cn } from '@/lib/utils';

interface FloorTableProps {
  position: TablePosition;
  table: Table;
  isSelected: boolean;
}

const FloorTable: React.FC<FloorTableProps> = ({ position, table, isSelected }) => {
  const {
    setSelectedTableId,
    editMode,
    updateTablePosition,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing
  } = useFloorPlan();
  const tableRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTableId(position.id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (editMode !== 'select' || isResizing) return;
    
    e.stopPropagation();
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    setIsDragging(true);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
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
        updateTablePosition({
          ...position,
          x: Math.max(0, e.clientX - dragStart.x),
          y: Math.max(0, e.clientY - dragStart.y)
        });
      } else if (isResizing && editMode === 'resize') {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        updateTablePosition({
          ...position,
          width: Math.max(50, resizeStart.width + deltaX),
          height: Math.max(50, resizeStart.height + deltaY)
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
  }, [isDragging, isResizing, dragStart, resizeStart, editMode, position, updateTablePosition, setIsDragging, setIsResizing]);

  const getStatusColor = () => {
    switch (table.status) {
      case 'available':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'occupied':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'cleaning':
        return 'bg-blue-100 border-blue-500 text-blue-700';
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
    borderRadius: position.shape === 'circle' ? '50%' : '4px',
    cursor: editMode === 'select' ? 'move' : 'default',
  };

  return (
    <div
      ref={tableRef}
      className={cn(
        'absolute flex flex-col items-center justify-center border-2 shadow-sm transition-shadow',
        getStatusColor(),
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        editMode === 'delete' && isSelected && 'ring-2 ring-red-500 ring-offset-2'
      )}
      style={style}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <span className="font-medium text-sm">{table.name}</span>
      <span className="text-xs">{table.capacity} seats</span>
      
      {isSelected && editMode === 'resize' && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default FloorTable;
