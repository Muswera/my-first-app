import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const summarizePrompt = fs.readFileSync(
   path.join(__dirname, 'prompts', 'summarize-reviews.txt'),
   'utf-8'
);
const openAIClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

type GenerateTextOptions = {
   model?: string;
   prompt: string;
   instructions?: string;
   temperature?: number;
   maxTokens?: number;
   previousResponseId?: string;
};

type GenerateTextResults = {
   id: string;
   text: string;
};

export const llmClient = {
   async generateText({
      model = 'gpt-4.1',
      prompt,
      instructions,
      temperature = 0.2,
      maxTokens: maxToxens = 300,
      previousResponseId,
   }: GenerateTextOptions): Promise<GenerateTextResults> {
      const response = await openAIClient.responses.create({
         model,
         input: prompt,
         instructions,
         temperature,
         max_output_tokens: maxToxens,
         previous_response_id: previousResponseId,
      });
      return {
         id: response.id,
         text: response.output_text || '',
      };
   },
   async summarizeReviews(reviews: string) {
      const chatCompletion = await inferenceClient.chatCompletion({
         model: 'meta-llama/Llama-3.1-8B-Instruct:novita',
         messages: [
            {
               role: 'system',
               content: summarizePrompt,
            },
            {
               role: 'user',
               content: reviews,
            },
         ],
      });
      return chatCompletion.choices[0]?.message.content || '';
   },
};
