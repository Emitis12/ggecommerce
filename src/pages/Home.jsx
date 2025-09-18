// src/pages/Home.jsx
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Badge } from "antd"
import { ShoppingCartOutlined } from "@ant-design/icons"
import { useCartDispatch, useCartState } from "../context/CartContext"
import { fetchProducts } from "../services/api"
import ProductCard from "../components/ProductCard"
import ProductModal from "../components/ProductModal"
import Cart from "../components/Cart"
import Footer from "../components/Footer"

export default function Home() {
  const [products, setProducts] = useState([])
  const [selected, setSelected] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const dispatch = useCartDispatch()
  const { items } = useCartState()

  useEffect(() => {
    fetchProducts().then((data) => {
      // Normalize API response to match ProductCard props
      const mapped = data.map((p) => ({
        id: p.ID,
        title: p.Title,
        price: Number(p.Price),
        images: [p.ImageURL], // ensure array
      }))
      setProducts(mapped)
    })
  }, [])

  function handleAddToCart(product, qty) {
    dispatch({ type: "ADD_ITEM", payload: { product, qty } })
    setSelected(null)
  }

  function handleOrderNow(product, qty) {
    dispatch({ type: "ADD_ITEM", payload: { product, qty } })
    setSelected(null)
    setShowCart(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow flex justify-between items-center px-6 py-4">
        <h1 className="font-bold text-xl">
          <Link to="/">Gadget Store</Link>
        </h1>
        <div className="flex items-center gap-4">
          <Link to="/checkout">
            <Button type="primary">Checkout</Button>
          </Link>
          <Button type="text" onClick={() => setShowCart(true)}>
            <Badge count={items.reduce((s, i) => s + i.qty, 0)}>
              <ShoppingCartOutlined style={{ fontSize: 20 }} />
            </Badge>
          </Button>
        </div>
      </header>

      {/* Products */}
      <main className="flex-1 max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={setSelected} />
        ))}
      </main>

      {/* Product Modal */}
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAddToCart={handleAddToCart}
          onOrderNow={handleOrderNow}
        />
      )}

      {/* Cart Sidebar */}
      <Cart open={showCart} onClose={() => setShowCart(false)} />

      {/* Footer */}
      <Footer />
    </div>
  )
}
