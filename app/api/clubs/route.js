import * as xlsx from 'xlsx';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Load workbook from disk
  const filePath = path.join(process.cwd(), 'data/FTU2-data.xlsx');
  const wb = xlsx.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];

  // 2. Parse with your headers, skipping the title row
  const raw = xlsx.utils.sheet_to_json(sheet, {
    defval: '',
    range: 1,
    header: ['STT','Club','Summary','Contests','Feedback']
  });
  const clubs = raw.map(r => ({
    id: r.STT,
    name: r.Club,
    summary: r.Summary,
    contests: r.Contests,
    feedback: r.Feedback
  }));

  return NextResponse.json({ clubs });
} 