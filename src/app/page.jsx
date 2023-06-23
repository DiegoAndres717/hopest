"use client";
import BlogCard from "@/components/blogCard/BlogCard";
import classes from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    async function fetchBlog() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/`, {
        cache: "no-store",
      });
      const blog = await res.json();

      setBlogs(blog);
    }
    fetchBlog();
  }, []);
  
  return (
    <div className={"flex flex-col justify-center items-center"}>
      {blogs?.length > 0 && (
        <h2 className="text-3xl sm:text-5xl text-blue-950">Sitios - Hopest</h2>
      )}
      <div
        className={
          "grid sm:grid-cols-1 md:grid-cols-2 auto-cols-min justify-center items-center gap-6 mt-20"
        }
      >
        {blogs?.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        ) : (
          <h3 className={classes.noBlogs}>No blogs are currently in the</h3>
        )}
      </div>
    </div>
  );
}
