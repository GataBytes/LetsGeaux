const express = require('express');
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const wishlistRouter = express.Router();
const prisma = new PrismaClient();

wishlistRouter.get('/:userId', async (req:any, res:any) => {
  const { userId } = req.params;
  try {
    const wishListItems = await prisma.userOnsuggestion.findMany({
      where: {userId: +userId,}
    });
    res.status(200).send(wishListItems)
  } catch(err) {
    console.error('unable to retrieve wishlist', err);
    res.sendStatus(500);
  }
})

export default wishlistRouter;
