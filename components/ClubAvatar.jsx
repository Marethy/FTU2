import { TeamOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { useState } from 'react';

const ClubAvatar = ({
    name,
    image,
    domain,
    size = 64,
    className = '',
    style = {},
    ...props
}) => {
    const [imageError, setImageError] = useState(false);

    // Generate color based on domain or name
    const getColor = () => {
        const colors = {
            'Công nghệ': '#1890ff',
            'Kinh doanh': '#52c41a',
            'Văn hóa': '#fa541c',
            'Thể thao': '#faad14',
            'Xã hội': '#eb2f96',
            'Nghệ thuật': '#722ed1',
            'Khoa học': '#13c2c2',
        };

        if (domain && colors[domain]) {
            return colors[domain];
        }

        // Generate color from name
        const hashCode = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return hash;
        };

        const hue = Math.abs(hashCode(name || '')) % 360;
        return `hsl(${hue}, 70%, 50%)`;
    };

    const avatarProps = {
        size,
        className,
        style: {
            backgroundColor: getColor(),
            ...style
        },
        ...props
    };

    if (image && !imageError) {
        return (
            <Avatar
                {...avatarProps}
                src={image}
                onError={() => setImageError(true)}
            >
                {name?.charAt(0)}
            </Avatar>
        );
    }

    return (
        <Avatar
            {...avatarProps}
            icon={<TeamOutlined />}
        >
            {name?.charAt(0)}
        </Avatar>
    );
};

export default ClubAvatar;