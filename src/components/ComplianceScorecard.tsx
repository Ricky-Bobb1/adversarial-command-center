
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, CheckCircle, AlertTriangle, XCircle, HelpCircle, TrendingUp, TrendingDown, Users, Lock, Monitor, Activity } from "lucide-react";
import { formatPercentage } from "@/utils/formatters";
import type { LogEntry } from "@/types/simulation";

interface ComplianceScorecardProps {
  logs: LogEntry[];
}

interface ComplianceMetric {
  category: string;
  score: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
  requirements: string[];
  icon: React.ReactNode;
  helpText: string;
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
        requirements: ['Security Officer Assignment', 'Workforce Training', 'Access Management'],
        icon: <Users className="h-5 w-5" />,
        helpText: 'Administrative safeguards are policies and procedures designed to clearly show how the entity will comply with the act.'
      },
      {
        category: 'Physical Safeguards',
        score: logs.filter(log => log.action.includes('device')).length > 0 ? 85 : 95,
        status: 'good',
        requirements: ['Facility Access Controls', 'Workstation Security', 'Device Controls'],
        icon: <Lock className="h-5 w-5" />,
        helpText: 'Physical safeguards are physical measures, policies, and procedures to protect electronic information systems and related buildings and equipment.'
      },
      {
        category: 'Technical Safeguards',
        score: Math.min(100, (successfulBlocks / Math.max(1, successfulAttacks)) * 80 + 20),
        status: successfulBlocks >= successfulAttacks ? 'excellent' : 'needs-improvement',
        requirements: ['Access Control', 'Audit Controls', 'Integrity', 'Transmission Security'],
        icon: <Monitor className="h-5 w-5" />,
        helpText: 'Technical safeguards are technology controls and system access controls that protect and control access to health information.'
      },
      {
        category: 'Incident Response',
        score: Math.min(100, (detectionEvents / Math.max(1, totalLogs)) * 100 + 60),
        status: detectionEvents >= 3 ? 'excellent' : detectionEvents >= 1 ? 'good' : 'critical',
        requirements: ['Detection Capabilities', 'Response Time', 'Containment Procedures'],
        icon: <Activity className="h-5 w-5" />,
        helpText: 'Incident response procedures for addressing security incidents and breaches of unsecured PHI.'
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

  const getOverallStatus = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 80) return { label: 'Good', color: 'text-blue-600' };
    if (score >= 70) return { label: 'Needs Attention', color: 'text-orange-600' };
    return { label: 'Critical', color: 'text-red-600' };
  };

  const generateActionItems = (metrics: ComplianceMetric[]) => {
    const actions: string[] = [];
    
    metrics.forEach(metric => {
      if (metric.status === 'critical' || metric.status === 'needs-improvement') {
        switch (metric.category) {
          case 'Administrative Safeguards':
            actions.push('Conduct security awareness training for all staff');
            actions.push('Review and update security policies and procedures');
            break;
          case 'Physical Safeguards':
            actions.push('Implement stronger workstation access controls');
            actions.push('Review facility access logs and permissions');
            break;
          case 'Technical Safeguards':
            actions.push('Enhance network monitoring and intrusion detection');
            actions.push('Implement multi-factor authentication');
            break;
          case 'Incident Response':
            actions.push('Develop formal incident response procedures');
            actions.push('Conduct incident response training and drills');
            break;
        }
      }
    });

    return actions.slice(0, 5); // Limit to top 5 actions
  };

  const metrics = calculateComplianceMetrics();
  const overallScore = Math.round(metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length);
  const overallStatus = getOverallStatus(overallScore);
  const actionItems = generateActionItems(metrics);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              HIPAA Compliance Scorecard
            </CardTitle>
            
            {/* Enhanced Overall Score Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
              <div className="flex flex-col items-center gap-3">
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatPercentage(overallScore)}
                </div>
                <Badge className={`${getStatusColor(overallScore >= 90 ? 'excellent' : overallScore >= 80 ? 'good' : overallScore >= 70 ? 'needs-improvement' : 'critical')} text-lg px-4 py-2`}>
                  {overallStatus.label}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4" />
                  Overall Compliance Score
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">{metric.icon}</div>
                    <span className="font-semibold text-lg">{metric.category}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{metric.helpText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{formatPercentage(metric.score)}</span>
                    {getStatusIcon(metric.status)}
                    <Badge variant="outline" className={getStatusColor(metric.status)}>
                      {metric.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <Progress value={metric.score} className="h-3" />
                
                <div>
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Key Requirements:</span>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {metric.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Items Section */}
        {actionItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                Recommended Action Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {actionItems.map((action, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                    <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};
