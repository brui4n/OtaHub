import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { getCategories, getProductsByCategory } from "../api"

export default function Categorias() {
  const queryClient = useQueryClient()

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const prefetchCategoryProducts = (categoryId) => {
    queryClient.prefetchQuery({
      queryKey: ["products", "category", categoryId],
      queryFn: () => getProductsByCategory(categoryId),
    })
  }

  if (isLoading) return <p>Cargando categorías...</p>
  
  const demografias = categories.filter(cat => cat.type === 'demography' || !cat.type); // Default to demography if null
  const generos = categories.filter(cat => cat.type === 'genre');

  const renderCategoryGrid = (cats) => (
    <div className="grid-products" style={{ marginTop: "1rem" }}>
      {cats.map((cat) => (
        <div 
          key={cat.id} 
          className="card"
          style={{ 
            padding: 0,
            overflow: "hidden",
            cursor: "pointer",
            textAlign: "center"
          }}
          onMouseEnter={(e) => {
              prefetchCategoryProducts(cat.id)
          }}
        >
          <Link 
              to={`/categoria/${cat.id}`} 
              style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
          >
              <div style={{ height: "150px", overflow: "hidden" }}>
                  <img 
                      src={cat.image || "https://via.placeholder.com/300x150?text=Sin+Imagen"} 
                      alt={cat.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
              </div>
              <div style={{ padding: "1rem" }}>
                  <h2 style={{ margin: "0", fontSize: "1.2rem", color: "var(--primary)" }}>{cat.name}</h2>
                  {cat.description && <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>{cat.description}</p>}
              </div>
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container">
      <h1 style={{ marginBottom: "2rem" }}>Explorar Categorías</h1>
      
      {demografias.length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem", color: "var(--secondary)" }}>
            Demografías
          </h2>
          {renderCategoryGrid(demografias)}
        </section>
      )}

      {generos.length > 0 && (
        <section>
          <h2 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem", color: "var(--secondary)" }}>
            Géneros
          </h2>
          {renderCategoryGrid(generos)}
        </section>
      )}
    </div>
  )
}
