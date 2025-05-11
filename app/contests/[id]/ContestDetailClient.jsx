'use client'

import ErrorPage from '@/components/ErrorPage';
import { CalendarOutlined, FormOutlined, InfoCircleOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Alert, Badge, Breadcrumb, Button, Card, Col, Divider, Row, Skeleton, Space, Tag, Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const { Title, Paragraph, Text } = Typography;

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

    useEffect(() => {
        if (!id) return;

        const fetchContest = async () => {
            try {
                const response = await fetch(`/api/contests/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch contest');
                }
                const data = await response.json();
                setContest(data.contest);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContest();
    }, [id]);

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
                    message="Lỗi"
                    description={`Không thể tải dữ liệu cuộc thi: ${error}`}
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
                message="Xin lỗi, cuộc thi bạn đang tìm kiếm không tồn tại."
            />
        );
    }

    const getStatusInfo = (status) => {
        switch (status) {
            case 'open':
                return { text: 'Đang mở', color: 'green' };
            case 'coming-soon':
                return { text: 'Sắp diễn ra', color: 'blue' };
            case 'closed':
                return { text: 'Đã đóng', color: 'red' };
            default:
                return { text: 'Không xác định', color: 'default' };
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
    const daysLeft = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));

    const breadcrumbItems = [
        { title: <Link href="/">Trang chủ</Link> },
        { title: <Link href="/contests">Cuộc thi</Link> },
        { title: contest.title }
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
                                    <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                                </Space>
                            </div>

                            {/* Image */}
                            <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
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

                            <Divider />

                            {/* Description */}
                            <div>
                                <Title level={4}>
                                    <InfoCircleOutlined /> Giới thiệu
                                </Title>
                                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                    {contest.fullDescription}
                                </Paragraph>
                            </div>

                            <Divider />

                            {/* Contest Info */}
                            <div>
                                <Title level={4}>
                                    <CalendarOutlined /> Thông tin cuộc thi
                                </Title>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Card type="inner" style={{ marginBottom: 16 }}>
                                            <Text strong>Hạn đăng ký:</Text>
                                            <br />
                                            <Text>{deadlineDate.toLocaleDateString('vi-VN', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</Text>
                                            {contest.status === 'open' && daysLeft > 0 && (
                                                <div>
                                                    <br />
                                                    <Text type="warning">Còn {daysLeft} ngày</Text>
                                                </div>
                                            )}
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Card type="inner" style={{ marginBottom: 16 }}>
                                            <Text strong>Trạng thái:</Text>
                                            <br />
                                            <Badge status={contest.status === 'open' ? 'processing' : contest.status === 'coming-soon' ? 'default' : 'error'} text={statusInfo.text} />
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Space>
                    </Card>
                </Col>

                {/* Sidebar */}
                <Col xs={24} md={8}>
                    {/* Registration Card */}
                    <Card style={{ marginBottom: 24 }}>
                        <Title level={4} style={{ marginTop: 0 }}>
                            <FormOutlined /> Đăng ký tham gia
                        </Title>
                        <Paragraph>
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
                            href={contest.registrationLink}
                            icon={<FormOutlined />}
                        >
                            {contest.status === 'open' ? 'Đăng ký ngay' :
                                contest.status === 'coming-soon' ? 'Sắp mở đăng ký' : 'Đã đóng'}
                        </Button>
                    </Card>

                    {/* Club Info Card */}
                    <Card>
                        <Title level={4} style={{ marginTop: 0 }}>
                            <TeamOutlined /> Về {contest.club}
                        </Title>
                        <Paragraph>
                            {contest.description}
                        </Paragraph>
                        <Button type="default" block href={`/clubs/${contest.club}`}>
                            Tìm hiểu thêm về CLB
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}