'use client';

import MainLayout from '@/components/MainLayout';
import QuestionCard from '@/components/QuestionCard';
import { questions } from '@/data/questions';
import styles from '@/styles/PersonalityTest.module.css';
import { Button, Progress, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Title } = Typography;

export default function QuizPage() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const handleSelectOption = (optionId) => {
        setSelectedOption(optionId);
    };

    const handleNext = () => {
        if (!selectedOption) return;

        const question = questions[currentQuestion];
        const selectedAnswer = question.options.find(opt => opt.id === selectedOption);

        setAnswers({
            ...answers,
            [question.id]: selectedAnswer.type
        });

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
        } else {
            // Calculate result
            const typeScores = {
                hustler: 0,
                connector: 0,
                creator: 0,
                analyst: 0
            };

            Object.values(answers).forEach(type => {
                typeScores[type]++;
            });

            // Add current answer
            typeScores[selectedAnswer.type]++;

            // Find dominant type
            const dominantType = Object.entries(typeScores).reduce((a, b) =>
                a[1] > b[1] ? a : b
            )[0];

            // Save to localStorage or pass through URL
            localStorage.setItem('personalityResult', JSON.stringify({
                type: dominantType,
                scores: typeScores
            }));

            router.push('/personality-test/result');
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedOption(null);
        }
    };

    return (
        <MainLayout>
            <div className={styles.quizContainer}>
                <div className={styles.progressSection}>
                    <Title level={4}>Câu hỏi {currentQuestion + 1}/{questions.length}</Title>
                    <Progress percent={progress} showInfo={false} />
                </div>

                <QuestionCard
                    question={questions[currentQuestion]}
                    selectedOption={selectedOption}
                    onSelectOption={handleSelectOption}
                />

                <div className={styles.navigationButtons}>
                    <Button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                    >
                        Câu trước
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleNext}
                        disabled={!selectedOption}
                    >
                        {currentQuestion === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
}