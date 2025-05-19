import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import * as XLSX from 'xlsx';

// Cache để lưu trữ dữ liệu và tránh đọc file nhiều lần
let contestsCache = null;
let lastUpdated = null;

async function getContestsFromExcel() {
    // Kiểm tra cache (refresh sau mỗi giờ)
    const now = new Date();
    if (contestsCache && lastUpdated && (now - lastUpdated) < 3600000) {
        console.log('Using cached data from', new Date(lastUpdated).toLocaleTimeString());
        return contestsCache;
    }

    try {
        // Đường dẫn đến file Excel
        const filePath = path.join(process.cwd(), 'data', 'competitions.xlsx');

        // Đọc file Excel với fs.promises
        const fileBuffer = await fs.readFile(filePath);

        // Đọc workbook với các tùy chọn đầy đủ
        const workbook = XLSX.read(fileBuffer, {
            type: 'buffer',
            cellDates: true,
            cellText: false,
            cellNF: true,
            dateNF: 'yyyy-mm-dd'
        });

        // Lấy sheet đầu tiên
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Chuyển đổi sheet thành JSON
        const rawData = XLSX.utils.sheet_to_json(worksheet, {
            defval: '', // Giá trị mặc định cho ô trống
            blankrows: false,
        });

        console.log('Excel data loaded. Row count:', rawData.length);

        // In ra mẫu dữ liệu để debug
        if (rawData.length > 0) {
            console.log('First row sample:', JSON.stringify(rawData[0]));
        }

        // Xử lý dữ liệu và chuyển đổi các trường
        const contests = rawData.map((row, index) => {
            // Xử lý các giá trị NaN
            const processValue = (value) => {
                if (value === undefined || value === null || value === 'NaN' || Number.isNaN(value)) {
                    return '';
                }
                return value;
            };

            // Tạo deadline dựa vào ngày hiện tại + 30 ngày
            const currentDate = new Date();
            const futureDate = new Date(currentDate);
            futureDate.setDate(currentDate.getDate() + 30 + index % 60); // Tạo deadline ngẫu nhiên

            // Tạo trạng thái ngẫu nhiên (để phân bố dữ liệu)
            const statuses = ['open', 'coming-soon', 'closed'];
            const randomStatus = statuses[index % 3];

            // Tạo danh mục ngẫu nhiên
            const categories = [
                'Khoa học - Lý luận',
                'Kinh doanh - Khởi nghiệp',
                'Văn hóa - Nghệ thuật',
                'Ngôn ngữ',
                'Thể thao'
            ];
            const randomCategory = categories[index % 5];

            return {
                id: row.ID || index + 1000, // Dùng ID có sẵn hoặc tạo ID mới
                title: processValue(row.Title) || 'Cuộc thi không tên',
                description: processValue(row.Description) || 'Không có mô tả',
                deadline: futureDate.toISOString(), // Dùng deadline giả
                status: randomStatus, // Trạng thái ngẫu nhiên
                category: randomCategory, // Danh mục ngẫu nhiên
                club: processValue(row.Club) || 'Chưa xác định',
                registrationLink: processValue(row.Link) || '#',
                image: '/images/placeholder.svg', // Ảnh mặc định
                fullDescription: processValue(row.Description) || 'Không có mô tả chi tiết',
            };
        });

        // In ra log để debugging
        console.log(`Processed ${contests.length} contests from Excel`);
        if (contests.length > 0) {
            console.log('First contest sample:', JSON.stringify(contests[0]));
            console.log('Contest IDs (first 5):', contests.slice(0, 5).map(c => ({ id: c.id, type: typeof c.id })));
        }

        // Cập nhật cache và thời gian
        contestsCache = contests;
        lastUpdated = now;

        return contests;
    } catch (error) {
        console.error('Error reading Excel file:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });

        // Trả về cache cũ nếu có lỗi mà đã có cache
        if (contestsCache) {
            console.log('Using cached data instead');
            return contestsCache;
        }

        console.log('No cache available, returning sample data');
        // Trả về một số dữ liệu mẫu nếu không có cache
        return [
            {
                id: 1,
                title: "CUỘC THI SINH VIÊN NGHIÊN CỨU KHOA HỌC",
                description: "Cuộc thi Phân tích Dữ liệu DAZONE là sân chơi ...",
                fullDescription: "Cuộc thi Phân tích Dữ liệu DAZONE là sân chơi trí tuệ dành cho sinh viên yêu thích phân tích dữ liệu.",
                deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                status: "open",
                category: "Khoa học - Lý luận",
                club: "CLB Tin học",
                registrationLink: "#",
                image: "/images/placeholder.svg"
            },
            {
                id: 2,
                title: "CALL OF SCIENCE",
                description: "Call of Science 2024 chính thức quay trở lại...",
                fullDescription: "Call of Science 2024 chính thức quay trở lại với nhiều hoạt động thú vị.",
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: "coming-soon",
                category: "Khoa học - Lý luận",
                club: "CLB Khoa học",
                registrationLink: "#",
                image: "/images/placeholder.svg"
            }
        ];
    }
}

export async function GET(request) {
    try {
        // Lấy dữ liệu từ Excel
        const contests = await getContestsFromExcel();

        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const club = searchParams.get('club');
        const expiringDays = searchParams.get('expiringDays'); // Thêm tham số cho cuộc thi sắp hết hạn

        let filteredContests = [...contests];

        // Thêm thông tin về số ngày còn lại
        filteredContests = filteredContests.map(contest => {
            const daysLeft = Math.ceil((new Date(contest.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            return { ...contest, daysLeft };
        });

        // Filter by status
        if (status) {
            if (status === 'expiring-soon') {
                // Lọc cuộc thi sắp hết hạn (còn ≤ 5 ngày và đang mở)
                const days = parseInt(expiringDays) || 5;
                filteredContests = filteredContests.filter(contest =>
                    contest.status === 'open' &&
                    contest.daysLeft <= days &&
                    contest.daysLeft > 0
                );
            } else {
                filteredContests = filteredContests.filter(contest => contest.status === status);
            }
        }

        // Filter by category
        if (category) {
            filteredContests = filteredContests.filter(contest => contest.category === category);
        }

        // Filter by club
        if (club) {
            filteredContests = filteredContests.filter(contest => contest.club === club);
        }

        // Sort by deadline (upcoming first)
        filteredContests.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        // Trả về các danh mục và club cho dropdown menu
        const categories = [...new Set(contests.map(c => c.category).filter(Boolean))];
        const clubs = [...new Set(contests.map(c => c.club).filter(Boolean))];

        return NextResponse.json({
            contests: filteredContests,
            total: filteredContests.length,
            categories,
            clubs
        });
    } catch (error) {
        console.error('Error in /api/contests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contests', message: error.message },
            { status: 500 }
        );
    }
}