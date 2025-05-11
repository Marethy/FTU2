import styles from '@/styles/ClubDetail.module.css';
import { Card, Col, Divider, Row, Skeleton, Space } from 'antd';
import { motion } from 'framer-motion';

export default function ClubDetailSkeleton() {
    const shimmer = {
        initial: { opacity: 0.5 },
        animate: {
            opacity: 1,
            transition: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Hero Section Skeleton */}
            <Card className={styles.heroCard} bodyStyle={{ padding: 0 }}>
                <div className={styles.heroContainer}>
                    <motion.div {...shimmer}>
                        <Skeleton.Image
                            active
                            style={{ width: '100%', height: 400 }}
                            className={styles.coverImage}
                        />
                    </motion.div>
                    <div className={styles.heroOverlay}>
                        <div className={styles.heroContent}>
                            <Skeleton.Avatar active size={120} shape="circle" />
                            <div className={styles.heroInfo}>
                                <Skeleton.Input active style={{ width: 300, height: 40, marginBottom: 16 }} />
                                <Space>
                                    <Skeleton.Button active style={{ width: 100 }} />
                                    <Skeleton.Button active style={{ width: 120 }} />
                                    <Skeleton.Button active style={{ width: 100 }} />
                                </Space>
                            </div>
                            <div className={styles.heroActions}>
                                <Skeleton.Button active style={{ width: 140 }} size="large" />
                                <Skeleton.Button active style={{ width: 100 }} size="large" />
                                <Skeleton.Button active style={{ width: 100 }} size="large" />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Statistics Skeleton */}
            <Row gutter={[16, 16]} className={styles.statsRow}>
                {[1, 2, 3, 4].map((item) => (
                    <Col key={item} xs={12} sm={6}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: item * 0.1 }}
                        >
                            <Card className={styles.statCard}>
                                <Skeleton active paragraph={{ rows: 2, width: ['100%', '50%'] }} />
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            {/* Main Content Skeleton */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className={styles.mainCard}>
                    {/* Tabs Skeleton */}
                    <div style={{ marginBottom: 24 }}>
                        <Space>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + item * 0.05 }}
                                >
                                    <Skeleton.Button active style={{ width: 100 }} />
                                </motion.div>
                            ))}
                        </Space>
                    </div>

                    {/* Tab Content Skeleton */}
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {/* Section 1 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Skeleton.Input active style={{ width: 200, marginBottom: 16 }} />
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </motion.div>

                        <Divider />

                        {/* Section 2 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            <Skeleton.Input active style={{ width: 200, marginBottom: 16 }} />
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Skeleton active paragraph={{ rows: 2 }} />
                                </Col>
                                <Col span={12}>
                                    <Skeleton active paragraph={{ rows: 2 }} />
                                </Col>
                            </Row>
                        </motion.div>

                        <Divider />

                        {/* Section 3 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.0 }}
                        >
                            <Skeleton.Input active style={{ width: 200, marginBottom: 16 }} />
                            <Space>
                                <Skeleton.Avatar active size="small" />
                                <Skeleton.Input active style={{ width: 150 }} />
                            </Space>
                        </motion.div>
                    </Space>
                </Card>
            </motion.div>
        </motion.div>
    );
}