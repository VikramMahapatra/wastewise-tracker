// Shared fleet data types and mock data

export type TruckType = "primary" | "secondary";
export type TruckStatus = "moving" | "idle" | "dumping" | "offline";
export type DeviceStatus = "online" | "offline" | "warning";

export interface GCPLocation {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  ward: string;
  capacity: string;
  currentFill: number;
}

export interface FinalDumpingSite {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  capacity: string;
}

export interface GPSDevice {
  imei: string;
  status: DeviceStatus;
  lastPing: string;
  signalStrength: number;
  batteryLevel: number;
}

export interface TruckData {
  id: string;
  truckNumber: string;
  truckType: TruckType;
  position: { lat: number; lng: number };
  status: TruckStatus;
  driver: string;
  driverId: string;
  route: string;
  routeId: string;
  speed: number;
  assignedGCP?: string;
  assignedDumpingSite?: string;
  tripsCompleted: number;
  tripsAllowed: number;
  gpsDevice: GPSDevice;
  vehicleCapacity: string;
  lastUpdate: string;
}

export interface RoutePoint {
  id: string;
  position: { lat: number; lng: number };
  name: string;
  type: "pickup" | "gcp" | "dumping";
  order: number;
  scheduledTime?: string; // Format: "HH:MM" (24-hour)
}

export interface RouteData {
  id: string;
  name: string;
  type: TruckType;
  assignedTruck?: string;
  points: RoutePoint[];
  distance: string;
  estimatedTime: string;
  status: "active" | "inactive";
}

export interface HistoricalPath {
  truckId: string;
  date: string;
  path: { lat: number; lng: number; timestamp: string }[];
}

// GCP Locations (Garbage Collection Points) - where primary trucks dump
export const gcpLocations: GCPLocation[] = [
  { id: "GCP-001", name: "Kharadi GCP North", position: { lat: 18.5580, lng: 73.9420 }, ward: "Ward 12", capacity: "50 tons", currentFill: 65 },
  { id: "GCP-002", name: "Kharadi GCP South", position: { lat: 18.5480, lng: 73.9380 }, ward: "Ward 14", capacity: "40 tons", currentFill: 45 },
  { id: "GCP-003", name: "Viman Nagar GCP", position: { lat: 18.5620, lng: 73.9150 }, ward: "Ward 10", capacity: "60 tons", currentFill: 80 },
  { id: "GCP-004", name: "Wadgaon Sheri GCP", position: { lat: 18.5550, lng: 73.9300 }, ward: "Ward 11", capacity: "45 tons", currentFill: 30 },
];

// Final Dumping Sites - where secondary trucks dump
export const finalDumpingSites: FinalDumpingSite[] = [
  { id: "FDS-001", name: "Hadapsar Waste Processing Plant", position: { lat: 18.5050, lng: 73.9400 }, capacity: "500 tons/day" },
  { id: "FDS-002", name: "Uruli Devachi Landfill", position: { lat: 18.4200, lng: 73.9800 }, capacity: "1000 tons/day" },
];

// Trucks data
export const trucks: TruckData[] = [
  { 
    id: "TRK-001", 
    truckNumber: "MH-12-AB-1234",
    truckType: "primary",
    position: { lat: 18.5520, lng: 73.9400 }, 
    status: "moving",
    driver: "Rajesh Kumar",
    driverId: "DRV-001",
    route: "Route A-12",
    routeId: "RT-001",
    speed: 25,
    assignedGCP: "GCP-001",
    tripsCompleted: 3,
    tripsAllowed: 5,
    vehicleCapacity: "8 tons",
    lastUpdate: "2 mins ago",
    gpsDevice: {
      imei: "359881234567890",
      status: "online",
      lastPing: "2024-01-15 10:30:00",
      signalStrength: 85,
      batteryLevel: 92,
    }
  },
  { 
    id: "TRK-002", 
    truckNumber: "MH-12-CD-5678",
    truckType: "secondary",
    position: { lat: 18.5560, lng: 73.9450 }, 
    status: "idle",
    driver: "Amit Sharma",
    driverId: "DRV-002",
    route: "Route B-05",
    routeId: "RT-002",
    speed: 0,
    assignedGCP: "GCP-001",
    assignedDumpingSite: "FDS-001",
    tripsCompleted: 2,
    tripsAllowed: 4,
    vehicleCapacity: "15 tons",
    lastUpdate: "5 mins ago",
    gpsDevice: {
      imei: "359881234567891",
      status: "online",
      lastPing: "2024-01-15 10:28:00",
      signalStrength: 72,
      batteryLevel: 78,
    }
  },
  { 
    id: "TRK-003", 
    truckNumber: "MH-12-EF-9012",
    truckType: "primary",
    position: { lat: 18.5500, lng: 73.9380 }, 
    status: "dumping",
    driver: "Suresh Patil",
    driverId: "DRV-003",
    route: "Route C-08",
    routeId: "RT-003",
    speed: 0,
    assignedGCP: "GCP-002",
    tripsCompleted: 4,
    tripsAllowed: 5,
    vehicleCapacity: "8 tons",
    lastUpdate: "1 min ago",
    gpsDevice: {
      imei: "359881234567892",
      status: "online",
      lastPing: "2024-01-15 10:31:00",
      signalStrength: 90,
      batteryLevel: 65,
    }
  },
  { 
    id: "TRK-004", 
    truckNumber: "MH-12-GH-3456",
    truckType: "secondary",
    position: { lat: 18.5580, lng: 73.9500 }, 
    status: "moving",
    driver: "Vikram Singh",
    driverId: "DRV-004",
    route: "Route A-15",
    routeId: "RT-004",
    speed: 30,
    assignedGCP: "GCP-003",
    assignedDumpingSite: "FDS-002",
    tripsCompleted: 1,
    tripsAllowed: 3,
    vehicleCapacity: "20 tons",
    lastUpdate: "Just now",
    gpsDevice: {
      imei: "359881234567893",
      status: "online",
      lastPing: "2024-01-15 10:32:00",
      signalStrength: 95,
      batteryLevel: 88,
    }
  },
  { 
    id: "TRK-005", 
    truckNumber: "MH-12-IJ-7890",
    truckType: "primary",
    position: { lat: 18.5490, lng: 73.9350 }, 
    status: "moving",
    driver: "Deepak Jadhav",
    driverId: "DRV-005",
    route: "Route D-03",
    routeId: "RT-005",
    speed: 18,
    assignedGCP: "GCP-004",
    tripsCompleted: 2,
    tripsAllowed: 5,
    vehicleCapacity: "10 tons",
    lastUpdate: "3 mins ago",
    gpsDevice: {
      imei: "359881234567894",
      status: "warning",
      lastPing: "2024-01-15 10:25:00",
      signalStrength: 45,
      batteryLevel: 25,
    }
  },
  { 
    id: "TRK-006", 
    truckNumber: "MH-12-KL-1122",
    truckType: "primary",
    position: { lat: 18.5610, lng: 73.9280 }, 
    status: "offline",
    driver: "Manoj Patil",
    driverId: "DRV-006",
    route: "Route E-02",
    routeId: "RT-006",
    speed: 0,
    assignedGCP: "GCP-003",
    tripsCompleted: 0,
    tripsAllowed: 5,
    vehicleCapacity: "8 tons",
    lastUpdate: "45 mins ago",
    gpsDevice: {
      imei: "359881234567895",
      status: "offline",
      lastPing: "2024-01-15 09:45:00",
      signalStrength: 0,
      batteryLevel: 12,
    }
  },
  { 
    id: "TRK-007", 
    truckNumber: "MH-12-MN-3344",
    truckType: "secondary",
    position: { lat: 18.5420, lng: 73.9450 }, 
    status: "moving",
    driver: "Ravi Deshmukh",
    driverId: "DRV-007",
    route: "Route F-01",
    routeId: "RT-007",
    speed: 22,
    assignedGCP: "GCP-002",
    assignedDumpingSite: "FDS-001",
    tripsCompleted: 3,
    tripsAllowed: 4,
    vehicleCapacity: "18 tons",
    lastUpdate: "1 min ago",
    gpsDevice: {
      imei: "359881234567896",
      status: "online",
      lastPing: "2024-01-15 10:31:00",
      signalStrength: 80,
      batteryLevel: 70,
    }
  },
];

// Routes data
export const routes: RouteData[] = [
  {
    id: "RT-001",
    name: "Route A-12",
    type: "primary",
    assignedTruck: "TRK-001",
    distance: "15.5 km",
    estimatedTime: "2h 30m",
    status: "active",
    points: [
      { id: "RP-001", position: { lat: 18.5520, lng: 73.9400 }, name: "Starting Point", type: "pickup", order: 1, scheduledTime: "06:00" },
      { id: "RP-002", position: { lat: 18.5535, lng: 73.9415 }, name: "Sector 22", type: "pickup", order: 2, scheduledTime: "06:45" },
      { id: "RP-003", position: { lat: 18.5550, lng: 73.9430 }, name: "Sector 23", type: "pickup", order: 3, scheduledTime: "07:30" },
      { id: "RP-004", position: { lat: 18.5580, lng: 73.9420 }, name: "Kharadi GCP North", type: "gcp", order: 4, scheduledTime: "08:30" },
    ]
  },
  {
    id: "RT-002",
    name: "Route B-05",
    type: "secondary",
    assignedTruck: "TRK-002",
    distance: "25.8 km",
    estimatedTime: "1h 45m",
    status: "active",
    points: [
      { id: "RP-005", position: { lat: 18.5580, lng: 73.9420 }, name: "Kharadi GCP North", type: "gcp", order: 1, scheduledTime: "09:00" },
      { id: "RP-006", position: { lat: 18.5050, lng: 73.9400 }, name: "Hadapsar Waste Processing Plant", type: "dumping", order: 2, scheduledTime: "10:30" },
    ]
  },
  {
    id: "RT-003",
    name: "Route C-08",
    type: "primary",
    assignedTruck: "TRK-003",
    distance: "12.3 km",
    estimatedTime: "2h 15m",
    status: "active",
    points: [
      { id: "RP-007", position: { lat: 18.5500, lng: 73.9380 }, name: "Starting Point B", type: "pickup", order: 1, scheduledTime: "07:00" },
      { id: "RP-008", position: { lat: 18.5480, lng: 73.9360 }, name: "Sector 14", type: "pickup", order: 2, scheduledTime: "07:45" },
      { id: "RP-009", position: { lat: 18.5480, lng: 73.9380 }, name: "Kharadi GCP South", type: "gcp", order: 3, scheduledTime: "09:15" },
    ]
  },
];

// Historical path data (mock)
export const generateHistoricalPath = (truckId: string, date: string): HistoricalPath => {
  const baseLat = 18.5500;
  const baseLng = 73.9400;
  const path: { lat: number; lng: number; timestamp: string }[] = [];
  
  // Generate 50 points for a day's path
  for (let i = 0; i < 50; i++) {
    const hour = Math.floor(i / 5) + 6; // Start from 6 AM
    const minute = (i % 5) * 12;
    path.push({
      lat: baseLat + (Math.random() - 0.5) * 0.02 + (i * 0.0003),
      lng: baseLng + (Math.random() - 0.5) * 0.02 + (i * 0.0002),
      timestamp: `${date} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`,
    });
  }
  
  return { truckId, date, path };
};

// Pickup points (individual bins)
export interface PickupPoint {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  type: "residential" | "commercial" | "hospital" | "market";
  ward: string;
  schedule: string;
  assignedRoute?: string;
  fillLevel?: number;
  lastCollection?: string;
}

export const pickupPoints: PickupPoint[] = [
  { id: "PP-001", name: "Sector 22 Bin 1", position: { lat: 18.5535, lng: 73.9415 }, type: "residential", ward: "Ward 12", schedule: "Daily 7AM", assignedRoute: "RT-001", fillLevel: 75, lastCollection: "Today 7:15 AM" },
  { id: "PP-002", name: "Sector 22 Bin 2", position: { lat: 18.5538, lng: 73.9418 }, type: "residential", ward: "Ward 12", schedule: "Daily 7AM", assignedRoute: "RT-001", fillLevel: 60, lastCollection: "Today 7:18 AM" },
  { id: "PP-003", name: "Sector 23 Market", position: { lat: 18.5550, lng: 73.9430 }, type: "market", ward: "Ward 12", schedule: "Daily 6AM, 4PM", assignedRoute: "RT-001", fillLevel: 90, lastCollection: "Today 6:05 AM" },
  { id: "PP-004", name: "City Hospital", position: { lat: 18.5545, lng: 73.9395 }, type: "hospital", ward: "Ward 12", schedule: "Daily 5AM", assignedRoute: "RT-001", fillLevel: 45, lastCollection: "Today 5:10 AM" },
  { id: "PP-005", name: "Sector 14 Bin 1", position: { lat: 18.5480, lng: 73.9360 }, type: "residential", ward: "Ward 14", schedule: "Daily 8AM", assignedRoute: "RT-003", fillLevel: 80, lastCollection: "Today 8:00 AM" },
  { id: "PP-006", name: "Tech Park 1", position: { lat: 18.5500, lng: 73.9450 }, type: "commercial", ward: "Ward 12", schedule: "Daily 9PM", assignedRoute: "RT-003", fillLevel: 55, lastCollection: "Yesterday 9:05 PM" },
  { id: "PP-007", name: "Sector 14 Market", position: { lat: 18.5475, lng: 73.9355 }, type: "market", ward: "Ward 14", schedule: "Twice Daily", assignedRoute: "RT-003", fillLevel: 85, lastCollection: "Today 6:30 AM" },
  { id: "PP-008", name: "Viman Nagar Society", position: { lat: 18.5620, lng: 73.9160 }, type: "residential", ward: "Ward 10", schedule: "Daily 7AM", fillLevel: 70, lastCollection: "Today 7:25 AM" },
];

export const GOOGLE_MAPS_API_KEY = "AIzaSyBm6KoD4T-fdLkIHvxwqsQq3EPjz14V2Sw";
export const KHARADI_CENTER = { lat: 18.5540, lng: 73.9425 };
