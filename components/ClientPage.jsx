'use client';

import { Card, Typography, Breadcrumb, Divider, Space } from 'antd';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function ClientPage({ club }) {
  if (!club) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>Club not found</Title>
        <Paragraph>Sorry, the club you're looking for doesn't exist.</Paragraph>
      </div>
    );
  }

  const breadcrumbItems = [
    { title: <Link href="/">Trang chủ</Link> },
    { title: <Link href="/clubs">Câu lạc bộ</Link> },
    { title: club.name }
  ];

  return (
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

          <Divider />
          
          <div>
            <Title level={4}>Cuộc thi/Chương trình</Title>
            <Paragraph>{club.contests}</Paragraph>
          </div>

          <Divider />
          
          <div>
            <Title level={4}>Phản hồi</Title>
            <Paragraph>{club.feedback}</Paragraph>
          </div>
        </Space>
      </Card>
    </div>
  );
} 