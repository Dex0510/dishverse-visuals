
import { FurnitureItem } from "@/models/furniture";

export const furnitureLibrary: FurnitureItem[] = [
  // Tables
  {
    id: 'table_round_small',
    type: 'table_round',
    name: 'Small Round Table',
    description: 'A small round table for 2-3 people',
    width: 80,
    height: 80,
    icon: 'CircleIcon',
    category: 'seating',
    isResizable: true,
    isRotatable: false,
    capacity: 2,
    minWidth: 60,
    minHeight: 60,
    maxWidth: 100,
    maxHeight: 100
  },
  {
    id: 'table_round_medium',
    type: 'table_round',
    name: 'Medium Round Table',
    description: 'A medium round table for 4 people',
    width: 100,
    height: 100,
    icon: 'CircleIcon',
    category: 'seating',
    isResizable: true,
    isRotatable: false,
    capacity: 4,
    minWidth: 80,
    minHeight: 80,
    maxWidth: 120,
    maxHeight: 120
  },
  {
    id: 'table_square_small',
    type: 'table_square',
    name: 'Small Square Table',
    description: 'A small square table for 2 people',
    width: 70,
    height: 70,
    icon: 'SquareIcon',
    category: 'seating',
    isResizable: true,
    isRotatable: true,
    capacity: 2,
    minWidth: 60,
    minHeight: 60
  },
  {
    id: 'table_rectangle_medium',
    type: 'table_rectangle',
    name: 'Medium Rectangle Table',
    description: 'A medium rectangle table for 4 people',
    width: 120,
    height: 80,
    icon: 'RectangleHorizontalIcon',
    category: 'seating',
    isResizable: true,
    isRotatable: true,
    capacity: 4,
    minWidth: 100,
    minHeight: 70
  },
  {
    id: 'table_rectangle_large',
    type: 'table_rectangle',
    name: 'Large Rectangle Table',
    description: 'A large rectangle table for 6-8 people',
    width: 180,
    height: 90,
    icon: 'RectangleHorizontalIcon',
    category: 'seating',
    isResizable: true,
    isRotatable: true,
    capacity: 8,
    minWidth: 150,
    minHeight: 80
  },
  
  // Chairs
  {
    id: 'chair_standard',
    type: 'chair',
    name: 'Standard Chair',
    description: 'A standard dining chair',
    width: 40,
    height: 40,
    icon: 'CircleIcon',
    category: 'seating',
    isResizable: false,
    isRotatable: true,
    capacity: 1
  },
  {
    id: 'barstool',
    type: 'barstool',
    name: 'Barstool',
    description: 'A barstool for bar counters',
    width: 35,
    height: 35,
    icon: 'CircleIcon',
    category: 'seating',
    isResizable: false,
    isRotatable: false,
    capacity: 1
  },
  
  // Structural elements
  {
    id: 'wall_standard',
    type: 'wall',
    name: 'Wall',
    description: 'A standard wall',
    width: 200,
    height: 20,
    icon: 'RectangleHorizontalIcon',
    category: 'structural',
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'door_standard',
    type: 'door',
    name: 'Door',
    description: 'A standard door',
    width: 80,
    height: 20,
    icon: 'DoorIcon',
    category: 'structural',
    isResizable: false,
    isRotatable: true
  },
  {
    id: 'window_standard',
    type: 'window',
    name: 'Window',
    description: 'A standard window',
    width: 120,
    height: 10,
    icon: 'GanttChartSquareIcon',
    category: 'structural',
    isResizable: true,
    isRotatable: true
  },
  
  // Service equipment
  {
    id: 'pos_terminal',
    type: 'pos_terminal',
    name: 'POS Terminal',
    description: 'A point of sale terminal',
    width: 60,
    height: 60,
    icon: 'MonitorIcon',
    category: 'service',
    isResizable: false,
    isRotatable: true
  },
  {
    id: 'counter',
    type: 'counter',
    name: 'Counter',
    description: 'A service counter',
    width: 200,
    height: 60,
    icon: 'RectangleHorizontalIcon',
    category: 'service',
    isResizable: true,
    isRotatable: true
  },
  {
    id: 'waiting_area',
    type: 'waiting_area',
    name: 'Waiting Area',
    description: 'A waiting area with seats',
    width: 150,
    height: 150,
    icon: 'SofaIcon',
    category: 'seating',
    isResizable: true,
    isRotatable: true,
    capacity: 6
  },
  
  // Kitchen elements
  {
    id: 'kitchen_station',
    type: 'kitchen_station',
    name: 'Kitchen Station',
    description: 'A kitchen prep station',
    width: 120,
    height: 80,
    icon: 'CookingPotIcon',
    category: 'equipment',
    isResizable: true,
    isRotatable: true
  },
  
  // Decor
  {
    id: 'plant',
    type: 'plant',
    name: 'Plant',
    description: 'A decorative plant',
    width: 50,
    height: 50,
    icon: 'LeafIcon',
    category: 'decor',
    isResizable: true,
    isRotatable: false
  }
];

export const getItemById = (id: string): FurnitureItem | undefined => {
  return furnitureLibrary.find(item => item.id === id);
};

export const getItemsByCategory = (category: FurnitureItem['category']): FurnitureItem[] => {
  return furnitureLibrary.filter(item => item.category === category);
};

export const getAllCategories = (): FurnitureItem['category'][] => {
  return [...new Set(furnitureLibrary.map(item => item.category))];
};
