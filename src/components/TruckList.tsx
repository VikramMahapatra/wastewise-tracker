import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Truck, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TruckListProps {
  onSelectTruck: (truckId: string) => void;
  selectedTruck: string | null;
}

const trucks = [
  {
    id: "TRK-001",
    number: "MH-12-AB-1234",
    driver: "Rajesh Kumar",
    status: "moving",
    route: "Zone A - Route 1",
    trips: 3,
    lastUpdate: "2 min ago",
  },
  {
    id: "TRK-002",
    number: "MH-12-CD-5678",
    driver: "Amit Sharma",
    status: "idle",
    route: "Zone B - Route 3",
    trips: 2,
    lastUpdate: "5 min ago",
  },
  {
    id: "TRK-003",
    number: "MH-12-EF-9012",
    driver: "Suresh Patil",
    status: "dumping",
    route: "Zone A - Route 2",
    trips: 4,
    lastUpdate: "1 min ago",
  },
  {
    id: "TRK-004",
    number: "MH-12-GH-3456",
    driver: "Vijay Singh",
    status: "moving",
    route: "Zone C - Route 1",
    trips: 2,
    lastUpdate: "3 min ago",
  },
  {
    id: "TRK-005",
    number: "MH-12-IJ-7890",
    driver: "Prakash Desai",
    status: "moving",
    route: "Zone B - Route 2",
    trips: 3,
    lastUpdate: "1 min ago",
  },
];

const TruckList = ({ onSelectTruck, selectedTruck }: TruckListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "moving":
        return "bg-success/10 text-success border-success/20";
      case "idle":
        return "bg-warning/10 text-warning border-warning/20";
      case "dumping":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card className="flex flex-col h-[800px]">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Fleet Overview</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {trucks.length} trucks active
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {trucks.map((truck) => (
            <Card
              key={truck.id}
              className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedTruck === truck.id
                  ? "ring-2 ring-primary border-primary"
                  : "border-border"
              }`}
              onClick={() => onSelectTruck(truck.id)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{truck.id}</h3>
                    <p className="text-sm text-muted-foreground">{truck.number}</p>
                  </div>
                  <Badge className={getStatusColor(truck.status)} variant="outline">
                    {truck.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{truck.route}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Driver: {truck.driver}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {truck.lastUpdate}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {truck.trips} trips today
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-primary hover:text-primary hover:bg-primary/10"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TruckList;
