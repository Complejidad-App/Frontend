import axios from 'axios'

// Base URL of the backend API. Always read from the VITE_API_URL env var
// (see .env / .env.example) so the same build can target different backends.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Normalize backend/network errors into a readable Error message.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail
    const message =
      detail ||
      error.message ||
      'No se pudo conectar con el servidor. Verifica que el backend esté activo.'
    return Promise.reject(new Error(message))
  },
)

export default client
