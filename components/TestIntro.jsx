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
                <Title style={{ color: 'black' }} level={2} className={styles.sectionTitle}>
                FTU2 Club Match: Your Next Adventure Awaits!
                </Title>

                <Paragraph className={styles.description}>
                Trước khi bắt đầu, hãy lưu ý rằng bài quiz này đóng vai trò như một công cụ hỗ trợ bạn trong việc khám phá các CLB, Đội, Nhóm phù hợp ở FTU2. 
                Kết quả quiz chỉ mang tính chất tham khảo, nhằm đưa ra một số đề xuất giúp bạn tự tin hơn trong hành trình tìm kiếm “gia đình nhỏ” cho riêng mình. 
                Tuy nhiên, quyết định cuối cùng vẫn nằm ở bạn. Hãy tham gia quiz với tinh thần thoải mái và cởi mở, đồng thời đừng ngần ngại khám phá những điều mới mẻ đang chờ phía trước, bạn nhé!
                </Paragraph>

                <Row gutter={[24, 24]} className={styles.featuresRow}>
                    {features.map((feature, index) => (
                        <Col xs={12} sm={6} key={index}>
                            <div className={styles.featureItem}>
                                {feature.icon}
                                <Title style={{ color: 'black' }} level={4}>{feature.title}</Title>
                                <Paragraph style={{ color: 'black' }}>{feature.description}</Paragraph>
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
                    <Paragraph style={{ color: 'black' }}>
                    Còn bây giờ, chúc bạn có trải nghiệm thú vị và hài lòng cùng với “FTU2 Club Match”!
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