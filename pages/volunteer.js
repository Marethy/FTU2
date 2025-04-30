import { useState, useEffect } from 'react';
import { Empty, Card, Row, Col, Tooltip, Breadcrumb, Skeleton } from 'antd';
import { QuestionCircleOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import FilterBar from '../components/FilterBar';
import VolunteerList from '../components/VolunteerList';
import { volunteers } from '../data/volunteers';
import styles from '../styles/modules/Volunteer.module.css';

export default function VolunteerPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedClubs, setSelectedClubs] = useState(['all']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  try {
    if (loading) {
      return (
        <div className={styles.pageContainer}>
          <Breadcrumb className={styles.breadcrumb}>
            <Breadcrumb.Item>
              <Link href="/" passHref>
                <a aria-label="Trang chủ">
                  <HomeOutlined /> Trang chủ
                </a>
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Hoạt động tình nguyện</Breadcrumb.Item>
          </Breadcrumb>
          <Card className={styles.card}>
            <Skeleton active className={styles.skeleton} />
          </Card>
        </div>
      );
    }

    if (!volunteers || volunteers.length === 0) {
      return (
        <div className={styles.pageContainer}>
          <Breadcrumb className={styles.breadcrumb}>
            <Breadcrumb.Item>
              <Link href="/" passHref>
                <a aria-label="Trang chủ">
                  <HomeOutlined /> Trang chủ
                </a>
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Hoạt động tình nguyện</Breadcrumb.Item>
          </Breadcrumb>
          <Card className={styles.card}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có hoạt động nào"
            />
          </Card>
        </div>
      );
    }

    const filteredData = volunteers
      .filter(v => selectedClubs.includes('all') || selectedClubs.includes(v.club))
      .filter(v => v.title.toLowerCase().includes(searchKeyword.toLowerCase()));

    return (
      <div className={styles.pageContainer}>
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item>
            <Link href="/" passHref>
              <a aria-label="Trang chủ">
                <HomeOutlined /> Trang chủ
              </a>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Hoạt động tình nguyện</Breadcrumb.Item>
        </Breadcrumb>

        <Card className={styles.card}>
          <div className={styles.filterContainer}>
            <Row gutter={[16, 16]} align="middle">
              <Col>
                <FilterBar
                  searchKeyword={searchKeyword}
                  setSearchKeyword={setSearchKeyword}
                  selectedClubs={selectedClubs}
                  setSelectedClubs={setSelectedClubs}
                  clubs={['all', ...new Set(volunteers.map(v => v.club))]}
                  style={{ width: 240 }}
                />
                <Tooltip title="Phím tắt Ctrl + D" placement="right">
                  <QuestionCircleOutlined 
                    style={{ marginLeft: 8 }}
                    aria-label="Phím tắt Ctrl + D"
                  />
                </Tooltip>
              </Col>
            </Row>
          </div>

          {filteredData.length > 0 ? (
            <VolunteerList data={filteredData} />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có hoạt động phù hợp"
            />
          )}
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error in VolunteerPage:', error);
    return (
      <div className={styles.pageContainer}>
        <Card className={styles.card}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Đã có lỗi xảy ra. Vui lòng thử lại sau."
          />
        </Card>
      </div>
    );
  }
} 