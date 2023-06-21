import BlogCard from '@/components/blogCard/BlogCard'
import classes from './page.module.css'


export async function fetchBlogs(){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`, {cache: 'no-store'})

  return res.json()
}

export default async function Home() {
  const blogs = await fetchBlogs()

  return (
   <div className={'flex flex-col justify-center items-center'}>
    {blogs?.length > 0 && <h2 className='text-5xl text-blue-950'>Sitios - Hopest</h2>}
     <div className={'grid sm:grid-cols-1 md:grid-cols-2 auto-cols-min justify-center items-center gap-6 mt-20'}>
      {blogs?.length > 0 
       ? blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog}/>
      )) : <h3 className={classes.noBlogs}>No blogs are currently in the</h3>}
     </div>
   </div>
  )
}