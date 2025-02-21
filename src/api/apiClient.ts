import { useAuth } from "../auth/AuthContext";

const API_URL = import.meta.env.VITE_API_ENDPOINT;

export const useApiClient = () => {
  const { getToken } = useAuth();

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getToken();

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  };

  return {
    get: (endpoint: string) => fetchWithAuth(endpoint, { method: "GET" }),
    post: (endpoint: string, data: any) =>
      fetchWithAuth(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    put: (endpoint: string, data: any) =>
      fetchWithAuth(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (endpoint: string) => fetchWithAuth(endpoint, { method: "DELETE" }),
  };
};
