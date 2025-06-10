
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Download, Eye, BarChart3, FileText, FileImage, Clock, Target, Shield, AlertTriangle, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { simulationResultsService } from "@/services/simulationResultsService";
import type { LogEntry, SimulationMetrics } from "@/types/simulation";

const Results = () => {
  const { toast } = useToast();
  const [latestResult, setLatestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResults = () => {
      try {
        setIsLoading(true);
        const result = simulationResultsService.getLatestResult();
        setLatestResult(result);
      } catch (error) {
        toast({
          title: "Failed to Load Results",
          description: "Could not load simulation results",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!latestResult) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulation Results</h1>
          <p className="text-gray-600 mt-2">Comprehensive analysis of adversarial simulations</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Simulation Results</h3>
              <p className="text-gray-600 mb-4">
                Run a simulation first to see results here. Go to the Run Simulation page to start.
              </p>
              <Button onClick={() => window.location.href = '/run'}>
                Run Simulation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { logs, metrics, timestamp, scenario } = latestResult;

  // Generate timeline data from logs
  const timelineData = logs.reduce((acc: any[], log: LogEntry, index: number) => {
    const timePoint = Math.floor(index / 5) * 5; // Group by 5-log intervals
    const existing = acc.find(item => item.time === timePoint);
    
    if (existing) {
      if (log.agent === 'Red') existing.redActions++;
      if (log.agent === 'Blue') existing.blueActions++;
    } else {
      acc.push({
        time: timePoint,
        redActions: log.agent === 'Red' ? 1 : 0,
        blueActions: log.agent === 'Blue' ? 1 : 0,
      });
    }
    return acc;
  }, []);

  // Generate attack types from logs
  const actionCounts = logs.reduce((acc: any, log: LogEntry) => {
    if (log.agent === 'Red') {
      acc[log.action] = (acc[log.action] || 0) + 1;
    }
    return acc;
  }, {});

  const attackTypesData = Object.entries(actionCounts)
    .map(([action, count], index) => ({
      name: action,
      value: count as number,
      color: ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'][index % 5]
    }))
    .slice(0, 5);

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

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  const successRate = logs.length > 0 
    ? ((logs.filter(log => log.outcome.toLowerCase().includes('success')).length / logs.length) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulation Results</h1>
          <p className="text-gray-600 mt-2">
            Analysis of simulation: {scenario} (Run on {formatDate(timestamp)})
          </p>
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
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics?.duration || 0}s</div>
            <p className="text-sm text-gray-500">Simulation runtime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              Red Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{metrics?.redActions || 0}</div>
            <p className="text-sm text-gray-500">Attack attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Blue Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics?.blueActions || 0}</div>
            <p className="text-sm text-gray-500">Defense responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{successRate}%</div>
            <p className="text-sm text-gray-500">Overall success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Attack vs Defense Timeline</CardTitle>
            <CardDescription>Actions over simulation progression</CardDescription>
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
            <CardDescription>Breakdown of red team actions</CardDescription>
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

      {/* Recent Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Simulation Summary
          </CardTitle>
          <CardDescription>Key metrics from the latest simulation run</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-500">Total Events</span>
              <p className="font-medium text-lg">{logs.length}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Successful Actions</span>
              <p className="font-medium text-lg">{logs.filter(log => log.outcome.toLowerCase().includes('success')).length}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Failed Actions</span>
              <p className="font-medium text-lg">{logs.filter(log => !log.outcome.toLowerCase().includes('success')).length}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">System Events</span>
              <p className="font-medium text-lg">{metrics?.systemEvents || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
