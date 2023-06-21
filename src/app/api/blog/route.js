import prismadb from '../../../libs/prismadb'
import { verifyJwtToken } from '@/libs/jwt'


export async function GET(req) {
    try {
        const blogs = await prismadb.blog.findMany({
            include: {
                author: true
            }
        })
        
        return new Response(JSON.stringify(blogs), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify(null), { status: 500 })
    }
}
export async function POST(req) {
    const accessToken = req.headers.get("authorization")
    const token = accessToken.split(' ')[1]

    const decodedToken = verifyJwtToken(token)

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 })
    }

    try {
        const body = await req.json()
        
        const newBlog = await prismadb.blog.create({
            data: {
                title: body.title,
                desc: body.desc,
                images: body.images,
                category: body.category,
                authorId: body.authorId,
                likes: []
            }
        })
       
        return new Response(JSON.stringify(newBlog), { status: 201 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify(null), { status: 500 })
    }
}
