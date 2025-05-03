'use client';

import { Table, Empty } from "antd";
import styles from "../styles/ListPage.module.css";
import Link from "next/link";
import MainLayout from '@/components/MainLayout';

export default function ClubList({
  data,
  filters = { search: '' },
  setSelectedDomains,
  setSelectedSortNameOrDate,
  setFilters,
}) {
  const { search = '' } = filters;

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
    !search || club.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Tên câu lạc bộ",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (text, objectData) => {
        return (
          <div style={{ fontWeight: 500 }}>
            <Link href={`/clubs/${objectData.id}`}>{text}</Link>
          </div>
        );
      },
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
      width: "30%",
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
    <MainLayout>
      <Table
        align="center"
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
        onChange={(pagination, filterDatas, sorter) => {
          if (filterDatas.domain !== undefined) {
            setFilters((prev) => ({ ...prev, domain: filterDatas.domain }));
            setSelectedDomains(filterDatas.domain);
          }

          if (sorter.columnKey === "deadline") {
            var sort =
              sorter.order === "ascend" ? "deadline_asc" : "deadline_desc";
            setSelectedSortNameOrDate(sort);
            setFilters((prev) => ({ ...prev, sort }));
          } else if (sorter.columnKey === "name") {
            var sort = sorter.order === "ascend" ? "name_asc" : "name_desc";
            setSelectedSortNameOrDate(sort);
            setFilters((prev) => ({ ...prev, sort }));
          } else {
            setSelectedSortNameOrDate(null);
            setFilters((prev) => ({ ...prev, sort: null }));
          }
        }}
      />
    </MainLayout>
  );
}
