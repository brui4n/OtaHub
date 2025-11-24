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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Categorías</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            style={{ 
              border: "1px solid #444", 
              borderRadius: "15px", 
              overflow: "hidden",
              textAlign: "center",
              cursor: "pointer",
              background: "#1f2937",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => {
                prefetchCategoryProducts(cat.id)
                e.currentTarget.style.transform = "scale(1.05)"
            }}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <Link 
                to={`/categoria/${cat.id}`} 
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
                <div style={{ height: "150px", overflow: "hidden" }}>
                    <img 
                        src={cat.image || "https://via.placeholder.com/300x150?text=Sin+Imagen"} 
                        alt={cat.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
                <div style={{ padding: "15px" }}>
                    <h2 style={{ margin: "0", fontSize: "22px", color: "#60a5fa" }}>{cat.name}</h2>
                    {cat.description && <p style={{ fontSize: "14px", color: "#9ca3af", marginTop: "5px" }}>{cat.description}</p>}
                </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
