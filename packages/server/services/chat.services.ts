//import {GoogleGenAI} from "@google/genai";
import path from "path";
import fs from "fs";
import template from "../prompts/chatbot.txt";
import { llmClient } from "../llm/client";

// const client = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY || "",

// });

const parkInfo = fs.readFileSync(
  path.join(__dirname, "..", "prompts", "Wonderworld.md"),
  "utf-8",
);
const today = new Date().toDateString();
template.replace("{{TODAYS_DATE}}", today);
const instructions = template.replace("{{PARK_INFO}}", parkInfo);

const history: any[] = [];
export const chatService = {
  sendMessage: async (prompt: string, conversationId: string) => {
    history.push({
      role: "user",
      prompt,
    });

    const response = await llmClient.generateChatCompletion({
      prompt: [
        instructions,
        ...history.map((h) =>
          typeof h === "string" ? h : h.parts?.[0]?.text || "",
        ),
        prompt,
      ].join("\n"),
    });
    // const response = await client.completions.create({
    //     model: "nex-agi/deepseek-v3.1-nex-n1:free",
    //     prompt: [
    //         instructions,
    //         ...history.map(h => (typeof h === "string" ? h : h.parts?.[0]?.text || "")),
    //         prompt
    //     ].join("\n"),
    //     temperature: 0.2,
    //     max_tokens: 500,
    // });

    history.push({
      role: "model",
      prompt: response,
    });
    return { message: response, id: conversationId };
    // const response = await client.models.generateContent({
    //     model:"google/gemini-2.0-flash-exp:free",
    //     contents: history as any[],
    //     config: {
    //         temperature: 0.2,
    //         maxOutputTokens: 500,
    //     }
    // });

    // history.push({
    //     role: "model",
    //     parts: [{ text: response.text }]
    // });

    // console.log("Gemini Response:", response);

    //conversationRepository.setConversation(conversationId, response.id);
    //return {message: response.output_text, id: response.id}
  },
};
