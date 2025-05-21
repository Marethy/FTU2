'use client'

import MainLayout from '@/components/MainLayout';
import { volunteers } from '@/data/volunteers';
import { Breadcrumb, Card, Space, Tag, Typography } from 'antd';
import Head from 'next/head';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function VolunteerDetail({ params }) {
  const volunteer = volunteers.find(v => v.id.toString() === params.id);

  

  const breadcrumbItems = [
    { title: <Link href="/">Trang chủ</Link> },
    { title: <Link href="/volunteer">Tình nguyện</Link> },
    { title: volunteer.title }
  ];

  return (
    <MainLayout>
      <Head>
        <title>{volunteer.title} - FTU2 Connect</title>
        <meta name="description" content={volunteer.description} />
        <meta property="og:title" content={`${volunteer.title} - FTU2 Connect`} />
        <meta property="og:description" content={volunteer.description} />
      </Head>

      <div style={{ padding: '24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />

        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={2}>{volunteer.title}</Title>
              <Tag color="blue">{volunteer.club}</Tag>
              <Tag color={new Date(volunteer.deadline) > new Date() ? 'green' : 'red'}>
                {new Date(volunteer.deadline) > new Date() ? 'Open' : 'Closed'}
              </Tag>
            </div>

            <Paragraph>{volunteer.description}</Paragraph>

            <div>
              <Title level={4}>Deadline</Title>
              <Paragraph>{new Date(volunteer.deadline).toLocaleDateString()}</Paragraph>
            </div>
          </Space>
        </Card>
      </div>
    </MainLayout>
  );
} 