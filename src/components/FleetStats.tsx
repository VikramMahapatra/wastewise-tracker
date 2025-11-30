import { Truck, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    label: "Active Trucks",
    value: "24",
    total: "32",
    icon: Truck,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    label: "Trips Completed",
    value: "156",
    target: "180",
    icon: CheckCircle2,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    label: "Active Alerts",
    value: "8",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    label: "Collection Rate",
    value: "87%",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const FleetStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </h3>
                  {(stat.total || stat.target) && (
                    <span className="text-sm text-muted-foreground">
                      / {stat.total || stat.target}
                    </span>
                  )}
                </div>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-xl`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default FleetStats;
