const express = require('express');
import { PrismaClient } from '@prisma/client';

const postsRouter = express.Router();
const prisma = new PrismaClient;

// GET: called when a user enters, adds, or takes away from the feed. 
// Get calls ALL posts in reverse chrono order.. maybe top 10/20?

postsRouter.get('/', async (req:any, res:any) => {
try {
  const allPosts = await prisma.post.findMany();
  res.status(200).send(allPosts);
} catch (err){
  console.error('unable to get posts', err);
  res.sendStatus(500);
}
})

// POST must connect to the user(params). Happens when a form is submitted. Must add createdAt tag
postsRouter.post('/', async (req:any, res:any) => {
  try {
    const newPost = await prisma.post.create(req.body);
    res.status(201).send('posted successfully');
  } catch (err) {
    console.error('unable to post', err);
    res.sendStatus(500);
  }
});




// DELETE Will take out a post and all its connected comments. Only the user that posted the post can remove it.
postsRouter.delete('/:id/:userId', async (req: any, res: any) => {
  const { id, userId } = req.params;
  try {
    const credentials = await prisma.post.findFirst({
      where: {
        id: +id,
        userId: +userId,
      }
    })
    if (credentials) {
      // console.log('in between postId', postId)
      // const id = +postId
      const killPost = await prisma.post.delete({
        where: {
          id: +id
        }
      })
      res.status(200).send('delete successful');
    } else {
      res.status(403).send('You cannot delete this post');
    }
  } catch (err) {console.error('unable to delete', err);}
});


export default postsRouter;