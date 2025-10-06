import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge, Button, Drawer } from "antd";
import {
  MenuOutlined,
  CloseOutlined,
  ShoppingFilled,
} from "@ant-design/icons";
import { useCartState } from "../context/CartContext";
import Cart from "./Cart";

export default function Navbar() {
  const { items } = useCartState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const location = useLocation();

  // Track scroll progress for fade-in/out effect
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const opacity = Math.min(y / 200, 1); // fade in over 200px
      setScrollOpacity(opacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  // Dynamic background fade effect
  const bgStyle = isHome
    ? {
        background: `rgba(255, 255, 255, ${scrollOpacity * 0.9})`,
        boxShadow: scrollOpacity > 0.1 ? "0 2px 20px rgba(0,0,0,0.05)" : "none",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: scrollOpacity > 0.1 ? "1px solid rgba(255,255,255,0.2)" : "none",
        transition: "all 0.4s ease",
      }
    : {
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
        backdropFilter: "blur(12px)",
      };

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out text-gray-900"
        style={bgStyle}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Brand */}
          <Link
            to="/"
            className="text-2xl font-extrabold transition-colors select-none"
          >
            <span className="text-red-600">Geeky</span>{" "}
            <span className="text-blue-800">Gadget</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["Home", "Shop", "Checkout"].map((label, idx) => (
              <Link
                key={idx}
                to={label === "Home" ? "/" : `/${label.toLowerCase()}`}
                className="relative group transition-all duration-300"
              >
                <span className="hover:text-blue-600 transition-colors duration-300">
                  {label}
                </span>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* Modern Cart Icon */}
            <Button
              type="text"
              onClick={() => setShowCart(true)}
              className="relative text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg"
            >
              <Badge
                count={items.reduce((sum, i) => sum + i.qty, 0)}
                offset={[0, 8]}
              >
                <ShoppingFilled style={{ fontSize: 24 }} />
              </Badge>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-2xl text-gray-800"
          >
            <MenuOutlined />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        placement="right"
        closable={false}
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        bodyStyle={{
          backgroundColor: "#ffffff",
          color: "#333",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-blue-600">Menu</h3>
          <CloseOutlined
            onClick={() => setMenuOpen(false)}
            className="text-xl text-gray-600 cursor-pointer"
          />
        </div>

        <ul className="space-y-4 text-base">
          {["Home", "Shop", "Checkout"].map((label, idx) => (
            <li key={idx}>
              <Link
                to={label === "Home" ? "/" : `/${label.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-600 transition-colors duration-300"
              >
                {label}
              </Link>
            </li>
          ))}

          <li>
            <Button
              type="text"
              onClick={() => {
                setShowCart(true);
                setMenuOpen(false);
              }}
              className="text-gray-800 hover:text-blue-600 hover:scale-105 transition-transform duration-300"
            >
              <Badge
                count={items.reduce((sum, i) => sum + i.qty, 0)}
                offset={[0, 8]}
              >
                <ShoppingFilled style={{ fontSize: 24 }} />
              </Badge>{" "}
              Cart
            </Button>
          </li>
        </ul>
      </Drawer>

      {/* Cart Drawer */}
      <Cart open={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
