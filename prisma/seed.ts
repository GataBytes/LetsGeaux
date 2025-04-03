// import { PrismaClient } from '@prisma/client';
// import { suggestions } from './suggestions.ts';
// import dayjs from 'dayjs';
// const prisma = new PrismaClient()
// async function main() {
//  for (let suggestion of suggestions) {
//   await prisma.suggestion.create({
//     data: suggestion,
//   })
//  }
// }
//   main().then(async() => {
//     await prisma.$disconnect()
//   }).catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect()
//     process.exit(1)
//   })