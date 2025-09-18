import React, { useEffect, useState, useRef } from "react";
import { CartProvider, useCartDispatch, useCartState } from "./context/CartContext";
import { fetchProducts } from "./services/api";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import Cart from "./components/Cart";
import VendorDashboard from "./pages/VendorDashboard";
import { Badge, Layout, Button, Spin, Empty, Row, Col, message } from "antd";
import { ShoppingCartOutlined, DownOutlined } from "@ant-design/icons";
import heroimg from "../src/assets/img1.jpg";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const { Header, Content } = Layout;

function Shop() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useCartDispatch();
  const { items } = useCartState();
  const productSectionRef = useRef(null);

  // Fetch products
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again.");
        message.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleAddToCart = (product, qty) => {
    dispatch({ type: "ADD_ITEM", payload: { product, qty } });
    setSelected(null);
  };

  const handleOrderNow = (product, qty) => {
    dispatch({ type: "ADD_ITEM", payload: { product, qty } });
    setSelected(null);
    setShowCart(true);
  };

  const scrollToProducts = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header style={{ backgroundColor: "#ffffff" }} className="shadow flex justify-between items-center px-8">
        <h1 className="font-bold text-xl">Gadget Store</h1>
        <div className="flex items-center gap-4">
          <Link to="/vendor-dashboard">
            <Button type="link">Vendor Dashboard</Button>
          </Link>
          <Button type="text" onClick={() => setShowCart(true)}>
            <Badge count={items.reduce((s, i) => s + i.qty, 0)}>
              <ShoppingCartOutlined style={{ fontSize: 22 }} />
            </Badge>
          </Button>
        </div>
      </Header>

      {/* Hero Section */}
      <Content className="relative">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 p-8 min-h-screen justify-center relative bg-white">
          {/* Text */}
          <div className="flex-1 text-center md:text-left px-6 md:px-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Upgrade Your Tech Today!
            </h1>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              className="transition-transform transform hover:scale-105 hover:shadow-lg"
              onClick={scrollToProducts}
            >
              Shop Now
            </Button>
          </div>

          {/* Image */}
          <div className="flex-1 px-6 md:px-12">
            <img src={heroimg} alt="Hero" className="w-full h-full object-cover rounded" />
          </div>

          {/* Floating Down Arrow */}
          <div
            onClick={scrollToProducts}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce text-gray-700"
          >
            <DownOutlined style={{ fontSize: 32 }} />
          </div>
        </div>
      </Content>

      {/* Deals Header */}
      <div
        ref={productSectionRef}
        className="max-w-7xl mx-auto px-8 my-6 flex items-center justify-between"
      >
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          Deals On <DownOutlined />
        </h2>
      </div>

      {/* Product Section */}
      <Content className="max-w-7xl mx-auto px-8 p-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" tip="Loading products..." />
          </div>
        ) : error ? (
          <div className="flex justify-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <Empty description="No products available" className="py-20" />
        ) : (
          <Row gutter={[16, 16]}>
            {products.map((p) => (
              <Col xs={24} sm={12} md={8} lg={6} key={p.ID}>
                <ProductCard product={p} onOpen={setSelected} />
              </Col>
            ))}
          </Row>
        )}
      </Content>

      {/* Product Modal */}
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAddToCart={handleAddToCart}
          onOrderNow={handleOrderNow}
        />
      )}

      {/* Cart Drawer */}
      <Cart open={showCart} onClose={() => setShowCart(false)} />
    </Layout>
  );
}

// Wrap Shop with Router and CartProvider
export default function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}
