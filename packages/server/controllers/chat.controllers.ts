import z from "zod";
import type { Request, Response } from "express";
import { chatService } from "../services/chat.services";

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long"),
  conversationId: z.uuid(),
});

export const chatController = {
  sendMessage: async (req: Request, res: Response) => {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json(parseResult.error.format());
      return;
    }
    const { prompt, conversationId } = req.body;

    try {
      let resp = await chatService.sendMessage(prompt, conversationId);
      return res.json(resp);
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while processing your request." });
    }
  },
};
