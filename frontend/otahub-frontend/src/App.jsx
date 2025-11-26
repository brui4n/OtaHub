import { Routes, Route } from "react-router-dom"
import { useState } from "react"
import { AuthProvider } from "./contexts/AuthContext"
import Home from "./pages/Home"
import DetalleProducto from "./pages/DetalleProducto"
import Carrito from "./pages/Carrito"
import Categorias from "./pages/Categorias"
import ProductosPorCategoria from "./pages/ProductosPorCategoria"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Historial from "./pages/Historial"
import Success from "./pages/Success"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  const [search, setSearch] = useState("")

  return (
    <AuthProvider>
      {/* Pasamos search y setSearch al Navbar */}
      <Navbar search={search} setSearch={setSearch} />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home search={search} />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categoria/:id" element={<ProductosPorCategoria />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/carrito" 
          element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/historial" 
          element={
            <ProtectedRoute>
              <Historial />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/success" 
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  )
}