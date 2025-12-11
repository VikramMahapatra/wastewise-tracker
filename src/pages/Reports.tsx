import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  FileText, 
  Truck, 
  MapPin, 
  Users, 
  Fuel, 
  AlertTriangle, 
  Scale,
  Calendar,
  Filter,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  TrendingDown,
  Clock,
  Route,
  Trash2,
  Building
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

// Mock data for reports
const dailyCollectionData = [
  { id: 1, date: "2024-01-15", ward: "Kharadi East", zone: "Zone A", truck: "MH-12-AB-1234", driver: "Rajesh Kumar", totalBins: 45, collected: 43, missed: 2, weight: 2.4, status: "completed" },
  { id: 2, date: "2024-01-15", ward: "Kharadi West", zone: "Zone A", truck: "MH-12-CD-5678", driver: "Amit Singh", totalBins: 52, collected: 52, missed: 0, weight: 2.8, status: "completed" },
  { id: 3, date: "2024-01-15", ward: "Viman Nagar", zone: "Zone B", truck: "MH-12-EF-9012", driver: "Suresh Patil", totalBins: 38, collected: 35, missed: 3, weight: 1.9, status: "partial" },
  { id: 4, date: "2024-01-15", ward: "Kalyani Nagar", zone: "Zone B", truck: "MH-12-GH-3456", driver: "Mahesh Yadav", totalBins: 41, collected: 41, missed: 0, weight: 2.2, status: "completed" },
  { id: 5, date: "2024-01-15", ward: "Wadgaon Sheri", zone: "Zone C", truck: "MH-12-IJ-7890", driver: "Ravi Sharma", totalBins: 35, collected: 30, missed: 5, weight: 1.6, status: "partial" },
];

const routePerformanceData = [
  { route: "Route A1", completion: 98, avgTime: "4.2 hrs", deviations: 2, efficiency: 96 },
  { route: "Route A2", completion: 95, avgTime: "3.8 hrs", deviations: 5, efficiency: 91 },
  { route: "Route B1", completion: 100, avgTime: "4.5 hrs", deviations: 0, efficiency: 99 },
  { route: "Route B2", completion: 88, avgTime: "5.1 hrs", deviations: 8, efficiency: 82 },
  { route: "Route C1", completion: 92, avgTime: "4.0 hrs", deviations: 4, efficiency: 88 },
];

const truckUtilizationData = [
  { truck: "MH-12-AB-1234", type: "Compactor", trips: 3, operatingHours: 8.5, idleTime: 1.2, distance: 45, utilization: 92 },
  { truck: "MH-12-CD-5678", type: "Mini Truck", trips: 4, operatingHours: 9.0, idleTime: 0.8, distance: 52, utilization: 95 },
  { truck: "MH-12-EF-9012", type: "Dumper", trips: 2, operatingHours: 7.2, idleTime: 2.1, distance: 38, utilization: 78 },
  { truck: "MH-12-GH-3456", type: "Open Truck", trips: 3, operatingHours: 8.0, idleTime: 1.5, distance: 41, utilization: 85 },
  { truck: "MH-12-IJ-7890", type: "Compactor", trips: 3, operatingHours: 8.8, idleTime: 0.5, distance: 48, utilization: 96 },
];

const fuelConsumptionData = [
  { truck: "MH-12-AB-1234", fuelUsed: 18.5, distance: 45, efficiency: 2.43, cost: 1850, anomaly: false, score: 92 },
  { truck: "MH-12-CD-5678", fuelUsed: 22.0, distance: 52, efficiency: 2.36, cost: 2200, anomaly: false, score: 95 },
  { truck: "MH-12-EF-9012", fuelUsed: 28.5, distance: 38, efficiency: 1.33, cost: 2850, anomaly: true, score: 45 },
  { truck: "MH-12-GH-3456", fuelUsed: 16.8, distance: 41, efficiency: 2.44, cost: 1680, anomaly: false, score: 94 },
  { truck: "MH-12-IJ-7890", fuelUsed: 19.2, distance: 48, efficiency: 2.50, cost: 1920, anomaly: false, score: 97 },
];

const driverAttendanceData = [
  { driver: "Rajesh Kumar", id: "DRV001", shiftStart: "06:00", shiftEnd: "14:30", hoursWorked: 8.5, routes: 2, onTime: true, violations: 0, score: 95 },
  { driver: "Amit Singh", id: "DRV002", shiftStart: "06:15", shiftEnd: "15:00", hoursWorked: 8.75, routes: 2, onTime: true, violations: 1, score: 88 },
  { driver: "Suresh Patil", id: "DRV003", shiftStart: "06:45", shiftEnd: "14:00", hoursWorked: 7.25, routes: 1, onTime: false, violations: 2, score: 72 },
  { driver: "Mahesh Yadav", id: "DRV004", shiftStart: "06:00", shiftEnd: "14:15", hoursWorked: 8.25, routes: 2, onTime: true, violations: 0, score: 98 },
  { driver: "Ravi Sharma", id: "DRV005", shiftStart: "06:30", shiftEnd: "14:45", hoursWorked: 8.25, routes: 2, onTime: false, violations: 1, score: 82 },
];

const complaintsData = [
  { id: "CMP001", date: "2024-01-15", ward: "Kharadi East", type: "Missed Pickup", status: "resolved", truck: "MH-12-AB-1234", responseTime: "2 hrs" },
  { id: "CMP002", date: "2024-01-15", ward: "Viman Nagar", type: "Overflow Bin", status: "pending", truck: "MH-12-EF-9012", responseTime: "-" },
  { id: "CMP003", date: "2024-01-14", ward: "Kalyani Nagar", type: "Irregular Timing", status: "resolved", truck: "MH-12-GH-3456", responseTime: "4 hrs" },
  { id: "CMP004", date: "2024-01-14", ward: "Wadgaon Sheri", type: "Missed Pickup", status: "in-progress", truck: "MH-12-IJ-7890", responseTime: "1 hr" },
  { id: "CMP005", date: "2024-01-13", ward: "Kharadi West", type: "Spillage", status: "resolved", truck: "MH-12-CD-5678", responseTime: "3 hrs" },
];

const dumpYardData = [
  { site: "GCP Kharadi", entries: 45, totalWeight: 112.5, avgWeight: 2.5, peakHour: "10:00-11:00", capacity: 78 },
  { site: "GCP Viman Nagar", entries: 38, totalWeight: 89.2, avgWeight: 2.35, peakHour: "11:00-12:00", capacity: 65 },
  { site: "Dump Site Alpha", entries: 22, totalWeight: 198.0, avgWeight: 9.0, peakHour: "14:00-15:00", capacity: 45 },
  { site: "Dump Site Beta", entries: 18, totalWeight: 162.0, avgWeight: 9.0, peakHour: "15:00-16:00", capacity: 38 },
];

const weeklyTrendData = [
  { day: "Mon", collected: 45.2, missed: 8, efficiency: 94 },
  { day: "Tue", collected: 48.5, missed: 5, efficiency: 96 },
  { day: "Wed", collected: 42.8, missed: 12, efficiency: 88 },
  { day: "Thu", collected: 50.1, missed: 4, efficiency: 97 },
  { day: "Fri", collected: 47.3, missed: 6, efficiency: 95 },
  { day: "Sat", collected: 52.0, missed: 3, efficiency: 98 },
  { day: "Sun", collected: 35.2, missed: 2, efficiency: 96 },
];

const zoneWiseData = [
  { name: "Zone A", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Zone B", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Zone C", value: 22, color: "hsl(var(--chart-3))" },
  { name: "Zone D", value: 15, color: "hsl(var(--chart-4))" },
];

export default function Reports() {
  const [dateFrom, setDateFrom] = useState("2024-01-15");
  const [dateTo, setDateTo] = useState("2024-01-15");
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedWard, setSelectedWard] = useState("all");
  const [selectedTruck, setSelectedTruck] = useState("all");

  const handleDownload = (reportType: string, format: string) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${reportType}_${dateFrom}_${dateTo}.${format}`;
    alert(`Downloading ${reportType} report as ${format.toUpperCase()}`);
  };

  const handlePrint = (reportType: string) => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports Center</h1>
          <p className="text-muted-foreground">Generate, filter and download comprehensive fleet reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <FileText className="h-3 w-3 mr-1" />
            7 Report Types
          </Badge>
        </div>
      </div>

      {/* Global Filters */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Report Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Zone</label>
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger>
                  <SelectValue placeholder="All Zones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  <SelectItem value="zone-a">Zone A</SelectItem>
                  <SelectItem value="zone-b">Zone B</SelectItem>
                  <SelectItem value="zone-c">Zone C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ward</label>
              <Select value={selectedWard} onValueChange={setSelectedWard}>
                <SelectTrigger>
                  <SelectValue placeholder="All Wards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Wards</SelectItem>
                  <SelectItem value="kharadi-east">Kharadi East</SelectItem>
                  <SelectItem value="kharadi-west">Kharadi West</SelectItem>
                  <SelectItem value="viman-nagar">Viman Nagar</SelectItem>
                  <SelectItem value="kalyani-nagar">Kalyani Nagar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Truck</label>
              <Select value={selectedTruck} onValueChange={setSelectedTruck}>
                <SelectTrigger>
                  <SelectValue placeholder="All Trucks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trucks</SelectItem>
                  <SelectItem value="MH-12-AB-1234">MH-12-AB-1234</SelectItem>
                  <SelectItem value="MH-12-CD-5678">MH-12-CD-5678</SelectItem>
                  <SelectItem value="MH-12-EF-9012">MH-12-EF-9012</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid grid-cols-4 md:grid-cols-7 h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="daily" className="flex items-center gap-1 text-xs md:text-sm">
            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Daily</span> Collection
          </TabsTrigger>
          <TabsTrigger value="route" className="flex items-center gap-1 text-xs md:text-sm">
            <Route className="h-3 w-3 md:h-4 md:w-4" />
            Route
          </TabsTrigger>
          <TabsTrigger value="truck" className="flex items-center gap-1 text-xs md:text-sm">
            <Truck className="h-3 w-3 md:h-4 md:w-4" />
            Truck
          </TabsTrigger>
          <TabsTrigger value="fuel" className="flex items-center gap-1 text-xs md:text-sm">
            <Fuel className="h-3 w-3 md:h-4 md:w-4" />
            Fuel
          </TabsTrigger>
          <TabsTrigger value="driver" className="flex items-center gap-1 text-xs md:text-sm">
            <Users className="h-3 w-3 md:h-4 md:w-4" />
            Driver
          </TabsTrigger>
          <TabsTrigger value="complaints" className="flex items-center gap-1 text-xs md:text-sm">
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
            Complaints
          </TabsTrigger>
          <TabsTrigger value="dumpyard" className="flex items-center gap-1 text-xs md:text-sm">
            <Building className="h-3 w-3 md:h-4 md:w-4" />
            Dump Yard
          </TabsTrigger>
        </TabsList>

        {/* Daily Collection Report */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-primary" />
                  Daily Garbage Collection Report
                </CardTitle>
                <CardDescription>Waste collected by ward, zone, and truck with pickup status</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload("daily_collection", "csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload("daily_collection", "pdf")}>
                  <Download className="h-4 w-4 mr-1" /> PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePrint("daily_collection")}>
                  <Printer className="h-4 w-4 mr-1" /> Print
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-emerald-500/10 border-emerald-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">211</p>
                    <p className="text-xs text-muted-foreground">Total Bins</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">201</p>
                    <p className="text-xs text-muted-foreground">Collected</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-500/10 border-red-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">10</p>
                    <p className="text-xs text-muted-foreground">Missed</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">10.9</p>
                    <p className="text-xs text-muted-foreground">Total Tons</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-500/10 border-purple-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">95.3%</p>
                    <p className="text-xs text-muted-foreground">Completion</p>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="collected" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Collected (tons)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Date</TableHead>
                      <TableHead>Ward</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Truck</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead className="text-center">Bins</TableHead>
                      <TableHead className="text-center">Collected</TableHead>
                      <TableHead className="text-center">Missed</TableHead>
                      <TableHead className="text-right">Weight (T)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyCollectionData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.date}</TableCell>
                        <TableCell>{row.ward}</TableCell>
                        <TableCell>{row.zone}</TableCell>
                        <TableCell className="font-mono text-xs">{row.truck}</TableCell>
                        <TableCell>{row.driver}</TableCell>
                        <TableCell className="text-center">{row.totalBins}</TableCell>
                        <TableCell className="text-center text-green-600 font-medium">{row.collected}</TableCell>
                        <TableCell className="text-center text-red-600 font-medium">{row.missed}</TableCell>
                        <TableCell className="text-right">{row.weight}</TableCell>
                        <TableCell>
                          <Badge variant={row.status === "completed" ? "default" : "secondary"} 
                                 className={row.status === "completed" ? "bg-green-500/20 text-green-700 border-green-500/30" : "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"}>
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Route Performance Report */}
        <TabsContent value="route" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-primary" />
                  Route Performance Report
                </CardTitle>
                <CardDescription>Route completion rates, deviations, and efficiency metrics</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload("route_performance", "csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload("route_performance", "pdf")}>
                  <Download className="h-4 w-4 mr-1" /> PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">94.6%</p>
                    <p className="text-xs text-muted-foreground">Avg Completion</p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/10 border-orange-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">19</p>
                    <p className="text-xs text-muted-foreground">Total Deviations</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">4.3 hrs</p>
                    <p className="text-xs text-muted-foreground">Avg Route Time</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">91.2%</p>
                    <p className="text-xs text-muted-foreground">Avg Efficiency</p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Route</TableHead>
                      <TableHead className="text-center">Completion %</TableHead>
                      <TableHead className="text-center">Avg Time</TableHead>
                      <TableHead className="text-center">Deviations</TableHead>
                      <TableHead>Efficiency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routePerformanceData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.route}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <span className={row.completion >= 95 ? "text-green-600" : row.completion >= 90 ? "text-yellow-600" : "text-red-600"}>
                              {row.completion}%
                            </span>
                            {row.completion >= 95 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{row.avgTime}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={row.deviations === 0 ? "default" : "destructive"} className={row.deviations === 0 ? "bg-green-500/20 text-green-700" : ""}>
                            {row.deviations}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={row.efficiency} className="h-2 w-20" />
                            <span className="text-sm font-medium">{row.efficiency}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Truck Utilization Report */}
        <TabsContent value="truck" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Truck Utilization Report
                </CardTitle>
                <CardDescription>Trips, operating hours, idle time, and vehicle utilization</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload("truck_utilization", "csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload("truck_utilization", "pdf")}>
                  <Download className="h-4 w-4 mr-1" /> PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">15</p>
                    <p className="text-xs text-muted-foreground">Total Trips</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">41.5 hrs</p>
                    <p className="text-xs text-muted-foreground">Operating Hours</p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/10 border-orange-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">6.1 hrs</p>
                    <p className="text-xs text-muted-foreground">Total Idle Time</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">89.2%</p>
                    <p className="text-xs text-muted-foreground">Avg Utilization</p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Truck</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Trips</TableHead>
                      <TableHead className="text-center">Operating Hrs</TableHead>
                      <TableHead className="text-center">Idle Time</TableHead>
                      <TableHead className="text-center">Distance (km)</TableHead>
                      <TableHead>Utilization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {truckUtilizationData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-xs font-medium">{row.truck}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.type}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{row.trips}</TableCell>
                        <TableCell className="text-center">{row.operatingHours}</TableCell>
                        <TableCell className="text-center">
                          <span className={row.idleTime > 1.5 ? "text-red-600" : "text-green-600"}>
                            {row.idleTime} hrs
                          </span>
                        </TableCell>
                        <TableCell className="text-center">{row.distance}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={row.utilization} className="h-2 w-20" />
                            <span className={`text-sm font-medium ${row.utilization >= 90 ? "text-green-600" : row.utilization >= 80 ? "text-yellow-600" : "text-red-600"}`}>
                              {row.utilization}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fuel Consumption Report */}
        <TabsContent value="fuel" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Fuel className="h-5 w-5 text-primary" />
                  Fuel Consumption Report
                </CardTitle>
                <CardDescription>Fuel usage, efficiency metrics, anomaly detection, and costs</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload("fuel_consumption", "csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload("fuel_consumption", "pdf")}>
                  <Download className="h-4 w-4 mr-1" /> PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">105L</p>
                    <p className="text-xs text-muted-foreground">Total Fuel</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">224 km</p>
                    <p className="text-xs text-muted-foreground">Total Distance</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">2.21</p>
                    <p className="text-xs text-muted-foreground">Avg km/L</p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/10 border-orange-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">₹10,500</p>
                    <p className="text-xs text-muted-foreground">Total Cost</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-500/10 border-red-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-xs text-muted-foreground">Anomalies</p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Truck</TableHead>
                      <TableHead className="text-center">Fuel (L)</TableHead>
                      <TableHead className="text-center">Distance (km)</TableHead>
                      <TableHead className="text-center">Efficiency (km/L)</TableHead>
                      <TableHead className="text-right">Cost (₹)</TableHead>
                      <TableHead className="text-center">Anomaly</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fuelConsumptionData.map((row, idx) => (
                      <TableRow key={idx} className={row.anomaly ? "bg-red-500/5" : ""}>
                        <TableCell className="font-mono text-xs font-medium">{row.truck}</TableCell>
                        <TableCell className="text-center">{row.fuelUsed}</TableCell>
                        <TableCell className="text-center">{row.distance}</TableCell>
                        <TableCell className="text-center">
                          <span className={row.efficiency >= 2.0 ? "text-green-600" : "text-red-600"}>
                            {row.efficiency.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">₹{row.cost.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          {row.anomaly ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" /> Detected
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30">Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={row.score} className="h-2 w-16" />
                            <span className={`text-sm font-medium ${row.score >= 80 ? "text-green-600" : row.score >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                              {row.score}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Driver Attendance Report */}
        <TabsContent value="driver" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Driver Attendance & Performance Report
                </CardTitle>
                <CardDescription>Shift timings, routes completed, violations, and driver scores</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload("driver_attendance", "csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload("driver_attendance", "pdf")}>
                  <Download className="h-4 w-4 mr-1" /> PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">5</p>
                    <p className="text-xs text-muted-foreground">Active Drivers</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">41 hrs</p>
                    <p className="text-xs text-muted-foreground">Total Hours</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-500/10 border-red-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">4</p>
                    <p className="text-xs text-muted-foreground">Violations</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">87</p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Driver</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead className="text-center">Shift Start</TableHead>
                      <TableHead className="text-center">Shift End</TableHead>
                      <TableHead className="text-center">Hours</TableHead>
                      <TableHead className="text-center">Routes</TableHead>
                      <TableHead className="text-center">On Time</TableHead>
                      <TableHead className="text-center">Violations</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {driverAttendanceData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.driver}</TableCell>
                        <TableCell className="font-mono text-xs">{row.id}</TableCell>
                        <TableCell className="text-center">{row.shiftStart}</TableCell>
                        <TableCell className="text-center">{row.shiftEnd}</TableCell>
                        <TableCell className="text-center">{row.hoursWorked}</TableCell>
                        <TableCell className="text-center">{row.routes}</TableCell>
                        <TableCell className="text-center">
                          {row.onTime ? (
                            <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Yes</Badge>
                          ) : (
                            <Badge variant="destructive">Late</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={row.violations > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                            {row.violations}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={row.score} className="h-2 w-16" />
                            <span className={`text-sm font-medium ${row.score >= 90 ? "text-green-600" : row.score >= 75 ? "text-yellow-600" : "text-red-600"}`}>
                              {row.score}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Complaints Report */}
        <TabsContent value="complaints" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Citizen Complaints Report
                </CardTitle>
                <CardDescription>Complaints mapped to truck movements and response times</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload("complaints", "csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload("complaints", "pdf")}>
                  <Download className="h-4 w-4 mr-1" /> PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">5</p>
                    <p className="text-xs text-muted-foreground">Total Complaints</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">3</p>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-500/10 border-yellow-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">1</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-500/10 border-red-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Ward</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Truck</TableHead>
                      <TableHead className="text-center">Response Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaintsData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-xs font-medium">{row.id}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.ward}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.type}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{row.truck}</TableCell>
                        <TableCell className="text-center">{row.responseTime}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              row.status === "resolved" 
                                ? "bg-green-500/20 text-green-700 border-green-500/30" 
                                : row.status === "in-progress" 
                                ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
                                : "bg-red-500/20 text-red-700 border-red-500/30"
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dump Yard Log Report */}
        <TabsContent value="dumpyard" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Dump Yard & GCP Log Report
                </CardTitle>
                <CardDescription>Entry counts, weight per trip, and site capacity utilization</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload("dumpyard_log", "csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload("dumpyard_log", "pdf")}>
                  <Download className="h-4 w-4 mr-1" /> PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">123</p>
                    <p className="text-xs text-muted-foreground">Total Entries</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">561.7 T</p>
                    <p className="text-xs text-muted-foreground">Total Weight</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">4.57 T</p>
                    <p className="text-xs text-muted-foreground">Avg per Entry</p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/10 border-orange-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">56.5%</p>
                    <p className="text-xs text-muted-foreground">Avg Capacity</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64">
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Zone-wise Distribution</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={zoneWiseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {zoneWiseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Site</TableHead>
                        <TableHead className="text-center">Entries</TableHead>
                        <TableHead className="text-center">Total (T)</TableHead>
                        <TableHead className="text-center">Avg (T)</TableHead>
                        <TableHead>Capacity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dumpYardData.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{row.site}</TableCell>
                          <TableCell className="text-center">{row.entries}</TableCell>
                          <TableCell className="text-center">{row.totalWeight}</TableCell>
                          <TableCell className="text-center">{row.avgWeight}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={row.capacity} className="h-2 w-16" />
                              <span className={`text-xs ${row.capacity >= 70 ? "text-orange-600" : "text-green-600"}`}>
                                {row.capacity}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
