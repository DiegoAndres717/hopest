import prisma from "@/libs/prismadb";
import { verifyJwtToken } from "@/libs/jwt";


export async function GET(req, ctx) {
    const id = ctx.params.id;
  
    try {
      const comments = await prisma.comment.findMany({
        where: { blogId: id },
        include: { author: true },
      });
  
      return new Response(JSON.stringify(comments), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify(null), { status: 500 });
    }
  }
  
  export async function DELETE(req, ctx) {
    const id = ctx.params.id;
    const accessToken = req.headers.get('authorization');
    const token = accessToken.split(' ')[1];
    const decodedToken = verifyJwtToken(token);
  
    if (!accessToken || !decodedToken) {
      return new Response(
        JSON.stringify({ error: 'unauthorized (wrong or expired token)' }),
        { status: 403 }
      );
    }
    
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
        include: { author: true },
      });
  
      if (comment.authorId !== decodedToken.id) {
        return new Response(
          JSON.stringify({ msg: 'Only author can delete his blog' }),
          { status: 401 }
        );
      }
      
      await prisma.comment.delete({ where: { id } });
  
      return new Response(
        JSON.stringify({ msg: 'Successfully deleted comment' }),
        { status: 200 }
      );
    } catch (error) {
      return new Response(JSON.stringify(null), { status: 500 });
    }
  }
  