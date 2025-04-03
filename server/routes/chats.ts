import express, { Request, Response} from 'express';
import { GoogleGenAI } from "@google/genai";
import axios from 'axios'


import { PromptKey, prompts} from '../../types/prompt.ts';


const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenAI({apiKey});

const chatsRoute = express.Router()

chatsRoute.post('/', async (req: Request, res: Response ) => {
  const prompt = prompts.default
  const userMessage = req.body.message;


  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,

    });
  
res.json(response.candidates[0].content.parts[0].text);
  } catch (error) { // TODO make type
    console.error(error);
    res.status(500).json({ error: 'Server Error returning prompt.'});
  }
})

export default chatsRoute;