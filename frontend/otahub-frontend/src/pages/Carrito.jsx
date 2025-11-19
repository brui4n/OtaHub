import { useEffect, useState } from "react"

export default function Carrito() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem("cart")
    setCart(stored ? JSON.parse(stored) : [])
  }, [])

  const updateCart = (newCart) => {
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const increaseQty = (id) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    )
    updateCart(updated)
  }

  const decreaseQty = (id) => {
    const updated = cart
      .map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter(item => item.quantity > 0)

    updateCart(updated)
  }

  const deleteItem = (id) => {
    const updated = cart.filter(item => item.id !== id)
    updateCart(updated)
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div style={{ padding: "20px" }}>
      <h1>Carrito de Compras</h1>

      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {cart.map((item) => (
            <div 
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
                padding: "10px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <div>
                <h3>{item.name}</h3>
                <p>Precio: S/. {item.price}</p>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button 
                    onClick={() => decreaseQty(item.id)}
                    style={{
                      padding: "5px 10px",
                      fontSize: "18px",
                      cursor: "pointer"
                    }}
                  >−</button>

                  <span style={{ fontSize: "16px" }}>{item.quantity}</span>

                  <button 
                    onClick={() => increaseQty(item.id)}
                    style={{
                      padding: "5px 10px",
                      fontSize: "18px",
                      cursor: "pointer"
                    }}
                  >+</button>
                </div>

                <button
                  onClick={() => deleteItem(item.id)}
                  style={{
                    marginTop: "10px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Eliminar
                </button>
              </div>

              <img 
                src={item.image}
                alt={item.name}
                style={{ width: "80px", borderRadius: "6px" }}
              />
            </div>
          ))}

          <h2 style={{ marginTop: "20px" }}>
            Total: S/. {total.toFixed(2)}
          </h2>
        </div>
      )}
    </div>
  )
}