'use client';

import {
    CalendarOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    GlobalOutlined,
    HomeOutlined,
    InstagramOutlined,
    LinkOutlined,
    MailOutlined,
    PhoneOutlined,
    TeamOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import {
    Alert,
    Avatar,
    Badge,
    Breadcrumb,
    Button,
    Card,
    Col,
    Collapse,
    Descriptions,
    Divider,
    Empty,
    Image,
    List,
    Rate,
    Row,
    Skeleton,
    Space,
    Statistic,
    Tag,
    Timeline,
    Typography
} from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

// Custom hook để fetch dữ liệu club
const useClub = (id) => {
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClub = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/clubs/${id}`);

                if (!response.ok) {
                    throw new Error('Không thể tải thông tin câu lạc bộ');
                }

                const data = await response.json();
                setClub(data);
            } catch (err) {
                console.error("Error fetching club:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchClub();
        }
    }, [id]);

    return { club, loading, error };
};

// Skeleton component for club detail
const ClubDetailSkeleton = () => (
    <div style={{ padding: '24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
                <Skeleton.Input style={{ width: 80 }} size="small" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Skeleton.Input style={{ width: 80 }} size="small" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Skeleton.Input style={{ width: 120 }} size="small" />
            </Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[24, 24]}>
            <Col xs={24}>
                <Skeleton.Image
                    style={{
                        width: '100%',
                        height: 300,
                        borderRadius: '8px'
                    }}
                />
            </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} md={16}>
                <Card>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {/* Header Skeleton */}
                        <div>
                            <Space align="center">
                                <Skeleton.Avatar size={64} />
                                <Skeleton.Input style={{ width: 300 }} size="large" />
                            </Space>
                            <Space wrap style={{ marginTop: 16 }}>
                                <Skeleton.Button size="small" style={{ width: 100 }} />
                                <Skeleton.Button size="small" style={{ width: 120 }} />
                            </Space>
                        </div>

                        <Divider />

                        {/* Description Skeleton */}
                        <div>
                            <Skeleton.Input style={{ width: 150, marginBottom: 16 }} />
                            <Skeleton paragraph={{ rows: 4 }} />
                        </div>

                        <Divider />

                        {/* Activities Skeleton */}
                        <Skeleton.Input style={{ width: 200, marginBottom: 16 }} />
                        <Skeleton active paragraph={{ rows: 4 }} />

                        <Divider />

                        {/* Achievements Skeleton */}
                        <Skeleton.Input style={{ width: 200, marginBottom: 16 }} />
                        <Skeleton active paragraph={{ rows: 4 }} />
                    </Space>
                </Card>
            </Col>

            {/* Sidebar Skeleton */}
            <Col xs={24} md={8}>
                <Card style={{ marginBottom: 24 }}>
                    <Skeleton.Input style={{ width: 150, marginBottom: 16 }} />
                    <Skeleton active paragraph={{ rows: 4 }} />
                </Card>

                <Card>
                    <Skeleton.Input style={{ width: 150, marginBottom: 16 }} />
                    <Skeleton active paragraph={{ rows: 3 }} />
                </Card>
            </Col>
        </Row>
    </div>
);

// Error page component
const ErrorPage = ({ title, message }) => (
    <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>{title}</Title>
        <Paragraph>{message}</Paragraph>
        <Button type="primary" href="/clubs">
            Quay lại danh sách CLB
        </Button>
    </div>
);

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

    // Legacy domains
    if (domainLower.includes('công nghệ')) return '💻';

    return '📚'; // Default
};

// Function to get color by domain
const getDomainColor = (domain) => {
    const domainLower = domain.toLowerCase();

    if (domainLower.includes('khoa học') || domainLower.includes('lý luận')) return '#722ed1'; // Purple
    if (domainLower.includes('kinh doanh') || domainLower.includes('khởi nghiệp')) return '#faad14'; // Gold
    if (domainLower.includes('ngôn ngữ')) return '#13c2c2'; // Cyan
    if (domainLower.includes('thể thao')) return '#a0d911'; // Lime
    if (domainLower.includes('truyền thông') || domainLower.includes('sự kiện')) return '#1890ff'; // Blue
    if (domainLower.includes('văn hóa') || domainLower.includes('nghệ thuật')) return '#eb2f96'; // Magenta
    if (domainLower.includes('xã hội') || domainLower.includes('tình nguyện')) return '#52c41a'; // Green

    // Legacy domains
    if (domainLower.includes('công nghệ')) return '#2f54eb'; // Geekblue

    return '#262626'; // Default
};

// Main component
export default function ClubDetailClient({ id }) {
    const { club, loading, error } = useClub(id);
    const [displayLoading, setDisplayLoading] = useState(true);

    useEffect(() => {
        // Minimum loading time for better UX
        const timer = setTimeout(() => {
            setDisplayLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    if (loading || displayLoading) {
        return <ClubDetailSkeleton />;
    }

    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    message="Lỗi"
                    description={`Không thể tải dữ liệu câu lạc bộ: ${error}`}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    if (!club) {
        return (
            <ErrorPage
                title="Không tìm thấy câu lạc bộ"
                message="Xin lỗi, câu lạc bộ bạn đang tìm kiếm không tồn tại."
            />
        );
    }

    const breadcrumbItems = [
        { title: <Link href="/"><HomeOutlined /> Trang chủ</Link> },
        { title: <Link href="/clubs">Câu lạc bộ</Link> },
        { title: club.name }
    ];

    // Get domain icon and color
    const domainIcon = getDomainIcon(club.domain);
    const domainColor = getDomainColor(club.domain);

    // Use background image or fallback
    const backgroundImage = club.coverImage || '/images/avt_placeholder.jpg';

    return (
        <div style={{ padding: '24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />

            {/* Hero Section with Logo and Background */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '350px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '40px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
            >
                {/* Background with overlay */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                    <div
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(0px)',
                            width: '100%',
                            height: '100%',
                            position: 'absolute'
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(${parseInt(domainColor.slice(1, 3), 16)}, ${parseInt(domainColor.slice(3, 5), 16)}, ${parseInt(domainColor.slice(5, 7), 16)}, 0.9))`,
                        }}
                    />
                </div>

                {/* Club info and logo */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        padding: '30px',
                        zIndex: 2,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '20px'
                    }}
                >
                    {/* Large Logo */}
                    <div
                        style={{
                            borderRadius: '50%',
                            overflow: 'hidden',
                            boxShadow: '0 0 0 6px rgba(255,255,255,0.2)',
                            border: '4px solid white',
                            width: '120px',
                            height: '120px',
                            flexShrink: 0
                        }}
                    >
                        <Image
                            src={club.logo || club.image || '/images/avt_placeholder.jpg'}
                            alt={club.name}
                            width={120}
                            height={120}
                            preview={false}
                            style={{ objectFit: 'cover' }}
                            fallback="/images/avt_placeholder.jpg"
                        />
                    </div>

                    {/* Club info */}
                    <div>
                        <Badge.Ribbon
                            text={club.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                            color={club.isActive ? 'green' : 'volcano'}
                            style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                right: '-40px'
                            }}
                        >
                            <Title
                                level={2}
                                style={{
                                    margin: 0,
                                    color: 'white',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                    maxWidth: '600px'
                                }}
                            >
                                {club.name}
                            </Title>
                        </Badge.Ribbon>

                        <Space size={[8, 8]} wrap style={{ marginTop: '16px' }}>
                            <Tag
                                color="blue"
                                icon={<span>{domainIcon}</span>}
                                style={{ padding: '4px 10px', fontSize: '14px' }}
                            >
                                {club.domain}
                            </Tag>

                            {club.personalityType && (
                                <Tag
                                    color="purple"
                                    style={{ padding: '4px 10px', fontSize: '14px' }}
                                >
                                    {club.personalityType}
                                </Tag>
                            )}

                            <Tag
                                icon={<TeamOutlined />}
                                color="gold"
                                style={{ padding: '4px 10px', fontSize: '14px' }}
                            >
                                {club.memberCount} thành viên
                            </Tag>

                            <Tag
                                style={{ padding: '4px 10px', fontSize: '14px' }}
                            >
                                <Rate disabled defaultValue={parseFloat(club.rating)} allowHalf style={{ fontSize: '14px' }} /> {club.rating}/5
                            </Tag>
                        </Space>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                    <Card>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            {/* Club Description */}
                            <div>
                                <Title level={4}>
                                    <TeamOutlined /> Giới thiệu
                                </Title>
                                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                    {club.summary}
                                </Paragraph>
                            </div>

                            <Divider />

                            {/* Club Activities */}
                            <div>
                                <Title level={4}>
                                    <CalendarOutlined /> Hoạt động thường xuyên
                                </Title>

                                {club.activities && club.activities.length > 0 ? (
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={club.activities}
                                        renderItem={activity => (
                                            <List.Item
                                                actions={[
                                                    <Tag color="blue" key="frequency">{activity.frequency}</Tag>
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar icon={<CalendarOutlined />} style={{ backgroundColor: domainColor }} />}
                                                    title={activity.name}
                                                    description={<><ClockCircleOutlined /> {activity.time}</>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <Empty description="Không có dữ liệu hoạt động" />
                                )}
                            </div>

                            <Divider />

                            {/* Club Achievements */}
                            <div>
                                <Title level={4}>
                                    <TrophyOutlined /> Thành tích nổi bật
                                </Title>

                                {club.achievements && club.achievements.length > 0 ? (
                                    <Timeline
                                        mode="left"
                                        items={club.achievements.map(achievement => ({
                                            label: achievement.year,
                                            color: 'gold',
                                            children: (
                                                <div>
                                                    <Text strong>{achievement.title}</Text>
                                                    <br />
                                                    <Text type="secondary">{achievement.description}</Text>
                                                </div>
                                            )
                                        }))}
                                    />
                                ) : (
                                    <Empty description="Không có dữ liệu thành tích" />
                                )}
                            </div>

                            {/* Club Contests */}
                            {club.contests && (
                                <>
                                    <Divider />
                                    <div>
                                        <Title level={4}>
                                            <TrophyOutlined /> Cuộc thi và chương trình
                                        </Title>
                                        <Card
                                            style={{
                                                backgroundColor: '#fffbe6',
                                                borderColor: '#ffe58f'
                                            }}
                                        >
                                            <Paragraph style={{ color: 'black', fontWeight: 'bold' }}>
                                                {club.contests}
                                            </Paragraph>
                                        </Card>
                                    </div>
                                </>
                            )}

                            {/* Club Feedback */}
                            {club.feedback && (
                                <>
                                    <Divider />
                                    <div>
                                        <Title level={4}>
                                            <TeamOutlined /> Phản hồi từ thành viên
                                        </Title>
                                        <Card
                                            style={{
                                                backgroundColor: '#f6ffed',
                                                borderColor: '#b7eb8f'
                                            }}
                                        >
                                            <Paragraph style={{ color: 'black', fontWeight: 'bold' }}>
                                                {club.feedback}
                                            </Paragraph>
                                        </Card>
                                    </div>
                                </>
                            )}
                        </Space>
                    </Card>
                </Col>

                {/* Sidebar */}
                <Col xs={24} md={8}>
                    {/* Club Stats */}
                    <Card
                        style={{
                            marginBottom: 24,
                            borderTop: `3px solid ${domainColor}`
                        }}
                    >
                        <Title level={4} style={{ marginTop: 0 }}>
                            <TeamOutlined /> Thông tin nhanh
                        </Title>

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic
                                    title="Thành viên"
                                    value={club.memberCount}
                                    prefix={<TeamOutlined style={{ color: domainColor }} />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Đánh giá"
                                    value={club.rating}
                                    prefix={<Rate disabled defaultValue={parseFloat(club.rating)} allowHalf count={1} style={{ color: domainColor }} />}
                                    suffix="/ 5"
                                />
                            </Col>
                        </Row>

                        {club.isActive && (
                            <div style={{ marginTop: 16 }}>
                                <Badge status="success" text="Đang hoạt động" style={{ fontSize: '16px' }} />
                            </div>
                        )}

                        <Divider />

                        <Descriptions column={1} size="small">
                            <Descriptions.Item label={<><EnvironmentOutlined /> Địa điểm</>}>
                                {club.location || 'Trụ sở FTU2'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><MailOutlined /> Email</>}>
                                {club.email || `club${club.id}@ftu.edu.vn`}
                            </Descriptions.Item>
                            {club.phone && (
                                <Descriptions.Item label={<><PhoneOutlined /> Điện thoại</>}>
                                    {club.phone}
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label={<><CalendarOutlined /> Thành lập</>}>
                                {club.foundedYear || 'Không rõ'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Social Links */}
                    <Card
                        style={{
                            marginBottom: 24,
                            borderTop: `3px solid ${domainColor}`
                        }}
                    >
                        <Title level={4} style={{ marginTop: 0 }}>
                            <LinkOutlined /> Liên kết
                        </Title>

                        <Space direction="vertical" style={{ width: '100%' }}>
                            {club.socialLinks?.facebook && (
                                <Button
                                    type="primary"
                                    icon={<FacebookOutlined />}
                                    href={club.socialLinks.facebook}
                                    target="_blank"
                                    block
                                    style={{ backgroundColor: '#1877F2' }}
                                >
                                    Facebook
                                </Button>
                            )}

                            {club.socialLinks?.instagram && (
                                <Button
                                    type="primary"
                                    icon={<InstagramOutlined />}
                                    href={club.socialLinks.instagram}
                                    target="_blank"
                                    block
                                    style={{ backgroundColor: '#E1306C' }}
                                >
                                    Instagram
                                </Button>
                            )}

                            {club.socialLinks?.website && (
                                <Button
                                    type="primary"
                                    icon={<GlobalOutlined />}
                                    href={club.socialLinks.website}
                                    target="_blank"
                                    block
                                    style={{ backgroundColor: '#52c41a' }}
                                >
                                    Website
                                </Button>
                            )}
                        </Space>
                    </Card>

                    {/* Image Gallery */}
                    {club.images && club.images.length > 0 && (
                        <Card
                            style={{
                                borderTop: `3px solid ${domainColor}`
                            }}
                        >
                            <Title level={4} style={{ marginTop: 0 }}>
                                <GlobalOutlined /> Hình ảnh hoạt động
                            </Title>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                {club.images.map((img, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            width: '100%',
                                            height: '120px',
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            border: '2px solid transparent',
                                            ":hover": {
                                                transform: 'scale(1.05)',
                                                border: `2px solid ${domainColor}`
                                            }
                                        }}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${club.name} - Hình ảnh ${index + 1}`}
                                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                            fallback="/images/avt_placeholder.jpg"
                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Add styles for pulse animation */}
            <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        
        .club-logo-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(255,255,255,0.5);
          transition: all 0.3s ease;
        }
        
        .club-gallery-item:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
      `}</style>
        </div>
    );
}