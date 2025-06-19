
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { LogEntry } from "@/types/simulation";

interface ComplianceScorecardProps {
  logs: LogEntry[];
}

interface ComplianceMetric {
  category: string;
  score: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
  requirements: string[];
}

export const ComplianceScorecard = ({ logs }: ComplianceScorecardProps) => {
  const calculateComplianceMetrics = (): ComplianceMetric[] => {
    const totalLogs = logs.length;
    const successfulAttacks = logs.filter(log => 
      log.agent === 'Red' && log.outcome.toLowerCase().includes('success')
    ).length;
    const successfulBlocks = logs.filter(log => 
      log.agent === 'Blue' && log.outcome.toLowerCase().includes('success')
    ).length;
    const detectionEvents = logs.filter(log => 
      log.agent === 'Blue' && log.outcome.toLowerCase().includes('detected')
    ).length;

    return [
      {
        category: 'Administrative Safeguards',
        score: Math.max(0, 100 - (successfulAttacks * 10)),
        status: successfulAttacks <= 2 ? 'excellent' : successfulAttacks <= 4 ? 'good' : 'needs-improvement',
        requirements: ['Security Officer Assignment', 'Workforce Training', 'Access Management']
      },
      {
        category: 'Physical Safeguards',
        score: logs.filter(log => log.action.includes('device')).length > 0 ? 85 : 95,
        status: 'good',
        requirements: ['Facility Access Controls', 'Workstation Security', 'Device Controls']
      },
      {
        category: 'Technical Safeguards',
        score: Math.min(100, (successfulBlocks / Math.max(1, successfulAttacks)) * 80 + 20),
        status: successfulBlocks >= successfulAttacks ? 'excellent' : 'needs-improvement',
        requirements: ['Access Control', 'Audit Controls', 'Integrity', 'Transmission Security']
      },
      {
        category: 'Incident Response',
        score: Math.min(100, (detectionEvents / Math.max(1, totalLogs)) * 100 + 60),
        status: detectionEvents >= 3 ? 'excellent' : detectionEvents >= 1 ? 'good' : 'critical',
        requirements: ['Detection Capabilities', 'Response Time', 'Containment Procedures']
      }
    ];
  };

  const getStatusIcon = (status: ComplianceMetric['status']) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'needs-improvement':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: ComplianceMetric['status']) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs-improvement':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const metrics = calculateComplianceMetrics();
  const overallScore = Math.round(metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          HIPAA Compliance Scorecard
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-blue-600">{overallScore}%</div>
          <Badge className={getStatusColor(overallScore >= 90 ? 'excellent' : overallScore >= 80 ? 'good' : overallScore >= 70 ? 'needs-improvement' : 'critical')}>
            Overall Compliance Score
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(metric.status)}
                <span className="font-medium">{metric.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{metric.score}%</span>
                <Badge variant="outline" className={getStatusColor(metric.status)}>
                  {metric.status.replace('-', ' ')}
                </Badge>
              </div>
            </div>
            <Progress value={metric.score} className="h-2" />
            <div className="text-sm text-gray-600">
              Key requirements: {metric.requirements.join(', ')}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
