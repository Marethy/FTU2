'use client';

import { ThemeContext } from '@/contexts/ThemeContext';
import styles from '@/styles/MainLayout.module.css';
import {
  BellOutlined,
  FormOutlined,
  HeartOutlined,
  HomeOutlined,
  MenuOutlined,
  MoonOutlined,
  SearchOutlined,
  SunOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Layout, Menu, Space } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

const { Header, Content, Footer } = Layout;

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      label: <Link href="/volunteer">Tình nguyện</Link>,
    },
    {
      key: '/surveys',
      icon: <FormOutlined />,
      label: <Link href="/surveys">Khảo sát</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Trang cá nhân',
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.headerContainer}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/" className={styles.logoLink}>
              <Image
                src="/logo/ftu2-logo.png"
                alt="FTU2 Connect"
                width={40}
                height={40}
                className={styles.logoImage}
              />
              <span className={styles.logoText}>FTU2 Connect</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          {!isMobile && (
            <Menu
              theme={isDark ? 'dark' : 'light'}
              mode="horizontal"
              selectedKeys={[pathname]}
              items={menuItems}
              className={styles.menu}
            />
          )}

          {/* Right Actions */}
          <div className={styles.headerActions}>
            <Space size="middle">
              {/* Search Button */}
              <Button
                type="text"
                icon={<SearchOutlined />}
                className={styles.actionButton}
              />

              {/* Notifications */}
              <Badge count={5} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className={styles.actionButton}
                />
              </Badge>

              {/* Theme Toggle */}
              <Button
                type="text"
                icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                className={styles.actionButton}
              />

              {/* User Menu */}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Avatar
                  size="default"
                  icon={<UserOutlined />}
                  className={styles.userAvatar}
                  style={{ cursor: 'pointer' }}
                />
              </Dropdown>

              {/* Mobile Menu */}
              {isMobile && (
                <Dropdown
                  menu={{ items: menuItems }}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <Button
                    type="text"
                    icon={<MenuOutlined />}
                    className={styles.mobileMenuButton}
                  />
                </Dropdown>
              )}
            </Space>
          </div>
        </div>
      </Header>

      <Content className={styles.content}>
        <div className={styles.contentContainer}>
          {children}
        </div>
      </Content>

      <Footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h4>FTU2 Connect</h4>
              <p>Nền tảng kết nối sinh viên Đại học Ngoại thương cơ sở 2</p>
              <div className={styles.socialLinks}>
                <a href="#" aria-label="Facebook">
                  <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} />
                </a>
                <a href="#" aria-label="Instagram">
                  <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} />
                </a>
                <a href="#" aria-label="YouTube">
                  <Image src="/icons/youtube.svg" alt="YouTube" width={24} height={24} />
                </a>
              </div>
            </div>

            <div className={styles.footerSection}>
              <h4>Khám phá</h4>
              <ul>
                <li><Link href="/clubs">Câu lạc bộ</Link></li>
                <li><Link href="/contests">Cuộc thi</Link></li>
                <li><Link href="/volunteer">Tình nguyện</Link></li>
                <li><Link href="/surveys">Khảo sát</Link></li>
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h4>Hỗ trợ</h4>
              <ul>
                <li><Link href="/about">Về chúng tôi</Link></li>
                <li><Link href="/contact">Liên hệ</Link></li>
                <li><Link href="/faq">Câu hỏi thường gặp</Link></li>
                <li><Link href="/terms">Điều khoản sử dụng</Link></li>
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h4>Liên hệ</h4>
              <ul>
                <li>📍 Đại học Ngoại thương cơ sở 2</li>
                <li>📧 contact@ftu2connect.edu.vn</li>
                <li>📞 (024) 1234 5678</li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} FTU2 Connect. All rights reserved.</p>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}