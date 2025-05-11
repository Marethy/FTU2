import styles from '@/styles/ClubPlaceholder.module.css';

const ClubPlaceholder = ({ name, domain, size = 200 }) => {
    // Generate a color based on the domain
    const getColorFromDomain = (domain) => {
        const colors = {
            'Công nghệ': '#1890ff',
            'Kinh doanh': '#52c41a',
            'Văn hóa': '#fa541c',
            'Thể thao': '#faad14',
            'Xã hội': '#eb2f96',
            'Nghệ thuật': '#722ed1',
            'Khoa học': '#13c2c2',
            'default': '#8c8c8c'
        };
        return colors[domain] || colors.default;
    };

    const color = getColorFromDomain(domain);
    const initial = name ? name.charAt(0).toUpperCase() : 'C';

    return (
        <div
            className={styles.placeholder}
            style={{
                width: size,
                height: size,
                backgroundColor: `${color}15`
            }}
        >
            <div
                className={styles.content}
                style={{ color }}
            >
                <div className={styles.initial}>{initial}</div>
                <div className={styles.domainIcon}>
                    {domain === 'Công nghệ' && '💻'}
                    {domain === 'Kinh doanh' && '💼'}
                    {domain === 'Văn hóa' && '🎭'}
                    {domain === 'Thể thao' && '⚽'}
                    {domain === 'Xã hội' && '🤝'}
                    {domain === 'Nghệ thuật' && '🎨'}
                    {domain === 'Khoa học' && '🔬'}
                    {!domain && '🏛️'}
                </div>
            </div>
        </div>
    );
};

export default ClubPlaceholder;