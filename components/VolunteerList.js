import { Table, Tag, Empty } from "antd";
import { format } from "date-fns";
import styles from "../styles/Volunteer.module.css";
import Link from "next/link";
export default function VolunteerList({
  data,
  filters,
  setSelectedDomains,
  setFilters,
  setSelectedSortNameOrDate,
}) {
  if (!data || data.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Chưa có hoạt động nào"
      />
    );
  }

  // Apply search filter
  const searchFilteredData = data.filter(
    (volunteer) =>
      !filters.search ||
      volunteer.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      volunteer.club.toLowerCase().includes(filters.search.toLowerCase())
  );

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "40%",
      render: (text, objectData) => {
        return (
          <div style={{ fontWeight: 500 }}>
            <Link href={`/volunteer/${objectData.id}`}>{text}</Link>
          </div>
        );
      },
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortOrder:
        filters.sort === "name_asc"
          ? "ascend"
          : filters.sort === "name_desc"
          ? "descend"
          : null,
    },
    {
      title: "Câu lạc bộ",
      dataIndex: "club",
      key: "club",
      width: "30%",
      filters: [...new Set(data.map((item) => item.club))].map((club) => ({
        text: club,
        value: club,
      })),
      filteredValue: filters.club ?? null,
      onFilter: (value, record) => record.club === value,
    },
    {
      title: "Hạn chót",
      dataIndex: "deadline",
      key: "deadline",
      width: "30%",
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
      sortOrder:
        filters.sort === "deadline_asc"
          ? "ascend"
          : filters.sort === "deadline_desc"
          ? "descend"
          : null,
      render: (date) => {
        const isExpired = new Date(date) < new Date();
        return (
          <Tag color={isExpired ? "red" : "green"}>
            {format(new Date(date), "yyyy-MM-dd")}
          </Tag>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={searchFilteredData}
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
        emptyText: "Không có hoạt động phù hợp",
      }}
      onChange={(pagination, filterDatas, sorter) => {
        if (filterDatas.club !== undefined) {
          setFilters((prev) => ({ ...prev, club: filterDatas.club }));
          setSelectedDomains(filterDatas.club);
        }

        if (sorter.columnKey === "deadline") {
          var sort =
            sorter.order === "ascend" ? "deadline_asc" : "deadline_desc";
          setSelectedSortNameOrDate(sort);
          setFilters((prev) => ({ ...prev, sort }));
        } else if (sorter.columnKey === "title") {
          var sort = sorter.order === "ascend" ? "name_asc" : "name_desc";
          setSelectedSortNameOrDate(sort);
          setFilters((prev) => ({ ...prev, sort }));
        } else {
          setSelectedSortNameOrDate(null);
          setFilters((prev) => ({ ...prev, sort: null }));
        }
      }}
    />
  );
}
