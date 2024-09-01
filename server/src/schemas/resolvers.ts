import { PubSub } from 'graphql-subscriptions';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, verifyPassword, hashPassword } from '../utils/auth';

const pubsub = new PubSub();
const messages: Array<{ id: string, content: string }> = [];
const users: Array<{ id: string, email: string, password: string }> = [];

const resolvers = {
  Query: {
    messages: () => messages,
    message: (parent: any, { id }: { id: string }) => messages.find(message => message.id === id),
    users: () => users,
    user: (parent: any, { id }: { id: string }) => users.find(user => user.id === id),
  },
  Mutation: {
    signup: async (parent: any, { email, password }: { email: string, password: string }) => {
      // Check if the email is already in use
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        throw new Error('Email is already in use.');
      }

      const hashedPassword = await hashPassword(password);
      const user = { id: uuidv4(), email, password: hashedPassword };
      users.push(user);
      
      // Generate token for the new user
      const token = generateToken(user);
      
      return {
        token,
        user: { id: user.id, email: user.email }
      };
    },
    login: async (parent: any, { email, password }: { email: string, password: string }) => {
      const user = users.find(user => user.email === email);
      if (!user) throw new Error('User not found');
      
      console.log('Password before verification:', password); // Log password before verification
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) throw new Error('Invalid password');
      
      const token = generateToken(user);
      console.log('Token:', token); // Log token

      return {
        token,
        user: { id: user.id, email: user.email }
      };
    },

    addMessage: (parent: any, { content }: { content: string }) => {
      const message = { id: uuidv4(), content };
      messages.push(message);
      pubsub.publish('MESSAGE_ADDED', { messageAdded: message });
      console.log('MESSAGE_ADDED event published:', message);
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
