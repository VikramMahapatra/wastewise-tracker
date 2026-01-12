import { 
  LayoutDashboard, 
  Truck, 
  Map, 
  FileText, 
  AlertTriangle,
  Settings,
  MapPin,
  Users,
  BarChart3,
  Twitter,
  Database,
  Ticket,
  User,
  Building2,
  Route,
  Wrench
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Fleet', url: '/fleet', icon: Truck },
  { title: 'Spare Vehicles', url: '/spare-vehicles', icon: Wrench },
  { title: 'Routes', url: '/routes', icon: Map },
  { title: 'Pickup Points', url: '/pickup-points', icon: MapPin },
  { title: 'Alerts', url: '/alerts', icon: AlertTriangle },
  { title: 'Reports', url: '/reports', icon: FileText },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Twitter Mentions', url: '/twitter', icon: Twitter },
  { title: 'Tickets', url: '/tickets', icon: Ticket },
  { title: 'Users', url: '/users', icon: Users },
  { title: 'Settings', url: '/settings', icon: Settings },
];

const masterItems = [
  { title: 'Drivers', url: '/master/drivers', icon: User },
  { title: 'Vendors', url: '/master/vendors', icon: Building2 },
  { title: 'Trucks', url: '/master/trucks', icon: Truck },
  { title: 'Zones & Wards', url: '/master/zones-wards', icon: MapPin },
  { title: 'Routes & Pickups', url: '/master/routes-pickups', icon: Route },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Fleet Tracking</span>
              <span className="text-xs text-muted-foreground">Municipal System</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'}
                      className="flex items-center gap-3 hover:bg-muted/50 rounded-md"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Database className="h-3 w-3" /> Master Entries
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {masterItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className="flex items-center gap-3 hover:bg-muted/50 rounded-md"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
