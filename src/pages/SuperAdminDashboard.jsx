import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  message,
  Form,
  Input,
} from "antd";
import {
  fetchAllVendors,
  fetchAllProducts,
  deleteProduct,
  updateVendorStatus,
  loginAdmin,
  logoutAdmin,
} from "../services/adminApi";

const { Title } = Typography;

export default function SuperAdminDashboard() {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  // === Updated loadData() with full error handling ===
  async function loadData() {
    setLoading(true);
    try {
      const [vRes, pRes] = await Promise.all([
        fetchAllVendors(),
        fetchAllProducts(),
      ]);

      console.log("Vendor response:", vRes);
      console.log("Product response:", pRes);

      if (!vRes.success) {
        message.error(vRes.message || "Failed to load vendors");
        return;
      }
      if (!pRes.success) {
        message.error(pRes.message || "Failed to load products");
        return;
      }

      setVendors(vRes.vendors || []);
      setProducts(pRes.products || []);
    } catch (err) {
      console.error("Error loading admin data:", err.response?.data || err);
      message.error(
        "Error loading admin data: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(values) {
    try {
      await loginAdmin(values);
      message.success("Login successful");
      setIsLoggedIn(true);
    } catch (err) {
      message.error("Login failed: " + err.message);
    }
  }

  function handleLogout() {
    logoutAdmin();
    setIsLoggedIn(false);
    setVendors([]);
    setProducts([]);
  }

  const vendorColumns = [
    { title: "Business Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={async () => {
              try {
                await updateVendorStatus(record._id, "approved");
                message.success("Vendor approved");
                loadData();
              } catch (err) {
                message.error("Failed to approve vendor: " + err.message);
              }
            }}
          >
            Approve
          </Button>
          <Button
            danger
            onClick={async () => {
              try {
                await updateVendorStatus(record._id, "suspended");
                message.success("Vendor suspended");
                loadData();
              } catch (err) {
                message.error("Failed to suspend vendor: " + err.message);
              }
            }}
          >
            Suspend
          </Button>
        </Space>
      ),
    },
  ];

  const productColumns = [
    { title: "Title", dataIndex: "title" },
    { title: "Price", dataIndex: "price", render: (p) => `₦${p}` },
    { title: "Vendor", dataIndex: "vendorName" },
    {
      title: "Actions",
      render: (_, record) => (
        <Button danger onClick={() => handleDeleteProduct(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  async function handleDeleteProduct(id) {
    try {
      await deleteProduct(id);
      message.success("Product deleted");
      loadData();
    } catch (err) {
      message.error("Failed to delete product: " + err.message);
    }
  }

  // === Render ===
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card title="Super Admin Login" className="w-96">
          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input placeholder="admin@example.com" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Super Admin Dashboard</Title>
        <Button danger onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Card title="Vendors" className="mb-6">
        <Table
          rowKey="_id"
          columns={vendorColumns}
          dataSource={vendors}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Card title="Products">
        <Table
          rowKey="_id"
          columns={productColumns}
          dataSource={products}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}
