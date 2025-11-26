import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await login(username, password)
    
    if (result.success) {
      navigate("/")
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

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
        width: "100%",
        maxWidth: "400px"
      }}>
        <h1 style={{
          fontSize: "28px",
          marginBottom: "30px",
          textAlign: "center",
          color: "white"
        }}>
          Iniciar Sesión
        </h1>

        {error && (
          <div style={{
            background: "#ef4444",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#d1d5db",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#374151",
                color: "white",
                fontSize: "16px",
                outline: "none"
              }}
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#d1d5db",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#374151",
                color: "white",
                fontSize: "16px",
                outline: "none"
              }}
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: loading ? "#4b5563" : "#646cff",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = "#535bf2"
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = "#646cff"
            }}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p style={{
          marginTop: "20px",
          textAlign: "center",
          color: "#9ca3af"
        }}>
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            style={{
              color: "#646cff",
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}

