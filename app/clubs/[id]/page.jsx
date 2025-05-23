import ClubDetailClient from './ClubDetailClient';

export default async function ClubDetailPage({ searchParams }) {
  // Await searchParams to handle the async nature of Next.js 15+
  const params = await searchParams;

  return <ClubDetailClient searchParams={params} />;
}