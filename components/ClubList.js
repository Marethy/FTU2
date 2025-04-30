import { Table, Tag } from 'antd';
import { format } from 'date-fns';
import styles from '../styles/ListPage.module.css';

export default function ClubList({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

  const columns = [
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: (text) => (
        <div style={{ fontWeight: 500 }}>{text}</div>
      ),
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'category',
      key: 'category',
      width: '30%',
      filters: [...new Set(data.map((item) => item.category))].map((category) => ({
        text: category,
        value: category,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      key: 'foundedDate',
      width: '30%',
      sorter: (a, b) => new Date(a.foundedDate) - new Date(b.foundedDate),
      render: (date) => (
        <Tag color="blue">
          {format(new Date(date), 'yyyy-MM-dd')}
        </Tag>
      ),
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