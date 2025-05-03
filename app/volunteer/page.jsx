'use client'

import { useState, useEffect } from 'react';
import { Empty, Card, Row, Col, Tooltip, Breadcrumb, Skeleton } from 'antd';
import { QuestionCircleOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import VolunteerList from '@/components/VolunteerList';
import { volunteers } from '@/data/volunteers';
import styles from '@/styles/Volunteer.module.css';
import MainLayout from '@/components/MainLayout';

export default function VolunteerPage() {
  const [filters, setFilters] = useState({
    club: null,
    search: '',
    sort: null
  });
  const [loading, setLoading] = useState(true);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedSortNameOrDate, setSelectedSortNameOrDate] = useState();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
    { title: <Link href="/"><HomeOutlined /> Trang chủ</Link> },
    { title: 'Hoạt động tình nguyện' }
  ];

  try {
    if (loading) {
      return (
        <MainLayout>
          <div className={styles.pageContainer}>
            <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />
            <Card className={styles.card}>
              <Skeleton active className={styles.skeleton} />
            </Card>
          </div>
        </MainLayout>
      );
    }

    if (!volunteers || volunteers.length === 0) {
      return (
        <MainLayout>
          <div className={styles.pageContainer}>
            <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />
            <Card className={styles.card}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có hoạt động nào"
              />
            </Card>
          </div>
        </MainLayout>
      );
    }

    return (
      <MainLayout>
        <div className={styles.pageContainer}>
          <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />

          <Card className={styles.card}>
            <div className={styles.filterContainer}>
              <Row gutter={[16, 16]} align="middle">
                <Col>
                  <FilterBar
                    onDomainChange={(clubs) => setFilters(prev => ({ ...prev, club: clubs }))}
                    onSearch={(keyword) => setFilters(prev => ({ ...prev, search: keyword }))}
                    onSortChange={(sort) => setFilters(prev => ({ ...prev, sort }))}
                    domains={[...new Set(volunteers.map(v => v.club))]}
                    selectedDomains={selectedDomains}
                    setSelectedDomains={setSelectedDomains}
                    selectedSortNameOrDate={selectedSortNameOrDate}
                    setSelectedSortNameOrDate={setSelectedSortNameOrDate}
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

            <VolunteerList data={volunteers} filters={filters} setSelectedDomains={setSelectedDomains} 
            setFilters={setFilters}
            setSelectedSortNameOrDate={setSelectedSortNameOrDate}/>
          </Card>
        </div>
      </MainLayout>
    );
  } catch (error) {
    console.error('Error in VolunteerPage:', error);
    return (
      <MainLayout>
        <div className={styles.pageContainer}>
          <Card className={styles.card}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Đã có lỗi xảy ra. Vui lòng thử lại sau."
            />
          </Card>
        </div>
      </MainLayout>
    );
  }
} 