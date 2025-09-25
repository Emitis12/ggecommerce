import React, { useState } from "react";
import { Modal, Button, InputNumber } from "antd";

export default function ProductModal({ product, onClose, onAddToCart, onOrderNow }) {
  const [qty, setQty] = useState(1);
  if (!product) return null;

  const image = product.image || "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <Modal
      title={<span className="font-semibold text-lg">{product.title}</span>}
      open={!!product}
      onCancel={onClose}
      footer={null}
      width={700}
      className="rounded-xl"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src={image}
            alt={product.title || "Product"}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>

        {/* Details */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <div className="text-2xl font-bold text-blue-600">
            ₦{(product.price || 0).toLocaleString()}
          </div>
          <p className="text-gray-600">{product.description}</p>

          <div className="flex items-center gap-4">
            <span className="font-medium">Quantity:</span>
            <InputNumber min={1} value={qty} onChange={setQty} />
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              type="primary"
              className="rounded-lg"
              onClick={() => onAddToCart(product, qty)}
            >
              Add to Cart
            </Button>
            <Button
              className="rounded-lg"
              onClick={() => onOrderNow(product, qty)}
            >
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
