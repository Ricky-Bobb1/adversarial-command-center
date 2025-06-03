
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [config, setConfig] = useState<AgentConfig>({
    redAgent: {
      model: "",
      strategies: []
    },
    blueAgent: {
      model: "",
      strategies: []
    },
    humanInTheLoop: false
  });

  const [redStrategyInput, setRedStrategyInput] = useState("");
  const [blueStrategyInput, setBlueStrategyInput] = useState("");

  const models = ["GPT-4", "GPT-4 Turbo", "Claude 3.5 Sonnet", "Claude 3 Opus", "Gemini Pro"];

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

  const saveConfiguration = () => {
    if (!config.redAgent.model || !config.blueAgent.model) {
      toast({
        title: "Configuration Error",
        description: "Please select models for both Red and Blue agents",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Configuration Saved",
      description: "Agent configuration has been saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agent Configuration</h1>
        <p className="text-gray-600 mt-2">Configure your AI agents and their attack/defense strategies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Red Agent Panel */}
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-800">Red Agent (Attacker)</CardTitle>
            <CardDescription>Configure the adversarial AI agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="redModel">LLM Model</Label>
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
                  {models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="redStrategies">Attack Strategies</Label>
              <div className="flex gap-2">
                <Input
                  id="redStrategies"
                  placeholder="e.g., phishing, sql injection, malware"
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
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Blue Agent (Defender)</CardTitle>
            <CardDescription>Configure the defensive AI agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="blueModel">LLM Model</Label>
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
                  {models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blueStrategies">Defense Strategies</Label>
              <div className="flex gap-2">
                <Input
                  id="blueStrategies"
                  placeholder="e.g., anomaly detection, isolation, monitoring"
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

      {/* Human-in-the-Loop Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Configuration</CardTitle>
          <CardDescription>Additional settings for the simulation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="humanInLoop">Enable Human-in-the-Loop</Label>
              <p className="text-sm text-gray-500">Allow human intervention during simulation</p>
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
          <CardTitle>Configuration Preview</CardTitle>
          <CardDescription>JSON representation of your agent configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <div className="flex justify-end">
        <Button onClick={saveConfiguration} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default Agents;
