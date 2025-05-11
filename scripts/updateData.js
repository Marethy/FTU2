import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateData() {
  try {
    console.log('📊 Reading Excel file...');
    const workbook = xlsx.readFile(path.join(__dirname, '../data/FTU2-data.xlsx'));
    
    // Process Sheet 1: Clubs/Đội/Nhóm
    console.log('📋 Processing Clubs sheet...');
    const clubsSheet = workbook.Sheets[workbook.SheetNames[0]];
    const clubsRaw = xlsx.utils.sheet_to_json(clubsSheet, { defval: '' });
    
    const clubs = clubsRaw.map(r => ({
      id: r['STT'],
      name: r['CLB - ĐỘI - NHÓM'],
      summary: r['SƠ LƯỢC'],
      contests: r['CUỘC THI/CHƯƠNG TRÌNH'],
      feedback: r['PHẢN HỒI']
    }));

    console.log(`✅ Found ${clubs.length} clubs`);

    // Write clubs data
    const clubsPath = path.join(__dirname, '../data/clubs.js');
    fs.writeFileSync(
      clubsPath,
      `export const clubs = ${JSON.stringify(clubs, null, 2)};`
    );
    console.log(`📝 Wrote clubs data to ${clubsPath}`);

    // Process Sheet 2: Surveys/Students
    console.log('📋 Processing Surveys sheet...');
    const surveysSheet = workbook.Sheets[workbook.SheetNames[1]];
    const surveysRaw = xlsx.utils.sheet_to_json(surveysSheet, { defval: '' });
    
    const surveys = surveysRaw.map(r => ({
      id: r['STT'],
      name: r['Tên']
    }));

    console.log(`✅ Found ${surveys.length} surveys`);

    // Write surveys data
    const surveysPath = path.join(__dirname, '../data/surveys.js');
    fs.writeFileSync(
      surveysPath,
      `export const surveys = ${JSON.stringify(surveys, null, 2)};`
    );
    console.log(`📝 Wrote surveys data to ${surveysPath}`);

    console.log('✨ Data update completed successfully!');
  } catch (error) {
    console.error('❌ Error updating data:', error);
    process.exit(1);
  }
}

updateData(); 