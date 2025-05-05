import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'surveys.xlsx');
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading surveys data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surveys data' },
      { status: 500 }
    );
  }
} 