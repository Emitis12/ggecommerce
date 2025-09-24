import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Card,
  Typography,
  Space,
  Avatar,
} from "antd";
import {
  LogoutOutlined,
  PlusOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import {
  fetchProducts,
  addProduct,
  editProduct,
  deleteProduct,
  loginVendor,
  registerVendor,
  logoutVendor,
} from "../services/api";

const { Title, Text } = Typography;

export default function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [vendorInfo, setVendorInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [productForm] = Form.useForm();

  // === Persist vendor session ===
  useEffect(() => {
    const saved = localStorage.getItem("vendorInfo");
    if (saved) setVendorInfo(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (vendorInfo) {
      localStorage.setItem("vendorInfo", JSON.stringify(vendorInfo));
    } else {
      localStorage.removeItem("vendorInfo");
    }
  }, [vendorInfo]);

  // === Load Products ===
  useEffect(() => {
    if (vendorInfo?.email) {
      loadProducts(vendorInfo.email);
    }
  }, [vendorInfo]);

  async function loadProducts(vendorEmail) {
    setLoading(true);
    try {
      const res = await fetchProducts(vendorEmail);
      if (res.success) {
        setProducts(res.products);
      } else {
        message.error(res.message || "Failed to load products");
      }
    } catch (err) {
      message.error("Error loading products: " + err.message);
    }
    setLoading(false);
  }

  // === Auth ===
  async function handleLogin(values) {
    try {
      const res = await loginVendor(values);

      if (res.success && res.vendor) {
        setVendorInfo(res.vendor);
        loginForm.resetFields();
        registerForm.resetFields();
        message.success(res.message || "Login successful");
      } else {
        message.error(res.message || "Invalid login credentials");
      }
    } catch (err) {
      message.error("Login failed: " + err.message);
    }
  }

  async function handleRegister(values) {
    try {
      const res = await registerVendor(values);

      if (res.success) {
        registerForm.resetFields();
        message.success(res.message || "Registered successfully, please log in.");
      } else {
        message.error(res.message || "Registration failed");
      }
    } catch (err) {
      message.error("Registration failed: " + err.message);
    }
  }

  function handleLogout() {
    logoutVendor(); // ✅ clear JWT
    setVendorInfo(null);
    setProducts([]);
    message.info("Logged out");
  }

  // === Products ===
  async function handleProductSubmit(values) {
    try {
      if (editingProduct) {
        await editProduct({ id: editingProduct._id, ...values });
        message.success("Product updated");
      } else {
        await addProduct({
          ...values,
          vendorEmail: vendorInfo.email,
          vendorName: vendorInfo.name,
          vendorPhone: vendorInfo.phone,
          vendorLogo: vendorInfo.logo,
        });
        message.success("Product added");
      }
      productForm.resetFields();
      setModalVisible(false);
      setEditingProduct(null);
      loadProducts(vendorInfo.email);
    } catch (err) {
      message.error("Error saving product: " + err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      message.success("Product deleted");
      loadProducts(vendorInfo.email);
    } catch (err) {
      message.error("Error deleting product: " + err.message);
    }
  }

  const productColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (p) => `₦${p}`,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (img) =>
        img ? (
          <img src={img} alt="product" className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <Text type="secondary">No image</Text>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingProduct(record);
              productForm.setFieldsValue({
                title: record.title,
                price: record.price,
                image: record.image,
              });
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="shadow-xl rounded-2xl border-0">
        {!vendorInfo ? (
          <>
            <Title level={2} className="text-center mb-8">
              Vendor Dashboard
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Login */}
              <Card title="Login" bordered={false} className="rounded-xl shadow-md">
                <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Email is required" }]}
                  >
                    <Input placeholder="Email" autoComplete="username" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: "Password is required" }]}
                  >
                    <Input.Password placeholder="Password" autoComplete="current-password" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block shape="round">
                    Login
                  </Button>
                </Form>
              </Card>

              {/* Register */}
              <Card title="Register" bordered={false} className="rounded-xl shadow-md">
                <Form form={registerForm} layout="vertical" onFinish={handleRegister}>
                  <Form.Item name="name" label="Business Name" rules={[{ required: true }]}>
                    <Input placeholder="Business Name" />
                  </Form.Item>
                  <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input placeholder="Email" autoComplete="username" />
                  </Form.Item>
                  <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password placeholder="Password" autoComplete="new-password" />
                  </Form.Item>
                  <Form.Item name="logo" label="Logo URL">
                    <Input placeholder="Logo URL" />
                  </Form.Item>
                  <Form.Item name="phone" label="Phone">
                    <Input placeholder="Phone Number" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block shape="round">
                    Register
                  </Button>
                </Form>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* Vendor Header */}
            <div className="flex items-center justify-between mb-6">
              <Space>
                <Avatar
                  size={48}
                  src={vendorInfo.logo}
                  icon={<ShopOutlined />}
                  className="bg-blue-100"
                />
                <div>
                  <Title level={4} className="mb-0">
                    {vendorInfo.name}
                  </Title>
                  <Text type="secondary">{vendorInfo.email}</Text>
                </div>
              </Space>
              <Button
                icon={<LogoutOutlined />}
                danger
                shape="round"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>

            {/* Actions */}
            <div className="flex justify-end mb-4">
              <Button
                type="primary"
                shape="round"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingProduct(null);
                  productForm.resetFields();
                  setModalVisible(true);
                }}
              >
                Add Product
              </Button>
            </div>

            {/* Products Table */}
            <Table
              rowKey="_id"
              columns={productColumns}
              dataSource={products}
              loading={loading}
              pagination={{ pageSize: 5 }}
              className="rounded-lg shadow"
            />
          </>
        )}
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => productForm.submit()}
        title={editingProduct ? "Edit Product" : "Add Product"}
        okText={editingProduct ? "Update" : "Create"}
        okButtonProps={{ shape: "round", type: "primary" }}
      >
        <Form form={productForm} layout="vertical" onFinish={handleProductSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="image" label="Image URL">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
