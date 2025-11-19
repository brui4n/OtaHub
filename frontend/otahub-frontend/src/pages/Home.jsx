import { useEffect, useState } from "react"
import ProductCard from "../components/ProductCard"

export default function Home({ search }) {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error cargando productos:", err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Cargando productos...</p>

  // Filtro combinado (búsqueda + categoría)
  const filteredProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(p =>
      !selectedCategory || p.category.name === selectedCategory
    )

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todos los Productos</h1>

      {/* Botones de filtro debajo del título */}
      <div style={{ margin: "20px 0", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={() => setSelectedCategory(null)}>Todos</button>
        <button onClick={() => setSelectedCategory("Shonen")}>Shonen</button>
        <button onClick={() => setSelectedCategory("Seinen")}>Seinen</button>
        <button onClick={() => setSelectedCategory("Isekai")}>Isekai</button>
        <button onClick={() => setSelectedCategory("Comedia / Romance")}>Comedia / Romance</button>
        <button onClick={() => setSelectedCategory("Shojo")}>Shojo</button>
      </div>

      {/* Grid de productos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {filteredProducts.map(prod => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  )
}