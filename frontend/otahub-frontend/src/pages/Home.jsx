import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import ProductCard from "../components/ProductCard"
import { getProducts } from "../api"

export default function Home({ search }) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  if (isLoading) return <p>Cargando productos...</p>
  if (isError) return <p>Error cargando productos</p>

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