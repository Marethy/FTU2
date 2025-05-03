'use client';
import { Table, Card } from 'antd';

export default function ClubList({ data }) {
  const columns = [
    { title: 'STT', dataIndex: 'id', key: 'id' },
    { title: 'Câu lạc bộ', dataIndex: 'name', key: 'name' },
    { title: 'Sơ lược', dataIndex: 'summary', key: 'summary' },
    { title: 'Cuộc thi/Chương trình', dataIndex: 'contests', key: 'contests' },
    { title: 'Phản hồi', dataIndex: 'feedback', key: 'feedback' },
  ];
  return (
    <Card>
      <Table
        dataSource={data}
        rowKey="id"
        pagination={false}
        columns={columns}
      />
    </Card>
  );
} 