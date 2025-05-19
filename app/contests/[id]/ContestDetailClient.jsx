'use client'

import ErrorPage from '@/components/ErrorPage';
import {
    CalendarOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    FileExcelOutlined,
    FormOutlined,
    InfoCircleOutlined,
    LinkOutlined,
    ReloadOutlined,
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
    Row,
    Skeleton,
    Space,
    Statistic,
    Steps,
    Tag,
    Timeline,
    Typography
} from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Step } = Steps;

// Skeleton component cho contest detail page
const ContestDetailSkeleton = () => (
    <div style={{ padding: '24px' }}>
        <Breadcrumb
            style={{ margin: '16px 0' }}
            items={[
                { title: <Skeleton.Input style={{ width: 80 }} size="small" /> },
                { title: <Skeleton.Input style={{ width: 80 }} size="small" /> },
                { title: <Skeleton.Input style={{ width: 120 }} size="small" /> }
            ]}
        />

        <Row gutter={[24, 24]}>
            <Col xs={24} md={16}>
                <Card>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {/* Header Skeleton */}
                        <div>
                            <Skeleton.Input style={{ width: 400 }} size="large" />
                            <Space wrap style={{ marginTop: 16 }}>
                                <Skeleton.Button size="small" style={{ width: 100 }} />
                                <Skeleton.Button size="small" style={{ width: 120 }} />
                                <Skeleton.Button size="small" style={{ width: 80 }} />
                            </Space>
                        </div>

                        {/* Image Skeleton */}
                        <Skeleton.Image
                            style={{
                                width: '100%',
                                height: 400,
                                borderRadius: '8px'
                            }}
                        />

                        <Divider />

                        {/* Description Skeleton */}
                        <div>
                            <Skeleton.Input style={{ width: 150, marginBottom: 16 }} />
                            <Skeleton paragraph={{ rows: 4 }} />
                        </div>

                        <Divider />

                        {/* Contest Info Skeleton */}
                        <div>
                            <Skeleton.Input style={{ width: 200, marginBottom: 16 }} />
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Card type="inner" style={{ marginBottom: 16 }}>
                                        <Skeleton active paragraph={{ rows: 2 }} />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Card type="inner" style={{ marginBottom: 16 }}>
                                        <Skeleton active paragraph={{ rows: 1 }} />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Space>
                </Card>
            </Col>

            {/* Sidebar Skeleton */}
            <Col xs={24} md={8}>
                {/* Registration Card Skeleton */}
                <Card style={{ marginBottom: 24 }}>
                    <Skeleton active paragraph={{ rows: 3 }} />
                    <Skeleton.Button
                        size="large"
                        block
                        style={{ marginTop: 16 }}
                    />
                </Card>

                {/* Club Info Card Skeleton */}
                <Card>
                    <Skeleton active paragraph={{ rows: 2 }} />
                    <Skeleton.Button
                        block
                        style={{ marginTop: 16 }}
                    />
                </Card>
            </Col>
        </Row>
    </div>
);

export default function ContestDetailClient({ id }) {
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayLoading, setDisplayLoading] = useState(true);
    const [dataSource, setDataSource] = useState('excel');

    const fetchContest = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        try {
            // Thêm timestamp để tránh cache
            const timestamp = new Date().getTime();
            const response = await fetch(`/api/contests/${id}?t=${timestamp}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.contest) {
                throw new Error('Dữ liệu cuộc thi không hợp lệ');
            }

            setContest(data.contest);
            setError(null);
        } catch (err) {
            console.error('Error fetching contest details:', err);
            setError(err.message || 'Không thể tải dữ liệu cuộc thi');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchContest();
    }, [id, fetchContest]);

    useEffect(() => {
        // Minimum loading time for better UX
        const timer = setTimeout(() => {
            setDisplayLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    if (loading || displayLoading) {
        return <ContestDetailSkeleton />;
    }

    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    message="Lỗi khi tải dữ liệu"
                    description={
                        <div>
                            <p>{error}</p>
                            <Button
                                type="primary"
                                icon={<ReloadOutlined />}
                                onClick={fetchContest}
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

    if (!contest) {
        return (
            <ErrorPage
                title="Không tìm thấy cuộc thi"
                message="Xin lỗi, cuộc thi bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
                extra={
                    <Space>
                        <Button type="primary">
                            <Link href="/contests">Xem tất cả cuộc thi</Link>
                        </Button>
                        <Button onClick={fetchContest}>
                            Thử lại
                        </Button>
                    </Space>
                }
            />
        );
    }

    const getStatusInfo = (status) => {
        switch (status) {
            case 'open':
                return { text: 'Đang mở', color: 'green', icon: <FormOutlined /> };
            case 'coming-soon':
                return { text: 'Sắp diễn ra', color: 'blue', icon: <ClockCircleOutlined /> };
            case 'closed':
                return { text: 'Đã đóng', color: 'red', icon: <ClockCircleOutlined /> };
            default:
                return { text: 'Không xác định', color: 'default', icon: <InfoCircleOutlined /> };
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
    const daysLeft = contest.daysLeft || Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));

    const breadcrumbItems = [
        { title: <Link href="/">Trang chủ</Link> },
        { title: <Link href="/contests">Cuộc thi</Link> },
        { title: contest.title }
    ];

    // Contest timeline steps
    const contestSteps = [
        {
            title: 'Chuẩn bị',
            description: 'Giai đoạn chuẩn bị cho cuộc thi',
            status: 'finish'
        },
        {
            title: 'Đăng ký',
            description: contest.status === 'coming-soon' ? 'Sắp mở đăng ký' : 'Đang mở đăng ký',
            status: contest.status === 'coming-soon' ? 'wait' : contest.status === 'open' ? 'process' : 'finish'
        },
        {
            title: 'Thi',
            description: 'Giai đoạn thi chính thức',
            status: contest.status === 'closed' ? 'finish' : 'wait'
        },
        {
            title: 'Kết quả',
            description: 'Công bố kết quả và trao giải',
            status: 'wait'
        }
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
                                    <Tag color={statusInfo.color} icon={statusInfo.icon}>{statusInfo.text}</Tag>
                                    {contest.status === 'open' && (
                                        <Tag color={daysLeft <= 5 && daysLeft > 0 ? "red" : "orange"} icon={<CalendarOutlined />}>
                                            Còn {daysLeft} ngày
                                        </Tag>
                                    )}
                                </Space>

                                {/* Countdown Banner for contests expiring soon (≤ 5 days) */}
                                {contest.status === 'open' && daysLeft <= 5 && daysLeft > 0 && (
                                    <div style={{
                                        marginTop: '20px',
                                        padding: '15px',
                                        background: 'linear-gradient(to right, #ff4d4f, #ff7a45)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(255, 77, 79, 0.3)',
                                        textAlign: 'center',
                                        animation: 'pulse 2s infinite'
                                    }}>
                                        <Title level={4} style={{ color: 'white', margin: 0 }}>
                                            <ClockCircleOutlined /> Sắp hết hạn đăng ký!
                                        </Title>
                                        <Text style={{ color: 'white', fontSize: '16px' }}>
                                            Chỉ còn {daysLeft} ngày để đăng ký. Hạn chót: {deadlineDate.toLocaleDateString('vi-VN')}
                                        </Text>
                                    </div>
                                )}
                            </div>

                            {/* Image */}
                            <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                <Image
                                    src={contest.image || '/images/placeholder.svg'}
                                    alt={contest.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.currentTarget.src = '/images/placeholder.svg';
                                    }}
                                />
                            </div>

                            {/* Contest Timeline */}
                            <div>
                                <Title level={4}>
                                    <ClockCircleOutlined /> Tiến trình cuộc thi
                                </Title>
                                <Steps
                                    current={contest.status === 'coming-soon' ? 0 : contest.status === 'open' ? 1 : 2}
                                    status={contest.status === 'open' ? 'process' : 'wait'}
                                    progressDot
                                    responsive
                                >
                                    {contestSteps.map((step, index) => (
                                        <Step
                                            key={index}
                                            title={step.title}
                                            description={step.description}
                                            status={step.status}
                                        />
                                    ))}
                                </Steps>
                            </div>

                            <Divider />

                            {/* Description */}
                            <div>
                                <Title level={4}>
                                    <InfoCircleOutlined /> Giới thiệu
                                </Title>
                                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                    {contest.fullDescription || contest.description}
                                </Paragraph>
                            </div>

                            <Divider />

                            {/* Contest Info */}
                            <div>
                                <Title level={4}>
                                    <CalendarOutlined /> Thông tin cuộc thi
                                </Title>
                                <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                                    <Descriptions.Item label="Hạn đăng ký">
                                        <Space direction="vertical">
                                            <Text>{deadlineDate.toLocaleDateString('vi-VN', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</Text>
                                            {contest.status === 'open' && daysLeft > 0 && (
                                                <Tag color="orange">Còn {daysLeft} ngày</Tag>
                                            )}
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái">
                                        <Badge
                                            status={
                                                contest.status === 'open' ? 'processing' :
                                                    contest.status === 'coming-soon' ? 'default' : 'error'
                                            }
                                            text={statusInfo.text}
                                        />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="CLB tổ chức">
                                        <Tag icon={<TeamOutlined />} color="blue">{contest.club}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Danh mục">
                                        <Tag icon={<TrophyOutlined />} color={getCategoryColor(contest.category)}>
                                            {contest.category}
                                        </Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>

                            {/* Related Contests */}
                            {contest.relatedContests && contest.relatedContests.length > 0 && (
                                <>
                                    <Divider />
                                    <div>
                                        <Title level={4}>
                                            <TeamOutlined /> Cuộc thi liên quan
                                        </Title>
                                        <Timeline mode="left">
                                            {contest.relatedContests.map((relatedContest, index) => (
                                                <Timeline.Item
                                                    key={relatedContest.id || `related-${index}`}
                                                    dot={getStatusInfo(relatedContest.status).icon}
                                                    color={getStatusInfo(relatedContest.status).color}
                                                >
                                                    <Link href={`/contests/${relatedContest.id}`}>
                                                        <Text strong>{relatedContest.title}</Text>
                                                    </Link>
                                                    <br />
                                                    <Text type="secondary">
                                                        {new Date(relatedContest.deadline).toLocaleDateString('vi-VN')}
                                                    </Text>
                                                </Timeline.Item>
                                            ))}
                                        </Timeline>
                                    </div>
                                </>
                            )}
                        </Space>
                    </Card>
                </Col>

                {/* Sidebar */}
                <Col xs={24} md={8}>
                    {/* Data Source Info */}
                    <Card
                        style={{ marginBottom: 24 }}
                        size="small"
                        extra={
                            <Button
                                icon={<ReloadOutlined />}
                                size="small"
                                onClick={fetchContest}
                                type="text"
                            />
                        }
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Space>
                                <FileExcelOutlined style={{ color: '#52c41a' }} />
                                <Text>Dữ liệu từ: Excel</Text>
                            </Space>
                            <Text type="secondary">ID: {contest.id}</Text>
                        </Space>
                    </Card>

                    {/* Registration Card */}
                    <Card
                        style={{ marginBottom: 24 }}
                        className={contest.status === 'open' ? 'highlight-card' : ''}
                    >
                        <Title level={4} style={{ marginTop: 0 }}>
                            <FormOutlined /> Đăng ký tham gia
                        </Title>

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic
                                    title="Trạng thái"
                                    value={statusInfo.text}
                                    valueStyle={{
                                        color:
                                            contest.status === 'open' ? '#52c41a' :
                                                contest.status === 'coming-soon' ? '#1890ff' : '#ff4d4f'
                                    }}
                                />
                            </Col>
                            {contest.status === 'open' && (
                                <Col span={12}>
                                    <Statistic
                                        title="Thời gian còn lại"
                                        value={daysLeft}
                                        suffix="ngày"
                                        valueStyle={{ color: daysLeft <= 3 ? '#ff4d4f' : '#1890ff' }}
                                    />
                                </Col>
                            )}
                        </Row>

                        <Paragraph style={{ margin: '16px 0' }}>
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
                            href={contest.registrationLink || '#'}
                            icon={<FormOutlined />}
                            className={contest.status === 'open' ? 'pulse-button' : ''}
                        >
                            {contest.status === 'open' ? 'Đăng ký ngay' :
                                contest.status === 'coming-soon' ? 'Sắp mở đăng ký' : 'Đã đóng'}
                        </Button>

                        {contest.status === 'open' && (
                            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                                <Text
                                    type={daysLeft <= 5 ? "danger" : "warning"}
                                    style={{
                                        fontWeight: daysLeft <= 5 ? 'bold' : 'normal',
                                        fontSize: daysLeft <= 5 ? '16px' : '14px'
                                    }}
                                >
                                    <ClockCircleOutlined /> Hạn chót: {deadlineDate.toLocaleDateString('vi-VN')}
                                    {daysLeft <= 5 && daysLeft > 0 && <span style={{ marginLeft: '5px' }}>
                                        (Còn {daysLeft} ngày!)
                                    </span>}
                                </Text>
                            </div>
                        )}
                    </Card>

                    {/* Club Info Card */}
                    <Card>
                        <Space
                            direction="vertical"
                            size="middle"
                            style={{ width: '100%' }}
                        >
                            <Space>
                                <Avatar
                                    size={64}
                                    style={{ backgroundColor: '#1890ff' }}
                                >
                                    {contest.club?.charAt(0) || 'C'}
                                </Avatar>
                                <div>
                                    <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                                        <TeamOutlined /> {contest.club}
                                    </Title>
                                    <Text type="secondary">
                                        Câu lạc bộ tổ chức
                                    </Text>
                                </div>
                            </Space>

                            <Paragraph>
                                {contest.description}
                            </Paragraph>

                            <Collapse ghost size="small">
                                <Panel header="Thông tin liên hệ" key="1">
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <div>
                                            <LinkOutlined /> Website: <a href="#">{contest.club}</a>
                                        </div>
                                        <div>
                                            <EnvironmentOutlined /> Địa điểm: Trường Đại học
                                        </div>
                                    </Space>
                                </Panel>
                            </Collapse>

                            <Button type="default" block href={`/clubs/${contest.club}`}>
                                Tìm hiểu thêm về CLB
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Custom CSS for animations and hover effects */}
            <style jsx global>{`
                .highlight-card {
                    border: 1px solid #52c41a;
                    box-shadow: 0 0 10px rgba(82, 196, 26, 0.2);
                    transition: all 0.3s ease;
                }
                
                .highlight-card:hover {
                    box-shadow: 0 0 20px rgba(82, 196, 26, 0.3);
                }
                
                .pulse-button {
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.4);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(82, 196, 26, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(82, 196, 26, 0);
                    }
                }
                
                .red-pulse {
                    animation: red-pulse 2s infinite;
                }
                
                @keyframes red-pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.4);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(255, 77, 79, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(255, 77, 79, 0);
                    }
                }
            `}</style>
        </div>
    );
}