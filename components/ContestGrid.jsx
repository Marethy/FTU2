'use client'

import { categories, statusOptions } from '@/data/contests';
import { SearchOutlined } from '@ant-design/icons';
import { Col, Empty, Input, Row, Select, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';
import ContestCard from './ContestCard';

const { Title } = Typography;
const { Search } = Input;

export default function ContestGrid({ contests }) {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const filteredContests = useMemo(() => {
        return contests.filter(contest => {
            const matchesSearch = contest.title.toLowerCase().includes(searchText.toLowerCase()) ||
                contest.club.toLowerCase().includes(searchText.toLowerCase()) ||
                contest.description.toLowerCase().includes(searchText.toLowerCase());

            const matchesCategory = selectedCategory === 'Tất cả' || contest.category === selectedCategory;
            const matchesStatus = selectedStatus === 'all' || contest.status === selectedStatus;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [contests, searchText, selectedCategory, selectedStatus]);

    const handleSearch = (value) => {
        setSearchText(value);
    };

    return (
        <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Search and Filters */}
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Tìm kiếm cuộc thi..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            style={{ width: '100%' }}
                            size="large"
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            options={categories.map(cat => ({ label: cat, value: cat }))}
                        />
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            style={{ width: '100%' }}
                            size="large"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            options={statusOptions}
                        />
                    </Col>
                </Row>

                {/* Results count */}
                <div>
                    <Title level={4}>
                        {filteredContests.length} cuộc thi
                        {searchText && ` cho "${searchText}"`}
                        {selectedCategory !== 'Tất cả' && ` trong ${selectedCategory}`}
                    </Title>
                </div>

                {/* Contest Grid */}
                {filteredContests.length > 0 ? (
                    <Row gutter={[24, 24]}>
                        {filteredContests.map(contest => (
                            <Col xs={24} sm={12} lg={8} xl={6} key={contest.id}>
                                <ContestCard contest={contest} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Empty
                        description="Không tìm thấy cuộc thi nào phù hợp"
                        style={{ padding: '60px 0' }}
                    />
                )}
            </Space>
        </div>
    );
}