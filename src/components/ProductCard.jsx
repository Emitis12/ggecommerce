import React, { useState } from "react";
import { Button, Card } from "antd";

export default function ProductCard({ product, onOpen }) {
  const [hovered, setHovered] = useState(false);

  // Use vendor imageUrl or fallback placeholder
  const main = product.imageUrl || "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Card
      hoverable
      className="rounded-xl shadow-md transition-transform transform hover:scale-105"
      cover={
        <div
          className="w-full h-56 bg-gray-100 cursor-pointer overflow-hidden"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => onOpen(product)}
        >
          <img
            src={main}
            alt={product.title || "Product"}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>
      }
    >
      <Card.Meta
        title={<span className="font-semibold">{product.title}</span>}
        description={
          <span className="text-blue-600 font-medium">
            ₦{(product.price || 0).toLocaleString()}
          </span>
        }
      />
      <div className="mt-3 text-right">
        <Button size="small" type="primary" onClick={() => onOpen(product)}>
          View
        </Button>
      </div>
    </Card>
  );
}
