
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle, XCircle, Clock } from "lucide-react";
import { adversaApiService } from "@/services/adversaApiService";
import { simulationService } from "@/services/simulationService";
import { environment } from "@/utils/environment";

const ApiStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [apiUrls, setApiUrls] = useState<any>(null);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        if (!environment.enableMockApi && environment.apiBaseUrl) {
          await adversaApiService.healthCheck();
          setStatus('connected');
          setApiUrls(simulationService.getApiDocumentation());
        } else {
          setStatus('disconnected');
        }
      } catch (error) {
        setStatus('disconnected');
      }
    };

    checkApiStatus();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Clock className="h-4 w-4" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking connection...';
      case 'connected':
        return 'Connected to Adversa API';
      case 'disconnected':
        return environment.enableMockApi ? 'Using Mock API' : 'API Disconnected';
    }
  };

  const getBadgeVariant = () => {
    switch (status) {
      case 'checking':
        return 'secondary';
      case 'connected':
        return 'default';
      case 'disconnected':
        return environment.enableMockApi ? 'secondary' : 'destructive';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          API Status
        </CardTitle>
        <CardDescription>
          Connection status to the Adversa Agentic AI API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={getBadgeVariant()}>
            {getStatusText()}
          </Badge>
        </div>

        {status === 'connected' && apiUrls && (
          <div className="space-y-2">
            <h4 className="font-medium">API Documentation:</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(apiUrls.swagger, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Swagger UI
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(apiUrls.redoc, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                ReDoc
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(apiUrls.openapi, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                OpenAPI Schema
              </Button>
            </div>
          </div>
        )}

        {status === 'disconnected' && !environment.enableMockApi && (
          <div className="text-sm text-gray-600">
            <p>To connect to the Adversa API, set the VITE_API_BASE_URL environment variable to your API endpoint.</p>
            <p className="mt-1">Example: https://your-api-id.execute-api.region.amazonaws.com/Prod</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiStatus;
