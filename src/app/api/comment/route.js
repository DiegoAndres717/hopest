import prisma from '../../../libs/prismadb'
import {verifyJwtToken} from '../../../libs/jwt'

export async function POST(req) {
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
      const body = await req.json();
     
      let newComment = await prisma.comment.create({
        data: {
          text: body.text,
          author: {
            connect: { id: body.authorId },
          },
          blog: {
            connect: { id: body.blogId },
          },
        },
        include: {
          author: true,
        },
    });
    
      return new Response(JSON.stringify(newComment), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify(null), { status: 500 });
    }
  }
  