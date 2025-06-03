
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Database, Shield, Network } from "lucide-react";

const Setup = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Setup</h1>
        <p className="text-gray-600 mt-2">Configure your adversarial AI system environment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              Environment Configuration
            </CardTitle>
            <CardDescription>Set up the simulation environment parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Configure Data Sources
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Set Environment Variables
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Initialize Databases
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Set Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Configure Permissions
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Enable Audit Logging
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-purple-500" />
              Network Configuration
            </CardTitle>
            <CardDescription>Set up network and communication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Configure API Endpoints
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Set Network Policies
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Test Connectivity
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-500" />
              System Initialization
            </CardTitle>
            <CardDescription>Initialize and validate system components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Run System Checks
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Validate Configuration
            </Button>
            <Button className="w-full">
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Setup;
