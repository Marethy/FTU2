import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import * as xlsx from 'xlsx';

// Cache for domains data
let cachedDomains = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to load domain and personality data from quiz.xlsx
async function loadDomainsFromQuiz() {
    try {
        // Check cache first
        if (cachedDomains && lastFetched && (Date.now() - lastFetched < CACHE_DURATION)) {
            return cachedDomains;
        }

        // Load workbook from disk
        const filePath = path.join(process.cwd(), 'data/quiz.xlsx');

        try {
            await fs.promises.access(filePath);
        } catch (error) {
            console.error('Quiz data file not found:', filePath);
            return { domains: [], personalityTypes: [] };
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

        // Parse the quiz data
        const quizData = xlsx.utils.sheet_to_json(sheet, {
            defval: '',
            header: ['index', 'clubName', 'domain', 'personalityType']
        });

        // Skip header row if it exists
        const dataWithoutHeader = quizData[0].clubName === 'Tên CLB' ? quizData.slice(1) : quizData;

        // Extract unique domains and personality types
        const uniqueDomains = new Set();
        const uniquePersonalityTypes = new Set();

        dataWithoutHeader.forEach(row => {
            if (row.domain) {
                // Handle domains that may contain multiple values separated by "/"
                const domains = row.domain.split('/').map(d => d.trim());
                domains.forEach(domain => {
                    if (domain) uniqueDomains.add(domain);
                });
            }
            if (row.personalityType) uniquePersonalityTypes.add(row.personalityType);
        });

        // Create domain slug mapping
        const domainSlugs = {};
        Array.from(uniqueDomains).forEach(domain => {
            // Create a slug from the domain name
            const slug = domain
                .toLowerCase()
                .normalize('NFD') // Normalize diacritical marks
                .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
                .replace(/đ/g, 'd')
                .replace(/[^\w\s-]/g, '') // Remove non-word chars
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-') // Replace multiple hyphens with a single one
                .trim();

            domainSlugs[domain] = slug;
        });

        // Create slugToName mapping
        const slugToName = Object.entries(domainSlugs).reduce((acc, [name, slug]) => {
            acc[slug] = name;
            return acc;
        }, {});

        const result = {
            domains: Array.from(uniqueDomains),
            personalityTypes: Array.from(uniquePersonalityTypes),
            domainSlugs,
            slugToName
        };

        // Update cache
        cachedDomains = result;
        lastFetched = Date.now();

        return result;
    } catch (error) {
        console.error('Error processing domains from quiz data:', error);
        return { domains: [], personalityTypes: [] };
    }
}

export async function GET() {
    try {
        const domainsData = await loadDomainsFromQuiz();
        return NextResponse.json(domainsData);
    } catch (error) {
        console.error('Error fetching domains:', error);
        return NextResponse.json(
            { error: 'Failed to fetch domains data' },
            { status: 500 }
        );
    }
}