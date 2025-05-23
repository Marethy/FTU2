// File: app/api/clubs/route.js - Using Category Mapping
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import * as xlsx from 'xlsx';

// Cache for club data
let cachedClubs = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Domain slug mapping
const SLUG_TO_DOMAIN_MAPPING = {
  'khoa-hoc-ly-luan': 'Khoa học - Lý luận',
  'kinh-doanh-khoi-nghiep': 'Kinh doanh - Khởi nghiệp',
  'ngon-ngu': 'Ngôn ngữ',
  'the-thao': 'Thể thao',
  'truyen-thong-su-kien': 'Truyền thông - Sự kiện',
  'van-hoa-nghe-thuat': 'Văn hóa - Nghệ thuật',
  'xa-hoi-tinh-nguyen': 'Xã hội - Tình nguyện'
};

// Category to clubs mapping - This is the golden source!
const CATEGORY_TO_CLUBS = {
  'Khoa học - Lý luận': [
    'CLB SINH VIÊN NCKH RCS',
    'CLB HỢP TÁC QUỐC TẾ ICC',
    'CLB KẾ TOÁN - KIỂM TOÁN FAC',
    'CLB LUẬT THƯƠNG MẠI QUỐC TẾ ITLC',
    'CLB LÝ LUẬN TRẺ FTU2',
    'CLB TOÁN ỨNG DỤNG VÀ KHOA HỌC DỮ LIỆU MDS',
    'CLB ĐỔI MỚI VÀ SÁNG TẠO IC',
    'CLB SÁCH VÀ HÀNH ĐỘNG BAAC'
  ],
  'Kinh doanh - Khởi nghiệp': [
    'CLB KỸ NĂNG DOANH NHÂN AC',
    'CLB MARKETING CREATIO',
    'CLB KINH DOANH VÀ TIẾNG ANH BEC',
    'CLB CÔNG NGHỆ TÀI CHÍNH FINTECH',
    'CLB LOGISTICS LSC',
    'CLB NHÀ KINH TẾ TRẺ YEC',
    'CLB PHÁT TRIỂN NGUỒN NHÂN LỰC HUC',
    'CLB QUẢN TRỊ KINH DOANH BAC',
    'CLB TÀI CHÍNH - CHỨNG KHOÁN SeSC',
    'CỘNG ĐỒNG KHỞI NGHIỆP TRẺ NGOẠI THƯƠNG EHUB',
    'ĐỘI Ý TƯỞNG KINH DOANH BIT'
  ],
  'Ngôn ngữ': [
    'CLB KINH DOANH VÀ TIẾNG ANH BEC',
    'CLB TIẾNG NHẬT TRƯỜNG ĐH NGOẠI THƯƠNG FJC'
  ],
  'Thể thao': [
    'CLB THỂ THAO FSC'
  ],
  'Truyền thông - Sự kiện': [
    'CLB TỔ CHỨC SỰ KIỆN VÀ PHÁT THANH FTU ZONE',
    'CLB TRUYỀN THÔNG FTUNEWS',
    'CLB KỸ NĂNG VÀ SỰ KIỆN FTUYOURS',
    'CLB TRUYỀN THÔNG MARKETING TÍCH HỢP IMC'
  ],
  'Văn hóa - Nghệ thuật': [
    'ĐỘI NHẠC THE GLAM',
    'ĐỘI KỊCH LĂNG KÍNH',
    'ĐỘI MÚA LA BELLA',
    'ĐỘI NHẢY BLACKOUT',
    'ĐỘI TUYÊN TRUYỀN CA KHÚC CÁCH MẠNG TCM'
  ],
  'Xã hội - Tình nguyện': [
    'ĐỘI CÔNG TÁC XÃ HỘI SWC',
    'CLB FTU CONNECTION',
    'CLB ĐỒNG HÀNH CÙNG SINH VIÊN SCC',
    'CLB HỖ TRỢ VÀ PHÁT TRIỂN SINH VIÊN CLC HAD',
    'CLB SHARING - MENTORING - INSPIRING SMI',
    'CỘNG ĐỒNG HƯỚNG NGHIỆP & PHÁT TRIỂN SỰ NGHIỆP CUC'
  ]
};

// Create reverse mapping (club name to categories)
const CLUB_TO_CATEGORIES = {};
Object.entries(CATEGORY_TO_CLUBS).forEach(([category, clubs]) => {
  clubs.forEach(club => {
    if (!CLUB_TO_CATEGORIES[club]) {
      CLUB_TO_CATEGORIES[club] = [];
    }
    CLUB_TO_CATEGORIES[club].push(category);
  });
});

// CLUB_FOLDER_MAPPING for images
const CLUB_FOLDER_MAPPING = {
  'CLB SINH VIÊN NCKH RCS': 'scientific_student_student_club_rcs',
  'CLB KỸ NĂNG DOANH NHÂN AC': 'ac_entrepreneur_skills_club',
  'CLB MARKETING CREATIO': 'clb_marketing_ftu2_creatio',
  'CLB KINH DOANH VÀ TIẾNG ANH BEC': 'business_and_english_club_bec',
  'CLB TIẾNG NHẬT TRƯỜNG ĐH NGOẠI THƯƠNG FJC': 'japanese_foreign_trade_university_club_fjc',
  'CLB THỂ THAO FSC': 'fsc_sports_club',
  'CLB TỔ CHỨC SỰ KIỆN VÀ PHÁT THANH FTU ZONE': 'ftu_zone_event_and_broadcasting_club',
  'CLB TRUYỀN THÔNG FTUNEWS': 'media_club_ftunews',
  'ĐỘI NHẠC THE GLAM': 'the_glam_music_team',
  'ĐỘI CÔNG TÁC XÃ HỘI SWC': 'swc_social_work_team'
};

// Image files mapping
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
  }
};

// Function to get club images
function getClubImages(clubName) {
  const folderName = CLUB_FOLDER_MAPPING[clubName];

  if (!folderName || !CLUB_FILES[folderName]) {
    return {
      image: '/images/avt_placeholder.jpg',
      coverImage: '/images/placeholder.svg',
      logo: '/images/avt_placeholder.jpg',
      images: ['/images/placeholder.svg']
    };
  }

  const filesInfo = CLUB_FILES[folderName];
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

// Function to generate activities based on domain
function generateActivities(domain) {
  const baseActivities = [
    { id: 1, name: 'Họp định kỳ', frequency: 'Hàng tuần', time: 'Thứ 7, 9:00 AM' },
    { id: 2, name: 'Workshop chuyên đề', frequency: 'Hàng tháng', time: 'Cuối tháng' },
    { id: 3, name: 'Sự kiện giao lưu', frequency: 'Hàng quý', time: 'Theo thông báo' },
  ];

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

  return [...baseActivities, ...(domainActivities[domain] || [])];
}

// Function to generate achievements based on domain
function generateAchievements(domain) {
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

  return [...baseAchievements, ...(domainAchievements[domain] || [])];
}

// Function to read synthesis data for additional info
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

    // Convert to object for easy lookup
    const dataMap = {};
    rawData.slice(1).forEach(row => {
      const clubName = row['CLB - ĐỘI - NHÓM'];
      if (clubName && typeof clubName === 'string') {
        dataMap[clubName.trim()] = row;
      }
    });

    return dataMap;
  } catch (error) {
    console.log('⚠️ Could not read synthesis data:', error.message);
    return {};
  }
}

// Function to read quiz data for personality types
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

    // Convert to object for easy lookup
    const dataMap = {};
    rawData.slice(1).forEach(row => {
      const clubName = row['Tên CLB'];
      if (clubName && typeof clubName === 'string') {
        dataMap[clubName.trim()] = row;
      }
    });

    return dataMap;
  } catch (error) {
    console.log('⚠️ Could not read quiz data:', error.message);
    return {};
  }
}

// Generate personality types
const PERSONALITY_TYPES = [
  'Lãnh đạo', 'Sáng tạo', 'Xã hội', 'Phân tích', 'Thực tế', 'Hỗ trợ'
];

// Main function to create clubs data
async function fetchClubsData() {
  try {
    console.log('🚀 Generating clubs data from category mapping...');

    // Read additional data files
    const [synthesisData, quizData] = await Promise.all([
      readSynthesisData(),
      readQuizData()
    ]);

    const clubs = [];
    let clubId = 1;

    // Generate clubs based on category mapping
    Object.entries(CATEGORY_TO_CLUBS).forEach(([domain, clubNames]) => {
      clubNames.forEach((clubName, index) => {
        // Get additional data from files
        const synthesiInfo = synthesisData[clubName] || {};
        const quizInfo = quizData[clubName] || {};

        // Get all categories this club belongs to
        const categories = CLUB_TO_CATEGORIES[clubName] || [domain];

        // Get images
        const images = getClubImages(clubName);

        // Create club object
        const club = {
          id: String(clubId++),
          name: clubName,
          summary: synthesiInfo['SƠ LƯỢC'] || `${clubName} là một câu lạc bộ năng động tại FTU, tập trung vào lĩnh vực ${domain}.`,
          recruitmentPeriod: synthesiInfo['KỲ TUYỂN THÀNH VIÊN'] || 'Đầu mỗi học kỳ',
          volunteerActivities: synthesiInfo['HOẠT ĐỘNG TÌNH NGUYỆN'] || `Tham gia các hoạt động ${domain.toLowerCase()}`,
          notes: synthesiInfo['GHI CHÚ'] || '',

          // Categories
          domain: domain, // Primary domain
          categories: categories, // All categories this club belongs to
          personalityType: quizInfo['Nhóm tính cách'] || PERSONALITY_TYPES[Math.floor(Math.random() * PERSONALITY_TYPES.length)],

          // Generated data
          memberCount: Math.floor(Math.random() * 100) + 20,
          isActive: Math.random() > 0.1, // 90% active
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
          foundedYear: 2015 + Math.floor(Math.random() * 10),
          email: `${clubName.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '')}@ftu.edu.vn`,
          phone: `+84${Math.floor(Math.random() * 900000000 + 100000000)}`,
          location: 'Phòng CLB, Tầng 3, Nhà A',

          // Images
          image: images.image,
          coverImage: images.coverImage,
          logo: images.logo,
          images: images.images,

          // Activities and achievements
          activities: generateActivities(domain),
          achievements: generateAchievements(domain),
          socialLinks: {
            facebook: `https://facebook.com/${clubName.toLowerCase().replace(/\s+/g, '')}`,
            instagram: `https://instagram.com/${clubName.toLowerCase().replace(/\s+/g, '')}`,
            website: Math.random() > 0.5 ? `https://${clubName.toLowerCase().replace(/\s+/g, '')}.ftu.edu.vn` : null,
          }
        };

        clubs.push(club);
      });
    });

    console.log(`✅ Generated ${clubs.length} clubs from category mapping`);
    return clubs;

  } catch (error) {
    console.error('❌ Error generating clubs data:', error);
    return [];
  }
}

export async function GET(request) {
  try {
    console.log('🚀 GET /api/clubs called');

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const domainSlug = searchParams.get('domain');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || null;
    const offset = parseInt(searchParams.get('offset')) || 0;

    console.log('🔍 Query params:', { domainSlug, search, limit, offset });

    // Check cache first
    if (cachedClubs && lastFetched && (Date.now() - lastFetched < CACHE_DURATION)) {
      let clubs = cachedClubs;

      // Filter by domain if domain slug is provided
      if (domainSlug && SLUG_TO_DOMAIN_MAPPING[domainSlug]) {
        const domainName = SLUG_TO_DOMAIN_MAPPING[domainSlug];
        console.log(`🏷️ Filtering by domain: ${domainSlug} -> ${domainName}`);

        clubs = clubs.filter(club => {
          // Check if club's primary domain matches OR if club has this domain in categories
          return club.domain === domainName ||
            (club.categories && club.categories.includes(domainName));
        });

        console.log(`📊 Found ${clubs.length} clubs for domain ${domainName}`);
      }

      // Filter by search if provided
      if (search) {
        const searchLower = search.toLowerCase();
        clubs = clubs.filter(club =>
          club.name.toLowerCase().includes(searchLower) ||
          club.summary.toLowerCase().includes(searchLower) ||
          club.domain.toLowerCase().includes(searchLower)
        );
        console.log(`🔎 Found ${clubs.length} clubs matching search "${search}"`);
      }

      // Apply pagination if limit is provided
      if (limit) {
        clubs = clubs.slice(offset, offset + limit);
      }

      return NextResponse.json({
        clubs,
        total: cachedClubs.length,
        filtered: clubs.length,
        filters: {
          domain: domainSlug ? SLUG_TO_DOMAIN_MAPPING[domainSlug] : null,
          search
        }
      });
    }

    // Fetch club data
    const allClubs = await fetchClubsData();

    // Update cache
    cachedClubs = allClubs;
    lastFetched = Date.now();

    let clubs = allClubs;

    // Filter by domain if domain slug is provided
    if (domainSlug && SLUG_TO_DOMAIN_MAPPING[domainSlug]) {
      const domainName = SLUG_TO_DOMAIN_MAPPING[domainSlug];
      console.log(`🏷️ Filtering by domain: ${domainSlug} -> ${domainName}`);

      clubs = clubs.filter(club => {
        // Check if club's primary domain matches OR if club has this domain in categories
        return club.domain === domainName ||
          (club.categories && club.categories.includes(domainName));
      });

      console.log(`📊 Found ${clubs.length} clubs for domain ${domainName}`);
    }

    // Filter by search if provided
    if (search) {
      const searchLower = search.toLowerCase();
      clubs = clubs.filter(club =>
        club.name.toLowerCase().includes(searchLower) ||
        club.summary.toLowerCase().includes(searchLower) ||
        club.domain.toLowerCase().includes(searchLower)
      );
      console.log(`🔎 Found ${clubs.length} clubs matching search "${search}"`);
    }

    // Apply pagination if limit is provided
    if (limit) {
      clubs = clubs.slice(offset, offset + limit);
    }

    console.log(`📤 Returning ${clubs.length} clubs (total: ${allClubs.length})`);

    // Return data
    return NextResponse.json({
      clubs,
      total: allClubs.length,
      filtered: clubs.length,
      filters: {
        domain: domainSlug ? SLUG_TO_DOMAIN_MAPPING[domainSlug] : null,
        search
      }
    });
  } catch (error) {
    console.error('❌ Error in clubs API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load clubs data';
    return NextResponse.json({
      error: errorMessage,
      clubs: [],
      total: 0,
      filtered: 0
    }, { status: 500 });
  }
}