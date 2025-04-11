
import React, { useState, useEffect } from 'react';
import { Table } from '@/services/tableService';
import { WaitlistEntry } from '@/services/waitlistService';
import { useWebSocketData } from '@/hooks/useWebSocketData';

interface SmartTableMapProps {
  tables: Table[];
  activeWaitlist: WaitlistEntry[];
}

const SmartTableMap: React.FC<SmartTableMapProps> = ({ tables: initialTables, activeWaitlist }) => {
  // Use WebSocketData hook to get real-time table updates
  const tables = useWebSocketData<Table[]>('table_status_update', initialTables);
  
  return (
    <div className="grid grid-cols-3 gap-2">
      {tables.map((table) => (
        <div key={table.id} className="border p-2 rounded-md shadow-sm">
          <h3 className="font-semibold">{table.name}</h3>
          <p className="text-sm">Capacity: {table.capacity}</p>
          <p className={`text-sm font-medium ${
            table.status === 'available' ? 'text-green-500' :
            table.status === 'occupied' ? 'text-red-500' :
            table.status === 'reserved' ? 'text-yellow-500' :
            'text-gray-500'
          }`}>
            Status: {table.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SmartTableMap;
