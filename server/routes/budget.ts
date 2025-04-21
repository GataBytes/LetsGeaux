import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
const router = express.Router();
const prisma = new PrismaClient();

// Middleware to ensure user is logged in
function isLoggedIn(req: any, res: Response, next: Function) {
  if (!req.user || !req.user.id) {
    return res.sendStatus(401);
  }
  next();
}

// Get budget info
// Retrieve user's budget and categories from DB
// get all budget categories and totals used in pie chart
// Get data for PieChart categories + spent totals
router.get('/categories', async (req: Request, res: Response) => {
  const itineraryId = req.query.itineraryId;

  try {
    const whereClause = itineraryId
      ? { partyId: Number(itineraryId) }
      : {};

    const categories = await prisma.budget.findMany({
      where: whereClause,
      select: {
        id: true,
        category: true,
        spent: true,
        limit: true,
        notes: true
      }
    });

    const parsed = categories.map((item) => ({
      id: item.id,
      category: item.category,
      spent: Number(item.spent || 0),
      limit: Number(item.limit || 0),
      notes: item.notes
    }));

    res.json(parsed);
  } catch (error) {
    console.error('Error fetching budget categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

// GET all budget entries for BudgetOverview LinearProgress UI
router.get('/', async (req: Request, res: Response) => {
  const itineraryId = req.query.itineraryId;

  try {
    const whereClause = itineraryId
      ? { partyId: Number(itineraryId) }
      : {};

    const budgets = await prisma.budget.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' }
    });

    const parsed = budgets.map((b) => ({
      ...b,
      spent: Number(b.spent),
      limit: Number(b.limit),
    }));

    res.json(parsed);
  } catch (error) {
    console.error('Error FETCHING budgets:', error);
    res.status(500).json({ message: 'Error retrieving budgets', error });
  }
});

// GET all budgets for a specific itinerary
router.get('/itinerary/:id', async (req: Request, res: Response) => {
  const partyId = parseInt(req.params.id);

  try {
    const budgets = await prisma.budget.findMany({
      where: {
        partyId: partyId,
      },
      orderBy: { updatedAt: 'desc' }
    });

    const parsed = budgets.map((b) => ({
      ...b,
      spent: Number(b.spent),
      limit: Number(b.limit),
    }));

    res.status(200).json(parsed);
  } catch (error) {
    console.error('Error fetching budgets by itinerary:', error);
    res.status(500).json({ message: 'Error fetching budgets by itinerary', error });
  }
});


// Create a new budget entry
// Initialize budget with total amount and currency
router.post('/', async (req: Request, res: Response) => {
  const { limit, spent, notes, category, partyId } = req.body;

  if (isNaN(limit)) {
    return res.status(400).json({ message: 'Invalid limit value' });
  }

  try {
    const budget = await prisma.budget.create({
      data: {
        limit: Number(limit),
        category: category || 'Uncategorized',
        notes: notes || '',
        spent: spent !== undefined ? Number(spent) : 0,
        partyId: null,
//partyId: partyId ? Number(partyId) : null
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
