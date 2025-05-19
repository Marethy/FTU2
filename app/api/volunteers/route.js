import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'volunteers.xlsx');
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading volunteers data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteers data' },
      { status: 500 }
    );
  }
} 