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
} from "antd";
import { LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import {
  fetchProducts,
  addProduct,
  editProduct,
  deleteProduct,
  loginVendor,
  registerVendor,
} from "../services/api";

const { Title } = Typography;

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
      console.log("Login response:", res);
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
      console.log("Register response:", res);
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
    setVendorInfo(null);
    setProducts([]);
    message.info("Logged out");
  }

  // === Products ===
  async function handleProductSubmit(values) {
    try {
      if (editingProduct) {
        await editProduct({ id: editingProduct.ID, ...values });
        message.success("Product updated");
      } else {
        await addProduct({
          title: values.title,
          price: values.price,
          image: values.image,
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
    { title: "Title", dataIndex: "Title", key: "Title" },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      render: (p) => `₦${p}`,
    },
    {
      title: "Image",
      dataIndex: "Image",
      key: "Image",
      render: (img) =>
        img ? (
          <img src={img} alt="product" className="w-16 h-16 rounded" />
        ) : (
          "No image"
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
                title: record.Title,
                price: record.Price,
                image: record.Image,
              });
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record.ID)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-lg rounded-2xl">
        <Title level={2} className="text-center mb-6">
          {vendorInfo ? `Welcome, ${vendorInfo.name}` : "Vendor Dashboard"}
        </Title>

        {!vendorInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Login */}
            <Card title="Login" bordered={false}>
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
                <Button type="primary" htmlType="submit" block>
                  Login
                </Button>
              </Form>
            </Card>

            {/* Register */}
            <Card title="Register" bordered={false}>
              <Form form={registerForm} layout="vertical" onFinish={handleRegister}>
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                  <Input placeholder="Business Name" />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                  <Input placeholder="Email" autoComplete="username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password placeholder="Password" autoComplete="new-password" />
                </Form.Item>
                <Form.Item name="logo" label="Logo URL">
                  <Input placeholder="Logo URL" />
                </Form.Item>
                <Form.Item name="phone" label="Phone">
                  <Input placeholder="Phone Number" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Register
                </Button>
              </Form>
            </Card>
          </div>
        ) : (
          <>
            {/* Top bar */}
            <div className="flex justify-between items-center mb-4">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingProduct(null);
                  productForm.resetFields();
                  setModalVisible(true);
                }}
              >
                Add Product
              </Button>
              <Button icon={<LogoutOutlined />} danger onClick={handleLogout}>
                Logout
              </Button>
            </div>

            {/* Products Table */}
            <Table
              rowKey="ID"
              columns={productColumns}
              dataSource={products}
              loading={loading}
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
