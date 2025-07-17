# API Migration Debug Fixes

## Summary
Fixed 4 critical issues after migrating the Adversa Agentic AI frontend to connect with the live FastAPI backend.

## 🧠 1. Scenarios Not Populating or Executing - FIXED ✅

### Problem
- Frontend was using wrong API endpoint for scenarios
- Using `/api/v1/scenarios` (doesn't exist) instead of `/aaa/sim/models`

### Solution
- **Updated `adversaApiService.getScenarios()`** to use correct endpoint: `GET /aaa/sim/models`
- **Added fallback scenarios** when API call fails: `['default-scenario', 'enterprise-network', 'cloud-infrastructure']`
- **Enhanced error handling** in `useScenarios.ts` with graceful fallbacks
- **Added debug logging** for scenario loading process

### Debug Logs Added
```javascript
console.log('[DEBUG] Fetching scenarios from /aaa/sim/models...');
console.log('[DEBUG] Models response:', response);
console.log('[DEBUG] Extracted scenarios:', scenarios);
```

---

## 🖥️ 2. Node Setup from "Setup Page" Not Showing in Simulation - FIXED ✅

### Problem
- Node configurations were saved but not included in simulation requests
- No validation that nodes were configured before starting simulation

### Solution
- **Updated Setup page** to save node config to `localStorage` with key `'hospital-nodes'`
- **Enhanced `adversaApiService.createSimulation()`** to read nodes from localStorage and include in API payload
- **Added pre-simulation validation** to ensure nodes are configured
- **Updated payload structure** to match backend schema requirements

### Debug Logs Added
```javascript
console.log('[DEBUG] Loaded nodes from storage:', nodes);
console.log('[DEBUG] Loading model with payload:', loadPayload);
console.log('[DEBUG] No nodes configured! Please set up nodes first.');
```

### Storage Format
```json
{
  "nodes": [
    {
      "id": "1234567890",
      "name": "Main Server",
      "type": "Hardware",
      "services": ["PACS", "EMR"],
      "vulnerabilities": "CVE-2024-1234",
      "capabilities": "Core medical data storage"
    }
  ]
}
```

---

## 🤖 3. Agent LLM Selection - Filter to Only Supported Models - FIXED ✅

### Problem
- Frontend showed unsupported models like "GPT-4", "Claude 3.5 Sonnet"
- Backend only supports specific model names with full AWS Bedrock identifiers

### Solution
- **Replaced hardcoded model list** with backend-supported models:
  - `anthropic.claude-3-sonnet-20240229-v1:0`
  - `cohere.command-r-plus`
  - `anthropic.claude-3-haiku-20240307-v1:0`
  - `anthropic.claude-3-opus-20240229-v1:0`
- **Added `getSupportedModels()` API method** to fetch from `/aaa/providers`
- **Enhanced Agents page UI** with model descriptions and info tooltips
- **Added model count badge** showing available backend models
- **Updated agent config storage** to localStorage with key `'agent-config'`

### Debug Logs Added
```javascript
console.log('[DEBUG] Loading supported models from backend...');
console.log('[DEBUG] Supported models:', models);
console.log('[DEBUG] Saved agent config to localStorage:', config);
```

---

## 🐞 4. Developer Debug Support - ADDED ✅

### Comprehensive Debug Logging Added

#### Simulation Start Validation
```javascript
console.log('[DEBUG] ========== SIMULATION START DEBUG ==========');
console.log('[DEBUG] Selected scenario:', scenario);
console.log('[DEBUG] Saved nodes in localStorage:', savedNodes);
console.log('[DEBUG] Saved agents in localStorage:', savedAgents);
console.log('[DEBUG] ========== STATE VALIDATION PASSED ==========');
```

#### API Request Payload Logging
```javascript
console.log('[DEBUG] ========== SIMULATION REQUEST PAYLOAD ==========');
console.log('[DEBUG] Full request object:', JSON.stringify(request, null, 2));
console.log('[DEBUG] ===============================================');
```

#### Polling Status & Logs
```javascript
console.log('[DEBUG] Polling status for simulation ${id}...');
console.log('[DEBUG] Status response:', statusResponse);
console.log('[DEBUG] Current status: ${currentStatus}');
console.log('[DEBUG] Polling logs for simulation ${id}...');
console.log('[DEBUG] Logs response:', logsResponse);
```

#### Pre-Simulation Validation
- **Validates nodes are configured** before starting simulation
- **Validates agents are configured** with both Red/Blue models
- **Shows user-friendly error toasts** for missing configurations
- **Logs validation failures** for debugging

#### Enhanced Debug Panel
- **Updated API docs link** to point to correct endpoint: `https://4ao182xl79.execute-api.us-east-1.amazonaws.com/alpha/redoc`
- **Shows real-time status and error information**
- **Displays simulation ID and polling state**

---

## ✅ Final Outcome

### ✅ Node Configuration
- Node setup is preserved and automatically applied to simulations
- Validation ensures nodes are configured before simulation starts
- Full debug logging of node data in requests

### ✅ Scenarios 
- Scenarios are loaded dynamically from `/aaa/sim/models` endpoint
- Graceful fallback when API is unavailable
- Real-time scenario loading with debug logs

### ✅ Agent LLM Models
- Only backend-supported LLMs are visible and selectable
- Model descriptions and info tooltips for better UX
- Automatic loading of supported models from backend

### ✅ Debug Support
- Comprehensive logging at all stages of simulation lifecycle
- Payload validation and structure verification
- Real-time status monitoring with timeout handling
- User-friendly error messages with actionable guidance

---

## 🔧 Technical Details

### API Endpoints Now Used
- **Scenarios**: `GET /aaa/sim/models` (not `/api/v1/scenarios`)
- **Load Model**: `POST /aaa/sim/model/load` (not `/api/v1/simulations`)
- **Run Simulation**: `POST /aaa/sim/run` 
- **Status**: `GET /aaa/sim/status/{sim_id}` (not `/api/v1/simulations/{id}/status`)
- **Logs**: `GET /aaa/sim/detail/{sim_id}` (not `/api/v1/simulations/{id}/logs`)

### State Storage
- **Nodes**: `localStorage['hospital-nodes']` - JSON with nodes array
- **Agents**: `localStorage['agent-config']` - JSON with redAgent/blueAgent config

### Error Handling
- Graceful fallbacks for all API failures
- User-friendly toast notifications
- Comprehensive console logging for debugging
- Timeout handling for long-running simulations (5 min timeout)

All integration issues have been resolved and the frontend now correctly syncs with the live FastAPI backend! 🎉