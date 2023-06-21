import React from 'react'
import {useSession} from 'next-auth/react'
import {format} from 'timeago.js'
import {BsTrash} from 'react-icons/bs'
import classes from './Comment.module.css'
import Image from 'next/image'

const Comment = ({comment, setComments}) => {
  const {data: session} = useSession()
  const token = session?.user?.accessToken
  
  const handleDeleteComment = async() => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_COMMENT_URL}/api/comment/${comment?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: "DELETE"
      })

      setComments(prev => {
        return [...prev].filter((c) => c?.id !== comment?.id)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
             <Image src={comment?.author?.image || '/../public/login.webp'} width='45' height='45' alt="" />
             <div className={classes.userData}>
               <h4>{comment?.author?.name}</h4>
               <span className={classes.timeago}>{format(comment?.createdAt)}</span>
             </div>
             <span>{comment?.text}</span>
        </div>
        <div className={classes.right}>
           {session?.user?.id === comment?.author?.id && (
             <BsTrash className={classes.trashIcon}  onClick={handleDeleteComment} />
           )}
        </div>
      </div>
    </div>
  )
}

export default Comment