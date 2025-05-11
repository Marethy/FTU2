import { contests } from '@/data/contests';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const club = searchParams.get('club');

        let filteredContests = [...contests];

        // Filter by status
        if (status) {
            filteredContests = filteredContests.filter(contest => contest.status === status);
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

        return NextResponse.json({
            contests: filteredContests,
            total: filteredContests.length
        });
    } catch (error) {
        console.error('Error in /api/contests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contests' },
            { status: 500 }
        );
    }
}