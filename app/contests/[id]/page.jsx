import ContestDetailClient from "./ContestDetailClient"

export default async function ContestDetail({ params }) {
  const { id } = await params

  return <ContestDetailClient id={id} />

}