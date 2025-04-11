
import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { Table } from '@/services/tableService';
import { TablePosition, Floor } from '@/services/floorPlanService';
import { FurnitureItem, Zone } from '@/models/furniture';

export type EditorMode = 'select' | 'add_table' | 'add_furniture' | 'add_zone' | 'resize' | 'delete' | 'simulate';

interface FloorPlanContextValue {
  activeFloorId: string | null;
  setActiveFloorId: (id: string | null) => void;
  floors: Floor[];
  setFloors: (floors: Floor[]) => void;
  tables: Table[];
  setTables: (tables: Table[]) => void;
  tablePositions: TablePosition[];
  setTablePositions: (positions: TablePosition[]) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  selectedItemType: 'table' | 'furniture' | 'zone' | null;
  setSelectedItemType: (type: 'table' | 'furniture' | 'zone' | null) => void;
  editMode: EditorMode;
  setEditMode: (mode: EditorMode) => void;
  addTablePosition: (position: TablePosition) => void;
  updateTablePosition: (position: TablePosition) => void;
  removeTablePosition: (id: string) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
  furniture: FurnitureItem[];
  setFurniture: (furniture: FurnitureItem[]) => void;
  furniturePositions: Array<{id: string, furnitureId: string, x: number, y: number, width: number, height: number, rotation: number, floorId: string}>;
  setFurniturePositions: (positions: Array<{id: string, furnitureId: string, x: number, y: number, width: number, height: number, rotation: number, floorId: string}>) => void;
  addFurniturePosition: (position: {id: string, furnitureId: string, x: number, y: number, width: number, height: number, rotation: number, floorId: string}) => void;
  updateFurniturePosition: (position: {id: string, furnitureId: string, x: number, y: number, width: number, height: number, rotation: number, floorId: string}) => void;
  removeFurniturePosition: (id: string) => void;
  zones: Zone[];
  setZones: (zones: Zone[]) => void;
  addZone: (zone: Zone) => void;
  updateZone: (zone: Zone) => void;
  removeZone: (id: string) => void;
  selectedFurnitureType: string | null;
  setSelectedFurnitureType: (id: string | null) => void;
  isSimulating: boolean;
  setIsSimulating: (isSimulating: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  showGrid: boolean;
  setShowGrid: (showGrid: boolean) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snapToGrid: boolean) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
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
  selectedItemId: null,
  setSelectedItemId: () => {},
  selectedItemType: null,
  setSelectedItemType: () => {},
  editMode: 'select',
  setEditMode: () => {},
  addTablePosition: () => {},
  updateTablePosition: () => {},
  removeTablePosition: () => {},
  isDragging: false,
  setIsDragging: () => {},
  isResizing: false,
  setIsResizing: () => {},
  furniture: [],
  setFurniture: () => {},
  furniturePositions: [],
  setFurniturePositions: () => {},
  addFurniturePosition: () => {},
  updateFurniturePosition: () => {},
  removeFurniturePosition: () => {},
  zones: [],
  setZones: () => {},
  addZone: () => {},
  updateZone: () => {},
  removeZone: () => {},
  selectedFurnitureType: null,
  setSelectedFurnitureType: () => {},
  isSimulating: false,
  setIsSimulating: () => {},
  simulationSpeed: 1,
  setSimulationSpeed: () => {},
  showGrid: true,
  setShowGrid: () => {},
  snapToGrid: false,
  setSnapToGrid: () => {},
  gridSize: 20,
  setGridSize: () => {},
  zoomLevel: 1,
  setZoomLevel: () => {},
});

export const FloorPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeFloorId, setActiveFloorId] = useState<string | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [tablePositions, setTablePositions] = useState<TablePosition[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'table' | 'furniture' | 'zone' | null>(null);
  const [editMode, setEditMode] = useState<EditorMode>('select');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [furniturePositions, setFurniturePositions] = useState<Array<{id: string, furnitureId: string, x: number, y: number, width: number, height: number, rotation: number, floorId: string}>>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedFurnitureType, setSelectedFurnitureType] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [zoomLevel, setZoomLevel] = useState(1);

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

  const addFurniturePosition = useCallback((position: {id: string, furnitureId: string, x: number, y: number, width: number, height: number, rotation: number, floorId: string}) => {
    setFurniturePositions(prev => [...prev, position]);
  }, []);

  const updateFurniturePosition = useCallback((position: {id: string, furnitureId: string, x: number, y: number, width: number, height: number, rotation: number, floorId: string}) => {
    setFurniturePositions(prev => 
      prev.map(pos => pos.id === position.id ? position : pos)
    );
  }, []);

  const removeFurniturePosition = useCallback((id: string) => {
    setFurniturePositions(prev => prev.filter(pos => pos.id !== id));
  }, []);

  const addZone = useCallback((zone: Zone) => {
    setZones(prev => [...prev, zone]);
  }, []);

  const updateZone = useCallback((zone: Zone) => {
    setZones(prev => 
      prev.map(z => z.id === zone.id ? zone : z)
    );
  }, []);

  const removeZone = useCallback((id: string) => {
    setZones(prev => prev.filter(zone => zone.id !== id));
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
    selectedItemId,
    setSelectedItemId,
    selectedItemType,
    setSelectedItemType,
    editMode,
    setEditMode,
    addTablePosition,
    updateTablePosition,
    removeTablePosition,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    furniture,
    setFurniture,
    furniturePositions,
    setFurniturePositions,
    addFurniturePosition,
    updateFurniturePosition,
    removeFurniturePosition,
    zones,
    setZones,
    addZone,
    updateZone,
    removeZone,
    selectedFurnitureType,
    setSelectedFurnitureType,
    isSimulating,
    setIsSimulating,
    simulationSpeed,
    setSimulationSpeed,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    gridSize,
    setGridSize,
    zoomLevel,
    setZoomLevel
  }), [
    activeFloorId,
    floors,
    tables,
    tablePositions,
    selectedItemId,
    selectedItemType,
    editMode,
    addTablePosition,
    updateTablePosition,
    removeTablePosition,
    isDragging,
    isResizing,
    furniture,
    furniturePositions,
    addFurniturePosition,
    updateFurniturePosition,
    removeFurniturePosition,
    zones,
    addZone,
    updateZone,
    removeZone,
    selectedFurnitureType,
    isSimulating,
    simulationSpeed,
    showGrid,
    snapToGrid,
    gridSize,
    zoomLevel
  ]);

  return (
    <FloorPlanContext.Provider value={value}>
      {children}
    </FloorPlanContext.Provider>
  );
};

export const useFloorPlan = () => useContext(FloorPlanContext);
