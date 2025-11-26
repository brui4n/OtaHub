import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.password2) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    const result = await register(formData)
    
    if (result.success) {
      navigate("/")
    } else {
      if (typeof result.error === "object") {
        const errorMessages = Object.values(result.error).flat().join(", ")
        setError(errorMessages)
      } else {
        setError(result.error)
      }
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
        maxWidth: "500px"
      }}>
        <h1 style={{
          fontSize: "28px",
          marginBottom: "30px",
          textAlign: "center",
          color: "white"
        }}>
          Crear Cuenta
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#d1d5db",
                fontSize: "14px",
                fontWeight: "500"
              }}>
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
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
                placeholder="Nombre"
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#d1d5db",
                fontSize: "14px",
                fontWeight: "500"
              }}>
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
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
                placeholder="Apellido"
              />
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
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
              name="username"
              value={formData.username}
              onChange={handleChange}
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
              placeholder="Usuario"
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#d1d5db",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              placeholder="email@ejemplo.com"
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
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
              name="password"
              value={formData.password}
              onChange={handleChange}
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
              placeholder="Contraseña"
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
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
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
              placeholder="Confirma tu contraseña"
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
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p style={{
          marginTop: "20px",
          textAlign: "center",
          color: "#9ca3af"
        }}>
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            style={{
              color: "#646cff",
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

