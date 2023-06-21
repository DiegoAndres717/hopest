"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";

const BlogCard = ({
  blog: { title, desc, images, likes, author, id, createdAt },
}) => {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(0);

  useEffect(() => {
    session && likes && setIsLiked(likes.includes(session?.user?.id));
    session && likes && setBlogLikes(likes.length);
  }, [likes, session, setIsLiked]);
  
  const formattedDate = useMemo(() => {
    const dateString = createdAt;
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }, [createdAt]);

  const fetchLikeData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blog/${id}/like`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,        },
        method: "PUT",
      }
    );
  
    return res.ok;
  };
  
  const handleLike = async (e) => {
    e.preventDefault();
    
    try {
      const isLiked = await fetchLikeData();
      if (isLiked) {
        setIsLiked((prev) => !prev);
        setBlogLikes((prev) => prev - 1);
      } else {
        setIsLiked((prev) => !prev);
        setBlogLikes((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card w-full sm:w-96 h-auto bg-base-100 shadow-xl">
      <figure>
        <Link href={`/blog/${id}`}>
          <Image
            className="rounded-t-lg w-full object-cover"
            src={images[0]}
            width={384}
            height={227}
            alt={title}
            blurDataURL={images[0]}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      </figure>
      <div className="card-body w-80 lg:w-auto md:w-auto">
        <h2 className="card-title text-lg sm:text-xl">
          {title}
          <div className="badge badge-secondary text-xs">NEW</div>
        </h2>
        <p className="overflow-hidden line-clamp-3">{desc}</p>
        <div className="card">
          <span className="text-gray-400">
            <span>{formattedDate}</span>
          </span>
          {session?.user?.id ? (
            <div className="flex items-center justify-end mt-2">
              <div className="flex items-center justify-around text-white bg-blue-400 w-6 h-6 rounded-full mr-2">
              {blogLikes}{" "}
              </div>
              {isLiked ? (
                <div onClick={handleLike} className="flex justify-between cursor-pointer items-center p-1 border border-solid border-gray-400 rounded-md">
                  <AiFillHeart className="cursor-pointer text-red-700" onClick={handleLike} size={20} />
                  <p className="ml-2 text-black text-xs font-bold">Me gusta</p>
                </div>
                ) : (
                  <div onClick={handleLike} className="flex justify-between cursor-pointer items-center p-1 border border-solid border-gray-400 rounded-md">
                    <AiOutlineHeart className="cursor-pointer" size={20} />
                    <p className="ml-2 text-black text-xs font-semibold">Me gusta</p>
                  </div>
                  )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
