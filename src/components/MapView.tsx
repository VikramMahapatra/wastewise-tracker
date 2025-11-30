import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapViewProps {
  selectedTruck: string | null;
}

const trucks = [
  { id: "TRK-001", position: { top: "30%", left: "25%" }, status: "moving" },
  { id: "TRK-002", position: { top: "45%", left: "60%" }, status: "idle" },
  { id: "TRK-003", position: { top: "60%", left: "35%" }, status: "dumping" },
  { id: "TRK-004", position: { top: "25%", left: "70%" }, status: "moving" },
  { id: "TRK-005", position: { top: "70%", left: "55%" }, status: "moving" },
];

const MapView = ({ selectedTruck }: MapViewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "moving":
        return "bg-success";
      case "idle":
        return "bg-warning";
      case "dumping":
        return "bg-chart-2";
      default:
        return "bg-muted";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Live Fleet Map</h2>
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
              <div className="h-2 w-2 rounded-full bg-chart-2" />
              <span className="text-xs text-muted-foreground">Dumping</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-[500px] bg-gradient-to-br from-muted/50 to-background">
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />

        {/* Routes - simplified paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 25% 30% Q 40% 35%, 60% 45%"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            opacity="0.3"
          />
          <path
            d="M 60% 45% L 35% 60%"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            opacity="0.3"
          />
        </svg>

        {/* Trucks */}
        {trucks.map((truck) => (
          <div
            key={truck.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ top: truck.position.top, left: truck.position.left }}
          >
            <div
              className={`relative transition-all duration-300 ${
                selectedTruck === truck.id ? "scale-125" : "scale-100"
              }`}
            >
              {/* Pulse effect for moving trucks */}
              {truck.status === "moving" && (
                <div className="absolute inset-0 rounded-full bg-success/30 animate-ping" />
              )}

              {/* Truck marker */}
              <div
                className={`${getStatusColor(
                  truck.status
                )} h-4 w-4 rounded-full border-2 border-background shadow-lg group-hover:scale-110 transition-transform`}
              />

              {/* Truck info popup */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Card className="px-3 py-2 shadow-xl whitespace-nowrap">
                  <p className="font-semibold text-sm text-foreground">{truck.id}</p>
                  <Badge
                    variant="secondary"
                    className="mt-1 text-xs capitalize"
                  >
                    {truck.status}
                  </Badge>
                </Card>
              </div>
            </div>
          </div>
        ))}

        {/* Pickup Points */}
        <div className="absolute top-[35%] left-[40%] transform -translate-x-1/2 -translate-y-1/2">
          <MapPin className="h-5 w-5 text-primary opacity-60" />
        </div>
        <div className="absolute top-[55%] left-[30%] transform -translate-x-1/2 -translate-y-1/2">
          <MapPin className="h-5 w-5 text-primary opacity-60" />
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button size="sm" variant="secondary" className="shadow-lg">
            +
          </Button>
          <Button size="sm" variant="secondary" className="shadow-lg">
            -
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MapView;
