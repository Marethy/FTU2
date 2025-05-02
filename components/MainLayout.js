"use client";

import { Layout, Menu, Typography } from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  TrophyOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import styles from "@/styles/MainLayout.module.css";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function MainLayout({ children }) {
  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link href="/">Trang chủ</Link>,
    },
    {
      key: "2",
      icon: <TeamOutlined />,
      label: <Link href="/clubs">Câu lạc bộ</Link>,
    },
    {
      key: "3",
      icon: <TrophyOutlined />,
      label: <Link href="/contests">Cuộc thi</Link>,
    },
    {
      key: "4",
      icon: <HeartOutlined />,
      label: <Link href="/volunteer">Hoạt động tình nguyện</Link>,
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            <Title level={3} className={styles.logoText}>
              FTU2 Connect
            </Title>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          className={styles.menu}
          items={menuItems}
        />
      </Header>
      <Content className={styles.content}>{children}</Content>
      <Footer className={styles.footer}>
        FTU2 Connect ©{new Date().getFullYear()} - Kết nối sinh viên FTU2
      </Footer>
    </Layout>
  );
}
