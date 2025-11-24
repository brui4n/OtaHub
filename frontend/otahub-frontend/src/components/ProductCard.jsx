import { Link } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addToCart, getProduct } from "../api"

export default function ProductCard({ product }) {
  const queryClient = useQueryClient()

  const imageUrl = product.image 
    ? product.image
    : "https://via.placeholder.com/200x280?text=Sin+Imagen"

  const mutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  const handleAddToCart = () => {
    mutation.mutate({ product_id: product.id, quantity: 1 })
  }

  const prefetchProduct = () => {
    queryClient.prefetchQuery({
      queryKey: ["product", product.id],
      queryFn: () => getProduct(product.id),
    })
  }

  return (
    <div style={{
      border: "1px solid #444",
      borderRadius: "15px",
      padding: "15px",
      textAlign: "center",
      background: "#1f2937",
      boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      transition: "transform 0.2s",
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img 
            src={imageUrl} 
            alt={product.name} 
            style={{ 
                width: "100%", 
                height: "280px", 
                objectFit: "cover", 
                borderRadius: "10px",
                marginBottom: "15px"
            }}
        />

        <h3 
            style={{ 
                margin: "0 0 10px 0", 
                cursor: "pointer", 
                fontSize: "18px",
                color: "#60a5fa",
                minHeight: "54px", // Para alinear títulos de 2 líneas
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            onMouseEnter={prefetchProduct}
        >
            <Link to={`/producto/${product.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                {product.name}
            </Link>
        </h3>

        <p style={{ fontSize: "20px", fontWeight: "bold", color: "#34d399", margin: "0 0 15px 0" }}>
            S/. {product.price}
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "auto" }}>
        <Link 
            to={`/producto/${product.id}`} 
            style={{ 
            padding: "8px 16px",
            background: "#3b82f6",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px"
            }}
            onMouseEnter={prefetchProduct}
        >
            Ver Detalles
        </Link>

        <button
            onClick={handleAddToCart}
            disabled={mutation.isPending}
            style={{
                padding: "8px 16px",
                background: "#10b981",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px"
            }}
        >
            {mutation.isPending ? "..." : "Agregar"}
        </button>
      </div>
    </div>
  )
}