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

  if (loading) return <div className="container" style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</div>;
  if (!product) return <div className="container" style={{ textAlign: "center", marginTop: "2rem" }}>No se encontró el producto.</div>;

  const getTypeLabel = (type) => {
      const types = {
          'manga': 'Manga',
          'ln': 'Light Novel',
          'manhwa': 'Manhwa',
          'manhua': 'Manhua'
      };
      return types[type] || type;
  };

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      
      {/* Botón volver */}
      <Link to="/" className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
        <span>←</span> Volver al inicio
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "start" }}>
        
        {/* Columna Imagen */}
        <div style={{ position: "sticky", top: "2rem" }}>
            <div className="card" style={{ padding: 0, overflow: "hidden", border: "none", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
                <img
                    src={product.image || "https://via.placeholder.com/400x600?text=Sin+Imagen"}
                    alt={product.name}
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        objectFit: "cover"
                    }}
                />
            </div>
        </div>

        {/* Columna Detalles */}
        <div>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <span style={{ 
                    background: "var(--primary)", 
                    color: "white", 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "9999px", 
                    fontSize: "0.875rem", 
                    fontWeight: "600" 
                }}>
                    {getTypeLabel(product.type)}
                </span>
                <span style={{ 
                    background: "var(--secondary)", 
                    color: "white", 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "9999px", 
                    fontSize: "0.875rem", 
                    fontWeight: "600" 
                }}>
                    {product.category.name}
                </span>
            </div>

            <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem", lineHeight: "1.2" }}>
                {product.name}
            </h1>
            
            <p style={{ fontSize: "1.25rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                por <span style={{ color: "var(--text-light)" }}>{product.author}</span>
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem", padding: "1.5rem", background: "var(--card-bg)", borderRadius: "1rem", border: "1px solid var(--border)" }}>
                <div>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Precio</p>
                    <p style={{ fontSize: "2rem", fontWeight: "700", color: "var(--primary)" }}>
                        S/. {product.price}
                    </p>
                </div>
                <div style={{ width: "1px", height: "40px", background: "var(--border)" }}></div>
                <div>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Stock</p>
                    <p style={{ fontSize: "1.25rem", fontWeight: "600", color: product.stock > 0 ? "#10b981" : "#ef4444" }}>
                        {product.stock > 0 ? `${product.stock} unidades` : "Agotado"}
                    </p>
                </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                    Sinopsis
                </h3>
                <p style={{ lineHeight: "1.8", color: "var(--text-light)", fontSize: "1.1rem", whiteSpace: "pre-line" }}>
                    {product.description}
                </p>
            </div>

            <button
                className="btn btn-primary"
                style={{ 
                    width: "100%", 
                    padding: "1rem", 
                    fontSize: "1.1rem", 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    gap: "0.5rem" 
                }}
                onClick={handleAddToCart}
                disabled={mutation.isPending || product.stock === 0}
            >
                {mutation.isPending ? (
                    "Agregando..."
                ) : product.stock === 0 ? (
                    "Agotado"
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        Agregar al Carrito
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}