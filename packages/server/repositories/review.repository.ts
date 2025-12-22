import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, type Review } from "../generated/prisma";
import dayjs from "dayjs";

const adapter = new PrismaMariaDb({
  host: "localhost",
  user: "root",
  password: "Dhiyaan@123",
  database: "review_summarizer",
  port: 3306,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

const reviewsRepository = {
  getReviews: async (productId: number, limit?: number): Promise<Review[]> => {
    

    return await prisma.review.findMany({
      where: {
        productId: productId,
      },
      orderBy: {
        createdAt: "desc",
      },
        take: limit,
    });
  },

  storeReviewSummary: async (productId: number, summary: string) => {   
    const now = new Date()
    const expiresAt = dayjs().add(7, 'days').toDate()
    const data = {
      content: summary,
      genratedAt: now,
      expiresAt,
      productId
    }
    
    return prisma.summary.upsert({
      where: {productId},
      create: data,
      update: data
    })
  },

  getReviewSummary: async (productId: number): Promise<string | null> => {
    const summary =  await prisma.summary.findFirst({
      where: {
        AND: [
          {productId},
          {expiresAt: {gt : new Date()}}
        ] 
      }
    })

    return summary ? summary.content : null
  }
};


export { reviewsRepository };