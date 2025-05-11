// app/api/surveys/route.js
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    // Đường dẫn đến file Excel
    const filePath = path.join(process.cwd(), 'data', 'FTU2-data.xlsx');
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Đọc sheet "KHẢO SÁT"
    const sheetName = "KHẢO SÁT";
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      return NextResponse.json(
        { error: `Sheet "${sheetName}" không tồn tại` },
        { status: 404 }
      );
    }

    // Đọc dữ liệu từ sheet
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Xử lý dữ liệu thành format surveys
    const surveys = [];

    // Bỏ qua hàng tiêu đề và dữ trừ dữ liệu thực tế
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0 || !row[0] || !row[1]) continue;

      const id = row[0];
      const title = row[1];

      // Kiểm tra xem cell có hyperlink không
      const cellAddress = XLSX.utils.encode_cell({ r: i, c: 1 });
      const cell = worksheet[cellAddress];
      let link = `/survey-${id}`; // Link mặc định

      if (cell && cell.l && cell.l.Target) {
        link = cell.l.Target;
      }

      // Phân loại khảo sát dựa trên tiêu đề
      let category = "Academic"; // Mặc định
      let status = "Open"; // Mặc định

      // Phân loại dựa trên nội dung tiêu đề
      if (title.toLowerCase().includes("workshop")) {
        category = "Workshop";
      } else if (title.toLowerCase().includes("giảng viên") || title.toLowerCase().includes("giảng dạy")) {
        category = "Faculty Evaluation";
      } else if (title.toLowerCase().includes("chất lượng") || title.toLowerCase().includes("đào tạo")) {
        category = "Academic Quality";
      } else if (title.toLowerCase().includes("tuyển dụng") || title.toLowerCase().includes("apprentice")) {
        category = "Recruitment";
      } else if (title.toLowerCase().includes("sự kiện") || title.toLowerCase().includes("event")) {
        category = "Event";
      } else if (title.toLowerCase().includes("cuộc thi") || title.toLowerCase().includes("competition")) {
        category = "Competition";
      } else if (title.toLowerCase().includes("nghiên cứu") || title.toLowerCase().includes("research")) {
        category = "Research";
      }

      // Tạo deadline giả định (30 ngày từ hôm nay)
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 30);

      // Tạo số người tham gia ngẫu nhiên
      const participants = Math.floor(Math.random() * 500) + 50;

      // Tạo mô tả ngắn từ tiêu đề
      let description = title;
      if (title.length > 100) {
        description = title.substring(0, 100) + "...";
      }

      surveys.push({
        id: parseInt(id),
        title: title,
        description: description,
        link: link,
        deadline: deadline.toISOString(),
        status: status,
        category: category,
        participants: participants
      });
    }

    return NextResponse.json(surveys);
  } catch (error) {
    console.error('Error reading surveys data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surveys data' },
      { status: 500 }
    );
  }
}