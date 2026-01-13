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
import { ArrowLeft, Search, Download, TrendingUp, TrendingDown, MapPin, Target, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const ITEMS_PER_PAGE = 10;

// Mock collection rate data by zone/route
const collectionData = [
  { id: "1", zone: "Zone A", route: "Kharadi Route 1", totalPoints: 45, collected: 42, missed: 3, rate: 93, trend: "up" },
  { id: "2", zone: "Zone A", route: "Viman Nagar Route", totalPoints: 38, collected: 36, missed: 2, rate: 95, trend: "up" },
  { id: "3", zone: "Zone A", route: "Kharadi Route 2", totalPoints: 52, collected: 44, missed: 8, rate: 85, trend: "down" },
  { id: "4", zone: "Zone B", route: "Hadapsar Route", totalPoints: 60, collected: 54, missed: 6, rate: 90, trend: "stable" },
  { id: "5", zone: "Zone B", route: "Magarpatta Route", totalPoints: 35, collected: 32, missed: 3, rate: 91, trend: "up" },
  { id: "6", zone: "Zone B", route: "Residential Route", totalPoints: 48, collected: 40, missed: 8, rate: 83, trend: "down" },
  { id: "7", zone: "Zone C", route: "Hospital Waste Route", totalPoints: 20, collected: 19, missed: 1, rate: 95, trend: "up" },
  { id: "8", zone: "Zone C", route: "Commercial Route", totalPoints: 42, collected: 38, missed: 4, rate: 90, trend: "stable" },
  { id: "9", zone: "Zone D", route: "Industrial Route", totalPoints: 25, collected: 22, missed: 3, rate: 88, trend: "down" },
  { id: "10", zone: "Zone D", route: "Warehouse Route", totalPoints: 18, collected: 17, missed: 1, rate: 94, trend: "up" },
  { id: "11", zone: "Zone E", route: "Market Route", totalPoints: 55, collected: 48, missed: 7, rate: 87, trend: "down" },
  { id: "12", zone: "Zone E", route: "Outer Ring Route", totalPoints: 30, collected: 28, missed: 2, rate: 93, trend: "up" },
];

const CollectionRate = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"];

  const filteredData = useMemo(() => {
    return collectionData.filter(item => {
      const matchesSearch = searchQuery === "" || 
        item.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.zone.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesZone = zoneFilter === "all" || item.zone === zoneFilter;
      
      let matchesPerformance = true;
      if (performanceFilter === "excellent") matchesPerformance = item.rate >= 95;
      else if (performanceFilter === "good") matchesPerformance = item.rate >= 90 && item.rate < 95;
      else if (performanceFilter === "needs_improvement") matchesPerformance = item.rate < 90;
      
      return matchesSearch && matchesZone && matchesPerformance;
    });
  }, [searchQuery, zoneFilter, performanceFilter]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const overallRate = Math.round(collectionData.reduce((acc, d) => acc + d.rate, 0) / collectionData.length);
  const totalCollected = collectionData.reduce((acc, d) => acc + d.collected, 0);
  const totalPoints = collectionData.reduce((acc, d) => acc + d.totalPoints, 0);
  const totalMissed = collectionData.reduce((acc, d) => acc + d.missed, 0);

  const getRateBadge = (rate: number) => {
    if (rate >= 95) return <Badge className="bg-success/10 text-success border-success/30">Excellent</Badge>;
    if (rate >= 90) return <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/30">Good</Badge>;
    if (rate >= 85) return <Badge className="bg-warning/10 text-warning border-warning/30">Fair</Badge>;
    return <Badge className="bg-destructive/10 text-destructive border-destructive/30">Poor</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <span className="h-4 w-4 text-muted-foreground">—</span>;
  };

  const handleExport = () => {
    const csvContent = [
      ["Zone", "Route", "Total Points", "Collected", "Missed", "Rate (%)", "Trend"].join(","),
      ...filteredData.map(item => 
        [item.zone, item.route, item.totalPoints, item.collected, item.missed, item.rate, item.trend].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "collection_rate.csv";
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
            <h1 className="text-2xl font-bold text-foreground">Collection Rate</h1>
            <p className="text-muted-foreground text-sm">
              Waste collection efficiency by zone and route
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
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Rate</p>
              <p className="text-xl font-bold">{overallRate}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-xl font-bold">{totalCollected}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-chart-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-xl font-bold">{totalPoints}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-destructive">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Missed</p>
              <p className="text-xl font-bold">{totalMissed}</p>
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
              placeholder="Search by zone or route..."
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
          <Select value={performanceFilter} onValueChange={(v) => { setPerformanceFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Performance</SelectItem>
              <SelectItem value="excellent">Excellent (≥95%)</SelectItem>
              <SelectItem value="good">Good (90-94%)</SelectItem>
              <SelectItem value="needs_improvement">Needs Improvement (&lt;90%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zone</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Total Points</TableHead>
              <TableHead>Collected</TableHead>
              <TableHead>Missed</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.zone}</TableCell>
                <TableCell>{item.route}</TableCell>
                <TableCell>{item.totalPoints}</TableCell>
                <TableCell className="text-success">{item.collected}</TableCell>
                <TableCell className="text-destructive">{item.missed}</TableCell>
                <TableCell className="font-semibold">{item.rate}%</TableCell>
                <TableCell className="min-w-[120px]">
                  <Progress value={item.rate} className="h-2" />
                </TableCell>
                <TableCell>{getRateBadge(item.rate)}</TableCell>
                <TableCell>{getTrendIcon(item.trend)}</TableCell>
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

export default CollectionRate;
