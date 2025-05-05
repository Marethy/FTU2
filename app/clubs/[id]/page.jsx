'use client'

import { useState, useEffect } from 'react';
import { Card, Typography, Space, Breadcrumb, Skeleton, Alert, Button } from 'antd';
import Link from 'next/link';
import MainLayout from '@/components/MainLayout';
import ErrorPage from '@/components/ErrorPage';

const { Title, Paragraph } = Typography;

export default function ClubDetail({ params }) {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await fetch(`/api/clubs/${params.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch club data');
        }
        const data = await res.json();
        setClub(data);
      } catch (error) {
        console.error('Error fetching club:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [params.id]);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={[
            { title: <Link href="/">Trang chủ</Link> },
            { title: <Link href="/clubs">Câu lạc bộ</Link> },
            { title: 'Đang tải...' }
          ]} />
          <Card>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (error || !club) {
    return (
      <MainLayout>
        <div style={{ padding: '24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={[
            { title: <Link href="/">Trang chủ</Link> },
            { title: <Link href="/clubs">Câu lạc bộ</Link> },
            { title: 'Không tìm thấy' }
          ]} />
          <Card>
            <Alert
              message="Không tìm thấy câu lạc bộ"
              description="Câu lạc bộ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
              type="error"
              showIcon
              action={
                <Button onClick={() => window.location.reload()}>
                  Thử lại
                </Button>
              }
            />
          </Card>
        </div>
      </MainLayout>
    );
  }

  const breadcrumbItems = [
    { title: <Link href="/">Trang chủ</Link> },
    { title: <Link href="/clubs">Câu lạc bộ</Link> },
    { title: club.name }
  ];

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />

        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={2}>{club.name}</Title>
            </div>
            
            <div>
              <Title level={4}>Sơ lược</Title>
              <Paragraph>{club.summary}</Paragraph>
            </div>
            
            <div>
              <Title level={4}>Cuộc thi/Chương trình</Title>
              <Paragraph>{club.contests}</Paragraph>
            </div>
            
            <div>
              <Title level={4}>Phản hồi</Title>
              <Paragraph>{club.feedback}</Paragraph>
            </div>
          </Space>
        </Card>
      </div>
    </MainLayout>
  );
} 