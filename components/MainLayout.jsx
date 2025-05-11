'use client';

import { ThemeContext } from '@/contexts/ThemeContext';
import styles from '@/styles/MainLayout.module.css';
import { BulbFilled, BulbOutlined, FormOutlined, HeartOutlined, HomeOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Layout, Menu, Switch, Typography } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function MainLayout({ children }) {
  const { theme, toggle } = useContext(ThemeContext);
  const pathname = usePathname();

  // Cải thiện logic để xử lý các path con
  const getSelectedKey = (path) => {
    if (path === '/') return 'home';
    if (path.startsWith('/clubs')) return 'clubs';
    if (path.startsWith('/contests')) return 'contests';
    if (path.startsWith('/personality-test')) return 'personalityTest';
    if (path.startsWith('/volunteer')) return 'volunteer';
    if (path.startsWith('/surveys')) return 'surveys';
    return 'home';
  };

  const selectedKey = getSelectedKey(pathname);

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link href="/">Trang chủ</Link>
    },
    {
      key: 'clubs',
      icon: <TeamOutlined />,
      label: <Link href="/clubs">Câu lạc bộ</Link>
    },
    {
      key: 'contests',
      icon: <TrophyOutlined />,
      label: <Link href="/contests">Cuộc thi</Link>
    },
    {
      key: 'personalityTest',
      icon: <BulbOutlined />,
      label: <Link href="/personality-test">Test Tính Cách</Link>
    },
    {
      key: 'surveys',
      icon: <FormOutlined />,
      label: <Link href="/surveys">Khảo sát của trường</Link>
    },
    {
      key: 'volunteer',
      icon: <HeartOutlined />,
      label: <Link href="/volunteer">Hoạt động tình nguyện</Link>
    }
  ];

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
          selectedKeys={[selectedKey]}
          items={menuItems}
          className={styles.menu}
        />
        <div className={styles.themeSwitch}>
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