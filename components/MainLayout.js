import { Layout, Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const menuItems = [
    { key: '/', label: 'Trang chủ' },
    { key: '/clubs', label: 'Câu lạc bộ' },
    { key: '/recruitment', label: 'Tuyển thành viên' },
    { key: '/contests', label: 'Cuộc thi' },
    { key: '/volunteer', label: 'Hoạt động tình nguyện' },
    { key: '/student', label: 'Sinh viên' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '20px', marginRight: '24px' }}>
          FTU2 Connect
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentPath]}
          items={menuItems.map(item => ({
            ...item,
            onClick: () => router.push(item.key)
          }))}
          style={{ flex: 1 }}
        />
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div style={{ padding: '24px', minHeight: 'calc(100vh - 64px - 70px)' }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        © 2025 FTU2 Connect
      </Footer>
    </Layout>
  );
};

export default MainLayout; 