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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);

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

    const filteredData = clubs
      .filter(c => selectedCategories.includes('all') || selectedCategories.includes(c.category))
      .filter(c => c.name.toLowerCase().includes(searchKeyword.toLowerCase()));

    return (
      <MainLayout>
        <div className={styles.pageContainer}>
          <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />

          <Card className={styles.card}>
            <div className={styles.filterContainer}>
              <Row gutter={[16, 16]} align="middle">
                <Col>
                  <FilterBar
                    searchKeyword={searchKeyword}
                    setSearchKeyword={setSearchKeyword}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    categories={['all', ...new Set(clubs.map(c => c.category))]}
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
              <ClubList data={filteredData} />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có câu lạc bộ phù hợp"
              />
            )}
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