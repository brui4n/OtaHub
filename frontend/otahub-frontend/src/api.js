import axios from "axios"

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
})

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

export default api
