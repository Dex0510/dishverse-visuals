
export type FurnitureType = 
  | 'table_round' 
  | 'table_square' 
  | 'table_rectangle' 
  | 'chair' 
  | 'barstool' 
  | 'sofa' 
  | 'bench' 
  | 'pos_terminal' 
  | 'wall' 
  | 'door' 
  | 'window' 
  | 'plant' 
  | 'counter' 
  | 'waiting_area' 
  | 'kitchen_station';

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  name: string;
  description: string;
  width: number;
  height: number;
  color?: string;
  icon: string; // Icon name from lucide-react
  defaultRotation?: number;
  category: 'seating' | 'structural' | 'decor' | 'service' | 'equipment';
  isResizable: boolean;
  isRotatable: boolean;
  capacity?: number; // For seating items
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export type ZoneType = 'dining' | 'bar' | 'kitchen' | 'waiting' | 'entrance' | 'outdoor' | 'private' | 'custom';

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  color: string;
  opacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  furniture: string[]; // IDs of furniture items in this zone
}

export interface FloorPlanTheme {
  id: string;
  name: string;
  backgroundImage?: string;
  backgroundColor: string;
  gridColor: string;
  gridOpacity: number;
  wallColor: string;
  primaryColor: string;
  secondaryColor: string;
}
