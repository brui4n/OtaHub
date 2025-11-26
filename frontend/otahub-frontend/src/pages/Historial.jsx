import { useQuery } from "@tanstack/react-query"
import { getHistorial } from "../api"
import { Link } from "react-router-dom"

export default function Historial() {
  const { data: compras = [], isLoading, isError } = useQuery({
    queryKey: ["historial"],
    queryFn: getHistorial,
  })

  if (isLoading) return <p style={{ padding: "20px", color: "white" }}>Cargando historial...</p>
  if (isError) return <p style={{ padding: "20px", color: "#ef4444" }}>Error al cargar el historial</p>

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "white", marginBottom: "30px" }}>Historial de Compras</h1>

      {compras.length === 0 ? (
        <div style={{
          background: "#1f2937",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
          color: "#9ca3af"
        }}>
          <p style={{ fontSize: "18px" }}>No tienes compras realizadas aún.</p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "12px 24px",
              background: "#646cff",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold"
            }}
          >
            Ver Productos
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {compras.map((compra) => (
            <div
              key={compra.id}
              style={{
                background: "#1f2937",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "20px",
                paddingBottom: "15px",
                borderBottom: "1px solid #374151"
              }}>
                <div>
                  <h3 style={{ color: "#60a5fa", margin: 0, fontSize: "20px" }}>
                    Compra #{compra.id}
                  </h3>
                  <p style={{ color: "#9ca3af", margin: "5px 0 0 0", fontSize: "14px" }}>
                    {new Date(compra.fecha).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#9ca3af", margin: 0, fontSize: "14px" }}>Total</p>
                  <p style={{ color: "#34d399", margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>
                    S/. {parseFloat(compra.total).toFixed(2)}
                  </p>
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "15px"
              }}>
                {compra.productos.map((producto) => (
                  <Link
                    key={producto.id}
                    to={`/producto/${producto.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit"
                    }}
                  >
                    <div style={{
                      background: "#374151",
                      borderRadius: "8px",
                      overflow: "hidden",
                      transition: "transform 0.2s",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)"
                    }}
                    >
                      <img
                        src={producto.image || "https://via.placeholder.com/200x280?text=Sin+Imagen"}
                        alt={producto.name}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover"
                        }}
                      />
                      <div style={{ padding: "10px" }}>
                        <p style={{
                          color: "white",
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: "500",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {producto.name}
                        </p>
                        <p style={{
                          color: "#9ca3af",
                          margin: "5px 0 0 0",
                          fontSize: "12px"
                        }}>
                          S/. {parseFloat(producto.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

