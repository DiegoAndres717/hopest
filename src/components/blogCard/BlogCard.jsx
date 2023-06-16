"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useSession } from "next-auth/react";

const BlogCard = ({
  blog: { title, desc, imageUrl, likes, authorId, _id, createdAt },
}) => {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(0);

  useEffect(() => {
    session && likes && setIsLiked(likes.includes(session?.user?._id));
    session && likes && setBlogLikes(likes.length);
  }, [likes, session]);

  const dateString = createdAt;
const date = new Date(dateString);
const formattedDate = date.toLocaleDateString("es-ES", {
  year: "numeric",
  month: "long",
  day: "numeric"
});

  const handleLike = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BLOG_URL}/api/blog/${_id}/like`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "PUT",
        }
      );

      if (res.ok) {
        if (isLiked) {
          setIsLiked((prev) => !prev);
          setBlogLikes((prev) => prev - 1);
        } else {
          setIsLiked((prev) => !prev);
          setBlogLikes((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <Link href={`/blog/${_id}`}>
          <Image
            className="rounded-t-lg "
            src={imageUrl}
            width={384}
            height={227}
            alt={title}
          />
        </Link>
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {title}
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p>{desc}</p>
        <div className="card-actions justify-start">
          <span>
            <span>{formattedDate}</span>
          </span>
          {session?.user._id && (
            <div className="flex ml-16">
              {blogLikes}{" "}
              {isLiked ? (
                <AiFillLike className="ml-2 cursor-pointer" onClick={handleLike} size={25} />
              ) : (
                <AiOutlineLike onClick={handleLike} size={25} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
