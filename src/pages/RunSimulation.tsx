
import { SimulationProvider, useSimulationContext } from "@/contexts/SimulationContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import LogConsole from "@/components/LogConsole";
import SimulationControls from "@/components/SimulationControls";
import { CenteredLoader, SimulationControlsSkeleton, LogConsoleSkeleton } from "@/components/LoadingStates";
import { useSimulationExecution } from "@/hooks/useSimulationExecution";
import { useScenarios } from "@/hooks/useScenarios";

const RunSimulationContent = () => {
  const { state, dispatch } = useSimulationContext();
  const { scenarios, isLoading } = useScenarios();
  const {
    isRunning,
    logs,
    startSimulation,
    stopSimulation,
    resetSimulation
  } = useSimulationExecution();

  const handleStartSimulation = () => {
    startSimulation(state.selectedScenario);
  };

  const handleScenarioChange = (scenario: string) => {
    dispatch({ type: 'SET_SCENARIO', payload: scenario });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Run Simulation</h1>
          <p className="text-gray-600 mt-2">Execute adversarial AI simulations against your infrastructure</p>
        </div>
        <SimulationControlsSkeleton />
        <LogConsoleSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Run Simulation</h1>
        <p className="text-gray-600 mt-2">Execute adversarial AI simulations against your infrastructure</p>
      </div>

      <ErrorBoundary>
        <SimulationControls
          selectedScenario={state.selectedScenario}
          setSelectedScenario={handleScenarioChange}
          scenarios={scenarios}
          isRunning={isRunning}
          onStart={handleStartSimulation}
          onStop={stopSimulation}
          onReset={resetSimulation}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <LogConsole logs={logs} isRunning={isRunning} />
      </ErrorBoundary>
    </div>
  );
};

const RunSimulation = () => {
  return (
    <SimulationProvider>
      <ErrorBoundary>
        <RunSimulationContent />
      </ErrorBoundary>
    </SimulationProvider>
  );
};

export default RunSimulation;
