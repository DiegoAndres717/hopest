'use client'

import { useSession } from "next-auth/react";
import { redirectIfUnauthenticated, renderLoadingModal } from "../../helper.js";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter()

  if(redirectIfUnauthenticated(status, router)) return;

  const loadinModal = renderLoadingModal(status);
  if(loadinModal) return loadinModal

  return (
    <div className="flex flex-col items-center">
      <Image
        className="w-32 h-32 rounded-full mt-4"
        width={150}
        height={150}
        src={session.user.image || '/login.webp'}
        alt="User image"
        placeholder="blur"
        blurDataURL={session.user.image || '/login.webp'}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <h1 className="text-2xl font-bold mt-4">{session.user.name}</h1>
      <p className="text-gray-600 mt-2">{session.user.email}</p>
    </div>
  );
};

export default Profile;
