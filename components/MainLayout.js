import { Layout, Menu, Typography } from 'antd';
import { HomeOutlined, TeamOutlined, TrophyOutlined, HeartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from '../styles/MainLayout.module.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function MainLayout({ children }) {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link href="/" passHref>
            <a className={styles.logo}>
              <Title level={3} className={styles.logoText}>FTU2 Connect</Title>
            </a>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          className={styles.menu}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link href="/" passHref>
              <a>Trang chủ</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<TeamOutlined />}>
            <Link href="/clubs" passHref>
              <a>Câu lạc bộ</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<TrophyOutlined />}>
            <Link href="/contests" passHref>
              <a>Cuộc thi</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<HeartOutlined />}>
            <Link href="/volunteer" passHref>
              <a>Hoạt động tình nguyện</a>
            </Link>
          </Menu.Item>
        </Menu>
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