import express from 'express';
import { PrismaClient } from '@prisma/client';

const groupRoute = express.Router();
const prisma = new PrismaClient();

groupRoute.post('/', async (req, res) => {
  const { itinerary_id, activity_id } = req.body;

  if (!itinerary_id || !activity_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newGroup = await prisma.group.create({
      data: {
        itinerary_id,
        activity_id
      }
    });

    res.status(201).json(newGroup);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Error creating group', error });
  }
});

export default groupRoute;
