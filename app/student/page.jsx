'use client'

import { Typography, Collapse, List } from 'antd';
import { activities, surveys } from '@/data/studentActivities';
import MainLayout from '@/components/MainLayout';

const { Title } = Typography;
const { Panel } = Collapse;

export default function StudentPage() {
  // Calculate total points
  const totalPoints = [...activities, ...surveys].reduce((sum, item) => sum + item.points, 0);

  // Format date helper
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <MainLayout>
      <div style={{ padding: '20px' }}>
        <Title level={2}>Student Dashboard</Title>
        <Title level={3} style={{ marginBottom: '24px' }}>
          Total Points: {totalPoints}
        </Title>

        <Collapse defaultActiveKey={['activities', 'surveys']}>
          <Panel header="Activities" key="activities">
            <List
              dataSource={activities}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={`Date: ${formatDate(item.date)} | Points: ${item.points}`}
                  />
                </List.Item>
              )}
            />
          </Panel>
          <Panel header="Surveys" key="surveys">
            <List
              dataSource={surveys}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={`Date: ${formatDate(item.date)} | Points: ${item.points}`}
                  />
                </List.Item>
              )}
            />
          </Panel>
        </Collapse>
      </div>
    </MainLayout>
  );
} 