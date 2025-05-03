'use client'

import { useState, useEffect } from 'react';
import { Empty, Card, Row, Col, Tooltip, Breadcrumb, Skeleton } from 'antd';
import { QuestionCircleOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import ClubList from '@/components/ClubList';
import { clubs } from '@/data/clubs';
import styles from '@/styles/ListPage.module.css';
import MainLayout from '@/components/MainLayout';

export default function ClubsPage() {
  const [filters, setFilters] = useState({
    domain: null,
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
    { title: 'Câu lạc bộ' }
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

    if (!clubs || clubs.length === 0) {
      return (
        <MainLayout>
          <div className={styles.pageContainer}>
            <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />
            <Card className={styles.card}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có câu lạc bộ nào"
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
                    domains={[...new Set(clubs.map(c => c.domain))]}
                    onDomainChange={(domains) => setFilters(prev => ({ ...prev, domain: domains }))}
                    selectedDomains={selectedDomains}
                    setSelectedDomains={setSelectedDomains}
                    selectedSortNameOrDate={selectedSortNameOrDate}
                    setSelectedSortNameOrDate={setSelectedSortNameOrDate}
                    onSearch={(keyword) => setFilters(prev => ({ ...prev, search: keyword }))}
                    onSortChange={(sort) => setFilters(prev => ({ ...prev, sort }))}
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

            <ClubList data={clubs} filters={filters} 
            setSelectedDomains={setSelectedDomains} 
            setFilters={setFilters}
            setSelectedSortNameOrDate={setSelectedSortNameOrDate}/>
          </Card>
        </div>
      </MainLayout>
    );
  } catch (error) {
    console.error('Error in ClubsPage:', error);
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