// Master Data Types and Mock Data

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  address: string;
  status: 'active' | 'inactive' | 'on_leave';
  assignedTruckId?: string;
  joinDate: string;
  emergencyContact: string;
}

export interface Vendor {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  gstNumber: string;
  contractStart: string;
  contractEnd: string;
  status: 'active' | 'inactive' | 'suspended';
  trucksOwned: string[];
  supervisorName: string;
  supervisorPhone: string;
}

export interface TruckMaster {
  id: string;
  registrationNumber: string;
  type: 'mini-truck' | 'compactor' | 'dumper' | 'open-truck';
  capacity: number;
  capacityUnit: 'tons' | 'cubic-meters';
  routeType: 'primary' | 'secondary';
  vendorId: string;
  driverId?: string;
  imeiNumber: string;
  fuelType: 'diesel' | 'cng' | 'electric';
  manufacturingYear: number;
  insuranceExpiry: string;
  fitnessExpiry: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastServiceDate: string;
}

export interface Zone {
  id: string;
  name: string;
  code: string;
  description: string;
  supervisorName: string;
  supervisorPhone: string;
  totalWards: number;
  status: 'active' | 'inactive';
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  zoneId: string;
  population: number;
  area: number;
  totalBins: number;
  status: 'active' | 'inactive';
}

export interface Route {
  id: string;
  name: string;
  code: string;
  type: 'primary' | 'secondary';
  wardId: string;
  zoneId: string;
  assignedTruckId?: string;
  totalPickupPoints: number;
  estimatedDistance: number;
  estimatedTime: number;
  status: 'active' | 'inactive';
}

export interface PickupPoint {
  id: string;
  binId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  routeId: string;
  wardId: string;
  wasteType: 'dry' | 'wet' | 'mixed' | 'hazardous';
  expectedPickupTime: string;
  geofenceRadius: number;
  hasSensor: boolean;
  status: 'active' | 'inactive' | 'overflow';
}

// Mock Data
export const mockDrivers: Driver[] = [
  {
    id: 'DRV001',
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@email.com',
    licenseNumber: 'MH12 2020 0001234',
    licenseExpiry: '2025-06-15',
    address: '123, Kharadi, Pune',
    status: 'active',
    assignedTruckId: 'TRK001',
    joinDate: '2020-03-15',
    emergencyContact: '+91 9876543211'
  },
  {
    id: 'DRV002',
    name: 'Suresh Patil',
    phone: '+91 9876543220',
    email: 'suresh.patil@email.com',
    licenseNumber: 'MH12 2019 0005678',
    licenseExpiry: '2024-12-20',
    address: '456, Hadapsar, Pune',
    status: 'active',
    assignedTruckId: 'TRK002',
    joinDate: '2019-08-10',
    emergencyContact: '+91 9876543221'
  },
  {
    id: 'DRV003',
    name: 'Amit Sharma',
    phone: '+91 9876543230',
    email: 'amit.sharma@email.com',
    licenseNumber: 'MH12 2021 0009012',
    licenseExpiry: '2026-03-25',
    address: '789, Viman Nagar, Pune',
    status: 'on_leave',
    joinDate: '2021-01-20',
    emergencyContact: '+91 9876543231'
  },
  {
    id: 'DRV004',
    name: 'Prakash Jadhav',
    phone: '+91 9876543240',
    email: 'prakash.jadhav@email.com',
    licenseNumber: 'MH12 2018 0003456',
    licenseExpiry: '2024-09-10',
    address: '321, Koregaon Park, Pune',
    status: 'active',
    assignedTruckId: 'TRK003',
    joinDate: '2018-05-05',
    emergencyContact: '+91 9876543241'
  },
  {
    id: 'DRV005',
    name: 'Vijay Deshmukh',
    phone: '+91 9876543250',
    email: 'vijay.deshmukh@email.com',
    licenseNumber: 'MH12 2022 0007890',
    licenseExpiry: '2027-01-30',
    address: '654, Aundh, Pune',
    status: 'inactive',
    joinDate: '2022-06-15',
    emergencyContact: '+91 9876543251'
  }
];

export const mockVendors: Vendor[] = [
  {
    id: 'VND001',
    name: 'Mahesh Enterprises',
    companyName: 'Mahesh Fleet Services Pvt Ltd',
    phone: '+91 9888777666',
    email: 'contact@maheshfleet.com',
    address: '100, Industrial Area, Pimpri, Pune',
    gstNumber: '27AABCU9603R1ZX',
    contractStart: '2023-01-01',
    contractEnd: '2025-12-31',
    status: 'active',
    trucksOwned: ['TRK001', 'TRK002', 'TRK003'],
    supervisorName: 'Mahesh Kulkarni',
    supervisorPhone: '+91 9888777667'
  },
  {
    id: 'VND002',
    name: 'Green Transport Co',
    companyName: 'Green Transport Solutions',
    phone: '+91 9777666555',
    email: 'info@greentransport.com',
    address: '200, MIDC Bhosari, Pune',
    gstNumber: '27AABCG1234R1ZY',
    contractStart: '2022-06-01',
    contractEnd: '2024-05-31',
    status: 'active',
    trucksOwned: ['TRK004', 'TRK005'],
    supervisorName: 'Ramesh Gaikwad',
    supervisorPhone: '+91 9777666556'
  },
  {
    id: 'VND003',
    name: 'City Waste Solutions',
    companyName: 'City Waste Management Services',
    phone: '+91 9666555444',
    email: 'cityswaste@email.com',
    address: '300, Nigdi, Pune',
    gstNumber: '27AABCC5678R1ZZ',
    contractStart: '2023-03-01',
    contractEnd: '2026-02-28',
    status: 'active',
    trucksOwned: ['TRK006', 'TRK007', 'TRK008'],
    supervisorName: 'Sunil Pawar',
    supervisorPhone: '+91 9666555445'
  }
];

export const mockTrucks: TruckMaster[] = [
  {
    id: 'TRK001',
    registrationNumber: 'MH12 AB 1234',
    type: 'compactor',
    capacity: 8,
    capacityUnit: 'tons',
    routeType: 'primary',
    vendorId: 'VND001',
    driverId: 'DRV001',
    imeiNumber: '356938035643809',
    fuelType: 'diesel',
    manufacturingYear: 2021,
    insuranceExpiry: '2025-03-15',
    fitnessExpiry: '2025-06-20',
    status: 'active',
    lastServiceDate: '2024-01-10'
  },
  {
    id: 'TRK002',
    registrationNumber: 'MH12 CD 5678',
    type: 'mini-truck',
    capacity: 3,
    capacityUnit: 'tons',
    routeType: 'secondary',
    vendorId: 'VND001',
    driverId: 'DRV002',
    imeiNumber: '356938035643810',
    fuelType: 'cng',
    manufacturingYear: 2022,
    insuranceExpiry: '2025-05-20',
    fitnessExpiry: '2025-08-15',
    status: 'active',
    lastServiceDate: '2024-02-05'
  },
  {
    id: 'TRK003',
    registrationNumber: 'MH12 EF 9012',
    type: 'dumper',
    capacity: 12,
    capacityUnit: 'tons',
    routeType: 'secondary',
    vendorId: 'VND001',
    driverId: 'DRV004',
    imeiNumber: '356938035643811',
    fuelType: 'diesel',
    manufacturingYear: 2020,
    insuranceExpiry: '2024-11-10',
    fitnessExpiry: '2024-12-05',
    status: 'maintenance',
    lastServiceDate: '2024-03-01'
  },
  {
    id: 'TRK004',
    registrationNumber: 'MH12 GH 3456',
    type: 'open-truck',
    capacity: 5,
    capacityUnit: 'tons',
    routeType: 'primary',
    vendorId: 'VND002',
    imeiNumber: '356938035643812',
    fuelType: 'diesel',
    manufacturingYear: 2019,
    insuranceExpiry: '2024-08-25',
    fitnessExpiry: '2024-10-30',
    status: 'active',
    lastServiceDate: '2024-01-25'
  },
  {
    id: 'TRK005',
    registrationNumber: 'MH12 IJ 7890',
    type: 'compactor',
    capacity: 10,
    capacityUnit: 'tons',
    routeType: 'primary',
    vendorId: 'VND002',
    imeiNumber: '356938035643813',
    fuelType: 'electric',
    manufacturingYear: 2023,
    insuranceExpiry: '2026-01-15',
    fitnessExpiry: '2026-04-20',
    status: 'active',
    lastServiceDate: '2024-02-20'
  }
];

export const mockZones: Zone[] = [
  { id: 'ZN001', name: 'North Zone', code: 'NZ', description: 'Northern area of the city', supervisorName: 'Arvind Rao', supervisorPhone: '+91 9555444333', totalWards: 8, status: 'active' },
  { id: 'ZN002', name: 'South Zone', code: 'SZ', description: 'Southern area of the city', supervisorName: 'Priya Sharma', supervisorPhone: '+91 9555444334', totalWards: 6, status: 'active' },
  { id: 'ZN003', name: 'East Zone', code: 'EZ', description: 'Eastern area of the city', supervisorName: 'Kiran Patil', supervisorPhone: '+91 9555444335', totalWards: 7, status: 'active' },
  { id: 'ZN004', name: 'West Zone', code: 'WZ', description: 'Western area of the city', supervisorName: 'Sanjay Kulkarni', supervisorPhone: '+91 9555444336', totalWards: 5, status: 'active' },
  { id: 'ZN005', name: 'Central Zone', code: 'CZ', description: 'Central business district', supervisorName: 'Meera Joshi', supervisorPhone: '+91 9555444337', totalWards: 4, status: 'active' }
];

export const mockWards: Ward[] = [
  { id: 'WD001', name: 'Kharadi', code: 'KHR', zoneId: 'ZN003', population: 45000, area: 12.5, totalBins: 150, status: 'active' },
  { id: 'WD002', name: 'Hadapsar', code: 'HDP', zoneId: 'ZN003', population: 65000, area: 18.2, totalBins: 220, status: 'active' },
  { id: 'WD003', name: 'Viman Nagar', code: 'VMN', zoneId: 'ZN003', population: 38000, area: 8.5, totalBins: 120, status: 'active' },
  { id: 'WD004', name: 'Koregaon Park', code: 'KGP', zoneId: 'ZN002', population: 28000, area: 6.2, totalBins: 90, status: 'active' },
  { id: 'WD005', name: 'Aundh', code: 'AND', zoneId: 'ZN001', population: 52000, area: 14.8, totalBins: 180, status: 'active' },
  { id: 'WD006', name: 'Baner', code: 'BNR', zoneId: 'ZN001', population: 48000, area: 11.5, totalBins: 160, status: 'active' },
  { id: 'WD007', name: 'Wakad', code: 'WKD', zoneId: 'ZN004', population: 55000, area: 13.2, totalBins: 190, status: 'active' },
  { id: 'WD008', name: 'Shivaji Nagar', code: 'SJN', zoneId: 'ZN005', population: 32000, area: 5.8, totalBins: 110, status: 'active' }
];

export const mockRoutes: Route[] = [
  { id: 'RT001', name: 'Kharadi Primary Route 1', code: 'KHR-P1', type: 'primary', wardId: 'WD001', zoneId: 'ZN003', assignedTruckId: 'TRK001', totalPickupPoints: 25, estimatedDistance: 15, estimatedTime: 120, status: 'active' },
  { id: 'RT002', name: 'Hadapsar Primary Route 1', code: 'HDP-P1', type: 'primary', wardId: 'WD002', zoneId: 'ZN003', assignedTruckId: 'TRK005', totalPickupPoints: 35, estimatedDistance: 22, estimatedTime: 180, status: 'active' },
  { id: 'RT003', name: 'Viman Nagar Secondary Route', code: 'VMN-S1', type: 'secondary', wardId: 'WD003', zoneId: 'ZN003', assignedTruckId: 'TRK002', totalPickupPoints: 18, estimatedDistance: 10, estimatedTime: 90, status: 'active' },
  { id: 'RT004', name: 'Aundh Primary Route 1', code: 'AND-P1', type: 'primary', wardId: 'WD005', zoneId: 'ZN001', assignedTruckId: 'TRK004', totalPickupPoints: 28, estimatedDistance: 18, estimatedTime: 150, status: 'active' },
  { id: 'RT005', name: 'Baner Secondary Route', code: 'BNR-S1', type: 'secondary', wardId: 'WD006', zoneId: 'ZN001', totalPickupPoints: 22, estimatedDistance: 12, estimatedTime: 100, status: 'active' }
];

export const mockPickupPoints: PickupPoint[] = [
  { id: 'PP001', binId: 'BIN001', name: 'Kharadi IT Park', address: 'EON IT Park, Kharadi', latitude: 18.5520, longitude: 73.9490, routeId: 'RT001', wardId: 'WD001', wasteType: 'dry', expectedPickupTime: '06:30', geofenceRadius: 30, hasSensor: true, status: 'active' },
  { id: 'PP002', binId: 'BIN002', name: 'World Trade Center', address: 'WTC, Kharadi', latitude: 18.5535, longitude: 73.9502, routeId: 'RT001', wardId: 'WD001', wasteType: 'mixed', expectedPickupTime: '06:45', geofenceRadius: 25, hasSensor: true, status: 'active' },
  { id: 'PP003', binId: 'BIN003', name: 'Hadapsar Industrial Estate', address: 'MIDC Hadapsar', latitude: 18.5010, longitude: 73.9350, routeId: 'RT002', wardId: 'WD002', wasteType: 'hazardous', expectedPickupTime: '07:00', geofenceRadius: 40, hasSensor: true, status: 'active' },
  { id: 'PP004', binId: 'BIN004', name: 'Viman Nagar Garden', address: 'Viman Nagar Park', latitude: 18.5680, longitude: 73.9150, routeId: 'RT003', wardId: 'WD003', wasteType: 'wet', expectedPickupTime: '05:30', geofenceRadius: 20, hasSensor: false, status: 'active' },
  { id: 'PP005', binId: 'BIN005', name: 'Aundh IT Hub', address: 'Aundh IT Park', latitude: 18.5890, longitude: 73.8150, routeId: 'RT004', wardId: 'WD005', wasteType: 'dry', expectedPickupTime: '06:00', geofenceRadius: 35, hasSensor: true, status: 'overflow' }
];

// Escalation Configuration
export interface EscalationLevel {
  level: number;
  role: string;
  name: string;
  email: string;
  phone: string;
  timeoutMinutes: number;
}

export interface EscalationConfig {
  enabled: boolean;
  levels: EscalationLevel[];
}

export const defaultEscalationConfig: EscalationConfig = {
  enabled: true,
  levels: [
    { level: 1, role: 'Supervisor', name: 'Zone Supervisor', email: 'supervisor@municipal.gov', phone: '+91 9111222333', timeoutMinutes: 15 },
    { level: 2, role: 'Manager', name: 'Area Manager', email: 'manager@municipal.gov', phone: '+91 9111222334', timeoutMinutes: 30 },
    { level: 3, role: 'Admin', name: 'City Admin', email: 'admin@municipal.gov', phone: '+91 9111222335', timeoutMinutes: 60 }
  ]
};

// Ticket Types
export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketCategory = 'complaint' | 'maintenance' | 'driver_issue' | 'vehicle_issue' | 'route_issue' | 'bin_issue' | 'other';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  assignedTo?: string;
  createdBy: string;
  relatedAlertId?: string;
  relatedTruckId?: string;
  relatedDriverId?: string;
  escalationLevel: number;
  slaBreached: boolean;
  comments: TicketComment[];
}

export interface TicketComment {
  id: string;
  ticketId: string;
  author: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

export const mockTickets: Ticket[] = [
  {
    id: 'TKT001',
    title: 'Truck MH12 AB 1234 - Repeated Route Deviation',
    description: 'Driver has deviated from assigned route 3 times this week. Need investigation.',
    category: 'driver_issue',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2024-03-10T08:30:00Z',
    updatedAt: '2024-03-10T14:20:00Z',
    dueDate: '2024-03-11T17:00:00Z',
    assignedTo: 'Zone Supervisor',
    createdBy: 'System',
    relatedTruckId: 'TRK001',
    relatedDriverId: 'DRV001',
    escalationLevel: 1,
    slaBreached: false,
    comments: [
      { id: 'CMT001', ticketId: 'TKT001', author: 'System', content: 'Auto-generated from alert ALT-2024-0156', createdAt: '2024-03-10T08:30:00Z', isInternal: true },
      { id: 'CMT002', ticketId: 'TKT001', author: 'Zone Supervisor', content: 'Contacted driver. Says GPS was malfunctioning.', createdAt: '2024-03-10T14:20:00Z', isInternal: false }
    ]
  },
  {
    id: 'TKT002',
    title: 'Bin Overflow at Kharadi IT Park',
    description: 'Multiple citizen complaints about overflowing bin. Need immediate attention.',
    category: 'bin_issue',
    priority: 'critical',
    status: 'open',
    createdAt: '2024-03-10T10:15:00Z',
    updatedAt: '2024-03-10T10:15:00Z',
    dueDate: '2024-03-10T14:00:00Z',
    createdBy: 'Twitter Integration',
    relatedAlertId: 'ALT-2024-0160',
    escalationLevel: 0,
    slaBreached: true,
    comments: [
      { id: 'CMT003', ticketId: 'TKT002', author: 'Twitter Integration', content: 'Generated from negative tweet @MunicipalGC', createdAt: '2024-03-10T10:15:00Z', isInternal: true }
    ]
  },
  {
    id: 'TKT003',
    title: 'Vehicle TRK003 - Scheduled Maintenance Overdue',
    description: 'Vehicle fitness certificate expires in 5 days. Maintenance required.',
    category: 'maintenance',
    priority: 'medium',
    status: 'pending',
    createdAt: '2024-03-09T09:00:00Z',
    updatedAt: '2024-03-10T11:30:00Z',
    dueDate: '2024-03-12T17:00:00Z',
    assignedTo: 'Fleet Manager',
    createdBy: 'System',
    relatedTruckId: 'TRK003',
    escalationLevel: 1,
    slaBreached: false,
    comments: [
      { id: 'CMT004', ticketId: 'TKT003', author: 'System', content: 'Auto-generated maintenance reminder', createdAt: '2024-03-09T09:00:00Z', isInternal: true },
      { id: 'CMT005', ticketId: 'TKT003', author: 'Fleet Manager', content: 'Scheduled for service on March 11', createdAt: '2024-03-10T11:30:00Z', isInternal: false }
    ]
  },
  {
    id: 'TKT004',
    title: 'Citizen Complaint - Missed Pickup at Hadapsar',
    description: 'Resident reported garbage not collected for 2 days at Hadapsar Industrial Estate',
    category: 'complaint',
    priority: 'high',
    status: 'resolved',
    createdAt: '2024-03-08T14:00:00Z',
    updatedAt: '2024-03-09T16:45:00Z',
    dueDate: '2024-03-09T14:00:00Z',
    assignedTo: 'Zone Supervisor',
    createdBy: 'Call Center',
    escalationLevel: 0,
    slaBreached: false,
    comments: [
      { id: 'CMT006', ticketId: 'TKT004', author: 'Call Center', content: 'Citizen call received. Ticket created.', createdAt: '2024-03-08T14:00:00Z', isInternal: false },
      { id: 'CMT007', ticketId: 'TKT004', author: 'Zone Supervisor', content: 'Dispatched backup truck. Issue resolved.', createdAt: '2024-03-09T16:45:00Z', isInternal: false }
    ]
  },
  {
    id: 'TKT005',
    title: 'Route Optimization Request - Aundh Area',
    description: 'Current route takes 30 mins longer than estimated. Need route review.',
    category: 'route_issue',
    priority: 'low',
    status: 'closed',
    createdAt: '2024-03-05T11:00:00Z',
    updatedAt: '2024-03-07T15:30:00Z',
    dueDate: '2024-03-10T17:00:00Z',
    assignedTo: 'Route Planner',
    createdBy: 'Driver Feedback',
    relatedTruckId: 'TRK004',
    escalationLevel: 0,
    slaBreached: false,
    comments: [
      { id: 'CMT008', ticketId: 'TKT005', author: 'Driver', content: 'Traffic congestion near school during morning hours', createdAt: '2024-03-05T11:00:00Z', isInternal: false },
      { id: 'CMT009', ticketId: 'TKT005', author: 'Route Planner', content: 'Route optimized. Start time adjusted to 5:30 AM', createdAt: '2024-03-07T15:30:00Z', isInternal: false }
    ]
  }
];

// SLA Configuration
export interface SLAConfig {
  priority: TicketPriority;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
}

export const defaultSLAConfig: SLAConfig[] = [
  { priority: 'critical', responseTimeMinutes: 15, resolutionTimeMinutes: 120 },
  { priority: 'high', responseTimeMinutes: 30, resolutionTimeMinutes: 240 },
  { priority: 'medium', responseTimeMinutes: 60, resolutionTimeMinutes: 480 },
  { priority: 'low', responseTimeMinutes: 120, resolutionTimeMinutes: 1440 }
];
