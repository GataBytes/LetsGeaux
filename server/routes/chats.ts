import express, { Request, Response} from 'express';
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenAI({apiKey}); 
import { PromptKey, prompts, contextKeywords} from '../../types/prompt.ts';

const chatsRoute = express.Router()

//* Chat Context *//
const detectContext = (input: string): PromptKey => {
  let lowerCaseMessage = input.toLowerCase();
  // find match based of keywords   
  const detectedContext = (Object.keys(contextKeywords) as PromptKey[]).find((key) =>
  contextKeywords[key].some((keyword) => lowerCaseMessage.includes(keyword)) );
  return detectedContext || "default";
};


//* Create a New Session Id *//
chatsRoute.post('/new-session', (req: Request, res: Response) => {
  try {
    const sessionId: string = uuidv4();
    console.log('Session ID created for this chat:', sessionId) 
    res.json({ sessionId });
  } catch (error) {
      res.status(500).json({error: 'failed to create session ID'});
  }
});

//* Get User's Chat History *//
chatsRoute.get('/chat-history/:userId', async (req: Request, res: Response) => {
  const {userId} = req.params;

  try {
    const chatHistories = await prisma.chatHistory.findMany({
      // request handling manipulates type => convert to number
      where: {userId: Number(userId)}
    })
    // console.log(chatHistories[0].sessionId);
    res.json(chatHistories)
 
  } catch (error) {
      console.error(error);
      res.status(500).json({error: 'failed to fetch user chat history'})
  }
});

//* Get Messages from a Session *//
chatsRoute.get('/messages/:sessionId', async (req: Request, res, Response) => {
  const {sessionId} = req.params;

  try {
    const sessionMessages = await prisma.message.findMany({
      where: {sessionId: sessionId}
    })
    // console.log('found session messages', sessionMessages);
    res.json(sessionMessages)
    
  } catch (error) {
    console.error('server failed to find session messages', error);
    res.status(500).json({error: 'failed to fetch user history messages'})
  }
});


//* Gemini API Handling *//
chatsRoute.post('/', async (req: Request, res: Response ) => {
  const { userMessage, userId, sessionId} = req.body;
  // console.log(sessionId)
  // TODO fetch context
  const convoHistory = await prisma.chatHistory.upsert({
    where: { sessionId },
    update: { lastActive: new Date()},
    create: {
      sessionId,
      userId
    }
  })
  let messages = await prisma.message.findMany({
    where: { sessionId : sessionId },
    orderBy: { timeStamp: 'asc'},
  });
  // console.log(messages.length);
  // TODO context handling for replies and history
  // if (messages.length > )
  const context = detectContext(userMessage);
  const prompt = prompts[context] 
  
  try {
    const response = await genAI.models.generateContent({ // TODO type
      model: 'gemini-2.0-flash',
      contents: prompt, 

    });
  const responseParts = response.candidates[0].content.parts[0] // TODO type
  const aIReply: string  = responseParts?.text || 'no response from Gata';
  await prisma.message.create({ // ? idk how this is actively adding w/o a declaration
    data: {
      userId: userId,
      userMessage: userMessage,
      botResponse: aIReply,
      sessionId: sessionId
    }
  })
  // console.log('successful convo')
  res.json(aIReply);
  } catch (error) { // TODO make type
      console.error(error);
      res.status(500).json({ error: 'Server Error returning prompt.'});
  }
});

//* Name a Conversation *//
chatsRoute.patch('/chat-history/:sessionId', async (req: Request, res: Response) => {
  // Name a session/ change it's name
  const {sessionId} = req.params;
  console.log(sessionId, 'patch')
  // console.log(req.body)
  const {conversationName} = req.body
  try {
    const updateConvoName = await prisma.chatHistory.update({
      where: { sessionId },
      data: { conversationName }
    });
    console.log('Conversation name changed to:', conversationName)
    res.status(200).json(updateConvoName);
  } catch (error) {
    console.error('could not save/change conversation name', error);
    res.status(500).json({error: 'failed  to change/save conversation name'});
  }



});

//* Delete a Conversation *//
chatsRoute.delete('/:sessionId', async (req: Request, res: Response) => {
  const {sessionId} = req.params;
  // delete messages //
  const deleteMessages = prisma.message.deleteMany({
    where: {
      sessionId: sessionId
    }
  })
  // delete conversation //
  const deleteSession =  prisma.chatHistory.delete({
    where: {
      sessionId: sessionId
    }
  })
  // delete a session
  try {
     // delete conversation //
    // const deleteSession =  await prisma.chatHistory.delete({
    //   where: {
    //     sessionId: sessionId
    //   }
    // })
    const transaction = await prisma.$transaction([deleteMessages, deleteSession]);
    console.log('Session deleted');
    res.status(200).json('deleted');

  } catch (error) {
    console.error('Could not delete this conversation', error);
    res.status(500).json({error: 'failed to delete session'})
  }
});



export default chatsRoute;