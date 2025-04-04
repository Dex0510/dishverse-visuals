
import apiClient from './api';

export interface FloorPlan {
  id: string;
  name: string;
  restaurantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Floor {
  id: string;
  name: string;
  floorPlanId: string;
  order: number;
}

export interface TablePosition {
  id: string;
  tableId: string;
  floorId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shape: 'rectangle' | 'circle' | 'custom';
}

export const getFloorPlans = async (): Promise<FloorPlan[]> => {
  try {
    const response = await apiClient.get<FloorPlan[]>('/floor-plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching floor plans:', error);
    // Return mock data for development
    return [
      {
        id: 'fp1',
        name: 'Main Restaurant',
        restaurantId: 'rest1',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }
};

export const getFloors = async (floorPlanId: string): Promise<Floor[]> => {
  try {
    const response = await apiClient.get<Floor[]>(`/floor-plans/${floorPlanId}/floors`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching floors for floor plan ${floorPlanId}:`, error);
    // Return mock data for development
    return [
      {
        id: 'f1',
        name: 'Ground Floor',
        floorPlanId,
        order: 0,
      },
      {
        id: 'f2',
        name: 'First Floor',
        floorPlanId,
        order: 1,
      }
    ];
  }
};

export const getTablePositions = async (floorId: string): Promise<TablePosition[]> => {
  try {
    const response = await apiClient.get<TablePosition[]>(`/floors/${floorId}/table-positions`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching table positions for floor ${floorId}:`, error);
    // Return mock data for development
    return [];
  }
};

export const saveTablePosition = async (tablePosition: TablePosition): Promise<TablePosition> => {
  try {
    if (tablePosition.id) {
      const response = await apiClient.put<TablePosition>(`/table-positions/${tablePosition.id}`, tablePosition);
      return response.data;
    } else {
      const response = await apiClient.post<TablePosition>('/table-positions', tablePosition);
      return response.data;
    }
  } catch (error) {
    console.error('Error saving table position:', error);
    // For development, return the input with a mock ID
    return {
      ...tablePosition,
      id: tablePosition.id || `tp-${Date.now()}`,
    };
  }
};

export const deleteTablePosition = async (tablePositionId: string): Promise<void> => {
  try {
    await apiClient.delete(`/table-positions/${tablePositionId}`);
  } catch (error) {
    console.error(`Error deleting table position ${tablePositionId}:`, error);
  }
};

export const createFloor = async (floor: Omit<Floor, 'id'>): Promise<Floor> => {
  try {
    const response = await apiClient.post<Floor>('/floors', floor);
    return response.data;
  } catch (error) {
    console.error('Error creating floor:', error);
    // For development, return the input with a mock ID
    return {
      ...floor,
      id: `floor-${Date.now()}`,
    };
  }
};
