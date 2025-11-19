import { Link } from "react-router-dom";

export default function Navbar({ search, setSearch }) {
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
      <div style={{ display: "flex", gap: "25px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
        <Link to="/carrito" style={{ color: "white", textDecoration: "none" }}>Carrito</Link>
      </div>
    </nav>
  );
}