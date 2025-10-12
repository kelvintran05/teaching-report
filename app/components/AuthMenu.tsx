"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button, Dropdown, Space, Avatar } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

export default function AuthMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div style={{ width: "100px", height: "32px" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            borderRadius: "8px",
          }}
        />
      </div>
    );
  }

  if (session?.user) {
    const items: MenuProps["items"] = [
      {
        key: "user-info",
        label: (
          <div style={{ padding: "8px 4px" }}>
            <div style={{ fontWeight: 600, color: "#D04770" }}>
              {session.user.name}
            </div>
            <div style={{ fontSize: "12px", color: "#7B68A6" }}>
              {session.user.email}
            </div>
          </div>
        ),
        disabled: true,
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
        danger: true,
        onClick: () => {
          signOut({ callbackUrl: "/" });
        },
      },
    ];

    return (
      <Dropdown menu={{ items }} placement="bottomRight" arrow>
        <Space
          style={{
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: "12px",
            border: "2px solid rgba(255, 182, 193, 0.3)",
            background: "linear-gradient(135deg, #FFF5F8 0%, #FFE4E9 100%)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(255, 182, 193, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Avatar
            style={{
              background: "linear-gradient(135deg, #D04770 0%, #FFB6C1 100%)",
            }}
            icon={<UserOutlined />}
          />
          <span
            style={{
              color: "#D04770",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {session.user.name}
          </span>
        </Space>
      </Dropdown>
    );
  }

  return (
    <Space size="middle">
      <Link href="/login">
        <Button
          icon={<LoginOutlined />}
          style={{
            borderRadius: "12px",
            border: "2px solid #FFB6C1",
            color: "#D04770",
            fontWeight: 600,
            height: "40px",
            padding: "0 20px",
            background: "transparent",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FFF5F8";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(255, 182, 193, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Đăng nhập
        </Button>
      </Link>
      <Link href="/register">
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          style={{
            borderRadius: "12px",
            border: "none",
            fontWeight: 600,
            height: "40px",
            padding: "0 20px",
            background: "linear-gradient(135deg, #FFB6C1 0%, #FFE4E9 100%)",
            color: "#D04770",
            boxShadow: "0 2px 8px rgba(255, 182, 193, 0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 4px 15px rgba(255, 182, 193, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 2px 8px rgba(255, 182, 193, 0.3)";
          }}
        >
          Đăng ký
        </Button>
      </Link>
    </Space>
  );
}
