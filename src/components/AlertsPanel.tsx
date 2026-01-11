import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPinOff, Clock, Navigation, ChevronRight, Bell } from "lucide-react";

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

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          badge: "bg-destructive text-destructive-foreground",
          border: "border-l-destructive",
          bg: "bg-destructive/5",
          icon: "bg-destructive/10 text-destructive",
        };
      case "medium":
        return {
          badge: "bg-warning text-warning-foreground",
          border: "border-l-warning",
          bg: "bg-warning/5",
          icon: "bg-warning/10 text-warning",
        };
      case "warning":
        return {
          badge: "bg-chart-4/80 text-white",
          border: "border-l-chart-4",
          bg: "bg-chart-4/5",
          icon: "bg-chart-4/10 text-chart-4",
        };
      default:
        return {
          badge: "bg-muted text-muted-foreground",
          border: "border-l-border",
          bg: "",
          icon: "bg-muted text-muted-foreground",
        };
    }
  };

  const highCount = alerts.filter(a => a.severity === "high").length;
  const mediumCount = alerts.filter(a => a.severity === "medium").length;

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="h-5 w-5 text-warning" />
              {highCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
            </div>
            <h2 className="text-lg font-semibold text-foreground">Active Alerts</h2>
          </div>
          <div className="flex gap-1.5">
            {highCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {highCount} Critical
              </Badge>
            )}
            {mediumCount > 0 && (
              <Badge className="bg-warning text-warning-foreground text-xs">
                {mediumCount} Medium
              </Badge>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            const styles = getSeverityStyles(alert.severity);
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${styles.border} ${styles.bg} border border-border transition-all hover:shadow-sm`}
              >
                <div className="flex gap-3">
                  <div className={`h-8 w-8 rounded-lg ${styles.icon} flex items-center justify-center shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {alert.truck}
                        </span>
                        <Badge className={`${styles.badge} text-[10px] uppercase tracking-wide`}>
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border bg-muted/20">
        <Button variant="ghost" className="w-full justify-between text-sm h-9" asChild>
          <a href="/alerts">
            View All Alerts
            <ChevronRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </Card>
  );
};

export default AlertsPanel;
