// File: app/api/domains/route.js
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import * as xlsx from 'xlsx';

// Cache for domain data
let cachedDomains = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Standard 7 domains for FTU clubs with fixed mapping
const STANDARD_DOMAINS = [
    'Khoa học - Lý luận',
    'Kinh doanh - Khởi nghiệp',
    'Ngôn ngữ',
    'Thể thao',
    'Truyền thông - Sự kiện',
    'Văn hóa - Nghệ thuật',
    'Xã hội - Tình nguyện'
];

// Fixed domain slug mapping as requested
const DOMAIN_SLUG_MAPPING = {
    'Khoa học - Lý luận': 'khoa-hoc-ly-luan',
    'Kinh doanh - Khởi nghiệp': 'kinh-doanh-khoi-nghiep',
    'Ngôn ngữ': 'ngon-ngu',
    'Thể thao': 'the-thao',
    'Truyền thông - Sự kiện': 'truyen-thong-su-kien',
    'Văn hóa - Nghệ thuật': 'van-hoa-nghe-thuat',
    'Xã hội - Tình nguyện': 'xa-hoi-tinh-nguyen'
};

// Create reverse mapping (slug to domain name)
const SLUG_TO_DOMAIN_MAPPING = {};
Object.entries(DOMAIN_SLUG_MAPPING).forEach(([domain, slug]) => {
    SLUG_TO_DOMAIN_MAPPING[slug] = domain;
});

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

    // Validate that each category is in our standard list
    const validCategories = categories.filter(cat =>
        STANDARD_DOMAINS.includes(cat)
    );

    return validCategories;
}

// Function to read quiz data and extract domains
async function fetchDomainsData() {
    try {
        const filePath = path.join(process.cwd(), 'data/quiz.xlsx');

        try {
            await fs.promises.access(filePath);
        } catch (error) {
            console.warn('Quiz data file not found, using default domains:', filePath);
            return getDefaultDomains();
        }

        const fileBuffer = fs.readFileSync(filePath);
        const wb = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheet = wb.Sheets[wb.SheetNames[0]];

        const rawData = xlsx.utils.sheet_to_json(sheet, {
            defval: '',
            header: ['Tên CLB', 'Nhóm lĩnh vực', 'Nhóm tính cách']
        });

        // Skip header row and extract domains from 'Nhóm lĩnh vực' column
        const domainData = rawData.slice(1);
        const allFoundCategories = new Set();

        domainData.forEach(row => {
            const categoryField = row['Nhóm lĩnh vực'];
            const categories = parseCategoryField(categoryField);
            categories.forEach(cat => allFoundCategories.add(cat));
        });

        const extractedDomains = Array.from(allFoundCategories);
        console.log('Parsed domains from quiz file:', extractedDomains);

        // Use found domains if they're valid standard domains, otherwise use all standard domains
        const validDomains = extractedDomains.filter(domain => STANDARD_DOMAINS.includes(domain));
        const finalDomains = validDomains.length > 0 ? validDomains.sort() : STANDARD_DOMAINS;

        console.log('Final domains to be used:', finalDomains);

        return {
            domains: finalDomains,
            domainSlugs: DOMAIN_SLUG_MAPPING,
            slugToName: SLUG_TO_DOMAIN_MAPPING,
            _debug: {
                rawCategoryFields: domainData.map(r => r['Nhóm lĩnh vực']).filter(f => f).slice(0, 5),
                extractedFromFile: extractedDomains,
                validStandardDomains: validDomains,
                usingFallback: validDomains.length === 0
            }
        };

    } catch (error) {
        console.error('Error reading quiz data, using default domains:', error);
        return getDefaultDomains();
    }
}

// Default domains if file is not available
function getDefaultDomains() {
    return {
        domains: STANDARD_DOMAINS,
        domainSlugs: DOMAIN_SLUG_MAPPING,
        slugToName: SLUG_TO_DOMAIN_MAPPING
    };
}

export async function GET() {
    try {
        // Check cache first
        if (cachedDomains && lastFetched && (Date.now() - lastFetched < CACHE_DURATION)) {
            return NextResponse.json(cachedDomains);
        }

        // Fetch domain data
        const domainData = await fetchDomainsData();

        // Update cache
        cachedDomains = domainData;
        lastFetched = Date.now();

        console.log(`Returning ${domainData.domains.length} domains`);

        return NextResponse.json(domainData);
    } catch (error) {
        console.error('Error processing domains data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load domains data';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}