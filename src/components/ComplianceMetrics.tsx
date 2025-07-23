
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Shield, AlertTriangle, Activity, TrendingUp } from "lucide-react";
import { formatPercentage } from "@/utils/formatters";
import type { LogEntry } from "@/types/simulation";

interface ComplianceMetricsProps {
  logs: LogEntry[];
  timestamp: string;
}

export const ComplianceMetrics = ({ logs, timestamp }: ComplianceMetricsProps) => {
  const calculateMetrics = () => {
    const redActions = logs.filter(log => log.agent === 'Red');
    const blueActions = logs.filter(log => log.agent === 'Blue');
    const detectionEvents = blueActions.filter(log => 
      log.outcome.toLowerCase().includes('detected') || 
      log.outcome.toLowerCase().includes('alert')
    );
    const successfulAttacks = redActions.filter(log => 
      log.outcome.toLowerCase().includes('success') ||
      log.outcome.toLowerCase().includes('gained') ||
      log.outcome.toLowerCase().includes('accessed')
    );
    const dataBreachEvents = logs.filter(log => 
      log.action.toLowerCase().includes('data') || 
      log.action.toLowerCase().includes('exfiltration')
    );

    // Calculate MTTD (Mean Time to Detection) - simplified calculation
    const avgDetectionTime = detectionEvents.length > 0 ? 
      Math.round((logs.length / detectionEvents.length) * 30) : 0; // seconds

    // Calculate MTTR (Mean Time to Response) - simplified calculation  
    const responseEvents = blueActions.filter(log => 
      log.outcome.toLowerCase().includes('blocked') ||
      log.outcome.toLowerCase().includes('isolated')
    );
    const avgResponseTime = responseEvents.length > 0 ? 
      Math.round((logs.length / responseEvents.length) * 45) : 0; // seconds

    return {
      mttd: avgDetectionTime,
      mttr: avgResponseTime,
      attackSuccessRate: redActions.length > 0 ? 
        Math.round((successfulAttacks.length / redActions.length) * 100) : 0,
      criticalAssetExposure: dataBreachEvents.length,
      dataBreachRisk: dataBreachEvents.filter(log => 
        log.outcome.toLowerCase().includes('success')
      ).length > 0 ? 'High' : dataBreachEvents.length > 0 ? 'Medium' : 'Low',
      complianceScore: Math.round(
        ((detectionEvents.length / Math.max(1, redActions.length)) * 30) +
        ((responseEvents.length / Math.max(1, detectionEvents.length)) * 35) +
        (Math.max(0, 100 - (successfulAttacks.length * 10)) * 0.35)
      )
    };
  };

  const metrics = calculateMetrics();

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            MTTD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{metrics.mttd}s</div>
          <p className="text-sm text-gray-500">Mean Time to Detection</p>
          <Badge variant="outline" className="mt-2">
            {metrics.mttd <= 30 ? 'Excellent' : metrics.mttd <= 60 ? 'Good' : 'Needs Improvement'}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            MTTR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{metrics.mttr}s</div>
          <p className="text-sm text-gray-500">Mean Time to Response</p>
          <Badge variant="outline" className="mt-2">
            {metrics.mttr <= 45 ? 'Excellent' : metrics.mttr <= 90 ? 'Good' : 'Needs Improvement'}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-red-600" />
            Attack Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{formatPercentage(metrics.attackSuccessRate)}</div>
          <p className="text-sm text-gray-500">Successful attacks vs total</p>
          <Badge variant="outline" className="mt-2">
            {metrics.attackSuccessRate <= 20 ? 'Excellent' : metrics.attackSuccessRate <= 40 ? 'Good' : 'Critical'}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Critical Asset Exposure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">{metrics.criticalAssetExposure}</div>
          <p className="text-sm text-gray-500">Data access attempts</p>
          <Badge variant="outline" className="mt-2">
            {metrics.criticalAssetExposure === 0 ? 'Secure' : metrics.criticalAssetExposure <= 2 ? 'Monitored' : 'At Risk'}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Data Breach Risk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{metrics.dataBreachRisk}</div>
          <p className="text-sm text-gray-500">Overall breach likelihood</p>
          <Badge className={getRiskBadgeColor(metrics.dataBreachRisk) + " mt-2"}>
            {metrics.dataBreachRisk} Risk
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-indigo-600">{formatPercentage(metrics.complianceScore)}</div>
          <p className="text-sm text-gray-500">Overall regulatory alignment</p>
          <Badge variant="outline" className="mt-2">
            {metrics.complianceScore >= 80 ? 'Compliant' : metrics.complianceScore >= 60 ? 'Partial' : 'Non-Compliant'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
