import styles from '@/styles/SurveysList.module.css';
import { CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Row, Space, Tag, Typography } from 'antd';

const { Title, Text } = Typography;

// Map category sang tiếng Việt để hiển thị
const categoryLabels = {
  'Workshop': 'Workshop',
  'Faculty Evaluation': 'Đánh giá giảng viên',
  'Academic Quality': 'Chất lượng đào tạo',
  'Academic': 'Học thuật',
  'Recruitment': 'Tuyển dụng',
  'Event': 'Sự kiện',
  'Competition': 'Cuộc thi',
  'Research': 'Nghiên cứu'
};

// Màu cho các category
const categoryColors = {
  'Workshop': 'purple',
  'Faculty Evaluation': 'blue',
  'Academic Quality': 'green',
  'Academic': 'cyan',
  'Recruitment': 'orange',
  'Event': 'magenta',
  'Competition': 'red',
  'Research': 'geekblue'
};

// Màu cho status
const statusColors = {
  'Open': 'success',
  'Closed': 'default',
  'Upcoming': 'warning'
};

export default function SurveysList({ surveys }) {
  if (!surveys || surveys.length === 0) {
    return (
      <Card className={styles.noResults}>
        <Text>Không có khảo sát nào.</Text>
      </Card>
    );
  }

  // Function để xử lý click vào nút tham gia
  const handleSurveyClick = (survey) => {
    if (survey.status !== 'Open') {
      return;
    }

    // Kiểm tra xem link có phải là link bên ngoài không
    if (survey.link.startsWith('http')) {
      // Mở link bên ngoài trong tab mới
      window.open(survey.link, '_blank', 'noopener,noreferrer');
    } else {
      // Link nội bộ
      window.location.href = survey.link;
    }
  };

  return (
    <div className={styles.surveysList}>
      {surveys.map((survey) => (
        <Card key={survey.id} className={styles.surveyCard}>
          <Row align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div className={styles.surveyHeader}>
                  <Tag color={categoryColors[survey.category] || 'default'}>
                    {categoryLabels[survey.category] || survey.category}
                  </Tag>
                  <Badge
                    status={statusColors[survey.status]}
                    text={survey.status === 'Open' ? 'Đang mở' : survey.status === 'Closed' ? 'Đã đóng' : 'Sắp diễn ra'}
                  />
                </div>
                <Title level={4} className={styles.surveyTitle}>
                  {survey.title}
                </Title>
                <Text className={styles.surveyDescription}>
                  {survey.description}
                </Text>
                <div className={styles.surveyMeta}>
                  <Space split="|">
                    <span>
                      <CalendarOutlined /> Hạn: {new Date(survey.deadline).toLocaleDateString('vi-VN')}
                    </span>
                    <span>
                      <TeamOutlined /> {survey.participants.toLocaleString()} người tham gia
                    </span>
                  </Space>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={6} className={styles.surveyActions}>
              <Button
                type="primary"
                block
                onClick={() => handleSurveyClick(survey)}
                disabled={survey.status !== 'Open'}
              >
                {survey.status === 'Open' ? 'Tham gia khảo sát' : 'Đã đóng'}
              </Button>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
}