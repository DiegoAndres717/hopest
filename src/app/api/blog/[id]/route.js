
import { verifyJwtToken } from "@/libs/jwt";
import prisma from '@/libs/prismadb'
export async function GET(req, ctx) {
    const id = ctx.params.id;

    try {
      const blog = await prisma.blog.findUnique({
        where: { id },
        include: { author: true },
        
      });
    
      return new Response(JSON.stringify(blog), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify(null), { status: 500 });
    }
  }

export async function PUT(req, ctx) {
    const id = ctx.params.id;
    const accessToken = req.headers.get("authorization");
    const token = accessToken.split(" ")[1];
    const decodedToken = verifyJwtToken(token);
  
    if (!accessToken || !decodedToken) {
      return new Response(
        JSON.stringify({ error: "unauthorized (wrong or expired token)" }),
        { status: 403 }
      );
    }
    
    try {
      const body = await req.json();
      const blog = await prisma.blog.findUnique({
        where: { id },
        include: { author: true },
      });
      
      if (!blog) {
        throw new Error("Blog not found");
      }
     
      if (blog?.authorId !== decodedToken.id) {
        return new Response(
          JSON.stringify({ msg: "Only author can update his blog" }),
          { status: 403 }
        );
      }
   
      const updatedBlog = await prisma.blog.update({
        where: { id },
        data: { ...body },
      });
      
      return new Response(JSON.stringify(updatedBlog), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify(null), { status: 500 });
    }
  }  

  export async function DELETE(req, ctx) {
    const id = ctx.params.id;
    const accessToken = req.headers.get("authorization");
    const token = accessToken.split(" ")[1];
    const decodedToken = verifyJwtToken(token);
  
    if (!accessToken || !decodedToken) {
      return new Response(
        JSON.stringify({ error: "unauthorized (wrong or expired token)" }),
        { status: 403 }
      );
    }
  
    try {
      const blog = await prisma.blog.findUnique({
        where: { id },
        include: { author: true },
      });
  
      if (!blog) {
        throw new Error("Blog not found");
      }
      
      if (blog.authorId !== decodedToken.id.toString()) {
        return new Response(
          JSON.stringify({ msg: "Only author can delete his blog" }),
          { status: 403 }
        );
      }
  
      await prisma.blog.delete({
        where: { id },
      });
  
      return new Response(
        JSON.stringify({ msg: "Successfully deleted blog" }),
        { status: 200 }
      );
    } catch (error) {
      return new Response(JSON.stringify(null), { status: 500 });
    }
  }


// http://localhost:3000/api/blog/someid/like