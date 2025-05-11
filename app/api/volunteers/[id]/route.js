import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export async function GET(request, { params }) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'volunteers.xlsx');
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Find the volunteer activity with the matching ID
    const volunteer = data.find(v => String(v.id) === params.id);

    if (!volunteer) {
      return NextResponse.json(
        { error: 'Volunteer activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(volunteer);
  } catch (error) {
    console.error('Error reading volunteer data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteer data' },
      { status: 500 }
    );
  }
} 