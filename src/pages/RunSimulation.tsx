
import { SimulationProvider, useSimulationContext } from "@/contexts/SimulationContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import LogConsole from "@/components/LogConsole";
import SimulationControls from "@/components/SimulationControls";
import { SimulationDebugPanel } from "@/components/SimulationDebugPanel";
import DemoToggle from "@/components/DemoToggle";
import { CenteredLoader, SimulationControlsSkeleton, LogConsoleSkeleton } from "@/components/LoadingStates";
import { environment } from "@/utils/environment";
import { useSimulationExecution } from "@/hooks/useSimulationExecution";
import { useRealTimeSimulation } from "@/hooks/useRealTimeSimulation";
import { useScenarios } from "@/hooks/useScenarios";

const RunSimulationContent = () => {
  const { state, dispatch } = useSimulationContext();
  const { scenarios, isLoading } = useScenarios();
  // Use real-time simulation hook for better backend integration
  const {
    isRunning,
    logs,
    simulationId,
    startSimulation,
    stopSimulation,
    resetSimulation,
    error: simulationError,
    status: simulationStatus
  } = useRealTimeSimulation();

  const handleStartSimulation = () => {
    startSimulation(state.selectedScenario, {
      // Add any additional configuration here
      agents: state.selectedScenario,
      timestamp: new Date().toISOString()
    });
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

      <DemoToggle />

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

      {/* Debug Panel - Only show in development */}
      {environment.isDevelopment && (
        <SimulationDebugPanel
          simulationId={simulationId}
          status={simulationStatus}
          error={simulationError}
          isRunning={isRunning}
          logs={logs}
        />
      )}
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
