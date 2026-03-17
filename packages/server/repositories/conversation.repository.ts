//Implementation detail
const converstions = new Map<string, string>();

export const conversationRespository = {
   getLastResponseId(conversationId: string) {
      return converstions.get(conversationId);
   },
   setLastResponseId(conversationId: string, responseId: string) {
      converstions.set(conversationId, responseId);
   },
};
