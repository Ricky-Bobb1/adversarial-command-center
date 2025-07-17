
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScenarioSelectorProps {
  selectedScenario: string;
  onScenarioChange: (scenario: string) => void;
  scenarios: string[];
}

const ScenarioSelector = ({ selectedScenario, onScenarioChange, scenarios }: ScenarioSelectorProps) => {
  console.log('[DEBUG] ScenarioSelector rendered with:', { selectedScenario, scenarios: scenarios.length, scenarioList: scenarios });
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Scenario ({scenarios.length} available)</label>
      <Select value={selectedScenario} onValueChange={onScenarioChange}>
        <SelectTrigger>
          <SelectValue placeholder={scenarios.length > 0 ? "Select a simulation scenario" : "Loading scenarios..."} />
        </SelectTrigger>
        <SelectContent>
          {scenarios.length > 0 ? (
            scenarios.map((scenario) => (
              <SelectItem key={scenario} value={scenario}>
                <div className="flex items-center gap-2">
                  <span>{scenario}</span>
                  {scenario === 'local-hospital-setup' && (
                    <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Local Setup</span>
                  )}
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="loading" disabled>Loading scenarios...</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ScenarioSelector;
