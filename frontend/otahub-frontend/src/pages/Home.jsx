import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import ProductCard from "../components/ProductCard"
import { getProducts, getCategories } from "../api"

export default function Home({ search }) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const { data: products = [], isLoading: loadingProducts, isError: errorProducts } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  if (loadingProducts || loadingCategories) return <p>Cargando...</p>
  if (errorProducts) return <p>Error cargando datos</p>

  // Filtro combinado (búsqueda + categoría)
  const filteredProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(p =>
      // Si no hay categoría seleccionada, mostrar todo
      // Si hay categoría seleccionada, comparar con el nombre de la categoría del producto
      !selectedCategory || p.category.name === selectedCategory
    )

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todos los Productos</h1>

      {/* Botones de filtro dinámicos */}
      <div style={{ margin: "20px 0", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button 
          onClick={() => setSelectedCategory(null)}
          style={{
            background: selectedCategory === null ? "#3b82f6" : "#1f2937",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Todos
        </button>
        
        {categories.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setSelectedCategory(cat.name)}
            style={{
              background: selectedCategory === cat.name ? "#3b82f6" : "#1f2937",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {cat.name}
          </button>
        ))}
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