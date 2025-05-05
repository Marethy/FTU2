'use client';

import { Table, Empty } from "antd";
import styles from "@/styles/ListPage.module.css";
import Link from "next/link";

export default function ClubList({
  data,
  filters = { search: '', domain: null, sort: null },
  setSelectedDomains,
  setSelectedSortNameOrDate,
  setFilters,
}) {
  if (!data || data.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Chưa có câu lạc bộ nào"
      />
    );
  }

  // Apply search filter
  const filtered = data.filter(club =>
    !filters.search || 
    club.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    club.summary.toLowerCase().includes(filters.search.toLowerCase())
  );

  const columns = [
    {
      title: "Tên câu lạc bộ",
      dataIndex: "name",
      key: "name",
      width: "25%",
      render: (text, record) => (
        <Link href={`/clubs/${record.id}`} style={{ fontWeight: 500 }}>
          {text}
        </Link>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder:
        filters.sort === "name_asc"
          ? "ascend"
          : filters.sort === "name_desc"
          ? "descend"
          : null,
    },
    {
      title: "Sơ lược",
      dataIndex: "summary",
      key: "summary",
      width: "35%",
      render: (text) => (
        <div style={{ maxHeight: '100px', overflow: 'hidden' }}>
          {text}
        </div>
      ),
    },
    {
      title: "Cuộc thi/Chương trình",
      dataIndex: "contests",
      key: "contests",
      width: "20%",
      render: (text) => (
        <div style={{ maxHeight: '100px', overflow: 'hidden' }}>
          {text}
        </div>
      ),
    },
    {
      title: "Phản hồi",
      dataIndex: "feedback",
      key: "feedback",
      width: "20%",
      render: (text) => (
        <div style={{ maxHeight: '100px', overflow: 'hidden' }}>
          {text}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filtered}
      rowKey="id"
      rowClassName={(_, index) => (index % 2 === 0 ? styles.evenRow : "")}
      className={styles.table}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        showTotal: (total) => `Tổng số: ${total}`,
      }}
      scroll={{ x: "max-content" }}
      locale={{
        emptyText: "Không có câu lạc bộ phù hợp",
      }}
      onChange={(pagination, filterData, sorter) => {
        if (sorter.columnKey === "name") {
          const sort = sorter.order === "ascend" ? "name_asc" : "name_desc";
          setSelectedSortNameOrDate?.(sort);
          setFilters?.(prev => ({ ...prev, sort }));
        } else {
          setSelectedSortNameOrDate?.(null);
          setFilters?.(prev => ({ ...prev, sort: null }));
        }
      }}
    />
  );
}
