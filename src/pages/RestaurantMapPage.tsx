
import React from 'react';
import { FloorPlanProvider } from '@/contexts/FloorPlanContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { RestaurantMapContent } from '@/components/FloorMap/RestaurantMap';

const RestaurantMapPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/tables')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold ml-2">Restaurant Floor Plan Editor</h1>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <FloorPlanProvider>
          <RestaurantMapContent onClose={() => navigate('/tables')} />
        </FloorPlanProvider>
      </div>
    </div>
  );
};

export default RestaurantMapPage;
