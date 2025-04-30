import { useState, useEffect } from 'react';
import { Typography, Skeleton, Breadcrumb } from 'antd';
import Link from 'next/link';
import { contests as contestsData } from '../data/contests';
import ContestList from '../components/ContestList';

const { Title } = Typography;

const ContestsPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item><Link href="/">Trang chủ</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Cuộc thi</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>Contests</Title>
      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <ContestList data={contestsData} />
      )}
    </div>
  );
};

export default ContestsPage; 