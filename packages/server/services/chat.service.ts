import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { conversationRespository } from '../repositories/conversation.repository';

//implementation detail
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});
const template = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'chatbot.txt'),
   'utf-8'
);
const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);
const instructions = template.replace('{{parkInfo} }', parkInfo);
type ChatResponse = {
   id: string;
   message: string;
};
//public interface
//Leaky abstraction
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         instructions,
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 200,
         previous_response_id:
            conversationRespository.getLastResponseId(conversationId),
      });
      conversationRespository.setLastResponseId(conversationId, response.id);
      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
