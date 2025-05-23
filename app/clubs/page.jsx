// File: app/clubs/page.jsx
// Server Component
import ClientClubsPage from './ClientClubsPage';

export default async function ClubsPage({ searchParams }) {
  const params = await searchParams;

  return <ClientClubsPage />;
}