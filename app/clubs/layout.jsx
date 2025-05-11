import MainLayout from '@/components/MainLayout';

export const metadata = {
  title: 'Câu lạc bộ - FTU Clubs',
  description: 'Khám phá các câu lạc bộ đa dạng tại FTU, nơi bạn có thể phát triển kỹ năng và kết nối với bạn bè cùng sở thích',
  keywords: 'FTU, câu lạc bộ, clubs, sinh viên, hoạt động, student activities',
  openGraph: {
    title: 'Câu lạc bộ - FTU Clubs',
    description: 'Khám phá các câu lạc bộ đa dạng tại FTU',
    images: [
      {
        url: '/images/clubs-og.jpg',
        width: 1200,
        height: 630,
        alt: 'FTU Clubs',
      },
    ],
  },
};

export default function ClubsLayout({ children }) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}