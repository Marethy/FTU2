'use client'

import MainLayout from '@/components/MainLayout'
import { BookOutlined, CalendarOutlined, GlobalOutlined, HeartOutlined, LeftOutlined, RightOutlined, RocketOutlined, SoundOutlined, StarOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons'
import { Button, Card, Col, message, Row, Skeleton, Space, Statistic, Tag, Typography } from 'antd'
import Link from 'next/link'
import { cloneElement, useEffect, useState } from 'react'

const { Title, Text, Paragraph } = Typography

// Component hiển thị 2 ảnh cùng lúc với thiết kế chuyên nghiệp cho câu lạc bộ học thuật
const DualImageCarousel = () => {
  const [currentPair, setCurrentPair] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [fadeClass, setFadeClass] = useState('fade-in');

  // Danh sách ảnh với metadata cho câu lạc bộ học thuật
  const imageData = [
    {
      src: "/homepage/banner_1.jpg",
      title: "MARKETING AREA 2025: Beyond the toughest reside unbroken spirits",
      subtitle: "MARKETING ARENA là cuộc thi về Marketing do CLB Creatio tổ chức nhằm tìm kiếm chân dung của các Marketers bền bỉ và vững vàng trước những chuyển động không ngừng của thị trường hiện đại. Xuyên suốt các vòng thi, các thí sinh sẽ đối diện với những đề bài dựa trên tình hình kinh doanh thực tiễn của doanh nghiệp, đồng thời đương đầu với những yêu cầu chuyên môn sâu rộng những chặng cuối cùng. \nĐể kinh qua những thử thách khắc nghiệt nhất, kẻ viễn du nào cũng cần một tinh thần bất khuất hòng đương đầu với những điều tưởng chừng bất khả. Trước trận tuyến khốc liệt của thời cuộc, người thủ lĩnh phải vững vàng chèo lái con tàu thép xuyên thủng sức nén dữ dội của thời không. \nNhằm đánh thức những ý chí quả cảm, MARKETING ARENA 2025 đã chính thức quay trở lại và mở ra một sân chơi khốc liệt chưa từng có! Tôi luyện bản lĩnh sắt đá và tinh thần chiến đấu không ngừng nghỉ, Đấu trường Thực chiến sẽ xướng danh kẻ dám vượt qua thách thức thời đại để mở lối cho một kỷ nguyên Marketing rực rỡ.",
      category: "Academic Conference"
    },
    {
      src: "/homepage/banner_2.png",
      title: "B-LEAD 2025: SHIFTNARIO",
      category: "Research Competition"
    },
    {
      src: "/homepage/banner_3.jpg",
      title: "Doanh nhân tập sự 2025: In dấu thành tựu cùng thập niên bản lĩnh",
      category: "Academic Conference"
    },
    {
      src: "/homepage/banner_4.png",
      title: "IN YOUR EYES 2025: SPOTL'EYE",
      category: "Academic Conference"
    }
  ];

  // Chia thành các cặp
  const imagePairs = [];
  for (let i = 0; i < imageData.length; i += 2) {
    imagePairs.push(imageData.slice(i, i + 2));
  }

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setFadeClass('fade-out');
        setTimeout(() => {
          setCurrentPair((prev) => (prev + 1) % imagePairs.length);
          setFadeClass('fade-in');
        }, 300);
      }, 4000); // Tăng thời gian lên 4s để có cảm giác chuyên nghiệp hơn

      return () => clearInterval(interval);
    }
  }, [imagePairs.length, isHovered]);

  const handleManualChange = (direction) => {
    setFadeClass('fade-out');
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentPair((prev) => (prev + 1) % imagePairs.length);
      } else {
        setCurrentPair((prev) => (prev - 1 + imagePairs.length) % imagePairs.length);
      }
      setFadeClass('fade-in');
    }, 300);
  };

  return (    <div
      className="academic-carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg, 0 12px 40px rgba(19, 142, 255, 0.2))',
      }}
    >
      {/* Navigation Controls */}
      <div style={{
        position: 'absolute',
        top: 30,
        right: 30,
        zIndex: 10,
        display: 'flex',
        gap: 8
      }}>
        <Button
          shape="circle"
          onClick={() => handleManualChange('prev')}
          style={{
            background: 'var(--glass-bg, rgba(255, 255, 255, 0.7))',
            color: 'var(--text-primary, #1e1e1e)',
            backdropFilter: 'blur(var(--glass-blur, 10px))',
            border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.2))',
            boxShadow: 'var(--shadow-sm, 0 4px 12px rgba(19, 142, 255, 0.1))'
          }}
          icon={<LeftOutlined />}
        />
        <Button
          shape="circle"
          onClick={() => handleManualChange('next')}
          style={{
            background: 'var(--glass-bg, rgba(255, 255, 255, 0.7))',
            color: 'var(--text-primary, #1e1e1e)',
            backdropFilter: 'blur(var(--glass-blur, 10px))',
            border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.2))',
            boxShadow: 'var(--shadow-sm, 0 4px 12px rgba(19, 142, 255, 0.1))'
          }}
          icon={<RightOutlined />}
        />
      </div>

      {/* Main Content */}
      <div className={fadeClass} style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <Row gutter={[24, 24]} style={{ margin: 0 }}>
          {imagePairs[currentPair]?.map((item, index) => (
            <Col xs={24} sm={12} key={`${currentPair}-${index}`}>              <div style={{
                position: 'relative',
                borderRadius: 16,
                overflow: 'hidden',
                height: 420,
                background: 'linear-gradient(135deg, var(--primary-color, #138eff) 0%, var(--analogous-blue, #002eff) 100%)',
                boxShadow: 'var(--shadow-md, 0 8px 24px rgba(19, 142, 255, 0.15))',
                transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                {/* Background Image */}
                <img
                  src={item.src}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease'
                  }}
                />

                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)',
                }} />

                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  background: 'var(--glass-bg, rgba(255, 255, 255, 0.7))',
                  backdropFilter: 'blur(var(--glass-blur, 10px))',
                  padding: '6px 16px',
                  borderRadius: 20,
                  border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.2))'
                }}>
                  <Text style={{
                    color: 'var(--primary-color, #138eff)',
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {item.category}
                  </Text>
                </div>

                {/* Content Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '30px 25px',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)'
                }}>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Title
                      level={4}
                      style={{
                        color: 'white',
                        margin: 0,
                        fontSize: 20,
                        fontWeight: 600,
                        lineHeight: '1.3',
                        textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}
                    >
                      {item.title}
                    </Title>
                    {/* Action Button */}
                    <Button
                      type="primary"
                      ghost
                      size="small"
                      style={{
                        marginTop: 12,
                        borderColor: 'rgba(255,255,255,0.8)',
                        color: 'white',
                        borderRadius: 20,
                        fontWeight: 500,
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(255,255,255,0.1)'
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Space>
                </div>

                {/* Decorative Elements */}
                <div style={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  backdropFilter: 'blur(20px)'
                }} />
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Progress Indicators */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 12,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        {imagePairs.map((_, index) => (
          <div
            key={index}
            onClick={() => {
              setFadeClass('fade-out');
              setTimeout(() => {
                setCurrentPair(index);
                setFadeClass('fade-in');
              }, 300);
            }}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: index === currentPair
                ? 'linear-gradient(45deg, #138eff, #002eff)'
                : 'rgba(0,0,0,0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: index === currentPair ? '0 2px 8px rgba(24,144,255,0.4)' : 'none'
            }}
          />
        ))}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .academic-carousel-container .fade-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .academic-carousel-container .fade-out {
          opacity: 0;
          transform: translateY(10px);
        }
        
        .academic-carousel-container:hover img {
          transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
          .academic-carousel-container {
            margin: 0 -12px;
          }
        }
      `}</style>
    </div>
  );
};

// Domain icons mapping với 7 domains mới
const domainIcons = {
  'Khoa học - Lý luận': <BookOutlined />,
  'Kinh doanh - Khởi nghiệp': <RocketOutlined />,
  'Ngôn ngữ': <GlobalOutlined />,
  'Thể thao': <TrophyOutlined />,
  'Truyền thông - Sự kiện': <SoundOutlined />,
  'Văn hóa - Nghệ thuật': <StarOutlined />,
  'Xã hội - Tình nguyện': <HeartOutlined />,
  // Giữ lại các domain cũ để tương thích ngược
  'Kinh doanh': <RocketOutlined />,
  'Khoa học': <BookOutlined />,
  'Nghiên cứu': <BookOutlined />,
  'Văn hóa': <GlobalOutlined />,
  'Nghệ thuật': <SoundOutlined />,
  'Xã hội': <HeartOutlined />,
  'Công nghệ': <TeamOutlined />,
  // Domain mặc định
  'Khác': <TeamOutlined />
}

// Domain colors mapping using our new color palette
const domainColors = {
  'Khoa học - Lý luận': '#002eff',  // Deep Blue (analogous-blue)
  'Kinh doanh - Khởi nghiệp': '#138eff', // Primary Blue
  'Ngôn ngữ': '#13cfff', // Cyan (analogous-cyan)
  'Thể thao': '#138eff', // Primary Blue
  'Truyền thông - Sự kiện': '#ff8f13', // Orange (accent-color)
  'Văn hóa - Nghệ thuật': '#ff8f13', // Orange (accent-color)
  'Xã hội - Tình nguyện': '#002eff', // Deep Blue (analogous-blue)
  // Giữ lại các domain cũ để tương thích ngược, nhưng áp dụng màu mới
  'Kinh doanh': '#138eff', // Primary Blue
  'Khoa học': '#002eff', // Deep Blue
  'Văn hóa': '#ff8f13', // Orange
  'Nghệ thuật': '#ff8f13', // Orange
  'Thể thao': '#138eff', // Primary Blue
  'Xã hội': '#002eff', // Deep Blue
  'Công nghệ': '#13cfff', // Cyan
  // Domain mặc định
  'Khác': '#138eff' // Primary Blue
}

// Upcoming events
const upcomingEvents = [
  {
    image: "/homepage/banner_1.jpg",
    title: "MARKETING AREA 2025: Beyond the toughest reside unbroken spirits",
    date: "05/23/2025",
    type: "Cuộc thi"
  },
  {
    image: "/homepage/banner_2.png",
    title: "B-LEAD 2025: SHIFTNARIO",
    date: "04/27/2025",
    type: "Nghiên cứu"
  },
  {
    image: "/homepage/banner_3.jpg",
    title: "Doanh nhân tập sự 2025: In dấu thành tựu cùng thập niên bản lĩnh",
    date: "05/03/2025",
    type: "Cuộc thi"
  },
  {
    image: "/homepage/banner_4.png",
    title: "IN YOUR EYES 2025: SPOTL'EYE",
    date: "05/04/2025",
    type: "Cuộc thi"
  },
]

export default function Home() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [_, setDomains] = useState([])

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
        // Lấy danh sách clubs và domain từ API
        const allClubs = data.clubs || []

        // Lấy 10 club đầu tiên để hiển thị (hoặc có thể lọc theo yêu cầu khác)
        const featuredClubs = allClubs.slice(0, 10)

        // Lấy tất cả domain duy nhất
        const uniqueDomains = [...new Set(allClubs.map(club => club.domain || 'Khác'))]

        setClubs(featuredClubs)
        setDomains(uniqueDomains)
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

  // Calculate statistics - using data from API
  const totalClubs = 36 // Tổng số clubs theo danh sách
  const totalEvents = 50
  const domainCount = 7 // 7 domains mới
  // Function to calculate days left until event
  const getDaysLeft = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const timeDiff = eventDate - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  // Function to map domain names to image filenames
  const getDomainImageFilename = (domain) => {
    const mapping = {
      'Khoa học - Lý luận': 'khoahoc-lyluan.png',
      'Kinh doanh - Khởi nghiệp': 'kinhdoanh-khoinghiep.png',
      'Ngôn ngữ': 'ngonngu.png',
      'Thể thao': 'thethao.png',
      'Truyền thông - Sự kiện': 'truyenthong-sukien.png',
      'Văn hóa - Nghệ thuật': 'vanhoa-nghethuat.png',
      'Xã hội - Tình nguyện': 'congdong-thiennguyen.png'
    };
    
    return mapping[domain] || 'kinhdoanh-khoinghiep.png'; // Default fallback
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        {/* Hero Section */}
        <div style={{
          borderRadius: 16,
          marginBottom: 48,
          color: 'white'
        }}>
          {loading ? (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Skeleton.Image active style={{ width: '100%', height: 400 }} />
              </Col>
              <Col xs={24} sm={12}>
                <Skeleton.Image active style={{ width: '100%', height: 400 }} />
              </Col>
            </Row>
          ) : (
            <DualImageCarousel />
          )}
        </div>

        {/* Stats Section */}
        <div style={{ marginBottom: 48 }}>
          <Row gutter={[16, 16]}>
            {loading ? (
              // Skeleton loading for stats
              <>
                {[1, 2, 3].map((item) => (
                  <Col xs={8} sm={8} md={8} lg={8} xl={8} key={item}>
                    <Card>
                      <Skeleton active paragraph={false} />
                    </Card>
                  </Col>
                ))}
              </>
            ) : (
              <>                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Card style={{
                    background: 'var(--glass-bg, rgba(255, 255, 255, 0.7))',
                    backdropFilter: 'blur(var(--glass-blur, 10px))',
                    border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.2))',
                    boxShadow: 'var(--shadow-sm, 0 4px 12px rgba(19, 142, 255, 0.1))',
                    borderRadius: 12
                  }}>
                    <Statistic
                      title="Câu lạc bộ"
                      value={totalClubs}
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: 'var(--primary-color, #138eff)' }}
                    />
                  </Card>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Card style={{
                    background: 'var(--glass-bg, rgba(255, 255, 255, 0.7))',
                    backdropFilter: 'blur(var(--glass-blur, 10px))',
                    border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.2))',
                    boxShadow: 'var(--shadow-sm, 0 4px 12px rgba(19, 142, 255, 0.1))',
                    borderRadius: 12
                  }}>
                    <Statistic
                      title="Sự kiện/năm"
                      value={totalEvents}
                      suffix="+"
                      prefix={<CalendarOutlined />}
                      valueStyle={{ color: 'var(--accent-color, #ff8f13)' }}
                    />
                  </Card>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Card style={{
                    background: 'var(--glass-bg, rgba(255, 255, 255, 0.7))',
                    backdropFilter: 'blur(var(--glass-blur, 10px))',
                    border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.2))',
                    boxShadow: 'var(--shadow-sm, 0 4px 12px rgba(19, 142, 255, 0.1))',
                    borderRadius: 12
                  }}>
                    <Statistic
                      title="Lĩnh vực"
                      value={domainCount}
                      prefix={<StarOutlined />}
                      valueStyle={{ color: 'var(--analogous-cyan, #13cfff)' }}
                    />
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </div>        {/* Categories - Hiển thị 7 domains mới */}
        <div style={{ marginBottom: 48 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>Lĩnh vực CLB, Đội, Nhóm</Title>
          <Paragraph style={{ textAlign: 'center', color: 'var(--text-secondary, #494952)', marginBottom: 32 }}>
            Các lĩnh vực CLB, Đội, Nhóm đa dạng và đầy màu sắc. Đậm chất riêng - Vững chất chung của Nhà Ngoại.
          </Paragraph>
          {loading ? (
            // Skeleton loading for categories
            <>
              {/* Row 1: 4 items */}
              <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                {[1, 2, 3, 4].map((item) => (
                  <Col xs={24} sm={12} md={6} lg={6} xl={6} key={item}>
                    <Card>
                      <Skeleton active>
                        <Skeleton.Image active style={{ width: '100%', height: 200, marginBottom: 16 }} />
                      </Skeleton>
                    </Card>
                  </Col>
                ))}
              </Row>
              {/* Row 2: 3 items centered */}
              <Row gutter={[16, 16]} justify="center">
                {[5, 6, 7].map((item) => (
                  <Col xs={24} sm={12} md={6} lg={6} xl={6} key={item}>
                    <Card>
                      <Skeleton active>
                        <Skeleton.Image active style={{ width: '100%', height: 200, marginBottom: 16 }} />
                      </Skeleton>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          ) : !error && (
            <>
              {/* Danh sách 7 domains */}
              {(() => {
                const domains = [
                  'Khoa học - Lý luận',
                  'Kinh doanh - Khởi nghiệp',
                  'Ngôn ngữ',
                  'Thể thao',
                  'Truyền thông - Sự kiện',
                  'Văn hóa - Nghệ thuật',
                  'Xã hội - Tình nguyện'
                ];

                const domainUrlMapping = {
                  'Khoa học - Lý luận': 'khoa-hoc-ly-luan',
                  'Kinh doanh - Khởi nghiệp': 'kinh-doanh-khoi-nghiep',
                  'Ngôn ngữ': 'ngon-ngu',
                  'Thể thao': 'the-thao',
                  'Truyền thông - Sự kiện': 'truyen-thong-su-kien',
                  'Văn hóa - Nghệ thuật': 'van-hoa-nghe-thuat',
                  'Xã hội - Tình nguyện': 'xa-hoi-tinh-nguyen'
                };

                const renderDomainCard = (domain) => {
                  const domainClubCount = clubs.filter(club =>
                    club.domain === domain ||
                    (club.domain && club.domain.includes(domain))
                  ).length;                return (                    <Card
                      hoverable
                      style={{ 
                        textAlign: 'center', 
                        height: '100%', 
                        background: 'var(--glass-bg, rgba(255, 255, 255, 0.7))',
                        backdropFilter: 'blur(var(--glass-blur, 10px))',
                        borderRadius: 16,
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-md, 0 8px 24px rgba(19, 142, 255, 0.15))',
                        border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.2))'
                      }}
                      cover={
                        <div style={{
                          height: 200,
                          background: domainColors[domain] || 'var(--primary-color, #138eff)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {/* Add glassmorphism effect on top */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(135deg, ${domainColors[domain]}80 0%, ${domainColors[domain]}40 100%)`,
                            zIndex: 1
                          }} />                          {/* Map domain to image file */}                          <img 
                            src={`/images/clubs_icon/${getDomainImageFilename(domain)}`}
                            alt={domain}
                            style={{
                              width: 120,
                              height: 120,
                              objectFit: 'contain',
                              position: 'relative',
                              zIndex: 2,
                              transition: 'transform 0.3s ease'
                            }}                            className="domain-icon"
                          />
                        </div>
                      }
                    >                      <Card.Meta
                        title={<span style={{ 
                          color: 'var(--text-primary, #1e1e1e)', 
                          fontSize: 18,
                          fontWeight: 600
                        }}>{domain}</span>}                        description={
                          <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                            <Link href={`/clubs?domain=${domainUrlMapping[domain] || domain.toLowerCase().replace(/\s+/g, '-')}`}>
                
                              <Button 
                                type="primary" 
                                block
                                style={{
                                  background: domainColors[domain] || 'var(--primary-color, #138eff)',
                                  borderColor: domainColors[domain] || 'var(--primary-color, #138eff)',
                                  boxShadow: 'var(--shadow-sm, 0 4px 12px rgba(19, 142, 255, 0.1))'
                                }}
                              >
                                Xem chi tiết
                              </Button>
                            </Link>
                          </Space>
                        }
                      />
                    </Card>
                  );
                };

                return (
                  <>
                    {/* Row 1: 4 items đầu tiên */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                      {domains.slice(0, 4).map((domain) => (
                        <Col xs={24} sm={12} md={6} lg={6} xl={6} key={domain}>
                          {renderDomainCard(domain)}
                        </Col>
                      ))}
                    </Row>

                    {/* Row 2: 3 items cuối, centered */}
                    <Row gutter={[16, 16]} justify="center">
                      {domains.slice(4, 7).map((domain) => (
                        <Col xs={24} sm={12} md={6} lg={6} xl={6} key={domain}>
                          {renderDomainCard(domain)}
                        </Col>
                      ))}
                    </Row>
                  </>
                );
              })()}
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
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Sự kiện nổi bật</Title>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={22} md={18} lg={16} xl={14}>              <Card
                title="Sự kiện sắp tới"
                style={{
                  background: 'var(--glass-bg, rgba(255, 255, 255, 0.7))',
                  backdropFilter: 'blur(var(--glass-blur, 10px))',
                  border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.2))',
                  boxShadow: 'var(--shadow-md, 0 8px 24px rgba(19, 142, 255, 0.15))',
                  borderRadius: '16px'
                }}
                headStyle={{
                  borderBottom: '1px solid var(--glass-border, rgba(255, 255, 255, 0.2))',
                  fontSize: 18,
                  fontWeight: 600
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {upcomingEvents.map((event, index) => {
                    const daysLeft = getDaysLeft(event.date);
                    const showCountdown = daysLeft > 0 && daysLeft <= 5;

                    return (
                      <Card
                        key={index}
                        size="small"
                        hoverable
                        style={{
                          borderLeft: showCountdown ? '4px solid var(--error-color, #ba1a1a)' : `4px solid var(--primary-color, #138eff)`,
                          backgroundColor: showCountdown && daysLeft <= 2 ? 'rgba(186, 26, 26, 0.05)' : 'var(--glass-bg, rgba(255, 255, 255, 0.7))',
                          backdropFilter: 'blur(var(--glass-blur, 10px))',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          boxShadow: 'var(--shadow-sm, 0 4px 12px rgba(19, 142, 255, 0.1))'
                        }}
                      >                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Title level={5} style={{ margin: 0, color: 'var(--text-primary, #1e1e1e)' }}>{event.title}</Title>
                          <Space>
                            <CalendarOutlined style={{ color: 'var(--primary-color, #138eff)' }} />
                            <Text style={{ color: 'var(--text-secondary, #494952)' }}>{new Date(event.date).toLocaleDateString('vi-VN')}</Text>

                            {showCountdown && (
                              <Text
                                style={{
                                  color: daysLeft <= 2 ? 'var(--error-color, #ba1a1a)' : 'var(--accent-color, #ff8f13)',
                                  fontWeight: 'bold',
                                  animation: daysLeft <= 2 ? 'pulse 2s infinite' : 'none'
                                }}
                              >
                                (Còn {daysLeft} ngày)
                              </Text>
                            )}
                          </Space>
                          <Tag 
                            color={event.type === 'Cuộc thi' ? 'var(--accent-color, #ff8f13)' : 'var(--primary-color, #138eff)'}
                            style={{
                              background: event.type === 'Cuộc thi' ? 'var(--accent-light, #fff2e0)' : 'var(--primary-light, #e3f2ff)',
                              color: event.type === 'Cuộc thi' ? 'var(--accent-dark, #d26e00)' : 'var(--primary-dark, #002eff)',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '2px 8px'
                            }}
                          >
                            {event.type}
                          </Tag>
                        </Space>
                      </Card>
                    );
                  })}
                </Space>
              </Card>
            </Col>
          </Row>
        </div>        {/* Add styles for pulse animation */}
        <style jsx global>{`
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.6; }
                100% { opacity: 1; }
            }
            
            .domain-icon {
                transition: transform 0.3s ease;
            }
            
            .ant-card:hover .domain-icon {
                transform: scale(1.1);
            }
        `}</style>
      </div>
    </MainLayout>
  )
}