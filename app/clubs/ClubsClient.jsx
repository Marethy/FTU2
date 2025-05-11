'use client';

import { useState } from 'react';
import { Card, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import ClubList from '@/components/ClubList';
import styles from '@/styles/ListPage.module.css';

export default function ClubsClient({ initialClubs }) {
  const [filters, setFilters] = useState({
    search: '',
    domain: [],
    sort: null
  });
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedSortNameOrDate, setSelectedSortNameOrDate] = useState(null);

  const breadcrumbItems = [
    { title: <Link href="/"><HomeOutlined /> Trang chủ</Link> },
    { title: 'Câu lạc bộ' }
  ];

  return (
    <div className={styles.pageContainer}>
      <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />
      <Card className={styles.card}>
        <div className={styles.filterContainer}>
          <FilterBar
            domains={[...new Set(initialClubs.map(c => c.domain))]}
            onDomainChange={(domains) => setFilters(prev => ({ ...prev, domain: domains }))}
            selectedDomains={selectedDomains}
            setSelectedDomains={setSelectedDomains}
            onSortChange={(sort) => setFilters(prev => ({ ...prev, sort }))}
            selectedSortNameOrDate={selectedSortNameOrDate}
            setSelectedSortNameOrDate={setSelectedSortNameOrDate}
            onSearchChange={(search) => setFilters(prev => ({ ...prev, search }))}
          />
        </div>

        <ClubList 
          data={initialClubs} 
          filters={filters}
          setSelectedDomains={setSelectedDomains}
          setSelectedSortNameOrDate={setSelectedSortNameOrDate}
          setFilters={setFilters}
        />
      </Card>
    </div>
  );
} 