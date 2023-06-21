"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BsFillPencilFill } from "react-icons/bs";
import { AiFillDelete, AiFillHeart, AiOutlineHeart, AiOutlineSend } from "react-icons/ai";
import { IoMdSend } from 'react-icons/io'
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "timeago.js";
import { useRouter } from "next/navigation";
import Comment from "@/components/comment/Comment";
import BlogLayout from "../layout";
import LoadingModal from "@/app/components/modals/LoadingModal";

const BlogDetails = (ctx) => {
  const [blogDetails, setBlogDetails] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const router = useRouter();

  useEffect(() => {
    async function fetchComments() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment/${ctx.params.id}`,
        { cache: "no-store" }
      );
      const comments = await res.json();

      setComments(comments);
    }
    fetchComments();
  }, [ctx.params.id]);
 
  
  useEffect(() => {
    async function fetchBlog() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blog/${ctx.params.id}`,
        { cache: "no-store" }
      );
      const blog = await res.json();
      
      setBlogDetails(blog);
      setIsLiked(blog?.likes?.includes(session?.user?.id));
      setBlogLikes(blog?.likes?.length || 0);
      setIsLoading(false);
    }
    session && fetchBlog();
  }, [ctx.params.id, session]);

  if (status === "unauthenticated") {
    router.push("/");
    return;
  }

  const handleDelete = async () => {
    try {
      const confirmModal = confirm(
        "Are you sure you want to delete your blog?"
      );

      if (confirmModal) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/blog/${ctx.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
            method: "DELETE",
          }
        );

        if (res.ok) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blog/${ctx.params.id}/like`,
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

  const handleComment = async () => {
    if (commentText?.length < 2) {
      toast.error("Comment must be at least 2 characters long");
      return;
    }

    try {
      const body = {
        blogId: ctx.params.id,
        authorId: session?.user?.id,
        text: commentText,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      const newComment = await res.json();

      setComments((prev) => {
        return [newComment, ...prev];
      });

      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleNext = () => {
    setCurrentSlide((prev) =>
      prev === blogDetails?.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const handlePrev = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? blogDetails?.images.length - 1 : prev - 1
    );
  };
  

  return (
    <BlogLayout>
      {isLoading ? (
        <LoadingModal />
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div className="card max-w-xl bg-base-100 shadow-xl mt-6">
            <figure>
             <div className="carousel w-full">             
                  <div id="slide1" className="carousel-item relative w-full">
                    <Image
                      className="rounded-t-lg w-full object-cover"
                      src={blogDetails?.images[currentSlide]}
                      width={750}
                      height={650}
                      alt={blogDetails?.title}
                      blurDataURL={blogDetails?.images[currentSlide]}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <a onClick={handlePrev} className="btn btn-circle">❮</a> 
                      <a onClick={handleNext} className="btn btn-circle">❯</a>
                    </div>
                  </div>                
              </div>
            </figure>

            <div className="card-body">
              <div className="flex justify-between">
                <h2 className="card-title text-base sm:text-2xl">
                  {blogDetails?.title}
                  <div className="badge badge-secondary text-xs">NEW</div>
                </h2>
                {blogDetails?.author?.id.toString() ===
                  session?.user?.id.toString() ? (
                  <div className={"flex justify-end items-end gap-x-2"}>
                    <Link
                      className={'outline-none border border-transparent bg-green-500 text-white py-2 px-3 flex gap-3 items-center rounded-lg cursor-pointer text-lg font-bold transition duration-150 hover:bg-white hover:border-green-500 hover:text-green-500'}
                      href={`/blog/edit/${ctx.params.id}`}
                    >
                      <span className="hidden sm:inline">
                      Edit 
                      </span>
                      <BsFillPencilFill />
                    </Link>
                    <button
                      onClick={handleDelete}
                      className={'outline-none border border-transparent bg-red-500 text-white py-2 px-3 flex gap-3 items-center rounded-lg cursor-pointer text-lg font-bold transition duration-150 hover:bg-white hover:border-red-500 hover:text-red-500'}
                    >
                      <span className="hidden sm:inline">
                      Delete
                      </span>
                      <AiFillDelete />
                    </button>
                  </div>
                ) : (
                  <div className={'flex items-center gap-2 text-base sm:text-xs text-amber-900'}>
                    Autor: <span>{blogDetails?.author?.name}</span>
                  </div>
                )}
              </div>
              <div className="card-actions justify-between mt-2">
                <div className={'flex justify-start items-center gap-5 text-lg font-bold'}>
                  Category:
                  <span className="py-2 px-3 bg-green-500 text-white rounded-full text-base font-medium">{blogDetails?.category}</span>
                </div>
                {session?.user?.id ? (
            <div className="flex items-center justify-between ml-1">
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

              <div className="flex justify-between mt-4">
                <p>{blogDetails?.desc}</p>
                <span className="text-sm w-24">
                   <span className="text-xs">{format(blogDetails?.createdAt)}</span>
                </span>
              </div>
            </div>
          </div>

          <div
            className={
              "mx-auto mt-24 w-full sm:w-1/2 md:w-1/2 flex flex-col items-center justify-center border border-gray-700 rounded-xl"
            }
          >
            <div
              className={
                "p-4 w-full flex items-center gap-6 border-b border-gray-500"
              }
            >
              <Image
                className="object-cover rounded-full"
                src={session?.user?.image || '/../public/login.webp'}
                width="45"
                height="45"
                alt=""
              />
              <input
                value={commentText}
                className="flex-1 outline-none border-none py-1 border-b border-gray-700 w-full sm:w-auto md:w-auto"
                type="text"
                placeholder="Type message..."
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                disabled={!session?.user?.id ? true : false}
                className={
                  !session?.user?.id
                    ? "outline-none border-none bg-gray-800 text-white py-1 rounded-md w-8 text-base sm:text-lg cursor-not-allowed"
                    : "outline-none border-none bg-blue-800 text-white py-1 rounded-md w-8 text-base sm:text-lg cursor-pointer"
                }
                onClick={handleComment}
              >
                <IoMdSend className="ml-1"/>
              </button>
            </div>
            <div
              className={
                "max-h-75 overflow-auto mt-5 w-full p-4 flex flex-col items-center gap-8"
              }
            >
              {comments?.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    key={comments.id}
                    comment={comment}
                    setComments={setComments}
                  />
                ))
              ) : (
                <h4 className={"p-5 text-2xl text-gray-900"}>
                  No comments. Be the first one to leave a comment!
                </h4>
              )}
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </BlogLayout>
  );
};

export default BlogDetails;
