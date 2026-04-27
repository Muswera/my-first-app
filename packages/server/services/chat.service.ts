import fs from 'fs';
import path from 'path';
import { conversationRespository } from '../repositories/conversation.repository';
import { llmClient } from '../llm/client';

const template = fs.readFileSync(
   path.join(__dirname, '..', 'llm', 'prompts', 'chatbot.txt'),
   'utf-8'
);
const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'llm', 'prompts', 'WonderWorld.md'),
   'utf-8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

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
      const response = await llmClient.generateText({
         model: 'gpt-4o-mini',
         instructions,
         prompt,
         temperature: 0.2,
         maxTokens: 200,
         previousResponseId:
            conversationRespository.getLastResponseId(conversationId),
      });
      conversationRespository.setLastResponseId(conversationId, response.id);
      return {
         id: response.id,
         message: response.text,
      };
   },
};
