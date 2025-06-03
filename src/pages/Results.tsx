
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Download, Eye, BarChart3, FileText, FileImage, Clock, Target, Shield, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";

const Results = () => {
  const { toast } = useToast();

  // Mock data for metrics
  const metrics = {
    timeToDetect: "2.3 minutes",
    redScore: 78,
    blueScore: 85,
    nodesCompromised: 12
  };

  // Mock data for timeline chart
  const timelineData = [
    { time: '00:00', redActions: 0, blueActions: 1 },
    { time: '00:30', redActions: 2, blueActions: 1 },
    { time: '01:00', redActions: 5, blueActions: 3 },
    { time: '01:30', redActions: 8, blueActions: 6 },
    { time: '02:00', redActions: 12, blueActions: 10 },
    { time: '02:30', redActions: 15, blueActions: 14 },
    { time: '03:00', redActions: 18, blueActions: 18 },
    { time: '03:30', redActions: 20, blueActions: 22 },
    { time: '04:00', redActions: 22, blueActions: 25 }
  ];

  // Mock data for node heatmap (as bar chart)
  const nodeHeatmapData = [
    { node: 'EMR Server', attacks: 15, severity: 'Critical' },
    { node: 'Database', attacks: 12, severity: 'High' },
    { node: 'Workstation-A', attacks: 8, severity: 'Medium' },
    { node: 'Pharmacy System', attacks: 6, severity: 'High' },
    { node: 'Medical Device', attacks: 4, severity: 'Low' },
    { node: 'Backup Server', attacks: 3, severity: 'Medium' }
  ];

  // Mock data for attack types
  const attackTypesData = [
    { name: 'SQL Injection', value: 35, color: '#ef4444' },
    { name: 'Phishing', value: 25, color: '#f97316' },
    { name: 'Privilege Escalation', value: 20, color: '#eab308' },
    { name: 'Lateral Movement', value: 15, color: '#3b82f6' },
    { name: 'Data Exfiltration', value: 5, color: '#8b5cf6' }
  ];

  const chartConfig = {
    redActions: {
      label: "Red Team Actions",
      color: "#ef4444",
    },
    blueActions: {
      label: "Blue Team Actions", 
      color: "#3b82f6",
    },
  };

  const handleExport = (format: string) => {
    toast({
      title: `Exporting ${format.toUpperCase()}`,
      description: `Simulation results exported as ${format.toUpperCase()} format`,
    });
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Simulation Results</h1>
          <p className="text-gray-600 mt-2">Comprehensive analysis of the latest adversarial simulation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('json')} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export JSON
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')} className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Time to Detect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics.timeToDetect}</div>
            <p className="text-sm text-gray-500">Average detection time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              Red Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{metrics.redScore}%</div>
            <p className="text-sm text-gray-500">Attack success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Blue Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics.blueScore}%</div>
            <p className="text-sm text-gray-500">Defense effectiveness</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Nodes Compromised
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{metrics.nodesCompromised}</div>
            <p className="text-sm text-gray-500">Out of 50 total nodes</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Attack vs Defense Timeline</CardTitle>
            <CardDescription>Cumulative actions over simulation time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="redActions" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Red Team Actions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="blueActions" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Blue Team Actions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Attack Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Attack Types Distribution</CardTitle>
            <CardDescription>Breakdown of attack methods used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attackTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {attackTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Node Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Most Targeted Nodes</CardTitle>
          <CardDescription>Number of attacks per infrastructure node</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nodeHeatmapData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="node" type="category" width={100} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm">
                            <span className="text-red-600">Attacks: {payload[0].value}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-600">Severity: {payload[0].payload.severity}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="attacks" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Historical Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Historical Results
          </CardTitle>
          <CardDescription>Previous simulation outcomes and analysis</CardDescription>
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
