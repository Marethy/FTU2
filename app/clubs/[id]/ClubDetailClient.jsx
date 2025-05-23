'use client';

import {
    ArrowLeftOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    GlobalOutlined,
    HeartOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    InstagramOutlined,
    LinkOutlined,
    MailOutlined,
    PhoneOutlined,
    TeamOutlined,
    TrophyOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Alert,
    Avatar,
    Badge,
    Breadcrumb,
    Button,
    Card,
    Col,
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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Paragraph, Text } = Typography;

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

                        <div>
                            <Skeleton.Input style={{ width: 150, marginBottom: 16 }} />
                            <Skeleton paragraph={{ rows: 4 }} />
                        </div>

                        <Divider />

                        <Skeleton.Input style={{ width: 200, marginBottom: 16 }} />
                        <Skeleton active paragraph={{ rows: 4 }} />

                        <Divider />

                        <Skeleton.Input style={{ width: 200, marginBottom: 16 }} />
                        <Skeleton active paragraph={{ rows: 4 }} />
                    </Space>
                </Card>
            </Col>

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

// Function to get personality type color
const getPersonalityColor = (personalityType) => {
    if (!personalityType) return '#8c8c8c';

    const type = personalityType.toLowerCase();
    if (type.includes('leader') || type.includes('lãnh đạo')) return '#ff4d4f';
    if (type.includes('creative') || type.includes('sáng tạo')) return '#722ed1';
    if (type.includes('social') || type.includes('xã hội')) return '#52c41a';
    if (type.includes('analytical') || type.includes('phân tích')) return '#1890ff';
    if (type.includes('practical') || type.includes('thực tế')) return '#faad14';

    return '#13c2c2'; // Default cyan
};

// Main component
export default function ClubDetailClient({ id }) {
    const router = useRouter();
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

    // Get domain icon and color
    const domainIcon = getDomainIcon(club.domain);
    const domainColor = getDomainColor(club.domain);
    const personalityColor = getPersonalityColor(club.personalityType);

    // Use background image or fallback
    const backgroundImage = club.coverImage || '/images/avt_placeholder.jpg';

    // Generate URL to clubs list with domain filter
    const clubsListUrl = getClubsUrlWithDomain(club.domain);

    const breadcrumbItems = [
        { title: <Link href="/"><HomeOutlined /> Trang chủ</Link> },
        { title: <Link href="/clubs">Câu lạc bộ</Link> },
        {
            title: <Link href={clubsListUrl}>
                <span>{domainIcon}</span> {club.domain}
            </Link>
        },
        { title: club.name }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />

            {/* Back button */}
            <div style={{ marginBottom: 16 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push(clubsListUrl)}
                    style={{ borderColor: domainColor, color: domainColor }}
                >
                    Quay lại danh sách {club.domain}
                </Button>
            </div>

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
                            {/* Display primary domain */}
                            <Tag
                                color="blue"
                                icon={<span>{domainIcon}</span>}
                                style={{ padding: '4px 10px', fontSize: '14px' }}
                            >
                                {club.domain}
                            </Tag>

                            {/* Display additional categories if available */}
                            {club.categories && club.categories.length > 1 && (
                                club.categories.slice(1).map((category, index) => (
                                    <Tag
                                        key={index}
                                        color="cyan"
                                        icon={<span>{getDomainIcon(category)}</span>}
                                        style={{ padding: '4px 10px', fontSize: '14px' }}
                                        onClick={() => router.push(getClubsUrlWithDomain(category))}
                                        className="clickable-tag"
                                    >
                                        {category}
                                    </Tag>
                                ))
                            )}

                            {club.personalityType && (
                                <Tag
                                    color="purple"
                                    icon={<UserOutlined />}
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

                            {/* Recruitment Period */}
                            {club.recruitmentPeriod && (
                                <>
                                    <div>
                                        <Title level={4}>
                                            <CalendarOutlined /> Kỳ tuyển thành viên
                                        </Title>
                                        <Card
                                            style={{
                                                backgroundColor: '#e6f7ff',
                                                borderColor: '#91d5ff'
                                            }}
                                        >
                                            <Paragraph style={{ color: 'black', fontWeight: 'bold', margin: 0 }}>
                                                {club.recruitmentPeriod}
                                            </Paragraph>
                                        </Card>
                                    </div>
                                    <Divider />
                                </>
                            )}

                            {/* Volunteer Activities */}
                            {club.volunteerActivities && (
                                <>
                                    <div>
                                        <Title level={4}>
                                            <HeartOutlined /> Hoạt động tình nguyện
                                        </Title>
                                        <Card
                                            style={{
                                                backgroundColor: '#f6ffed',
                                                borderColor: '#b7eb8f'
                                            }}
                                        >
                                            <Paragraph style={{ color: 'black', fontWeight: 'bold', margin: 0 }}>
                                                {club.volunteerActivities}
                                            </Paragraph>
                                        </Card>
                                    </div>
                                    <Divider />
                                </>
                            )}

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

                            {/* Additional Notes */}
                            {club.notes && (
                                <>
                                    <Divider />
                                    <div>
                                        <Title level={4}>
                                            <InfoCircleOutlined /> Ghi chú
                                        </Title>
                                        <Card
                                            style={{
                                                backgroundColor: '#fff7e6',
                                                borderColor: '#ffd591'
                                            }}
                                        >
                                            <Paragraph style={{ color: 'black', fontWeight: 'bold', margin: 0 }}>
                                                {club.notes}
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
                            {club.personalityType && (
                                <Descriptions.Item label={<><UserOutlined /> Nhóm tính cách</>}>
                                    <Tag color={personalityColor} style={{ margin: 0 }}>
                                        {club.personalityType}
                                    </Tag>
                                </Descriptions.Item>
                            )}
                            {club.categories && club.categories.length > 0 && (
                                <Descriptions.Item label={<><TeamOutlined /> Tất cả lĩnh vực</>}>
                                    <Space wrap size={[4, 4]}>
                                        {club.categories.map((category, index) => (
                                            <Tag
                                                key={index}
                                                color={index === 0 ? getDomainColor(category) : 'cyan'}
                                                style={{ margin: 0, cursor: 'pointer' }}
                                                onClick={() => router.push(getClubsUrlWithDomain(category))}
                                                className="clickable-tag"
                                            >
                                                <span>{getDomainIcon(category)}</span> {category}
                                            </Tag>
                                        ))}
                                    </Space>
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </Card>

                    {/* Recruitment and Volunteer Info Card */}
                    {(club.recruitmentPeriod || club.volunteerActivities) && (
                        <Card
                            style={{
                                marginBottom: 24,
                                borderTop: `3px solid ${domainColor}`
                            }}
                        >
                            <Title level={4} style={{ marginTop: 0 }}>
                                <CalendarOutlined /> Thông tin tuyển dụng & TN
                            </Title>

                            {club.recruitmentPeriod && (
                                <div style={{ marginBottom: 16 }}>
                                    <Text strong style={{ color: domainColor }}>
                                        <CalendarOutlined /> Kỳ tuyển thành viên:
                                    </Text>
                                    <br />
                                    <Text>{club.recruitmentPeriod}</Text>
                                </div>
                            )}

                            {club.volunteerActivities && (
                                <div>
                                    <Text strong style={{ color: domainColor }}>
                                        <HeartOutlined /> Hoạt động tình nguyện:
                                    </Text>
                                    <br />
                                    <Text>{club.volunteerActivities}</Text>
                                </div>
                            )}
                        </Card>
                    )}

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
                                        }}
                                        className="club-gallery-item"
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

            {/* Add styles for interactions */}
            <style jsx global>{`
                .clickable-tag {
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .clickable-tag:hover {
                    transform: scale(1.05);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }
                
                .club-gallery-item:hover {
                    transform: scale(1.05);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    border-color: ${domainColor} !important;
                }
            `}</style>
        </div>
    );
}