
import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { Table } from '@/services/tableService';
import { TablePosition, Floor } from '@/services/floorPlanService';

export type EditorMode = 'select' | 'add' | 'resize' | 'delete';

interface FloorPlanContextValue {
  activeFloorId: string | null;
  setActiveFloorId: (id: string | null) => void;
  floors: Floor[];
  setFloors: (floors: Floor[]) => void;
  tables: Table[];
  setTables: (tables: Table[]) => void;
  tablePositions: TablePosition[];
  setTablePositions: (positions: TablePosition[]) => void;
  selectedTableId: string | null;
  setSelectedTableId: (id: string | null) => void;
  editMode: EditorMode;
  setEditMode: (mode: EditorMode) => void;
  addTablePosition: (position: TablePosition) => void;
  updateTablePosition: (position: TablePosition) => void;
  removeTablePosition: (id: string) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
}

const FloorPlanContext = createContext<FloorPlanContextValue>({
  activeFloorId: null,
  setActiveFloorId: () => {},
  floors: [],
  setFloors: () => {},
  tables: [],
  setTables: () => {},
  tablePositions: [],
  setTablePositions: () => {},
  selectedTableId: null,
  setSelectedTableId: () => {},
  editMode: 'select',
  setEditMode: () => {},
  addTablePosition: () => {},
  updateTablePosition: () => {},
  removeTablePosition: () => {},
  isDragging: false,
  setIsDragging: () => {},
  isResizing: false,
  setIsResizing: () => {},
});

export const FloorPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeFloorId, setActiveFloorId] = useState<string | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [tablePositions, setTablePositions] = useState<TablePosition[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<EditorMode>('select');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const addTablePosition = useCallback((position: TablePosition) => {
    setTablePositions(prev => [...prev, position]);
  }, []);

  const updateTablePosition = useCallback((position: TablePosition) => {
    setTablePositions(prev => 
      prev.map(pos => pos.id === position.id ? position : pos)
    );
  }, []);

  const removeTablePosition = useCallback((id: string) => {
    setTablePositions(prev => prev.filter(pos => pos.id !== id));
  }, []);

  const value = useMemo(() => ({
    activeFloorId,
    setActiveFloorId,
    floors,
    setFloors,
    tables,
    setTables,
    tablePositions,
    setTablePositions,
    selectedTableId,
    setSelectedTableId,
    editMode,
    setEditMode,
    addTablePosition,
    updateTablePosition,
    removeTablePosition,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
  }), [
    activeFloorId,
    floors,
    tables,
    tablePositions,
    selectedTableId,
    editMode,
    addTablePosition,
    updateTablePosition,
    removeTablePosition,
    isDragging,
    isResizing
  ]);

  return (
    <FloorPlanContext.Provider value={value}>
      {children}
    </FloorPlanContext.Provider>
  );
};

export const useFloorPlan = () => useContext(FloorPlanContext);
