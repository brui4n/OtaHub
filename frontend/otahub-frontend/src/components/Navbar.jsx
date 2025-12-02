import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "../api";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar({ search, setSearch }) {
  const { user, logout } = useAuth();
  
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user,
  });

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav style={{
      width: "100%",
      background: "var(--surface)",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "var(--shadow)",
      position: "sticky",
      top: 0,
      zIndex: 10,
      borderBottom: "1px solid var(--border)"
    }}>
      {/* Logo */}
      <Link 
        to="/" 
        style={{ 
          color: "white",
          fontSize: "1.5rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
      >
        <span style={{ fontSize: "1.8rem" }}>⛩️</span> Otahub
      </Link>

      {/* 🔍 Barra de búsqueda */}
      <div style={{ position: "relative", width: "350px" }}>
        <span style={{ 
          position: "absolute", 
          left: "12px", 
          top: "50%", 
          transform: "translateY(-50%)",
          fontSize: "1.2rem"
        }}>
          🔍
        </span>
        
        <input
          className="input"
          type="text"
          placeholder="Buscar manga..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: "40px" }}
        />
      </div>

      {/* Enlaces */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link to="/" className="btn btn-outline" style={{ border: "none" }}>Home</Link>
        <Link to="/categorias" className="btn btn-outline" style={{ border: "none" }}>Categorías</Link>
        
        {user ? (
          <>
            <Link to="/carrito" className="btn btn-outline" style={{ position: "relative", border: "none" }}>
              🛒 Carrito
              {cartCount > 0 && (
                <span className="badge" style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/historial" className="btn btn-outline" style={{ border: "none" }}>📜 Historial</Link>
            
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginLeft: "1rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Hola, {user.username}</span>
              <button onClick={logout} className="btn btn-danger">
                Salir
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
            <Link to="/register" className="btn btn-primary">Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  );
}