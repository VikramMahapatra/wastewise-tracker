import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Route, MapPin, Truck, Clock, ArrowRight, 
  Plus, Edit, Trash2, CheckCircle, XCircle 
} from "lucide-react";
import { routes, trucks, gcpLocations, finalDumpingSites, RouteData } from "@/data/fleetData";

export default function Routes() {
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [filterType, setFilterType] = useState<"all" | "primary" | "secondary">("all");

  const filteredRoutes = routes.filter(route => 
    filterType === "all" || route.type === filterType
  );

  const primaryRoutes = routes.filter(r => r.type === "primary");
  const secondaryRoutes = routes.filter(r => r.type === "secondary");

  const getAssignedTruckInfo = (truckId?: string) => {
    if (!truckId) return null;
    return trucks.find(t => t.id === truckId);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Route Management</h1>
          <p className="text-muted-foreground">Create and manage collection routes for primary and secondary trucks</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Route
        </Button>
      </div>

      {/* Route Type Explanation */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Primary Routes ({primaryRoutes.length})</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Primary trucks collect garbage from households/bins and dump at GCPs (Garbage Collection Points).
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> Pickup Points → <ArrowRight className="h-3 w-3" /> GCP
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/5 border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <Truck className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary">Secondary Routes ({secondaryRoutes.length})</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Secondary trucks pick garbage from GCPs and transport to final dumping areas.
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> GCP → <ArrowRight className="h-3 w-3" /> Final Dumping Site
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="routes">All Routes</TabsTrigger>
          <TabsTrigger value="gcp">GCP Locations ({gcpLocations.length})</TabsTrigger>
          <TabsTrigger value="dumping">Final Dumping Sites ({finalDumpingSites.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="routes">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Route List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex gap-1">
                  {["all", "primary", "secondary"].map((type) => (
                    <Button
                      key={type}
                      variant={filterType === type ? "default" : "outline"}
                      size="sm"
                      className="flex-1 text-xs capitalize"
                      onClick={() => setFilterType(type as typeof filterType)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {filteredRoutes.map((route) => {
                    const truck = getAssignedTruckInfo(route.assignedTruck);
                    return (
                      <div
                        key={route.id}
                        onClick={() => setSelectedRoute(route)}
                        className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedRoute?.id === route.id ? "bg-primary/10 border-l-2 border-l-primary" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{route.name}</h3>
                          <Badge variant={route.status === "active" ? "default" : "secondary"}>
                            {route.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={`text-xs capitalize ${route.type === "primary" ? "border-primary text-primary" : "border-secondary text-secondary"}`}>
                            {route.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{route.points.length} points</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Route className="h-3 w-3" /> {route.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {route.estimatedTime}
                          </span>
                        </div>
                        {truck && (
                          <div className="mt-2 pt-2 border-t border-border">
                            <div className="flex items-center gap-2 text-xs">
                              <Truck className="h-3 w-3 text-primary" />
                              <span>{truck.truckNumber}</span>
                              <span className="text-muted-foreground">• {truck.driver}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Route Details */}
            <Card className="lg:col-span-2">
              {selectedRoute ? (
                <>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Route className="h-5 w-5" />
                          {selectedRoute.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="capitalize">{selectedRoute.type}</Badge>
                          <Badge variant={selectedRoute.status === "active" ? "default" : "secondary"}>
                            {selectedRoute.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">{selectedRoute.distance}</p>
                        <p className="text-sm text-muted-foreground">Total Distance</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">{selectedRoute.estimatedTime}</p>
                        <p className="text-sm text-muted-foreground">Estimated Time</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">{selectedRoute.points.length}</p>
                        <p className="text-sm text-muted-foreground">Total Points</p>
                      </div>
                    </div>

                    <h4 className="font-semibold mb-3">Route Points</h4>
                    <div className="space-y-2">
                      {selectedRoute.points.map((point, index) => (
                        <div key={point.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            point.type === "pickup" ? "bg-primary text-primary-foreground" :
                            point.type === "gcp" ? "bg-warning text-warning-foreground" :
                            "bg-destructive text-destructive-foreground"
                          }`}>
                            {point.order}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{point.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{point.type}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {point.position.lat.toFixed(4)}, {point.position.lng.toFixed(4)}
                          </div>
                          {index < selectedRoute.points.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>

                    {selectedRoute.assignedTruck && (
                      <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                        <h4 className="font-semibold mb-2">Assigned Truck</h4>
                        {(() => {
                          const truck = getAssignedTruckInfo(selectedRoute.assignedTruck);
                          return truck ? (
                            <div className="flex items-center gap-4">
                              <Truck className="h-8 w-8 text-primary" />
                              <div>
                                <p className="font-medium">{truck.truckNumber}</p>
                                <p className="text-sm text-muted-foreground">Driver: {truck.driver}</p>
                              </div>
                              <Badge className="ml-auto capitalize">{truck.status}</Badge>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </CardContent>
                </>
              ) : (
                <CardContent className="h-[500px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Route className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a route to view details</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gcp">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gcpLocations.map((gcp) => (
              <Card key={gcp.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-warning/20 rounded-lg">
                      <MapPin className="h-5 w-5 text-warning" />
                    </div>
                    <Badge variant="outline">{gcp.ward}</Badge>
                  </div>
                  <h3 className="font-semibold mb-1">{gcp.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">Capacity: {gcp.capacity}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Current Fill</span>
                      <span className={gcp.currentFill > 80 ? "text-destructive" : gcp.currentFill > 60 ? "text-warning" : "text-success"}>
                        {gcp.currentFill}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${gcp.currentFill > 80 ? "bg-destructive" : gcp.currentFill > 60 ? "bg-warning" : "bg-success"}`}
                        style={{ width: `${gcp.currentFill}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dumping">
          <div className="grid md:grid-cols-2 gap-4">
            {finalDumpingSites.map((site) => (
              <Card key={site.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-destructive/20 rounded-lg">
                      <MapPin className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{site.name}</h3>
                      <p className="text-muted-foreground mb-2">Final Dumping Site</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Truck className="h-4 w-4" /> Capacity: {site.capacity}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Coordinates: {site.position.lat.toFixed(4)}, {site.position.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
