import { contests } from '@/data/contests';
import { NextResponse } from 'next/server';

export async function GET(request, context) {
    try {
        // Await params từ context
        const { id } = await context.params;
        const contestId = parseInt(id);

        if (isNaN(contestId)) {
            return NextResponse.json(
                { error: 'Invalid contest ID' },
                { status: 400 }
            );
        }

        const contest = contests.find(c => c.id === contestId);

        if (!contest) {
            return NextResponse.json(
                { error: 'Contest not found' },
                { status: 404 }
            );
        }

        const enrichedContest = {
            ...contest,
            daysLeft: Math.ceil((new Date(contest.deadline) - new Date()) / (1000 * 60 * 60 * 24)),
            relatedContests: contests
                .filter(c => c.club === contest.club && c.id !== contest.id)
                .slice(0, 3)
        };

        return NextResponse.json({ contest: enrichedContest });
    } catch (error) {
        console.error('Error in /api/contests/[id]:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contest' },
            { status: 500 }
        );
    }
}