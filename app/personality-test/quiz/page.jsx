'use client';

import MainLayout from '@/components/MainLayout';
import QuestionCard from '@/components/QuestionCard';
import { questions } from '@/data/questions';
import styles from '@/styles/PersonalityTest.module.css';
import { Button, Progress, Typography, Space, Tooltip } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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
            const prevQuestion = currentQuestion - 1;
            setCurrentQuestion(prevQuestion);
            // Restore previous answer if exists
            const prevQuestionId = questions[prevQuestion].id;
            const prevAnswerType = answers[prevQuestionId];
            if (prevAnswerType) {
                // Find the option id that matches the saved type
                const prevOption = questions[prevQuestion].options.find(opt => opt.type === prevAnswerType);
                setSelectedOption(prevOption ? prevOption.id : null);
            } else {
                setSelectedOption(null);
            }
        }
    };

    // When moving to next question, restore selectedOption if answer exists
    // Use useEffect to watch currentQuestion
    useEffect(() => {
        const questionId = questions[currentQuestion].id;
        const answerType = answers[questionId];
        if (answerType) {
            const option = questions[currentQuestion].options.find(opt => opt.type === answerType);
            setSelectedOption(option ? option.id : null);
        } else {
            setSelectedOption(null);
        }
    }, [currentQuestion]);    return (
        <MainLayout>
            <div className={styles.quizContainer}>
                <div className={styles.progressSection}>
                    <Title level={4}>Câu hỏi {currentQuestion + 1}/{questions.length}</Title>
                    <Progress percent={progress} showInfo={false} />
                    
                    {/* Question Navigation Dots */}
                    <div className={styles.questionNavigation}>
                        <Space size={[8, 8]} wrap>
                            {questions.map((question, index) => {
                                const isAnswered = answers[question.id] !== undefined;
                                const isCurrent = index === currentQuestion;
                                
                                return (
                                    <Tooltip 
                                        key={index} 
                                        title={isAnswered ? 'Đã trả lời' : index < currentQuestion ? 'Chưa trả lời' : ''}
                                    >
                                        <div
                                            className={`${styles.questionDot} ${isAnswered ? styles.answered : ''} ${isCurrent ? styles.current : ''}`}
                                            onClick={() => {
                                                // Only allow navigating to previous questions or current question
                                                if (index <= currentQuestion) {
                                                    setCurrentQuestion(index);
                                                }
                                            }}
                                            style={{ 
                                                cursor: index <= currentQuestion ? 'pointer' : 'not-allowed',
                                                opacity: index > currentQuestion ? 0.5 : 1
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                    </Tooltip>
                                );
                            })}
                        </Space>
                    </div>
                </div>

                <QuestionCard
                    question={questions[currentQuestion]}
                    selectedOption={selectedOption}
                    onSelectOption={handleSelectOption}
                />                <div className={styles.navigationButtons}>
                    <Button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        icon={<LeftOutlined />}
                    >
                        Câu trước
                    </Button>
                    <div className={styles.questionIndicator}>
                        {currentQuestion + 1} / {questions.length}
                    </div>
                    <Button
                        type="primary"
                        onClick={handleNext}
                        disabled={!selectedOption}
                        icon={<RightOutlined />}
                    >
                        {currentQuestion === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
}