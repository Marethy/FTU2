import ClubDetailClient from "@/app/clubs/[id]/ClubDetailClient";

export default async function ClubDetail({ params }) {
  // Await params before using its properties
  const { id } = await params;

  return <ClubDetailClient id={id} />;
}