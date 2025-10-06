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
import TrendingCard from "../components/TrendingCard";
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

  // ===== Fetch Products from backend =====
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

  // ===== Seamless Trending Ticker =====
  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    let speed = 0.5; // pixels per frame
    let animationFrame;

    const scroll = () => {
      if (!isHovered.current) {
        ticker.scrollLeft += speed;
        if (ticker.scrollLeft >= ticker.scrollWidth / 2) {
          ticker.scrollLeft = 0; // reset to start for seamless loop
        }
      }
      animationFrame = requestAnimationFrame(scroll);
    };
    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [filtered]); // trending now now depends on filtered products

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

  return (
    <Layout className="bg-white text-gray-800 min-h-screen">
      {/* ===== Filter + Search Section ===== */}
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
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2 text-gray-900">
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
            className="flex overflow-hidden gap-6 scroll-smooth cursor-grab"
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {[...filtered.slice(0, 8), ...filtered.slice(0, 8)].map(
              (product, idx) => (
                <div key={idx} className="min-w-[260px]">
                  <TrendingCard product={product} onOpen={setSelected} />
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* ===== Product Grid ===== */}
      <Content className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-2">
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

      {/* ===== Floating Back to Top Button ===== */}
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
