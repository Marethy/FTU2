import { Card, List, Typography } from 'antd';
import { activities, surveys } from '../data/studentActivities';

const { Title } = Typography;

const StudentPage = () => {
  const totalPoints = [...activities, ...surveys].reduce((sum, item) => sum + item.points, 0);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Student Dashboard</Title>
      <Card style={{ marginBottom: '20px' }}>
        <Title level={3}>Total Points: {totalPoints}</Title>
      </Card>

      <Card title="Activities" style={{ marginBottom: '20px' }}>
        <List
          dataSource={activities}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={`Date: ${item.date} | Points: ${item.points}`}
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Surveys">
        <List
          dataSource={surveys}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={`Date: ${item.date} | Points: ${item.points}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default StudentPage; 