import { createContext, useContext, useState, useEffect } from "react"
import { login as loginApi, register as registerApi, getMe } from "../api"

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem("access_token")
    if (token) {
      // Intentar obtener los datos del usuario
      getMe()
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          // Si falla, limpiar el token
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    try {
      const response = await loginApi({ username, password })
      localStorage.setItem("access_token", response.access)
      localStorage.setItem("refresh_token", response.refresh)
      const userData = await getMe()
      setUser(userData)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Error al iniciar sesión",
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await registerApi(userData)
      localStorage.setItem("access_token", response.access)
      localStorage.setItem("refresh_token", response.refresh)
      setUser(response.user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || "Error al registrar usuario",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

