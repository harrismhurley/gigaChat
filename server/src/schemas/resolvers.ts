import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const messages: Array<{ id: string, content: string }> = [];

const resolvers = {
  Query: {
    messages: () => messages,
    message: (parent: any, { id }: { id: string }) => messages.find(message => message.id === id),
  },
  Mutation: {
    addMessage: (parent: any, { content }: { content: string }) => {
      const message = { id: `${messages.length + 1}`, content };
      messages.push(message);
      pubsub.publish('MESSAGE_ADDED', { messageAdded: message });
      return message;
    },
    updateMessage: (parent: any, { id, content }: { id: string, content: string }) => {
      const message = messages.find(message => message.id === id);
      if (!message) throw new Error('Message not found');
      message.content = content;
      pubsub.publish('MESSAGE_UPDATED', { messageUpdated: message });
      return message;
    },
    deleteMessage: (parent: any, { id }: { id: string }) => {
      const index = messages.findIndex(message => message.id === id);
      if (index === -1) throw new Error('Message not found');
      const [message] = messages.splice(index, 1);
      pubsub.publish('MESSAGE_DELETED', { messageDeleted: message });
      return message;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(['MESSAGE_ADDED']),
    },
    messageUpdated: {
      subscribe: () => pubsub.asyncIterator(['MESSAGE_UPDATED']),
    },
    messageDeleted: {
      subscribe: () => pubsub.asyncIterator(['MESSAGE_DELETED']),
    },
  },
};

export default resolvers;
