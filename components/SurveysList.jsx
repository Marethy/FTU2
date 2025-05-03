'use client';

import { List } from 'antd';
import styles from '../styles/ListPage.module.css';

export default function SurveysList({ surveys }) {
  return (
    <div className={styles.card}>
      <h1 className={styles.pageTitle}>CÁC KHẢO SÁT GẦN NHẤT CỦA NHÀ TRƯỜNG</h1>
      <List
        dataSource={surveys}
        renderItem={s => (
          <List.Item key={s.STT}>
            <strong>{s.STT}.</strong> {s.Ten}
            {s.Link && (
              <a href={s.Link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 16 }}>
                [Đi tới khảo sát]
              </a>
            )}
          </List.Item>
        )}
      />
    </div>
  );
} 