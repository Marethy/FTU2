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
  const range = xlsx.utils.decode_range(sheet2['!ref']);
  const surveys = [];
  
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    const sttCell = sheet2[xlsx.utils.encode_cell({ r: R, c: 0 })];
    const tenCell = sheet2[xlsx.utils.encode_cell({ r: R, c: 1 })];
    const linkCell = sheet2[xlsx.utils.encode_cell({ r: R, c: 2 })];
    surveys.push({
      STT: sttCell?.v || '',
      Ten: tenCell?.v || '',
      Link: linkCell?.l?.Target || linkCell?.v || ''
    });
  }

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