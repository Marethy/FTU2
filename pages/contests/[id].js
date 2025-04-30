import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Card, Tag, Skeleton, Typography, Space, Breadcrumb } from 'antd';
import { contests } from '../../data/contests';

const { Title, Paragraph } = Typography;

export async function getStaticPaths() {
  const paths = contests.map(contest => ({
    params: { id: contest.id.toString() }
  }));

  return {
    paths,
    fallback: true
  };
}

export async function getStaticProps({ params }) {
  const contest = contests.find(c => c.id.toString() === params.id);

  if (!contest) {
    return {
      notFound: true
    };
  }

  return {
    props: { contest }
  };
}

const ContestDetail = ({ contest }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div style={{ padding: '24px' }}>
        <Skeleton active />
      </div>
    );
  }

  if (!contest) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>Contest not found</Title>
        <Paragraph>Sorry, the contest you're looking for doesn't exist.</Paragraph>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{contest.title} - FTU2 Connect</title>
        <meta name="description" content={contest.description} />
        <meta property="og:title" content={`${contest.title} - FTU2 Connect`} />
        <meta property="og:description" content={contest.description} />
      </Head>

      <div style={{ padding: '24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><Link href="/">Trang chủ</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link href="/contests">Cuộc thi</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{contest.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={2}>{contest.title}</Title>
              <Tag color="blue">{contest.club}</Tag>
              <Tag color={new Date(contest.deadline) > new Date() ? 'green' : 'red'}>
                {new Date(contest.deadline) > new Date() ? 'Open' : 'Closed'}
              </Tag>
            </div>
            
            <Paragraph>{contest.description}</Paragraph>
            
            <div>
              <Title level={4}>Deadline</Title>
              <Paragraph>{new Date(contest.deadline).toLocaleDateString()}</Paragraph>
            </div>
          </Space>
        </Card>
      </div>
    </>
  );
};

export default ContestDetail; 