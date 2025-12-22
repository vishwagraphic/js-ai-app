const conversations = new Map<string, string[]>();

function getConversation(conversationId: string) {
  return conversations.get(conversationId)?.length
    ? conversationId!
    : undefined!;
}

function setConversation(conversationId: string, responseId: string) {
  return conversations.set(conversationId, [
    ...(conversations.get(conversationId) || []),
    responseId,
  ]);
}

export const conversationRepository = {
  getConversation,
  setConversation,
};
