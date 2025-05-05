'use client'

import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { Card, Typography, Space, Breadcrumb, Divider } from 'antd';
import { clubs } from '@/data/clubs';
import ErrorPage from '@/components/ErrorPage';

const { Title, Paragraph } = Typography;

export default function ClubDetail({ params }) {
  const club = clubs.find(c => String(c.id) === (params?.id || ''));

  if (!club) {
    return (
      <ErrorPage 
        title="Club not found"
        message="Sorry, the club you're looking for doesn't exist."
      />
    );
  }

  const breadcrumbItems = [
    { title: <Link href="/">Trang chủ</Link> },
    { title: <Link href="/clubs">Câu lạc bộ</Link> },
    { title: club.name }
  ];

  return (
    <>
      <Head>
        <title>{club.name} - FTU2 Connect</title>
        <meta name="description" content={club.summary} />
        <meta property="og:title" content={`${club.name} - FTU2 Connect`} />
        <meta property="og:description" content={club.summary} />
      </Head>

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
    </>
  );
} 