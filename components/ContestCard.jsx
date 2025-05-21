'use client'

import { CalendarOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Badge, Card, Space, Tag, Typography } from 'antd';
import Link from 'next/link';

const { Text, Title } = Typography;

// Tạo Component Card cho mỗi cuộc thi
export const ContestCard = ({ contest }) => {
    // Tính toán số ngày còn lại
    const deadlineDate = new Date(contest.deadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    // Xác định trạng thái và màu sắc
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

    return (
        <Link href={`/contests/${contest.id}`}>
            <Card
                hoverable
                style={{ height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                    <Tag color={getCategoryColor(contest.category)}>{contest.category}</Tag>
                </div>

                <Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: 16, height: '3em', overflow: 'hidden' }}>
                    {contest.title}
                </Title>

                <Text type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 'auto', height: '3em', overflow: 'hidden' }}>
                    {contest.description}
                </Text>

                <Space direction="vertical" size="small" style={{ marginTop: 16 }}>
                    <Space>
                        <TeamOutlined />
                        <Text>{contest.club}</Text>
                    </Space>

                    <Space>
                        <CalendarOutlined />
                        <Text>Hạn: {deadlineDate.toLocaleDateString('vi-VN')}</Text>
                        {contest.status === 'open' && daysLeft > 0 && (
                            <Badge
                                count={`Còn ${daysLeft} ngày`}
                                style={{
                                    backgroundColor: daysLeft <= 5 ? '#ff4d4f' : '#1890ff',
                                    animation: daysLeft <= 5 ? 'pulse 2s infinite' : 'none'
                                }}
                            />
                        )}
                    </Space>

                {/* Hiển thị đếm ngược nếu còn ≤ 5 ngày */}
                    {contest.status === 'open' && daysLeft <= 5 && daysLeft > 0 && (
                        <div style={{
                            marginTop: '5px',
                            padding: '5px 10px',
                            background: daysLeft <= 2 ? '#ff4d4f' : '#ff7a45',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            animation: 'pulse 2s infinite',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}>
                            <ClockCircleOutlined /> Còn {daysLeft} ngày để đăng ký!
                        </div>
                    )}
                </Space>
            </Card>
        </Link>
    );
};