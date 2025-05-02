'use client'

import { useState, useEffect } from 'react';
import { Typography, Skeleton, Breadcrumb } from 'antd';
import Link from 'next/link';
import { contests as contestsData } from '@/data/contests';
import ContestList from '@/components/ContestList';
import MainLayout from '@/components/MainLayout';

const { Title } = Typography;

export default function ContestsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
    { title: <Link href="/">Trang chủ</Link> },
    { title: 'Cuộc thi' }
  ];

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />

        <Title level={2}>Cuộc thi</Title>
        {loading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : (
          <ContestList contests={contestsData} />
        )}
      </div>
    </MainLayout>
  );
} 