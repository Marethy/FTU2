'use client'

import ClubAvatar from '@/components/ClubAvatar';
import ClubDetailSkeleton from '@/components/ClubDetailSkeleton';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useMessage } from '@/hooks/useMessage';
import styles from '@/styles/ClubDetail.module.css';
import {
    CalendarOutlined,
    CheckCircleOutlined, ClockCircleOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    GlobalOutlined,
    HeartOutlined,
    HomeOutlined,
    InstagramOutlined,
    LinkOutlined,
    MailOutlined,
    PhoneOutlined,
    ScheduleOutlined,
    ShareAltOutlined,
    StarOutlined,
    TeamOutlined,
    TrophyOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import {
    Alert,
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Empty,
    List,
    Modal,
    Rate,
    Row,
    Space,
    Statistic,
    Tabs,
    Tag,
    Timeline,
    Tooltip,
    Typography
} from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const { Title, Paragraph, Text } = Typography;

export default function ClubDetailClient({ id }) {
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('1');
    const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const message = useMessage();

    useEffect(() => {
        fetchClub();
    }, [id]);

    const fetchClub = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/clubs/${id}`);

            if (!res.ok) {
                throw new Error('Failed to fetch club data');
            }

            const data = await res.json();
            setClub(data);
        } catch (error) {
            console.error('Error fetching club:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClick = () => {
        setIsJoinModalVisible(true);
    };

    const handleJoinConfirm = () => {
        setIsJoinModalVisible(false);
        message.success('Yêu cầu tham gia đã được gửi!');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: club.name,
                text: club.summary,
                url: window.location.href,
            });
        } else {
            message.info('Đã sao chép link vào clipboard!');
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        message.success(isFavorite ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích');
    };

    const breadcrumbItems = [
        { title: <Link href="/"><HomeOutlined /> Trang chủ</Link> },
        { title: <Link href="/clubs">Câu lạc bộ</Link> },
        { title: loading ? 'Đang tải...' : club?.name }
    ];

    // Tab items for the new Tabs API
    const tabItems = [
        {
            key: '1',
            label: 'Tổng quan',
            children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Title level={4}>Giới thiệu</Title>
                        <Paragraph className={styles.description}>
                            {club?.summary}
                        </Paragraph>
                    </div>

                    <Divider />

                    <div>
                        <Title level={4}>Thông tin liên hệ</Title>
                        <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                            <Descriptions.Item label={<><MailOutlined /> Email</>}>
                                <a href={`mailto:${club?.email}`}>{club?.email}</a>
                            </Descriptions.Item>
                            <Descriptions.Item label={<><PhoneOutlined /> Điện thoại</>}>
                                <a href={`tel:${club?.phone}`}>{club?.phone}</a>
                            </Descriptions.Item>
                            <Descriptions.Item label={<><EnvironmentOutlined /> Địa điểm</>}>
                                {club?.location}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><LinkOutlined /> Liên kết</>}>
                                <Space>
                                    {club?.socialLinks?.facebook && (
                                        <Tooltip title="Facebook">
                                            <a href={club.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                                                <FacebookOutlined style={{ fontSize: 18 }} />
                                            </a>
                                        </Tooltip>
                                    )}
                                    {club?.socialLinks?.instagram && (
                                        <Tooltip title="Instagram">
                                            <a href={club.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                                <InstagramOutlined style={{ fontSize: 18 }} />
                                            </a>
                                        </Tooltip>
                                    )}
                                    {club?.socialLinks?.website && (
                                        <Tooltip title="Website">
                                            <a href={club.socialLinks.website} target="_blank" rel="noopener noreferrer">
                                                <GlobalOutlined style={{ fontSize: 18 }} />
                                            </a>
                                        </Tooltip>
                                    )}
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    <Divider />

                    <div>
                        <Title level={4}>Đánh giá</Title>
                        <div className={styles.ratingSection}>
                            <Rate disabled defaultValue={parseFloat(club?.rating || 0)} allowHalf />
                            <Text strong className={styles.ratingText}>{club?.rating}/5</Text>
                            <Text type="secondary">({Math.floor(Math.random() * 50 + 10)} đánh giá)</Text>
                        </div>
                    </div>
                </Space>
            )
        },
        {
            key: '2',
            label: 'Hoạt động',
            children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Title level={4}>Lịch hoạt động</Title>
                        {club?.activities && club.activities.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={club.activities}
                                renderItem={item => (
                                    <List.Item className={styles.activityItem}>
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<ScheduleOutlined />} />}
                                            title={<Text strong>{item.name}</Text>}
                                            description={
                                                <Space direction="vertical" size={0}>
                                                    <Text type="secondary">{item.frequency}</Text>
                                                    <Text><ClockCircleOutlined /> {item.time}</Text>
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty description="Chưa có hoạt động nào" />
                        )}
                    </div>
                </Space>
            )
        },
        {
            key: '3',
            label: 'Cuộc thi & Chương trình',
            children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Title level={4}>Cuộc thi và Chương trình</Title>
                        <Paragraph className={styles.contestsContent}>
                            {club?.contests || 'Chưa có thông tin về cuộc thi và chương trình.'}
                        </Paragraph>
                    </div>
                </Space>
            )
        },
        {
            key: '4',
            label: 'Thành tích',
            children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Title level={4}>Thành tích nổi bật</Title>
                        {club?.achievements && club.achievements.length > 0 ? (
                            <Timeline
                                items={club.achievements.map((achievement, index) => ({
                                    dot: <TrophyOutlined style={{ fontSize: 16 }} />,
                                    color: "gold",
                                    children: (
                                        <>
                                            <Text strong>{achievement.year}</Text> - {achievement.title}
                                            <br />
                                            <Text type="secondary">{achievement.description}</Text>
                                        </>
                                    )
                                }))}
                            />
                        ) : (
                            <Empty description="Chưa có thành tích nào" />
                        )}
                    </div>
                </Space>
            )
        },
        {
            key: '5',
            label: 'Phản hồi',
            children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Title level={4}>Phản hồi từ thành viên</Title>
                        <Paragraph className={styles.feedbackContent}>
                            {club?.feedback || 'Chưa có phản hồi từ thành viên.'}
                        </Paragraph>
                    </div>
                </Space>
            )
        }
    ];

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div
                    key="skeleton"
                    className={styles.pageContainer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />
                    <ClubDetailSkeleton />
                </motion.div>
            ) : error || !club ? (
                <motion.div
                    key="error"
                    className={styles.pageContainer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />
                    <Card className={styles.mainCard}>
                        <Alert
                            message="Không tìm thấy câu lạc bộ"
                            description="Câu lạc bộ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
                            type="error"
                            showIcon
                            action={
                                <Space>
                                    <Button onClick={() => window.location.reload()}>
                                        Thử lại
                                    </Button>
                                    <Link href="/clubs">
                                        <Button type="primary">Quay lại danh sách</Button>
                                    </Link>
                                </Space>
                            }
                        />
                    </Card>
                </motion.div>
            ) : (
                <motion.div
                    key="content"
                    className={styles.pageContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />

                    {/* Hero Section */}
                    <Card className={styles.heroCard} styles={{ body: { padding: 0 } }}>
                        <div className={styles.heroContainer}>
                            <ImageWithFallback
                                src={club.coverImage}
                                alt={club.name}
                                className={styles.coverImage}
                                fallbackSrc="/images/placeholder.svg"
                                width="100%"
                                height={400}
                                objectFit="cover"
                            />
                            <div className={styles.heroOverlay}>
                                <div className={styles.heroContent}>
                                    <ClubAvatar
                                        name={club.name}
                                        image={club.image}
                                        domain={club.domain}
                                        size={120}
                                        className={styles.clubAvatar}
                                    />
                                    <div className={styles.heroInfo}>
                                        <Title level={1} className={styles.clubName}>
                                            {club.name}
                                        </Title>
                                        <Space className={styles.heroTags}>
                                            <Tag color="blue" icon={<EnvironmentOutlined />}>
                                                {club.domain}
                                            </Tag>
                                            {club.isActive ? (
                                                <Tag color="success" icon={<CheckCircleOutlined />}>
                                                    Đang hoạt động
                                                </Tag>
                                            ) : (
                                                <Tag color="default" icon={<ClockCircleOutlined />}>
                                                    Tạm ngưng
                                                </Tag>
                                            )}
                                            <Tag icon={<CalendarOutlined />}>
                                                Thành lập {club.foundedYear}
                                            </Tag>
                                        </Space>
                                    </div>
                                    <div className={styles.heroActions}>
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<UserAddOutlined />}
                                            onClick={handleJoinClick}
                                            disabled={!club.isActive}
                                        >
                                            Tham gia CLB
                                        </Button>
                                        <Button
                                            size="large"
                                            icon={isFavorite ? <HeartOutlined /> : <HeartOutlined />}
                                            onClick={toggleFavorite}
                                            className={isFavorite ? styles.favoriteActive : ''}
                                        >
                                            {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                                        </Button>
                                        <Button
                                            size="large"
                                            icon={<ShareAltOutlined />}
                                            onClick={handleShare}
                                        >
                                            Chia sẻ
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Statistics */}
                    <Row gutter={[16, 16]} className={styles.statsRow}>
                        <Col xs={12} sm={6}>
                            <Card className={styles.statCard}>
                                <Statistic
                                    title="Thành viên"
                                    value={club.memberCount}
                                    prefix={<TeamOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card className={styles.statCard}>
                                <Statistic
                                    title="Đánh giá"
                                    value={club.rating}
                                    prefix={<StarOutlined />}
                                    suffix="/ 5"
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card className={styles.statCard}>
                                <Statistic
                                    title="Hoạt động"
                                    value={club.activities?.length || 0}
                                    prefix={<ScheduleOutlined />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card className={styles.statCard}>
                                <Statistic
                                    title="Thành tích"
                                    value={club.achievements?.length || 0}
                                    prefix={<TrophyOutlined />}
                                    valueStyle={{ color: '#fa541c' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Main Content */}
                    <Card className={styles.mainCard}>
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            size="large"
                            items={tabItems}
                        />
                    </Card>

                    {/* Join Modal */}
                    <Modal
                        title="Tham gia câu lạc bộ"
                        open={isJoinModalVisible}
                        onOk={handleJoinConfirm}
                        onCancel={() => setIsJoinModalVisible(false)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <p>Bạn có chắc chắn muốn tham gia câu lạc bộ <strong>{club.name}</strong>?</p>
                        <p>Chúng tôi sẽ gửi yêu cầu của bạn đến ban quản lý câu lạc bộ.</p>
                    </Modal>
                </motion.div>
            )}
        </AnimatePresence>
    );
}