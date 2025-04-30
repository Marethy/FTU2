import { List, Avatar, Tag, Typography, Empty } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ContestList = ({ contests }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={contests}
      locale={{
        emptyText: (
          <Empty
            image="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg"
            imageStyle={{ height: 200 }}
            description="Không có cuộc thi nào được tìm thấy"
          />
        )
      }}
      renderItem={item => (
        <List.Item
          actions={[
            <Tag color={new Date(item.deadline) > new Date() ? 'green' : 'red'}>
              {new Date(item.deadline) > new Date() ? 'Open' : 'Closed'}
            </Tag>
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                src={item.logoUrl}
                alt={item.title}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#f0f0f0' }}
              />
            }
            title={<a href={`/contests/${item.id}`}>{item.title}</a>}
            description={
              <Paragraph
                ellipsis={{
                  rows: 3,
                  expandable: true,
                  symbol: 'Đọc thêm',
                  tooltip: item.description
                }}
                style={{ 
                  margin: 0,
                  lineHeight: '1.5em',
                  maxHeight: '4.5em',
                  overflow: 'hidden'
                }}
              >
                {item.description}
              </Paragraph>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default ContestList; 