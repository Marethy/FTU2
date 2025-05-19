import { Card, Skeleton } from 'antd'
import { Suspense } from "react"
import ContestDetailClient from "./ContestDetailClient"

// Component loading cho khi Suspense đang chờ
const LoadingFallback = () => (
  <div style={{ padding: '24px' }}>
    <Card>
      <Skeleton active paragraph={{ rows: 10 }} />
    </Card>
  </div>
)

export default async function ContestDetail({ params }) {
  const { id } = params

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ContestDetailClient id={id} />
    </Suspense>
  )
}