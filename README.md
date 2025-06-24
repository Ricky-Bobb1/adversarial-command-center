
# Adversa Agentic AI - Advanced Cybersecurity Simulation Platform

## Overview

Adversa Agentic AI (A³) is a sophisticated web-based platform designed for conducting adversarial artificial intelligence simulations in cybersecurity contexts. The application enables security researchers, healthcare organizations, and cybersecurity professionals to simulate complex attack scenarios, analyze AI agent behaviors under adversarial conditions, and evaluate defensive capabilities against emerging threats. The platform specifically focuses on HIPAA compliance assessment and regulatory framework alignment for healthcare cybersecurity.

## Architecture Summary

The application follows a modern React-based single-page application (SPA) architecture built with TypeScript, utilizing Vite for build tooling and development server capabilities. The frontend employs a component-driven design pattern with shadcn/ui components for consistent user interface elements, while state management is handled through React Context API and TanStack Query for server state management. The system supports both mock API simulation for development and integration with external adversarial AI APIs for production deployment.

## Prerequisites and Environment Requirements

### System Requirements
- **Node.js**: Version 18.x or higher (LTS recommended)
- **npm**: Version 8.x or higher (comes with Node.js)
- **Modern Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+ recommended)

### Development Environment Setup
- **Git**: Version 2.30 or higher for version control
- **Code Editor**: Visual Studio Code recommended with TypeScript extension
- **Terminal**: Command line interface with Node.js and npm access

## Installation and Setup Instructions

### Step 1: Repository Cloning and Initial Setup
```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Verify Node.js installation
node --version
npm --version
```

### Step 2: Dependency Installation
```bash
# Install all project dependencies
npm install

# Verify installation success
npm list --depth=0
```

### Step 3: Environment Configuration

The application utilizes environment-based configuration through Vite's environment variable system. Create environment-specific configuration as needed:

**Development Environment (Default)**:
- Mock API enabled by default
- Debug logging level active
- Local development server on port 8080

**Production Environment Variables** (Optional):
- `VITE_API_BASE_URL`: Base URL for external Adversa API service
- `VITE_LOG_LEVEL`: Logging verbosity (debug, info, warn, error)
- `VITE_CACHE_TIMEOUT`: Cache timeout in milliseconds (default: 300000)
- `VITE_RETRY_ATTEMPTS`: API retry attempts (default: 3)

### Step 4: Development Server Launch
```bash
# Start development server
npm run dev

# Server will be available at:
# Local:   http://localhost:8080/
# Network: http://[your-ip]:8080/
```

### Step 5: Build and Deployment Preparation
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Application Pages and Features

### 1. Landing Page (`/`)
**Purpose**: Application entry point and brand introduction
**Features**:
- Gradient-based hero design with A³ branding
- Mission statement and platform overview
- Direct navigation to simulation console
- Responsive design optimized for various screen sizes

### 2. Dashboard (`/dashboard`)
**Purpose**: Central control hub and system overview
**Features**:
- Welcome interface with personalized greeting
- System status indicators (nodes configured, last simulation date, active models)
- Interactive getting-started checklist with progress tracking
- Latest security insights panel with threat intelligence
- Quick navigation to all major application sections
- Real-time metrics display for operational awareness

### 3. Setup (`/setup`)
**Purpose**: Infrastructure and network topology configuration
**Features**:
- Network node definition and configuration
- Topology visualization and management
- Infrastructure security parameter settings
- Pre-simulation environment validation
- Configuration export and import capabilities

### 4. Agents (`/agents`)
**Purpose**: AI agent configuration and management
**Features**:
- Red team (adversarial) agent configuration
- Blue team (defensive) agent setup
- Agent behavior parameter tuning
- Model selection and customization
- Performance monitoring and analytics
- Agent interaction rule definition

### 5. Run Simulation (`/run`)
**Purpose**: Primary simulation execution interface
**Features**:
- Scenario selection from predefined attack patterns
- Real-time simulation control (start, stop, reset)
- Live log console with color-coded agent activities
- Progress monitoring and status indicators
- Interactive simulation parameter adjustment
- Emergency stop capabilities for safety

### 6. Results (`/results`)
**Purpose**: Comprehensive analysis and compliance reporting
**Features**:
- **Simulation Results Tab**: Detailed outcome analysis and metrics
- **Compliance Tab**: HIPAA compliance scorecard with specific safeguard assessment
- **Regulatory Framework Tab**: NIST Cybersecurity Framework and HITRUST CSF alignment
- Visual charts and graphs for data interpretation
- Exportable reports for documentation purposes
- Historical comparison capabilities

### 7. Logs (`/logs`)
**Purpose**: Detailed audit trail and forensic analysis
**Features**:
- Chronological event logging with timestamps
- Agent-specific activity filtering
- Search and filter capabilities across log entries
- Export functionality for external analysis
- Log level configuration and management
- Real-time log streaming during active simulations

### 8. Settings (`/settings`)
**Purpose**: Application configuration and user preferences
**Features**:
- API endpoint configuration
- Logging level adjustment
- Theme and display preferences
- User account management
- System maintenance utilities
- Configuration backup and restore

## Frontend-Backend Integration Architecture

### Data Flow and Request Lifecycle

The application implements a sophisticated client-server communication pattern through multiple service layers:

#### 1. Service Layer Architecture
- **`simulationService.ts`**: Primary orchestration layer that routes requests between mock and real APIs
- **`adversaApiService.ts`**: Dedicated service for external Adversa API integration
- **`apiClient.ts`**: Core HTTP client with retry logic, error handling, and request cancellation
- **`cacheService.ts`**: Client-side caching layer for performance optimization

#### 2. API Routing Logic
```typescript
// Conditional API routing based on environment
const useAdversaApi = !environment.enableMockApi && environment.apiBaseUrl;

// Automatic fallback between real and mock APIs
if (useAdversaApi) {
  return adversaApiService.createSimulation(request);
} else {
  return apiClient.post('/api/simulations', request);
}
```

#### 3. State Management Integration
- **React Context**: Global simulation state management
- **TanStack Query**: Server state synchronization and caching
- **Local Storage**: Persistent configuration and results storage

### API Endpoint Mapping

#### Simulation Management Endpoints
- `POST /api/v1/simulations` - Create new simulation
- `GET /api/v1/simulations/{id}` - Retrieve simulation details
- `POST /api/v1/simulations/{id}/start` - Initiate simulation execution
- `POST /api/v1/simulations/{id}/stop` - Terminate running simulation
- `GET /api/v1/simulations/{id}/status` - Poll simulation status
- `GET /api/v1/simulations/{id}/logs` - Retrieve real-time logs

#### Configuration Endpoints
- `GET /api/v1/agents` - Retrieve available AI agents
- `GET /api/v1/scenarios` - List predefined attack scenarios
- `GET /api/v1/network/topology` - Network configuration data

### Data Exchange Patterns

#### Request/Response Flow
1. **User Interaction**: Component triggers action through event handler
2. **Hook Layer**: Custom hooks (useSimulation, useAgents) manage request lifecycle
3. **Service Layer**: Business logic processing and API route determination
4. **HTTP Client**: Request execution with retry logic and error handling
5. **Response Processing**: Data transformation and state updates
6. **UI Updates**: Component re-rendering with new data

#### Error Handling Strategy
- **Graceful Degradation**: Automatic fallback to mock data when external APIs fail
- **User Feedback**: Toast notifications for operation status
- **Retry Logic**: Exponential backoff for transient failures
- **Request Cancellation**: Cleanup of pending requests on component unmount

### Real-time Features
- **Live Simulation Monitoring**: WebSocket-like polling for status updates
- **Dynamic Log Streaming**: Continuous log updates during simulation execution
- **Progress Indicators**: Real-time progress tracking with visual feedback

## Development and Deployment

### Technology Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React Context API + TanStack Query
- **Routing**: React Router DOM for client-side navigation
- **Testing**: Built-in development tools and error boundaries

### Production Deployment
The application is designed for deployment on modern web hosting platforms with static file serving capabilities. The build process generates optimized static assets suitable for CDN distribution.

### API Integration Flexibility
The platform supports dual-mode operation:
- **Development Mode**: Comprehensive mock API simulation
- **Production Mode**: External Adversa API service integration

This architecture ensures consistent development experience while providing scalability for production deployments.

## Project Structure and Maintainability

The codebase follows React best practices with clear separation of concerns:
- **Components**: Reusable UI elements with focused responsibilities
- **Pages**: Route-level components with comprehensive feature sets
- **Services**: Business logic and API integration layers
- **Hooks**: Custom React hooks for state management and side effects
- **Types**: TypeScript definitions for type safety and documentation
- **Utils**: Utility functions and helper modules

This structure ensures maintainability, testability, and scalability for future enhancements and feature additions.
