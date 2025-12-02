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
      alert("Producto agregado al carrito")
    },
    onError: (error) => {
      const msg = error.response?.data?.error || "Error al agregar al carrito"
      alert(msg)
    }
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
    <div 
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        textAlign: "center"
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img 
            src={imageUrl} 
            alt={product.name} 
            style={{ 
                width: "100%", 
                height: "280px", 
                objectFit: "cover", 
                borderRadius: "var(--radius)",
                marginBottom: "1rem"
            }}
        />

        <h3 
            style={{ 
                margin: "0 0 0.5rem 0", 
                cursor: "pointer", 
                fontSize: "1.1rem",
                color: "var(--primary)",
                minHeight: "54px",
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

        <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--secondary)", margin: "0 0 1rem 0" }}>
            S/. {product.price}
        </p>
        
        {product.stock <= 0 && (
            <p style={{ color: "#ef4444", fontWeight: "bold", fontSize: "0.9rem", marginTop: "-0.5rem", marginBottom: "1rem" }}>
                Agotado
            </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "auto" }}>
        <Link 
            to={`/producto/${product.id}`} 
            className="btn btn-primary"
            onMouseEnter={prefetchProduct}
        >
            Ver Detalles
        </Link>

        <button
            onClick={handleAddToCart}
            disabled={mutation.isPending || product.stock <= 0}
            className="btn btn-secondary"
            style={{ opacity: product.stock <= 0 ? 0.5 : 1, cursor: product.stock <= 0 ? "not-allowed" : "pointer" }}
        >
            {mutation.isPending ? "..." : product.stock <= 0 ? "Sin Stock" : "Agregar"}
        </button>
      </div>
    </div>
  )
}