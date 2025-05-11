import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import * as xlsx from 'xlsx';

// Cache for club data
let cachedClubs = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Reuse the same comprehensive mapping from the main route
const CLUB_IMAGE_MAPPING = {
  // CLB KINH DOANH VÀ TIẾNG ANH BEC
  'CLB KINH DOANH VÀ TIẾNG ANH BEC': {
    folder: 'CLB KINH DOANH VÀ TIẾNG ANH BEC',
    logo: 'LOGO.PNG',
    avatar: 'ẢNH ĐẠI DIỆN.PNG',
    coverImages: ['CLUB FAIR.JPG', 'INFORMATION DAY.jpg', 'COFFEE TALK.JPG'],
    aliases: ['KINH DOANH VÀ TIẾNG ANH BEC', 'BEC', 'BUSINESS & ENGLISH CLUB', 'CÂU LẠC BỘ KINH DOANH VÀ TIẾNG ANH BEC']
  },

  // CLB KỸ NĂNG DOANH NHÂN AC
  'CLB KỸ NĂNG DOANH NHÂN AC': {
    folder: 'CLB KỸ NĂNG DOANH NHÂN AC',
    logo: '[AC] LOGO.jpg',
    avatar: '[AC] ẢNH TẬP THỂ.jpg',
    coverImages: ['[AC] ẢNH TẬP THỂ.jpg'],
    aliases: ['KỸ NĂNG DOANH NHÂN AC', 'AC', 'ACTION CLUB', 'CÂU LẠC BỘ KỸ NĂNG DOANH NHÂN AC']
  },

  // CLB MARKETING FTU2 CREATIO
  'CLB MARKETING FTU2 CREATIO': {
    folder: 'CLB MARKETING FTU2 CREATIO',
    logo: 'LOGO.JPG',
    avatar: 'ẢNH BÌA.PNG',
    coverImages: ['CLUB FAIR.JPG', 'TEAM BUILDING.JPG', 'SỰ KIỆN MARTRIP.JPG'],
    aliases: ['MARKETING FTU2 CREATIO', 'CREATIO', 'CLB MARKETING CREATIO', 'CÂU LẠC BỘ MARKETING FTU2 CREATIO']
  },

  // CLB SINH VIÊN NCKH (RCS)
  'CLB SINH VIÊN NCKH (RCS)': {
    folder: 'CLB SINH VIÊN NCKH (RCS)',
    logo: 'Logo RCS nền trắng tròn.png',
    avatar: 'ẢNH TẬP THỂ.JPG',
    coverImages: ['Chuỗi hội thảo SVNCKH.JPG', 'DAZONE.JPG', 'RCS_s Birthday.JPG'],
    aliases: ['SINH VIÊN NCKH RCS', 'RCS', 'CLB SINH VIÊN NCKH', 'RESEARCH CLUB FOR STUDENTS', 'CLB SINH VIÊN NCKH RCS']
  },

  // CLB THỂ THAO FSC
  'CLB THỂ THAO FSC': {
    folder: 'CLB THỂ THAO FSC',
    logo: '308786110_5413082868780769_4842464190528102864_n.jpg',
    avatar: '488825089_1091062716396126_5146950234192769912_n.jpg',
    coverImages: ['308786110_5413082868780769_4842464190528102864_n.jpg', '488825089_1091062716396126_5146950234192769912_n.jpg'],
    aliases: ['THỂ THAO FSC', 'FSC', 'CÂU LẠC BỘ THỂ THAO FSC']
  },

  // CLB TIẾNG NHẬT TRƯỜNG ĐH NGOẠI THƯƠNG FJC
  'CLB TIẾNG NHẬT TRƯỜNG ĐH NGOẠI THƯƠNG FJC': {
    folder: 'CLB TIẾNG NHẬT TRƯỜNG ĐH NGOẠI THƯƠNG FJC',
    logo: '[FJC] LOGO.jpg',
    avatar: '[FJC] ẢNH TẬP THỂ.jpg',
    coverImages: ['[FJC] ẢNH TẬP THỂ.jpg'],
    aliases: ['TIẾNG NHẬT FJC', 'FJC', 'CLB TIẾNG NHẬT', 'CÂU LẠC BỘ TIẾNG NHẬT TRƯỜNG ĐH NGOẠI THƯƠNG FJC']
  },

  // CLB TRUYỀN THÔNG FTUNEWS
  'CLB TRUYỀN THÔNG FTUNEWS': {
    folder: 'CLB TRUYỀN THÔNG FTUNEWS',
    logo: '[FTUNEWS] LOGO.jpg',
    avatar: '[FTUNEWS] ẢNH TẬP THỂ.jpg',
    coverImages: ['[FTUNEWS] ẢNH TẬP THỂ.jpg'],
    aliases: ['TRUYỀN THÔNG FTUNEWS', 'FTUNEWS', 'CÂU LẠC BỘ TRUYỀN THÔNG FTUNEWS']
  },

  // CLB TỔ CHỨC SỰ KIỆN VÀ PHÁT THANH FTU ZONE
  'CLB TỔ CHỨC SỰ KIỆN VÀ PHÁT THANH FTU ZONE': {
    folder: 'CLB TỔ CHỨC SỰ KIỆN VÀ PHÁT THANH FTU ZONE',
    logo: 'LOGO.PNG',
    avatar: 'ẢNH ĐẠI DIỆN.JPG',
    coverImages: ['SỰ KIỆN.JPG', 'TẬP THỂ.JPG'],
    aliases: ['FTU ZONE', 'TỔ CHỨC SỰ KIỆN VÀ PHÁT THANH FTU ZONE', 'CÂU LẠC BỘ TỔ CHỨC SỰ KIỆN VÀ PHÁT THANH FTU ZONE']
  },

  // ĐỘI CÔNG TÁC XÃ HỘI SWC
  'ĐỘI CÔNG TÁC XÃ HỘI SWC': {
    folder: 'ĐỘI CÔNG TÁC XÃ HỘI SWC',
    logo: 'LOGO.JPG',
    avatar: 'ẢNH ĐẠI DIỆN.JPG',
    coverImages: ['CLUB FAIR.JPG', 'HIẾN MÁU NHÂN ĐẠO.JPG', 'TEAM BUILDING.JPG'],
    aliases: ['CÔNG TÁC XÃ HỘI SWC', 'SWC', 'SOCIAL WORK CLUB', 'ĐỘI CÔNG TÁC XÃ HỘI']
  },

  // ĐỘI NHẠC THE GLAM
  'ĐỘI NHẠC THE GLAM': {
    folder: 'ĐỘI NHẠC THE GLAM',
    logo: '[THE GLAM] LOGO.jpg',
    avatar: '[THE GLAM] ẢNH TẬP THỂ.jpg',
    coverImages: ['[THE GLAM] ẢNH TẬP THỂ.jpg'],
    aliases: ['NHẠC THE GLAM', 'THE GLAM', 'ĐỘI NHẠC GLAM']
  }
};

// Helper function to normalize club name for better matching
function normalizeClubName(name) {
  return name
    .toUpperCase()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\s*-\s*/g, ' ') // Replace dashes with spaces
    .replace(/\s*\(\s*/g, ' (') // Normalize parentheses
    .replace(/\s*\)\s*/g, ')')
    .trim();
}

// Enhanced function to get club images with fuzzy matching (same as main route)
function getClubImages(clubName) {
  if (!clubName) return { image: null, coverImage: null, logo: null, images: [] };

  const normalizedName = normalizeClubName(clubName);

  // Try exact match first
  for (const [key, value] of Object.entries(CLUB_IMAGE_MAPPING)) {
    if (normalizeClubName(key) === normalizedName) {
      const baseDir = `/LOGO + HÌNH ẢNH CLB/${value.folder}`;
      return {
        image: value.avatar ? `${baseDir}/${value.avatar}` : null,
        coverImage: value.coverImages.length > 0 ? `${baseDir}/${value.coverImages[0]}` : null,
        logo: value.logo ? `${baseDir}/${value.logo}` : null,
        images: value.coverImages.map(img => `${baseDir}/${img}`)
      };
    }
  }

  // Try aliases
  for (const [key, value] of Object.entries(CLUB_IMAGE_MAPPING)) {
    if (value.aliases) {
      for (const alias of value.aliases) {
        if (normalizeClubName(alias) === normalizedName) {
          const baseDir = `/LOGO + HÌNH ẢNH CLB/${value.folder}`;
          return {
            image: value.avatar ? `${baseDir}/${value.avatar}` : null,
            coverImage: value.coverImages.length > 0 ? `${baseDir}/${value.coverImages[0]}` : null,
            logo: value.logo ? `${baseDir}/${value.logo}` : null,
            images: value.coverImages.map(img => `${baseDir}/${img}`)
          };
        }
      }
    }
  }

  // Try partial match on main key and aliases
  for (const [key, value] of Object.entries(CLUB_IMAGE_MAPPING)) {
    // Check if the normalized name contains the key or vice versa
    if (normalizedName.includes(normalizeClubName(key)) || normalizeClubName(key).includes(normalizedName)) {
      const baseDir = `/LOGO + HÌNH ẢNH CLB/${value.folder}`;
      return {
        image: value.avatar ? `${baseDir}/${value.avatar}` : null,
        coverImage: value.coverImages.length > 0 ? `${baseDir}/${value.coverImages[0]}` : null,
        logo: value.logo ? `${baseDir}/${value.logo}` : null,
        images: value.coverImages.map(img => `${baseDir}/${img}`)
      };
    }

    // Check aliases
    if (value.aliases) {
      for (const alias of value.aliases) {
        if (normalizedName.includes(normalizeClubName(alias)) || normalizeClubName(alias).includes(normalizedName)) {
          const baseDir = `/LOGO + HÌNH ẢNH CLB/${value.folder}`;
          return {
            image: value.avatar ? `${baseDir}/${value.avatar}` : null,
            coverImage: value.coverImages.length > 0 ? `${baseDir}/${value.coverImages[0]}` : null,
            logo: value.logo ? `${baseDir}/${value.logo}` : null,
            images: value.coverImages.map(img => `${baseDir}/${img}`)
          };
        }
      }
    }
  }

  // Check for key acronyms (like BEC, RCS, etc.)
  const words = normalizedName.split(' ');
  for (const word of words) {
    if (word.length >= 2) { // Only check words with at least 2 characters
      for (const [key, value] of Object.entries(CLUB_IMAGE_MAPPING)) {
        if (value.aliases) {
          for (const alias of value.aliases) {
            if (alias === word) {
              const baseDir = `/LOGO + HÌNH ẢNH CLB/${value.folder}`;
              return {
                image: value.avatar ? `${baseDir}/${value.avatar}` : null,
                coverImage: value.coverImages.length > 0 ? `${baseDir}/${value.coverImages[0]}` : null,
                logo: value.logo ? `${baseDir}/${value.logo}` : null,
                images: value.coverImages.map(img => `${baseDir}/${img}`)
              };
            }
          }
        }
      }
    }
  }

  // Log unmatched clubs for debugging
  console.log(`No image mapping found for club: "${clubName}" (normalized: "${normalizedName}")`);

  return { image: null, coverImage: null, logo: null, images: [] };
}

// Helper function to extract domain from club name or summary
function extractDomain(club) {
  const text = `${club.name} ${club.summary}`.toLowerCase();

  const domainKeywords = {
    'Công nghệ': ['it', 'công nghệ', 'lập trình', 'code', 'tech', 'software', 'phần mềm', 'ai', 'machine learning'],
    'Kinh doanh': ['kinh doanh', 'business', 'startup', 'marketing', 'doanh nghiệp', 'quản trị', 'kinh tế', 'doanh nhân'],
    'Văn hóa': ['văn hóa', 'culture', 'ngôn ngữ', 'language', 'du lịch', 'travel', 'tiếng nhật', 'tiếng anh'],
    'Thể thao': ['thể thao', 'sport', 'bóng', 'cầu', 'võ', 'fitness', 'gym'],
    'Xã hội': ['xã hội', 'tình nguyện', 'volunteer', 'cộng đồng', 'community', 'charity', 'công tác xã hội'],
    'Nghệ thuật': ['nghệ thuật', 'art', 'nhạc', 'music', 'hội họa', 'painting', 'dance', 'múa', 'âm nhạc'],
    'Khoa học': ['khoa học', 'science', 'nghiên cứu', 'research', 'học thuật', 'academic', 'nckh']
  };

  // Special cases based on club names
  if (club.name.includes('MARKETING') || club.name.includes('KINH DOANH') || club.name.includes('DOANH NHÂN')) {
    return 'Kinh doanh';
  }
  if (club.name.includes('THỂ THAO')) {
    return 'Thể thao';
  }
  if (club.name.includes('NHẠC')) {
    return 'Nghệ thuật';
  }
  if (club.name.includes('CÔNG TÁC XÃ HỘI')) {
    return 'Xã hội';
  }
  if (club.name.includes('NCKH')) {
    return 'Khoa học';
  }
  if (club.name.includes('TIẾNG NHẬT') || club.name.includes('TIẾNG ANH')) {
    return 'Văn hóa';
  }
  if (club.name.includes('TRUYỀN THÔNG')) {
    return 'Công nghệ';
  }

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return domain;
    }
  }

  return 'Khác';
}

// Helper function to generate activities based on club type
function generateActivities(club) {
  const baseActivities = [
    { id: 1, name: 'Họp định kỳ', frequency: 'Hàng tuần', time: 'Thứ 7, 9:00 AM' },
    { id: 2, name: 'Workshop chuyên đề', frequency: 'Hàng tháng', time: 'Cuối tháng' },
    { id: 3, name: 'Sự kiện giao lưu', frequency: 'Hàng quý', time: 'Theo thông báo' },
  ];

  // Add domain-specific activities
  const domainActivities = {
    'Công nghệ': [
      { id: 4, name: 'Hackathon', frequency: 'Hàng năm', time: 'Tháng 10' },
      { id: 5, name: 'Code review session', frequency: 'Hai tuần/lần', time: 'Thứ 4, 3:00 PM' },
    ],
    'Thể thao': [
      { id: 4, name: 'Tập luyện', frequency: '3 lần/tuần', time: 'Thứ 2,4,6, 5:00 PM' },
      { id: 5, name: 'Giải đấu nội bộ', frequency: 'Hàng tháng', time: 'Chủ nhật đầu tháng' },
    ],
    'Kinh doanh': [
      { id: 4, name: 'Case study workshop', frequency: 'Hàng tháng', time: 'Thứ 6, 2:00 PM' },
      { id: 5, name: 'Startup pitching', frequency: 'Hàng quý', time: 'Cuối quý' },
    ],
    'Văn hóa': [
      { id: 4, name: 'Lớp học ngôn ngữ', frequency: '2 lần/tuần', time: 'Thứ 3,5, 6:00 PM' },
      { id: 5, name: 'Giao lưu văn hóa', frequency: 'Hàng tháng', time: 'Chủ nhật cuối tháng' },
    ],
    'Nghệ thuật': [
      { id: 4, name: 'Buổi tập nhạc', frequency: '3 lần/tuần', time: 'Thứ 2,4,6, 7:00 PM' },
      { id: 5, name: 'Biểu diễn nghệ thuật', frequency: 'Hàng tháng', time: 'Thứ 7 đầu tháng' },
    ],
    'Xã hội': [
      { id: 4, name: 'Hoạt động tình nguyện', frequency: 'Hàng tháng', time: 'Chủ nhật thứ 2' },
      { id: 5, name: 'Chương trình từ thiện', frequency: 'Hàng quý', time: 'Theo kế hoạch' },
    ],
    'Khoa học': [
      { id: 4, name: 'Seminar nghiên cứu', frequency: 'Hàng tháng', time: 'Thứ 6, 3:00 PM' },
      { id: 5, name: 'Hội thảo khoa học', frequency: 'Hàng năm', time: 'Tháng 11' },
    ]
  };

  return [...baseActivities, ...(domainActivities[club.domain] || [])];
}

// Helper function to generate achievements
function generateAchievements(club) {
  const baseAchievements = [
    { year: 2024, title: 'Top 10 CLB xuất sắc', description: 'Được vinh danh trong top 10 CLB hoạt động xuất sắc nhất trường' },
    { year: 2023, title: 'Giải nhất cuộc thi cấp trường', description: 'Đạt giải nhất trong cuộc thi sáng tạo cấp trường' },
  ];

  const domainAchievements = {
    'Kinh doanh': [
      { year: 2023, title: 'Giải nhất Business Case Competition', description: 'Vô địch cuộc thi phân tích tình huống kinh doanh' },
      { year: 2022, title: 'Top 3 Startup Idea Contest', description: 'Lọt vào top 3 cuộc thi ý tưởng khởi nghiệp cấp quốc gia' },
    ],
    'Công nghệ': [
      { year: 2023, title: 'Giải nhì Hackathon FTU', description: 'Đạt giải nhì cuộc thi lập trình Hackathon FTU' },
      { year: 2022, title: 'Best Tech Project Award', description: 'Giải thưởng dự án công nghệ xuất sắc nhất' },
    ],
    'Xã hội': [
      { year: 2023, title: 'Chứng nhận cống hiến cộng đồng', description: 'Nhận chứng nhận vì các hoạt động tình nguyện xuất sắc' },
      { year: 2022, title: 'Giải thưởng Tình nguyện viên của năm', description: 'Được trao giải thưởng tình nguyện viên tiêu biểu' },
    ],
    'Văn hóa': [
      { year: 2023, title: 'Giải nhất cuộc thi hùng biện', description: 'Vô địch cuộc thi hùng biện tiếng Anh cấp trường' },
      { year: 2022, title: 'Top 5 Culture Exchange Program', description: 'Lọt top 5 chương trình trao đổi văn hóa quốc tế' },
    ],
    'Thể thao': [
      { year: 2023, title: 'Vô địch giải thể thao sinh viên', description: 'Đạt chức vô địch giải thể thao sinh viên toàn quốc' },
      { year: 2022, title: 'Giải nhì cúp bóng đá FTU', description: 'Á quân giải bóng đá sinh viên FTU' },
    ],
    'Nghệ thuật': [
      { year: 2023, title: 'Giải nhất FTU Got Talent', description: 'Quán quân cuộc thi tài năng FTU Got Talent' },
      { year: 2022, title: 'Best Performance Award', description: 'Giải thưởng tiết mục biểu diễn xuất sắc nhất' },
    ],
    'Khoa học': [
      { year: 2023, title: 'Giải nhất nghiên cứu khoa học', description: 'Đạt giải nhất hội nghị nghiên cứu khoa học sinh viên' },
      { year: 2022, title: 'Best Research Paper Award', description: 'Giải thưởng bài nghiên cứu xuất sắc nhất' },
    ]
  };

  return [...baseAchievements, ...(domainAchievements[club.domain] || [])];
}

export async function GET(request, { params }) {
  try {
    // Await params before using its properties
    const { id } = await params;

    // Check cache first
    if (cachedClubs && lastFetched && (Date.now() - lastFetched < CACHE_DURATION)) {
      const club = cachedClubs.find(c => String(c.id) === id);
      if (club) {
        return NextResponse.json(club);
      }
    }

    // Load data from file
    const filePath = path.join(process.cwd(), 'data', 'FTU2-data.xlsx');
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet, {
      defval: '',
      range: 1,
      header: ['STT', 'CLB - ĐỘI - NHÓM', 'SƠ LƯỢC', 'CUỘC THI/CHƯƠNG TRÌNH', 'PHẢN HỒI']
    });

    // Format all clubs data
    const clubs = data.map((r, index) => {
      const clubName = r['CLB - ĐỘI - NHÓM'] || '';
      const images = getClubImages(clubName);

      const club = {
        id: r['STT'] || index + 1,
        name: clubName,
        summary: r['SƠ LƯỢC'] || '',
        contests: r['CUỘC THI/CHƯƠNG TRÌNH'] || '',
        feedback: r['PHẢN HỒI'] || '',
        memberCount: Math.floor(Math.random() * 100) + 20,
        isActive: Math.random() > 0.2,
        rating: (Math.random() * 2 + 3).toFixed(1),
        image: images.image,
        coverImage: images.coverImage,
        logo: images.logo,
        images: images.images,
        foundedYear: 2015 + Math.floor(Math.random() * 8),
        email: `club${r['STT']}@ftu.edu.vn`,
        phone: `+84${Math.floor(Math.random() * 900000000 + 100000000)}`,
        location: 'Phòng CLB, Tầng 3, Nhà A',
      };

      club.domain = extractDomain(club);
      // Add additional detail data
      club.activities = generateActivities(club);
      club.achievements = generateAchievements(club);
      club.socialLinks = {
        facebook: `https://facebook.com/club${club.id}`,
        instagram: `https://instagram.com/club${club.id}`,
        website: Math.random() > 0.5 ? `https://club${club.id}.ftu.edu.vn` : null,
      };

      return club;
    });

    // Update cache
    cachedClubs = clubs;
    lastFetched = Date.now();

    // Find the specific club
    const club = clubs.find(c => String(c.id) === id);

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