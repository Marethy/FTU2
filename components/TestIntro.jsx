import styles from '@/styles/PersonalityTest.module.css';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    QuestionCircleOutlined,
    RocketOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Row, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function TestIntro({ onStartTest }) {
    const features = [
        {
            icon: <ClockCircleOutlined className={styles.featureIcon} />,
            title: "10 phút",
            description: "Thời gian làm bài test"
        },
        {
            icon: <QuestionCircleOutlined className={styles.featureIcon} />,
            title: "10 câu hỏi",
            description: "Được thiết kế khoa học"
        },
        {
            icon: <CheckCircleOutlined className={styles.featureIcon} />,
            title: "4 nhóm tính cách",
            description: "Hustler, Connector, Creator, Analyst"
        },
        {
            icon: <RocketOutlined className={styles.featureIcon} />,
            title: "Gợi ý CLB",
            description: "Phù hợp với tính cách của bạn"
        }
    ];

    const personalityTypes = [
        {
            type: "Hustler",
            icon: "🚀",
            description: "Thủ lĩnh - Người hành động",
            color: "#FF6B6B"
        },
        {
            type: "Connector",
            icon: "💫",
            description: "Người truyền lửa - Kết nối",
            color: "#4ECDC4"
        },
        {
            type: "Creator",
            icon: "🎨",
            description: "Người kiến tạo - Sáng tạo",
            color: "#FFE66D"
        },
        {
            type: "Analyst",
            icon: "🧠",
            description: "Học giả - Phân tích",
            color: "#A8E6CF"
        }
    ];

    return (
        <div className={styles.introContainer}>
            <Card className={styles.introCard}>
                <Title level={2} className={styles.sectionTitle}>
                    Về bài test này
                </Title>

                <Paragraph className={styles.description}>
                    Bài test này được thiết kế dựa trên 4 nhóm tính cách chính, giúp bạn hiểu rõ hơn về
                    bản thân và tìm ra những CLB phù hợp nhất với sở thích, năng lực của mình tại FTU2.
                </Paragraph>

                <Row gutter={[24, 24]} className={styles.featuresRow}>
                    {features.map((feature, index) => (
                        <Col xs={12} sm={6} key={index}>
                            <div className={styles.featureItem}>
                                {feature.icon}
                                <Title level={4}>{feature.title}</Title>
                                <Paragraph>{feature.description}</Paragraph>
                            </div>
                        </Col>
                    ))}
                </Row>

                <Title level={3} className={styles.sectionTitle}>
                    4 Nhóm tính cách
                </Title>

                <Row gutter={[16, 16]} className={styles.typesRow}>
                    {personalityTypes.map((type, index) => (
                        <Col xs={12} md={6} key={index}>
                            <Card
                                className={styles.typeCard}
                                style={{ borderColor: type.color }}
                            >
                                <div className={styles.typeIcon}>{type.icon}</div>
                                <Title level={4} style={{ color: type.color }}>
                                    {type.type}
                                </Title>
                                <Paragraph className={styles.typeDescription}>
                                    {type.description}
                                </Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div className={styles.startSection}>
                    <Title level={3}>Sẵn sàng khám phá?</Title>
                    <Paragraph>
                        Hãy trả lời thật lòng các câu hỏi để có kết quả chính xác nhất.
                        Không có câu trả lời đúng hay sai!
                    </Paragraph>
                    <Button
                        type="primary"
                        size="large"
                        onClick={onStartTest}
                        className={styles.startButton}
                    >
                        Bắt đầu ngay
                    </Button>
                </div>
            </Card>
        </div>
    );
}