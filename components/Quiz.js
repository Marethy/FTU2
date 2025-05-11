import { Form, Radio, Checkbox, Button, Steps, Typography } from 'antd';
import { useState } from 'react';

const { Step } = Steps;
const { Title } = Typography;

const Quiz = ({ questions }) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [score, setScore] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = (values) => {
    let totalScore = 0;
    Object.values(values).forEach(answer => {
      if (Array.isArray(answer)) {
        answer.forEach(option => {
          const question = questions.find(q => q.options.some(opt => opt.value === option));
          if (question) {
            const optionData = question.options.find(opt => opt.value === option);
            totalScore += optionData.points;
          }
        });
      } else {
        const question = questions.find(q => q.options.some(opt => opt.value === answer));
        if (question) {
          const optionData = question.options.find(opt => opt.value === answer);
          totalScore += optionData.points;
        }
      }
    });
    setScore(totalScore);
  };

  return (
    <div>
      <Steps current={current}>
        {questions.map((_, index) => (
          <Step key={index} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: 24 }}
      >
        {questions.map((question, index) => (
          <div
            key={question.id}
            style={{ display: index === current ? 'block' : 'none' }}
          >
            <Title level={4}>{question.question}</Title>
            <Form.Item
              name={`question_${question.id}`}
              rules={[{ required: true, message: 'Vui lòng chọn câu trả lời' }]}
            >
              {question.type === 'radio' ? (
                <Radio.Group>
                  {question.options.map(option => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              ) : (
                <Checkbox.Group>
                  {question.options.map(option => (
                    <Checkbox key={option.value} value={option.value}>
                      {option.label}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              )}
            </Form.Item>
          </div>
        ))}

        <div style={{ marginTop: 24 }}>
          {current > 0 && (
            <Button style={{ marginRight: 8 }} onClick={prev}>
              Quay lại
            </Button>
          )}
          {current < questions.length - 1 && (
            <Button type="primary" onClick={next}>
              Tiếp theo
            </Button>
          )}
          {current === questions.length - 1 && (
            <Button type="primary" htmlType="submit">
              Hoàn thành
            </Button>
          )}
        </div>
      </Form>

      {score > 0 && (
        <div style={{ marginTop: 24 }}>
          <Title level={4}>Điểm số của bạn: {score}</Title>
        </div>
      )}
    </div>
  );
};

export default Quiz; 