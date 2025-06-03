
# Component Documentation

This document provides documentation and usage examples for the main components in the Adversarial Simulation Platform.

## SimulationControls

The main control panel for managing simulation execution.

### Props

```typescript
interface SimulationControlsProps {
  selectedScenario: string;
  setSelectedScenario: (scenario: string) => void;
  scenarios: string[];
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}
```

### Usage Example

```jsx
import SimulationControls from '@/components/SimulationControls';

function App() {
  const [selectedScenario, setSelectedScenario] = useState('');
  const scenarios = ['SQL Injection', 'Phishing Attack', 'Privilege Escalation'];
  const [isRunning, setIsRunning] = useState(false);

  return (
    <SimulationControls
      selectedScenario={selectedScenario}
      setSelectedScenario={setSelectedScenario}
      scenarios={scenarios}
      isRunning={isRunning}
      onStart={() => setIsRunning(true)}
      onStop={() => setIsRunning(false)}
      onReset={() => {
        setIsRunning(false);
        setSelectedScenario('');
      }}
    />
  );
}
```

### Features

- Scenario selection dropdown
- Real-time status indicator
- Start/Stop/Reset controls
- Validation for scenario selection
- Responsive design

## LogConsole

Displays real-time simulation logs with syntax highlighting and auto-scroll.

### Props

```typescript
interface LogConsoleProps {
  logs: LogEntry[];
  isRunning: boolean;
}
```

### Usage Example

```jsx
import LogConsole from '@/components/LogConsole';
import { LogEntry } from '@/types/simulation';

function SimulationPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <LogConsole
      logs={logs}
      isRunning={isRunning}
    />
  );
}
```

### Features

- Auto-scrolling to latest logs
- Agent-specific color coding
- Live status indicator
- Performance optimized with memoization
- Accessible with ARIA labels

## ScenarioSelector

Dropdown component for selecting simulation scenarios.

### Props

```typescript
interface ScenarioSelectorProps {
  selectedScenario: string;
  onScenarioChange: (scenario: string) => void;
  scenarios: string[];
  disabled?: boolean;
}
```

### Usage Example

```jsx
import ScenarioSelector from '@/components/ScenarioSelector';

function ConfigPanel() {
  const [scenario, setScenario] = useState('');
  const scenarios = ['Network Intrusion', 'Data Breach', 'Social Engineering'];

  return (
    <ScenarioSelector
      selectedScenario={scenario}
      onScenarioChange={setScenario}
      scenarios={scenarios}
      disabled={false}
    />
  );
}
```

## Custom Hooks

### useSimulationExecution

Manages simulation execution state and lifecycle.

```typescript
const {
  isRunning,
  logs,
  startSimulation,
  stopSimulation,
  resetSimulation
} = useSimulationExecution();
```

### useScenarios

Fetches and manages available simulation scenarios.

```typescript
const {
  scenarios,
  isLoading,
  error
} = useScenarios();
```

### useErrorHandler

Provides consistent error handling across components.

```typescript
const { handleError } = useErrorHandler({
  showToast: true,
  customErrorMessages: {
    404: 'Resource not found',
    500: 'Server error occurred'
  }
});
```

## UI Components

### StatusBadge

Displays status with color coding.

```jsx
<StatusBadge 
  isActive={true}
  activeText="Running"
  inactiveText="Stopped"
/>
```

### AgentBadge

Shows agent information with appropriate styling.

```jsx
<AgentBadge agent="Red" />
<AgentBadge agent="Blue" />
<AgentBadge agent="System" />
```

### LiveIndicator

Animated indicator for live status.

```jsx
<LiveIndicator isLive={isRunning} />
```

## Best Practices

1. **Performance**: Use memoization for heavy computations
2. **Accessibility**: Include ARIA labels and keyboard navigation
3. **Error Handling**: Use the `useErrorHandler` hook consistently
4. **Logging**: Use the structured logger for debugging
5. **Styling**: Follow Tailwind CSS conventions
6. **Testing**: Write unit tests for custom hooks and components

## Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Logging
VITE_LOG_LEVEL=debug

# Caching
VITE_CACHE_TIMEOUT=300000

# Retry Logic
VITE_RETRY_ATTEMPTS=3
```
