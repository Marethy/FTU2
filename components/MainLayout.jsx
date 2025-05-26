'use client';

import { ThemeContext } from '@/contexts/ThemeContext';
import styles from '@/styles/MainLayout.module.css';
import { BulbFilled, BulbOutlined, FormOutlined, HeartOutlined, HomeOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Layout, Menu, Switch } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';

const { Header, Content, Footer } = Layout;

export default function MainLayout({ children }) {
  const { theme, toggle } = useContext(ThemeContext);
  const pathname = usePathname();

  // Effect để cập nhật class và data-theme cho HTML element
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      body.setAttribute('data-theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
      body.setAttribute('data-theme', 'light');
    }
  }, [theme]);
  // Cải thiện logic để xử lý các path con
  const getSelectedKey = (path) => {
    if (path === '/') return 'home';
    if (path.startsWith('/clubs')) return 'clubs';
    if (path.startsWith('/contests')) return 'contests';
    if (path.startsWith('/personality-test')) return 'personalityTest';
    if (path.startsWith('/volunteer')) return 'volunteer';
    if (path.startsWith('/surveys')) return 'surveys';
    if (path.startsWith('/recruitment')) return 'recruitment';
    if (path.startsWith('/student')) return 'student';
    return 'home';
  };

  const selectedKey = getSelectedKey(pathname);
  const menuItems = [    {
      key: 'logo',
      label: (
        <Link href="/" className={styles.logoLink}>
          <img 
            src="/favicon.png" 
            alt="activeU Logo" 
            className={styles.logoIcon} 
          />
          <span className={styles.logoText}>activeU</span>
        </Link>
      ),
      style: { marginRight: '10px' }
    },
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link href="/">Trang chủ</Link>
    },    {
      key: 'clubs',
      icon: <TeamOutlined />,
      label: <Link href="/clubs">CLB, Đội, Nhóm</Link>
    },
    {
      key: 'recruitment',
      icon: <TeamOutlined />,
      label: <Link href="/recruitment">Tuyển thành viên</Link>
    },
    {
      key: 'contests',
      icon: <TrophyOutlined />,
      label: <Link href="/contests">Cuộc thi</Link>
    },
    {
      key: 'volunteer',
      icon: <HeartOutlined />,
      label: <Link href="/volunteer">Hoạt động tình nguyện</Link>
    },
    {
      key: 'personalityTest',
      icon: <BulbOutlined />,
      label: <Link href="/personality-test">Quiz định hướng</Link>    },    {
      key: 'surveys',
      icon: <FormOutlined />,
      label: <Link href="/surveys">Khảo sát chéo</Link>
    },
    {
      key: 'student',
      icon: <TeamOutlined />,
      label: <Link href="#" onClick={(e) => {
        e.preventDefault();
        alert('Bạn cần đăng nhập để thực hiện chức năng này');
      }}>Sinh viên</Link>
    }
  ];

  return (
    <Layout className={`${styles.layout} ${theme === 'dark' ? styles.dark : ''}`}>
      <Header className={styles.header}>
        <div className={styles.navContainer}>          <Menu
            theme={theme === 'dark' ? 'dark' : 'light'}
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={menuItems}
            className={styles.menu}
            overflowedIndicator={<span style={{ fontSize: '20px' }}>···</span>}
            popupClassName={styles.menuPopup}
          />
        </div>
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
        activeU ©{new Date().getFullYear()} - Kết nối sinh viên FTU2
      </Footer>
    </Layout>
  );
}