import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"

export default function Success() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const queryClient = useQueryClient()

  useEffect(() => {
    // Invalidar queries para refrescar datos
    queryClient.invalidateQueries({ queryKey: ["cart"] })
    queryClient.invalidateQueries({ queryKey: ["historial"] })
    queryClient.invalidateQueries({ queryKey: ["products"] })
  }, [queryClient])

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 200px)",
      padding: "20px"
    }}>
      <div style={{
        background: "#1f2937",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        textAlign: "center",
        maxWidth: "500px",
        width: "100%"
      }}>
        <div style={{
          fontSize: "64px",
          marginBottom: "20px"
        }}>
          ✅
        </div>
        
        <h1 style={{
          fontSize: "28px",
          color: "white",
          marginBottom: "15px"
        }}>
          ¡Pago Exitoso!
        </h1>

        <p style={{
          color: "#9ca3af",
          fontSize: "16px",
          marginBottom: "30px",
          lineHeight: "1.6"
        }}>
          Tu compra se ha procesado correctamente. 
          {sessionId && (
            <span style={{ display: "block", marginTop: "10px", fontSize: "14px" }}>
              ID de sesión: {sessionId}
            </span>
          )}
        </p>

        <div style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <Link
            to="/historial"
            style={{
              padding: "12px 24px",
              background: "#646cff",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#535bf2"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#646cff"
            }}
          >
            Ver Historial
          </Link>

          <Link
            to="/"
            style={{
              padding: "12px 24px",
              background: "#374151",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              border: "1px solid #4b5563",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#4b5563"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#374151"
            }}
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

