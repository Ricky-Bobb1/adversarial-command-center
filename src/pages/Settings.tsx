
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, User, Shield, Bell, Database } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure system preferences and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Audit Logging</Label>
                <p className="text-sm text-gray-500">Log all user actions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button variant="outline" className="w-full">Change Password</Button>
          </CardContent>
        </Card>

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
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Simulation Alerts</Label>
                <p className="text-sm text-gray-500">Notify when simulations complete</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Security Warnings</Label>
                <p className="text-sm text-gray-500">Alert on security events</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Status</Label>
                <p className="text-sm text-gray-500">System health notifications</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

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
                <p className="text-sm text-gray-500">Automatic data backups</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button variant="outline" className="w-full">Save Configuration</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <SettingsIcon className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-medium text-red-900">Reset System Configuration</h3>
              <p className="text-sm text-red-700">This will reset all settings to default values</p>
            </div>
            <Button variant="destructive" size="sm">Reset</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-medium text-red-900">Clear All Data</h3>
              <p className="text-sm text-red-700">Permanently delete all simulation data and logs</p>
            </div>
            <Button variant="destructive" size="sm">Clear Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
