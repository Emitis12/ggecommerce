import React, { useState } from "react"
import { useCartState, useCartDispatch } from "../context/CartContext"
import CheckoutForm from "../components/CheckoutForm"
import { useNavigate, Link } from "react-router-dom"
import { Button, List, Typography } from "antd"

export default function Checkout() {
  const { items } = useCartState()
  const dispatch = useCartDispatch()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>

      {items.length === 0 ? (
        <div className="text-center">
          <Typography.Text>Your cart is empty.</Typography.Text>
          <div className="mt-4">
            <Link to="/">
              <Button type="primary">Back to Home</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={(i) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <img
                      src={i.product.image || "/placeholder.png"}
                      alt={i.product.title || "Product"}
                      className="w-16 h-12 object-cover rounded"
                    />
                  }
                  title={i.product.title || "Untitled Product"}
                  description={`Qty: ${i.qty} | ₦${(
                    i.product.price * i.qty
                  ).toLocaleString()}`}
                />
              </List.Item>
            )}
          />

          <div className="flex justify-between font-semibold mt-4">
            Total <span>₦{total.toLocaleString()}</span>
          </div>

          <div className="mt-6">
            <CheckoutForm
              items={items}
              total={total}
              loading={loading}
              setLoading={setLoading} // pass loading state to CheckoutForm
              onSuccess={() => {
                dispatch({ type: "CLEAR_CART" }) // clear cart after success
                navigate("/success") // redirect to success page
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
