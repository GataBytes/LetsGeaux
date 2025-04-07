export type PromptKey = "default" | "restaurants" | "budget" | "sightSeeing"
// TODO MVP goal = 10 PromptKeys

export const prompts: Record<PromptKey, string> = {
  default: 'Do not greet.You are a helpful New Orleans travel agent. Give this tourist one piece of advice. If second message reply.',
  restaurants: 'Do not greet. Be brief. You are a helpful New Orleans travel agent. Give this tourist one restaurant suggestion',
  budget: 'Be brief. Do not greet. You are a helpful New Orleans travel agent. Give this tourist one free activity in teh city.',
  sightSeeing: 'Be brief. Do not greet. You are a helpful New Orleans travel agent. Give this tourist a scenic attraction.'
};

export const contextKeywords: Record<PromptKey, string[]> ={
  default: [],
  restaurants: ['food', 'eat', 'dining', 'restaurant', 'meal', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert'],
  budget: ['cheap', 'affordable', 'low-cost'],
  sightSeeing: ['attractions', 'sightSeeing']
};

