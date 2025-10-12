"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, message, Space } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        message.error("Email hoặc mật khẩu không đúng!");
      } else {
        message.success("Đăng nhập thành công!");
        router.push("/builder");
      }
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
        background:
          "linear-gradient(135deg, #FFF5F8 0%, #F0F9FF 50%, #FFF0F5 100%)",
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
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎓</div>
          <Title
            level={2}
            style={{
              color: "#D04770",
              marginBottom: "8px",
              fontSize: "28px",
            }}
          >
            Đăng Nhập
          </Title>
          <Text style={{ color: "#7B68A6", fontSize: "15px" }}>
            Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục
          </Text>
        </div>

        <Form name="login" onFinish={onFinish} layout="vertical" size="large">
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
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
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
                background: "linear-gradient(135deg, #FFB6C1 0%, #FFE4E9 100%)",
                border: "none",
                borderRadius: "12px",
                color: "#C7385F",
                boxShadow: "0 4px 15px rgba(255, 182, 193, 0.4)",
              }}
            >
              🚀 Đăng Nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Text style={{ color: "#7B68A6" }}>
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                style={{
                  color: "#D04770",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Đăng ký ngay
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
