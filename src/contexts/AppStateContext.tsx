import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { logger } from '../utils/logger';

// ============================================
// STATE INTERFACES
// ============================================

export interface HospitalNode {
  id: string;
  name: string;
  type: string;
  services: string[];
  vulnerabilities: string;
  capabilities: string;
}

export interface AgentConfig {
  redAgent: {
    model: string;
    strategy: string;
    prompts?: any;
  };
  blueAgent: {
    model: string;
    strategy: string;
    prompts?: any;
  };
}

export interface AppState {
  // Node Configuration
  hospitalNodes: HospitalNode[];
  isNodesConfigured: boolean;
  
  // Agent Configuration  
  agentConfig: AgentConfig | null;
  isAgentsConfigured: boolean;
  
  // Scenario Selection
  selectedScenario: string;
  
  // UI State
  isLoading: boolean;
  lastSyncTimestamp: string | null;
}

// ============================================
// ACTION TYPES
// ============================================

type AppStateAction =
  | { type: 'SET_HOSPITAL_NODES'; payload: HospitalNode[] }
  | { type: 'ADD_HOSPITAL_NODE'; payload: HospitalNode }
  | { type: 'UPDATE_HOSPITAL_NODE'; payload: { id: string; updates: Partial<HospitalNode> } }
  | { type: 'REMOVE_HOSPITAL_NODE'; payload: string }
  | { type: 'CLEAR_HOSPITAL_NODES' }
  | { type: 'SET_AGENT_CONFIG'; payload: AgentConfig }
  | { type: 'UPDATE_RED_AGENT'; payload: Partial<AgentConfig['redAgent']> }
  | { type: 'UPDATE_BLUE_AGENT'; payload: Partial<AgentConfig['blueAgent']> }
  | { type: 'CLEAR_AGENT_CONFIG' }
  | { type: 'SET_SELECTED_SCENARIO'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_ALL_STATE' }
  | { type: 'HYDRATE_FROM_STORAGE'; payload: Partial<AppState> };

// ============================================
// INITIAL STATE
// ============================================

const initialState: AppState = {
  hospitalNodes: [],
  isNodesConfigured: false,
  agentConfig: null,
  isAgentsConfigured: false,
  selectedScenario: '',
  isLoading: false,
  lastSyncTimestamp: null,
};

// ============================================
// REDUCER
// ============================================

const appStateReducer = (state: AppState, action: AppStateAction): AppState => {
  switch (action.type) {
    case 'SET_HOSPITAL_NODES':
      return {
        ...state,
        hospitalNodes: action.payload,
        isNodesConfigured: action.payload.length > 0,
        lastSyncTimestamp: new Date().toISOString(),
      };

    case 'ADD_HOSPITAL_NODE':
      const newNodes = [...state.hospitalNodes, action.payload];
      return {
        ...state,
        hospitalNodes: newNodes,
        isNodesConfigured: newNodes.length > 0,
        lastSyncTimestamp: new Date().toISOString(),
      };

    case 'UPDATE_HOSPITAL_NODE':
      const updatedNodes = state.hospitalNodes.map(node =>
        node.id === action.payload.id
          ? { ...node, ...action.payload.updates }
          : node
      );
      return {
        ...state,
        hospitalNodes: updatedNodes,
        lastSyncTimestamp: new Date().toISOString(),
      };

    case 'REMOVE_HOSPITAL_NODE':
      const filteredNodes = state.hospitalNodes.filter(node => node.id !== action.payload);
      return {
        ...state,
        hospitalNodes: filteredNodes,
        isNodesConfigured: filteredNodes.length > 0,
        lastSyncTimestamp: new Date().toISOString(),
      };

    case 'CLEAR_HOSPITAL_NODES':
      return {
        ...state,
        hospitalNodes: [],
        isNodesConfigured: false,
        lastSyncTimestamp: new Date().toISOString(),
      };

    case 'SET_AGENT_CONFIG':
      return {
        ...state,
        agentConfig: action.payload,
        isAgentsConfigured: !!(action.payload?.redAgent?.model && action.payload?.blueAgent?.model),
        lastSyncTimestamp: new Date().toISOString(),
      };

    case 'UPDATE_RED_AGENT':
      const currentConfig = state.agentConfig || { redAgent: { model: '', strategy: '' }, blueAgent: { model: '', strategy: '' } };
      const updatedRedConfig = {
        ...currentConfig,
        redAgent: { ...currentConfig.redAgent, ...action.payload }
      };
      return {
        ...state,
        agentConfig: updatedRedConfig,
        isAgentsConfigured: !!(updatedRedConfig.redAgent.model && updatedRedConfig.blueAgent.model),
        lastSyncTimestamp: new Date().toISOString(),
      };

    case 'UPDATE_BLUE_AGENT':
      const currentBlueConfig = state.agentConfig || { redAgent: { model: '', strategy: '' }, blueAgent: { model: '', strategy: '' } };
      const updatedBlueConfig = {
        ...currentBlueConfig,
        blueAgent: { ...currentBlueConfig.blueAgent, ...action.payload }
      };
      return {
        ...state,
        agentConfig: updatedBlueConfig,
        isAgentsConfigured: !!(updatedBlueConfig.redAgent.model && updatedBlueConfig.blueAgent.model),
        lastSyncTimestamp: new Date().toISOString(),
      };

    case 'CLEAR_AGENT_CONFIG':
      return {
        ...state,
        agentConfig: null,
        isAgentsConfigured: false,
        lastSyncTimestamp: new Date().toISOString(),
      };

    case 'SET_SELECTED_SCENARIO':
      return {
        ...state,
        selectedScenario: action.payload,
        lastSyncTimestamp: new Date().toISOString(),
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'RESET_ALL_STATE':
      return {
        ...initialState,
        lastSyncTimestamp: new Date().toISOString(),
      };

    case 'HYDRATE_FROM_STORAGE':
      return {
        ...state,
        ...action.payload,
        isNodesConfigured: (action.payload.hospitalNodes?.length || 0) > 0,
        isAgentsConfigured: !!(action.payload.agentConfig?.redAgent?.model && action.payload.agentConfig?.blueAgent?.model),
      };

    default:
      return state;
  }
};

// ============================================
// CONTEXT
// ============================================

interface AppStateContextType {
  state: AppState;
  dispatch: React.Dispatch<AppStateAction>;
  
  // Convenience methods
  setHospitalNodes: (nodes: HospitalNode[]) => void;
  addHospitalNode: (node: HospitalNode) => void;
  updateHospitalNode: (id: string, updates: Partial<HospitalNode>) => void;
  removeHospitalNode: (id: string) => void;
  clearHospitalNodes: () => void;
  
  setAgentConfig: (config: AgentConfig) => void;
  updateRedAgent: (updates: Partial<AgentConfig['redAgent']>) => void;
  updateBlueAgent: (updates: Partial<AgentConfig['blueAgent']>) => void;
  clearAgentConfig: () => void;
  
  setSelectedScenario: (scenario: string) => void;
  resetAllState: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// ============================================
// STORAGE UTILITIES
// ============================================

const STORAGE_KEYS = {
  HOSPITAL_NODES: 'hospital-nodes',
  AGENT_CONFIG: 'agent-config',
  SELECTED_SCENARIO: 'selected-scenario',
} as const;

const loadFromStorage = (): Partial<AppState> => {
  try {
    const savedNodes = localStorage.getItem(STORAGE_KEYS.HOSPITAL_NODES);
    const savedAgentConfig = localStorage.getItem(STORAGE_KEYS.AGENT_CONFIG);
    const savedScenario = localStorage.getItem(STORAGE_KEYS.SELECTED_SCENARIO);

    const state: Partial<AppState> = {};

    if (savedNodes) {
      const nodesData = JSON.parse(savedNodes);
      state.hospitalNodes = nodesData.nodes || nodesData || [];
    }

    if (savedAgentConfig) {
      state.agentConfig = JSON.parse(savedAgentConfig);
    }

    if (savedScenario) {
      state.selectedScenario = savedScenario;
    }

    logger.debug('[STATE] Loaded state from localStorage', 'AppStateContext', {
      nodesCount: state.hospitalNodes?.length || 0,
      hasAgentConfig: !!state.agentConfig,
      selectedScenario: state.selectedScenario,
    });

    return state;
  } catch (error) {
    logger.error('[STATE] Failed to load from localStorage', 'AppStateContext', error);
    return {};
  }
};

const saveToStorage = (state: AppState) => {
  try {
    // Save hospital nodes
    if (state.hospitalNodes.length > 0) {
      localStorage.setItem(STORAGE_KEYS.HOSPITAL_NODES, JSON.stringify({
        nodes: state.hospitalNodes,
        timestamp: state.lastSyncTimestamp,
      }));
    } else {
      localStorage.removeItem(STORAGE_KEYS.HOSPITAL_NODES);
    }

    // Save agent config
    if (state.agentConfig) {
      localStorage.setItem(STORAGE_KEYS.AGENT_CONFIG, JSON.stringify(state.agentConfig));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AGENT_CONFIG);
    }

    // Save selected scenario
    if (state.selectedScenario) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_SCENARIO, state.selectedScenario);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_SCENARIO);
    }

    logger.debug('[STATE] Saved state to localStorage', 'AppStateContext', {
      nodesCount: state.hospitalNodes.length,
      hasAgentConfig: !!state.agentConfig,
      selectedScenario: state.selectedScenario,
    });
  } catch (error) {
    logger.error('[STATE] Failed to save to localStorage', 'AppStateContext', error);
  }
};

// ============================================
// PROVIDER COMPONENT
// ============================================

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = loadFromStorage();
    if (Object.keys(savedState).length > 0) {
      dispatch({ type: 'HYDRATE_FROM_STORAGE', payload: savedState });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.lastSyncTimestamp) {
      saveToStorage(state);
    }
  }, [state]);

  // Convenience methods
  const setHospitalNodes = (nodes: HospitalNode[]) => {
    dispatch({ type: 'SET_HOSPITAL_NODES', payload: nodes });
  };

  const addHospitalNode = (node: HospitalNode) => {
    dispatch({ type: 'ADD_HOSPITAL_NODE', payload: node });
  };

  const updateHospitalNode = (id: string, updates: Partial<HospitalNode>) => {
    dispatch({ type: 'UPDATE_HOSPITAL_NODE', payload: { id, updates } });
  };

  const removeHospitalNode = (id: string) => {
    dispatch({ type: 'REMOVE_HOSPITAL_NODE', payload: id });
  };

  const clearHospitalNodes = () => {
    dispatch({ type: 'CLEAR_HOSPITAL_NODES' });
  };

  const setAgentConfig = (config: AgentConfig) => {
    dispatch({ type: 'SET_AGENT_CONFIG', payload: config });
  };

  const updateRedAgent = (updates: Partial<AgentConfig['redAgent']>) => {
    dispatch({ type: 'UPDATE_RED_AGENT', payload: updates });
  };

  const updateBlueAgent = (updates: Partial<AgentConfig['blueAgent']>) => {
    dispatch({ type: 'UPDATE_BLUE_AGENT', payload: updates });
  };

  const clearAgentConfig = () => {
    dispatch({ type: 'CLEAR_AGENT_CONFIG' });
  };

  const setSelectedScenario = (scenario: string) => {
    dispatch({ type: 'SET_SELECTED_SCENARIO', payload: scenario });
  };

  const resetAllState = () => {
    dispatch({ type: 'RESET_ALL_STATE' });
  };

  const contextValue: AppStateContextType = {
    state,
    dispatch,
    setHospitalNodes,
    addHospitalNode,
    updateHospitalNode,
    removeHospitalNode,
    clearHospitalNodes,
    setAgentConfig,
    updateRedAgent,
    updateBlueAgent,
    clearAgentConfig,
    setSelectedScenario,
    resetAllState,
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK
// ============================================

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

// ============================================
// STORAGE ACCESS (for migration/compatibility)
// ============================================

export const getStorageKeys = () => STORAGE_KEYS;

export const clearAllStorage = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  logger.info('[STATE] Cleared all localStorage data', 'AppStateContext');
};