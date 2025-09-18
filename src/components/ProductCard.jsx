import React, { useState } from "react";
import { Button, Card } from "antd";

export default function ProductCard({ product, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const images = product.images && product.images.length ? product.images : ["/placeholder.png"];
  const main = images[0];
  const hoverImg = images[1] || main;

  const vendorInfo = {
    vendorEmail: product.vendorEmail || "",
    vendorName: product.vendorName || "",
    vendorLogo: product.vendorLogo || "",
  };

  return (
    <Card
      hoverable
      cover={
        <div
          className="w-full h-48 bg-gray-100 cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => onOpen({ ...product, ...vendorInfo })}
        >
          <img src={hovered ? hoverImg : main} alt={product.title} className="w-full h-full object-cover" />
        </div>
      }
      className="rounded-lg shadow-sm"
    >
      <Card.Meta title={product.title} description={`₦${product.price.toLocaleString()}`} />
      <div className="mt-3 text-right">
        <Button size="small" onClick={() => onOpen({ ...product, ...vendorInfo })}>View</Button>
      </div>
    </Card>
  );
}
