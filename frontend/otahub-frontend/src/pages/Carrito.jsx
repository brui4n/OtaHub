import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { getCart, updateCartItem, removeFromCart, getProduct } from "../api"

export default function Carrito() {
  const queryClient = useQueryClient()

  const { data: cart = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  })

  const updateMutation = useMutation({
    mutationFn: updateCartItem,
    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] })
      const previousCart = queryClient.getQueryData(["cart"])

      queryClient.setQueryData(["cart"], (old) =>
        old.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      )

      return { previousCart }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["cart"], context.previousCart)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] })
      const previousCart = queryClient.getQueryData(["cart"])

      queryClient.setQueryData(["cart"], (old) =>
        old.filter((item) => item.id !== id)
      )

      return { previousCart }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["cart"], context.previousCart)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  const increaseQty = (item) => {
    if (item.quantity < item.product.stock) {
        updateMutation.mutate({ id: item.id, quantity: item.quantity + 1 })
    } else {
        alert("No hay más stock disponible")
    }
  }

  const decreaseQty = (item) => {
    if (item.quantity > 1) {
      updateMutation.mutate({ id: item.id, quantity: item.quantity - 1 })
    }
  }

  const deleteItem = (id) => {
    removeMutation.mutate(id)
  }

  if (isLoading) return <p>Cargando carrito...</p>

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

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
                marginBottom: "20px",
                padding: "20px",
                borderRadius: "12px",
                background: "#1f2937",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                gap: "20px"
              }}
            >
              <img 
                src={item.product.image || "https://via.placeholder.com/200x280?text=Sin+Imagen"}
                alt={item.product.name}
                style={{ 
                    width: "120px", 
                    height: "180px", 
                    objectFit: "cover", 
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}
              />

              <div style={{ flex: 1 }}>
                <h3 
                    style={{ 
                        cursor: "pointer", 
                        fontSize: "22px", 
                        marginBottom: "5px",
                        color: "#60a5fa"
                    }}
                    onMouseEnter={() => {
                        queryClient.prefetchQuery({
                            queryKey: ["product", item.product.id],
                            queryFn: () => getProduct(item.product.id),
                        })
                    }}
                >
                    <Link to={`/producto/${item.product.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {item.product.name}
                    </Link>
                </h3>
                <p style={{ fontSize: "18px", color: "#d1d5db", marginBottom: "15px" }}>
                    Precio: <span style={{ fontWeight: "bold", color: "white" }}>S/. {item.product.price}</span>
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      background: "#374151", 
                      borderRadius: "8px",
                      padding: "5px"
                  }}>
                      <button 
                        onClick={() => decreaseQty(item)}
                        disabled={updateMutation.isPending}
                        style={{
                          padding: "5px 12px",
                          fontSize: "18px",
                          cursor: "pointer",
                          background: "transparent",
                          border: "none",
                          color: "white"
                        }}
                      >−</button>

                      <span style={{ fontSize: "18px", fontWeight: "bold", margin: "0 10px", minWidth: "20px", textAlign: "center" }}>
                          {item.quantity}
                      </span>

                      <button 
                        onClick={() => increaseQty(item)}
                        disabled={updateMutation.isPending}
                        style={{
                          padding: "5px 12px",
                          fontSize: "18px",
                          cursor: "pointer",
                          background: "transparent",
                          border: "none",
                          color: "white"
                        }}
                      >+</button>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    disabled={removeMutation.isPending}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#dc2626"}
                    onMouseLeave={(e) => e.target.style.background = "#ef4444"}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              
              <div style={{ textAlign: "right", minWidth: "120px" }}>
                  <p style={{ fontSize: "16px", color: "#9ca3af" }}>Subtotal</p>
                  <p style={{ fontSize: "24px", fontWeight: "bold", color: "#34d399" }}>
                      S/. {(item.product.price * item.quantity).toFixed(2)}
                  </p>
              </div>
            </div>
          ))}

          <div style={{ 
              marginTop: "30px", 
              padding: "20px", 
              background: "#1f2937", 
              borderRadius: "12px", 
              textAlign: "right",
              boxShadow: "0 -4px 6px rgba(0,0,0,0.1)"
          }}>
              <h2 style={{ fontSize: "28px", margin: 0 }}>
                Total a Pagar: <span style={{ color: "#34d399" }}>S/. {total.toFixed(2)}</span>
              </h2>
          </div>
        </div>
      )}
    </div>
  )
}