
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogEntry {
  id: number;
  timestamp: string;
  agent: "Red" | "Blue";
  action: string;
  targetNode: string;
  result: "Success" | "Fail";
}

const Logs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [agentFilter, setAgentFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

  // Mock log data
  const allLogs: LogEntry[] = [
    {
      id: 1,
      timestamp: "2024-06-03 15:42:18",
      agent: "Red",
      action: "SQL Injection",
      targetNode: "EMR Database",
      result: "Success"
    },
    {
      id: 2,
      timestamp: "2024-06-03 15:42:15",
      agent: "Blue",
      action: "Anomaly Detection",
      targetNode: "EMR Database",
      result: "Fail"
    },
    {
      id: 3,
      timestamp: "2024-06-03 15:41:55",
      agent: "Red",
      action: "Phishing Attack",
      targetNode: "Workstation-A",
      result: "Success"
    },
    {
      id: 4,
      timestamp: "2024-06-03 15:41:52",
      agent: "Blue",
      action: "Email Filtering",
      targetNode: "Mail Server",
      result: "Success"
    },
    {
      id: 5,
      timestamp: "2024-06-03 15:41:32",
      agent: "Red",
      action: "Privilege Escalation",
      targetNode: "Domain Controller",
      result: "Fail"
    },
    {
      id: 6,
      timestamp: "2024-06-03 15:41:28",
      agent: "Blue",
      action: "Access Control",
      targetNode: "Domain Controller",
      result: "Success"
    },
    {
      id: 7,
      timestamp: "2024-06-03 15:40:12",
      agent: "Red",
      action: "Lateral Movement",
      targetNode: "Medical Device",
      result: "Success"
    },
    {
      id: 8,
      timestamp: "2024-06-03 15:40:08",
      agent: "Blue",
      action: "Network Segmentation",
      targetNode: "Medical Device",
      result: "Fail"
    },
    {
      id: 9,
      timestamp: "2024-06-03 15:39:45",
      agent: "Red",
      action: "Data Exfiltration",
      targetNode: "Patient Records",
      result: "Fail"
    },
    {
      id: 10,
      timestamp: "2024-06-03 15:39:42",
      agent: "Blue",
      action: "Data Loss Prevention",
      targetNode: "Patient Records",
      result: "Success"
    },
    {
      id: 11,
      timestamp: "2024-06-03 15:39:25",
      agent: "Red",
      action: "Port Scanning",
      targetNode: "Pharmacy System",
      result: "Success"
    },
    {
      id: 12,
      timestamp: "2024-06-03 15:39:20",
      agent: "Blue",
      action: "Intrusion Detection",
      targetNode: "Pharmacy System",
      result: "Success"
    }
  ];

  // Filter logs based on search term and filters
  const filteredLogs = allLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.targetNode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgent = agentFilter === "all" || log.agent === agentFilter;
    const matchesResult = resultFilter === "all" || log.result === resultFilter;
    
    return matchesSearch && matchesAgent && matchesResult;
  });

  const getAgentColor = (agent: string) => {
    return agent === "Red" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800";
  };

  const getResultColor = (result: string) => {
    return result === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const handleDownloadCSV = () => {
    // Create CSV content
    const headers = ["Timestamp", "Agent", "Action", "Target Node", "Result"];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.agent,
        `"${log.action}"`,
        `"${log.targetNode}"`,
        log.result
      ].join(","))
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `simulation-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "CSV Downloaded",
      description: `Downloaded ${filteredLogs.length} log entries as CSV`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulation Logs</h1>
          <p className="text-gray-600 mt-2">Detailed logs from simulation runs with filtering and search</p>
        </div>
        <Button onClick={handleDownloadCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>Filter and search through simulation logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search actions or nodes..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="Red">Red Agent</SelectItem>
                <SelectItem value="Blue">Blue Agent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Fail">Fail</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-center">
              <Badge variant="outline">
                {filteredLogs.length} of {allLogs.length} entries
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Simulation Log Entries
          </CardTitle>
          <CardDescription>Detailed activity log from agent simulations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target Node</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No logs match your current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {log.timestamp}
                      </TableCell>
                      <TableCell>
                        <Badge className={getAgentColor(log.agent)}>
                          {log.agent}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.action}
                      </TableCell>
                      <TableCell>
                        {log.targetNode}
                      </TableCell>
                      <TableCell>
                        <Badge className={getResultColor(log.result)}>
                          {log.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{allLogs.length}</div>
              <div className="text-sm text-gray-500">Total Entries</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {allLogs.filter(log => log.agent === "Red").length}
              </div>
              <div className="text-sm text-gray-500">Red Actions</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {allLogs.filter(log => log.agent === "Blue").length}
              </div>
              <div className="text-sm text-gray-500">Blue Actions</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {((allLogs.filter(log => log.result === "Success").length / allLogs.length) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Logs;
