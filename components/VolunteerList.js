import { Table, Tag } from 'antd';
import { format } from 'date-fns';
import styles from '../styles/modules/Volunteer.module.css';

export default function VolunteerList({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
      render: (text) => (
        <div style={{ fontWeight: 500 }}>{text}</div>
      ),
    },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'club',
      key: 'club',
      width: '30%',
      filters: [...new Set(data.map((item) => item.club))].map((club) => ({
        text: club,
        value: club,
      })),
      onFilter: (value, record) => record.club === value,
    },
    {
      title: 'Hạn chót',
      dataIndex: 'deadline',
      key: 'deadline',
      width: '30%',
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
      render: (date) => {
        const isExpired = new Date(date) < new Date();
        return (
          <Tag color={isExpired ? 'red' : 'green'}>
            {format(new Date(date), 'yyyy-MM-dd')}
          </Tag>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      rowClassName={(_, index) => index % 2 === 0 ? styles.evenRow : ''}
      className={styles.table}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        showTotal: (total) => `Tổng số: ${total}`,
      }}
      scroll={{ x: 'max-content' }}
    />
  );
} 