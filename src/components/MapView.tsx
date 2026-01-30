import { useState, useCallback, useRef, useMemo } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Navigation, Filter, X } from "lucide-react";
import { trucks as fleetTrucks, GOOGLE_MAPS_API_KEY, KHARADI_CENTER } from "@/data/fleetData";
import { mockZones, mockWards, mockVendors, mockTrucks } from "@/data/masterData";
import { createTruckMarkerIcon } from "./TruckIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MapViewProps {
  selectedTruck: string | null;
}

// Transform fleet data for map display with additional metadata
const trucks = fleetTrucks.map(t => {
  // Find truck master data to get vendor and type info
  const truckMaster = mockTrucks.find(mt => mt.registrationNumber.replace(/\s/g, '-') === t.truckNumber.replace(/\s/g, '-'));
  
  return {
    id: t.id,
    position: t.position,
    status: t.status as "moving" | "idle" | "dumping" | "offline" | "breakdown",
    driver: t.driver,
    route: t.route,
    routeType: t.truckType as "primary" | "secondary",
    speed: t.speed,
    vendorId: t.vendorId || truckMaster?.vendorId,
    vehicleType: truckMaster?.type || "compactor",
    // Mock zone/ward assignment based on route
    zoneId: "ZN003", // Default to East Zone (Kharadi area)
    wardId: "WD001", // Default to Kharadi ward
  };
});

const containerStyle = {
  width: '100%',
  height: '100%'
};

const MapView = ({ selectedTruck: propSelectedTruck }: MapViewProps) => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Filter states
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<string>("all");

  // Get unique vehicle types
  const vehicleTypes = useMemo(() => {
    const types = new Set(mockTrucks.map(t => t.type));
    return Array.from(types);
  }, []);

  // Filter wards based on selected zone
  const filteredWards = useMemo(() => {
    if (selectedZone === "all") return mockWards;
    return mockWards.filter(w => w.zoneId === selectedZone);
  }, [selectedZone]);

  // Apply filters to trucks
  const filteredTrucks = useMemo(() => {
    return trucks.filter(truck => {
      if (selectedZone !== "all" && truck.zoneId !== selectedZone) return false;
      if (selectedWard !== "all" && truck.wardId !== selectedWard) return false;
      if (selectedVehicleType !== "all" && truck.vehicleType !== selectedVehicleType) return false;
      if (selectedVendor !== "all" && truck.vendorId !== selectedVendor) return false;
      return true;
    });
  }, [selectedZone, selectedWard, selectedVehicleType, selectedVendor]);

  // Calculate status counts from filtered trucks
  const statusCounts = useMemo(() => {
    return {
      moving: filteredTrucks.filter(t => t.status === "moving").length,
      idle: filteredTrucks.filter(t => t.status === "idle").length,
      dumping: filteredTrucks.filter(t => t.status === "dumping").length,
      offline: filteredTrucks.filter(t => t.status === "offline").length,
      total: filteredTrucks.length,
    };
  }, [filteredTrucks]);

  // Check if any filter is active
  const hasActiveFilters = selectedZone !== "all" || selectedWard !== "all" || 
                           selectedVehicleType !== "all" || selectedVendor !== "all";

  const clearAllFilters = () => {
    setSelectedZone("all");
    setSelectedWard("all");
    setSelectedVehicleType("all");
    setSelectedVendor("all");
  };

  const handleMapClick = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setIsMapLoaded(true);
  }, []);

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Live Fleet Map - Kharadi, Pune</h2>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 text-xs">
              <X className="h-3 w-3 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          
          <Select value={selectedZone} onValueChange={(val) => { setSelectedZone(val); setSelectedWard("all"); }}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {mockZones.filter(z => z.status === 'active').map(zone => (
                <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedWard} onValueChange={setSelectedWard}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="Ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards</SelectItem>
              {filteredWards.filter(w => w.status === 'active').map(ward => (
                <SelectItem key={ward.id} value={ward.id}>{ward.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedVehicleType} onValueChange={setSelectedVehicleType}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {vehicleTypes.map(type => (
                <SelectItem key={type} value={type} className="capitalize">{type.replace('-', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedVendor} onValueChange={setSelectedVendor}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="Vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              {mockVendors.filter(v => v.status === 'active').map(vendor => (
                <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Map Container */}
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
            }}
          >
            {/* Truck Markers */}
            {isMapLoaded && filteredTrucks.map((truck) => (
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
                        <p><span className="font-medium">Vehicle:</span> <span className="capitalize">{truck.vehicleType.replace('-', ' ')}</span></p>
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

        {/* Status Overlay */}
        <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm rounded-lg border border-border shadow-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted-foreground">Fleet Status</span>
            <Badge variant="outline" className="text-xs h-5">
              {statusCounts.total} trucks
            </Badge>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-muted-foreground">Moving</span>
              </div>
              <span className="text-sm font-semibold text-success">{statusCounts.moving}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-warning" />
                <span className="text-xs text-muted-foreground">Idle</span>
              </div>
              <span className="text-sm font-semibold text-warning">{statusCounts.idle}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-chart-1" />
                <span className="text-xs text-muted-foreground">Dumping</span>
              </div>
              <span className="text-sm font-semibold text-chart-1">{statusCounts.dumping}</span>
            </div>
            {statusCounts.offline > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
                  <span className="text-xs text-muted-foreground">Offline</span>
                </div>
                <span className="text-sm font-semibold text-destructive">{statusCounts.offline}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MapView;
