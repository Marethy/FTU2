'use client'

import { CalendarOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Tag } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const { Meta } = Card;

export default function ContestCard({ contest }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'green';
            case 'coming-soon':
                return 'blue';
            case 'closed':
                return 'red';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'open':
                return 'Đang mở';
            case 'coming-soon':
                return 'Sắp diễn ra';
            case 'closed':
                return 'Đã đóng';
            default:
                return 'Không xác định';
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

    return (
        <Badge.Ribbon
            text={getStatusText(contest.status)}
            color={getStatusColor(contest.status)}
        >
            <Card
                hoverable
                style={{ height: '37rem', display: 'flex', flexDirection: 'column' }}
                bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                cover={
                    <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                        <Image
                            src={contest.image || 'images/placeholder.svg'}
                            alt={contest.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                                e.currentTarget.src = 'images/placeholder.svg';
                            }}
                        />
                    </div>
                }
            >
                <div style={{ flex: 1 }}>
                    <Meta
                        title={<h3 style={{ marginBottom: 8, fontSize: '16px', lineHeight: '1.3', minHeight: '2.6em' }}>{contest.title}</h3>}
                        description={
                            <div>
                                <p style={{ minHeight: '3em', marginBottom: 16, color: '#595959' }}>{contest.description}</p>
                                <div style={{ marginTop: 'auto' }}>
                                    <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                                        <TeamOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                        <span style={{ fontWeight: 500 }}>{contest.club}</span>
                                    </div>
                                    <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                                        <TrophyOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                                        <Tag color={getCategoryColor(contest.category)} style={{ margin: 0 }}>{contest.category}</Tag>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarOutlined style={{ marginRight: 8, color: '#faad14' }} />
                                        <span>Hạn: {new Date(contest.deadline).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </div>

                {/* Custom footer with better button layout */}
                <div style={{
                    padding: '16px',
                    borderTop: '1px solid #f0f0f0',
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'space-between'
                }}>
                    <Link href={`/contests/${contest.id}`} style={{ flex: 1 }}>
                        <Button
                            type="default"
                            block
                            style={{ height: '40px' }}
                        >
                            Xem chi tiết
                        </Button>
                    </Link>
                    <Button
                        type="primary"
                        key="register"
                        style={{ flex: 1, height: '40px' }}
                        disabled={contest.status !== 'open'}
                        href={contest.registrationLink}
                        block
                    >
                        {contest.status === 'open' ? 'Đăng ký' :
                            contest.status === 'coming-soon' ? 'Sắp mở' : 'Đã đóng'}
                    </Button>
                </div>
            </Card>
        </Badge.Ribbon>
    );
}