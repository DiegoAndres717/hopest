"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import classes from "./blog.module.css";
import { BsFillPencilFill } from "react-icons/bs";
import { AiFillDelete, AiFillLike, AiOutlineLike } from "react-icons/ai";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "timeago.js";
import { useRouter } from "next/navigation";
import Comment from "@/components/comment/Comment";
import person from "../../../../public/person.jpeg";
import BlogLayout from "../layout";
import LoadingModal from "@/app/components/modals/LoadingModal";

const BlogDetails = (ctx) => {
  const [blogDetails, setBlogDetails] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const router = useRouter();

  useEffect(() => {
    async function fetchComments() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_COMMENT_URL}/api/comment/${ctx.params.id}`,
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
        `${process.env.NEXT_PUBLIC_API_BLOG_URL}/api/blog/${ctx.params.id}`,
        { cache: "no-store" }
      );
      const blog = await res.json();

      setBlogDetails(blog);
      setIsLiked(blog?.likes?.includes(session?.user?._id));
      setBlogLikes(blog?.likes?.length || 0);
      setIsLoading(false);
    }
    session && fetchBlog();
  }, [ctx.params.id, session]);

  
  if (status === "unauthenticated") {
    router.push("/");
    return;
  }

  if (status === "loading") {
    return <LoadingModal />;
  }

  const handleDelete = async () => {
    try {
      const confirmModal = confirm(
        "Are you sure you want to delete your blog?"
      );

      if (confirmModal) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BLOG_URL}/api/blog/${ctx.params.id}`,
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
        `${process.env.NEXT_PUBLIC_API_BLOG_URL}/api/blog/${ctx.params.id}/like`,
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
        authorId: session?.user?._id,
        text: commentText,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_COMMENT_URL}/api/comment`,
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

  return (
    <BlogLayout>
      <div className="flex flex-col justify-center items-center">
        {isLoading ? (
          <LoadingModal />
        ) : (
          <div className="card max-w-xl bg-base-100 shadow-xl mt-6">
            <figure>
              <Link href={`/blog/${ctx.params.id}`}>
                <Image
                  className="rounded-t-lg "
                  src={blogDetails?.imageUrl}
                  width={750}
                  height={650}
                  alt={blogDetails?.title}
                />
              </Link>
            </figure>

            <div className="card-body">
              <div className="flex justify-between">
                <h2 className="card-title">
                  {blogDetails?.title}
                  <div className="badge badge-secondary">NEW</div>
                </h2>
                {session?.user?._id && (
                  <div className={"flex justify-end items-end gap-x-2"}>
                    <Link
                      className={classes.editButton}
                      href={`/blog/edit/${ctx.params.id}`}
                    >
                      Edit <BsFillPencilFill />
                    </Link>
                    <button
                      onClick={handleDelete}
                      className={classes.deleteButton}
                    >
                      Delete
                      <AiFillDelete />
                    </button>
                  </div>
                )}
              </div>
              <div className="card-actions justify-between mt-2">
                <div className={classes.category}>
                  Category:
                  <span>{blogDetails?.category}</span>
                </div>
                {session?.user._id && (
                  <div className="flex">
                    {blogLikes}{" "}
                    {isLiked ? (
                      <AiFillLike
                        className="ml-2 cursor-pointer"
                        onClick={handleLike}
                        size={25}
                      />
                    ) : (
                      <AiOutlineLike
                        className="cursor-pointer"
                        onClick={handleLike}
                        size={25}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4">
                <p>{blogDetails?.desc}</p>
                <span>
                  Posted: <span>{format(blogDetails?.createdAt)}</span>
                </span>
              </div>

              {blogDetails?.authorId?._id.toString() ===
              session?.user?._id.toString() ? (
                ""
              ) : (
                <div className={classes.author}>
                  Author: <span>{blogDetails?.authorId?.username}</span>
                </div>
              )}
            </div>
          </div>
        )}
        {isLoading ? (
          <LoadingModal />
        ) : (
          <div
            className={
              "mx-auto mt-24 w-1/2 flex flex-col items-center justify-center border border-gray-700 rounded-xl"
            }
          >
            <div
              className={
                "p-4 w-full flex items-center gap-6 border-b border-gray-500"
              }
            >
              <Image
                className="object-cover rounded-full"
                src={person}
                width="45"
                height="45"
                alt=""
              />
              <input
                value={commentText}
                className="flex-1 outline-none border-none py-1 border-b border-gray-700"
                type="text"
                placeholder="Type message..."
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                disabled={!session?.user?._id ? true : false}
                className={
                  !session?.user?._id
                    ? "outline-none border-none bg-gray-800 text-white py-1 px-3 rounded-md text-lg cursor-not-allowed"
                    : "outline-none border-none bg-blue-800 text-white py-1 px-3 rounded-md text-lg cursor-pointer"
                }
                onClick={handleComment}
              >
                Post
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
                    key={comment._id}
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
        )}
        <ToastContainer />
      </div>
    </BlogLayout>
  );
};

export default BlogDetails;
