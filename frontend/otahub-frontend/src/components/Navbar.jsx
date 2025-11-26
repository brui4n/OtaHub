import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "../api";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar({ search, setSearch }) {
  const { user, logout } = useAuth();
  
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user, // Solo hacer la query si el usuario está autenticado
  });

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav 
      style={{
        width: "100%",
        background: "#1f2937",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        gap: "20px"
      }}
    >
      {/* Logo */}
      <Link 
        to="/" 
        style={{ 
          color: "white",
          textDecoration: "none",
          fontSize: "24px",
          fontWeight: "bold"
        }}
      >
        Otahub
      </Link>

        {/* 🔍 Barra de búsqueda oscura */}
        <div 
        style={{
            display: "flex",
            alignItems: "center",
            background: "#374151", 
            padding: "10px 14px",
            borderRadius: "20px",
            gap: "10px",
            width: "350px",
            boxShadow: "0 0 6px rgba(0,0,0,0.3)"
        }}
        >
        <span style={{ fontSize: "18px", color: "#9CA3AF" }}>🔍</span>
        
        <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "white",
            fontSize: "16px"
            }}
        />
        </div>

      {/* Enlaces */}
      <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
        <Link to="/categorias" style={{ color: "white", textDecoration: "none" }}>Categorías</Link>
        
        {user ? (
          <>
            <Link to="/carrito" style={{ color: "white", textDecoration: "none", position: "relative" }}>
              Carrito
              {cartCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-12px",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/historial" style={{ color: "white", textDecoration: "none" }}>Historial</Link>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#9ca3af", fontSize: "14px" }}>{user.username}</span>
              <button
                onClick={logout}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
                onMouseEnter={(e) => e.target.style.background = "#dc2626"}
                onMouseLeave={(e) => e.target.style.background = "#ef4444"}
              >
                Salir
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Iniciar Sesión</Link>
            <Link 
              to="/register" 
              style={{ 
                color: "white", 
                textDecoration: "none",
                background: "#646cff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: "500"
              }}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}