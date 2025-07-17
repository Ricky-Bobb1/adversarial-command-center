import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Save, X, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchMockData, postToMockApi, mockApiEndpoints } from "@/utils/mockApi";
import { unifiedApiService } from "@/services/unifiedApiService";
import { useAppState } from "@/contexts/AppStateContext";
import { environment } from "@/utils/environment";
import { SimulationReadinessCheck } from "@/components/SimulationReadinessCheck";

interface AgentConfig {
  redAgent: {
    model: string;
    strategies: string[];
  };
  blueAgent: {
    model: string;
    strategies: string[];
  };
  humanInTheLoop: boolean;
}

const Agents = () => {
  const { toast } = useToast();
  const { 
    state,
    setAgentConfig,
    updateRedAgent, 
    updateBlueAgent
  } = useAppState();
  
  const [config, setConfig] = useState<AgentConfig>({
    redAgent: { model: "", strategies: [] },
    blueAgent: { model: "", strategies: [] },
    humanInTheLoop: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [supportedModels, setSupportedModels] = useState<string[]>([]);

  const [redStrategyInput, setRedStrategyInput] = useState("");
  const [blueStrategyInput, setBlueStrategyInput] = useState("");

  // Backend-supported LLM models with descriptions (fallback if backend unavailable)
  const modelDescriptions: Record<string, string> = {
    "anthropic.claude-3-sonnet-20240229-v1:0": "Claude 3 Sonnet - Balanced performance for adversarial tasks",
    "anthropic.claude-3-haiku-20240307-v1:0": "Claude 3 Haiku - Fast and efficient for real-time responses", 
    "anthropic.claude-3-opus-20240229-v1:0": "Claude 3 Opus - Most capable for complex attack strategies",
    "cohere.command-r-plus": "Cohere Command R+ - Optimized for reasoning and planning",
    "gpt-4-turbo": "GPT-4 Turbo - Advanced reasoning for sophisticated simulations",
    "gpt-3.5-turbo": "GPT-3.5 Turbo - Efficient and cost-effective option"
  };

  // Load initial agent configuration and supported models
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setIsLoading(true);
        
        // Load agent config from context first, then fallback to localStorage
        let agentData: AgentConfig = {
          redAgent: { model: "", strategies: [] },
          blueAgent: { model: "", strategies: [] },
          humanInTheLoop: false
        };
        
        // If context has agent config, convert from context format to local format
        if (state.agentConfig?.redAgent?.model) {
          agentData.redAgent.model = state.agentConfig.redAgent.model;
          agentData.redAgent.strategies = state.agentConfig.redAgent.strategy ? state.agentConfig.redAgent.strategy.split(', ') : [];
        }
        
        if (state.agentConfig?.blueAgent?.model) {
          agentData.blueAgent.model = state.agentConfig.blueAgent.model;
          agentData.blueAgent.strategies = state.agentConfig.blueAgent.strategy ? state.agentConfig.blueAgent.strategy.split(', ') : [];
        }
        
        // If context is empty, try localStorage
        if (!state.agentConfig?.redAgent?.model && !state.agentConfig?.blueAgent?.model) {
          try {
            const data = await fetchMockData<AgentConfig>('agents');
            agentData = data;
          } catch (error) {
            console.warn('[DEBUG] Could not load from mock data, using defaults');
          }
        }
        
        setConfig(agentData);
        
        // Load supported models from backend
        if (!environment.enableMockApi) {
          console.log('[DEBUG] Loading supported models from backend...');
          const models = await unifiedApiService.getSupportedModels();
          console.log('[DEBUG] Supported models:', models);
          
          // If backend returns empty models, use fallback
          if (!models || models.length === 0) {
            console.log('[DEBUG] Backend returned no models, using fallback models');
            setSupportedModels(Object.keys(modelDescriptions));
          } else {
            setSupportedModels(models);
          }
        } else {
          // Use fallback models in mock mode
          setSupportedModels(Object.keys(modelDescriptions));
        }
      } catch (error) {
        console.error('[DEBUG] Failed to load configuration:', error);
        toast({
          title: "Failed to Load Configuration",
          description: "Could not load existing agent configuration. Using defaults.",
          variant: "destructive",
        });
        
        // Set fallback models
        setSupportedModels(Object.keys(modelDescriptions));
      } finally {
        setIsLoading(false);
      }
    };

    loadConfiguration();
  }, [toast]);

  const addRedStrategy = () => {
    if (redStrategyInput.trim() && !config.redAgent.strategies.includes(redStrategyInput.trim())) {
      setConfig({
        ...config,
        redAgent: {
          ...config.redAgent,
          strategies: [...config.redAgent.strategies, redStrategyInput.trim()]
        }
      });
      setRedStrategyInput("");
    }
  };

  const removeRedStrategy = (strategy: string) => {
    setConfig({
      ...config,
      redAgent: {
        ...config.redAgent,
        strategies: config.redAgent.strategies.filter(s => s !== strategy)
      }
    });
  };

  const addBlueStrategy = () => {
    if (blueStrategyInput.trim() && !config.blueAgent.strategies.includes(blueStrategyInput.trim())) {
      setConfig({
        ...config,
        blueAgent: {
          ...config.blueAgent,
          strategies: [...config.blueAgent.strategies, blueStrategyInput.trim()]
        }
      });
      setBlueStrategyInput("");
    }
  };

  const removeBlueStrategy = (strategy: string) => {
    setConfig({
      ...config,
      blueAgent: {
        ...config.blueAgent,
        strategies: config.blueAgent.strategies.filter(s => s !== strategy)
      }
    });
  };

  const handleRedStrategyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRedStrategy();
    }
  };

  const handleBlueStrategyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBlueStrategy();
    }
  };

  const saveConfiguration = async () => {
    if (!config.redAgent.model || !config.blueAgent.model) {
      toast({
        title: "Configuration Error",
        description: "Please select models for both Red and Blue agents",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Update AppStateContext with new format for backend compatibility
      const contextConfig = {
        redAgent: { 
          model: config.redAgent.model, 
          strategy: config.redAgent.strategies.join(', '),
          prompts: null // Can be extended later for custom prompts
        },
        blueAgent: { 
          model: config.blueAgent.model, 
          strategy: config.blueAgent.strategies.join(', '),
          prompts: null // Can be extended later for custom prompts
        }
      };
      setAgentConfig(contextConfig);
      
      // Save to localStorage for immediate simulation use
      localStorage.setItem('agent-config', JSON.stringify(config));
      console.log('[DEBUG] Saved agent config to localStorage and context:', { config, contextConfig });
      
      // Also save to mock API for backwards compatibility
      await postToMockApi(mockApiEndpoints.agents, config);
      
      toast({
        title: "Configuration Saved",
        description: "Agent configuration has been saved and will be used in simulations.",
      });
    } catch (error) {
      console.warn('[DEBUG] Mock API save failed, but localStorage saved:', error);
      toast({
        title: "Configuration Saved",
        description: "Agent configuration has been saved and will be used in simulations.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading agent configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agent Configuration</h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-gray-600">Configure Red Team (attacker) and Blue Team (defender) AI agents for cybersecurity simulation</p>
            <Badge variant="outline" className="text-xs">
              {supportedModels.length} Backend Models Available
            </Badge>
          </div>
          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Backend Integration:</strong> Agents are configured for the SimModel API. Models will be used in the actual adversarial simulation engine.
            </p>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Red Agent Panel */}
        <Card className="border-red-200 bg-red-50/30">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-800">🔴 Red Agent (Adversary)</CardTitle>
            <CardDescription>Configure the AI agent that will simulate cyber attacks on your hospital infrastructure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="redModel">LLM Model for Attack Planning</Label>
              <Select 
                value={config.redAgent.model} 
                onValueChange={(value) => setConfig({
                  ...config,
                  redAgent: { ...config.redAgent, model: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model for Red Agent" />
                </SelectTrigger>
                <SelectContent>
                  {supportedModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      <div className="flex items-center gap-2">
                        <span>{model}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{modelDescriptions[model] || 'Backend-supported model'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="redStrategies">Attack Strategies & Tactics</Label>
              <div className="flex gap-2">
                <Input
                  id="redStrategies"
                  placeholder="e.g., phishing, SQL injection, privilege escalation, lateral movement"
                  value={redStrategyInput}
                  onChange={(e) => setRedStrategyInput(e.target.value)}
                  onKeyDown={handleRedStrategyKeyDown}
                />
                <Button onClick={addRedStrategy} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {config.redAgent.strategies.map((strategy, index) => (
                  <Badge key={index} variant="destructive" className="flex items-center gap-1">
                    {strategy}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeRedStrategy(strategy)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blue Agent Panel */}
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">🔵 Blue Agent (Defender)</CardTitle>
            <CardDescription>Configure the AI agent that will defend your hospital infrastructure and respond to threats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="blueModel">LLM Model for Defense Planning</Label>
              <Select 
                value={config.blueAgent.model} 
                onValueChange={(value) => setConfig({
                  ...config,
                  blueAgent: { ...config.blueAgent, model: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model for Blue Agent" />
                </SelectTrigger>
                <SelectContent>
                  {supportedModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      <div className="flex items-center gap-2">
                        <span>{model}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{modelDescriptions[model] || 'Backend-supported model'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blueStrategies">Defense Strategies & Countermeasures</Label>
              <div className="flex gap-2">
                <Input
                  id="blueStrategies"
                  placeholder="e.g., anomaly detection, network segmentation, incident response, threat hunting"
                  value={blueStrategyInput}
                  onChange={(e) => setBlueStrategyInput(e.target.value)}
                  onKeyDown={handleBlueStrategyKeyDown}
                />
                <Button onClick={addBlueStrategy} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {config.blueAgent.strategies.map((strategy, index) => (
                  <Badge key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800">
                    {strategy}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeBlueStrategy(strategy)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Simulation Configuration</CardTitle>
          <CardDescription>Advanced settings for the adversarial simulation engine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="humanInLoop">Enable Human-in-the-Loop</Label>
              <p className="text-sm text-gray-500">Allow human analysts to intervene and make decisions during simulation</p>
            </div>
            <Switch
              id="humanInLoop"
              checked={config.humanInTheLoop}
              onCheckedChange={(checked) => setConfig({
                ...config,
                humanInTheLoop: checked
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuration Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Configuration Preview</CardTitle>
          <CardDescription>JSON representation that will be sent to the SimModel API for simulation execution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify({
                simulation_config: config,
                backend_format: {
                  redAgent: { model: config.redAgent.model, strategy: config.redAgent.strategies.join(', ') },
                  blueAgent: { model: config.blueAgent.model, strategy: config.blueAgent.strategies.join(', ') }
                }
              }, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <div className="flex justify-end">
        <Button onClick={saveConfiguration} size="lg" disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Agent Configuration"}
        </Button>
      </div>

      {/* Simulation Readiness Check */}
      <SimulationReadinessCheck />
    </div>
  );
};

export default Agents;
