
import React, { useState } from 'react';
import { Users, BellRing, Clock } from 'lucide-react';
import { Table } from '@/services/tableService';
import { WaitlistEntry } from '@/services/waitlistService';

interface SmartTableMapProps {
  tables: Table[];
  activeWaitlist: WaitlistEntry[];
}

const SmartTableMap: React.FC<SmartTableMapProps> = ({ tables, activeWaitlist }) => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  
  // Group tables by section
  const tablesBySection = tables.reduce((acc, table) => {
    if (!acc[table.section]) {
      acc[table.section] = [];
    }
    acc[table.section].push(table);
    return acc;
  }, {} as Record<string, Table[]>);
  
  // Get status color
  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'occupied':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'cleaning':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };
  
  // Find suitable waiting party for a specific table
  const findWaitingParty = (table: Table) => {
    if (table.status !== 'available') return null;
    
    return activeWaitlist.find(entry => {
      // Check if party size fits the table (not too big, not too small)
      const sizeMatches = entry.partySize <= table.capacity && entry.partySize >= table.capacity - 2;
      
      // Check if table matches preference (if specified)
      const preferenceMatches = !entry.tablePreference || 
        table.section.toLowerCase().includes(entry.tablePreference.toLowerCase());
        
      return sizeMatches && preferenceMatches;
    });
  };
  
  // Approximate wait time estimation
  const getEstimatedTimeForTable = (table: Table) => {
    if (table.status === 'available') return 0;
    
    // Very basic estimation - in a real app this would use more sophisticated logic
    switch (table.status) {
      case 'occupied':
        return 20; // Average dining time remaining in minutes
      case 'reserved':
        return 10; // Time until reservation
      case 'cleaning':
        return 5; // Cleaning time
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(tablesBySection).map(([section, sectionTables]) => (
        <div key={section} className="space-y-2">
          <h3 className="font-medium text-lg">{section}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sectionTables.map(table => {
              const waitingParty = findWaitingParty(table);
              const estimatedTime = getEstimatedTimeForTable(table);
              
              return (
                <div 
                  key={table.id}
                  className={`relative p-3 rounded-md border-2 ${getStatusColor(table.status)} 
                    hover:shadow-md transition-shadow cursor-pointer h-32 flex flex-col justify-between`}
                  onClick={() => setSelectedTable(table.id === selectedTable?.id ? null : table)}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{table.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white">
                      {table.capacity} seats
                    </span>
                  </div>
                  
                  <div className="mt-2 text-xs">
                    <div className="capitalize">
                      Status: <span className="font-medium">{table.status}</span>
                    </div>
                    
                    {table.status !== 'available' && (
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>~{estimatedTime} min remaining</span>
                      </div>
                    )}
                    
                    {table.status === 'available' && waitingParty && (
                      <div className="mt-1 flex items-center text-green-700">
                        <BellRing className="h-3 w-3 mr-1" />
                        <span>Suggested: Party of {waitingParty.partySize}</span>
                      </div>
                    )}
                  </div>
                  
                  {table.id === selectedTable?.id && (
                    <div className="absolute inset-0 bg-black/5 rounded-md flex items-center justify-center">
                      <div className="bg-white p-2 rounded-md shadow-lg text-xs">
                        Click to interact
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {Object.keys(tablesBySection).length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No tables available to display
        </div>
      )}
    </div>
  );
};

export default SmartTableMap;
