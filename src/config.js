/**
 * API Configuration
 * Centralized API base URL for easy management across environments
 * Change this single value when deploying to production
 */

// Use import.meta.env for Vite, fallback to development URL
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export default { API_BASE };
