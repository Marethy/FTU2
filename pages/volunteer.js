import { useState } from 'react';
import { Table, Input } from 'antd';
import { volunteers } from '../data/volunteers';
import FilterBar from '../components/FilterBar';

const VolunteerPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDomains, setSelectedDomains] = useState([]);

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
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
    },
  ];

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         volunteer.club.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesDomain = selectedDomains.length === 0 || selectedDomains.includes(volunteer.club);
    return matchesSearch && matchesDomain;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Volunteer Opportunities</h1>
      <div style={{ marginBottom: '20px' }}>
        <Input.Search
          placeholder="Search by title or club"
          onChange={e => setSearchKeyword(e.target.value)}
          style={{ width: 200, marginRight: '20px' }}
        />
        <FilterBar
          selectedDomains={selectedDomains}
          setSelectedDomains={setSelectedDomains}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredVolunteers}
        rowKey="id"
        locale={{ emptyText: 'No data' }}
      />
    </div>
  );
};

export default VolunteerPage; 