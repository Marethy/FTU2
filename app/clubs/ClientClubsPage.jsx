'use client';

import {
  AppstoreOutlined,
  BarsOutlined,
  BookOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  HomeOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Pagination,
  Rate,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Tag,
  Typography
} from 'antd';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

// Custom hook để fetch clubs
const useClubs = (filters) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        if (filters.domain) params.append('domain', filters.domain);
        if (filters.search) params.append('search', filters.search);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.offset) params.append('offset', filters.offset.toString());

        const url = `/api/clubs${params.toString() ? `?${params.toString()}` : ''}`;
        console.log('Fetching clubs from:', url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Không thể tải danh sách câu lạc bộ');
        }

        const data = await response.json();
        console.log('Fetched clubs data:', data);

        setClubs(data.clubs || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [filters.domain, filters.search, filters.limit, filters.offset]);

  return { clubs, loading, error, total };
};

// Club Card Component (for grid view)
const ClubCard = ({ club }) => {
  const domainIcon = getDomainIcon(club.domain);
  const domainColor = getDomainColor(club.domain);

  return (
    <Card
      hoverable
      style={{
        height: 580, // Fixed height
        marginBottom: 16,
        borderLeft: `4px solid ${domainColor}`,
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{
        padding: '16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 60, // Space for action button
      }}
      cover={
        <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
          <img
            alt={club.name}
            src={club.coverImage || club.image}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              e.target.src = '/images/avt_placeholder.jpg';
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '16px',
              padding: '4px 8px',
            }}
          >
            <Rate disabled defaultValue={parseFloat(club.rating)} allowHalf size="small" />
            <Text style={{ marginLeft: 4, fontSize: '12px' }}>{club.rating}</Text>
          </div>
        </div>
      }
    >
      {/* Card Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header with Avatar and Title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
          <img
            src={club.logo || club.image}
            alt={club.name}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              objectFit: 'cover',
              border: `2px solid ${domainColor}`,
              marginRight: 12,
              flexShrink: 0
            }}
            onError={(e) => {
              e.target.src = '/images/avt_placeholder.jpg';
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Title level={5} style={{ margin: 0, fontSize: '16px', lineHeight: '1.3' }} ellipsis={{ rows: 2 }}>
              {club.name}
            </Title>
            <Space wrap size={[4, 4]} style={{ marginTop: 4 }}>
              <Tag color={domainColor} style={{ margin: 0, fontSize: '11px' }}>
                <span>{domainIcon}</span> {club.domain}
              </Tag>
              {club.personalityType && (
                <Tag icon={<UserOutlined />} style={{ margin: 0, fontSize: '11px' }}>
                  {club.personalityType}
                </Tag>
              )}
            </Space>
          </div>
        </div>

        {/* Description */}
        <div style={{ flex: 1 }}>
          <Paragraph
            ellipsis={{ rows: 3 }}
            style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px', lineHeight: '1.4' }}
          >
            {club.summary}
          </Paragraph>

          {/* Stats */}
          <div style={{ marginBottom: 12 }}>
            <Space size={12} wrap>
              <span style={{ fontSize: '12px', color: '#999' }}>
                <TeamOutlined /> {club.memberCount} TV
              </span>
              <span style={{ fontSize: '12px', color: '#999' }}>
                <ClockCircleOutlined /> {club.foundedYear || 'N/A'}
              </span>
              {club.isActive && (
                <Tag color="green" size="small">Hoạt động</Tag>
              )}
            </Space>
          </div>

          {/* Recruitment and Volunteer Info */}
          {(club.recruitmentPeriod || club.volunteerActivities) && (
            <div style={{
              padding: '8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              fontSize: '11px'
            }}>
              {club.recruitmentPeriod && (
                <div style={{ color: '#666', marginBottom: club.volunteerActivities ? '4px' : 0 }}>
                  <BookOutlined /> <strong>Tuyển:</strong>
                  <Text ellipsis style={{ marginLeft: 4 }}>
                    {club.recruitmentPeriod}
                  </Text>
                </div>
              )}
              {club.volunteerActivities && (
                <div style={{ color: '#666' }}>
                  <HeartOutlined /> <strong>TN:</strong>
                  <Text ellipsis style={{ marginLeft: 4 }}>
                    {club.volunteerActivities}
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Button - Fixed at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
      }}>
        <Link href={`/clubs/${club.id}`}>
          <Button
            type="primary"
            block
            style={{
              backgroundColor: domainColor,
              borderColor: domainColor,
              height: 36
            }}
          >
            Xem chi tiết
          </Button>
        </Link>
      </div>
    </Card>
  );
};

// Custom hook để fetch domains
const useDomains = () => {
  const [domains, setDomains] = useState([]);
  const [domainSlugs, setDomainSlugs] = useState({});
  const [slugToName, setSlugToName] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch('/api/domains');
        if (!response.ok) throw new Error('Failed to fetch domains');

        const data = await response.json();
        console.log('Fetched domains data:', data);

        setDomains(data.domains || []);
        setDomainSlugs(data.domainSlugs || {});
        setSlugToName(data.slugToName || {});
      } catch (error) {
        console.error('Error fetching domains:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  return { domains, domainSlugs, slugToName, loading };
};

// Icon function for domain
const getDomainIcon = (domain) => {
  const domainLower = domain.toLowerCase();

  if (domainLower.includes('khoa học') || domainLower.includes('lý luận')) return '🔬';
  if (domainLower.includes('kinh doanh') || domainLower.includes('khởi nghiệp')) return '💼';
  if (domainLower.includes('ngôn ngữ')) return '🗣️';
  if (domainLower.includes('thể thao')) return '⚽';
  if (domainLower.includes('truyền thông') || domainLower.includes('sự kiện')) return '📢';
  if (domainLower.includes('văn hóa') || domainLower.includes('nghệ thuật')) return '🎭';
  if (domainLower.includes('xã hội') || domainLower.includes('tình nguyện')) return '🤝';

  return '📚'; // Default
};

// Function to get color by domain
const getDomainColor = (domain) => {
  const domainLower = domain.toLowerCase();

  if (domainLower.includes('khoa học') || domainLower.includes('lý luận')) return '#722ed1';
  if (domainLower.includes('kinh doanh') || domainLower.includes('khởi nghiệp')) return '#faad14';
  if (domainLower.includes('ngôn ngữ')) return '#13c2c2';
  if (domainLower.includes('thể thao')) return '#a0d911';
  if (domainLower.includes('truyền thông') || domainLower.includes('sự kiện')) return '#1890ff';
  if (domainLower.includes('văn hóa') || domainLower.includes('nghệ thuật')) return '#eb2f96';
  if (domainLower.includes('xã hội') || domainLower.includes('tình nguyện')) return '#52c41a';

  return '#262626'; // Default
};

// Skeleton component for club cards
const ClubCardSkeleton = () => (
  <Card style={{ marginBottom: 16 }}>
    <Skeleton loading={true} avatar active>
      <Meta
        avatar={<Skeleton.Avatar size="large" />}
        title={<Skeleton.Input style={{ width: 200 }} />}
        description={<Skeleton.Input style={{ width: 300 }} />}
      />
    </Skeleton>
  </Card>
);

// Club List Item Component (for list view)
const ClubListItem = ({ club }) => {
  const domainIcon = getDomainIcon(club.domain);
  const domainColor = getDomainColor(club.domain);

  return (
    <Card
      hoverable
      style={{
        marginBottom: 16,
        borderLeft: `4px solid ${domainColor}`,
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        {/* Club Logo */}
        <Col xs={24} sm={4} md={3}>
          <div style={{ textAlign: 'center' }}>
            <img
              src={club.logo || club.image}
              alt={club.name}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `2px solid ${domainColor}`
              }}
              onError={(e) => {
                e.target.src = '/images/avt_placeholder.jpg';
              }}
            />
          </div>
        </Col>

        {/* Club Info */}
        <Col xs={24} sm={20} md={16}>
          <div>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Title level={4} style={{ margin: 0 }}>
                {club.name}
              </Title>

              <Space wrap size={[4, 4]}>
                <Tag color={domainColor} style={{ margin: 0, fontSize: '12px' }}>
                  <span>{domainIcon}</span> {club.domain}
                </Tag>
                {club.personalityType && (
                  <Tag icon={<UserOutlined />} style={{ margin: 0, fontSize: '12px' }}>
                    {club.personalityType}
                  </Tag>
                )}
                {club.isActive && (
                  <Tag color="green" size="small">Đang hoạt động</Tag>
                )}
              </Space>

              <Paragraph
                ellipsis={{ rows: 2 }}
                style={{ margin: '8px 0', color: '#666' }}
              >
                {club.summary}
              </Paragraph>

              <Space size={16} wrap>
                <span style={{ fontSize: '14px', color: '#999' }}>
                  <TeamOutlined /> {club.memberCount} thành viên
                </span>
                <span style={{ fontSize: '14px', color: '#999' }}>
                  <Rate disabled defaultValue={parseFloat(club.rating)} allowHalf size="small" />
                  <Text style={{ marginLeft: 4 }}>{club.rating}</Text>
                </span>
                <span style={{ fontSize: '14px', color: '#999' }}>
                  <ClockCircleOutlined /> {club.foundedYear || 'N/A'}
                </span>
              </Space>
            </Space>
          </div>
        </Col>

        {/* Additional Info & Actions */}
        <Col xs={24} sm={24} md={5}>
          <div style={{ textAlign: 'right' }}>
            {(club.recruitmentPeriod || club.volunteerActivities) && (
              <div style={{ marginBottom: 12, padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                {club.recruitmentPeriod && (
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                    <BookOutlined /> <strong>Tuyển:</strong> {club.recruitmentPeriod}
                  </div>
                )}
                {club.volunteerActivities && (
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <HeartOutlined /> <strong>TN:</strong> {club.volunteerActivities}
                  </div>
                )}
              </div>
            )}

            <Link href={`/clubs/${club.id}`}>
              <Button
                type="primary"
                block
                style={{ backgroundColor: domainColor, borderColor: domainColor }}
              >
                Xem chi tiết
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default function ClientClubsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filters from URL
  const currentDomainSlug = searchParams.get('domain') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // State
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const [pageSize] = useState(12);
  const [sortBy, setSortBy] = useState('name'); // name, rating, status
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  // Calculate offset for pagination
  const offset = (currentPage - 1) * pageSize;

  // Fetch data
  const { domains, domainSlugs, slugToName, loading: domainsLoading } = useDomains();
  const { clubs, loading: clubsLoading, error, total } = useClubs({
    domain: currentDomainSlug,
    search: currentSearch,
    limit: pageSize,
    offset: offset
  });

  // Get current domain name from slug
  const currentDomainName = currentDomainSlug ? slugToName[currentDomainSlug] : '';

  // Update URL with new filters
  const updateFilters = useCallback((newFilters) => {
    const params = new URLSearchParams();

    if (newFilters.domain) params.set('domain', newFilters.domain);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.page && newFilters.page > 1) params.set('page', newFilters.page.toString());

    const newUrl = `/clubs${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
  }, [router]);

  // Handle domain filter change
  const handleDomainChange = (domainSlug) => {
    updateFilters({
      domain: domainSlug,
      search: currentSearch,
      page: 1 // Reset to first page when changing domain
    });
  };

  // Handle search
  const handleSearch = (searchValue) => {
    updateFilters({
      domain: currentDomainSlug,
      search: searchValue,
      page: 1 // Reset to first page when searching
    });
  };

  // Handle pagination
  const handlePageChange = (page) => {
    updateFilters({
      domain: currentDomainSlug,
      search: currentSearch,
      page: page
    });
  };

  // Sort clubs based on current sorting options
  const sortClubs = (clubs) => {
    if (!clubs || clubs.length === 0) return clubs;

    const sorted = [...clubs].sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name, 'vi');
          break;
        case 'rating':
          compareValue = parseFloat(b.rating) - parseFloat(a.rating); // Default desc for rating
          break;
        case 'status':
          compareValue = (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0); // Active first
          break;
        case 'members':
          compareValue = b.memberCount - a.memberCount; // Default desc for members
          break;
        default:
          return 0;
      }

      // Apply sort order
      if (sortBy === 'rating' || sortBy === 'members' || sortBy === 'status') {
        // For numeric and status, reverse if asc is requested
        return sortOrder === 'asc' ? -compareValue : compareValue;
      } else {
        // For name, normal order
        return sortOrder === 'asc' ? compareValue : -compareValue;
      }
    });

    return sorted;
  };

  // Apply sorting to clubs
  const sortedClubs = sortClubs(clubs);

  // Clear all filters
  const clearFilters = () => {
    setLocalSearch('');
    updateFilters({});
  };

  const breadcrumbItems = [
    { title: <Link href="/"><HomeOutlined /> Trang chủ</Link> },
    { title: 'Câu lạc bộ' }
  ];

  if (domainsLoading) {
    return (
      <div style={{ padding: '24px' }}>
        <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: '100px' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2}>
          Câu lạc bộ FTU
          {currentDomainName && (
            <span style={{ color: getDomainColor(currentDomainName), marginLeft: 8 }}>
              - {currentDomainName}
            </span>
          )}
        </Title>
        <Paragraph>
          Khám phá các câu lạc bộ đa dạng tại FTU, nơi bạn có thể phát triển kỹ năng và kết nối với bạn bè cùng sở thích.
        </Paragraph>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong>Lĩnh vực:</Text>
              <Select
                style={{ width: '100%', marginTop: 4 }}
                placeholder="Chọn lĩnh vực"
                value={currentDomainSlug || undefined}
                onChange={handleDomainChange}
                allowClear
              >
                {domains.map(domain => (
                  <Option key={domainSlugs[domain]} value={domainSlugs[domain]}>
                    <span>{getDomainIcon(domain)}</span> {domain}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong>Tìm kiếm:</Text>
              <Input.Search
                style={{ width: '100%', marginTop: 4 }}
                placeholder="Tìm kiếm câu lạc bộ..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onSearch={handleSearch}
                allowClear
              />
            </div>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <div>
              <Text strong>Sắp xếp:</Text>
              <Select
                style={{ width: '100%', marginTop: 4 }}
                value={sortBy}
                onChange={setSortBy}
              >
                <Option value="name">Tên CLB</Option>
                <Option value="rating">Đánh giá</Option>
                <Option value="members">Thành viên</Option>
                <Option value="status">Trạng thái</Option>
              </Select>
            </div>
          </Col>

          <Col xs={24} sm={12} md={3}>
            <div>
              <Text strong>Thứ tự:</Text>
              <Select
                style={{ width: '100%', marginTop: 4 }}
                value={sortOrder}
                onChange={setSortOrder}
              >
                <Option value="asc">
                  <SortAscendingOutlined /> {sortBy === 'name' ? 'A-Z' : 'Tăng dần'}
                </Option>
                <Option value="desc">
                  <SortDescendingOutlined /> {sortBy === 'name' ? 'Z-A' : 'Giảm dần'}
                </Option>
              </Select>
            </div>
          </Col>

          <Col xs={24} sm={12} md={3}>
            <div>
              <Text strong>Hiển thị:</Text>
              <div style={{ marginTop: 4 }}>
                <Space.Compact style={{ width: '100%' }}>
                  <Button
                    type={viewMode === 'grid' ? 'primary' : 'default'}
                    icon={<AppstoreOutlined />}
                    onClick={() => setViewMode('grid')}
                    style={{ width: '50%' }}
                  />
                  <Button
                    type={viewMode === 'list' ? 'primary' : 'default'}
                    icon={<BarsOutlined />}
                    onClick={() => setViewMode('list')}
                    style={{ width: '50%' }}
                  />
                </Space.Compact>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={2}>
            <div style={{ textAlign: 'right' }}>
              {(currentDomainSlug || currentSearch) && (
                <Button onClick={clearFilters} style={{ marginTop: 20 }}>
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* Active filters display */}
        {(currentDomainName || currentSearch) && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
            <Text type="secondary">Bộ lọc đang áp dụng: </Text>
            <Space wrap size={[8, 8]}>
              {currentDomainName && (
                <Tag
                  color={getDomainColor(currentDomainName)}
                  closable
                  onClose={() => handleDomainChange('')}
                >
                  <span>{getDomainIcon(currentDomainName)}</span> {currentDomainName}
                </Tag>
              )}
              {currentSearch && (
                <Tag
                  color="blue"
                  closable
                  onClose={() => handleSearch('')}
                >
                  <SearchOutlined /> "{currentSearch}"
                </Tag>
              )}
            </Space>
          </div>
        )}
      </Card>

      {/* Quick domain filter buttons */}
      {!currentDomainSlug && (
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>Lọc theo lĩnh vực:</Title>
          <Space wrap size={[8, 8]}>
            {domains.map(domain => (
              <Button
                key={domain}
                type="default"
                style={{
                  borderColor: getDomainColor(domain),
                  color: getDomainColor(domain),
                }}
                onClick={() => handleDomainChange(domainSlugs[domain])}
              >
                <span>{getDomainIcon(domain)}</span> {domain}
              </Button>
            ))}
          </Space>
        </div>
      )}

      {/* Error handling */}
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Results info */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text type="secondary">
            {clubsLoading ? 'Đang tải...' : `Tìm thấy ${clubs.length} câu lạc bộ`}
            {currentDomainName && ` trong lĩnh vực "${currentDomainName}"`}
            {currentSearch && ` với từ khóa "${currentSearch}"`}
          </Text>
          {!clubsLoading && clubs.length > 0 && (
            <Text type="secondary" style={{ marginLeft: 16 }}>
              • Sắp xếp theo {sortBy === 'name' ? 'tên' : sortBy === 'rating' ? 'đánh giá' : sortBy === 'members' ? 'số thành viên' : 'trạng thái'}
              ({sortOrder === 'asc' ? 'tăng dần' : 'giảm dần'})
            </Text>
          )}
        </div>

        {!clubsLoading && clubs.length > 0 && (
          <Text type="secondary">
            Trang {currentPage} / {Math.ceil(total / pageSize)} • Hiển thị {viewMode === 'grid' ? 'lưới' : 'danh sách'}
          </Text>
        )}
      </div>

      {/* Clubs Display */}
      {clubsLoading ? (
        <Row gutter={[16, 16]}>
          {[...Array(6)].map((_, index) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={index}>
              <ClubCardSkeleton />
            </Col>
          ))}
        </Row>
      ) : sortedClubs.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <Row gutter={[16, 16]}>
              {sortedClubs.map(club => (
                <Col xs={24} sm={12} lg={8} xl={6} key={club.id}>
                  <ClubCard club={club} />
                </Col>
              ))}
            </Row>
          ) : (
            <div>
              {sortedClubs.map(club => (
                <ClubListItem key={club.id} club={club} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > pageSize && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} của ${total} câu lạc bộ`
                }
              />
            </div>
          )}
        </>
      ) : (
        <Empty
          description={
            <div>
              <Text>Không tìm thấy câu lạc bộ nào</Text>
              {(currentDomainName || currentSearch) && (
                <div style={{ marginTop: 8 }}>
                  <Button type="primary" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>
          }
          style={{ marginTop: 48 }}
        />
      )}
    </div>
  );
}