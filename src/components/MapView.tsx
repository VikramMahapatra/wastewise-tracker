import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import GeofencePanel, { TruckData, GeofencePath } from "./GeofencePanel";

interface MapViewProps {
  selectedTruck: string | null;
}

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyBm6KoD4T-fdLkIHvxwqsQq3EPjz14V2Sw";

// Pune Kharadi area center coordinates
const KHARADI_CENTER = { lat: 18.5540, lng: 73.9425 };

const GEOFENCE_COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", 
  "#06b6d4", "#ec4899", "#14b8a6"
];

// Mock trucks with route type
const trucks: TruckData[] = [
  { 
    id: "TRK-001", 
    position: { lat: 18.5520, lng: 73.9400 }, 
    status: "moving",
    driver: "Rajesh Kumar",
    route: "Route A-12",
    routeType: "primary",
    speed: 25,
  },
  { 
    id: "TRK-002", 
    position: { lat: 18.5560, lng: 73.9450 }, 
    status: "idle",
    driver: "Amit Sharma",
    route: "Route B-05",
    routeType: "secondary",
    speed: 0,
  },
  { 
    id: "TRK-003", 
    position: { lat: 18.5500, lng: 73.9380 }, 
    status: "dumping",
    driver: "Suresh Patil",
    route: "Route C-08",
    routeType: "primary",
    speed: 0,
  },
  { 
    id: "TRK-004", 
    position: { lat: 18.5580, lng: 73.9500 }, 
    status: "moving",
    driver: "Vikram Singh",
    route: "Route A-15",
    routeType: "secondary",
    speed: 30,
  },
  { 
    id: "TRK-005", 
    position: { lat: 18.5490, lng: 73.9350 }, 
    status: "moving",
    driver: "Deepak Jadhav",
    route: "Route D-03",
    routeType: "primary",
    speed: 18,
  },
];

const containerStyle = {
  width: '100%',
  height: '100%'
};

interface LatLngLiteral {
  lat: number;
  lng: number;
}

const MapView = ({ selectedTruck: propSelectedTruck }: MapViewProps) => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<LatLngLiteral[]>([]);
  const [geofences, setGeofences] = useState<Record<string, GeofencePath>>({});
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const colorIndexRef = useRef(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "moving": return "#22c55e";
      case "idle": return "#f59e0b";
      case "dumping": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  const getNextColor = () => {
    const color = GEOFENCE_COLORS[colorIndexRef.current % GEOFENCE_COLORS.length];
    colorIndexRef.current++;
    return color;
  };

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!isDrawing || !selectedTruck) {
      setSelectedMarker(null);
      return;
    }
    
    if (e.latLng) {
      const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setCurrentPath(prev => [...prev, newPoint]);
    }
  }, [isDrawing, selectedTruck]);

  const handleSaveGeofence = useCallback(() => {
    if (!selectedTruck || currentPath.length < 2) return;
    
    // Save the geofence
    const color = geofences[selectedTruck]?.color || getNextColor();
    setGeofences(prev => ({
      ...prev,
      [selectedTruck]: {
        truckId: selectedTruck,
        path: currentPath,
        enabled: true,
        color,
      }
    }));
    
    setIsDrawing(false);
    setCurrentPath([]);
  }, [selectedTruck, currentPath, geofences]);

  const handleStartDrawing = (truckId: string) => {
    setSelectedTruck(truckId);
    setIsDrawing(true);
    setCurrentPath([]);
    
    // Center map on truck
    const truck = trucks.find(t => t.id === truckId);
    if (truck && mapRef.current) {
      mapRef.current.panTo(truck.position);
      mapRef.current.setZoom(16);
    }
  };

  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const handleToggleGeofence = (truckId: string) => {
    setGeofences(prev => ({
      ...prev,
      [truckId]: { ...prev[truckId], enabled: !prev[truckId]?.enabled }
    }));
  };

  const handleDeleteGeofence = (truckId: string) => {
    setGeofences(prev => {
      const newGeofences = { ...prev };
      delete newGeofences[truckId];
      return newGeofences;
    });
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setIsMapLoaded(true);
  }, []);

  // Use keyboard shortcut to finish drawing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawing) {
        handleCancelDrawing();
      }
      if (e.key === "Enter" && isDrawing && currentPath.length >= 2) {
        handleSaveGeofence();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawing, currentPath, handleSaveGeofence]);

  // Create marker icon only when map is loaded
  const createTruckIcon = (status: string) => {
    if (!isMapLoaded || typeof google === 'undefined') return undefined;
    return {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
      fillColor: getStatusColor(status),
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      scale: 1.5,
      anchor: new google.maps.Point(12, 22),
    };
  };

  const createPathPointIcon = () => {
    if (!isMapLoaded || typeof google === 'undefined') return undefined;
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: "#ef4444",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    };
  };

  const createPolylineOptions = (color: string) => {
    if (!isMapLoaded || typeof google === 'undefined') {
      return {
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 4,
      };
    }
    return {
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 4,
      icons: [{
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3,
        },
        offset: '100%',
        repeat: '100px'
      }]
    };
  };

  return (
    <Card className="overflow-hidden h-full">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Live Fleet Map - Kharadi, Pune</h2>
          </div>
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
        </div>
      </div>

      <div className="flex h-[calc(100%-73px)]">
        {/* Geofence Panel */}
        <div className="w-80 border-r border-border">
          <GeofencePanel
            trucks={trucks}
            geofences={geofences}
            selectedTruck={selectedTruck}
            isDrawing={isDrawing}
            currentPathLength={currentPath.length}
            onSelectTruck={setSelectedTruck}
            onStartDrawing={handleStartDrawing}
            onSaveGeofence={handleSaveGeofence}
            onCancelDrawing={handleCancelDrawing}
            onToggleGeofence={handleToggleGeofence}
            onDeleteGeofence={handleDeleteGeofence}
          />
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={KHARADI_CENTER}
              zoom={15}
              onClick={handleMapClick}
              onLoad={onMapLoad}
              options={{
                styles: [
                  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
                ],
                streetViewControl: false,
                mapTypeControl: true,
                draggableCursor: isDrawing ? "crosshair" : undefined,
              }}
            >
              {/* Saved Geofence Paths */}
              {isMapLoaded && Object.values(geofences).map((geofence) => (
                geofence.enabled && geofence.path.length > 0 && (
                  <Polyline
                    key={`geofence-${geofence.truckId}`}
                    path={geofence.path}
                    options={createPolylineOptions(geofence.color)}
                  />
                )
              ))}

              {/* Current Drawing Path */}
              {isMapLoaded && isDrawing && currentPath.length > 0 && (
                <>
                  <Polyline
                    path={currentPath}
                    options={{
                      strokeColor: "#ef4444",
                      strokeOpacity: 0.8,
                      strokeWeight: 3,
                    }}
                  />
                  {/* Path point markers */}
                  {currentPath.map((point, index) => (
                    <Marker
                      key={`path-point-${index}`}
                      position={point}
                      icon={createPathPointIcon()}
                    />
                  ))}
                </>
              )}

              {/* Truck Markers */}
              {isMapLoaded && trucks.map((truck) => (
                <Marker
                  key={truck.id}
                  position={truck.position}
                  onClick={() => setSelectedMarker(truck.id)}
                  icon={createTruckIcon(truck.status)}
                >
                  {selectedMarker === truck.id && (
                    <InfoWindow
                      position={truck.position}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-2 min-w-[180px]">
                        <h3 className="font-bold text-gray-900 mb-2">{truck.id}</h3>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p><span className="font-medium">Driver:</span> {truck.driver}</p>
                          <p><span className="font-medium">Route:</span> {truck.route}</p>
                          <p><span className="font-medium">Type:</span> {truck.routeType}</p>
                          <p><span className="font-medium">Speed:</span> {truck.speed} km/h</p>
                          <p><span className="font-medium">Status:</span> 
                            <span className={`ml-1 capitalize ${truck.status === 'moving' ? 'text-green-600' : truck.status === 'idle' ? 'text-amber-600' : 'text-blue-600'}`}>
                              {truck.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              ))}
            </GoogleMap>
          </LoadScript>

          {/* Drawing Instructions Overlay */}
          {isDrawing && (
            <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg border border-primary shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-primary">Drawing Mode Active</p>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  {currentPath.length} points
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Click on the map to add waypoints for the geofence path.
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSaveGeofence}
                  disabled={currentPath.length < 2}
                  className="flex-1"
                >
                  Save Geofence
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelDrawing}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MapView;
