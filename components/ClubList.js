import { Table, Avatar } from 'antd';

const ClubList = ({ data }) => {
  // Get unique domains for filtering
  const uniqueDomains = [...new Set(data.map(club => club.domain))];

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logoUrl',
      key: 'logo',
      render: (logoUrl) => (
        <Avatar src={logoUrl} size="large" />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
      filters: uniqueDomains.map(domain => ({
        text: domain,
        value: domain,
      })),
      onFilter: (value, record) => record.domain === value,
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
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default ClubList; 