// Add this to the top of /clubs/[id]/page.jsx
export async function generateMetadata({ params }) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/clubs/${params.id}`);

        if (!res.ok) {
            return {
                title: 'Câu lạc bộ không tìm thấy - FTU Clubs',
                description: 'Câu lạc bộ bạn đang tìm kiếm không tồn tại',
            };
        }

        const club = await res.json();

        return {
            title: `${club.name} - FTU Clubs`,
            description: club.summary,
            keywords: `${club.name}, ${club.domain}, FTU, câu lạc bộ, club, sinh viên`,
            openGraph: {
                title: club.name,
                description: club.summary,
                images: [
                    {
                        url: club.coverImage || club.image,
                        width: 1200,
                        height: 630,
                        alt: club.name,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: club.name,
                description: club.summary,
                images: [club.coverImage || club.image],
            },
        };
    } catch (error) {
        return {
            title: 'Câu lạc bộ - FTU Clubs',
            description: 'Thông tin về câu lạc bộ tại FTU',
        };
    }
}