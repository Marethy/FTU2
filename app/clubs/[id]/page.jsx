'use client'

import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { Card, Tag, Skeleton, Typography, Space, Breadcrumb } from 'antd';
import { clubs } from '@/data/clubs';
import MainLayout from '@/components/MainLayout';

const { Title, Paragraph } = Typography;

export default function ClubDetail({ params }) {
  const club = clubs.find(c => c.id.toString() === params.id);

  if (!club) {
    return (
      <MainLayout>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Title level={3}>Club not found</Title>
          <Paragraph>Sorry, the club you're looking for doesn't exist.</Paragraph>
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
      <Head>
        <title>{club.name} - FTU2 Connect</title>
        <meta name="description" content={club.description} />
        <meta property="og:title" content={`${club.name} - FTU2 Connect`} />
        <meta property="og:description" content={club.description} />
        {club.logoUrl && <meta property="og:image" content={club.logoUrl} />}
      </Head>

      <div style={{ padding: '24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />

        <Card
          cover={<img alt={club.name} src={club.logoUrl} style={{ maxHeight: '300px', objectFit: 'contain' }} />}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={2}>{club.name}</Title>
              <Tag color="blue">{club.domain}</Tag>
              <Tag color={new Date(club.deadline) > new Date() ? 'green' : 'red'}>
                {new Date(club.deadline) > new Date() ? 'Open' : 'Closed'}
              </Tag>
            </div>
            
            <Paragraph>{club.description}</Paragraph>
            
            <div>
              <Title level={4}>Deadline</Title>
              <Paragraph>{new Date(club.deadline).toLocaleDateString()}</Paragraph>
            </div>
          </Space>
        </Card>
      </div>
    </MainLayout>
  );
} 