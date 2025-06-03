
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic fetch from mock data
export const fetchMockData = async <T>(endpoint: string): Promise<T> => {
  await delay(Math.random() * 500 + 200); // Random delay 200-700ms
  
  try {
    const response = await fetch(`/data/mock/${endpoint}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching mock data for ${endpoint}:`, error);
    throw error;
  }
};

// Simulate POST requests to fake API endpoints
export const postToMockApi = async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
  await delay(Math.random() * 800 + 400); // Random delay 400-1200ms
  
  console.log(`POST to ${endpoint}:`, data);
  
  // Simulate success/failure responses
  const success = Math.random() > 0.1; // 90% success rate
  
  if (success) {
    return {
      data: data as T,
      success: true,
      message: `Successfully posted to ${endpoint}`
    };
  } else {
    throw new Error(`Failed to post to ${endpoint}: Simulated API error`);
  }
};

// Specific API endpoints
export const mockApiEndpoints = {
  nodes: '/api/nodes',
  agents: '/api/agents', 
  runSimulation: '/api/run_simulation',
  results: '/api/results',
  logs: '/api/logs'
} as const;
