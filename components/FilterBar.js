import { Input, Select, Space } from 'antd';
import { useState } from 'react';

const { Search } = Input;
const { Option } = Select;

const FilterBar = ({ onSearch, onDomainChange, onSortChange, domains = [] }) => {
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleDomainChange = (value) => {
    setSelectedDomains(value);
    onDomainChange?.(value);
  };

  const handleSearch = (value) => {
    setSearchKeyword(value);
    onSearch?.(value);
  };

  return (
    <Space style={{ marginBottom: 16 }}>
      <Search
        placeholder="Tìm kiếm"
        onSearch={handleSearch}
        style={{ width: 200 }}
      />
      <Select
        mode="multiple"
        placeholder="Lọc theo lĩnh vực"
        style={{ width: 200 }}
        onChange={handleDomainChange}
        value={selectedDomains}
      >
        <Option value="all">Tất cả lĩnh vực</Option>
        {domains.map(domain => (
          <Option key={domain} value={domain}>
            {domain}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Sắp xếp"
        style={{ width: 200 }}
        onChange={onSortChange}
      >
        <Option value="name_asc">Tên A-Z</Option>
        <Option value="name_desc">Tên Z-A</Option>
        <Option value="deadline_asc">Hạn đăng ký sớm nhất</Option>
        <Option value="deadline_desc">Hạn đăng ký muộn nhất</Option>
      </Select>
    </Space>
  );
};

export default FilterBar; 