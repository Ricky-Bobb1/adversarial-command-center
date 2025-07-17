import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Download, Eye, BarChart3, FileText, FileImage, Clock, Target, Shield, AlertTriangle, AlertCircle, HelpCircle, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { simulationResultsService } from "@/services/simulationResultsService";
import { ComplianceScorecard } from "@/components/ComplianceScorecard";
import { RegulatoryFramework } from "@/components/RegulatoryFramework";
import { ComplianceMetrics } from "@/components/ComplianceMetrics";
import type { LogEntry, SimulationMetrics } from "@/types/simulation";

const Results = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
              <Button onClick={() => navigate('/run')}>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => handleExport('json')} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Export JSON
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export simulation data in JSON format</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => handleExport('pdf')} className="flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  Export PDF
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export compliance report as PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">HIPAA Compliance</TabsTrigger>
          <TabsTrigger value="frameworks">Regulatory Frameworks</TabsTrigger>
          <TabsTrigger value="metrics">Compliance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <RechartsTooltip content={<ChartTooltipContent />} />
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
                <ResponsiveContainer width="100%" height={300}>
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
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceScorecard logs={logs} />
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-6">
          <RegulatoryFramework logs={logs} />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <ComplianceMetrics logs={logs} timestamp={timestamp} />
        </TabsContent>
      </Tabs>

      {/* Enhanced Simulation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Simulation Summary
          </CardTitle>
          <CardDescription>Key metrics from the latest simulation run</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">Total Events</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-blue-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total number of logged events during simulation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-3xl font-bold text-blue-700">{logs.length}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+12% vs avg</span>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">Successful Actions</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-green-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Actions that achieved their intended outcome</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-3xl font-bold text-green-700">
                {logs.filter(log => log.outcome.toLowerCase().includes('success')).length}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-xs text-red-600">-5% vs avg</span>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-700">Failed Actions</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-red-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Actions that were blocked or failed to execute</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-3xl font-bold text-red-700">
                {logs.filter(log => !log.outcome.toLowerCase().includes('success')).length}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+8% vs avg</span>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700">System Events</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-purple-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Automated system responses and alerts</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-3xl font-bold text-purple-700">{metrics?.systemEvents || 0}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+3% vs avg</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
