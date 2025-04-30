import { Input, Select, Space } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const FilterBar = ({ onSearch, onDomainChange, onSortChange, domains = [] }) => {
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const searchInputRef = useRef(null);
  const domainSelectRef = useRef(null);

  const handleDomainChange = (value) => {
    setSelectedDomains(value);
    onDomainChange?.(value);
  };

  const handleSearch = (value) => {
    setSearchKeyword(value);
    onSearch?.(value);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus search with Ctrl/Cmd + F
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Focus domain filter with Ctrl/Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        domainSelectRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Space 
      style={{ width: '100%', marginBottom: '16px' }}
      role="search"
      aria-label="Bộ lọc và tìm kiếm"
    >
      <Select
        ref={domainSelectRef}
        mode="multiple"
        allowClear
        style={{ width: '200px' }}
        placeholder="Lọc theo lĩnh vực"
        onChange={handleDomainChange}
        aria-label="Lọc theo lĩnh vực"
        aria-describedby="domain-filter-description"
        tabIndex={0}
        className="focusable-select"
        aria-keyshortcuts="Control+D"
      >
        <Option value="all">Tất cả lĩnh vực</Option>
        {domains.map(domain => (
          <Option 
            key={domain} 
            value={domain} 
            tabIndex={0}
            aria-selected={false}
          >
            {domain}
          </Option>
        ))}
      </Select>
      <span id="domain-filter-description" className="sr-only">
        Chọn một hoặc nhiều lĩnh vực để lọc kết quả. Nhấn Control + D để nhanh chóng chuyển đến bộ lọc này.
      </span>

      <Input.Search
        ref={searchInputRef}
        placeholder="Tìm kiếm"
        allowClear
        onSearch={handleSearch}
        style={{ width: '300px' }}
        aria-label="Tìm kiếm"
        aria-describedby="search-description"
        tabIndex={0}
        className="focusable-search"
        enterButton={<SearchOutlined aria-hidden="true" />}
        aria-keyshortcuts="Control+F"
      />
      <span id="search-description" className="sr-only">
        Nhập từ khóa để tìm kiếm. Nhấn Control + F để nhanh chóng chuyển đến ô tìm kiếm này.
      </span>

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

// Add this to your global CSS or styles
const styles = `
  .focusable-select:focus,
  .focusable-search:focus {
    outline: 3px solid #0057a3;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(0, 87, 163, 0.2);
  }

  .ant-select-focused .ant-select-selector,
  .ant-input-affix-wrapper-focused {
    border-color: #0057a3 !important;
    box-shadow: 0 0 0 4px rgba(0, 87, 163, 0.2) !important;
  }

  .ant-select-item-option:focus {
    background-color: #e6f7ff;
    outline: 2px solid #0057a3;
    outline-offset: -2px;
  }

  /* Screen reader only class */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`; 