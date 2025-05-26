'use client';

import { ThemeContext } from '@/contexts/ThemeContext';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useContext } from 'react';

export default function ThemeConfigProvider({ children }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const themeConfig = {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#138eff',
      colorBgContainer: isDark ? '#141414' : '#ffffff',
      colorText: isDark ? '#ffffff' : '#000000',
      colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
      colorBorder: isDark ? '#434343' : '#d9d9d9',
    },
    components: {
      Menu: {
        darkItemBg: '#141414',
        darkItemSelectedBg: '#1f1f1f',
        darkItemHoverBg: '#1f1f1f',
        darkItemColor: '#ffffff',
      },
      Card: {
        colorBgContainer: isDark ? '#141414' : '#ffffff',
        colorTextBase: isDark ? '#ffffff' : '#000000',
      },
      Layout: {
        bodyBg: isDark ? '#000000' : '#f0f2f5',
        headerBg: isDark ? '#141414' : '#001529',
        footerBg: isDark ? '#141414' : '#f0f2f5',
        siderBg: isDark ? '#141414' : '#ffffff',
      },
      Table: {
        colorBgContainer: isDark ? '#141414' : '#ffffff',
        headerBg: isDark ? '#1f1f1f' : '#fafafa',
        headerColor: isDark ? '#ffffff' : '#000000',
        rowHoverBg: isDark ? '#1f1f1f' : '#e6f7ff',
        borderColor: isDark ? '#434343' : '#f0f0f0',
      },
      Alert: {
        colorError: isDark ? '#a61d24' : '#ff4d4f',
        colorErrorBg: isDark ? '#2a1215' : '#fff2f0',
        colorErrorBorder: isDark ? '#58181c' : '#ffccc7',
      },      Button: {
        primaryColor: '#ffffff',
        primaryBg: '#138eff',
        primaryBorderColor: '#138eff',
        primaryHoverBg: '#3ba0ff',
        primaryHoverBorderColor: '#3ba0ff',
      },
      Tag: {
        colorBgContainer: isDark ? '#141414' : '#ffffff',
        colorBorder: isDark ? '#434343' : '#d9d9d9',        colorText: isDark ? '#ffffff' : '#000000',
        colorSuccess: isDark ? '#49aa19' : '#52c41a',
        colorError: isDark ? '#a61d24' : '#ff4d4f',
        colorInfo: isDark ? '#138eff' : '#138eff',
      },
      Typography: {
        colorText: isDark ? '#ffffff' : '#000000',
        colorTextSecondary: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
      },
      Breadcrumb: {
        colorText: isDark ? '#ffffff' : '#000000',
        colorTextDescription: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
        separatorColor: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
      }
    }
  };

  return (
    <ConfigProvider theme={themeConfig}>
      {children}
    </ConfigProvider>
  );
}