import { Link } from "react-router-dom"

export default function ProductCard({ product }) {

    const imageUrl = product.image 
    ? product.image
    : "https://via.placeholder.com/200x280?text=Sin+Imagen"

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "10px",
      textAlign: "center"
    }}>
      <img 
        src={imageUrl} 
        alt={product.name} 
        style={{ width: "100%", borderRadius: "5px" }}
      />

      <h3 style={{ margin: "10px 0" }}>{product.name}</h3>

      <p><strong>S/. {product.price}</strong></p>

      <Link 
        to={`/producto/${product.id}`} 
        style={{ 
          display: "inline-block",
          marginTop: "10px",
          padding: "5px 10px",
          background: "#3b82f6",
          color: "white",
          borderRadius: "5px"
        }}
      >
        Ver Detalles
      </Link>
    </div>
  )
}