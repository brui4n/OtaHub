import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import ProductCard from "../components/ProductCard"
import { getProducts, getCategories } from "../api"

export default function Home({ search }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedType, setSelectedType] = useState(null) // Nuevo estado para tipo de producto

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  // Filtrado combinado: Búsqueda + Categoría + Tipo
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory ? product.category?.name === selectedCategory : true
    const matchesType = selectedType ? product.type === selectedType : true
    
    return matchesSearch && matchesCategory && matchesType
  })

  if (loadingProducts) return <p className="container">Cargando productos...</p>

  const productTypes = [
    { id: 'manga', name: 'Manga' },
    { id: 'ln', name: 'Light Novel' },
    { id: 'manhwa', name: 'Manhwa' },
    { id: 'manhua', name: 'Manhua' },
  ]

  // Agrupar categorías
  const demografias = categories.filter(cat => cat.type === 'demography' || !cat.type);
  const generos = categories.filter(cat => cat.type === 'genre');

  const renderCategoryButtons = (cats) => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {cats.map(cat => (
        <button 
            key={cat.id} 
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            className={`btn ${selectedCategory === cat.name ? "btn-secondary" : "btn-outline"}`}
        >
            {cat.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="container">
      <h1>Todos los Productos</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", margin: "2rem 0" }}>
        
        {/* Filtro por Tipo de Producto */}
        <div>
            <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Tipo de Producto:</h3>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button 
                    onClick={() => setSelectedType(null)}
                    className={`btn ${selectedType === null ? "btn-primary" : "btn-outline"}`}
                >
                    Todos
                </button>
                {productTypes.map(type => (
                    <button 
                        key={type.id} 
                        onClick={() => setSelectedType(type.id)}
                        className={`btn ${selectedType === type.id ? "btn-primary" : "btn-outline"}`}
                    >
                        {type.name}
                    </button>
                ))}
            </div>
        </div>

        {/* Filtro por Demografía */}
        {demografias.length > 0 && (
            <div>
                <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Demografía:</h3>
                {renderCategoryButtons(demografias)}
            </div>
        )}

        {/* Filtro por Género */}
        {generos.length > 0 && (
            <div>
                <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Género:</h3>
                {renderCategoryButtons(generos)}
            </div>
        )}
        
        {/* Botón para limpiar filtros de categoría si hay alguno seleccionado */}
        {selectedCategory && (
            <div>
                <button 
                    onClick={() => setSelectedCategory(null)}
                    className="btn btn-danger"
                    style={{ fontSize: "0.8rem", padding: "0.3rem 0.8rem" }}
                >
                    Limpiar Filtro de Categoría
                </button>
            </div>
        )}
      </div>

      {/* Grid de productos */}
      <div className="grid-products">
        {filteredProducts.length > 0 ? (
            filteredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
            ))
        ) : (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--text-muted)" }}>
                No se encontraron productos con estos filtros.
            </p>
        )}
      </div>
    </div>
  )
}