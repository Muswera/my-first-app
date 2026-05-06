import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service.ts';
import z from 'zod';

//implementation detail
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt too long,(max 1000 chracters)'),
   conversationId: z.uuid(),
});

//public interface
export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = chatSchema.safeParse(req.body);

      if (!parseResult.success) {
         const errorTree = z.treeifyError(parseResult.error);
         return res.status(400).json({
            message: 'Invalid request body',
            errors: errorTree,
         });
      }

      try {
         const { prompt, conversationId } = req.body;
         const response = await chatService.sendMessage(prompt, conversationId);
         res.json({ message: response.message });
      } catch (error) {
         res.status(500).json({ error: 'Failed to generate a response.' });
      }
   },
};
