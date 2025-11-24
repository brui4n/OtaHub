import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../api";

export default function DetalleProducto() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      alert(`Producto "${product?.name || 'seleccionado'}" agregado al carrito`);
    },
    onError: (error) => {
        console.error(error);
        alert("Error al agregar al carrito");
    }
  });

  const handleAddToCart = () => {
    if (product) {
        mutation.mutate({ product_id: product.id, quantity: 1 });
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error cargando producto:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!product) return <p>No se encontró el producto.</p>;



  return (
    <div style={{
      maxWidth: "1100px",
      margin: "40px auto",
      padding: "0 20px",
    }}>

      {/* Botón volver al home */}
      <Link 
        to="/" 
        style={{
          display: "inline-block",
          marginBottom: "25px",
          padding: "8px 15px",
          background: "#374151",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none",
          fontSize: "14px",
          transition: "0.2s"
        }}
        onMouseOver={(e) => e.target.style.opacity = "0.8"}
        onMouseOut={(e) => e.target.style.opacity = "1"}
      >
        ⬅ Volver al inicio
      </Link>

      <div style={{
        display: "flex",
        gap: "40px",
        alignItems: "flex-start"
      }}>
        
        {/* Imagen */}
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "350px",
            height: "auto",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
            objectFit: "cover",
            background: "#111"
          }}
        />

        {/* Info */}
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: "10px" }}>{product.name}</h1>

          <p><strong>Categoría:</strong> {product.category.name}</p>
          <p><strong>Volumen:</strong> {product.volume ?? "—"}</p>
          <p><strong>Autor:</strong> {product.author}</p>
          <p><strong>Precio:</strong> S/. {product.price}</p>
          <p><strong>Stock disponible:</strong> {product.stock}</p>

          <p style={{
            marginTop: "20px",
            lineHeight: "1.6",
            background: "rgba(255,255,255,0.05)",
            padding: "15px",
            borderRadius: "8px"
          }}>
            {product.description}
          </p>

            <button
                style={{
                    padding: "10px 20px",
                    marginTop: "20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "0.2s"
                }}
                onMouseOver={(e) => e.target.style.opacity = "0.85"}
                onMouseOut={(e) => e.target.style.opacity = "1"}
                onClick={handleAddToCart}
                disabled={mutation.isPending}
                >
                {mutation.isPending ? "Agregando..." : "🛒 Agregar al Carrito"}
            </button>
        </div>
      </div>
    </div>
  );
}