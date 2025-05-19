'use client';

import ClubAvatar from '@/components/ClubAvatar';
import { useMessage } from '@/hooks/useMessage';
import styles from '@/styles/ClubsPage.module.css';
import {
  AppstoreOutlined,
  BarsOutlined,
  BookOutlined,
  CalendarOutlined,
  HomeOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  StarOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  Image,
  Input,
  Rate,
  Row,
  Segmented,
  Select,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography
} from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  }
};

export default function ClientClubsPage({ searchParams }) {
  const router = useRouter();
  const domainParam = searchParams?.domain;
  const message = useMessage();

  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [domains, setDomains] = useState([]);
  const [domainSlugs, setDomainSlugs] = useState({});
  const [slugToName, setSlugToName] = useState({});
  const [domainIcons, setDomainIcons] = useState({});
  const [stats, setStats] = useState({
    totalClubs: 0,
    activeClubs: 0,
    avgRating: 0,
    totalMembers: 0
  });

  // Function to fetch domains from the API
  const fetchDomains = async () => {
    try {
      const res = await fetch('/api/domains', { cache: 'no-store' });
      const data = await res.json();

      if (res.ok) {
        setDomains(data.domains || []);
        setDomainSlugs(data.domainSlugs || {});
        setSlugToName(data.slugToName || {});

        // Generate domain icons based on domains
        generateDomainIcons(data.domains || []);
      }
    } catch (error) {
      console.error('Error fetching domains:', error);
      message.error('Không thể tải dữ liệu về các lĩnh vực');
    }
  };

  // Generate domain icons programmatically
  const generateDomainIcons = (domainsList) => {
    const icons = {};

    // Helper function to get emoji for domain based on keywords
    const getEmojiForDomain = (domain) => {
      const domainLower = domain.toLowerCase();

      if (domainLower.includes('khoa học') || domainLower.includes('lý luận')) return '🔬';
      if (domainLower.includes('kinh doanh') || domainLower.includes('khởi nghiệp')) return '💼';
      if (domainLower.includes('ngôn ngữ')) return '🗣️';
      if (domainLower.includes('thể thao')) return '⚽';
      if (domainLower.includes('truyền thông') || domainLower.includes('sự kiện')) return '📢';
      if (domainLower.includes('văn hóa') || domainLower.includes('nghệ thuật')) return '🎭';
      if (domainLower.includes('xã hội') || domainLower.includes('tình nguyện')) return '🤝';

      // Legacy domain icons for backward compatibility
      if (domainLower.includes('công nghệ')) return '💻';
      if (domainLower.includes('nghệ thuật')) return '🎨';

      return '📚'; // Default icon
    };

    // Assign an emoji to each domain
    domainsList.forEach(domain => {
      icons[domain] = getEmojiForDomain(domain);
    });

    // Add default for 'Khác' category
    icons['Khác'] = '📚';

    setDomainIcons(icons);
  };

  useEffect(() => {
    // Check if we have a domain parameter in the URL
    if (domainParam && slugToName[domainParam]) {
      setSelectedDomain(slugToName[domainParam]);
    }
  }, [domainParam, slugToName]);

  useEffect(() => {
    // Fetch domains first, then clubs
    const loadData = async () => {
      await fetchDomains();
      await fetchClubs();
    };

    loadData();
  }, []);

  useEffect(() => {
    filterAndSortClubs();
  }, [clubs, searchText, selectedDomain, sortBy]);

  useEffect(() => {
    // Calculate statistics
    if (clubs.length > 0) {
      const activeClubs = clubs.filter(club => club.isActive).length;
      const avgRating = (clubs.reduce((sum, club) => sum + parseFloat(club.rating), 0) / clubs.length).toFixed(1);
      const totalMembers = clubs.reduce((sum, club) => sum + club.memberCount, 0);

      setStats({
        totalClubs: clubs.length,
        activeClubs,
        avgRating,
        totalMembers
      });
    }
  }, [clubs]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clubs', { cache: 'no-store' });
      const data = await res.json();

      if (res.ok && data.clubs) {
        setClubs(data.clubs);
        setFilteredClubs(data.clubs);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
      message.error('Không thể tải dữ liệu câu lạc bộ');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortClubs = () => {
    let filtered = [...clubs];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(club =>
        club.name.toLowerCase().includes(searchText.toLowerCase()) ||
        club.summary.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Domain filter
    if (selectedDomain && selectedDomain !== null) {
      filtered = filtered.filter(club => {
        // Handle clubs with multiple domains (separated by /)
        if (club.domain.includes('/')) {
          const clubDomains = club.domain.split('/').map(d => d.trim());
          return clubDomains.includes(selectedDomain);
        }
        return club.domain === selectedDomain;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating);
        case 'members':
          return b.memberCount - a.memberCount;
        case 'active':
          return (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0);
        default:
          return 0;
      }
    });

    console.log('Filtered clubs:', filtered.length); // Debug log
    setFilteredClubs(filtered);
  };

  const handleDomainSelect = (domain) => {
    const params = new URLSearchParams(searchParams || "");

    if (domain === null) {
      params.delete('domain');
      setSelectedDomain(null);
    } else {
      const slug = domainSlugs[domain];
      if (slug) {
        params.set('domain', slug);
      }
      setSelectedDomain(domain);
    }

    router.push(`/clubs?${params.toString()}`);
  };

  // Function to get days left until event (for activities that have deadlines)
  const getDaysLeft = (club) => {
    if (!club.activities || !Array.isArray(club.activities)) return null;

    // Find activities with upcoming deadlines
    const now = new Date();
    const upcomingActivities = club.activities
      .filter(activity => {
        if (!activity.date) return false;
        const activityDate = new Date(activity.date);
        const daysLeft = Math.ceil((activityDate - now) / (1000 * 60 * 60 * 24));
        return daysLeft > 0 && daysLeft <= 5; // Only show countdown for events within 5 days
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcomingActivities.length === 0) return null;

    // Return the most urgent activity
    const nextActivity = upcomingActivities[0];
    const activityDate = new Date(nextActivity.date);
    const daysLeft = Math.ceil((activityDate - now) / (1000 * 60 * 60 * 24));

    return {
      name: nextActivity.name,
      daysLeft: daysLeft
    };
  };

  const ClubCard = ({ club, index }) => {
    const upcomingActivity = getDaysLeft(club);

    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        layout
        className={styles.cardWrapper}
      >
        <Link href={`/clubs/${club.id}`}>
          <Card
            hoverable
            className={styles.clubCard}
            cover={
              <div className={styles.cardCover}>
                {club.coverImage || club.image ? (
                  <Image
                    alt={club.name}
                    src={club.coverImage || club.image}
                    className={styles.coverImage}
                    fallback="/images/avt_placeholder.jpg"
                    height={200}
                    width="100%"
                    style={{ objectFit: 'cover' }}
                    preview={false}
                  />
                ) : (
                  <div className={styles.placeholderCover}>
                    <ClubAvatar
                      name={club.name}
                      image={club.logo}
                      domain={club.domain}
                      size={80}
                    />
                    <Text className={styles.clubNameOverlay}>{club.name}</Text>
                  </div>
                )}
                <div className={styles.cardOverlay}>
                  {club.isActive && (
                    <Badge
                      status="success"
                      text={<span style={{ color: '#52c41a', fontWeight: 500 }}>Đang hoạt động</span>}
                      className={styles.activeBadge}
                    />
                  )}
                  <Tag
                    color="blue"
                    className={styles.domainTag}
                    icon={<span>{domainIcons[club.domain] || domainIcons['Khác']}</span>}
                  >
                    {club.domain}
                  </Tag>

                  {/* Add countdown for upcoming activity */}
                  {upcomingActivity && (
                    <Tag
                      color={upcomingActivity.daysLeft <= 2 ? "red" : "orange"}
                      className={styles.countdownTag}
                      icon={<CalendarOutlined />}
                      style={{
                        animation: upcomingActivity.daysLeft <= 2 ? 'pulse 2s infinite' : 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      {upcomingActivity.name}: còn {upcomingActivity.daysLeft} ngày
                    </Tag>
                  )}
                </div>
              </div>
            }
          >
            <Meta
              avatar={
                <ClubAvatar
                  name={club.name}
                  image={club.logo || club.image}
                  domain={club.domain}
                  size={40}
                />
              }
              title={
                <div className={styles.clubTitleWrapper}>
                  <Text strong className={styles.clubTitle} title={club.name}>
                    {club.name}
                  </Text>
                </div>
              }
              description={
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  className={styles.clubSummary}
                  title={club.summary}
                >
                  {club.summary}
                </Paragraph>
              }
            />

            <div className={styles.cardStats}>
              <div className={styles.statItem}>
                <TeamOutlined />
                <Text className={styles.statText}>{club.memberCount} <span style={{ fontSize: '0.8rem' }}>thành viên</span></Text>
              </div>
              <div className={styles.statItem}>
                <Rate
                  disabled
                  defaultValue={parseFloat(club.rating)}
                  allowHalf
                  className={styles.rateSmall}
                />
                <Text className={styles.statText}>{club.rating}</Text>
              </div>
            </div>

            {club.contests && (
              <div className={styles.cardExtra}>
                <TrophyOutlined />
                <Text className={styles.extraText} ellipsis>
                  {club.contests.split(',')[0]}...
                </Text>
              </div>
            )}
          </Card>
        </Link>
      </motion.div>
    )
  };

  const ClubListItem = ({ club }) => {
    const upcomingActivity = getDaysLeft(club);

    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        layout
        className={styles.listItemWrapper}
      >
        <Link href={`/clubs/${club.id}`}>
          <Card className={styles.listCard}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={6} md={4}>
                {club.coverImage || club.image ? (
                  <Image
                    alt={club.name}
                    src={club.coverImage || club.image}
                    className={styles.listImage}
                    fallback="/images/avt_placeholder.jpg"
                    width="100%"
                    height={120}
                    style={{ objectFit: 'cover' }}
                    preview={false}
                  />
                ) : (
                  <div className={styles.listPlaceholder}>
                    <ClubAvatar
                      name={club.name}
                      image={club.logo}
                      domain={club.domain}
                      size={60}
                    />
                  </div>
                )}
              </Col>
              <Col xs={24} sm={18} md={20}>
                <div className={styles.listContent}>
                  <div className={styles.listHeader}>
                    <Space align="center">
                      <ClubAvatar
                        name={club.name}
                        image={club.logo || club.image}
                        domain={club.domain}
                        size={32}
                      />
                      <Title level={4} className={styles.listTitle}>
                        {club.name}
                      </Title>
                    </Space>
                    <Space>
                      <Tag
                        color="blue"
                        icon={<span>{domainIcons[club.domain] || domainIcons['Khác']}</span>}
                      >
                        {club.domain}
                      </Tag>
                      {club.isActive && (
                        <Badge
                          status="success"
                          text={<span style={{ color: '#52c41a', fontWeight: 500 }}>Đang hoạt động</span>}
                        />
                      )}

                      {/* Add countdown tag in list view */}
                      {upcomingActivity && (
                        <Tag
                          color={upcomingActivity.daysLeft <= 2 ? "red" : "orange"}
                          icon={<CalendarOutlined />}
                          style={{
                            animation: upcomingActivity.daysLeft <= 2 ? 'pulse 2s infinite' : 'none',
                            fontWeight: 'bold'
                          }}
                        >
                          {upcomingActivity.name}: còn {upcomingActivity.daysLeft} ngày
                        </Tag>
                      )}
                    </Space>
                  </div>
                  <Paragraph ellipsis={{ rows: 2 }} className={styles.listSummary}>
                    {club.summary}
                  </Paragraph>
                  <div className={styles.listStats}>
                    <div className={styles.listStatItem}>
                      <TeamOutlined />
                      <Text>{club.memberCount} thành viên</Text>
                    </div>
                    <div className={styles.listStatItem}>
                      <Rate disabled defaultValue={parseFloat(club.rating)} allowHalf className={styles.rateSmall} />
                      <Text>{club.rating}</Text>
                    </div>
                    {club.contests && (
                      <div className={styles.listStatItem}>
                        <TrophyOutlined />
                        <Text ellipsis className={styles.contestText}>{club.contests.split(',')[0]}</Text>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Link>
      </motion.div>
    )
  };

  const breadcrumbItems = [
    { title: <Link href="/"><HomeOutlined /> Trang chủ</Link> },
    { title: selectedDomain ? `Câu lạc bộ - ${selectedDomain}` : 'Câu lạc bộ' }
  ];

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />

        {/* Page Header Skeleton */}
        <div className={styles.pageHeader}>
          <Skeleton.Input active style={{ width: 200, height: 40 }} />
          <Skeleton active paragraph={{ rows: 1, width: '60%' }} style={{ marginTop: 16 }} />
        </div>

        {/* Statistics Skeleton */}
        <Row gutter={[16, 16]} className={styles.statsSection}>
          {[...Array(4)].map((_, index) => (
            <Col key={index} xs={12} sm={6}>
              <Card className={styles.statCard}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Domain Filter Skeleton */}
        <Card className={styles.domainFilter}>
          <Space wrap size={[8, 8]}>
            {[...Array(8)].map((_, index) => (
              <Skeleton.Button key={index} active style={{ width: 100 }} />
            ))}
          </Space>
        </Card>

        {/* Filter Card Skeleton */}
        <Card className={styles.filterCard}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Skeleton.Input active style={{ width: '100%' }} size="large" />
            </Col>
            <Col xs={12} md={6}>
              <Skeleton.Input active style={{ width: '100%' }} size="large" />
            </Col>
            <Col xs={12} md={6}>
              <Skeleton.Button active style={{ width: '100%' }} size="large" />
            </Col>
          </Row>
        </Card>

        {/* Clubs List Skeleton */}
        <Row gutter={[16, 16]} className={styles.clubsContainer}>
          {[...Array(8)].map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card className={styles.clubCard}>
                <Skeleton.Image active style={{ width: '100%', height: 200 }} />
                <Skeleton
                  active
                  avatar
                  paragraph={{ rows: 3 }}
                  className={styles.cardSkeleton}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          <TeamOutlined /> Câu lạc bộ FTU
        </Title>
        <Paragraph className={styles.pageDescription}>
          Khám phá các câu lạc bộ đa dạng tại trường, nơi bạn có thể phát triển kỹ năng và kết nối với bạn bè cùng sở thích
        </Paragraph>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className={styles.statsSection}>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Tổng số CLB"
              value={stats.totalClubs}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={`${styles.statCard} ${styles.activeClubsCard}`}>
            <Statistic
              title="Đang hoạt động"
              value={stats.activeClubs}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#52c41a' }}
              className={styles.activeClubsStat}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Tổng thành viên"
              value={stats.totalMembers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Đánh giá TB"
              value={stats.avgRating}
              prefix={<StarOutlined />}
              suffix="/ 5"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Domain Quick Filter - với URL update */}
      <Card className={styles.domainFilter}>
        <Space wrap size={[8, 8]}>
          <Button
            type={selectedDomain === null ? 'primary' : 'default'}
            onClick={() => handleDomainSelect(null)}
            icon={<BookOutlined />}
          >
            Tất cả
          </Button>
          {domains.map(domain => (
            <Button
              key={domain}
              type={selectedDomain === domain ? 'primary' : 'default'}
              onClick={() => handleDomainSelect(domain)}
              icon={<span>{domainIcons[domain] || domainIcons['Khác']}</span>}
            >
              {domain}
            </Button>
          ))}
        </Space>
      </Card>

      {/* Filters and Search */}
      <Card className={styles.filterCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Input
              placeholder="Tìm kiếm câu lạc bộ..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
              allowClear
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="Sắp xếp theo"
              style={{ width: '100%' }}
              value={sortBy}
              onChange={setSortBy}
              size="large"
              suffixIcon={<SortAscendingOutlined />}
            >
              <Option value="name">Tên CLB</Option>
              <Option value="rating">Đánh giá</Option>
              <Option value="members">Số thành viên</Option>
              <Option value="active">Trạng thái</Option>
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Segmented
              options={[
                { label: <AppstoreOutlined />, value: 'grid' },
                { label: <BarsOutlined />, value: 'list' },
              ]}
              value={viewMode}
              onChange={setViewMode}
              size="large"
              block
            />
          </Col>
        </Row>
      </Card>

      {/* Clubs List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={styles.clubsContainer}
      >
        {filteredClubs.length === 0 ? (
          <Empty
            description="Không tìm thấy câu lạc bộ nào"
            className={styles.emptyState}
          />
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <Row gutter={[16, 16]}>
                {filteredClubs.map((club, index) => (
                  <Col
                    key={`${club.id}-${index}`}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <ClubCard club={club} index={index} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {filteredClubs.map((club, index) => (
                  <ClubListItem key={`${club.id}-${index}`} club={club} />
                ))}
              </Space>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Add styles for pulse animation */}
      <style jsx global>{`
          @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.6; }
              100% { opacity: 1; }
          }
          
          .countdownTag {
              margin-top: 8px;
          }
      `}</style>
    </div>
  );
}