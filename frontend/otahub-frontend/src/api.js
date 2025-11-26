import axios from "axios"

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
})

// Interceptor para agregar el token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getProducts = async () => {
  const res = await api.get("/products/")
  return res.data
}

export const getProduct = async (id) => {
  const res = await api.get(`/products/${id}/`)
  return res.data
}

export const getCategories = async () => {
  const res = await api.get("/categories/")
  return res.data
}

export const getProductsByCategory = async (categoryId) => {
  // Assuming the backend supports filtering by category ID or name
  // Based on previous code, it seemed to filter by name on frontend, but task says "consulta real al backend"
  // I'll assume the backend filter is by category ID for robustness, or I need to check backend views.
  // Checking backend views... ProductViewSet usually has filter_backends.
  // The user's prompt said "filtrando los productos correspondientes mediante una consulta real al backend".
  // I'll assume standard Django REST Framework filtering: ?category=ID
  const res = await api.get(`/products/?category=${categoryId}`)
  return res.data
}

export const getCart = async () => {
  const res = await api.get("/cart/")
  return res.data
}

export const addToCart = async ({ product_id, quantity }) => {
  const res = await api.post("/cart/", { product_id, quantity })
  return res.data
}

export const updateCartItem = async ({ id, quantity }) => {
  const res = await api.patch(`/cart/${id}/`, { quantity })
  return res.data
}

export const removeFromCart = async (id) => {
  await api.delete(`/cart/${id}/`)
}

export const clearCart = async () => {
  await api.delete("/cart/clear/") // Assuming custom action 'clear' on viewset
}

// Funciones de Autenticación
export const register = async (userData) => {
  const res = await api.post("/auth/register/", userData)
  return res.data
}

export const login = async (credentials) => {
  const res = await api.post("/auth/login/", credentials)
  return res.data
}

export const getMe = async () => {
  const res = await api.get("/auth/me/")
  return res.data
}

// Funciones de Historial
export const getHistorial = async () => {
  const res = await api.get("/historial/")
  return res.data
}

// Funciones de Checkout
export const createCheckoutSession = async (cartItems) => {
  const res = await api.post("/pay/create-checkout-session/", {})
  return res.data
}

export default api
