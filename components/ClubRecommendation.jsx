import styles from '@/styles/PersonalityTest.module.css';
import { TeamOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tag, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function ClubRecommendation({ clubs }) {
    return (
        <div className={styles.recommendationSection}>            <Title level={2} className={styles.recommendationTitle} style={{ color: '#138eff' }}>
                <TeamOutlined /> CLB phù hợp với bạn
            </Title>

            <Row gutter={[24, 24]}>
                {clubs.map((category, index) => (
                    <Col xs={24} md={12} key={index}>
                        <Card className={styles.categoryCard}>                            <Title level={4} className={styles.categoryTitle} style={{ color: '#138eff' }}>
                                {category.category}
                            </Title>
                            <div className={styles.clubsList}>
                                {category.clubs.map((club, clubIndex) => (
                                    <Tag key={clubIndex} className={styles.clubTag}>
                                        {club}
                                    </Tag>
                                ))}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className={styles.adviceCard}>
                <Title level={4} style={{ color: '#e65100' }}>Lời khuyên cho bạn</Title>
                <Paragraph style={{ color: '#bf360c', margin: 0 }}>
                    Đây chỉ là gợi ý dựa trên tính cách của bạn. Hãy tìm hiểu thêm về các CLB,
                    tham gia các buổi Club Fair và trải nghiệm thực tế để tìm ra CLB phù hợp nhất với mình.
                    Đừng ngại thử sức với những CLB ngoài danh sách gợi ý nếu bạn cảm thấy hứng thú!
                </Paragraph>
            </Card>
        </div>
    );
}