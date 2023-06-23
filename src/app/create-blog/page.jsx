"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { redirectIfUnauthenticated, renderLoadingModal } from "@/helpers/helper";

const CreateBlog = () => {
  const CLOUD_NAME = "deumm0pp5";
  const UPLOAD_PRESET = "my_blog_project_webdisa";

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Nature");
  const [photos, setPhotos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { data: session, status } = useSession();
  
  const router = useRouter();

  const loadinModal = renderLoadingModal(status);
  if(loadinModal) return loadinModal

  if(redirectIfUnauthenticated(status, router)) return;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!photos.length || !title || !category || !desc) {
      toast.error("All fields are required");
      return;
    }
  
    try {
      const images = await uploadImage();
  
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blog`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "POST",
          body: JSON.stringify({
            title,
            desc,
            category,
            images,
            authorId: session?.user?.id,
          }),
        }
      );
  
      if (!res.ok) {
        throw new Error("Error occured");
      }
  
      const blog = await res.json();
  
      router.push(`${process.env.NEXT_PUBLIC_API_URL}/blog/${blog?.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  

  const uploadImage = async () => {
    if (!photos.length) return;
  
    const imageUrls = [];
  
    for (const photo of photos) {
      const formData = new FormData();
  
      formData.append("file", photo);
      formData.append("upload_preset", UPLOAD_PRESET);
  
      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
  
        const data = await res.json();
  
        const imageUrl = data["secure_url"];
  
        imageUrls.push(imageUrl);
      } catch (error) {
        console.log(error);
      }
    }
  
    return imageUrls;
  };
  

  return (
    <div className="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8 flex items-center justify-center bg-white p-12 border border-x-2">

        <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6">
            <div>
            <label
                placeholder="Title..."
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900"
            >
                Titulo del post
            </label>
            <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                placeholder="John"
                required
            />
            </div>
            
            <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900">
                Descripción
            </label>
            <textarea
                onChange={(e) => setDesc(e.target.value)}
                id="desc"
                rows="4"
                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Escribe una Descripción..."
                required
            ></textarea>
            
            <div>
            <label
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                Selecciona una categoria
            </label>
            <select
                id="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            >
                <option selected>-- Seleccionar --</option>
                <option value="Nature">Nature</option>
                <option value="Mountain">Mountain</option>
                <option value="Ocean">Ocean</option>
                <option value="Wildlife">Wildlife</option>
                <option value="Forest">Forest</option>
            </select>
            </div>
            <div>
            <label htmlFor="image">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                setPhotos(e.target.files);
                setSelectedFiles(Array.from(e.target.files));
              }}
            />
            <ul>
              {selectedFiles.map((file) => (
                <li key={file.name}>{file.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
            Crear Post
        </button>
        <ToastContainer />
        </form>
    </div>
  );
};

export default CreateBlog;
