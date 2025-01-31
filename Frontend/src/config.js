const getBackendUrl = () => {
  // Try to get the port from localStorage, fallback to 5000
  const backendPort = localStorage.getItem('backendPort') || 5000;
  return `http://localhost:${backendPort}`;
};

export const config = {
  apiUrl: getBackendUrl(),
  setBackendPort: (port) => {
    localStorage.setItem('backendPort', port);
  }
};

export default config;
