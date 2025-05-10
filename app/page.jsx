'use client'

import MainLayout from '@/components/MainLayout'
import { BookOutlined, CalendarOutlined, GlobalOutlined, HeartOutlined, RocketOutlined, SoundOutlined, StarOutlined, TeamOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Calendar, Card, Carousel, Col, message, Row, Skeleton, Space, Statistic, Tag, Typography } from 'antd'
import Link from 'next/link'
import { cloneElement, useEffect, useState } from 'react'

const { Title, Text, Paragraph } = Typography

// Domain icons mapping
const domainIcons = {
  'Kinh doanh': <RocketOutlined />,
  'Khoa học': <BookOutlined />,
  'Nghiên cứu': <BookOutlined />,
  'Văn hóa': <GlobalOutlined />,
  'Nghệ thuật': <SoundOutlined />,
  'Thể thao': <TrophyOutlined />,
  'Xã hội': <HeartOutlined />,
  'Công nghệ': <TeamOutlined />
}

// Domain colors mapping
const domainColors = {
  'Kinh doanh': '#1890ff',
  'Khoa học': '#52c41a',
  'Văn hóa': '#fa8c16',
  'Nghệ thuật': '#eb2f96',
  'Thể thao': '#faad14',
  'Xã hội': '#13c2c2',
  'Công nghệ': '#722ed1'
}

// Upcoming events
const upcomingEvents = [
  { title: "Gala Night SCMission", date: "2024-12-15", type: "Cuộc thi", image: "/HOMEPAGE/sự kiện 4 (Text_ Gala Night SCMission - Cuộc thi phân tích, giải quyết tình huống kinh doanh).jpg" },
  { title: "Marketing Arena 2025", date: "2025-01-20", type: "Cuộc thi", image: "/HOMEPAGE/sự kiện 1.jpg" },
  { title: "B-LEAD 2025", date: "2025-02-10", type: "Hội thảo", image: "/HOMEPAGE/sự kiện 2.jpg" },
  { title: "Club Fair 2025", date: "2025-03-05", type: "Sự kiện", image: "/HOMEPAGE/sự kiện 3.jpg" }
]

export default function Home() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Add custom CSS for 5 columns on XL screens
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @media (min-width: 1200px) {
        .clubs-grid .ant-col-xl-6 {
          flex: 0 0 20% !important;
          max-width: 20% !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    fetchClubs()
  }, [])

  const fetchClubs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/clubs')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch clubs')
      }

      if (data.clubs) {
        // Filter clubs with logo and take first 10
        const clubsWithLogo = data.clubs.filter(club => club.logo).slice(0, 10)
        setClubs(clubsWithLogo)
      } else {
        throw new Error('No clubs data received')
      }
    } catch (err) {
      setError(err.message)
      message.error(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Group clubs by domain
  const clubsByDomain = clubs.reduce((acc, club) => {
    const domain = club.domain || 'Khác'
    if (!acc[domain]) {
      acc[domain] = []
    }
    acc[domain].push(club)
    return acc
  }, {})

  // Note: search functionality removed since we're showing featured clubs only

  // Calculate statistics - using hardcoded values since we only show featured clubs
  const totalClubs = 36 // Total clubs in the system
  const totalMembers = 5000 // Approximate total members
  const totalEvents = 50
  const domains = 6 // Number of domains

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
          borderRadius: 16,
          padding: '48px 24px',
          marginBottom: 48,
          color: 'white'
        }}>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Title level={1} style={{ color: 'white', margin: 0 }}>
                  Kết nối Cộng đồng Sinh viên FTU2
                </Title>
                <Paragraph style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                  Khám phá các câu lạc bộ, tham gia sự kiện và kết nối với cộng đồng sinh viên năng động
                </Paragraph>
                <Space wrap>
                  <Link href="/clubs">
                    <Button type="primary" size="large" style={{ background: 'white', color: '#1890ff', border: 'none' }}>
                      Khám phá CLB
                    </Button>
                  </Link>
                  <Link href="/contests">
                    <Button size="large" ghost style={{ borderColor: 'white', color: 'white' }}>
                      Sự kiện sắp tới
                    </Button>
                  </Link>
                </Space>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              {loading ? (
                <Skeleton.Image active style={{ width: '100%', height: 400 }} />
              ) : (
                <Carousel autoplay style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                  <div>
                    <img
                      src="/HOMEPAGE/banner 1 (cut dải nhà tài trợ).jpg"
                      alt="Banner 1"
                      style={{ width: '100%', height: 400, objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <img
                      src="/HOMEPAGE/banner 2.jpg"
                      alt="Banner 2"
                      style={{ width: '100%', height: 400, objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <img
                      src="/HOMEPAGE/sự kiện 1.jpg"
                      alt="Sự kiện 1"
                      style={{ width: '100%', height: 400, objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <img
                      src="/HOMEPAGE/sự kiện 2.jpg"
                      alt="Sự kiện 2"
                      style={{ width: '100%', height: 400, objectFit: 'cover' }}
                    />
                  </div>
                </Carousel>
              )}
            </Col>
          </Row>
        </div>

        {/* Stats Section */}
        <div style={{ marginBottom: 48 }}>
          <Row gutter={[16, 16]}>
            {loading ? (
              // Skeleton loading for stats
              <>
                {[1, 2, 3, 4].map((item) => (
                  <Col xs={12} sm={6} key={item}>
                    <Card>
                      <Skeleton active paragraph={false} />
                    </Card>
                  </Col>
                ))}
              </>
            ) : (
              <>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title="Câu lạc bộ"
                      value={totalClubs}
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title="Sự kiện/năm"
                      value={totalEvents}
                      suffix="+"
                      prefix={<CalendarOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title="Thành viên"
                      value={totalMembers}
                      suffix="+"
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title="Lĩnh vực"
                      value={domains}
                      prefix={<StarOutlined />}
                      valueStyle={{ color: '#eb2f96' }}
                    />
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </div>



        {/* Categories */}
        <div style={{ marginBottom: 48 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Lĩnh vực hoạt động</Title>
          {loading ? (
            // Skeleton loading for categories
            <Row gutter={[16, 16]}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item}>
                  <Card>
                    <Skeleton active>
                      <Skeleton.Image active style={{ width: '100%', height: 200, marginBottom: 16 }} />
                    </Skeleton>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : !error && (
            <Row gutter={[16, 16]}>
              {Object.entries(clubsByDomain).map(([domain, domainClubs]) => (
                <Col xs={24} sm={12} md={8} lg={6} key={domain}>
                  <Card
                    hoverable
                    style={{ textAlign: 'center', height: '100%' }}
                    cover={
                      <div style={{
                        height: 200,
                        background: domainColors[domain] || '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {cloneElement(domainIcons[domain] || <TeamOutlined />, {
                          style: { fontSize: 48, color: 'white' }
                        })}
                      </div>
                    }
                  >
                    <Card.Meta
                      title={domain}
                      description={
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text>{domainClubs.length} CLB & tổ chức</Text>
                          <Link href="/clubs">
                            <Button type="primary" block>Xem chi tiết</Button>
                          </Link>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Featured Clubs Section */}
        <div style={{ marginBottom: 48 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Câu lạc bộ nổi bật</Title>

          {loading ? (
            // Skeleton loading for clubs
            <Row gutter={[16, 16]} className="clubs-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  xl={6}
                  key={item}
                >
                  <Card style={{ height: '100%' }}>
                    <Skeleton active>
                      <Skeleton.Avatar active size={64} shape="circle" style={{ margin: '0 auto 16px', display: 'block' }} />
                      <Skeleton active paragraph={{ rows: 2 }} />
                    </Skeleton>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text type="danger">Đã xảy ra lỗi: {error}</Text>
              <br />
              <Button onClick={fetchClubs} style={{ marginTop: 16 }}>Thử lại</Button>
            </div>
          ) : (
            <>
              <Row gutter={[16, 16]} className="clubs-grid">
                {clubs.map(club => (
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    xl={6}
                    key={club.id}
                  >
                    <Card
                      hoverable
                      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                      actions={[
                        <Link href={`/clubs/${club.id}`} key="view">
                          <Button type="link">Xem chi tiết</Button>
                        </Link>
                      ]}
                    >
                      <Space
                        direction="vertical"
                        align="center"
                        style={{ width: '100%', flex: 1, justifyContent: 'space-between' }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <Avatar
                            size={64}
                            src={club.logo}
                            style={{ border: '2px solid #f0f0f0', marginBottom: 16 }}
                          />
                          <Title level={5} style={{ margin: '0 0 8px 0', textAlign: 'center', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {club.name}
                          </Title>
                          <Tag color={domainColors[club.domain] || 'blue'}>{club.domain}</Tag>
                        </div>
                        <Space style={{ marginTop: 'auto', paddingTop: 8 }}>
                          <StarOutlined style={{ color: '#faad14' }} />
                          <Text>{club.rating || 0.0}</Text>
                        </Space>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Link href="/clubs">
                  <Button type="primary" size="large">
                    Xem tất cả câu lạc bộ
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="danger">Đã xảy ra lỗi: {error}</Text>
            <br />
            <Button onClick={fetchClubs} style={{ marginTop: 16 }}>Thử lại</Button>
          </div>
        )}

        {/* Events Section */}
        <div style={{ marginBottom: 48 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Sự kiện sắp tới</Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <Card title="Lịch sự kiện">
                <Calendar />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Sự kiện nổi bật">
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {upcomingEvents.map((event, index) => (
                    <Card
                      key={index}
                      size="small"
                      style={{ borderLeft: '4px solid #1890ff' }}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Title level={5} style={{ margin: 0 }}>{event.title}</Title>
                        <Space>
                          <CalendarOutlined />
                          <Text>{new Date(event.date).toLocaleDateString('vi-VN')}</Text>
                        </Space>
                        <Tag color={event.type === 'Cuộc thi' ? 'red' : 'blue'}>{event.type}</Tag>
                      </Space>
                    </Card>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Call to Action */}
        <div style={{
          background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
          borderRadius: 16,
          padding: '48px 24px',
          textAlign: 'center',
          color: 'white'
        }}>
          <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
            Tham gia cộng đồng FTU2 ngay hôm nay
          </Title>
          <Paragraph style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
            Khám phá cơ hội phát triển kỹ năng, kết nối bạn bè và xây dựng tương lai tươi sáng
          </Paragraph>
          <Space size="large" wrap>
            <Link href="/clubs">
              <Button size="large" type="primary" style={{ background: 'white', color: '#722ed1', border: 'none' }}>
                Đăng ký tham gia
              </Button>
            </Link>
            <Button size="large" ghost style={{ borderColor: 'white', color: 'white' }}>
              Liên hệ với chúng tôi
            </Button>
          </Space>
        </div>
      </div>
    </MainLayout>
  )
}