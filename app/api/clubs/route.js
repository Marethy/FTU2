import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import * as xlsx from 'xlsx';

// Cache to avoid reading file on every request
let cachedData = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const DOMAINS = [
  'Công nghệ',
  'Kinh doanh',
  'Văn hóa',
  'Thể thao',
  'Xã hội',
  'Nghệ thuật',
  'Khoa học'
];

// Comprehensive mapping for all clubs with multiple name variations
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

// Enhanced function to get club images with fuzzy matching
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

  // Keywords for domain detection
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

// Helper function to format club data
function formatClubData(rawData) {
  return rawData.map((r, index) => {
    const name = r['CLB - ĐỘI - NHÓM'] || '';
    const images = getClubImages(name);

    // Ensure unique ID
    const id = r['STT'] ? String(r['STT']) : `club-${index + 1}`;

    const club = {
      id: id,
      name: name,
      summary: r['SƠ LƯỢC'] || '',
      contests: r['CUỘC THI/CHƯƠNG TRÌNH'] || '',
      feedback: r['PHẢN HỒI'] || '',
      // Add additional fields for better UI
      memberCount: Math.floor(Math.random() * 100) + 10,
      isActive: Math.random() > 0.2,
      rating: (Math.random() * 2 + 3).toFixed(1),
      image: images.image,
      coverImage: images.coverImage,
      logo: images.logo,
      images: images.images || []
    };

    club.domain = extractDomain(club);
    return club;
  });
}

export async function GET() {
  try {
    // Check cache first
    if (cachedData && lastFetched && (Date.now() - lastFetched < CACHE_DURATION)) {
      return NextResponse.json({ clubs: cachedData });
    }

    // Load workbook from disk
    const filePath = path.join(process.cwd(), 'data/FTU2-data.xlsx');

    // Check if file exists
    try {
      await fs.promises.access(filePath);
    } catch (error) {
      console.error('Data file not found:', filePath);
      return NextResponse.json({ error: 'Data file not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const wb = xlsx.read(fileBuffer, { type: 'buffer' });

    if (!wb || !wb.SheetNames.length) {
      throw new Error('Invalid workbook format');
    }

    const sheet = wb.Sheets[wb.SheetNames[0]];
    if (!sheet) {
      throw new Error('Sheet not found');
    }

    // Parse with headers, skipping the title row
    const raw = xlsx.utils.sheet_to_json(sheet, {
      defval: '',
      range: 1,
      header: ['STT', 'CLB - ĐỘI - NHÓM', 'SƠ LƯỢC', 'CUỘC THI/CHƯƠNG TRÌNH', 'PHẢN HỒI']
    });

    if (!Array.isArray(raw) || !raw.length) {
      throw new Error('No club data found');
    }

    // Format the data
    const clubs = formatClubData(raw);

    // Update cache
    cachedData = clubs;
    lastFetched = Date.now();

    // Return the data
    return NextResponse.json({ clubs });
  } catch (error) {
    console.error('Error processing clubs data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load clubs data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}