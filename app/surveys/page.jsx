'use client';

import MainLayout from '@/components/MainLayout';
import SurveysList from '@/components/SurveysList';
import styles from '@/styles/SurveysPage.module.css';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Col, Input, Row, Select, Spin, Typography, message } from 'antd';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

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

export default function SurveysPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch surveys từ API
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/surveys');
        if (!response.ok) {
          throw new Error('Failed to fetch surveys');
        }
        const data = await response.json();
        setSurveys(data);
      } catch (err) {
        setError(err.message);
        message.error('Không thể tải danh sách khảo sát');
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // Lọc surveys
  const filteredSurveys = useMemo(() => {
    return surveys.filter(survey => {
      const matchesSearch = survey.title.toLowerCase().includes(searchText.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || survey.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || survey.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchText, selectedCategory, selectedStatus, surveys]);

  // Đếm số lượng theo category
  const categoryCounts = useMemo(() => {
    const counts = {};
    surveys.forEach(survey => {
      counts[survey.category] = (counts[survey.category] || 0) + 1;
    });
    return counts;
  }, [surveys]);

  // Lấy danh sách categories duy nhất
  const categories = [...new Set(surveys.map(s => s.category))];

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className={styles.pageContainer}>
          <Card>
            <Text type="danger">Lỗi: {error}</Text>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.pageContainer}>
        <Breadcrumb
          items={[
            { title: <Link href="/">Trang chủ</Link> },
            { title: 'Khảo sát chéo' }
          ]}
          className={styles.breadcrumb}
        />

        <div className={styles.header}>
          <Title level={2}>Khảo sát chéo</Title>
          <Text className={styles.subtitle}>
            Tham gia khảo sát để đóng góp ý kiến và cải thiện chất lượng học tập
          </Text>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <Card className={styles.filterCard}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Tìm kiếm khảo sát..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Danh mục"
                value={selectedCategory}
                onChange={setSelectedCategory}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">Tất cả danh mục</Option>
                {categories.map(cat => (
                  <Option key={cat} value={cat}>
                    {categoryLabels[cat] || cat} ({categoryCounts[cat]})
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Trạng thái"
                value={selectedStatus}
                onChange={setSelectedStatus}
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="Open">Đang mở</Option>
                <Option value="Closed">Đã đóng</Option>
                <Option value="Upcoming">Sắp diễn ra</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Thống kê nhanh */}
        <Row gutter={[16, 16]} className={styles.statsRow}>
          <Col xs={12} sm={6}>
            <Card className={styles.statCard}>
              <div className={styles.statNumber}>{surveys.length}</div>
              <div className={styles.statLabel}>Tổng khảo sát</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className={styles.statCard}>
              <div className={styles.statNumber}>{surveys.filter(s => s.status === 'Open').length}</div>
              <div className={styles.statLabel}>Đang mở</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className={styles.statCard}>
              <div className={styles.statNumber}>
                {surveys.reduce((sum, s) => sum + s.participants, 0).toLocaleString()}
              </div>
              <div className={styles.statLabel}>Người tham gia</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className={styles.statCard}>
              <div className={styles.statNumber}>{categories.length}</div>
              <div className={styles.statLabel}>Danh mục</div>
            </Card>
          </Col>
        </Row>

        {/* Danh sách khảo sát */}
        <SurveysList surveys={filteredSurveys} />
      </div>
    </MainLayout>
  );
}