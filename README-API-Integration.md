
# Adversa Agentic AI - API Integration Guide

## Production API Configuration

The Adversa Agentic AI frontend is now configured to connect to the live FastAPI backend deployed on AWS.

### Production Endpoint
```
Base URL: https://4ao182xl79.execute-api.us-east-1.amazonaws.com/alpha
```

### API Documentation
- **Swagger UI**: https://4ao182xl79.execute-api.us-east-1.amazonaws.com/alpha/docs
- **ReDoc**: https://4ao182xl79.execute-api.us-east-1.amazonaws.com/alpha/redoc
- **OpenAPI Schema**: https://4ao182xl79.execute-api.us-east-1.amazonaws.com/alpha/openapi.json

## Environment Configuration

### Default Behavior
The application now defaults to using the production API. Mock mode is disabled by default.

### Environment Variables
To override the default configuration, set these environment variables:

```bash
# Use a different API endpoint
VITE_API_BASE_URL=https://your-custom-endpoint.com

# Enable mock mode for development
VITE_ENABLE_MOCK_API=true

# Set log level
VITE_LOG_LEVEL=debug
```

## API Integration Features

### Real-Time Simulation
- ✅ POST `/simulations` - Create and start simulations
- ✅ GET `/simulations/{id}/status` - Poll simulation status
- ✅ GET `/simulations/{id}/logs` - Stream simulation logs
- ✅ GET `/simulations/{id}` - Get simulation results

### Agent Management
- ✅ GET `/agents` - List available agents
- ✅ POST `/agents` - Create new agents
- ✅ GET `/agents/{id}` - Get agent details

### Network Topology
- ✅ GET `/network/topology` - Get network configuration
- ✅ GET `/scenarios` - List available scenarios

### Health Monitoring
- ✅ GET `/health` - API health check

## Testing the Integration

### From the UI
1. Navigate to **Settings** page
2. Click **Test Connection** to verify API connectivity
3. View **Swagger UI** or **ReDoc** for detailed API documentation

### From the Console
```javascript
// Check current configuration
console.log('API Base URL:', window.environment?.apiBaseUrl);
console.log('Mock Mode:', window.environment?.enableMockApi);
```

## Troubleshooting

### Connection Issues
- Verify the API endpoint is accessible
- Check browser console for CORS errors
- Ensure the AWS API Gateway is properly deployed

### Debug Mode
Enable debug logging by setting `VITE_LOG_LEVEL=debug` to see detailed API request/response logs.

### Mock vs Production Mode
- **Mock Mode**: Uses local JSON files for development
- **Production Mode**: Connects to live AWS API Gateway endpoint

## Development Workflow

1. **Development**: Use mock mode for rapid UI development
2. **Testing**: Switch to production mode to test real API integration
3. **Production**: Always uses the live API endpoint

---

Last Updated: $(date)
API Version: v1
Backend: FastAPI on AWS Lambda + API Gateway
