// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Input, Row, Col, Button } from "antd";
import {
  LaptopOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
  MailOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { CartProvider } from "./context/CartContext";
import VendorDashboard from "./pages/VendorDashboard";
import Checkout from "./pages/Checkout";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Shop from "./pages/Shop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import heroimg from "./assets/img1.png";

const { Content } = Layout;

export default function App() {
  return (
    <Router>
      <CartProvider>
        <Layout className="min-h-screen bg-[#f9fafb] text-[#1e293b] relative">
          <Navbar />

          <Content className="pt-16">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/vendor-dashboard" element={<VendorDashboard />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/super" element={<SuperAdminDashboard />} />
            </Routes>
          </Content>

          <Footer />
        </Layout>
      </CartProvider>
    </Router>
  );
}

// ===================== Landing Page =====================
function LandingPage() {
  return (
    <div className="bg-gradient-to-r from-[#f9fafb] to-[#e0f2fe]">
      {/* ===== Hero Section ===== */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 py-20 max-w-7xl mx-auto">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-[#1e293b]">
            Elevate Your <span className="text-[#0ea5e9]">Tech</span> Lifestyle ⚡
          </h1>
          <p className="text-lg text-[#64748b] max-w-lg mx-auto md:mx-0">
            Explore cutting-edge gadgets, smart accessories, and innovation — all in one sleek marketplace.
          </p>
          <Link to="/shop">
            <Button
              type="primary"
              size="large"
              className="bg-blue-600 hover:bg-blue-500 border-none text-white font-semibold rounded-lg"
              icon={<ShoppingCartOutlined />}
            >
              Shop Now
            </Button>
          </Link>
        </div>

        <div className="flex-1 mt-10 md:mt-0">
          <img
            src={heroimg}
            alt="Gadgets"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-10 text-[#1e293b]">
            Why Choose <span className="text-[#0ea5e9]">GadgetHub</span>?
          </h2>
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={6}>
              <FeatureCard
                icon={<LaptopOutlined className="text-[#0ea5e9] text-4xl mb-4" />}
                title="Latest Tech"
                desc="Stay ahead with innovative gadgets and smart devices from trusted brands."
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <FeatureCard
                icon={<SafetyOutlined className="text-[#14b8a6] text-4xl mb-4" />}
                title="Secure Checkout"
                desc="Your payments are encrypted and handled with care using Paystack technology."
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <FeatureCard
                icon={<CustomerServiceOutlined className="text-[#f59e0b] text-4xl mb-4" />}
                title="24/7 Support"
                desc="Our team is always available to ensure you have the best shopping experience."
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <FeatureCard
                icon={<ThunderboltOutlined className="text-[#e11d48] text-4xl mb-4" />}
                title="Fast Delivery"
                desc="Enjoy quick and reliable doorstep delivery across Nigeria."
              />
            </Col>
          </Row>
        </div>
      </section>

      {/* ===== Newsletter ===== */}
      <section className="bg-gradient-to-r from-[#0ea5e9] to-[#14b8a6] text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="mb-6 text-lg text-blue-100">
            Get exclusive offers, product drops, and tech updates straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Input
              placeholder="Enter your email"
              prefix={<MailOutlined />}
              className="rounded-lg py-2"
            />
            <Button
              type="primary"
              size="large"
              className="bg-white text-[#0ea5e9] hover:bg-gray-100 font-semibold rounded-lg px-6"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ===== Reusable Feature Card =====
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#0ea5e9]/30">
      <div className="flex flex-col items-center text-center">
        {icon}
        <h3 className="text-xl font-semibold mb-2 text-[#1e293b]">{title}</h3>
        <p className="text-[#64748b]">{desc}</p>
      </div>
    </div>
  );
}
