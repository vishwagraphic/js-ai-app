import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const port = process.env.NODE_ENV || 3005;

app.get("/", (req: Request, res: Response) => {
  res.send(process.env.OPENAI_API_KEY);
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.listen(port, () => {
  console.log(`Server is running on my ${port}`);
});
