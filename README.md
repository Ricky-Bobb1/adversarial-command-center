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
- **Visual Studio Code**: Recommended IDE with TypeScript support
- **Terminal**: Command line interface with Node.js and npm access

## Deploying the Application in Visual Studio Code

This section provides comprehensive instructions for setting up and deploying the Adversa Agentic AI platform using Visual Studio Code as your development environment.

### Step 1: Install Visual Studio Code

1. **Download Visual Studio Code**:
   - Visit [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Download the appropriate version for your operating system
   - Run the installer and follow the setup wizard

2. **Verify Installation**:
   - Open VS Code
   - Verify installation by checking **Help > About** for version information

### Step 2: Install Recommended Extensions

Install the following essential extensions for optimal development experience:

1. **Core Extensions**:
   - **TypeScript and JavaScript Language Features** (Built-in)
   - **ESLint** (`ms-vscode.vscode-eslint`)
   - **Prettier - Code formatter** (`esbenp.prettier-vscode`)

2. **Framework-Specific Extensions**:
   - **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)
   - **Auto Rename Tag** (`formulahendry.auto-rename-tag`)
   - **Bracket Pair Colorizer 2** (`coenraads.bracket-pair-colorizer-2`)

3. **Styling Extensions**:
   - **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
   - **PostCSS Language Support** (`csstools.postcss`)

4. **Development Tools**:
   - **GitLens** (`eamodio.gitlens`)
   - **Thunder Client** (`rangav.vscode-thunder-client`) - For API testing
   - **Error Lens** (`usernamehw.errorlens`)

**Installation Method**:
- Open VS Code
- Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
- Search for each extension and click "Install"

### Step 3: Install Node.js (if not already installed)

1. **Download Node.js**:
   - Visit [https://nodejs.org/](https://nodejs.org/)
   - Download the LTS version (recommended)
   - Run the installer with default settings

2. **Verify Installation**:
   ```bash
   node --version
   npm --version
   ```

### Step 4: Clone the Repository

1. **Open Terminal in VS Code**:
   - Press `` Ctrl+` `` (Windows/Linux) or `` Cmd+` `` (macOS)
   - Or go to **Terminal > New Terminal**

2. **Clone Repository**:
   ```bash
   # Navigate to your desired directory
   cd /path/to/your/projects

   # Clone the repository
   git clone <YOUR_GIT_URL>

   # Navigate to project directory
   cd adversa-agentic-ai
   ```

3. **Open Project in VS Code**:
   ```bash
   # Open current directory in VS Code
   code .
   ```

### Step 5: Install Dependencies

1. **Install Project Dependencies**:
   ```bash
   # Install all required packages
   npm install

   # Verify installation
   npm list --depth=0
   ```

2. **Verify Package Installation**:
   - Check that `node_modules` folder is created
   - Ensure no critical dependency errors in the output

### Step 6: Environment Configuration

1. **Create Environment File** (Optional for production):
   ```bash
   # Create .env file in project root
   touch .env
   ```

2. **Configure Environment Variables** (Add to `.env` if needed):
   ```env
   # External API Configuration (Optional)
   VITE_API_BASE_URL=https://your-api-endpoint.com

   # Logging Configuration
   VITE_LOG_LEVEL=debug

   # Caching Configuration
   VITE_CACHE_TIMEOUT=300000

   # Retry Logic
   VITE_RETRY_ATTEMPTS=3
   ```

3. **Default Development Configuration**:
   - Mock API enabled automatically
   - Debug logging active
   - Local development server on port 8080

### Step 7: Running the Development Server

1. **Start Development Server**:
   ```bash
   # Start the development server
   npm run dev
   ```

2. **Access Application**:
   - **Local URL**: [http://localhost:8080/](http://localhost:8080/)
   - **Network URL**: `http://[your-ip]:8080/` (shown in terminal)

3. **Development Features**:
   - Hot module replacement for instant updates
   - Real-time error reporting
   - Automatic browser refresh on file changes

### Step 8: Preview Production Build

1. **Create Production Build**:
   ```bash
   # Generate optimized production build
   npm run build
   ```

2. **Preview Local Build**:
   ```bash
   # Start local preview server
   npm run preview
   ```

3. **Verify Build Output**:
   - Check `dist/` directory for generated files
   - Test application functionality in preview mode

### Step 9: Using VS Code Development Tools

1. **Integrated Terminal Usage**:
   - Multiple terminal support: `Ctrl+Shift+` ` (Windows/Linux) or `Cmd+Shift+` ` (macOS)
   - Split terminal view for running multiple commands
   - Terminal history and command completion

2. **Debugging Configuration**:
   - Create `.vscode/launch.json` for debugging:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Launch Chrome",
         "request": "launch",
         "type": "node",
         "program": "${workspaceFolder}/node_modules/.bin/vite",
         "args": ["--port", "8080"],
         "console": "integratedTerminal"
       }
     ]
   }
   ```

3. **Workspace Settings** (`.vscode/settings.json`):
   ```json
   {
     "typescript.preferences.importModuleSpecifier": "relative",
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "tailwindCSS.experimental.classRegex": [
       ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
     ]
   }
   ```

4. **Code Navigation and Features**:
   - `Ctrl+P` (Windows/Linux) or `Cmd+P` (macOS): Quick file search
   - `F12`: Go to definition
   - `Shift+F12`: Find all references
   - `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (macOS): Global search

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

## Contributing

This project represents a graduate-level cybersecurity simulation platform developed using modern web technologies. The codebase is structured to support academic research, professional development, and portfolio demonstration.

### Development Guidelines
- Follow TypeScript best practices for type safety
- Maintain component modularity and reusability
- Implement comprehensive error handling
- Document complex business logic
- Test critical simulation functionality

### Academic and Professional Use
This platform serves as a demonstration of advanced web application development skills, cybersecurity domain expertise, and modern frontend architecture implementation. It is suitable for:
- Academic portfolio presentation
- Cybersecurity research and education
- Professional development demonstration
- Open source contribution