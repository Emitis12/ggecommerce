// src/pages/Shop.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Layout,
  Row,
  Col,
  Spin,
  Empty,
  Input,
  Select,
  message,
  FloatButton,
  Button,
} from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  FireOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { useCartDispatch } from "../context/CartContext";
import { fetchProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import Cart from "../components/Cart";

const { Content } = Layout;
const { Option } = Select;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const dispatch = useCartDispatch();

  const tickerRef = useRef(null);
  const isHovered = useRef(false);
  const touchStartX = useRef(0);
  const scrollLeftStart = useRef(0);

  const categories = [
    { key: "all", label: "All" },
    { key: "phones", label: "Phones" },
    { key: "laptops", label: "Laptops" },
    { key: "accessories", label: "Accessories" },
    { key: "gaming", label: "Gaming" },
  ];

  // ===== Fetch Products =====
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await fetchProducts();
        if (res.success && Array.isArray(res.products)) {
          setProducts(res.products);
          setFiltered(res.products);
        } else {
          setProducts([]);
          setFiltered([]);
          message.warning("No products found.");
        }
      } catch (err) {
        console.error(err);
        message.error("Error fetching products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // ===== Filter + Search =====
  useEffect(() => {
    let data = [...products];
    if (filter !== "all") data = data.filter((p) => p.category === filter);
    if (search.trim())
      data = data.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    setFiltered(data);
  }, [filter, search, products]);

  // ===== Cart Actions =====
  const handleAddToCart = (product, qty = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, qty } });
    setSelected(null);
    message.success(`${product.title} added to cart`);
  };
  const handleOrderNow = (product, qty = 1) => {
    handleAddToCart(product, qty);
    setShowCart(true);
  };

  // ===== Scroll to Top =====
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ===== Trending Ticker =====
  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    let speed = 0.5;
    let animationFrame;

    const scroll = () => {
      if (!isHovered.current) {
        ticker.scrollLeft += speed;
        if (ticker.scrollLeft >= ticker.scrollWidth / 2) {
          ticker.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(scroll);
    };
    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [filtered]);

  // ===== Mobile drag support =====
  const handleTouchStart = (e) => {
    isHovered.current = true;
    touchStartX.current = e.touches[0].pageX;
    scrollLeftStart.current = tickerRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX;
    const walk = touchStartX.current - x;
    tickerRef.current.scrollLeft = scrollLeftStart.current + walk;
  };

  const handleTouchEnd = () => {
    isHovered.current = false;
  };

  // ===== Trending Card =====
  const TrendingCard = ({ product, onOpen }) => {
    const mainImage =
      product.image || "https://via.placeholder.com/400x250?text=No+Image";

    return (
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] cursor-pointer group h-64 sm:h-72 md:h-72"
        onClick={() => onOpen(product)}
      >
        <img
          src={mainImage}
          alt={product.title || "Product"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-all duration-500"></div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-2 mb-1">
            <FireOutlined className="text-orange-400 text-lg sm:text-xl animate-pulse" />
            <span className="uppercase tracking-wide text-xs sm:text-sm text-orange-400 font-semibold">
              Trending
            </span>
          </div>
          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 truncate">
            {product.title}
          </h3>
          <p className="text-blue-300 text-xs sm:text-sm md:text-base font-medium mb-2">
            ₦{(product.price || 0).toLocaleString()}
          </p>
          <Button
            type="primary"
            size="small"
            className="mt-1 sm:mt-2 bg-blue-600 hover:bg-blue-700 border-none rounded-lg px-3 sm:px-4"
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
  };

  return (
    <Layout className="bg-white text-gray-800 min-h-screen">
      {/* ===== Filter + Search ===== */}
      <div className="max-w-7xl mx-auto mt-24 px-6 py-6 bg-gray-50 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <FilterOutlined className="text-blue-600 text-lg" />
          <Select value={filter} onChange={setFilter} className="min-w-[160px]">
            {categories.map((c) => (
              <Option key={c.key} value={c.key}>
                {c.label}
              </Option>
            ))}
          </Select>
        </div>

        <Input
          placeholder="Search gadgets, brands, or accessories..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 rounded-lg"
        />
      </div>

      {/* ===== Category Chips ===== */}
      <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-wrap gap-3 justify-center md:justify-start">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
              filter === c.key
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ===== Trending Section ===== */}
      <section className="max-w-7xl mx-auto px-6 text-center mb-16 relative">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
          <FireOutlined className="text-red-500" /> Trending Now
        </h2>
        <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
          Explore our most popular gadgets and must-have accessories.
        </p>

        {loading ? (
          <Spin size="large" />
        ) : filtered.length === 0 ? (
          <Empty description="No trending products available" />
        ) : (
          <div
            ref={tickerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth touch-pan-x scrollbar-hide"
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {[...filtered.slice(0, 8), ...filtered.slice(0, 8)].map(
              (product, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 min-w-[60%] sm:min-w-[40%] md:min-w-[250px] lg:min-w-[280px]"
                >
                  <TrendingCard product={product} onOpen={setSelected} />
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* ===== All Products ===== */}
      <Content className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent border-b border-gray-100 pb-2">
          All Products
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <Empty description="No products found" className="py-20" />
        ) : (
          <Row gutter={[24, 24]}>
            {filtered.map((p) => (
              <Col xs={24} sm={12} md={8} lg={6} key={p._id || p.ID}>
                <ProductCard product={p} onOpen={setSelected} />
              </Col>
            ))}
          </Row>
        )}
      </Content>

      {/* ===== Back to Top ===== */}
      <FloatButton
        icon={<ArrowUpOutlined />}
        tooltip="Back to top"
        type="primary"
        onClick={scrollToTop}
        style={{ right: 24, bottom: 24, background: "#0ea5e9", border: "none" }}
      />

      {/* ===== Product Modal ===== */}
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAddToCart={handleAddToCart}
          onOrderNow={handleOrderNow}
        />
      )}

      {/* ===== Cart Drawer ===== */}
      <Cart open={showCart} onClose={() => setShowCart(false)} />
    </Layout>
  );
}
