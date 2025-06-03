
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Filter } from "lucide-react";

const Logs = () => {
  const logs = [
    {
      id: 1,
      timestamp: "2024-06-03 15:42:18",
      level: "INFO",
      component: "Agent-Controller",
      message: "Agent Defender-Alpha successfully initialized with configuration v2.1",
      details: "Agent initialization completed with all security protocols enabled"
    },
    {
      id: 2,
      timestamp: "2024-06-03 15:41:55",
      level: "WARNING",
      component: "Simulation-Engine",
      message: "High memory usage detected during simulation #234",
      details: "Memory usage exceeded 85% threshold, consider optimizing agent parameters"
    },
    {
      id: 3,
      timestamp: "2024-06-03 15:41:32",
      level: "ERROR",
      component: "Network-Monitor",
      message: "Connection timeout to external API endpoint",
      details: "Failed to establish connection to adversarial-api.example.com after 3 retry attempts"
    },
    {
      id: 4,
      timestamp: "2024-06-03 15:40:12",
      level: "DEBUG",
      component: "Data-Processor",
      message: "Processing batch of 1,247 training samples",
      details: "Batch processing initiated for adversarial training dataset batch_2024_06_03_15"
    },
    {
      id: 5,
      timestamp: "2024-06-03 15:39:45",
      level: "INFO",
      component: "Security-Monitor",
      message: "Security scan completed - no threats detected",
      details: "Comprehensive security scan of all active agents and simulation environments completed"
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR": return "bg-red-100 text-red-800";
      case "WARNING": return "bg-yellow-100 text-yellow-800";
      case "INFO": return "bg-blue-100 text-blue-800";
      case "DEBUG": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Logs</h1>
          <p className="text-gray-600 mt-2">Monitor system activity and troubleshoot issues</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search logs..." className="pl-10" />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-500">Total Entries</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-500">Errors</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">12</div>
              <div className="text-sm text-gray-500">Warnings</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.2%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            System Logs
          </CardTitle>
          <CardDescription>Real-time system activity and event logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge className={getLevelColor(log.level)}>
                      {log.level}
                    </Badge>
                    <span className="text-sm text-gray-500">{log.timestamp}</span>
                    <Badge variant="outline" className="text-xs">
                      {log.component}
                    </Badge>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="font-medium text-gray-900">{log.message}</p>
                </div>
                <div className="text-sm text-gray-600">
                  {log.details}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline">Load More Logs</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;
