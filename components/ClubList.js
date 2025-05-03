import { Table, Tag, Empty } from "antd";
import { format, parseISO, isValid } from "date-fns";
import styles from "../styles/ListPage.module.css";
import Link from "next/link";

export default function ClubList({
  data,
  filters,
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
  const searchFilteredData = data.filter(
    (club) =>
      !filters.search ||
      club.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  const columns = [
    {
      title: "Tên câu lạc bộ",
      dataIndex: "name",
      key: "name",
      width: "40%",
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
      title: "Lĩnh vực",
      dataIndex: "domain",
      key: "domain",
      width: "30%",
      filters: [...new Set(data.map((item) => item.domain))].map((domain) => ({
        text: domain,
        value: domain,
      })),
      filteredValue: filters.domain ?? null,
      onFilter: (value, record) => record.domain === value,
    },
    {
      title: "Ngày thành lập",
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
        // Attempt ISO parse first, fallback to native Date
        const parsed =
          typeof date === "string" ? parseISO(date) : new Date(date);
        const display = isValid(parsed)
          ? format(parsed, "yyyy-MM-dd")
          : "Unknown deadline";
        return (
          <Tag color={isValid(parsed) ? "blue" : "default"}>{display}</Tag>
        );
      },
    },
  ];

  return (
    <Table
      align="center"
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
  );
}
