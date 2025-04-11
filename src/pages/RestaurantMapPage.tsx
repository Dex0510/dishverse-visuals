
import React, { useState } from 'react';
import { FloorPlanProvider } from '@/contexts/FloorPlanContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronRight, Layers, Settings } from 'lucide-react';
import { RestaurantMapContent } from '@/components/FloorMap/RestaurantMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SmartTableMap from '@/components/SmartTableMap';
import { useEffect } from 'react';
import { getTables } from '@/services/tableService';
import { Table } from '@/services/tableService';
import { getWaitlistEntries } from '@/services/waitlistService';
import { WaitlistEntry } from '@/services/waitlistService';
import { toast } from 'sonner';

const RestaurantMapPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("designer");
  const [tables, setTables] = useState<Table[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load tables
        const tablesData = await getTables();
        setTables(tablesData);
        
        // Load waitlist
        const waitlistData = await getWaitlistEntries();
        setWaitlist(waitlistData.filter(entry => entry.status === 'waiting'));
      } catch (error) {
        console.error("Failed to load restaurant data:", error);
        toast.error("Failed to load restaurant data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Set up polling for live updates every 30 seconds
    const intervalId = setInterval(loadData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/tables')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold ml-2">Restaurant Floor Plan</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-4">
          <TabsList>
            <TabsTrigger value="designer">
              <Layers className="h-4 w-4 mr-2" />
              Designer
            </TabsTrigger>
            <TabsTrigger value="live">
              <div className="relative">
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                Live View
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="space-y-4 py-4">
              <h3 className="text-lg font-medium">Floor Plan Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure visualization preferences and integrations for your restaurant floor plan.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex flex-col space-y-2">
                  <h4 className="font-medium">Display Options</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">Table Numbers</Button>
                    <Button variant="outline" size="sm">Server Zones</Button>
                    <Button variant="outline" size="sm">Order Status</Button>
                    <Button variant="outline" size="sm">Wait Times</Button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h4 className="font-medium mb-2">Simulation Speed</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Slow</span>
                    <input type="range" className="flex-1" min="1" max="5" defaultValue="3" />
                    <span className="text-sm">Fast</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" onClick={() => toast.success("Settings saved")}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "designer" ? (
          <FloorPlanProvider>
            <RestaurantMapContent onClose={() => navigate('/tables')} />
          </FloorPlanProvider>
        ) : (
          <div className="p-4 h-full overflow-auto">
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
              <h2 className="text-lg font-medium mb-2">Live Restaurant View</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time status of tables, orders, and waitlist. This view automatically updates every 30 seconds.
              </p>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <SmartTableMap tables={tables} activeWaitlist={waitlist} />
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-medium flex items-center justify-between">
                  <span>Current Occupancy</span>
                  <span className="text-green-600 text-sm">
                    {tables.filter(t => t.status === 'occupied').length} / {tables.length} Tables
                  </span>
                </h3>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${(tables.filter(t => t.status === 'occupied').length / tables.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-medium flex items-center justify-between">
                  <span>Waitlist</span>
                  <span className="text-yellow-600 text-sm">{waitlist.length} Parties</span>
                </h3>
                <div className="mt-2">
                  {waitlist.slice(0, 3).map(entry => (
                    <div key={entry.id} className="text-sm flex justify-between items-center py-1">
                      <span>{entry.customerName} ({entry.partySize})</span>
                      <span className="text-xs">{entry.waitTime}m</span>
                    </div>
                  ))}
                  {waitlist.length > 3 && (
                    <Button variant="ghost" size="sm" className="w-full mt-1 text-xs" onClick={() => navigate('/waitlist')}>
                      View All <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-medium">Kitchen Status</h3>
                <div className="mt-2 space-y-1">
                  <div className="text-sm flex justify-between">
                    <span>Orders in Progress</span>
                    <span>12</span>
                  </div>
                  <div className="text-sm flex justify-between">
                    <span>Avg Preparation Time</span>
                    <span>14m</span>
                  </div>
                  <div className="text-sm flex justify-between">
                    <span>Rush Orders</span>
                    <span className="text-red-500">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMapPage;
