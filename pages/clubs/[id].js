import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Card, Tag, Skeleton, Typography, Space, Breadcrumb } from 'antd';
import { clubs } from '../../data/clubs';

const { Title, Paragraph } = Typography;

export async function getStaticPaths() {
  const paths = clubs.map(club => ({
    params: { id: club.id.toString() }
  }));

  return {
    paths,
    fallback: true
  };
}

export async function getStaticProps({ params }) {
  const club = clubs.find(c => c.id.toString() === params.id);

  if (!club) {
    return {
      notFound: true
    };
  }

  return {
    props: { club }
  };
}

const ClubDetail = ({ club }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div style={{ padding: '24px' }}>
        <Skeleton active />
      </div>
    );
  }

  if (!club) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>Club not found</Title>
        <Paragraph>Sorry, the club you're looking for doesn't exist.</Paragraph>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{club.name} - FTU2 Connect</title>
        <meta name="description" content={club.description} />
        <meta property="og:title" content={`${club.name} - FTU2 Connect`} />
        <meta property="og:description" content={club.description} />
        {club.logoUrl && <meta property="og:image" content={club.logoUrl} />}
      </Head>

      <div style={{ padding: '24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><Link href="/">Trang chủ</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link href="/clubs">Câu lạc bộ</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{club.name}</Breadcrumb.Item>
        </Breadcrumb>

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
    </>
  );
};

export default ClubDetail; 