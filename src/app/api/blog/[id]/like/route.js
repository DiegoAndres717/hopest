import prisma from "@/libs/prismadb";
import { verifyJwtToken } from "@/libs/jwt";

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
      const blog = await prisma.blog.findUnique({
          where: { id },
        });
        
        
    if (!blog) {
      throw new Error("Blog not found");
    }

    let updatedLikes;
    if (blog.likes.includes(decodedToken.id)) {
      updatedLikes = blog.likes.filter(
        (id) => id.toString() !== decodedToken.id.toString()
      );
    } else {
      updatedLikes = [...blog.likes, decodedToken.id];
    }
   
    await prisma.blog.update({
      where: { id },
      data: { likes: updatedLikes },
    });

    return new Response(
      JSON.stringify({ msg: "Successfully interacted with the blog" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 200 });
  }
}
