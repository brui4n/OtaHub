import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import ProductCard from "../components/ProductCard"
import { getProductsByCategory } from "../api"

export default function ProductosPorCategoria() {
  const { id } = useParams()

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", "category", id],
    queryFn: () => getProductsByCategory(id),
    enabled: !!id,
  })

  if (isLoading) return <p>Cargando productos...</p>

  return (
    <div style={{ padding: "20px" }}>
      <h1>Productos de la categoría</h1>
      
      {products.length === 0 ? (
        <p>No hay productos en esta categoría.</p>
      ) : (
        <div
            style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "20px"
            }}
        >
            {products.map(prod => (
            <ProductCard key={prod.id} product={prod} />
            ))}
        </div>
      )}
    </div>
  )
}
