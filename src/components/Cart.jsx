import React from "react";
import { useCartState, useCartDispatch } from "../context/CartContext";
import { Drawer, Button, List, Typography, InputNumber, Divider } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Cart({ open, onClose }) {
  const { items = [] } = useCartState();
  const dispatch = useCartDispatch();
  const navigate = useNavigate();

  const total = items.reduce(
    (s, i) => s + (i?.product?.price || 0) * (i?.qty || 0),
    0
  );

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <ShoppingCartOutlined className="text-blue-600" />
          <span className="font-semibold">Your Cart</span>
        </div>
      }
      placement="right"
      open={open}
      onClose={onClose}
      width={420}
    >
      {items.length === 0 ? (
        <Typography.Text type="secondary">
          Your cart is empty 🛒
        </Typography.Text>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={(i) =>
              i?.product ? (
                <List.Item
                  className="hover:bg-gray-50 rounded-lg px-2"
                  actions={[
                    <InputNumber
                      key="qty"
                      min={1}
                      value={i.qty}
                      onChange={(q) =>
                        dispatch({
                          type: "UPDATE_QTY",
                          payload: {
                            productId: i.product.id || i.product._id,
                            qty: q,
                          },
                        })
                      }
                    />,
                    <Button
                      key="remove"
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        dispatch({
                          type: "REMOVE_ITEM",
                          payload: { productId: i.product.id || i.product._id },
                        })
                      }
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <img
                        src={
                          i.product.image ||
                          "https://via.placeholder.com/80x60?text=No+Image"
                        }
                        alt={i.product.title || "Product image"}
                        className="w-16 h-14 object-cover rounded-lg"
                      />
                    }
                    title={
                      <span className="font-medium">{i.product.title}</span>
                    }
                    description={`₦${(
                      (i.product.price || 0) * (i.qty || 0)
                    ).toLocaleString()}`}
                  />
                </List.Item>
              ) : null
            }
          />
          <Divider />
          <div className="flex justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
          <Button
            type="primary"
            size="large"
            className="w-full mt-4 rounded-lg"
            onClick={() => {
              onClose(); // close the cart drawer
              navigate("/checkout"); // go to checkout page
            }}
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </Drawer>
  );
}
