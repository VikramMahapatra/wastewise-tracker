import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, MapPinOff, Clock, Navigation } from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "route_deviation",
    truck: "TRK-002",
    message: "Deviated from assigned route by 350m",
    time: "5 min ago",
    severity: "warning",
  },
  {
    id: 2,
    type: "missed_pickup",
    truck: "TRK-004",
    message: "Missed pickup at Zone C - Point 12",
    time: "12 min ago",
    severity: "high",
  },
  {
    id: 3,
    type: "unauthorized_halt",
    truck: "TRK-002",
    message: "Unauthorized halt detected - 15 minutes",
    time: "18 min ago",
    severity: "medium",
  },
  {
    id: 4,
    type: "route_deviation",
    truck: "TRK-007",
    message: "Off-route for extended period",
    time: "25 min ago",
    severity: "warning",
  },
];

const AlertsPanel = () => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "route_deviation":
        return Navigation;
      case "missed_pickup":
        return MapPinOff;
      case "unauthorized_halt":
        return Clock;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "warning":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="text-lg font-semibold text-foreground">Active Alerts</h2>
          </div>
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
            {alerts.length} Active
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[280px]">
        <div className="p-4 space-y-3">
          {alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <Card
                key={alert.id}
                className="p-4 border-l-4 border-l-warning/50 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-3">
                  <div className="mt-1">
                    <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-warning" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {alert.truck}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.message}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getSeverityColor(alert.severity)} capitalize whitespace-nowrap`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default AlertsPanel;
