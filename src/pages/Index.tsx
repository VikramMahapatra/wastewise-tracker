import { useState } from "react";
import FleetStats from "@/components/FleetStats";
import MapView from "@/components/MapView";
import TruckList from "@/components/TruckList";
import AlertsPanel from "@/components/AlertsPanel";

const Index = () => {
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <FleetStats />
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MapView selectedTruck={selectedTruck} />
          <AlertsPanel />
        </div>
        
        <div>
          <TruckList onSelectTruck={setSelectedTruck} selectedTruck={selectedTruck} />
        </div>
      </div>
    </div>
  );
};

export default Index;
