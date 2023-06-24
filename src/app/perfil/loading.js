import { Suspense } from "react";
import SkeletonPerfil from "../components/skeletons/SkeletonPerfil";



const Loading = () => {
  return  (
    <>
      <Suspense fallback={<SkeletonPerfil />}>
        <SkeletonPerfil />
      </Suspense>
    </>
  )
}
 
export default Loading;