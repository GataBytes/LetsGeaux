import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const itineraryRoute = express.Router();

itineraryRoute.get('/', async (req: any, res: any )=>{
 
try{
  const itineraries = await prisma.itinerary.findMany({
   where: {creatorId : req.user.id}
  })
res.status(200).json(itineraries)
}catch(error){
res.status(500).json({error: 'Error fetching itinerary'})
}

})

itineraryRoute.post('/', async (req: any, res: any) =>{
  //const {id} = req.user
const {creatorId, member_id, name, notes, begin, end, upVotes, downVotes} = req.body
//console.log(req.user)
if (!name || !begin || !end) {
  return res.status(400).json({ error: "Missing required fields" });
}


try{
  const newItinerary = await prisma.itinerary.create({
data: {
creatorId, 
member_id, 
name, 
notes, 
begin: new Date(begin),
end: new Date(end),
upVotes: upVotes ?? 0,  
downVotes: downVotes ?? 0,

createdAt: new Date()
}

  })
res.status(201).json(newItinerary)
}catch(error){
res.status(500).json({error: 'Error creating itinerary'})
}

}) 

itineraryRoute.patch('/:id', async (req: any, res: any) => {
  const { id } = req.params;
  const { name, notes, begin, end, upVotes, downVotes } = req.body;

 

  try {
    const updateItinerary = await prisma.itinerary.update({
      where: { id: Number(id) },
      data: {
        name,
        notes,
        begin: new Date(begin),
        end: new Date(end),
        upVotes,
        downVotes,
      },
    });

    res.status(200).json(updateItinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({ error: 'Error updating itinerary' });
  }
});

  itineraryRoute.delete('/:id', async (req: any, res: any) =>{
  const {id } = req.params
  try{
    const deleteIntinerary = await prisma.itinerary.delete({
      where: {
        id: Number(id)
      }
    })
    console.log(deleteIntinerary)
  res.status(200).json({message: `Itinerary ${id} has been successfully deleted`, deleteIntinerary})
  }catch(error){
  res.status(500).json({error: 'Error deleting itinerary'})
  }
  
  }) 


export default itineraryRoute;