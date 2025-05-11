'use client';

import ClubRecommendation from '@/components/ClubRecommendation';
import MainLayout from '@/components/MainLayout';
import ResultCard from '@/components/ResultCard';
import { personalityTypes } from '@/data/personalityTypes';
import styles from '@/styles/PersonalityTest.module.css';
import { Button, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const { Title } = Typography;

export default function ResultPage() {
    const router = useRouter();
    const [result, setResult] = useState(null);

    useEffect(() => {
        const storedResult = localStorage.getItem('personalityResult');
        if (storedResult) {
            setResult(JSON.parse(storedResult));
        } else {
            router.push('/personality-test');
        }
    }, [router]);

    if (!result) return null;

    const personalityType = personalityTypes[result.type];

    // Prepare data for chart
    const chartData = Object.entries(result.scores).map(([type, score]) => ({
        name: personalityTypes[type].title.split(' - ')[1],
        score: score,
        color: personalityTypes[type].color
    }));

    const handleRetake = () => {
        localStorage.removeItem('personalityResult');
        router.push('/personality-test');
    };

    return (
        <MainLayout>
            <div className={styles.resultContainer}>
                <Title level={1} className={styles.resultTitle}>
                    Kết quả của bạn
                </Title>

                <ResultCard personalityType={personalityType} />

                <div className={styles.chartSection}>
                    <Title level={3}>Phân tích chi tiết</Title>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="score" name="Điểm">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <ClubRecommendation clubs={personalityType.clubs} />

                <div className={styles.actionButtons}>
                    <Button size="large" onClick={handleRetake}>
                        Làm lại bài test
                    </Button>
                    <Button type="primary" size="large" onClick={() => router.push('/clubs')}>
                        Khám phá CLB
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
}