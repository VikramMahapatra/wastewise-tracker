import { useState, useCallback, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Navigation } from "lucide-react";
import { trucks as fleetTrucks, GOOGLE_MAPS_API_KEY, KHARADI_CENTER } from "@/data/fleetData";
import { createTruckMarkerIcon } from "./TruckIcon";

interface MapViewProps {
  selectedTruck: string | null;
}

// Transform fleet data for map display
const trucks = fleetTrucks.map(t => ({
  id: t.id,
  position: t.position,
  status: t.status as "moving" | "idle" | "dumping",
  driver: t.driver,
  route: t.route,
  routeType: t.truckType as "primary" | "secondary",
  speed: t.speed,
}));

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
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapClick = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setIsMapLoaded(true);
  }, []);


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

      <div className="h-[calc(100%-73px)]">
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
            }}
          >

            {/* Truck Markers */}
            {isMapLoaded && trucks.map((truck) => (
              <Marker
                key={truck.id}
                position={truck.position}
                onClick={() => setSelectedMarker(truck.id)}
                icon={{
                  url: createTruckMarkerIcon(truck.status as any, truck.routeType as any),
                  scaledSize: new google.maps.Size(40, 48),
                  anchor: new google.maps.Point(20, 48),
                }}
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
      </div>
    </Card>
  );
};

export default MapView;
