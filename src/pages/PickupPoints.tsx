import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  MapPin, Plus, Search, Building2, Home, Hospital, 
  ShoppingBag, Trash2, Edit, Clock, AlertTriangle 
} from "lucide-react";
import { pickupPoints, gcpLocations, routes, PickupPoint } from "@/data/fleetData";

const typeConfig = {
  residential: { icon: Home, color: "text-primary", bgColor: "bg-primary/20", label: "Residential" },
  commercial: { icon: Building2, color: "text-chart-1", bgColor: "bg-chart-1/20", label: "Commercial" },
  hospital: { icon: Hospital, color: "text-destructive", bgColor: "bg-destructive/20", label: "Hospital" },
  market: { icon: ShoppingBag, color: "text-warning", bgColor: "bg-warning/20", label: "Market" },
};

export default function PickupPoints() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterWard, setFilterWard] = useState<string>("all");
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);

  const wards = [...new Set(pickupPoints.map(p => p.ward))];

  const filteredPoints = pickupPoints.filter(point => {
    const matchesSearch = point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         point.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || point.type === filterType;
    const matchesWard = filterWard === "all" || point.ward === filterWard;
    return matchesSearch && matchesType && matchesWard;
  });

  const highFillPoints = pickupPoints.filter(p => (p.fillLevel || 0) > 80);
  const getRouteInfo = (routeId?: string) => routes.find(r => r.id === routeId);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pickup Points</h1>
          <p className="text-muted-foreground">Manage garbage bin locations and schedules</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Pickup Point
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pickupPoints.length}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{gcpLocations.length}</p>
                <p className="text-sm text-muted-foreground">GCP Locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <Clock className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pickupPoints.filter(p => p.assignedRoute).length}</p>
                <p className="text-sm text-muted-foreground">Assigned to Routes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={highFillPoints.length > 0 ? "bg-destructive/5 border-destructive/20" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{highFillPoints.length}</p>
                <p className="text-sm text-muted-foreground">High Fill (&gt;80%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="market">Market</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterWard} onValueChange={setFilterWard}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {wards.map(ward => (
                  <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Points List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Pickup Points ({filteredPoints.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="grid md:grid-cols-2 gap-3 p-4">
                {filteredPoints.map((point) => {
                  const config = typeConfig[point.type];
                  const TypeIcon = config.icon;
                  const route = getRouteInfo(point.assignedRoute);
                  
                  return (
                    <div
                      key={point.id}
                      onClick={() => setSelectedPoint(point)}
                      className={`p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedPoint?.id === point.id ? "bg-primary/10 border-primary" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
                            <TypeIcon className={`h-4 w-4 ${config.color}`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{point.name}</h4>
                            <p className="text-xs text-muted-foreground">{point.id}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">{point.ward}</Badge>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Schedule:</span>
                          <span>{point.schedule}</span>
                        </div>
                        
                        {point.fillLevel !== undefined && (
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Fill Level:</span>
                              <span className={point.fillLevel > 80 ? "text-destructive font-medium" : point.fillLevel > 60 ? "text-warning" : "text-success"}>
                                {point.fillLevel}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${point.fillLevel > 80 ? "bg-destructive" : point.fillLevel > 60 ? "bg-warning" : "bg-success"}`}
                                style={{ width: `${point.fillLevel}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {route && (
                          <div className="flex items-center justify-between pt-1 border-t border-border">
                            <span className="text-muted-foreground">Route:</span>
                            <Badge variant="outline" className="text-xs">{route.name}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Details Panel */}
        <Card>
          {selectedPoint ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedPoint.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {(() => {
                    const config = typeConfig[selectedPoint.type];
                    const TypeIcon = config.icon;
                    return (
                      <>
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <TypeIcon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div>
                          <Badge variant="outline" className="capitalize">{config.label}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{selectedPoint.ward}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">ID</span>
                    <span className="font-medium">{selectedPoint.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Schedule</span>
                    <span className="font-medium">{selectedPoint.schedule}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Coordinates</span>
                    <span className="font-medium text-xs">
                      {selectedPoint.position.lat.toFixed(4)}, {selectedPoint.position.lng.toFixed(4)}
                    </span>
                  </div>
                  {selectedPoint.lastCollection && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Last Collection</span>
                      <span className="font-medium text-sm">{selectedPoint.lastCollection}</span>
                    </div>
                  )}
                </div>

                {selectedPoint.fillLevel !== undefined && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Fill Level</span>
                      <span className={`font-bold ${selectedPoint.fillLevel > 80 ? "text-destructive" : selectedPoint.fillLevel > 60 ? "text-warning" : "text-success"}`}>
                        {selectedPoint.fillLevel}%
                      </span>
                    </div>
                    <div className="h-3 bg-background rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${selectedPoint.fillLevel > 80 ? "bg-destructive" : selectedPoint.fillLevel > 60 ? "bg-warning" : "bg-success"}`}
                        style={{ width: `${selectedPoint.fillLevel}%` }}
                      />
                    </div>
                    {selectedPoint.fillLevel > 80 && (
                      <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Needs immediate collection
                      </p>
                    )}
                  </div>
                )}

                {selectedPoint.assignedRoute && (
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h4 className="font-medium mb-2">Assigned Route</h4>
                    {(() => {
                      const route = getRouteInfo(selectedPoint.assignedRoute);
                      return route ? (
                        <div className="flex items-center justify-between">
                          <span>{route.name}</span>
                          <Badge variant="outline" className="capitalize">{route.type}</Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not assigned</span>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </>
          ) : (
            <CardContent className="h-[500px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a pickup point to view details</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
