import React from "react";
import { Button } from "antd";
import { FireOutlined } from "@ant-design/icons";

export default function TrendingCard({ product, onOpen }) {
  const main = product.image || "https://via.placeholder.com/400x250?text=No+Image";

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] cursor-pointer group"
      onClick={() => onOpen(product)}
    >
      {/* Product Image */}
      <img
        src={main}
        alt={product.title || "Product"}
        className="w-full h-64 object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-all duration-500"></div>

      {/* Content overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <FireOutlined className="text-orange-400 text-xl animate-pulse" />
          <span className="uppercase tracking-wide text-sm text-orange-400 font-semibold">
            Trending
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-bold mb-1">{product.title}</h3>
        <p className="text-blue-300 text-sm md:text-base font-medium">
          ₦{(product.price || 0).toLocaleString()}
        </p>
        <Button
          type="primary"
          size="small"
          className="mt-3 bg-blue-600 hover:bg-blue-700 border-none rounded-lg px-4"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(product);
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
