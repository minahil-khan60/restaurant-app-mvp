// src/api/client.js - A2 ke liye
export const BASE_URL = "http://192.168.1.7:5000";

// Helper function jo har API call me use hoga
export async function apiRequest(endpoint, options = {}) {
  const token = options.token; // AsyncStorage se token loge
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  
  return data;
}