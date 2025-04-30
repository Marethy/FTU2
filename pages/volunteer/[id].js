import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Card, Tag, Skeleton, Typography, Space, Breadcrumb } from 'antd';
import { volunteers } from '../../data/volunteers';

const { Title, Paragraph } = Typography;

export async function getStaticPaths() {
  const paths = volunteers.map(volunteer => ({
    params: { id: volunteer.id.toString() }
  }));

  return {
    paths,
    fallback: true
  };
}

export async function getStaticProps({ params }) {
  const volunteer = volunteers.find(v => v.id.toString() === params.id);

  if (!volunteer) {
    return {
      notFound: true
    };
  }

  return {
    props: { volunteer }
  };
}

const VolunteerDetail = ({ volunteer }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div style={{ padding: '24px' }}>
        <Skeleton active />
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>Volunteer opportunity not found</Title>
        <Paragraph>Sorry, the volunteer opportunity you're looking for doesn't exist.</Paragraph>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{volunteer.title} - FTU2 Connect</title>
        <meta name="description" content={volunteer.description} />
        <meta property="og:title" content={`${volunteer.title} - FTU2 Connect`} />
        <meta property="og:description" content={volunteer.description} />
      </Head>

      <div style={{ padding: '24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><Link href="/">Trang chủ</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link href="/volunteer">Tình nguyện</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{volunteer.title}</Breadcrumb.Item>
        </Breadcrumb>

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
    </>
  );
};

export default VolunteerDetail; 