import { ConfigProvider } from 'antd';
import '../styles/global.css';
import MainLayout from '../components/MainLayout';
import ScrollToTop from '../components/ScrollToTop';

function MyApp({ Component, pageProps }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Colors
          colorPrimary: '#0057a3',  // UFM blue
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f5f5f5',
          colorBorderSecondary: '#e8e8e8',
          
          // Typography
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: 14,
          fontSizeHeading1: 24,
          fontSizeHeading2: 20,
          fontSizeHeading3: 16,
          
          // Spacing
          padding: 16,
          paddingLG: 24,
          marginLG: 24,
          borderRadius: 6,
          
          // Component specific
          headerHeight: 64,
          tableHeaderBg: '#fafafa',
          tableRowHoverBg: '#f5f5f5',
        },
      }}
    >
      <MainLayout>
        <ScrollToTop />
        <Component {...pageProps} />
      </MainLayout>
    </ConfigProvider>
  );
}

export default MyApp; 