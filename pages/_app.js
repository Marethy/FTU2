import { ConfigProvider } from 'antd';
import '../styles/globals.css';
import MainLayout from '../components/MainLayout';

function MyApp({ Component, pageProps }) {
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: '#0057a3' }  // UFM blue
      }}
    >
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ConfigProvider>
  );
}

export default MyApp; 