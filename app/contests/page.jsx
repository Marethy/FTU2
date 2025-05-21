'use client'

import ContestGrid from '@/components/ContestGrid';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileExcelOutlined,
  FilterOutlined,
  FireOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Carousel,
  Col,
  Empty,
  Input,
  Row,
  Select,
  Skeleton,
  Space,
  Tooltip,
  Typography
} from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// Component skeleton cho featured contests carousel
const FeaturedContestsSkeleton = () => (
  <Card
    title={
      <span style={{ fontSize: '20px', fontWeight: '600' }}>
        <FireOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
        Cuộc thi nổi bật
      </span>
    }
    style={{ marginBottom: 40 }}
    variant="borderless"
    className="featured-carousel-card"
  >
    <div style={{
      padding: '60px 40px',
      background: '#f5f5f5',
      borderRadius: '16px',
      textAlign: 'center'
    }}>
      <Skeleton.Input style={{ width: 300, marginBottom: 20 }} size="large" />
      <Skeleton paragraph={{ rows: 2, width: ['80%', '60%'] }} />
      <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center', gap: 30 }}>
        <Skeleton.Button style={{ width: 150 }} />
        <Skeleton.Button style={{ width: 150 }} />
      </div>
      <Skeleton.Button style={{ width: 120, marginTop: 30 }} size="large" />
    </div>
  </Card>
);

// Component skeleton cho upcoming contests
const UpcomingContestsSkeleton = () => (
  <Card
    title={
      <span>
        <ClockCircleOutlined /> Sắp diễn ra
      </span>
    }
    style={{ marginBottom: 40 }}
  >
    <Row gutter={[16, 16]}>
      {[1, 2, 3, 4].map(i => (
        <Col xs={24} sm={12} md={6} key={i}>
          <Card>
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        </Col>
      ))}
    </Row>
  </Card>
);

// Component skeleton cho hero section
const HeroSkeleton = () => (
  <div style={{
    padding: '60px 0',
    background: '#f5f5f5',
    textAlign: 'center',
    marginBottom: '40px'
  }}>
    <Skeleton.Input style={{ width: 300, marginBottom: 20 }} size="large" />
    <Skeleton paragraph={{ rows: 2, width: ['80%', '60%'] }} />
  </div>
);

export default function ContestsPage() {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayLoading, setDisplayLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    status: null,
    category: null,
    club: null,
    search: ''
  });
  const [dataSource, setDataSource] = useState('excel');

  const fetchContests = async () => {
    setLoading(true);
    try {
      // Thêm timestamp để tránh cache
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/contests?t=${timestamp}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();

      if (!data.contests || !Array.isArray(data.contests)) {
        throw new Error('Dữ liệu không hợp lệ từ API');
      }

      setContests(data.contests);
      setFilteredContests(data.contests);

      // Trích xuất danh sách categories và clubs duy nhất
      if (data.contests.length > 0) {
        const uniqueCategories = [...new Set(data.contests.map(c => c.category).filter(Boolean))];
        const uniqueClubs = [...new Set(data.contests.map(c => c.club).filter(Boolean))];
        setCategories(uniqueCategories);
        setClubs(uniqueClubs);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching contests:', err);
      setError(err.message || 'Không thể tải dữ liệu cuộc thi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    // Minimum loading time for better UX
    const timer = setTimeout(() => {
      setDisplayLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Apply filters when activeFilters change
  useEffect(() => {
    let result = [...contests];

    // Calculate days left for each contest
    result = result.map(contest => {
      const deadlineDate = new Date(contest.deadline);
      const daysLeft = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
      return { ...contest, daysLeft };
    });

    // Filter by status
    if (activeFilters.status) {
      if (activeFilters.status === 'expiring-soon') {
        // Lọc cuộc thi sắp hết hạn (còn ≤ 5 ngày và đang mở)
        result = result.filter(contest =>
          contest.status === 'open' &&
          contest.daysLeft <= 5 &&
          contest.daysLeft > 0
        );
      } else {
        result = result.filter(contest => contest.status === activeFilters.status);
      }
    }

    // Filter by category
    if (activeFilters.category) {
      result = result.filter(contest => contest.category === activeFilters.category);
    }

    // Filter by club
    if (activeFilters.club) {
      result = result.filter(contest => contest.club === activeFilters.club);
    }

    // Filter by search term
    if (activeFilters.search) {
      const searchTerm = activeFilters.search.toLowerCase();
      result = result.filter(contest =>
        contest.title?.toLowerCase().includes(searchTerm) ||
        contest.description?.toLowerCase().includes(searchTerm) ||
        contest.club?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredContests(result);
  }, [contests, activeFilters]);

  const breadcrumbItems = [
    { title: <Link href="/">Trang chủ</Link> },
    { title: 'Cuộc thi' }
  ];

  const handleFilterChange = (type, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      status: null,
      category: null,
      club: null,
      search: ''
    });
  };

  // Handle errors
  if (error && !loading && !displayLoading) {
    return (
      <div style={{ padding: '24px' }}>
        <Breadcrumb style={{ margin: '16px 24px' }} items={breadcrumbItems} />
        <Alert
          message="Lỗi khi tải dữ liệu"
          description={
            <div>
              <p>{error}</p>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchContests}
                style={{ marginTop: '10px' }}
              >
                Thử lại
              </Button>
              <div style={{ marginTop: '15px' }}>
                <Text type="secondary">
                  <FileExcelOutlined /> Nguồn dữ liệu: {dataSource === 'excel' ? 'Excel file' : 'JSON'}
                </Text>
              </div>
            </div>
          }
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Get featured contests (first 3 open contests)
  const featuredContests = filteredContests
    .filter(contest => contest.status === 'open')
    .slice(0, 3);

  // Get upcoming contests
  const upcomingContests = filteredContests
    .filter(contest => contest.status === 'coming-soon')
    .slice(0, 4);

  const heroStyle = {
    padding: '60px 0',
    background: 'linear-gradient(135deg, #2451B8 0%, #084EB0 100%)',
    color: 'white',
    textAlign: 'center',
    marginBottom: '40px',
    borderRadius: '0 0 20px 20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  };

  return (
    <div>
      <Breadcrumb style={{ margin: '16px 24px' }} items={breadcrumbItems} />

      {(loading || displayLoading) ? (
        <>
          <HeroSkeleton />
          <div style={{ padding: '0 24px 40px' }}>
            <FeaturedContestsSkeleton />
            <UpcomingContestsSkeleton />
            <Card title="Tất cả cuộc thi">
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* Hero Section */}
          <div style={heroStyle}>
            <Title level={1} style={{ color: 'white', margin: 0 }}>
              <TrophyOutlined /> Cuộc thi & Sự kiện
            </Title>
            <Paragraph style={{ color: 'white', fontSize: '18px', maxWidth: '800px', margin: '20px auto 0' }}>
              Khám phá và tham gia các cuộc thi thú vị từ các CLB của trường.
              Cơ hội để thể hiện tài năng, học hỏi kinh nghiệm và nhận giải thưởng hấp dẫn!
            </Paragraph>

            <div style={{
              maxWidth: '800px',
              margin: '30px auto 0',
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <Badge count={contests.length} offset={[0, 0]} style={{ backgroundColor: '#52c41a' }}>
                <Button style={{ marginRight: '15px' }}>
                  <FileExcelOutlined /> Cuộc thi từ Excel
                </Button>
              </Badge>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchContests}
              >
                Làm mới dữ liệu
              </Button>
            </div>
          </div>

          <div style={{ padding: '0 24px 40px' }}>
            {/* Filter Controls */}
            <Card style={{ marginBottom: 40 }} title={
              <Space>
                <FilterOutlined /> Bộ lọc cuộc thi
                {Object.values(activeFilters).some(v => v) && (
                  <Badge count="active" style={{ backgroundColor: '#2451B8' }} />
                )}
              </Space>
            }>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={24} md={6}>
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Tìm kiếm cuộc thi..."
                    value={activeFilters.search}
                    onChange={e => handleFilterChange('search', e.target.value)}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={8} md={5}>                  <Select
                    placeholder="Trạng thái"
                    style={{ width: '100%' }}
                    value={activeFilters.status}
                    onChange={value => handleFilterChange('status', value)}
                    allowClear
                  >
                    <Option value="open">Đang mở</Option>
                    <Option value="coming-soon">Sắp diễn ra</Option>
                    <Option value="closed">Đã đóng</Option>
                    <Option value="expiring-soon">Sắp hết hạn (≤ 5 ngày)</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={8} md={5}>
                  <Select
                    placeholder="Danh mục"
                    style={{ width: '100%' }}
                    value={activeFilters.category}
                    onChange={value => handleFilterChange('category', value)}
                    allowClear
                  >
                    {categories.filter(Boolean).map((category, index) => (
                      <Option key={category || `category-${index}`} value={category}>{category}</Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={8} md={5}>
                  <Select
                    placeholder="CLB tổ chức"
                    style={{ width: '100%' }}
                    value={activeFilters.club}
                    onChange={value => handleFilterChange('club', value)}
                    allowClear
                  >
                    {clubs.filter(Boolean).map((club, index) => (
                      <Option key={club || `club-${index}`} value={club}>{club}</Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={24} md={3} style={{ textAlign: 'right' }}>
                  <Button
                    onClick={clearFilters}
                    disabled={!Object.values(activeFilters).some(v => v)}
                  >
                    Xoá bộ lọc
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Featured Contests Carousel */}
            {featuredContests.length > 0 ? (
              <Card
                title={
                  <span style={{ fontSize: '20px', fontWeight: '600' }}>
                    <FireOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                    Cuộc thi nổi bật
                  </span>
                }
                style={{ marginBottom: 40 }}
                variant="borderless"
                className="featured-carousel-card"
                extra={
                  <Badge count={featuredContests.length} style={{ backgroundColor: '#52c41a' }}>
                    <span>Đang mở</span>
                  </Badge>
                }
              >
                <Carousel autoplay autoplaySpeed={5000} dots={{ className: 'custom-carousel-dots' }}>
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
                      <div key={contest.id || `featured-${index}`}>
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

                            {/* Hiển thị đếm ngược nếu còn ≤ 5 ngày */}
                            {contest.status === 'open' &&
                              Math.ceil((new Date(contest.deadline) - new Date()) / (1000 * 60 * 60 * 24)) <= 5 &&
                              Math.ceil((new Date(contest.deadline) - new Date()) / (1000 * 60 * 60 * 24)) > 0 && (
                                <div style={{
                                  background: 'rgba(255, 77, 79, 0.8)',
                                  padding: '10px 20px',
                                  borderRadius: '25px',
                                  backdropFilter: 'blur(10px)',
                                  fontWeight: 'bold',
                                  animation: 'pulse 2s infinite'
                                }}>
                                  <ClockCircleOutlined style={{ marginRight: '8px' }} />
                                  <span>Còn {Math.ceil((new Date(contest.deadline) - new Date()) / (1000 * 60 * 60 * 24))} ngày!</span>
                                </div>
                              )}
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
                              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                              }}
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
            ) : activeFilters.status || activeFilters.category || activeFilters.club || activeFilters.search ? (
              <Alert
                message="Không tìm thấy cuộc thi nổi bật"
                description="Không có cuộc thi nào đang mở phù hợp với bộ lọc hiện tại."
                type="info"
                showIcon
                style={{ marginBottom: 40 }}
              />
            ) : null}

            {/* Upcoming Contests */}
            {upcomingContests.length > 0 ? (
              <Card
                title={
                  <span>
                    <ClockCircleOutlined /> Sắp diễn ra
                  </span>
                }
                style={{ marginBottom: 40 }}
                extra={
                  <Badge count={upcomingContests.length} style={{ backgroundColor: '#1890ff' }}>
                    <span>Sắp tới</span>
                  </Badge>
                }
              >
                <Row gutter={[16, 16]}>
                  {upcomingContests.map((contest, index) => (
                    <Col xs={24} sm={12} md={6} key={contest.id || `upcoming-${index}`}>
                      <Card
                        hoverable
                        size="small"
                        onClick={() => window.location.href = `/contests/${contest.id}`}
                        style={{
                          flex: 1,
                          transition: 'all 0.3s ease',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                        actions={[
                          <Tooltip title="Xem chi tiết" key="view">
                            <Link href={`/contests/${contest.id}`}>Chi tiết</Link>
                          </Tooltip>,
                        ]}
                      >
                        <Card.Meta
                          title={
                            <Tooltip title={contest.title}>
                              <div style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
                                marginBottom: '8px'
                              }}>
                                {contest.title}
                              </div>
                            </Tooltip>
                          }
                          description={
                            <>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '5px'
                              }}>
                                <TeamOutlined style={{ marginRight: '5px' }} />
                                <Text ellipsis style={{ flex: 1 }}>{contest.club}</Text>
                              </div>
                              <div style={{
                                color: '#2451B8',
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                                <CalendarOutlined style={{ marginRight: '5px' }} />
                                <Text ellipsis style={{ flex: 1 }}>
                                  {new Date(contest.deadline).toLocaleDateString('vi-VN')}
                                </Text>
                              </div>

                              {/* Hiển thị đếm ngược nếu còn ≤ 5 ngày */}
                              {contest.status === 'open' && contest.daysLeft <= 5 && contest.daysLeft > 0 && (
                                <div style={{
                                  marginTop: '5px',
                                  padding: '3px 8px',
                                  background: contest.daysLeft <= 2 ? '#ff4d4f' : '#ff7a45',
                                  color: 'white',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  textAlign: 'center',
                                  animation: 'pulse 2s infinite'
                                }}>
                                  <ClockCircleOutlined /> Còn {contest.daysLeft} ngày để đăng ký!
                                </div>
                              )}
                            </>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            ) : activeFilters.status || activeFilters.category || activeFilters.club || activeFilters.search ? (
              <Alert
                message="Không tìm thấy cuộc thi sắp diễn ra"
                description="Không có cuộc thi nào sắp diễn ra phù hợp với bộ lọc hiện tại."
                type="info"
                showIcon
                style={{ marginBottom: 40 }}
              />
            ) : null}

            {/* All Contests Grid */}
            <Card
              title={
                <span>
                  <TrophyOutlined /> Tất cả cuộc thi
                </span>
              }
              extra={<Badge count={filteredContests.length} />}
            >
              {filteredContests.length > 0 ? (
                <ContestGrid contests={filteredContests} />
              ) : (
                <Empty
                  description="Không tìm thấy cuộc thi nào phù hợp với bộ lọc đã chọn."
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </div>
        </>
      )}

      {/* CSS custom cho carousel dots */}
      <style jsx global>{`
        .custom-carousel-dots li button {
          background: #ffffff50 !important;
          height: 8px !important;
          border-radius: 4px !important;
          transition: all 0.3s ease !important;
        }
        
        .custom-carousel-dots li.slick-active button {
          background: #ffffff !important;
          width: 20px !important;
        }
        
        .featured-carousel-card .ant-card-body {
          padding: 0;
        }
      `}</style>
    </div>
  );
}