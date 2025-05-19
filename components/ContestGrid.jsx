'use client'

import { ContestCard } from '@/components/ContestCard';
import { SearchOutlined } from '@ant-design/icons';
import { Col, Empty, Input, Row, Select, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';

const { Text, Title } = Typography;
const { Search } = Input;

// Component Grid chính
const ContestGrid = ({ contests = [] }) => {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Tạo danh sách danh mục từ contests
    const categories = useMemo(() => {
        const uniqueCategories = ['Tất cả', ...new Set(
            contests
                .map(contest => contest.category)
                .filter(Boolean)
        )];
        return uniqueCategories;
    }, [contests]);

    // Tạo danh sách trạng thái
    const statusOptions = useMemo(() => [
        { label: 'Tất cả', value: 'all' },
        { label: 'Đang mở', value: 'open' },
        { label: 'Sắp diễn ra', value: 'coming-soon' },
        { label: 'Đã đóng', value: 'closed' },
        { label: 'Sắp hết hạn (≤ 5 ngày)', value: 'expiring-soon' }
    ], []);

    // Lọc danh sách contests
    const filteredContests = useMemo(() => {
        if (!contests || !Array.isArray(contests)) return [];

        return contests.filter(contest => {
            // Tính số ngày còn lại
            const deadlineDate = new Date(contest.deadline || new Date());
            const today = new Date();
            const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

            // Kiểm tra tìm kiếm
            const titleMatch = contest.title?.toLowerCase().includes(searchText.toLowerCase()) || false;
            const clubMatch = contest.club?.toLowerCase().includes(searchText.toLowerCase()) || false;
            const descriptionMatch = contest.description?.toLowerCase().includes(searchText.toLowerCase()) || false;
            const matchesSearch = !searchText || titleMatch || clubMatch || descriptionMatch;

            // Kiểm tra danh mục
            const matchesCategory = selectedCategory === 'Tất cả' || contest.category === selectedCategory;

            // Kiểm tra trạng thái
            let matchesStatus = true;
            if (selectedStatus !== 'all') {
                if (selectedStatus === 'expiring-soon') {
                    // Lọc cuộc thi sắp hết hạn (còn ≤ 5 ngày và đang mở)
                    matchesStatus = contest.status === 'open' && daysLeft <= 5 && daysLeft > 0;
                } else {
                    matchesStatus = contest.status === selectedStatus;
                }
            }

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
                        {selectedStatus === 'expiring-soon' && ` sắp hết hạn`}
                    </Title>
                </div>

                {/* Contest Grid */}
                {filteredContests.length > 0 ? (
                    <Row gutter={[24, 24]}>
                        {filteredContests.map((contest, index) => (
                            <Col xs={24} sm={12} lg={8} xl={6} key={contest.id || `contest-${index}`}>
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

            {/* CSS cho hiệu ứng pulse */}
            <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default ContestGrid;