import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  IdCard, 
  AlertTriangle, 
  Clock, 
  ChevronRight,
  Truck,
  User
} from "lucide-react";
import { mockTrucks, mockDrivers } from "@/data/masterData";
import { differenceInDays, parseISO, format } from "date-fns";

interface ExpiryItem {
  id: string;
  name: string;
  type: 'insurance' | 'license' | 'fitness';
  expiryDate: string;
  daysLeft: number;
  status: 'expired' | 'critical' | 'warning' | 'ok';
  entity: 'truck' | 'driver';
  entityId: string;
}

const getExpiryStatus = (daysLeft: number): 'expired' | 'critical' | 'warning' | 'ok' => {
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 7) return 'critical';
  if (daysLeft <= 30) return 'warning';
  return 'ok';
};

const getExpiryItems = (): ExpiryItem[] => {
  const items: ExpiryItem[] = [];
  const today = new Date();

  // Truck insurance expiries
  mockTrucks.forEach(truck => {
    const daysLeft = differenceInDays(parseISO(truck.insuranceExpiry), today);
    items.push({
      id: `insurance-${truck.id}`,
      name: truck.registrationNumber,
      type: 'insurance',
      expiryDate: truck.insuranceExpiry,
      daysLeft,
      status: getExpiryStatus(daysLeft),
      entity: 'truck',
      entityId: truck.id
    });
  });

  // Truck fitness expiries
  mockTrucks.forEach(truck => {
    const daysLeft = differenceInDays(parseISO(truck.fitnessExpiry), today);
    items.push({
      id: `fitness-${truck.id}`,
      name: truck.registrationNumber,
      type: 'fitness',
      expiryDate: truck.fitnessExpiry,
      daysLeft,
      status: getExpiryStatus(daysLeft),
      entity: 'truck',
      entityId: truck.id
    });
  });

  // Driver license expiries
  mockDrivers.forEach(driver => {
    const daysLeft = differenceInDays(parseISO(driver.licenseExpiry), today);
    items.push({
      id: `license-${driver.id}`,
      name: driver.name,
      type: 'license',
      expiryDate: driver.licenseExpiry,
      daysLeft,
      status: getExpiryStatus(daysLeft),
      entity: 'driver',
      entityId: driver.id
    });
  });

  return items.sort((a, b) => a.daysLeft - b.daysLeft);
};

const ExpiryAlerts = () => {
  const [activeTab, setActiveTab] = useState("all");
  const expiryItems = getExpiryItems();

  const filteredItems = expiryItems.filter(item => {
    if (activeTab === "all") return item.status !== 'ok';
    if (activeTab === "insurance") return item.type === 'insurance' && item.status !== 'ok';
    if (activeTab === "license") return item.type === 'license' && item.status !== 'ok';
    if (activeTab === "fitness") return item.type === 'fitness' && item.status !== 'ok';
    return false;
  });

  const expiredCount = expiryItems.filter(i => i.status === 'expired').length;
  const criticalCount = expiryItems.filter(i => i.status === 'critical').length;
  const warningCount = expiryItems.filter(i => i.status === 'warning').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'expired':
        return <Badge variant="destructive" className="text-xs">Expired</Badge>;
      case 'critical':
        return <Badge className="bg-orange-500 text-white text-xs">Critical</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 text-xs">Warning</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">OK</Badge>;
    }
  };

  const getTypeIcon = (type: string, entity: string) => {
    if (entity === 'driver') return <IdCard className="h-4 w-4 text-primary" />;
    if (type === 'insurance') return <Shield className="h-4 w-4 text-chart-2" />;
    return <Truck className="h-4 w-4 text-chart-3" />;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Expiry Alerts
          </CardTitle>
          <div className="flex gap-1">
            {expiredCount > 0 && (
              <Badge variant="destructive" className="text-xs">{expiredCount} Expired</Badge>
            )}
            {criticalCount > 0 && (
              <Badge className="bg-orange-500 text-white text-xs">{criticalCount} Critical</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4 pb-2">
            <TabsList className="grid w-full grid-cols-4 h-8">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="insurance" className="text-xs">Insurance</TabsTrigger>
              <TabsTrigger value="license" className="text-xs">License</TabsTrigger>
              <TabsTrigger value="fitness" className="text-xs">Fitness</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[280px]">
            <div className="px-4 pb-4 space-y-2">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No expiring items in this category</p>
                </div>
              ) : (
                filteredItems.map(item => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                      item.status === 'expired' ? 'border-destructive/50 bg-destructive/5' :
                      item.status === 'critical' ? 'border-orange-500/50 bg-orange-500/5' :
                      'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          item.status === 'expired' ? 'bg-destructive/10' :
                          item.status === 'critical' ? 'bg-orange-500/10' :
                          'bg-muted'
                        }`}>
                          {getTypeIcon(item.type, item.entity)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{item.name}</span>
                            {item.entity === 'driver' && <User className="h-3 w-3 text-muted-foreground" />}
                            {item.entity === 'truck' && <Truck className="h-3 w-3 text-muted-foreground" />}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="capitalize">{item.type}</span>
                            <span>•</span>
                            <span>{format(parseISO(item.expiryDate), 'dd MMM yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <span className={`text-xs font-medium ${
                          item.daysLeft < 0 ? 'text-destructive' :
                          item.daysLeft <= 7 ? 'text-orange-600' :
                          'text-muted-foreground'
                        }`}>
                          {item.daysLeft < 0 
                            ? `${Math.abs(item.daysLeft)}d ago` 
                            : `${item.daysLeft}d left`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Tabs>
        
        <div className="px-4 py-3 border-t">
          <Button variant="ghost" className="w-full justify-between text-sm" asChild>
            <a href="/reports">
              View Full Expiry Report
              <ChevronRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpiryAlerts;
