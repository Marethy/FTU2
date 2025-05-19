'use client';

import MainLayout from '@/components/MainLayout';
import TestIntro from '@/components/TestIntro';
import styles from '@/styles/PersonalityTest.module.css';
import { Typography } from 'antd';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function PersonalityTestPage() {
    const router = useRouter();

    const handleStartTest = () => {
        router.push('/personality-test/quiz');
    };

    return (
        <MainLayout>
            <div className={styles.container}>
                <div className={styles.heroSection}>
                    <Title level={1} className={styles.mainTitle}>
                        Khám phá CLB phù hợp với bạn
                    </Title>
                    <p className={styles.subtitle} style={{ color: '#495057' }}>
                        Bài test tính cách này sẽ giúp bạn tìm ra những CLB phù hợp nhất với sở thích và tính cách của mình tại FTU2
                    </p>
                </div>
                <TestIntro onStartTest={handleStartTest} />
            </div>
        </MainLayout>
    );
}