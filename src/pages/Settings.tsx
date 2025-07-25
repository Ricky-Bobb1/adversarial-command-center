
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, User, Shield, Bell, Database, Globe, Moon, Sun, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [apiEndpoint, setApiEndpoint] = useState("https://api.adversarial-ai.com/v1");
  const [demoMode, setDemoMode] = useState(true);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleResetConfig = () => {
    toast({
      title: "Configuration Reset",
      description: "Node and agent configurations have been reset to defaults.",
    });
  };

  const handleSaveApiConfig = () => {
    toast({
      title: "API Configuration Saved",
      description: "API endpoint has been updated successfully.",
    });
  };

  const exportConfig = () => {
    const config = {
      apiEndpoint,
      demoMode,
      theme,
      timestamp: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Configuration Exported",
      description: "Settings configuration has been downloaded as JSON.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Configure system preferences and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>Configure external API endpoints and connections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input 
                id="api-endpoint" 
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://api.adversarial-ai.com/v1"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Base URL for simulation API calls
              </p>
            </div>
            <Button onClick={handleSaveApiConfig} className="w-full">
              Save API Configuration
            </Button>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              System Preferences
            </CardTitle>
            <CardDescription>Application behavior and display settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Demo Mode</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Use simulated data for demonstrations</p>
              </div>
              <Switch 
                checked={demoMode}
                onCheckedChange={setDemoMode}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <SettingsIcon className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose your preferred color scheme
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>Manage your account and personal preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="admin@adversarial-ai.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input id="organization" defaultValue="AI Security Research Lab" />
            </div>
            <Button className="w-full">Update Profile</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure authentication and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Auto-logout after inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Audit Logging</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Log all user actions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button variant="outline" className="w-full">Change Password</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Manage alerts and notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Simulation Alerts</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Notify when simulations complete</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Security Warnings</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Alert on security events</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Status</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">System health notifications</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Configuration
            </CardTitle>
            <CardDescription>Advanced system and performance settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-agents">Maximum Concurrent Agents</Label>
              <Input id="max-agents" type="number" defaultValue="20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">Simulation Timeout (minutes)</Label>
              <Input id="timeout" type="number" defaultValue="120" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="log-level">Log Level</Label>
              <Input id="log-level" defaultValue="INFO" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-backup</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Automatic data backups</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button variant="outline" className="w-full">Save Configuration</Button>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Configuration Management
          </CardTitle>
          <CardDescription>Reset, export, and manage system configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={handleResetConfig}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Node/Agent Config
            </Button>
            <Button 
              variant="outline" 
              onClick={exportConfig}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Export Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <SettingsIcon className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-300">Reset System Configuration</h3>
              <p className="text-sm text-red-700 dark:text-red-400">This will reset all settings to default values</p>
            </div>
            <Button variant="destructive" size="sm">Reset</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-300">Clear All Data</h3>
              <p className="text-sm text-red-700 dark:text-red-400">Permanently delete all simulation data and logs</p>
            </div>
            <Button variant="destructive" size="sm">Clear Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
