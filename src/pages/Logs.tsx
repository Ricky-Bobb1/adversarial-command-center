
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Search, Filter, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { simulationResultsService } from "@/services/simulationResultsService";
import type { LogEntry } from "@/types/simulation";

const ITEMS_PER_PAGE = 20;

const Logs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [agentFilter, setAgentFilter] = useState("all");
  const [outcomeFilter, setOutcomeFilter] = useState("all");
  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load logs from simulation results
  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true);
        const latestResult = simulationResultsService.getLatestResult();
        if (latestResult && latestResult.logs) {
          setAllLogs(latestResult.logs);
        } else {
          setAllLogs([]);
        }
      } catch (error) {
        toast({
          title: "Failed to Load Logs",
          description: "Could not load simulation logs",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, [toast]);

  // Memoized filtered logs
  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           log.outcome.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesAgent = agentFilter === "all" || log.agent === agentFilter;
      const matchesOutcome = outcomeFilter === "all" || 
        (outcomeFilter === "success" && log.outcome.toLowerCase().includes('success')) ||
        (outcomeFilter === "fail" && !log.outcome.toLowerCase().includes('success'));
      
      return matchesSearch && matchesAgent && matchesOutcome;
    });
  }, [allLogs, debouncedSearchTerm, agentFilter, outcomeFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, agentFilter, outcomeFilter]);

  // Pagination
  const {
    currentData: paginatedLogs,
    totalPages,
    hasNextPage,
    hasPreviousPage
  } = usePagination({
    data: filteredLogs,
    itemsPerPage: ITEMS_PER_PAGE,
    currentPage
  });

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case "Red": return "bg-red-100 text-red-800";
      case "Blue": return "bg-blue-100 text-blue-800";
      case "System": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getOutcomeColor = (outcome: string) => {
    return outcome.toLowerCase().includes('success') 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const handleDownloadCSV = async () => {
    try {
      const headers = ["Timestamp", "Agent", "Action", "Outcome"];
      const csvContent = [
        headers.join(","),
        ...filteredLogs.map(log => [
          log.timestamp,
          log.agent,
          `"${log.action}"`,
          `"${log.outcome}"`
        ].join(","))
      ].join("\n");

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
    } catch (error) {
      toast({
        title: "Export Failed", 
        description: "Could not export logs to CSV",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading logs...</p>
        </div>
      </div>
    );
  }

  if (allLogs.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulation Logs</h1>
          <p className="text-gray-600 mt-2">Detailed logs from simulation runs</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Simulation Data</h3>
              <p className="text-gray-600 mb-4">
                Run a simulation first to see logs here. Go to the Run Simulation page to start.
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulation Logs</h1>
          <p className="text-gray-600 mt-2">Detailed logs from the latest simulation run</p>
        </div>
        <Button 
          onClick={handleDownloadCSV} 
          className="flex items-center gap-2"
          aria-label="Download logs as CSV file"
        >
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
                placeholder="Search actions or outcomes..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search logs by action or outcome"
              />
            </div>
            
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger aria-label="Filter by agent type">
                <SelectValue placeholder="All Agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="Red">Red Agent</SelectItem>
                <SelectItem value="Blue">Blue Agent</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
              <SelectTrigger aria-label="Filter by outcome">
                <SelectValue placeholder="All Outcomes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="fail">Fail</SelectItem>
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
          <CardDescription>Detailed activity log from the latest simulation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No logs match your current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log, index) => (
                    <TableRow key={`${log.timestamp}-${index}`}>
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
                        <Badge className={getOutcomeColor(log.outcome)}>
                          {log.outcome}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={!hasPreviousPage}
                  aria-label="Go to previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!hasNextPage}
                  aria-label="Go to next page"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {allLogs.length}
              </div>
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
                {allLogs.length > 0 ? 
                  ((allLogs.filter(log => log.outcome.toLowerCase().includes('success')).length / allLogs.length) * 100).toFixed(1)
                  : 0}%
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
