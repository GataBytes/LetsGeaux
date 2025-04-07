const express = require('express');
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const wishlistRouter = express.Router();
const prisma = new PrismaClient();

wishlistRouter.get('/:userId', async (req:any, res:any) => {
  const { userId } = req.params;
  try {
    const wishListNumbers = await prisma.userOnsuggestion.findMany({
      where: {
        userId: +userId,
      },
      select: {
        suggestionId: true,
      }
    });
    const wishListEntries = wishListNumbers.map(async (number) => {
      const { suggestionId } = number
      console.log(suggestionId);
      const entry = await prisma.suggestion.findFirst({
        where: {id: suggestionId}
      });
      // console.log(entry)
      return entry;
    })
    const allEntries = Promise.all(wishListEntries).then((entries) => {
      res.status(200).send(entries);

    })
  } catch(err) {
    console.error('unable to retrieve wishlist', err);
    res.sendStatus(500);
  }
})

wishlistRouter.patch('/:suggestionId/:userId', async (req: any, res: any) => {
  try {

    const { suggestionId, userId } = req.params
    console.log('ids', suggestionId, userId);
    const findWish = await prisma.userOnsuggestion.findFirst({
      where: {
        userId: +userId,
        suggestionId: +suggestionId,
      },
      select: {id: true}

    })
    console.log(findWish)
    const killWish = await prisma.userOnsuggestion.delete({
      where: {
        id: findWish.id
      },
    })
    res.status(200).send('wish removed')
  } catch (err) {
    console.error('failed to remove list item', err);
    res.sendStatus(500);
  }
})

wishlistRouter.delete('/:userId', async (req:any, res:any) => {
  const { userId } = req.params;
  const killAllWishes = await prisma.userOnsuggestion.deleteMany({
    where: {
      userId: +userId
    }
  })
  .then(() => res.sendStatus(200))
  .catch((err) => {
    console.error('unable to delete wishlist', err);
    res.sendStatus(500);
  })
})

export default wishlistRouter;
