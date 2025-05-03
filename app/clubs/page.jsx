'use client'

import { useState, useEffect } from 'react';
import { Empty, Card, Row, Col, Tooltip, Breadcrumb, Skeleton } from 'antd';
import { QuestionCircleOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import ClubList from '@/components/ClubList';
import styles from '@/styles/ListPage.module.css';
import MainLayout from '@/components/MainLayout';

export default function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [filters, setFilters] = useState({
    domain: null,
    search: '',
    sort: null
  });
  const [loading, setLoading] = useState(true);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedSortNameOrDate, setSelectedSortNameOrDate] = useState();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('/api/clubs', { cache: 'no-store' });
        const data = await res.json();
        setClubs(data.clubs);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const breadcrumbItems = [
    { title: <Link href="/"><HomeOutlined /> Trang chủ</Link> },
    { title: 'Câu lạc bộ' }
  ];

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
                  onSortChange={(sort) => setFilters(prev => ({ ...prev, sort }))}
                  selectedSortNameOrDate={selectedSortNameOrDate}
                  setSelectedSortNameOrDate={setSelectedSortNameOrDate}
                  onSearchChange={(search) => setFilters(prev => ({ ...prev, search }))}
                />
              </Col>
            </Row>
          </div>

          <ClubList data={clubs} />
        </Card>
      </div>
    </MainLayout>
  );
} 