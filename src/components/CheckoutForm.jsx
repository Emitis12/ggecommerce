// src/components/CheckoutForm.jsx
import React, { useState } from "react";
import { Form, Input, Button, message, Card, Divider, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { saveOrder } from "../services/api";

const { Title, Text } = Typography;

export default function CheckoutForm({ items, total, loading, setLoading, onSuccess }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Group items by vendorEmail
  const groupItemsByVendor = () => {
    const vendorMap = {};
    items.forEach(item => {
      if (!item.vendorEmail) return;
      if (!vendorMap[item.vendorEmail]) vendorMap[item.vendorEmail] = [];
      vendorMap[item.vendorEmail].push(item);
    });
    return vendorMap;
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: values.email,
        amount: total * 100,
        currency: "NGN",
        ref: new Date().getTime().toString(),
        callback: async (response) => {
          try {
            const vendorItemsMap = groupItemsByVendor();

            // Save the full order for the client
            await saveOrder({
              ...values,
              items,
              total,
              paymentRef: response.reference,
              date: new Date().toISOString(),
              vendorEmails: Object.keys(vendorItemsMap),
            });

            // Save individual orders per vendor
            for (const [vendorEmail, vendorItems] of Object.entries(vendorItemsMap)) {
              await saveOrder({
                ...values,
                items: vendorItems,
                total: vendorItems.reduce((sum, i) => sum + i.price * i.qty, 0),
                paymentRef: response.reference,
                date: new Date().toISOString(),
                vendorEmails: [vendorEmail],
              });
            }

            message.success("Payment successful! Orders sent to vendors.");
            onSuccess(values);
            navigate("/success");
          } catch (err) {
            console.error(err);
            message.error("Failed to save order. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        onClose: () => {
          message.info("Payment cancelled.");
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error(err);
      message.error("Payment initialization failed.");
      setLoading(false);
    }
  };

  return (
    <Card
      className="max-w-lg mx-auto mt-8 p-6 shadow-lg rounded-2xl"
      bordered={false}
      hoverable
    >
      <Title level={3} className="text-center mb-6">Checkout</Title>

      {/* Order Summary */}
      <div className="mb-6">
        <Title level={5}>Order Summary</Title>
        {items.map(item => (
          <div key={item.id} className="flex justify-between py-1 border-b border-gray-200">
            <Text>{item.title} x {item.qty}</Text>
            <Text>₦{(item.price * item.qty).toLocaleString()}</Text>
          </div>
        ))}
        <Divider />
        <div className="flex justify-between mt-2">
          <Text strong>Total</Text>
          <Text strong>₦{total.toLocaleString()}</Text>
        </div>
      </div>

      {/* Checkout Form */}
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter your full name" }]}>
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
          <Input placeholder="example@mail.com" />
        </Form.Item>

        <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Enter your phone number" }]}>
          <Input placeholder="+234 800 000 0000" />
        </Form.Item>

        <Form.Item name="address" label="Address" rules={[{ required: true, message: "Enter your delivery address" }]}>
          <Input.TextArea rows={3} placeholder="123 Street, City, State" />
        </Form.Item>

        <Form.Item name="note" label="Note / Delivery Instructions">
          <Input.TextArea rows={2} placeholder="Optional instructions for delivery" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
          Pay ₦{total.toLocaleString()}
        </Button>
      </Form>
    </Card>
  );
}
