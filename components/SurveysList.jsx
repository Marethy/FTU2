'use client';

import { List, Card } from 'antd';
import styles from '../styles/ListPage.module.css';

export default function SurveysList({ surveys }) {
  return (
    <Card 
      title={<h1 className={styles.pageTitle}>CÁC KHẢO SÁT GẦN NHẤT CỦA NHÀ TRƯỜNG</h1>}
      className={styles.card}
    >
      <List
        dataSource={surveys}
        renderItem={s => (
          <List.Item key={s.STT}>
            <strong>{s.STT}.</strong> {s.Ten}
          </List.Item>
        )}
      />
    </Card>
  );
} 