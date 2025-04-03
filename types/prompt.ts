export type PromptKey = "default" | "restaurants" | "budget"

export const prompts: Record<PromptKey, string> = {
  default: 'You are a helpful New Orleans travel agent. Give this tourist a couple of sentences of advice',
  restaurants: 'You are a helpful New Orleans travel agent. Give this tourist restaurant advice',
  budget: 'You are a helpful New Orleans travel agent. Give this tourist restaurant advice'
};