import React from "react";
import { Form, Input, Button, message, Card, Divider, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../services/api";

const { Title, Text } = Typography;

export default function CheckoutForm({ items, total, loading, setLoading, onSuccess }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await placeOrder({
        ...values,
        items,
        total,
        paymentRef: `ref_${Date.now()}`,
      });
      message.success("Order placed successfully!");
      onSuccess();
      navigate("/success");
    } catch (err) {
      console.error(err);
      message.error("Order failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8 p-6 shadow-xl rounded-2xl border">
      <Title level={3} className="text-center mb-6 text-blue-600">
        Checkout
      </Title>

      {/* Order Summary */}
      <div className="mb-6">
        <Title level={5}>Order Summary</Title>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between py-2 border-b border-gray-200"
          >
            <Text>{item.title} × {item.qty}</Text>
            <Text>₦{(item.price * item.qty).toLocaleString()}</Text>
          </div>
        ))}
        <Divider />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
        >
          <Input placeholder="example@mail.com" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: "Enter your phone number" }]}
        >
          <Input placeholder="+234 800 000 0000" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Enter your delivery address" }]}
        >
          <Input.TextArea rows={3} placeholder="123 Street, City, State" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          className="rounded-lg"
          loading={loading}
        >
          Pay ₦{total.toLocaleString()}
        </Button>
      </Form>
    </Card>
  );
}
