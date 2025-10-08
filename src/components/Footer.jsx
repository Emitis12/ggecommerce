import React from "react";
import { Link } from "react-router-dom";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  GithubOutlined,
} from "@ant-design/icons";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">GadgetGeeky</h2>
          <p className="text-sm leading-relaxed">
            Your one-stop hub for the latest tech gadgets and accessories.  
            Experience modern shopping the smart way.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-blue-400">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-blue-400">
                Checkout
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Partner Access
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/vendor-dashboard" className="hover:text-blue-400">
                Vendor Dashboard
              </Link>
            </li>
            <li>
              <Link to="/super" className="hover:text-blue-400">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-blue-400">
              <FacebookOutlined />
            </a>
            <a href="#" className="hover:text-blue-400">
              <InstagramOutlined />
            </a>
            <a href="#" className="hover:text-blue-400">
              <TwitterOutlined />
            </a>
            <a href="#" className="hover:text-blue-400">
              <GithubOutlined />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 text-center pt-6 text-sm text-gray-400">
        © {new Date().getFullYear()} Gadget Geeky - All Rights Reserved.
      </div>
    </footer>
  );
}
