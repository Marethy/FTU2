import styles from '@/styles/PersonalityTest.module.css';
import { Card, Radio } from 'antd';

export default function QuestionCard({ question, selectedOption, onSelectOption }) {
    return (
        <Card className={styles.questionCard}>
            <h3
                className={styles.questionTitle}
                style={{
                    color: '#1a1a1a',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}
            >
                {question.question}
            </h3>
            <Radio.Group
                value={selectedOption}
                onChange={(e) => onSelectOption(e.target.value)}
                className={styles.optionsGroup}
            >
                {question.options.map((option) => (
                    <Radio
                        key={option.id}
                        value={option.id}
                        className={styles.optionItem}
                    >
                        <span
                            className={styles.optionText}
                            style={{
                                color: '#495057',
                                fontSize: '1.1rem',
                                lineHeight: 1.5
                            }}
                        >
                            {option.text}
                        </span>
                    </Radio>
                ))}
            </Radio.Group>
        </Card>
    );
}