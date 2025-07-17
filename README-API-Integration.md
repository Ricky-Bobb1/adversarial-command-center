# Adversa Agentic AI - Frontend Backend Integration

This document describes how the Adversa Agentic AI frontend integrates with the FastAPI backend deployed on AWS.

## Environment Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/Prod
VITE_ENABLE_MOCK_API=false

# Optional Configuration
VITE_LOG_LEVEL=debug
VITE_CACHE_TIMEOUT=300000
VITE_RETRY_ATTEMPTS=3
```

### Environment Modes

#### Production Mode (Live API)
```bash
VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/Prod
VITE_ENABLE_MOCK_API=false
```

#### Development Mode (Mock API)
```bash
VITE_ENABLE_MOCK_API=true
# VITE_API_BASE_URL is ignored when mock mode is enabled
```

#### Local Development with Real API
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_ENABLE_MOCK_API=false
```

## API Integration Features

### 1. Real-Time Simulation Execution
- **Endpoint**: `POST /api/v1/simulations`
- **Functionality**: Creates and starts simulations
- **Real-time Updates**: Polls status every 2 seconds during execution
- **Logs Streaming**: Fetches logs every 1 second

### 2. Simulation Status Monitoring
- **Endpoint**: `GET /api/v1/simulations/{id}/status`
- **Functionality**: Real-time status updates (pending, running, completed, failed)
- **Auto-polling**: Automatically polls while simulation is running

### 3. Live Results Display
- **Endpoint**: `GET /api/v1/simulations/{id}`
- **Functionality**: Fetches complete simulation results
- **Integration**: Seamlessly switches between live and stored results

### 4. Agent Configuration
- **Endpoint**: `GET /api/v1/agents`, `POST /api/v1/agents`
- **Functionality**: Manages Red/Blue agent configurations
- **Sync**: UI selections map directly to API payload structure

### 5. Scenario Management
- **Endpoint**: `GET /api/v1/scenarios`
- **Functionality**: Fetches available simulation scenarios
- **Dynamic**: Updates scenario dropdown based on backend data

## Error Handling & Resilience

### Automatic Retry Logic
- **Retries**: Up to 3 attempts for failed requests
- **Backoff**: Exponential backoff strategy
- **Rate Limiting**: Handles 429 responses gracefully

### Fallback Mechanisms
- **Mock Mode**: Automatic fallback to mock data in development
- **Stored Results**: Falls back to locally stored results if API fails
- **Graceful Degradation**: UI remains functional even with API issues

### User Feedback
- **Loading States**: Proper loading indicators during API calls
- **Error Messages**: User-friendly error messages and toasts
- **Status Indicators**: Clear indication of API connection status

## Development Tools

### API Documentation Access
The Settings page provides direct links to:
- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI Schema**: `/openapi.json`

### Connection Testing
- **Health Check**: Built-in API connection testing
- **Status Monitoring**: Real-time connection status in Settings
- **Debug Mode**: Console logging of all API requests/responses

### Mock vs Live Mode Toggle
- **Environment-based**: Controlled via environment variables
- **Visual Indicators**: Clear badges showing current mode
- **Seamless Switching**: No code changes required

## File Structure

### Core Integration Files
```
src/
├── services/
│   ├── api.ts                 # Base API client with retry logic
│   ├── adversaApiService.ts   # FastAPI service wrapper
│   └── simulationService.ts   # Simulation-specific API calls
├── hooks/
│   ├── useRealTimeSimulation.ts # Real-time simulation hook
│   └── useSimulation.ts        # TanStack Query hooks
├── utils/
│   ├── environment.ts         # Environment configuration
│   └── mockApi.ts            # Mock API for development
└── pages/
    ├── RunSimulation.tsx     # Updated with real-time integration
    ├── Results.tsx           # Live/stored results display
    └── Settings.tsx          # API configuration interface
```

## Usage Examples

### Starting a Real Simulation
```typescript
import { useRealTimeSimulation } from '@/hooks/useRealTimeSimulation';

const { startSimulation, isRunning, logs, status } = useRealTimeSimulation();

// Start simulation with scenario
await startSimulation('advanced-phishing-attack', {
  duration: 3600,
  intensity: 'high'
});
```

### Monitoring Simulation Progress
```typescript
// Real-time status updates
useEffect(() => {
  if (status?.status === 'completed') {
    console.log('Simulation completed successfully');
  }
}, [status]);

// Real-time log updates
useEffect(() => {
  console.log(`Received ${logs.length} log entries`);
}, [logs]);
```

### Switching Between Mock and Live API
```typescript
import { environment } from '@/utils/environment';

if (environment.enableMockApi) {
  // Use mock data for development
} else {
  // Use live API
}
```

## Deployment Considerations

### Production Deployment
1. Set `VITE_API_BASE_URL` to your AWS API Gateway URL
2. Set `VITE_ENABLE_MOCK_API=false`
3. Ensure CORS is configured on your API Gateway
4. Configure proper error handling for production

### Development Setup
1. For local development with mock data: Set `VITE_ENABLE_MOCK_API=true`
2. For local development with real API: Set `VITE_API_BASE_URL=http://localhost:8000`
3. Use the Settings page to test API connectivity

### Security Notes
- All API keys should be handled server-side
- Frontend only communicates with public endpoints
- Environment variables are exposed to the browser (use carefully)
- Consider implementing authentication headers if needed

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check `VITE_API_BASE_URL` is correct
   - Verify API is running and accessible
   - Check CORS configuration

2. **Simulations Not Starting**
   - Verify scenario exists in backend
   - Check agent configuration payload
   - Review browser console for errors

3. **Real-time Updates Not Working**
   - Check polling intervals in browser network tab
   - Verify simulation status endpoint responds correctly
   - Ensure WebSocket connections if using SSE

### Debug Tools
- Use Settings page to test API connection
- Check browser console for detailed API logs
- Monitor Network tab for request/response details
- Use API documentation to verify endpoint behavior

## Next Steps

1. **Authentication Integration**: Add login/logout functionality
2. **WebSocket Support**: Consider WebSocket for real-time updates
3. **Offline Support**: Implement service worker for offline capabilities
4. **Performance Optimization**: Add caching strategies for better performance