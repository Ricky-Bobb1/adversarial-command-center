
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { BarChart3, Users, Activity, Settings, Shield, Clock, Target } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Janet</h1>
        <p className="text-gray-600 mt-2">Ready to secure your AI systems? Let's get started.</p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Nodes Configured</CardTitle>
            <Settings className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500">Production environments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Last Simulation Date</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">June 2</div>
            <p className="text-xs text-gray-500">2024, 14:30 UTC</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Agent Models Used</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">Active model variants</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Getting Started Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Complete these steps to set up your adversarial testing environment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox id="define-nodes" defaultChecked />
              <label htmlFor="define-nodes" className="flex-1 cursor-pointer">
                <Link to="/setup" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Define Nodes
                </Link>
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox id="configure-agents" />
              <label htmlFor="configure-agents" className="flex-1 cursor-pointer">
                <Link to="/agents" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Configure Agents
                </Link>
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox id="run-simulation" />
              <label htmlFor="run-simulation" className="flex-1 cursor-pointer">
                <Link to="/run" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Run Simulation
                </Link>
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox id="view-results" />
              <label htmlFor="view-results" className="flex-1 cursor-pointer">
                <Link to="/results" className="text-blue-600 hover:text-blue-800 hover:underline">
                  View Results
                </Link>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Insights Section */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Insights</CardTitle>
            <CardDescription>Key metrics from your most recent security assessments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">Top Exploit</p>
                  <p className="text-sm text-red-600">CVE-2024-1234</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Detection Time</p>
                  <p className="text-sm text-blue-600">1.8s average</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Optimize
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Blue Team Success</p>
                  <p className="text-sm text-green-600">87.3% success rate</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
