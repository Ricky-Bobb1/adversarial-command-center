
import { useState } from "react";
import LogConsole from "@/components/LogConsole";
import SimulationControls from "@/components/SimulationControls";
import { useSimulationExecution } from "@/hooks/useSimulationExecution";
import { useScenarios } from "@/hooks/useScenarios";

const RunSimulation = () => {
  const [selectedScenario, setSelectedScenario] = useState("");
  const { scenarios, isLoading } = useScenarios();
  const {
    isRunning,
    logs,
    startSimulation,
    stopSimulation,
    resetSimulation
  } = useSimulationExecution();

  const handleStartSimulation = () => {
    startSimulation(selectedScenario);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading scenarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Run Simulation</h1>
        <p className="text-gray-600 mt-2">Execute adversarial AI simulations against your infrastructure</p>
      </div>

      <SimulationControls
        selectedScenario={selectedScenario}
        setSelectedScenario={setSelectedScenario}
        scenarios={scenarios}
        isRunning={isRunning}
        onStart={handleStartSimulation}
        onStop={stopSimulation}
        onReset={resetSimulation}
      />

      <LogConsole logs={logs} isRunning={isRunning} />
    </div>
  );
};

export default RunSimulation;
