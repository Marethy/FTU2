'use client';

import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Layout, Menu, Typography, Switch } from 'antd';
import { HomeOutlined, TeamOutlined, TrophyOutlined, HeartOutlined, FormOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/MainLayout.module.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function MainLayout({ children }) {
  const { theme, toggle } = useContext(ThemeContext);
  const pathname = usePathname();

  const getSelectedKey = () => {
    if (pathname?.startsWith('/clubs')) return '2';
    if (pathname?.startsWith('/contests')) return '3';
    if (pathname?.startsWith('/volunteer')) return '4';
    if (pathname?.startsWith('/surveys')) return '5';
    return '1'; // Default to home
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            <Title level={3} className={styles.logoText}>FTU2 Connect</Title>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          className={styles.menu}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link href="/">Trang chủ</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<TeamOutlined />}>
            <Link href="/clubs">Câu lạc bộ</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<TrophyOutlined />}>
            <Link href="/contests">Cuộc thi</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<HeartOutlined />}>
            <Link href="/volunteer">Hoạt động tình nguyện</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<FormOutlined />}>
            <Link href="/surveys">Khảo sát của trường</Link>
          </Menu.Item>
        </Menu>
        <div className={styles.themeToggle}>
          <Switch
            checked={theme === 'dark'}
            onChange={toggle}
            checkedChildren={<BulbFilled />}
            unCheckedChildren={<BulbOutlined />}
          />
        </div>
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