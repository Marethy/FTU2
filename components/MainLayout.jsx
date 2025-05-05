'use client';

import { Layout, Menu, Button } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { 
  HomeOutlined, 
  TeamOutlined, 
  TrophyOutlined, 
  HeartOutlined,
  FormOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import styles from '@/styles/MainLayout.module.css';

const { Header, Content, Footer } = Layout;

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">Trang chủ</Link>,
    },
    {
      key: '/clubs',
      icon: <TeamOutlined />,
      label: <Link href="/clubs">Câu lạc bộ</Link>,
    },
    {
      key: '/contests',
      icon: <TrophyOutlined />,
      label: <Link href="/contests">Cuộc thi</Link>,
    },
    {
      key: '/volunteer',
      icon: <HeartOutlined />,
      label: <Link href="/volunteer">Hoạt động tình nguyện</Link>,
    },
    {
      key: '/surveys',
      icon: <FormOutlined />,
      label: <Link href="/surveys">Khảo sát của trường</Link>,
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">FTU2 Connect</Link>
        </div>
        <Menu
          theme={isDark ? 'dark' : 'light'}
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menuItems}
          className={styles.menu}
        />
        <Button
          type="text"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          className={styles.themeToggle}
        />
      </Header>

      <Content className={styles.content}>
        {children}
      </Content>

      <Footer className={styles.footer}>
        FTU2 Connect ©{new Date().getFullYear()} - Kết nối sinh viên FTU2
      </Footer>
    </Layout>
  );
} 