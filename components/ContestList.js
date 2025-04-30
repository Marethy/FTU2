import { Table } from 'antd';

const ContestList = ({ data }) => {
  // Get unique clubs for filtering
  const uniqueClubs = [...new Set(data.map(contest => contest.club))];

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
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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

export default ContestList; 