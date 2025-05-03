'use client';

import { Table, Card } from 'antd';
import styles from '../styles/ListPage.module.css';

export default function SurveysList({ surveys }) {
  return (
    <Card 
      title={<h1 className={styles.pageTitle}>CÁC KHẢO SÁT GẦN NHẤT CỦA NHÀ TRƯỜNG</h1>}
      className={styles.card}
    >
      <Table
        dataSource={surveys}
        rowKey="STT"
        pagination={false}
        columns={[
          { 
            title: 'STT', 
            dataIndex: 'STT', 
            key: 'STT',
            width: '10%'
          },
          { 
            title: 'Tên', 
            dataIndex: 'Ten', 
            key: 'Ten',
            width: '90%'
          }
        ]}
      />
    </Card>
  );
} 