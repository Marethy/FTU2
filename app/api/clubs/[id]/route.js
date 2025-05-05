import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export async function GET(request, { params }) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'clubs.xlsx');
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Find the club with the matching ID
    const club = data.find(c => String(c.id) === params.id);

    if (!club) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(club);
  } catch (error) {
    console.error('Error reading club data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch club data' },
      { status: 500 }
    );
  }
} 