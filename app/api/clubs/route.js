import * as xlsx from 'xlsx';
import path from 'path';
import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
  try {
    // 1. Load workbook from disk
    const filePath = path.join(process.cwd(), 'data/FTU2-data.xlsx');
    
    // Check if file exists
    try {
      await fs.promises.access(filePath);
    } catch (error) {
      console.error('Data file not found:', filePath);
      return NextResponse.json({ error: 'Data file not found' }, { status: 404 });
    }

    const wb = xlsx.readFile(filePath);
    if (!wb || !wb.SheetNames.length) {
      throw new Error('Invalid workbook format');
    }

    const sheet = wb.Sheets[wb.SheetNames[0]];
    if (!sheet) {
      throw new Error('Sheet not found');
    }

    // 2. Parse with your headers, skipping the title row
    const raw = xlsx.utils.sheet_to_json(sheet, {
      defval: '',
      range: 1,
      header: ['STT', 'CLB - ĐỘI - NHÓM', 'SƠ LƯỢC', 'CUỘC THI/CHƯƠNG TRÌNH', 'PHẢN HỒI']
    });

    if (!Array.isArray(raw) || !raw.length) {
      throw new Error('No club data found');
    }

    // 3. Map the data to our desired structure
    const clubs = raw.map(r => ({
      id: r['STT'],
      name: r['CLB - ĐỘI - NHÓM'],
      summary: r['SƠ LƯỢC'],
      contests: r['CUỘC THI/CHƯƠNG TRÌNH'],
      feedback: r['PHẢN HỒI']
    }));

    // 4. Return the data
    return NextResponse.json({ clubs });
  } catch (error) {
    console.error('Error processing clubs data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load clubs data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 