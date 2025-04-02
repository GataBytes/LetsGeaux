import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
const router = express.Router();
const prisma = new PrismaClient();

// Middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// Get budget info
// Retrieve user's budget and categories from DB
// get all budget categories and totals used in pie chart
// Get data for PieChart categories + spent totals
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.budget.findMany({
      select: {
        id: true,
        category: true,
        spent: true
      }
    });

    // Prisma returns Decimal for spent.. convert to number
    const parsed = categories.map((item) => ({
      id: item.id,
      category: item.category,
      spent: Number(item.spent || 0),
    }));

    res.json(parsed);
  } catch (error) {
    console.error('Error fetching budget categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});



// Create a new budget entry
// Initialize budget with total amount and currency
router.post('/', async (req: Request, res: Response) => {
  const { limit, spent, notes, category, groupItinerary_id } = req.body;

  if (isNaN(limit)) {
    return res.status(400).json({ message: 'Invalid limit value' });
  }

  try {
    const budget = await prisma.budget.create({
      data: {
        limit: Number(limit),
        category: category || 'Uncategorized',
        notes: notes || '',
        spent, // default to 0
        groupItinerary_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error('Error CREATING budget:', error);
    res.status(500).json({ message: 'Error CREATING budget', error });
  }
});


// Add category to budget
// Update budget details
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { category, limit, notes, spent } = req.body;

  try {
    const budget = await prisma.budget.update({
      where: { id: parseInt(id) },
      data: {
        category,
        limit,
        notes,
        spent: Number(spent),
        updatedAt: new Date()
      },
    });

    res.status(200).json(budget);
  } catch (error) {
    console.error('Error UPDATING budget:', error);
    res.status(500).json({ message: 'Error UPDATING budget', error });
  }
});

// // Update category details
// // Update specific category details (like spent or allocated)
// router.put('/category/:id', isLoggedIn, async (req, res) => {
// });


// Remove a budget entry
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.budget.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Budget entry deleted SUCCESSfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error DELETING budget', error });
  }
});

export default router;
