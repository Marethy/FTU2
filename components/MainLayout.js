import { Layout, Menu, Breadcrumb } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const menuItems = [
    { key: '/', label: 'Trang chủ', path: 'Home' },
    { key: '/clubs', label: 'Câu lạc bộ', path: 'Clubs' },
    { key: '/recruitment', label: 'Tuyển thành viên', path: 'Recruitment' },
    { key: '/contests', label: 'Cuộc thi', path: 'Contests' },
    { key: '/volunteer', label: 'Hoạt động tình nguyện', path: 'Volunteer' },
    { key: '/student', label: 'Sinh viên', path: 'Student' },
  ];

  // Get current page name for breadcrumb
  const currentPage = menuItems.find(item => item.key === currentPath)?.path || '';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          position: 'fixed', 
          zIndex: 1, 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center',
          height: 64,
          padding: '0 50px',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <div 
          style={{ 
            color: '#0057a3', 
            fontSize: '20px', 
            fontWeight: 'bold',
            marginRight: '24px' 
          }}
        >
          FTU2 Connect
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[currentPath]}
          items={menuItems.map(item => ({
            ...item,
            onClick: () => router.push(item.key),
            style: {
              height: '64px',
              lineHeight: '64px',
              transition: 'all 0.3s'
            },
            className: 'menu-item-hover'
          }))}
          style={{ 
            flex: 1,
            border: 'none',
            background: 'transparent'
          }}
        />
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64, maxWidth: 1280, margin: '64px auto 0' }}>
        <Breadcrumb 
          style={{ margin: '16px 0' }}
          items={[
            { title: 'Home' },
            ...(currentPage ? [{ title: currentPage }] : [])
          ]}
        />
        <div style={{ 
          padding: '24px',
          minHeight: 'calc(100vh - 64px - 70px)',
          background: '#fff',
          borderRadius: '6px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          {children}
        </div>
      </Content>
      <Footer style={{ 
        textAlign: 'center',
        background: '#f5f5f5',
        padding: '24px 50px'
      }}>
        © 2025 FTU2 Connect
      </Footer>
    </Layout>
  );
};

export default MainLayout; 