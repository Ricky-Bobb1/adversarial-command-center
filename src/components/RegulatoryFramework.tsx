
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Target, Shield, AlertCircle, Activity } from "lucide-react";
import { formatPercentage } from "@/utils/formatters";
import type { LogEntry } from "@/types/simulation";

interface RegulatoryFrameworkProps {
  logs: LogEntry[];
}

interface FrameworkAlignment {
  framework: string;
  icon: React.ReactNode;
  categories: {
    name: string;
    score: number;
    description: string;
  }[];
}

export const RegulatoryFramework = ({ logs }: RegulatoryFrameworkProps) => {
  const calculateNISTAlignment = () => {
    const totalEvents = logs.length;
    const detectionEvents = logs.filter(log => 
      log.agent === 'Blue' && (log.outcome.includes('detected') || log.outcome.includes('alert'))
    ).length;
    const preventionEvents = logs.filter(log => 
      log.agent === 'Blue' && (log.outcome.includes('blocked') || log.outcome.includes('prevented'))
    ).length;
    const responseEvents = logs.filter(log => 
      log.agent === 'Blue' && log.outcome.includes('isolated')
    ).length;

    return [
      {
        name: 'Identify',
        score: Math.min(100, (totalEvents / 5) * 20 + 60),
        description: 'Asset and risk identification through simulation'
      },
      {
        name: 'Protect',
        score: Math.min(100, (preventionEvents / Math.max(1, logs.filter(log => log.agent === 'Red').length)) * 100),
        description: 'Protective measures effectiveness'
      },
      {
        name: 'Detect',
        score: Math.min(100, (detectionEvents / Math.max(1, totalEvents)) * 200),
        description: 'Detection capabilities and monitoring'
      },
      {
        name: 'Respond',
        score: Math.min(100, (responseEvents / Math.max(1, detectionEvents)) * 150),
        description: 'Incident response and containment'
      },
      {
        name: 'Recover',
        score: logs.some(log => log.outcome.includes('isolated')) ? 85 : 60,
        description: 'Recovery and restoration procedures'
      }
    ];
  };

  const calculateHITRUSTAlignment = () => {
    const dataExfiltrationAttempts = logs.filter(log => 
      log.action.includes('data') || log.action.includes('exfiltration')
    ).length;
    const accessControlEvents = logs.filter(log => 
      log.action.includes('access') || log.action.includes('privilege')
    ).length;
    const auditEvents = logs.length; // All logs contribute to audit trail

    return [
      {
        name: 'Information Security Management',
        score: logs.length > 10 ? 90 : 70,
        description: 'Overall security program effectiveness'
      },
      {
        name: 'Access Control',
        score: Math.min(100, 100 - (accessControlEvents * 15)),
        description: 'User access management and controls'
      },
      {
        name: 'Human Resources Security',
        score: 85,
        description: 'Personnel security training effectiveness'
      },
      {
        name: 'Information System Acquisition',
        score: logs.some(log => log.action.includes('device')) ? 75 : 90,
        description: 'System security in acquisition process'
      },
      {
        name: 'Information Access Management',
        score: Math.max(60, 100 - (dataExfiltrationAttempts * 20)),
        description: 'Data access control and monitoring'
      }
    ];
  };

  const frameworks: FrameworkAlignment[] = [
    {
      framework: 'NIST Cybersecurity Framework',
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      categories: calculateNISTAlignment()
    },
    {
      framework: 'HITRUST CSF',
      icon: <FileText className="h-5 w-5 text-green-600" />,
      categories: calculateHITRUSTAlignment()
    }
  ];

  return (
    <div className="space-y-6">
      {frameworks.map((framework, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {framework.icon}
              {framework.framework} Alignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {framework.categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.name}</span>
                  <Badge variant={category.score >= 80 ? 'default' : category.score >= 60 ? 'secondary' : 'destructive'}>
                    {formatPercentage(category.score)}
                  </Badge>
                </div>
                <Progress value={category.score} className="h-2" />
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
