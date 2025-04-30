import { Typography } from 'antd';
import Quiz from '../components/Quiz';

const { Title } = Typography;

export default function Recruitment() {
  return (
    <div>
      <Title level={2}>Tuyển thành viên</Title>
      <Quiz questions={[]} />
    </div>
  );
} 