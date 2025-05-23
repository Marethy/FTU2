// File: app/api/clubs/[id]/route.js
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import * as xlsx from 'xlsx';

// Cache for club data
let cachedClubs = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// CLUB_FOLDER_MAPPING cập nhật cho tất cả CLB
const CLUB_FOLDER_MAPPING = {
  // 10 CLB có thư mục ảnh sẵn có và biến thể tên
  'CLB SINH VIÊN NCKH RCS': 'scientific_student_student_club_rcs',
  'SINH VIÊN NCKH RCS': 'scientific_student_student_club_rcs',
  'RCS': 'scientific_student_student_club_rcs',
  'CLB SINH VIÊN NCKH': 'scientific_student_student_club_rcs',

  'CLB KỸ NĂNG DOANH NHÂN AC': 'ac_entrepreneur_skills_club',
  'KỸ NĂNG DOANH NHÂN AC': 'ac_entrepreneur_skills_club',
  'AC': 'ac_entrepreneur_skills_club',

  'CLB MARKETING CREATIO': 'clb_marketing_ftu2_creatio',
  'MARKETING CREATIO': 'clb_marketing_ftu2_creatio',
  'CREATIO': 'clb_marketing_ftu2_creatio',
  'CLB MARKETING FTU2 CREATIO': 'clb_marketing_ftu2_creatio',

  'CLB KINH DOANH VÀ TIẾNG ANH BEC': 'business_and_english_club_bec',
  'KINH DOANH VÀ TIẾNG ANH BEC': 'business_and_english_club_bec',
  'BEC': 'business_and_english_club_bec',

  'CLB TIẾNG NHẬT TRƯỜNG ĐH NGOẠI THƯƠNG FJC': 'japanese_foreign_trade_university_club_fjc',
  'TIẾNG NHẬT FJC': 'japanese_foreign_trade_university_club_fjc',
  'FJC': 'japanese_foreign_trade_university_club_fjc',

  'CLB THỂ THAO FSC': 'fsc_sports_club',
  'THỂ THAO FSC': 'fsc_sports_club',
  'FSC': 'fsc_sports_club',

  'CLB TỔ CHỨC SỰ KIỆN VÀ PHÁT THANH FTU ZONE': 'ftu_zone_event_and_broadcasting_club',
  'TỔ CHỨC SỰ KIỆN VÀ PHÁT THANH FTU ZONE': 'ftu_zone_event_and_broadcasting_club',
  'FTU ZONE': 'ftu_zone_event_and_broadcasting_club',

  'CLB TRUYỀN THÔNG FTUNEWS': 'media_club_ftunews',
  'TRUYỀN THÔNG FTUNEWS': 'media_club_ftunews',
  'FTUNEWS': 'media_club_ftunews',

  'ĐỘI NHẠC THE GLAM': 'the_glam_music_team',
  'NHẠC THE GLAM': 'the_glam_music_team',
  'THE GLAM': 'the_glam_music_team',

  'ĐỘI CÔNG TÁC XÃ HỘI SWC': 'swc_social_work_team',
  'CÔNG TÁC XÃ HỘI SWC': 'swc_social_work_team',
  'SWC': 'swc_social_work_team'
};

// Image files mapping based on actual folder contents
const CLUB_FILES = {
  'ac_entrepreneur_skills_club': {
    logo: 'ac_logo.jpg',
    avatar: 'ac_collective_photo.jpg',
    coverImages: ['ac_collective_photo.jpg']
  },
  'business_and_english_club_bec': {
    logo: 'logo.png',
    avatar: 'avatar.png',
    coverImages: ['club_fair.jpg', 'information_day.jpg', 'coffee_talk.jpg', 'club_fair_1.jpg', 'information_day_1.jpg']
  },
  'clb_marketing_ftu2_creatio': {
    logo: 'logo.jpg',
    avatar: 'cover.png',
    coverImages: [
      'club_fair.jpg',
      'team_building.jpg',
      'martrip_event.jpg',
      'birthday.jpg',
      'arena_marketing_contest.jpg',
      'pitching_day.jpg',
      'spycom_event.jpg'
    ]
  },
  'scientific_student_student_club_rcs': {
    logo: 'rcs_logo_white_background.png',
    avatar: 'collective_photo.jpg',
    coverImages: [
      'series_of_seminars_svnckh.jpg',
      'dazone.jpg',
      'rcs_s_birthday.jpg',
      'innovation_talks.jpg',
      'conference_svnckh.jpg'
    ]
  },
  'fsc_sports_club': {
    logo: '308786110_5413082868780769_4842464190528102864_n.jpg',
    avatar: '488825089_1091062716396126_5146950234192769912_n.jpg',
    coverImages: ['308786110_5413082868780769_4842464190528102864_n.jpg', '488825089_1091062716396126_5146950234192769912_n.jpg']
  },
  'japanese_foreign_trade_university_club_fjc': {
    logo: 'fjc.jpg',
    avatar: 'fjc_collective_photo.jpg',
    coverImages: ['fjc_collective_photo.jpg']
  },
  'media_club_ftunews': {
    logo: 'funews_logo.jpg',
    avatar: 'ftunews_collective_photo.jpg',
    coverImages: ['ftunews_collective_photo.jpg']
  },
  'ftu_zone_event_and_broadcasting_club': {
    logo: 'logo.png',
    avatar: 'avatar.jpg',
    coverImages: ['event.jpg', 'collective.jpg', 'events_1.jpg', 'post.jpg']
  },
  'swc_social_work_team': {
    logo: 'logo.jpg',
    avatar: 'avatar.jpg',
    coverImages: [
      'club_fair.jpg',
      'humanitarian_blood_donation.jpg',
      'team_building.jpg',
      'collective.jpg',
      'volunteer.jpg'
    ]
  },
  'the_glam_music_team': {
    logo: 'the_glam_logo.jpg',
    avatar: 'the_glam_collective_photo.jpg',
    coverImages: ['the_glam_collective_photo.jpg']
  },
  // Placeholder for clubs without custom images
  'placeholder': {
    logo: '/images/avt_placeholder.jpg',
    avatar: '/images/placeholder.svg',
    coverImages: []
  }
};

// Helper function to normalize club name for better matching
function normalizeClubName(name) {
  if (!name) return '';

  return name
    .toUpperCase()
    .replace(/\\n/g, ' ')   // Replace newline characters with space
    .replace(/\n/g, ' ')    // Replace actual newlines with space
    .replace(/\s+/g, ' ')   // Replace multiple spaces with single space
    .replace(/[^\w\sÀ-ỹ]/g, '') // Remove special characters except Vietnamese
    .trim();                // Remove leading/trailing spaces
}

/**
 * Parse category field from quiz data
 * Input: "Kinh doanh - Khởi nghiệp", "Kinh doanh - Khởi nghiệp / Ngôn ngữ"
 * Output: ["Kinh doanh - Khởi nghiệp", "Ngôn ngữ"]
 */
function parseCategoryField(categoryField) {
  if (!categoryField || typeof categoryField !== 'string') {
    return [];
  }

  // Split by "/" and clean up each category
  const categories = categoryField
    .split('/')
    .map(cat => cat.trim())
    .filter(cat => cat.length > 0);

  // Standard categories for validation
  const standardCategories = [
    'Khoa học - Lý luận',
    'Kinh doanh - Khởi nghiệp',
    'Ngôn ngữ',
    'Thể thao',
    'Truyền thông - Sự kiện',
    'Văn hóa - Nghệ thuật',
    'Xã hội - Tình nguyện'
  ];

  // Validate that each category is in our standard list
  const validCategories = categories.filter(cat =>
    standardCategories.includes(cat)
  );

  return validCategories;
}

/**
 * Get primary category (first one) from categories array
 */
function getPrimaryCategory(categories) {
  return Array.isArray(categories) && categories.length > 0 ? categories[0] : 'Khác';
}

// Advanced club name matching function
function findBestMatch(targetName, candidateNames) {
  const normalizedTarget = normalizeClubName(targetName);

  // Direct match first
  for (const candidate of candidateNames) {
    if (normalizeClubName(candidate) === normalizedTarget) {
      return candidate;
    }
  }

  // Partial match - check if target contains candidate or vice versa
  for (const candidate of candidateNames) {
    const normalizedCandidate = normalizeClubName(candidate);

    // Check if either contains the other
    if (normalizedTarget.includes(normalizedCandidate) ||
      normalizedCandidate.includes(normalizedTarget)) {
      return candidate;
    }
  }

  // Keyword matching - extract main keywords
  const targetKeywords = normalizedTarget
    .split(' ')
    .filter(word => word.length > 2) // Filter out short words
    .filter(word => !['CLB', 'DOI', 'NHOM', 'TRUONG', 'DH', 'NGOAI', 'THUONG'].includes(word));

  for (const candidate of candidateNames) {
    const candidateKeywords = normalizeClubName(candidate)
      .split(' ')
      .filter(word => word.length > 2)
      .filter(word => !['CLB', 'DOI', 'NHOM', 'TRUONG', 'DH', 'NGOAI', 'THUONG'].includes(word));

    // Check if at least 50% of keywords match
    const matchingKeywords = targetKeywords.filter(keyword =>
      candidateKeywords.some(candKeyword =>
        candKeyword.includes(keyword) || keyword.includes(candKeyword)
      )
    );

    if (matchingKeywords.length >= Math.min(2, Math.floor(targetKeywords.length * 0.5))) {
      return candidate;
    }
  }

  return null;
}

// Function to get club images
function getClubImages(clubName) {
  if (!clubName) {
    return {
      image: '/images/avt_placeholder.jpg',
      coverImage: '/images/placeholder.svg',
      logo: '/images/avt_placeholder.jpg',
      images: ['/images/placeholder.svg']
    };
  }

  const normalizedName = normalizeClubName(clubName);

  // Find folder using mapping
  let folderName = null;

  // Try exact match first
  if (CLUB_FOLDER_MAPPING[normalizedName]) {
    folderName = CLUB_FOLDER_MAPPING[normalizedName];
  } else {
    // Try keyword matching
    const keywordFolderMapping = {
      'SINH VIEN NCKH RCS': 'scientific_student_student_club_rcs',
      'KY NANG DOANH NHAN AC': 'ac_entrepreneur_skills_club',
      'MARKETING CREATIO': 'clb_marketing_ftu2_creatio',
      'KINH DOANH TIENG ANH BEC': 'business_and_english_club_bec',
      'TIENG NHAT FJC': 'japanese_foreign_trade_university_club_fjc',
      'THE THAO FSC': 'fsc_sports_club',
      'TO CHUC SU KIEN PHAT THANH FTU ZONE': 'ftu_zone_event_and_broadcasting_club',
      'TRUYEN THONG FTUNEWS': 'media_club_ftunews',
      'NHAC THE GLAM': 'the_glam_music_team',
      'CONG TAC XA HOI SWC': 'swc_social_work_team'
    };

    for (const [keyword, folder] of Object.entries(keywordFolderMapping)) {
      if (normalizedName.includes(keyword)) {
        folderName = folder;
        break;
      }
    }
  }

  // If no folder found or placeholder, return default images
  if (!folderName || folderName === 'placeholder') {
    return {
      image: '/images/avt_placeholder.jpg',
      coverImage: '/images/placeholder.svg',
      logo: '/images/avt_placeholder.jpg',
      images: ['/images/placeholder.svg']
    };
  }

  // Get file info from CLUB_FILES
  const filesInfo = CLUB_FILES[folderName];
  if (!filesInfo) {
    return {
      image: '/images/avt_placeholder.jpg',
      coverImage: '/images/placeholder.svg',
      logo: '/images/avt_placeholder.jpg',
      images: ['/images/placeholder.svg']
    };
  }

  // Build image paths
  const baseDir = `/logo_club_image/${folderName}`;
  return {
    image: filesInfo.avatar ? `${baseDir}/${filesInfo.avatar}` : '/images/avt_placeholder.jpg',
    coverImage: filesInfo.coverImages.length > 0 ? `${baseDir}/${filesInfo.coverImages[0]}` : '/images/placeholder.svg',
    logo: filesInfo.logo ? `${baseDir}/${filesInfo.logo}` : '/images/avt_placeholder.jpg',
    images: filesInfo.coverImages.length > 0 ?
      filesInfo.coverImages.map(img => `${baseDir}/${img}`) :
      ['/images/placeholder.svg']
  };
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
    'Khoa học - Lý luận': [
      { id: 4, name: 'Seminar nghiên cứu', frequency: 'Hàng tháng', time: 'Thứ 6, 3:00 PM' },
      { id: 5, name: 'Hội thảo khoa học', frequency: 'Hàng năm', time: 'Tháng 11' },
    ],
    'Kinh doanh - Khởi nghiệp': [
      { id: 4, name: 'Case study workshop', frequency: 'Hàng tháng', time: 'Thứ 6, 2:00 PM' },
      { id: 5, name: 'Startup pitching', frequency: 'Hàng quý', time: 'Cuối quý' },
    ],
    'Ngôn ngữ': [
      { id: 4, name: 'Lớp học ngôn ngữ', frequency: '2 lần/tuần', time: 'Thứ 3,5, 6:00 PM' },
      { id: 5, name: 'Giao lưu văn hóa', frequency: 'Hàng tháng', time: 'Chủ nhật cuối tháng' },
    ],
    'Thể thao': [
      { id: 4, name: 'Tập luyện', frequency: '3 lần/tuần', time: 'Thứ 2,4,6, 5:00 PM' },
      { id: 5, name: 'Giải đấu nội bộ', frequency: 'Hàng tháng', time: 'Chủ nhật đầu tháng' },
    ],
    'Truyền thông - Sự kiện': [
      { id: 4, name: 'Workshop truyền thông', frequency: 'Hàng tháng', time: 'Thứ 7, 2:00 PM' },
      { id: 5, name: 'Tổ chức sự kiện', frequency: 'Hàng quý', time: 'Cuối quý' },
    ],
    'Văn hóa - Nghệ thuật': [
      { id: 4, name: 'Buổi tập nhạc', frequency: '3 lần/tuần', time: 'Thứ 2,4,6, 7:00 PM' },
      { id: 5, name: 'Biểu diễn nghệ thuật', frequency: 'Hàng tháng', time: 'Thứ 7 đầu tháng' },
    ],
    'Xã hội - Tình nguyện': [
      { id: 4, name: 'Hoạt động tình nguyện', frequency: 'Hàng tháng', time: 'Chủ nhật thứ 2' },
      { id: 5, name: 'Chương trình từ thiện', frequency: 'Hàng quý', time: 'Theo kế hoạch' },
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
    'Kinh doanh - Khởi nghiệp': [
      { year: 2023, title: 'Giải nhất Business Case Competition', description: 'Vô địch cuộc thi phân tích tình huống kinh doanh' },
      { year: 2022, title: 'Top 3 Startup Idea Contest', description: 'Lọt vào top 3 cuộc thi ý tưởng khởi nghiệp cấp quốc gia' },
    ],
    'Truyền thông - Sự kiện': [
      { year: 2023, title: 'Giải nhì Media Contest', description: 'Đạt giải nhì cuộc thi sáng tạo nội dung truyền thông' },
      { year: 2022, title: 'Best Event Award', description: 'Giải thưởng sự kiện xuất sắc nhất' },
    ],
    'Xã hội - Tình nguyện': [
      { year: 2023, title: 'Chứng nhận cống hiến cộng đồng', description: 'Nhận chứng nhận vì các hoạt động tình nguyện xuất sắc' },
      { year: 2022, title: 'Giải thưởng Tình nguyện viên của năm', description: 'Được trao giải thưởng tình nguyện viên tiêu biểu' },
    ],
    'Ngôn ngữ': [
      { year: 2023, title: 'Giải nhất cuộc thi hùng biện', description: 'Vô địch cuộc thi hùng biện tiếng Anh cấp trường' },
      { year: 2022, title: 'Top 5 Culture Exchange Program', description: 'Lọt top 5 chương trình trao đổi văn hóa quốc tế' },
    ],
    'Thể thao': [
      { year: 2023, title: 'Vô địch giải thể thao sinh viên', description: 'Đạt chức vô địch giải thể thao sinh viên toàn quốc' },
      { year: 2022, title: 'Giải nhì cúp bóng đá FTU', description: 'Á quân giải bóng đá sinh viên FTU' },
    ],
    'Văn hóa - Nghệ thuật': [
      { year: 2023, title: 'Giải nhất FTU Got Talent', description: 'Quán quân cuộc thi tài năng FTU Got Talent' },
      { year: 2022, title: 'Best Performance Award', description: 'Giải thưởng tiết mục biểu diễn xuất sắc nhất' },
    ],
    'Khoa học - Lý luận': [
      { year: 2023, title: 'Giải nhất nghiên cứu khoa học', description: 'Đạt giải nhất hội nghị nghiên cứu khoa học sinh viên' },
      { year: 2022, title: 'Best Research Paper Award', description: 'Giải thưởng bài nghiên cứu xuất sắc nhất' },
    ]
  };

  return [...baseAchievements, ...(domainAchievements[club.domain] || [])];
}

// Function to read synthesis data
async function readSynthesisData() {
  try {
    const filePath = path.join(process.cwd(), 'data/synthesis.xlsx');
    await fs.promises.access(filePath);

    const fileBuffer = fs.readFileSync(filePath);
    const wb = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];

    const rawData = xlsx.utils.sheet_to_json(sheet, {
      defval: '',
      header: ['STT', 'CLB - ĐỘI - NHÓM', 'SƠ LƯỢC', 'KỲ TUYỂN THÀNH VIÊN', 'HOẠT ĐỘNG TÌNH NGUYỆN', 'GHI CHÚ']
    });

    // Skip header row
    return rawData.slice(1);
  } catch (error) {
    console.error('Error reading synthesis data:', error);
    return [];
  }
}

// Function to read quiz data
async function readQuizData() {
  try {
    const filePath = path.join(process.cwd(), 'data/quiz.xlsx');
    await fs.promises.access(filePath);

    const fileBuffer = fs.readFileSync(filePath);
    const wb = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];

    const rawData = xlsx.utils.sheet_to_json(sheet, {
      defval: '',
      header: ['Tên CLB', 'Nhóm lĩnh vực', 'Nhóm tính cách']
    });

    // Skip header row
    return rawData.slice(1);
  } catch (error) {
    console.error('Error reading quiz data:', error);
    return [];
  }
}

// Main function to fetch and combine club data
async function fetchClubsData() {
  try {
    const [synthesisData, quizData] = await Promise.all([
      readSynthesisData(),
      readQuizData()
    ]);

    if (synthesisData.length === 0) {
      return [];
    }

    // Get all quiz club names for matching
    const quizClubNames = quizData.map(q => q['Tên CLB']).filter(name => name);

    return synthesisData.map((row, index) => {
      const clubName = row['CLB - ĐỘI - NHÓM'] || '';

      if (!clubName.trim()) {
        return null; // Skip empty club names
      }

      // Find matching quiz data
      const matchedQuizClub = findBestMatch(clubName, quizClubNames);
      const quizInfo = matchedQuizClub
        ? quizData.find(q => q['Tên CLB'] === matchedQuizClub)
        : null;

      // Parse categories from quiz data
      let categories = [];
      let primaryDomain = 'Khác';

      if (quizInfo && quizInfo['Nhóm lĩnh vực']) {
        categories = parseCategoryField(quizInfo['Nhóm lĩnh vực']);
        primaryDomain = getPrimaryCategory(categories);
      }

      // Get images
      const images = getClubImages(clubName);

      // Create ID
      const id = row['STT'] ? String(row['STT']) : `club-${index + 1}`;

      const club = {
        id: id,
        name: clubName,
        summary: row['SƠ LƯỢC'] || '',
        recruitmentPeriod: row['KỲ TUYỂN THÀNH VIÊN'] || '',
        volunteerActivities: row['HOẠT ĐỘNG TÌNH NGUYỆN'] || '',
        notes: row['GHI CHÚ'] || '',

        // From quiz data - categories handling
        domain: primaryDomain, // Primary category for filtering
        categories: categories, // All categories for detailed view
        personalityType: quizInfo ? (quizInfo['Nhóm tính cách'] || null) : null,

        // Generated data
        memberCount: Math.floor(Math.random() * 100) + 20,
        isActive: Math.random() > 0.2,
        rating: (Math.random() * 2 + 3).toFixed(1),
        foundedYear: 2015 + Math.floor(Math.random() * 8),
        email: `club${id}@ftu.edu.vn`,
        phone: `+84${Math.floor(Math.random() * 900000000 + 100000000)}`,
        location: 'Phòng CLB, Tầng 3, Nhà A',

        // Images
        image: images.image,
        coverImage: images.coverImage,
        logo: images.logo,
        images: images.images
      };

      // Generate activities and achievements using primary domain
      club.activities = generateActivities(club);
      club.achievements = generateAchievements(club);
      club.socialLinks = {
        facebook: `https://facebook.com/club${club.id}`,
        instagram: `https://instagram.com/club${club.id}`,
        website: Math.random() > 0.5 ? `https://club${club.id}.ftu.edu.vn` : null,
      };

      return club;
    }).filter(club => club !== null); // Remove null entries

  } catch (error) {
    console.error('Error processing clubs data:', error);
    return [];
  }
}

export async function GET(request, { params }) {
  try {
    // Extract ID from params
    const { id } = params;

    // Check cache first
    if (cachedClubs && lastFetched && (Date.now() - lastFetched < CACHE_DURATION)) {
      const club = cachedClubs.find(c => String(c.id) === id);
      if (club) {
        return NextResponse.json(club);
      }
    }

    // Fetch all clubs
    const clubs = await fetchClubsData();

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