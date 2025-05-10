'use client'

import ErrorPage from '@/components/ErrorPage';
import { contests } from '@/data/contests';
import { CalendarOutlined, FormOutlined, InfoCircleOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Badge, Breadcrumb, Button, Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

export default function ContestDetail({ params }) {
  const contest = contests.find(c => c.id.toString() === params.id);

  if (!contest) {
    return (
      <ErrorPage
        title="Không tìm thấy cuộc thi"
        message="Xin lỗi, cuộc thi bạn đang tìm kiếm không tồn tại."
      />
    );
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'open':
        return { text: 'Đang mở', color: 'green' };
      case 'coming-soon':
        return { text: 'Sắp diễn ra', color: 'blue' };
      case 'closed':
        return { text: 'Đã đóng', color: 'red' };
      default:
        return { text: 'Không xác định', color: 'default' };
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Khoa học - Lý luận':
        return 'purple';
      case 'Kinh doanh - Khởi nghiệp':
        return 'gold';
      case 'Văn hóa - Nghệ thuật':
        return 'magenta';
      case 'Ngôn ngữ':
        return 'cyan';
      case 'Thể thao':
        return 'lime';
      default:
        return 'default';
    }
  };

  const statusInfo = getStatusInfo(contest.status);
  const deadlineDate = new Date(contest.deadline);
  const daysLeft = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));

  const breadcrumbItems = [
    { title: <Link href="/">Trang chủ</Link> },
    { title: <Link href="/contests">Cuộc thi</Link> },
    { title: contest.title }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Header */}
              <div>
                <Title level={2} style={{ margin: 0 }}>{contest.title}</Title>
                <Space wrap style={{ marginTop: 16 }}>
                  <Tag icon={<TeamOutlined />} color="blue">{contest.club}</Tag>
                  <Tag icon={<TrophyOutlined />} color={getCategoryColor(contest.category)}>
                    {contest.category}
                  </Tag>
                  <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                </Space>
              </div>

              {/* Image */}
              <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
                <Image
                  src={contest.image || '/placeholder.svg'}
                  alt={contest.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>

              <Divider />

              {/* Description */}
              <div>
                <Title level={4}>
                  <InfoCircleOutlined /> Giới thiệu
                </Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  {contest.fullDescription}
                </Paragraph>
              </div>

              <Divider />

              {/* Contest Info */}
              <div>
                <Title level={4}>
                  <CalendarOutlined /> Thông tin cuộc thi
                </Title>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Card type="inner" style={{ marginBottom: 16 }}>
                      <Text strong>Hạn đăng ký:</Text>
                      <br />
                      <Text>{deadlineDate.toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</Text>
                      {contest.status === 'open' && daysLeft > 0 && (
                        <div>
                          <br />
                          <Text type="warning">Còn {daysLeft} ngày</Text>
                        </div>
                      )}
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card type="inner" style={{ marginBottom: 16 }}>
                      <Text strong>Trạng thái:</Text>
                      <br />
                      <Badge status={contest.status === 'open' ? 'processing' : contest.status === 'coming-soon' ? 'default' : 'error'} text={statusInfo.text} />
                    </Card>
                  </Col>
                </Row>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} md={8}>
          {/* Registration Card */}
          <Card style={{ marginBottom: 24 }}>
            <Title level={4} style={{ marginTop: 0 }}>
              <FormOutlined /> Đăng ký tham gia
            </Title>
            <Paragraph>
              {contest.status === 'open' ?
                'Cuộc thi đang mở đăng ký. Hãy nhanh tay đăng ký để không bỏ lỡ cơ hội!' :
                contest.status === 'coming-soon' ?
                  'Cuộc thi sẽ sớm mở đăng ký. Hãy theo dõi để cập nhật thông tin mới nhất!' :
                  'Cuộc thi đã kết thúc đăng ký.'
              }
            </Paragraph>
            <Button
              type="primary"
              size="large"
              block
              disabled={contest.status !== 'open'}
              href={contest.registrationLink}
              icon={<FormOutlined />}
            >
              {contest.status === 'open' ? 'Đăng ký ngay' :
                contest.status === 'coming-soon' ? 'Sắp mở đăng ký' : 'Đã đóng'}
            </Button>
          </Card>

          {/* Club Info Card */}
          <Card>
            <Title level={4} style={{ marginTop: 0 }}>
              <TeamOutlined /> Về {contest.club}
            </Title>
            <Paragraph>
              {contest.description}
            </Paragraph>
            <Button type="default" block href={`/clubs/${contest.club}`}>
              Tìm hiểu thêm về CLB
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}