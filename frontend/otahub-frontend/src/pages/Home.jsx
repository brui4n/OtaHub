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
    <div className="container">
      <h1>Todos los Productos</h1>

      {/* Botones de filtro dinámicos */}
      <div style={{ margin: "2rem 0", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`btn ${selectedCategory === null ? "btn-primary" : "btn-outline"}`}
        >
          Todos
        </button>
        
        {categories.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setSelectedCategory(cat.name)}
            className={`btn ${selectedCategory === cat.name ? "btn-primary" : "btn-outline"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <div className="grid-products">
        {filteredProducts.map(prod => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  )
}