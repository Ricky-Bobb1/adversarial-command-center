
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScenarioSelectorProps {
  selectedScenario: string;
  onScenarioChange: (scenario: string) => void;
  scenarios: string[];
}

const ScenarioSelector = ({ selectedScenario, onScenarioChange, scenarios }: ScenarioSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Scenario</label>
      <Select value={selectedScenario} onValueChange={onScenarioChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a simulation scenario" />
        </SelectTrigger>
        <SelectContent>
          {scenarios.map((scenario) => (
            <SelectItem key={scenario} value={scenario}>
              {scenario}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ScenarioSelector;
