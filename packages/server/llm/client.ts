import OpenAI from "openai"; // Make sure to install the 'openai' package
import { chatCompletion, InferenceClient, summarization } from "@huggingface/inference";
import summarizePrompt from "../prompts/summarizer-reviews.txt"
import { Ollama } from "ollama";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

type GenerateResponse = {
  model?: string;
  prompt: string;
  temperature?: number;
  max_tokens?: number;
};

const llmClient = {
  async generateCompletion(options: GenerateResponse): Promise<string> {
    const response = await client.completions.create({
      model: options.model || "nex-agi/deepseek-v3.1-nex-n1:free",
      prompt: options.prompt,
      temperature: options.temperature || 0.2,
      max_tokens: options.max_tokens || 500,
    });

    return response?.choices?.[0]?.text || "";
  },

  async generateChatCompletion(options: GenerateResponse): Promise<string> {
    const response = await client.chat.completions.create({
      model: options.model || "nex-agi/deepseek-v3.1-nex-n1:free",
      messages: [
        {
          role: "user",
          content: options.prompt,
        },
      ],
      temperature: options.temperature || 0.2,
      max_tokens: options.max_tokens || 500,
    });
    return response?.choices?.[0]?.message?.content || "";
  },
};

const inferenceClient = new InferenceClient(process.env.HF_TOKEN)

const hfClient = {
  async summarization(text: string) {
    const response = await inferenceClient.chatCompletion({
      provider: "sambanova",
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "system",
          content: summarizePrompt
        },
        {
          content: text,
          role: "user",
        },
      ],
    });
    //return response.summary_text;
    return response.choices[0]?.message.content
  }
  
}
const ollamaClient = new Ollama()

const ollaClient = {
  async ollaReference(text:string) {
    const response = await ollamaClient.chat({
      model: 'tinyllama',
      messages: [
        {
          role: "system",
          content: summarizePrompt
        },
        {
          content: text,
          role: "user",
        },
      ]
    })

    console.log(response)

    return response.message.content
  }
}

export { llmClient, hfClient, ollaClient };
