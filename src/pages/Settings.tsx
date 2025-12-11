import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Twitter, 
  Bell, 
  Map, 
  Truck, 
  Shield, 
  Database,
  Save,
  RefreshCw,
  MessageCircle
} from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();
  
  // Twitter Settings
  const [twitterHandle, setTwitterHandle] = useState('@MunicipalGC');
  const [twitterEnabled, setTwitterEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('5');
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState('high');
  
  // Map Settings
  const [mapRefreshRate, setMapRefreshRate] = useState('10');
  const [defaultZoom, setDefaultZoom] = useState('12');
  const [showTraffic, setShowTraffic] = useState(true);
  
  // Fleet Settings
  const [idleTimeThreshold, setIdleTimeThreshold] = useState('10');
  const [deviationThreshold, setDeviationThreshold] = useState('200');
  const [gpsUpdateInterval, setGpsUpdateInterval] = useState('30');

  // WhatsApp Templates
  const [driverTemplate, setDriverTemplate] = useState(`Dear Driver,

Alert for Vehicle: {truckId}
Type: {alertType}
Details: {alertMessage}

Please take immediate action and respond to this alert.

Regards,
Municipal Fleet Management`);

  const [vendorTemplate, setVendorTemplate] = useState(`Dear Vendor,

We are notifying you about an alert for your vehicle.

Vehicle: {truckId}
Alert Type: {alertType}
Details: {alertMessage}

Please coordinate with the driver and take necessary action.

Regards,
Municipal Fleet Management`);

  useEffect(() => {
    // Load saved settings
    const savedHandle = localStorage.getItem('twitterTrackedHandle');
    if (savedHandle) setTwitterHandle(savedHandle);
    
    const savedTwitterEnabled = localStorage.getItem('twitterEnabled');
    if (savedTwitterEnabled) setTwitterEnabled(savedTwitterEnabled === 'true');
    
    const savedRefreshInterval = localStorage.getItem('twitterRefreshInterval');
    if (savedRefreshInterval) setRefreshInterval(savedRefreshInterval);

    // Load WhatsApp templates
    const savedDriverTemplate = localStorage.getItem('whatsappDriverTemplate');
    if (savedDriverTemplate) setDriverTemplate(savedDriverTemplate);
    
    const savedVendorTemplate = localStorage.getItem('whatsappVendorTemplate');
    if (savedVendorTemplate) setVendorTemplate(savedVendorTemplate);
  }, []);

  const saveWhatsAppTemplates = () => {
    localStorage.setItem('whatsappDriverTemplate', driverTemplate);
    localStorage.setItem('whatsappVendorTemplate', vendorTemplate);
    
    toast({
      title: "Templates Saved",
      description: "WhatsApp message templates have been updated.",
    });
  };

  const saveTwitterSettings = () => {
    localStorage.setItem('twitterTrackedHandle', twitterHandle);
    localStorage.setItem('twitterEnabled', String(twitterEnabled));
    localStorage.setItem('twitterRefreshInterval', refreshInterval);
    
    toast({
      title: "Settings Saved",
      description: "Twitter tracking settings have been updated.",
    });
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Notification preferences have been updated.",
    });
  };

  const saveMapSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Map settings have been updated.",
    });
  };

  const saveFleetSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Fleet tracking settings have been updated.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure system preferences and parameters</p>
      </div>

      <Tabs defaultValue="twitter" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="twitter" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Twitter
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Map
          </TabsTrigger>
          <TabsTrigger value="fleet" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Fleet
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        {/* Twitter Settings */}
        <TabsContent value="twitter">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                Twitter Integration
              </CardTitle>
              <CardDescription>
                Configure Twitter/X mention tracking settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Twitter Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Track mentions of your configured handle on Twitter/X
                  </p>
                </div>
                <Switch
                  checked={twitterEnabled}
                  onCheckedChange={setTwitterEnabled}
                />
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="twitter-handle">Twitter Handle to Track</Label>
                  <Input
                    id="twitter-handle"
                    placeholder="@YourHandle"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    disabled={!twitterEnabled}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the Twitter handle you want to monitor for mentions
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refresh-interval">Refresh Interval (minutes)</Label>
                  <Select 
                    value={refreshInterval} 
                    onValueChange={setRefreshInterval}
                    disabled={!twitterEnabled}
                  >
                    <SelectTrigger id="refresh-interval">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How often to check for new mentions
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Sentiment Analysis</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-categorize Tweets</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically detect complaints, inquiries, etc.
                      </p>
                    </div>
                    <Switch defaultChecked disabled={!twitterEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sentiment Detection</Label>
                      <p className="text-xs text-muted-foreground">
                        Analyze positive/negative sentiment
                      </p>
                    </div>
                    <Switch defaultChecked disabled={!twitterEnabled} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Alerts</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Alert on Negative Mentions</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified for negative sentiment tweets
                      </p>
                    </div>
                    <Switch defaultChecked disabled={!twitterEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Alert on Violations</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified when violations are reported
                      </p>
                    </div>
                    <Switch defaultChecked disabled={!twitterEnabled} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={saveTwitterSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Twitter Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alert Threshold</Label>
                  <Select value={alertThreshold} onValueChange={setAlertThreshold}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="high">High Priority Only</SelectItem>
                      <SelectItem value="critical">Critical Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={saveNotificationSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Map Settings */}
        <TabsContent value="map">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Map Configuration
              </CardTitle>
              <CardDescription>
                Configure map display and refresh settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Map Refresh Rate (seconds)</Label>
                  <Select value={mapRefreshRate} onValueChange={setMapRefreshRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">60 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Zoom Level</Label>
                  <Select value={defaultZoom} onValueChange={setDefaultZoom}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">City View (10)</SelectItem>
                      <SelectItem value="12">Zone View (12)</SelectItem>
                      <SelectItem value="14">Ward View (14)</SelectItem>
                      <SelectItem value="16">Street View (16)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Traffic Layer</Label>
                  <p className="text-sm text-muted-foreground">
                    Display real-time traffic conditions on map
                  </p>
                </div>
                <Switch
                  checked={showTraffic}
                  onCheckedChange={setShowTraffic}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={saveMapSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Map Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fleet Settings */}
        <TabsContent value="fleet">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Fleet Tracking Configuration
              </CardTitle>
              <CardDescription>
                Configure vehicle tracking thresholds and parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Idle Time Threshold (minutes)</Label>
                  <Input
                    type="number"
                    value={idleTimeThreshold}
                    onChange={(e) => setIdleTimeThreshold(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when vehicle is idle for longer than this
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Route Deviation Threshold (meters)</Label>
                  <Input
                    type="number"
                    value={deviationThreshold}
                    onChange={(e) => setDeviationThreshold(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when vehicle deviates from route by this distance
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>GPS Update Interval (seconds)</Label>
                  <Select value={gpsUpdateInterval} onValueChange={setGpsUpdateInterval}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">60 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How often to receive GPS updates from devices
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={saveFleetSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Fleet Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-logout after inactivity
                    </p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Log all user actions for compliance
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Templates */}
        <TabsContent value="whatsapp">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                WhatsApp Message Templates
              </CardTitle>
              <CardDescription>
                Configure message templates for contacting drivers and vendors via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Available Placeholders</h4>
                  <div className="flex flex-wrap gap-2">
                    <code className="px-2 py-1 bg-muted rounded text-xs">{"{truckId}"}</code>
                    <code className="px-2 py-1 bg-muted rounded text-xs">{"{alertType}"}</code>
                    <code className="px-2 py-1 bg-muted rounded text-xs">{"{alertMessage}"}</code>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="driver-template">Driver Message Template</Label>
                  <Textarea
                    id="driver-template"
                    value={driverTemplate}
                    onChange={(e) => setDriverTemplate(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    This template will be used when sending WhatsApp messages to drivers
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor-template">Vendor Message Template</Label>
                  <Textarea
                    id="vendor-template"
                    value={vendorTemplate}
                    onChange={(e) => setVendorTemplate(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    This template will be used when sending WhatsApp messages to vendors
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={saveWhatsAppTemplates}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
