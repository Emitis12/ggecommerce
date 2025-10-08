import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge, Button, Drawer } from "antd";
import {
  MenuOutlined,
  CloseOutlined,
  ShoppingFilled,
  ShoppingCartOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useCartState } from "../context/CartContext";
import Cart from "./Cart";

export default function Navbar() {
  const { items } = useCartState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const opacity = Math.min(y / 200, 1);
      setScrollOpacity(opacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  const bgStyle = isHome
    ? {
        background: `rgba(255, 255, 255, ${scrollOpacity * 0.9})`,
        boxShadow: scrollOpacity > 0.1 ? "0 2px 20px rgba(0,0,0,0.05)" : "none",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom:
          scrollOpacity > 0.1 ? "1px solid rgba(255,255,255,0.2)" : "none",
        transition: "all 0.4s ease",
      }
    : {
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
        backdropFilter: "blur(12px)",
      };

  const links = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
  ];

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
            <span className="text-red-600">Gadget</span> {" "}
            <span className="text-blue-800">Geeky</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {links.map((link, idx) => {
              const isActive = location.pathname === link.path;

              // Premium Shop button
              if (link.label === "Shop") {
                return (
                  <Link
                    key={idx}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-lg transform transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 animate-bounce`}
                  >
                    {isActive ? (
                      <DownOutlined className="text-white" />
                    ) : (
                      <ShoppingCartOutlined className="text-white" />
                    )}
                    <span className="text-white">{link.label}</span>
                  </Link>
                );
              }

              // Regular nav link
              return (
                <Link
                  key={idx}
                  to={link.path}
                  className={`relative transition-all duration-300 ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-800 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-4 bg-blue-600 transition-all duration-300 ${
                      isActive ? "w-4" : "group-hover:w-4"
                    }`}
                  ></span>
                </Link>
              );
            })}

            {/* Cart Button (Hide on Landing Page) */}
            {!isHome && (
              <Button
                type="text"
                onClick={() => setShowCart(true)}
                className="relative text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-105 hover:drop-shadow-lg"
              >
                <Badge
                  count={items.reduce((sum, i) => sum + i.qty, 0)}
                  offset={[0, 8]}
                  style={{ backgroundColor: "#f43f5e" }}
                >
                  <ShoppingFilled style={{ fontSize: 24 }} />
                </Badge>
              </Button>
            )}
          </nav>

          {/* Mobile: Hamburger + Cart (Hide on Landing Page) */}
          {!isHome && (
            <div className="md:hidden flex items-center gap-4">
              {/* Cart Button */}
              <Button
                type="text"
                onClick={() => setShowCart(true)}
                className="relative text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-105 hover:drop-shadow-lg"
              >
                <Badge
                  count={items.reduce((sum, i) => sum + i.qty, 0)}
                  offset={[0, 8]}
                  style={{ backgroundColor: "#f43f5e" }}
                >
                  <ShoppingFilled style={{ fontSize: 24 }} />
                </Badge>
              </Button>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(true)}
                className="text-2xl text-gray-800"
              >
                <MenuOutlined />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <Drawer
        placement="right"
        closable={false}
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        width="50%"
        bodyStyle={{
          backgroundColor: "#f9fafb",
          padding: "2rem",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-blue-600">Menu</h3>
          <CloseOutlined
            onClick={() => setMenuOpen(false)}
            className="text-xl text-gray-600 cursor-pointer"
          />
        </div>

        <ul className="space-y-6 text-lg font-medium">
          {links.map((link, idx) => {
            const isActive = location.pathname === link.path;

            if (link.label === "Shop") {
              return (
                <li key={idx}>
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-lg transform transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 animate-bounce`}
                  >
                    {isActive ? (
                      <DownOutlined className="text-white" />
                    ) : (
                      <ShoppingCartOutlined className="text-white" />
                    )}
                    <span className="text-white">{link.label}</span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={idx}>
                <Link
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block relative ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-800 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-4 bg-blue-600 transition-all duration-300 ${
                      isActive ? "w-4" : "hover:w-4"
                    }`}
                  ></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Drawer>

      {/* Cart Drawer */}
      <Cart open={showCart} onClose={() => setShowCart(false)} width="50%" />
    </>
  );
}
