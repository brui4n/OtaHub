import { Routes, Route } from "react-router-dom"
import { useState } from "react"
import Home from "./pages/Home"
import DetalleProducto from "./pages/DetalleProducto"
import Carrito from "./pages/Carrito"
import Navbar from "./components/Navbar"

export default function App() {
  const [search, setSearch] = useState("")

  return (
    <>
      {/* Pasamos search y setSearch al Navbar */}
      <Navbar search={search} setSearch={setSearch} />

      <Routes>
        {/* Pasamos search al Home */}
        <Route path="/" element={<Home search={search} />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
    </>
  )
}