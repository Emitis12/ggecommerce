import React, { useEffect, useState, useRef } from "react";
import { CartProvider, useCartDispatch, useCartState } from "./context/CartContext";
import { fetchProducts } from "./services/api";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import Cart from "./components/Cart";
import VendorDashboard from "./pages/VendorDashboard";
import { Badge, Layout, Button, Spin, Empty, Row, Col, message, Carousel, Input } from "antd";
import { ShoppingCartOutlined, DownOutlined, FireOutlined, MailOutlined } from "@ant-design/icons";
import heroimg from "../src/assets/img1.jpg";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;

function Shop() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
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
        const res = await fetchProducts();
        if (res.success && Array.isArray(res.products)) {
          setProducts(res.products);
          setFeatured(res.products.slice(0, 5)); // first 5 as featured
        } else {
          setProducts([]);
          setError(res.message || "No products found.");
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
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
    message.success(`${product.title} added to cart`);
  };

  const handleOrderNow = (product, qty) => {
    handleAddToCart(product, qty);
    setShowCart(true);
  };

  const scrollToProducts = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Sticky Navbar */}
      <Header
        style={{ backgroundColor: "#ffffff" }}
        className="shadow sticky top-0 z-50 flex justify-between items-center px-8"
      >
        <h1 className="font-bold text-2xl text-blue-600">Gadget Store</h1>
        <div className="flex items-center gap-4">
          <Link to="/vendor-dashboard">
            <Button type="link">Vendor Dashboard</Button>
          </Link>
          <Button type="text" onClick={() => setShowCart(true)}>
            <Badge count={items.reduce((s, i) => s + i.qty, 0)} offset={[0, 5]}>
              <ShoppingCartOutlined style={{ fontSize: 24, color: "#1d4ed8" }} />
            </Badge>
          </Button>
        </div>
      </Header>

      {/* Hero Section */}
      <Content className="relative bg-white text-white">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 p-12 min-h-[80vh] justify-center">
          <div className="flex-1 text-center md:text-left px-6 md:px-12">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Upgrade Your Tech <span className="text-yellow-900">Today!</span>
            </h1>
            <p className="text-lg mb-6 text-gray-500">
              Discover premium gadgets at unbeatable prices — handpicked just for you.
            </p>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              className="bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-all"
              onClick={scrollToProducts}
            >
              Shop Now
            </Button>
          </div>

          <div className="flex-1 px-6 md:px-12">
            <img
              src={heroimg}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Content>

      {/* Featured Carousel */}
      {/* {featured.length > 1 && (
        <div className="bg-blue-100 py-12 shadow-inner">
          <h2 className="text-center text-3xl font-bold mb-8 flex items-center justify-center gap-2 text-gray-800">
            <FireOutlined className="text-red-500" /> Featured Picks
          </h2>
          <div className="max-w-5xl mx-auto">
            <Carousel autoplay dots>
              {featured.map((p) => (
                <div key={p._id || p.ID} className="px-7">
                  <ProductCard product={p} onOpen={setSelected} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      )} */}

      {/* Deals Header */}
      <div ref={productSectionRef} className="max-w-7xl mx-auto px-8 my-10 flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          Deals On <DownOutlined />
        </h2>
      </div>

      {/* Product Section */}
      <Content className="max-w-7xl mx-auto px-8 pb-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="flex justify-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <Empty description="No products available" className="py-20" />
        ) : (
          <Row gutter={[24, 24]}>
            {products.map((p) => (
              <Col xs={24} sm={12} md={8} key={p._id || p.ID}>
                <ProductCard product={p} onOpen={setSelected} />
              </Col>
            ))}
          </Row>
        )}
      </Content>

      {/* Newsletter Signup */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6 text-lg text-gray-100">
            Join our newsletter to get the latest deals and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Input placeholder="Enter your email" prefix={<MailOutlined />} className="rounded-lg" />
            <Button type="primary" size="large" className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer className="bg-blue-100 text-gray-400 py-12 mt-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div>
            <h3 className="text-yellow-900 font-semibold text-lg mb-4">Gadget Store</h3>
            <p>Your one-stop shop for the latest and greatest gadgets.</p>
          </div>
          <div>
            <h3 className="text-yellow-900 font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/vendor-dashboard" className="hover:text-white">Vendor Dashboard</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-yellow-900 font-semibold text-lg mb-4">Follow Us</h3>
            <p>Stay connected on social media for the latest updates.</p>
            <div className="flex gap-4 mt-3">
              <a href="#"><i className="fab fa-facebook text-xl text-white"></i></a>
              <a href="#"><i className="fab fa-twitter text-xl text-white"></i></a>
              <a href="#"><i className="fab fa-instagram text-xl text-white"></i></a>
            </div>
          </div>
        </div>
        <div className="text-center mt-10 text-gray-500">
          © {new Date().getFullYear()} Gadget Store. All rights reserved.
        </div>
      </Footer>

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
