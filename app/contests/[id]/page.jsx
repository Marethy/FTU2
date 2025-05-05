'use client'

import { Card, Tag, Typography, Space, Breadcrumb } from 'antd';
import Link from 'next/link';
import { contests } from '@/data/contests';
import ErrorPage from '@/components/ErrorPage';

const { Title, Paragraph } = Typography;

export default function ContestDetail({ params }) {
  const contest = contests.find(c => c.id.toString() === params.id);

  if (!contest) {
    return (
      <ErrorPage 
        title="Contest not found"
        message="Sorry, the contest you're looking for doesn't exist."
      />
    );
  }

  const isOpen = new Date(contest.deadline) > new Date();
  const deadlineDate = new Date(contest.deadline).toLocaleDateString();

  const breadcrumbItems = [
    { title: <Link href="/">Trang chủ</Link> },
    { title: <Link href="/contests">Cuộc thi</Link> },
    { title: contest.title }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />

      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2}>{contest.title}</Title>
            <Tag color="blue">{contest.club}</Tag>
            <Tag color={isOpen ? 'green' : 'red'}>
              {isOpen ? 'Open' : 'Closed'}
            </Tag>
          </div>
          
          <Paragraph>{contest.description}</Paragraph>
          
          <div>
            <Title level={4}>Deadline</Title>
            <Paragraph>{deadlineDate}</Paragraph>
          </div>
        </Space>
      </Card>
    </div>
  );
} 