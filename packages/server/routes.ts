import express from "express";
import type { Request, Response } from "express";
import { chatController } from "./controllers/chat.controllers";
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from "./generated/prisma/client";
import { reviewController } from "./controllers/review.controller";
//import { PrismaClient } from "./generated/prisma";

const router = express.Router();


const adapter = new PrismaMariaDb({
  host:"localhost",
  user: "root",
  password: "Dhiyaan@123",
  database: "review_summarizer",
  port: 3306,
  connectionLimit: 5
})

router.get("/", (req: Request, res: Response) => {
  res.send(process.env.OPENAI_API_KEY);
});

router.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});


router.get("/api/products/:id/reviews", reviewController.getReviews);

router.post("/api/products/:id/reviews/summarize", reviewController.reviewSummarize);

router.post("/api/chat", chatController.sendMessage);

export default router;

