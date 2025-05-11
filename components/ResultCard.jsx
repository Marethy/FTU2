import styles from '@/styles/PersonalityTest.module.css';
import { Card, Tag, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function ResultCard({ personalityType }) {
    return (
        <Card className={styles.resultCard} style={{ borderColor: personalityType.color }}>
            <div className={styles.resultHeader}>
                <div className={styles.resultIcon}>{personalityType.icon}</div>
                <div>
                    <Title level={2} style={{ color: personalityType.color, margin: 0 }}>
                        {personalityType.title}
                    </Title>
                    <Paragraph className={styles.resultDescription} style={{ color: '#495057' }}>
                        {personalityType.description}
                    </Paragraph>
                </div>
            </div>

            <div className={styles.traitsSection}>
                <Title level={4} style={{ color: '#1a1a1a' }}>Đặc điểm nổi bật</Title>
                <div className={styles.traitsGrid}>
                    {personalityType.traits.map((trait, index) => (
                        <Tag key={index} color={personalityType.color} className={styles.traitTag}>
                            {trait}
                        </Tag>
                    ))}
                </div>
            </div>
        </Card>
    );
}