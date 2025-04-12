const express = require('express')
import { PrismaClient } from '@prisma/client';

const commentsRouter = express.Router();
const prisma = new PrismaClient;


// GET: called when the 'make a comment' section is clicked. Pulls all comments that share a comment id
// (or post id, for the original thread) with the thread. shows top to bottom chrono.
// Will most of the time be called from post component, but should be passed down to comment component.

commentsRouter.get(/*Id from the post*/'/:id', async (req: any, res: any) => {
  const { id } = req.params;
  try {

    const allComments = await prisma.comment.findMany({
      where: {
        postId: id,
      }
    })
    res.status(200).send(allComments/**I think I can sort them by time in here.. */)
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  })

// POST: Comment must connect to the Post or comment[so these need a postId&&commentId]
// Also must connect with the user that sent the comment

commentsRouter.post('/', async (req: any, res: any) => {
try {

  const newComment = await prisma.comment.create(req.body)
  res.status(201).send('posted!');
} catch (err) {
  console.error('unable to post comment', err);
  res.sendStatus(500);
}
})
// DELETE will destroy a singular comment from the database. BOTH the user that made the post
// and the user that wrote the post have delete access.




export default commentsRouter;