import React from "react";
import { useCartState, useCartDispatch } from "../context/CartContext";
import { Drawer, Button, List, Typography, InputNumber } from "antd";

export default function Cart({ open, onClose }) {
  const { items } = useCartState();
  const dispatch = useCartDispatch();
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <Drawer title="Your Cart" placement="right" open={open} onClose={onClose} width={400}>
      {items.length === 0 ? (
        <Typography.Text>Your cart is empty</Typography.Text>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={(i) => (
              <List.Item
                actions={[
                  <InputNumber
                    key="qty"
                    min={1}
                    value={i.qty}
                    onChange={(q) => dispatch({ type: "UPDATE_QTY", payload: { productId: i.product.id, qty: q } })}
                  />,
                  <Button
                    key="remove"
                    danger
                    type="link"
                    onClick={() => dispatch({ type: "REMOVE_ITEM", payload: { productId: i.product.id } })}
                  >
                    Remove
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<img src={i.product.images[0]} className="w-16 h-12 object-cover rounded" />}
                  title={i.product.title}
                  description={`₦${(i.product.price * i.qty).toLocaleString()}`}
                />
              </List.Item>
            )}
          />
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between font-semibold">Subtotal <span>₦{total.toLocaleString()}</span></div>
            <Button type="primary" className="w-full mt-4">Proceed to Checkout</Button>
          </div>
        </>
      )}
    </Drawer>
  );
}
