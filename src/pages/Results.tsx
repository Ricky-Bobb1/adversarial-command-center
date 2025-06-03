
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Download, Eye, BarChart3 } from "lucide-react";

const Results = () => {
  const results = [
    { 
      id: 1, 
      name: "Adversarial Training #234", 
      status: "Completed", 
      date: "2024-06-03 14:30",
      duration: "45:23",
      success_rate: "94.2%",
      severity: "Medium"
    },
    { 
      id: 2, 
      name: "Defense Stress Test #445", 
      status: "Completed", 
      date: "2024-06-03 09:15",
      duration: "1:12:45",
      success_rate: "87.8%",
      severity: "High"
    },
    { 
      id: 3, 
      name: "Multi-Agent Coordination", 
      status: "Failed", 
      date: "2024-06-02 16:22",
      duration: "23:11",
      success_rate: "12.5%",
      severity: "Critical"
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Results</h1>
          <p className="text-gray-600 mt-2">View and analyze simulation results and insights</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Simulations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">247</div>
            <p className="text-sm text-gray-500">+12 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">91.3%</div>
            <p className="text-sm text-gray-500">+2.1% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Avg Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">42m</div>
            <p className="text-sm text-gray-500">-5m from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Results
          </CardTitle>
          <CardDescription>Latest simulation outcomes and analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{result.name}</h3>
                    <p className="text-sm text-gray-500">Completed on {result.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={result.status === "Completed" ? "default" : "destructive"}
                      className={result.status === "Completed" ? "bg-green-100 text-green-800" : ""}
                    >
                      {result.status}
                    </Badge>
                    <Badge className={getSeverityColor(result.severity)}>
                      {result.severity}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Duration</span>
                    <p className="font-medium">{result.duration}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Success Rate</span>
                    <p className="font-medium">{result.success_rate}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Severity</span>
                    <p className="font-medium">{result.severity}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    Analytics
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
