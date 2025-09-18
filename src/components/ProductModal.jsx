import React, { useState } from "react";
import { Modal, Button, Carousel, InputNumber } from "antd";

export default function ProductModal({ product, onClose, onAddToCart, onOrderNow }) {
  const [qty, setQty] = useState(1);
  if (!product) return null;

  const images = product.images && product.images.length ? product.images : ["/placeholder.png"];

  return (
    <Modal title={product.title} open={!!product} onCancel={onClose} footer={null} width={800}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <Carousel autoplay>
            {images.map((src, i) => (
              <img key={i} src={src} alt="product" className="w-full h-72 object-cover rounded" />
            ))}
          </Carousel>
        </div>
        <div className="md:w-1/2">
          <div className="text-2xl font-bold mb-2">₦{product.price.toLocaleString()}</div>
          <p className="mb-4 text-sm text-gray-600">{product.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <span className="font-medium">Quantity:</span>
            <InputNumber min={1} value={qty} onChange={setQty} />
          </div>

          <div className="flex gap-3">
            <Button type="primary" onClick={() => onAddToCart(product, qty)}>Add to Cart</Button>
            <Button onClick={() => onOrderNow(product, qty)}>Order Now</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
