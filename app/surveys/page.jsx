import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import MainLayout from '@/components/MainLayout';
import SurveysList from '@/components/SurveysList';
import styles from '@/styles/ListPage.module.css';

export default function SurveysPage() {
  const workbook = xlsx.readFile(path.resolve('data/FTU2-data.xlsx'));
  const sheet2 = workbook.Sheets[workbook.SheetNames[1]];
  const raw = xlsx.utils.sheet_to_json(sheet2, { defval: '' });
  const surveys = raw.map(row => ({
    STT: row['STT'],
    Ten: row['Tên']
  }));

  return (
    <MainLayout>
      <div className={styles.pageContainer}>
        <Breadcrumb
          items={[
            { title: <Link href="/" className={styles.breadcrumbLink}>Trang chủ</Link> },
            { title: 'Khảo sát của trường' }
          ]}
          className={styles.breadcrumb}
        />
        <SurveysList surveys={surveys} />
      </div>
    </MainLayout>
  );
} 