// File 2: app/api/clubs/[id]/route.js
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import * as xlsx from 'xlsx';

// Cache for club data
let cachedClubs = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Danh sách các CLB có thư mục ảnh sẵn có
const CLUBS_WITH_IMAGES = [
  'CLB SINH VIÊN NCKH RCS',
  'CLB KỸ NĂNG DOANH NHÂN AC',
  'CLB MARKETING CREATIO',
  'CLB KINH DOANH VÀ TIẾNG ANH BEC',
  'CLB TIẾNG NHẬT TRƯỜNG ĐH NGOẠI THƯƠNG FJC',
  'CLB THỂ THAO FSC',
  'CLB TỔ CHỨC SỰ KIỆN VÀ PHÁT THANH FTU ZONE',
  'CLB TRUYỀN THÔNG FTUNEWS',
  'ĐỘI NHẠC THE GLAM',
  'ĐỘI CÔNG TÁC XÃ HỘI SWC'
];

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
  'SWC': 'swc_social_work_team',

  // 25 CLB còn lại (không có thư mục ảnh riêng)
  'CLB HỢP TÁC QUỐC TẾ ICC': 'placeholder',
  'CLB KẾ TOÁN - KIỂM TOÁN FAC': 'placeholder',
  'CLB LUẬT THƯƠNG MẠI QUỐC TẾ ITLC': 'placeholder',
  'CLB LÝ LUẬN TRẺ FTU2': 'placeholder',
  'CLB TOÁN ỨNG DỤNG VÀ KHOA HỌC DỮ LIỆU MDS': 'placeholder',
  'CLB ĐỔI MỚI VÀ SÁNG TẠO IC': 'placeholder',
  'CLB SÁCH VÀ HÀNH ĐỘNG BAAC': 'placeholder',
  'CLB CÔNG NGHỆ TÀI CHÍNH FINTECH': 'placeholder',
  'CLB LOGISTICS LSC': 'placeholder',
  'CLB NHÀ KINH TẾ TRẺ YEC': 'placeholder',
  'CLB PHÁT TRIỂN NGUỒN NHÂN LỰC HUC': 'placeholder',
  'CLB QUẢN TRỊ KINH DOANH BAC': 'placeholder',
  'CLB TÀI CHÍNH - CHỨNG KHOÁN SeSC': 'placeholder',
  'CỘNG ĐỒNG KHỞI NGHIỆP TRẺ NGOẠI THƯƠNG EHUB': 'placeholder',
  'ĐỘI Ý TƯỞNG KINH DOANH BIT': 'placeholder',
  'CLB KỸ NĂNG VÀ SỰ KIỆN FTUYOURS': 'placeholder',
  'CLB TRUYỀN THÔNG MARKETING TÍCH HỢP IMC': 'placeholder',
  'ĐỘI KỊCH LĂNG KÍNH': 'placeholder',
  'ĐỘI MÚA LA BELLA': 'placeholder',
  'ĐỘI NHẢY BLACKOUT': 'placeholder',
  'ĐỘI TUYÊN TRUYỀN CA KHÚC CÁCH MẠNG TCM': 'placeholder',
  'CLB FTU CONNECTION': 'placeholder',
  'CLB ĐỒNG HÀNH CÙNG SINH VIÊN SCC': 'placeholder',
  'CLB HỖ TRỢ VÀ PHÁT TRIỂN SINH VIÊN CLC HAD': 'placeholder',
  'CLB SHARING - MENTORING - INSPIRING SMI': 'placeholder',
  'CỘNG ĐỒNG HƯỚNG NGHIỆP & PHÁT TRIỂN SỰ NGHIỆP CUC': 'placeholder'
};

// Image files mapping based on actual folder contents from structure.md
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
  // Phần placeholder cho các CLB không có folder ảnh riêng
  'placeholder': {
    logo: null, // Sẽ sử dụng placeholder mặc định
    avatar: null, // Sẽ sử dụng placeholder mặc định
    coverImages: [] // Sẽ sử dụng placeholder mặc định
  }
};

// Helper function to normalize club name for better matching
function normalizeClubName(name) {
  if (!name) return '';

  // Xử lý các ký tự đặc biệt, xuống dòng và khoảng trắng
  return name
    .toUpperCase()
    .replace(/\\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

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
  console.log(`Normalized name: "${normalizedName}"`);

  const keywordFolderMapping = {
    'SINH VIEN NCKH RCS': 'scientific_student_student_club_rcs',
    'KY NANG DOANH NHAN AC': 'ac_entrepreneur_skills_club',
    'MARKETING CREATIO': 'clb_marketing_ftu2_creatio',
    'KINH DOANH VA TIENG ANH BEC': 'business_and_english_club_bec',
    'TIENG NHAT FJC': 'japanese_foreign_trade_university_club_fjc',
    'THE THAO FSC': 'fsc_sports_club',
    'TO CHUC SU KIEN VA PHAT THANH FTU ZONE': 'ftu_zone_event_and_broadcasting_club',
    'TRUYEN THONG FTUNEWS': 'media_club_ftunews',
    'NHAC THE GLAM': 'the_glam_music_team',
    'CONG TAC XA HOI SWC': 'swc_social_work_team'
  };

  let folderName = null;
  for (const [keyword, folder] of Object.entries(keywordFolderMapping)) {
    const simplifiedKeyword = keyword
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const simplifiedName = normalizedName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (simplifiedName.includes(simplifiedKeyword)) {
      folderName = folder;
      console.log(`Found folder match: ${folderName} for keyword: ${keyword}`);
      break;
    }
  }

  if (!folderName) {
    folderName = CLUB_FOLDER_MAPPING[normalizedName];
  }

  if (!folderName || folderName === 'placeholder') {
    return {
      image: '/images/avt_placeholder.jpg',
      coverImage: '/images/placeholder.svg',
      logo: '/images/avt_placeholder.jpg',
      images: ['/images/placeholder.svg']
    };
  }

  // Lấy thông tin file từ CLUB_FILES
  const filesInfo = CLUB_FILES[folderName];
  if (!filesInfo) {
    return {
      image: '/images/avt_placeholder.jpg',
      coverImage: '/images/placeholder.svg',
      logo: '/images/avt_placeholder.jpg',
      images: ['/images/placeholder.svg']
    };
  }

  // Xây dựng đường dẫn ảnh
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

// Đọc dữ liệu từ file FTU2-data.xlsx (bỏ dòng đầu tiên)
async function fetchClubsData() {
  try {
    const filePath = path.join(process.cwd(), 'data/FTU2-data.xlsx');

    try {
      await fs.promises.access(filePath);
    } catch (error) {
      console.error('Data file not found:', filePath);
      return [];
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

    // Đọc toàn bộ dữ liệu từ file Excel
    const rawData = xlsx.utils.sheet_to_json(sheet, {
      defval: '',
      header: ['STT', 'CLB - ĐỘI - NHÓM', 'SƠ LƯỢC', 'CUỘC THI/CHƯƠNG TRÌNH', 'PHẢN HỒI']
    });

    // Bỏ dòng đầu tiên (dòng tiêu đề)
    const clubData = rawData.slice(1);

    // Format dữ liệu CLB
    return clubData.map((r, index) => {
      const clubName = r['CLB - ĐỘI - NHÓM'] || '';
      const images = getClubImages(clubName);

      // Đảm bảo ID duy nhất
      const id = r['STT'] ? String(r['STT']) : `club-${index + 1}`;

      const club = {
        id: id,
        name: clubName,
        summary: r['SƠ LƯỢC'] || '',
        contests: r['CUỘC THI/CHƯƠNG TRÌNH'] || '',
        feedback: r['PHẢN HỒI'] || '',
        // Thêm các trường bổ sung
        memberCount: Math.floor(Math.random() * 100) + 20,
        isActive: Math.random() > 0.2,
        rating: (Math.random() * 2 + 3).toFixed(1),
        image: images.image,
        coverImage: images.coverImage,
        logo: images.logo,
        images: images.images,
        foundedYear: 2015 + Math.floor(Math.random() * 8),
        email: `club${id}@ftu.edu.vn`,
        phone: `+84${Math.floor(Math.random() * 900000000 + 100000000)}`,
        location: 'Phòng CLB, Tầng 3, Nhà A',
      };

      // Thêm domain và dữ liệu liên quan
      club.domain = extractDomain(club);
      club.activities = generateActivities(club);
      club.achievements = generateAchievements(club);
      club.socialLinks = {
        facebook: `https://facebook.com/club${club.id}`,
        instagram: `https://instagram.com/club${club.id}`,
        website: Math.random() > 0.5 ? `https://club${club.id}.ftu.edu.vn` : null,
      };

      return club;
    });
  } catch (error) {
    console.error('Error reading club data:', error);
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

    // Fetch all clubs (with support for all 35 CLB and skipping first row)
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