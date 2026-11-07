import axios from 'axios'
import { API_URL } from '../config'
import { useAuthStore } from '../store/authStore'
import { authService } from './authService'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Interceptor de PETICIÓN: adjunta el Bearer token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de RESPUESTA: renueva token ante 401
let isRefreshing = false

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry && !isRefreshing) {
      original._retry = true
      isRefreshing = true
      try {
        const { refreshToken } = useAuthStore.getState()
        const tokens = await authService.refresh(refreshToken ?? '')
        useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken)
        original.headers.Authorization = `Bearer ${tokens.accessToken}`
        isRefreshing = false
        return api(original)
      } catch {
        isRefreshing = false
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)