import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, Circle, InfoWindow } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Navigation, Settings, MapPin, Circle as CircleIcon, MoreVertical } from "lucide-react";

interface MapViewProps {
  selectedTruck: string | null;
}

// Pune Kharadi area center coordinates
const KHARADI_CENTER = { lat: 18.5540, lng: 73.9425 };

// Mock trucks with Kharadi area coordinates
const trucks = [
  { 
    id: "TRK-001", 
    position: { lat: 18.5520, lng: 73.9400 }, 
    status: "moving",
    driver: "Rajesh Kumar",
    route: "Route A-12",
    speed: 25,
    geofence: { enabled: true, radius: 100 }
  },
  { 
    id: "TRK-002", 
    position: { lat: 18.5560, lng: 73.9450 }, 
    status: "idle",
    driver: "Amit Sharma",
    route: "Route B-05",
    speed: 0,
    geofence: { enabled: true, radius: 150 }
  },
  { 
    id: "TRK-003", 
    position: { lat: 18.5500, lng: 73.9380 }, 
    status: "dumping",
    driver: "Suresh Patil",
    route: "Route C-08",
    speed: 0,
    geofence: { enabled: false, radius: 100 }
  },
  { 
    id: "TRK-004", 
    position: { lat: 18.5580, lng: 73.9500 }, 
    status: "moving",
    driver: "Vikram Singh",
    route: "Route A-15",
    speed: 30,
    geofence: { enabled: true, radius: 200 }
  },
  { 
    id: "TRK-005", 
    position: { lat: 18.5490, lng: 73.9350 }, 
    status: "moving",
    driver: "Deepak Jadhav",
    route: "Route D-03",
    speed: 18,
    geofence: { enabled: false, radius: 100 }
  },
];

const containerStyle = {
  width: '100%',
  height: '500px'
};

// Separate component for the actual Google Map (only renders when API key is set)
const GoogleMapContent = ({ selectedTruck, apiKey }: { selectedTruck: string | null; apiKey: string }) => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [truckGeofences, setTruckGeofences] = useState<Record<string, { enabled: boolean; radius: number }>>(
    trucks.reduce((acc, truck) => ({ ...acc, [truck.id]: truck.geofence }), {})
  );
  const [editingGeofence, setEditingGeofence] = useState<{ truckId: string; radius: number } | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "moving": return "#22c55e";
      case "idle": return "#f59e0b";
      case "dumping": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  const getMarkerIcon = (status: string, isSelected: boolean) => {
    const color = getStatusColor(status);
    const scale = isSelected ? 1.3 : 1;
    return {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: "#ffffff",
      scale: scale,
      anchor: { x: 12, y: 22 } as google.maps.Point,
    };
  };

  const handleToggleGeofence = (truckId: string) => {
    setTruckGeofences(prev => ({
      ...prev,
      [truckId]: { ...prev[truckId], enabled: !prev[truckId].enabled }
    }));
  };

  const handleSetGeofenceRadius = (truckId: string, radius: number) => {
    setTruckGeofences(prev => ({
      ...prev,
      [truckId]: { ...prev[truckId], radius, enabled: true }
    }));
    setEditingGeofence(null);
  };

  const onMapClick = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  if (loadError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[500px]">
        <p className="text-destructive">Error loading Google Maps. Please check your API key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-8 flex items-center justify-center h-[500px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={KHARADI_CENTER}
        zoom={15}
        onClick={onMapClick}
        options={{
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
          ],
          streetViewControl: false,
          mapTypeControl: true,
        }}
      >
        {trucks.map((truck) => (
          <div key={truck.id}>
            {truckGeofences[truck.id]?.enabled && (
              <Circle
                center={truck.position}
                radius={truckGeofences[truck.id].radius}
                options={{
                  fillColor: getStatusColor(truck.status),
                  fillOpacity: 0.15,
                  strokeColor: getStatusColor(truck.status),
                  strokeOpacity: 0.5,
                  strokeWeight: 2,
                }}
              />
            )}
            
            <Marker
              position={truck.position}
              icon={getMarkerIcon(truck.status, selectedTruck === truck.id)}
              onClick={() => setSelectedMarker(truck.id)}
              animation={truck.status === "moving" ? google.maps.Animation.BOUNCE : undefined}
            />

            {selectedMarker === truck.id && (
              <InfoWindow
                position={truck.position}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{truck.id}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleToggleGeofence(truck.id)}>
                          <CircleIcon className="h-4 w-4 mr-2" />
                          {truckGeofences[truck.id]?.enabled ? 'Disable' : 'Enable'} Geofence
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingGeofence({ truckId: truck.id, radius: truckGeofences[truck.id]?.radius || 100 })}>
                          <Settings className="h-4 w-4 mr-2" />
                          Set Geofence Radius
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="font-medium">Driver:</span> {truck.driver}</p>
                    <p><span className="font-medium">Route:</span> {truck.route}</p>
                    <p><span className="font-medium">Speed:</span> {truck.speed} km/h</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-1 capitalize ${truck.status === 'moving' ? 'text-green-600' : truck.status === 'idle' ? 'text-amber-600' : 'text-blue-600'}`}>
                        {truck.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Geofence:</span> 
                      <span className={`ml-1 ${truckGeofences[truck.id]?.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                        {truckGeofences[truck.id]?.enabled ? `${truckGeofences[truck.id].radius}m` : 'Disabled'}
                      </span>
                    </p>
                  </div>
                </div>
              </InfoWindow>
            )}
          </div>
        ))}
      </GoogleMap>

      <Dialog open={!!editingGeofence} onOpenChange={() => setEditingGeofence(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Geofence Radius - {editingGeofence?.truckId}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Radius (meters)</Label>
              <Input
                type="number"
                min={20}
                max={500}
                value={editingGeofence?.radius || 100}
                onChange={(e) => setEditingGeofence(prev => prev ? { ...prev, radius: parseInt(e.target.value) || 100 } : null)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Recommended: 20-50m for pickup points</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingGeofence(null)}>Cancel</Button>
              <Button onClick={() => editingGeofence && handleSetGeofenceRadius(editingGeofence.truckId, editingGeofence.radius)}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main MapView component with API key management
const MapView = ({ selectedTruck }: MapViewProps) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const [tempApiKey, setTempApiKey] = useState('');

  const handleSaveApiKey = () => {
    localStorage.setItem('googleMapsApiKey', tempApiKey);
    setApiKey(tempApiKey);
    // Force page reload to reinitialize Google Maps with new key
    window.location.reload();
  };

  const handleResetApiKey = () => {
    localStorage.removeItem('googleMapsApiKey');
    window.location.reload();
  };

  // Show API key input if not set
  if (!apiKey) {
    return (
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Live Fleet Map</h2>
          </div>
        </div>
        <div className="p-8 flex flex-col items-center justify-center h-[500px] bg-muted/10">
          <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Google Maps API Key Required</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Enter your Google Maps API key to display the live fleet map. You can get one from the 
            <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
              Google Cloud Console
            </a>
          </p>
          <div className="flex gap-2 w-full max-w-md">
            <Input
              type="password"
              placeholder="Enter Google Maps API Key"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveApiKey} disabled={!tempApiKey}>
              Save Key
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Live Fleet Map - Kharadi, Pune</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-muted-foreground">Moving</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-warning" />
                <span className="text-xs text-muted-foreground">Idle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-1" />
                <span className="text-xs text-muted-foreground">Dumping</span>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Map Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Google Maps API Key</Label>
                    <p className="text-xs text-muted-foreground mb-2">Current key is saved. Enter a new key to update.</p>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="Enter new API Key"
                      />
                      <Button onClick={handleSaveApiKey} disabled={!tempApiKey}>Update</Button>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={handleResetApiKey}>
                    Reset API Key
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <GoogleMapContent selectedTruck={selectedTruck} apiKey={apiKey} />
    </Card>
  );
};

export default MapView;
