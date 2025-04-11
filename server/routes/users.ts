import express from 'express';
// import Users db model
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const usersRoute = express.Router()

// Example Requests
usersRoute.get('/', async (req: any, res:any) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json
({error: 'Error fetching users'})  }
}) 

/* route.post('/', (req: any, res:any) => {

}) */

/* route.patch]('/', (req: any, res:any) => {

}) */

/* route.delete]('/', (req: any, res:any) => {

}) */

usersRoute.patch('/:userId/profile-pic', async (req, res) => {
  try {
    const { userId } = req.params;
    const { profilePic } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: +userId },
      data: { profilePic },
    });

    res.status(200).json({ message: 'Profile picture updated', profilePic: updatedUser.profilePic });
  } catch (error) {
    console.error('Error saving profile pic:', error);
    res.status(500).json({ message: 'Failed to update profile pic' });
  }
});



// export the route for use in server/index.ts
export default  usersRoute;
