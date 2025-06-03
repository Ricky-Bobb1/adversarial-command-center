
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface LogEntry {
  timestamp: string;
  agent: "Red" | "Blue" | "System";
  action: string;
  outcome: string;
}

interface SimulationState {
  isRunning: boolean;
  logs: LogEntry[];
  selectedScenario: string;
  scenarios: string[];
  isLoadingScenarios: boolean;
  error: string | null;
}

type SimulationAction =
  | { type: 'SET_RUNNING'; payload: boolean }
  | { type: 'ADD_LOG'; payload: LogEntry }
  | { type: 'CLEAR_LOGS' }
  | { type: 'SET_SCENARIO'; payload: string }
  | { type: 'SET_SCENARIOS'; payload: string[] }
  | { type: 'SET_LOADING_SCENARIOS'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_SIMULATION' };

const initialState: SimulationState = {
  isRunning: false,
  logs: [],
  selectedScenario: '',
  scenarios: [],
  isLoadingScenarios: true,
  error: null,
};

const simulationReducer = (state: SimulationState, action: SimulationAction): SimulationState => {
  switch (action.type) {
    case 'SET_RUNNING':
      return { ...state, isRunning: action.payload };
    case 'ADD_LOG':
      return { ...state, logs: [...state.logs, action.payload] };
    case 'CLEAR_LOGS':
      return { ...state, logs: [] };
    case 'SET_SCENARIO':
      return { ...state, selectedScenario: action.payload };
    case 'SET_SCENARIOS':
      return { ...state, scenarios: action.payload };
    case 'SET_LOADING_SCENARIOS':
      return { ...state, isLoadingScenarios: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_SIMULATION':
      return { ...state, isRunning: false, logs: [], error: null };
    default:
      return state;
  }
};

interface SimulationContextType {
  state: SimulationState;
  dispatch: React.Dispatch<SimulationAction>;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulationContext = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulationContext must be used within a SimulationProvider');
  }
  return context;
};
