'use client'

import ContestGrid from '@/components/ContestGrid';
import { contests } from '@/data/contests';
import { CalendarOutlined, ClockCircleOutlined, FireOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Carousel, Col, Row, Skeleton, Typography } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const { Title, Paragraph } = Typography;

export default function ContestsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
    { title: <Link href="/">Trang chủ</Link> },
    { title: 'Cuộc thi' }
  ];

  // Get featured contests (first 3 open contests)
  const featuredContests = contests
    .filter(contest => contest.status === 'open')
    .slice(0, 3);

  // Get upcoming contests
  const upcomingContests = contests
    .filter(contest => contest.status === 'coming-soon')
    .slice(0, 4);

  const heroStyle = {
    padding: '60px 0',
    background: 'linear-gradient(135deg, #2451B8 0%, #084EB0 100%)',
    color: 'white',
    textAlign: 'center',
    marginBottom: '40px'
  };

  return (
    <div>
      <Breadcrumb style={{ margin: '16px 24px' }} items={breadcrumbItems} />

      {/* Hero Section */}
      <div style={heroStyle}>
        <Title level={1} style={{ color: 'white', margin: 0 }}>
          <TrophyOutlined /> Cuộc thi & Sự kiện
        </Title>
        <Paragraph style={{ color: 'white', fontSize: '18px', maxWidth: '800px', margin: '20px auto 0' }}>
          Khám phá và tham gia các cuộc thi thú vị từ các CLB của trường.
          Cơ hội để thể hiện tài năng, học hỏi kinh nghiệm và nhận giải thưởng hấp dẫn!
        </Paragraph>
      </div>

      <div style={{ padding: '0 24px 40px' }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <div>
            {/* Featured Contests Carousel */}
            <Card
              title={
                <span style={{ fontSize: '20px', fontWeight: '600' }}>
                  <FireOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                  Cuộc thi nổi bật
                </span>
              }
              style={{ marginBottom: 40 }}
              bordered={false}
              className="featured-carousel-card"
            >
              <Carousel autoplay autoplaySpeed={5000}>
                {featuredContests.map((contest, index) => {
                  // Tạo gradient backgrounds khác nhau cho mỗi slide
                  const gradients = [
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                  ];

                  const gradient = gradients[index % gradients.length];

                  return (
                    <div key={contest.id}>
                      <div style={{
                        padding: '60px 40px',
                        background: gradient,
                        borderRadius: '16px',
                        textAlign: 'center',
                        color: 'white',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* Decorative elements */}
                        <div style={{
                          position: 'absolute',
                          top: '-50px',
                          right: '-50px',
                          width: '150px',
                          height: '150px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)'
                        }} />
                        <div style={{
                          position: 'absolute',
                          bottom: '-30px',
                          left: '-30px',
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)'
                        }} />

                        {/* Content */}
                        <Title level={2} style={{ color: 'white', margin: 0, fontSize: '32px' }}>
                          {contest.title}
                        </Title>
                        <Paragraph style={{
                          fontSize: '18px',
                          margin: '20px auto',
                          color: 'rgba(255,255,255,0.9)',
                          maxWidth: '600px',
                          lineHeight: '1.6'
                        }}>
                          {contest.description}
                        </Paragraph>

                        <div style={{
                          marginTop: '30px',
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '30px',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            backdropFilter: 'blur(10px)'
                          }}>
                            <TeamOutlined style={{ marginRight: '8px' }} />
                            <span>{contest.club}</span>
                          </div>
                          <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            backdropFilter: 'blur(10px)'
                          }}>
                            <CalendarOutlined style={{ marginRight: '8px' }} />
                            <span>{new Date(contest.deadline).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>

                        <Link href={`/contests/${contest.id}`}>
                          <button style={{
                            marginTop: '30px',
                            padding: '12px 40px',
                            background: 'white',
                            color: gradient.includes('#667eea') ? '#667eea' :
                              gradient.includes('#f093fb') ? '#f093fb' :
                                gradient.includes('#4facfe') ? '#4facfe' :
                                  gradient.includes('#43e97b') ? '#43e97b' : '#fa709a',
                            border: 'none',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            transition: 'transform 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                          }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            Xem chi tiết
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            </Card>

            {/* Upcoming Contests */}
            {upcomingContests.length > 0 && (
              <Card
                title={
                  <span>
                    <ClockCircleOutlined /> Sắp diễn ra
                  </span>
                }
                style={{ marginBottom: 40 }}
              >
                <Row gutter={[16, 16]}>
                  {upcomingContests.map(contest => (
                    <Col xs={24} sm={12} md={6} key={contest.id}>
                      <Card
                        hoverable
                        size="small"
                        onClick={() => window.location.href = `/contests/${contest.id}`}
                      >
                        <Card.Meta
                          title={contest.title}
                          description={
                            <>
                              <div>{contest.club}</div>
                              <div style={{ color: '#2451B8' }}>{contest.category}</div>
                            </>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}

            {/* All Contests Grid */}
            <Card title="Tất cả cuộc thi">
              <ContestGrid contests={contests} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}