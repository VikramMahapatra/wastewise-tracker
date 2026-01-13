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
import { ArrowLeft, Search, Download, CheckCircle2, Clock, MapPin, Truck, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

// Mock trips data
const tripsData = [
  { id: "TRP-001", truck: "TRK-001", driver: "Rajesh Sharma", route: "Zone A - Kharadi Route 1", startTime: "06:00", endTime: "09:45", pickups: 24, status: "completed", duration: "3h 45m" },
  { id: "TRP-002", truck: "TRK-002", driver: "Ramesh Kumar", route: "Zone A - Viman Nagar Route", startTime: "06:15", endTime: "10:00", pickups: 18, status: "completed", duration: "3h 45m" },
  { id: "TRP-003", truck: "TRK-003", driver: "Santosh Kulkarni", route: "Zone B - Hadapsar Route", startTime: "06:30", endTime: "10:30", pickups: 32, status: "completed", duration: "4h" },
  { id: "TRP-004", truck: "TRK-004", driver: "Suresh Patil", route: "Zone C - Hospital Waste Route", startTime: "05:45", endTime: "08:15", pickups: 12, status: "completed", duration: "2h 30m" },
  { id: "TRP-005", truck: "TRK-005", driver: "Amit Deshmukh", route: "Zone A - Kharadi Route 2", startTime: "07:00", endTime: "11:00", pickups: 28, status: "completed", duration: "4h" },
  { id: "TRP-006", truck: "TRK-006", driver: "Dinesh Pawar", route: "Zone B - Magarpatta Route", startTime: "06:00", endTime: "09:30", pickups: 22, status: "completed", duration: "3h 30m" },
  { id: "TRP-007", truck: "TRK-007", driver: "Mahesh Jadhav", route: "Zone D - Industrial Route", startTime: "08:00", endTime: "12:00", pickups: 15, status: "completed", duration: "4h" },
  { id: "TRP-008", truck: "TRK-008", driver: "Pradeep Raut", route: "Zone C - Commercial Route", startTime: "06:45", endTime: "10:15", pickups: 20, status: "in_progress", duration: "—" },
  { id: "TRP-009", truck: "TRK-009", driver: "Anil Gaikwad", route: "Zone B - Residential Route", startTime: "05:30", endTime: "09:00", pickups: 35, status: "completed", duration: "3h 30m" },
  { id: "TRP-010", truck: "TRK-010", driver: "Sanjay Bhosale", route: "Zone A - IT Park Route", startTime: "07:30", endTime: "11:30", pickups: 16, status: "completed", duration: "4h" },
  { id: "TRP-011", truck: "TRK-011", driver: "Prakash More", route: "Zone D - Warehouse Route", startTime: "06:00", endTime: "09:45", pickups: 10, status: "completed", duration: "3h 45m" },
  { id: "TRP-012", truck: "TRK-012", driver: "Vishal Kadam", route: "Zone E - Market Route", startTime: "05:00", endTime: "08:30", pickups: 42, status: "completed", duration: "3h 30m" },
];

const TripsCompleted = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"];

  const filteredTrips = useMemo(() => {
    return tripsData.filter(trip => {
      const matchesSearch = searchQuery === "" || 
        trip.truck.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.route.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesZone = zoneFilter === "all" || trip.route.startsWith(zoneFilter);
      const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
      
      return matchesSearch && matchesZone && matchesStatus;
    });
  }, [searchQuery, zoneFilter, statusFilter]);

  const totalPages = Math.ceil(filteredTrips.length / ITEMS_PER_PAGE);
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const completedCount = tripsData.filter(t => t.status === "completed").length;
  const inProgressCount = tripsData.filter(t => t.status === "in_progress").length;
  const totalPickups = tripsData.filter(t => t.status === "completed").reduce((acc, t) => acc + t.pickups, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/30">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/30">In Progress</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["Trip ID", "Truck", "Driver", "Route", "Start Time", "End Time", "Pickups", "Duration", "Status"].join(","),
      ...filteredTrips.map(trip => 
        [trip.id, trip.truck, trip.driver, trip.route, trip.startTime, trip.endTime, trip.pickups, trip.duration, trip.status].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trips_completed.csv";
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
            <h1 className="text-2xl font-bold text-foreground">Trips Completed</h1>
            <p className="text-muted-foreground text-sm">
              Today's trip completion status
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
        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-xl font-bold">{completedCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-chart-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-xl font-bold">{inProgressCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Target</p>
              <p className="text-xl font-bold">180</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pickups</p>
              <p className="text-xl font-bold">{totalPickups}</p>
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
              placeholder="Search by truck, driver, or route..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Select value={zoneFilter} onValueChange={(v) => { setZoneFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Zones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {zones.map((zone) => (
                <SelectItem key={zone} value={zone}>
                  {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trip ID</TableHead>
              <TableHead>Truck</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Pickups</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTrips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell className="font-medium">{trip.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    {trip.truck}
                  </div>
                </TableCell>
                <TableCell>{trip.driver}</TableCell>
                <TableCell>{trip.route}</TableCell>
                <TableCell>{trip.startTime}</TableCell>
                <TableCell>{trip.endTime}</TableCell>
                <TableCell>{trip.duration}</TableCell>
                <TableCell>{trip.pickups}</TableCell>
                <TableCell>{getStatusBadge(trip.status)}</TableCell>
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

export default TripsCompleted;
