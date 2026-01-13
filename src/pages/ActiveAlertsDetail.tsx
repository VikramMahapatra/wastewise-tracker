import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowLeft, Search, Download, AlertTriangle, Clock, MapPin, Navigation, Gauge, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

// Mock alerts data
const alertsData = [
  { id: "ALT-001", type: "route_deviation", truck: "TRK-002", driver: "Ramesh Kumar", zone: "Zone A", message: "Deviated from route by 350m", time: "5 min ago", severity: "high" },
  { id: "ALT-002", type: "missed_pickup", truck: "TRK-004", driver: "Suresh Patil", zone: "Zone C", message: "Missed pickup at Point 12", time: "12 min ago", severity: "critical" },
  { id: "ALT-003", type: "unauthorized_halt", truck: "TRK-002", driver: "Ramesh Kumar", zone: "Zone A", message: "Unauthorized halt for 15 min", time: "18 min ago", severity: "medium" },
  { id: "ALT-004", type: "speed_violation", truck: "TRK-007", driver: "Mahesh Jadhav", zone: "Zone B", message: "Speed 65 km/h in 40 km/h zone", time: "25 min ago", severity: "high" },
  { id: "ALT-005", type: "geofence_breach", truck: "TRK-011", driver: "Prakash More", zone: "Zone D", message: "Exited zone boundary", time: "32 min ago", severity: "medium" },
  { id: "ALT-006", type: "device_tamper", truck: "TRK-015", driver: "Vijay Shinde", zone: "Zone E", message: "GPS device disconnection", time: "45 min ago", severity: "critical" },
  { id: "ALT-007", type: "route_deviation", truck: "TRK-009", driver: "Anil Gaikwad", zone: "Zone B", message: "Off-route for 20 minutes", time: "52 min ago", severity: "high" },
  { id: "ALT-008", type: "missed_pickup", truck: "TRK-003", driver: "Santosh Kulkarni", zone: "Zone A", message: "Skipped 3 pickup points", time: "1 hr ago", severity: "critical" },
  { id: "ALT-009", type: "speed_violation", truck: "TRK-006", driver: "Dinesh Pawar", zone: "Zone B", message: "Speed 55 km/h in school zone", time: "1 hr ago", severity: "critical" },
  { id: "ALT-010", type: "unauthorized_halt", truck: "TRK-008", driver: "Pradeep Raut", zone: "Zone C", message: "Stopped at unauthorized location", time: "1.5 hr ago", severity: "medium" },
];

const ActiveAlertsDetail = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const alertTypes = [
    { id: "route_deviation", label: "Route Deviation" },
    { id: "missed_pickup", label: "Missed Pickup" },
    { id: "unauthorized_halt", label: "Unauthorized Halt" },
    { id: "speed_violation", label: "Speed Violation" },
    { id: "geofence_breach", label: "Geofence Breach" },
    { id: "device_tamper", label: "Device Tamper" },
  ];

  const filteredAlerts = useMemo(() => {
    return alertsData.filter(alert => {
      const matchesSearch = searchQuery === "" || 
        alert.truck.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === "all" || alert.type === typeFilter;
      const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
      
      return matchesSearch && matchesType && matchesSeverity;
    });
  }, [searchQuery, typeFilter, severityFilter]);

  const totalPages = Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const criticalCount = alertsData.filter(a => a.severity === "critical").length;
  const highCount = alertsData.filter(a => a.severity === "high").length;
  const mediumCount = alertsData.filter(a => a.severity === "medium").length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "route_deviation": return <Navigation className="h-4 w-4" />;
      case "missed_pickup": return <MapPin className="h-4 w-4" />;
      case "unauthorized_halt": return <Clock className="h-4 w-4" />;
      case "speed_violation": return <Gauge className="h-4 w-4" />;
      case "geofence_breach": return <Shield className="h-4 w-4" />;
      case "device_tamper": return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/30">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/30">High</Badge>;
      case "medium":
        return <Badge className="bg-warning/10 text-warning border-warning/30">Medium</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeLabel = alertTypes.find(t => t.id === type)?.label || type;
    return <Badge variant="outline">{typeLabel}</Badge>;
  };

  const handleExport = () => {
    const csvContent = [
      ["Alert ID", "Type", "Truck", "Driver", "Zone", "Message", "Time", "Severity"].join(","),
      ...filteredAlerts.map(alert => 
        [alert.id, alert.type, alert.truck, alert.driver, alert.zone, `"${alert.message}"`, alert.time, alert.severity].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "active_alerts.csv";
    a.click();
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Active Alerts</h1>
            <p className="text-muted-foreground text-sm">
              All current alerts requiring attention
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Active</p>
              <p className="text-xl font-bold">{alertsData.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-destructive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-xl font-bold">{criticalCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">High</p>
              <p className="text-xl font-bold">{highCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-chart-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Medium</p>
              <p className="text-xl font-bold">{mediumCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by truck, driver, or message..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {alertTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={(v) => { setSeverityFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Truck</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAlerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-medium">{alert.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(alert.type)}
                    {getTypeBadge(alert.type)}
                  </div>
                </TableCell>
                <TableCell>{alert.truck}</TableCell>
                <TableCell>{alert.driver}</TableCell>
                <TableCell>{alert.zone}</TableCell>
                <TableCell className="max-w-[200px] truncate">{alert.message}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{alert.time}</TableCell>
                <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ActiveAlertsDetail;
