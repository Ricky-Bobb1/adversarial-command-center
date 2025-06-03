
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { validateScenario } from "@/utils/validation";
import ScenarioSelector from "./ScenarioSelector";

interface SimulationControlsProps {
  selectedScenario: string;
  setSelectedScenario: (scenario: string) => void;
  scenarios: string[];
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

const SimulationControls = ({
  selectedScenario,
  setSelectedScenario,
  scenarios,
  isRunning,
  onStart,
  onStop,
  onReset
}: SimulationControlsProps) => {
  const scenarioValidation = validateScenario(selectedScenario);
  const canStart = !isRunning && scenarioValidation.isValid;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Configuration</CardTitle>
        <CardDescription>Select and configure your simulation scenario</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onScenarioChange={setSelectedScenario}
            scenarios={scenarios}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <div className="flex items-center gap-2 pt-2">
              <StatusBadge 
                isActive={isRunning}
                activeText="Running"
                inactiveText="Ready"
              />
              {selectedScenario && (
                <span className="text-sm text-gray-600">
                  {selectedScenario}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={onStart} 
            disabled={!canStart}
            size="lg"
            className="flex-1 md:flex-none"
          >
            <Play className="h-5 w-5 mr-2" />
            {isRunning ? "Simulation Running..." : "Run Simulation"}
          </Button>
          
          <Button 
            onClick={onStop} 
            disabled={!isRunning}
            variant="destructive"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
          
          <Button 
            onClick={onReset} 
            disabled={isRunning}
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationControls;
