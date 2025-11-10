export const apiCall = async (endpoint, options = {}) => {
  // ✅ Safe localStorage access - only run in browser
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  
  // Only set Content-Type for non-FormData requests
  const defaultHeaders = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }
  
  const config = {
    headers: {
      ...defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(`${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};