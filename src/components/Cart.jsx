import React from "react";
import { useCartState, useCartDispatch } from "../context/CartContext";
import { Drawer, Button, Typography, InputNumber, Divider } from "antd";
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
          <ShoppingCartOutlined className="text-blue-600 text-xl" />
          <span className="font-semibold text-lg">Your Cart</span>
        </div>
      }
      placement="right"
      open={open}
      onClose={onClose}
      width="50%" // Half screen width for mobile
      bodyStyle={{ padding: "1rem", backgroundColor: "#f9fafb" }}
      headerStyle={{ borderBottom: "1px solid #e5e7eb" }}
    >
      {items.length === 0 ? (
        <div className="flex justify-center items-center h-full text-gray-500 font-medium">
          Your cart is empty 🛒
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {items.map((i) =>
              i?.product ? (
                <div
                  key={i.product._id || i.product.id}
                  className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={
                      i.product.image ||
                      "https://via.placeholder.com/80x60?text=No+Image"
                    }
                    alt={i.product.title || "Product"}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <h4 className="font-semibold text-gray-800 truncate">
                      {i.product.title}
                    </h4>
                    <div className="text-blue-600 font-medium">
                      ₦{((i.product.price || 0) * (i.qty || 0)).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <InputNumber
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
                        size="small"
                      />
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          dispatch({
                            type: "REMOVE_ITEM",
                            payload: { productId: i.product.id || i.product._id },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>

          {/* Footer */}
          <Divider />
          <div className="flex justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
          <Button
            type="primary"
            size="large"
            className="w-full mt-4 rounded-lg bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              onClose(); // close drawer
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
