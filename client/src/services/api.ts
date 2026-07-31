import axios from 'axios'

const LOGIN_PATH = '/login'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
})

api.interceptors.request.use(async (config) => {
  try {
    const token = await window.Clerk?.session?.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    // Sin sesión activa: la petición viaja sin token y el backend responde 401
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== LOGIN_PATH) {
      window.location.assign(LOGIN_PATH)
    }
    return Promise.reject(error)
  },
)
