import { Suspense } from 'react'
import LoadingModal from '../components/modals/LoadingModal'
 
export default function Loading() {
  return (
    <>
      <Suspense fallback={<LoadingModal />}>
        <LoadingModal />
      </Suspense>
    </>
  )
}