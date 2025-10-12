"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.error || "Có lỗi xảy ra!");
        return;
      }

      message.success("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      message.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FFF5F8 0%, #F0F9FF 50%, #FFF0F5 100%)",
        padding: "24px",
      }}
    >
      <Card
        style={{
          maxWidth: "450px",
          width: "100%",
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(255, 182, 193, 0.2)",
          border: "2px solid rgba(255, 182, 193, 0.2)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>✨</div>
          <Title
            level={2}
            style={{
              color: "#D04770",
              marginBottom: "8px",
              fontSize: "28px",
            }}
          >
            Đăng Ký
          </Title>
          <Text style={{ color: "#7B68A6", fontSize: "15px" }}>
            Tạo tài khoản mới để bắt đầu sử dụng hệ thống
          </Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            label="👤 Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nguyễn Văn A"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="📧 Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="your.email@example.com"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="🔒 Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="🔐 Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập lại mật khẩu"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: "24px", marginBottom: "16px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: "48px",
                fontSize: "16px",
                fontWeight: "600",
                background: "linear-gradient(135deg, #96E6B3 0%, #D4FCE7 100%)",
                border: "none",
                borderRadius: "12px",
                color: "#2F8F5F",
                boxShadow: "0 4px 15px rgba(150, 230, 179, 0.4)",
              }}
            >
              ✨ Tạo Tài Khoản
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Text style={{ color: "#7B68A6" }}>
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                style={{
                  color: "#D04770",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Đăng nhập ngay
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}

