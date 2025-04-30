import { useState } from 'react';
import { Table, Empty } from 'antd';
import { volunteers as volunteersData } from '../data/volunteers';
import FilterBar from '../components/FilterBar';

const VolunteerPage = () => {
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Get unique clubs for FilterBar
  const uniqueClubs = [...new Set(volunteersData.map(volunteer => volunteer.club))];

  // Filter volunteers based on selected domains and search keyword
  const filteredVolunteers = volunteersData.filter(volunteer => {
    const matchesDomain = selectedDomains.length === 0 || 
                         selectedDomains.includes(volunteer.club);
    const matchesSearch = !searchKeyword || 
                         volunteer.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         volunteer.description.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Club',
      dataIndex: 'club',
      key: 'club',
      filters: uniqueClubs.map(club => ({
        text: club,
        value: club,
      })),
      onFilter: (value, record) => record.club === value,
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline) => new Date(deadline).toLocaleDateString(),
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Volunteer Opportunities</h1>
      <FilterBar
        domains={uniqueClubs}
        onDomainChange={setSelectedDomains}
        onSearch={setSearchKeyword}
      />
      <Table
        columns={columns}
        dataSource={filteredVolunteers}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: (
            <Empty
              description="No volunteer opportunities found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />
    </div>
  );
};

export default VolunteerPage; 